# Design QA — Goal controls

- Source: `/var/folders/p4/g15z7_8530969m0m999l2bth0000gn/T/codex-clipboard-0d49ba40-f430-415a-9945-117c51717c44.png`
- Implementation screenshot: `/private/tmp/life-tracker-goals-impl.png`
- Tested viewport: 956 × 700 and 390 × 844
- State: Goals tab with multiple goal pills, custom tag controls, and an assigned tag filter

## Comparison history

1. The reference showed the circular delete controls crossing the top boundary of the horizontal goal scroller, clipping their upper edge.
2. The implementation adds a 12px safe area above the pills and keeps each 22px delete control fully inside the scroller bounds. DOM geometry checks confirmed the first four controls were fully visible at desktop and mobile widths.
3. Custom tags were created, assigned to a goal, filtered, and sorted through the visible UI. The tag filter returned only the assigned goal.
4. Follow-up: moved tag controls above the horizontal goal list, reduced chip/card spacing, and replaced the indirect “Manage tags” action with a persistent “+ Add tag” control. Its compact inline form exposes manual tag entry without leaving the Goals header.
5. Alignment follow-up: shortened the panel title to “Tags” and removed its nested horizontal margin so the border aligns with the page's 20px content inset.
6. Pipeline controls follow-up: compared the current production pipeline (`/private/tmp/life-tracker-before-reorder-pipeline.png`) with the updated pipeline (`/private/tmp/life-tracker-after-reorder-pipeline.png`) at the same app width. Compact actions now have 34px minimum touch targets and larger labels.
7. Timeline expansion now uses a neutral `◷` timeline symbol with no embedded date, visually distinct from the hierarchy chevrons used to expand or collapse subtasks and consistent across platforms.
8. Reordering was verified through the drag handle's keyboard-equivalent interaction: the first two subtasks swapped positions, and the new order remained after reload. The same move engine powers mouse and touch dragging.

## Final check

- Delete icon: fully visible, centered, and tappable.
- Horizontal scrolling: retained.
- Goal tag management: create, rename, delete, assign, unassign.
- Compact tag panel: placed above the goal list; manual entry verified visible and enabled.
- Goal organization: filter by tag; sort by custom order, name, progress, or deadline.
- Persistence: goal tags, selected filter, and sort mode use local storage and the existing Supabase sync pipeline.
- Subtask ordering: mouse drag, touch drag, and arrow-key reordering persist the nested goal tree.
- Local QA safety: Supabase synchronization is disabled only on localhost, preventing test reorders from reaching production data.

final result: passed
