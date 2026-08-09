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

## Final check

- Delete icon: fully visible, centered, and tappable.
- Horizontal scrolling: retained.
- Goal tag management: create, rename, delete, assign, unassign.
- Compact tag panel: placed above the goal list; manual entry verified visible and enabled.
- Goal organization: filter by tag; sort by custom order, name, progress, or deadline.
- Persistence: goal tags, selected filter, and sort mode use local storage and the existing Supabase sync pipeline.

final result: passed
