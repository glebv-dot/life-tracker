const MAX_INPUT = 3000;

function clean(value, max = 800) {
  return String(value || "").trim().slice(0, max);
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  if (!process.env.ANTHROPIC_API_KEY) return res.status(503).json({ error: "AI planner is not configured" });

  const input = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
  const context = {
    title: clean(input.title, 300),
    done: clean(input.done),
    situation: clean(input.situation),
    constraints: clean(input.constraints),
    deadline: clean(input.deadline, 20),
    hours: Math.max(1, Math.min(80, Number(input.hours) || 5)),
  };
  if (!context.title || !context.done) return res.status(400).json({ error: "Goal and definition of done are required" });
  if (JSON.stringify(context).length > MAX_INPUT) return res.status(400).json({ error: "Goal context is too long" });

  const system = `You are a rigorous goal-decomposition planner. Turn the user's goal into a practical dependency-ordered tree for a personal execution app.

Rules:
1. Use 3-7 outcome-oriented milestones in the order they should happen.
2. Give each milestone 2-5 children. Use a third level only when genuinely necessary; never exceed 3 levels below the goal.
3. Every leaf must be a concrete action one person can complete in one focused session, normally 15-90 minutes.
4. Start task names with a precise verb and include the tangible output or completion test. Avoid vague verbs such as "work on", "handle", "improve", "consider", or "research" without a named question/output.
5. Treat missing knowledge as an explicit discovery/decision task. Do not invent facts, resources, approvals, dates, budgets, or commitments.
6. Respect the stated starting point, constraints, deadline, and weekly capacity. Prefer the smallest sufficient plan; omit motivational filler and recurring habits.
7. Include validation, testing, or completion checks where the goal needs them. Do not duplicate tasks.
8. Return only valid JSON with this exact shape:
{"title":"concise goal title","overview":"one-sentence definition of done","children":[{"name":"milestone","children":[{"name":"action","children":[]}]}]}

The user will review and edit the tree before saving it.`;
  const prompt = `GOAL: ${context.title}\nDEFINITION OF DONE: ${context.done}\nCURRENT SITUATION / RESOURCES: ${context.situation || "Not specified"}\nCONSTRAINTS / PREFERENCES: ${context.constraints || "Not specified"}\nDEADLINE: ${context.deadline || "No fixed deadline"}\nAVAILABLE TIME: ${context.hours} hours per week`;

  try {
    const apiRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({ model: "claude-haiku-4-5-20251001", max_tokens: 1800, temperature: 0.2, system, messages: [{ role: "user", content: prompt }] }),
    });
    const data = await apiRes.json();
    if (!apiRes.ok) return res.status(apiRes.status).json({ error: data?.error?.message || "AI planner request failed" });
    const text = data.content?.find(part => part.type === "text")?.text || "";
    const parsed = JSON.parse(text.replace(/^```(?:json)?\s*|\s*```$/g, "").trim());
    if (!parsed || !Array.isArray(parsed.children)) throw new Error("Invalid planner response");
    return res.status(200).json(parsed);
  } catch (error) {
    return res.status(502).json({ error: error.message || "Could not create the goal breakdown" });
  }
}
