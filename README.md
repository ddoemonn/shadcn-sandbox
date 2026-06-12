# shadcn-sandbox

Interactive playground components for shadcn/ui — embedded editors, live previews, file trees, consoles, and error overlays.

## Develop

```bash
bun install
bun dev
```

Open [http://localhost:3000](http://localhost:3000).

## Pages

- `/` — landing + hero IDE preview
- `/playground` — full interactive sandbox
- `/components` — component docs with live demos

## Install a component

```bash
npx shadcn@latest add https://shadcn-sandbox.dev/r/code-editor.json
```

Replace `code-editor` with any registry item (`preview-frame`, `file-tree`, `console-panel`, etc.).

## Scripts

| Command             | Description         |
| ------------------- | ------------------- |
| `bun dev`           | Start dev server    |
| `bun run build`     | Production build    |
| `bun run check`     | Biome lint + format |
| `bun run typecheck` | TypeScript check    |
