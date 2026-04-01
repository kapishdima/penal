<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Architecture Rules

## 1. Logic / UI Separation

Components are **only** for rendering. Business logic, state manipulation, and side effects live in hooks or utility functions.

**Bad** — logic inline in a component:
```tsx
function MyComponent() {
  const [widgets, setWidgets] = useAtom(widgetsAtom)
  const onClick = () => {
    setWidgets(prev => [...prev, createWidget()])  // logic in component
  }
  return <button onClick={onClick}>Add</button>
}
```

**Good** — logic extracted to a hook:
```tsx
function MyComponent() {
  const addWidget = useAddWidget()
  return <button onClick={addWidget}>Add</button>
}
```

## 2. Layered Abstractions

Code is organized in three layers. Each layer only depends on the layer below it.

### Primitives (`lib/`, `stores/`)
- Pure utility functions (`lib/snap.ts`, `lib/event.ts`)
- Jotai atoms — raw state definitions, no logic (`stores/canvas.ts`)
- No imports from `features/` or `components/`

### Hooks (`features/*/hooks/`, `hooks/`)
- Compose primitives into reusable behaviors
- Hooks interact with atoms and call utility functions
- No JSX, no rendering
- When logic appears in 2+ hooks — extract to `lib/`

### Components (`features/*/components/`, `app/`)
- Only rendering and composing hooks
- No direct atom manipulation — use hooks instead
- Static config (e.g. resize handle positions) goes to a separate config file, not inline in the component

## 3. No Duplication of Logic

If the same calculation exists in two places, extract it to `lib/`.

Example: snap-to-grid rounding must live in one place (`lib/snap.ts`), not be reimplemented per hook.

## 4. DOM Side Effects Through State

Avoid direct DOM manipulation (`document.body.style.cursor = ...`). Instead, drive DOM through React state or atoms, and let components render accordingly.

## 5. Event Listeners

Use `useEventListener` hook (`hooks/use-event-listener.ts`) for all `window` event subscriptions. Do not write manual `addEventListener`/`removeEventListener` in `useEffect`.

## 6. Feature Folder Structure

Each feature is self-contained:
```
features/<name>/
  components/   — React components (UI only)
  hooks/        — Feature-specific hooks (logic)
  config.ts     — Static configuration, constants
```

Shared utilities go to `lib/`. Shared hooks go to `hooks/`. Shared atoms go to `stores/`.
