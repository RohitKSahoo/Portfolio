# Student Developer Diorama

A miniature pixel-art diorama built in Three.js following the [sloemo01/diorama](https://github.com/sloemo01/diorama) playbook.

## The Scene
A student developer in his bedroom workshop frantically builds, refactors, and deploys full-stack software using **Gemini**, **Claude**, and **ChatGPT** across a triple-monitor battle station, surviving a delivery disruption until the automated build turns green and triggers a celebratory stretch.

## Five Staged Beats (42-Second Loop)
1. **0.0s – 8.5s | Morning Boot & Prompting**: Workstation wakes; three displays illuminate with **Gemini** (deep blue/indigo), **Claude** (warm coral/terracotta), and **ChatGPT** (mint emerald). Dev types prompts.
2. **8.5s – 18.0s | Parallel AI Synthesis**: Claude streams syntax into the terminal, Gemini models data structures, ChatGPT compiles documentation and tests. Server rack LEDs flicker furiously.
3. **18.0s – 26.5s | The Disruption & Delivery**: Bedroom door swings open; courier roommate enters with a hot takeaway pizza box and beverage, sets them on the side credenza, and waves. Dev acknowledges with a nod.
4. **26.5s – 34.0s | Build & Green Test Pass**: Dev hammers Enter for deployment; build progress meter fills to 100%, status flashes green (`ALL 42 TESTS PASSED`), and dev throws arms up in an ergonomic victory chair stretch!
5. **34.0s – 42.0s | Celebration, Sip & Quiet Loop Seam**: Dev sips coffee, relaxing posture; orange tabby cat curls back to sleep on the bed; scene seamlessly loops.

## Systems & Machines
- **Triple-Monitor Battle Station**: Left display (Gemini architecture), center display (Claude terminal), right display (ChatGPT test checklist) on dual gas-spring arms, custom mechanical keyboard with colored keycaps, mouse, desk mat, and rubber duck debugger.
- **Server Rack & CI/CD Tower**: 4U server enclosure with 18 blinking status LEDs, cooling fans, and RGB CI/CD build progress bar that transitions from amber to green.
- **Espresso Bar & Side Credenza**: Stainless steel espresso machine with rising steam particles, ceramic mugs, and hot pizza delivery box.
- **Living Space & Lo-Fi Cat**: Corner platform bed with folded navy duvet, bookshelf with multi-colored books, and an orange tabby cat whose tail swishes and lifts its head when the door opens.

## Files
- `index.html`: WebGL diorama with pixel post-processing.
- `student-dev-diorama.html`: Standalone, zero-dependency HTML file with inlined code.
- `src/`: Modular ES source code (`config.js`, `core/`, `scene/`).
- `DESIGN.md`: The design specification.
- `refs/SOURCES.md`: The research log.
- `CREDITS.md`: Licence and asset attribution.

## Controls & Debug Interface
- **Space**: Freeze / unfreeze the loop.
- **URL Query**: `?t=30.5` freezes directly at 30.5s (victory stretch beat).
- **Console API**: `window.__diorama.freeze(t)`, `window.__diorama.unfreeze()`, `window.__diorama.view(pos, tgt)`.
