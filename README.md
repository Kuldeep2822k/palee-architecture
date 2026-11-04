# PALEE Architecture & Deep System Documentation

This repository contains the comprehensive architectural reference, mathematical specifications, engine internals, and storage contracts for **PALEE** (Personal Active Learning & Evaluation Engine).

Built and published with [VitePress](https://vitepress.dev/) to GitHub Pages at:
**[https://kuldeep2822k.github.io/palee-architecture/](https://kuldeep2822k.github.io/palee-architecture/)**

## Related Sites & Repositories
- **User Documentation Site**: [https://kuldeep2822k.github.io/cli/](https://kuldeep2822k.github.io/cli/)
- **Main CLI Codebase**: [https://github.com/Kuldeep2822k/cli](https://github.com/Kuldeep2822k/cli)
- **NPM Package**: [`@kuldeep2822k/palee`](https://www.npmjs.com/package/@kuldeep2822k/palee)

## Development

```bash
# Install dependencies
npm install

# Start local development server
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview
```

## Structure

- `Architecture Overview/`: Layered architecture, security boundaries, and data flow.
- `Core Engine/`: SM-2 algorithm, prerequisite graph engine, and mastery calculation.
- `Storage System/`: Frontmatter parser, atomic file writes, locking, and memory.
- `Application Layer/`: Due and next topic discovery, review and assessment workflows.
- `Validation Framework/`: Single-pass snapshot collector, rule catalog, and repair planner.
- `Command Reference/`: CLI arguments, options, error codes, and automation patterns.
- `Data Models and Types/`: Domain schemas, session lifecycles, and configuration types.
- `Architecture Decision Records/`: Thematic synthesis of architectural decision records.
- `User Guide/`: Detailed operational guides for reviews, adoption, and sessions.
- `Getting Started.md`, `Testing Guide.md`, `Development Workflow.md`, `AI Integration (Phase 2).md`.

## License
MIT © Kuldeep Kumar
