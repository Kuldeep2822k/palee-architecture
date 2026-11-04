---
layout: home

hero:
  name: "PALEE Architecture"
  text: "System Design & Implementation Reference"
  tagline: "Comprehensive architectural specifications, mathematical models, storage safety, and validation mechanisms for the Personal Active Learning & Evaluation Engine."
  actions:
    - theme: brand
      text: Architecture Overview
      link: /Architecture Overview/Architecture Overview
    - theme: alt
      text: Core Engine & SM-2
      link: /Core Engine/Core Engine
    - theme: alt
      text: Storage System
      link: /Storage System/Storage System
    - theme: alt
      text: User Documentation (CLI)
      link: https://kuldeep2822k.github.io/cli/

features:
  - icon: 🧠
    title: Spaced Repetition & Pedagogical Mastery
    details: Complete SuperMemo SM-2 interval expansion, ease factor deltas, and four-pillar mastery (Conceptual, Practical, Debug, and Feynman).
  - icon: 🕸️
    title: Dependency Graph & Auto-Chaining
    details: Acyclic prerequisite gating, TOC chain processing, and deterministic next-topic discovery across thousands of vault notes.
  - icon: 🛡️
    title: Atomic Durability & File Locking
    details: Containment window isolation, temp-file UUID collision resistance, advisory locking with heartbeat monitoring, and crash recovery.
  - icon: 🔍
    title: Single-Pass Validation Framework
    details: In-memory vault snapshot collection, deterministic rule execution engine, and automated repair planner (--fix).
  - icon: 🌐
    title: Isolated AI Provider Boundary
    details: Phase 2 AI tutoring architecture strictly decoupled from the deterministic offline engine core.
  - icon: ⚡
    title: High-Concurreny & Test Discipline
    details: Property-based fuzzing, fault-injection harnesses, and strict E2E subprocess test isolation.
---

## About This Documentation

This site hosts the deep technical reference manual and architectural specifications for **PALEE** (`@kuldeep2822k/palee`). 

- For user-facing guides, CLI commands, and quickstart tutorials, visit the [PALEE CLI Documentation](https://kuldeep2822k.github.io/cli/).
- For source code, issues, and releases, visit the [Kuldeep2822k/cli GitHub Repository](https://github.com/Kuldeep2822k/cli).

### Key Architectural Subsystems

1. **[Architecture Overview](/Architecture%20Overview/Architecture%20Overview)**: High-level layered architecture, security boundaries, and data flow.
2. **[Core Engine](/Core%20Engine/Core%20Engine)**: SM-2 implementation, prerequisite auto-chaining, and mastery calculation.
3. **[Storage System](/Storage%20System/Storage%20System)**: Markdown frontmatter parser, atomic file writes, locking, and session memory.
4. **[Validation Framework](/Validation%20Framework/Validation%20Framework)**: Single-pass vault collector, rule engine, and self-healing repair plans.
5. **[Application Layer](/Application%20Layer/Application%20Layer)**: Topic discovery, review workflows, and assessment tracking.
6. **[Data Models & Types](/Data%20Models%20and%20Types/Data%20Models%20and%20Types)**: Canonical TypeScript schemas for topics, reviews, and sessions.
7. **[Architecture Decision Records](/Architecture%20Decision%20Records/Architecture%20Decision%20Records)**: Synthesis of core engineering, pedagogical, and validation decisions.
8. **[Testing & Workflow](/Testing%20Guide)**: Property fuzzing, concurrency stress testing, and CI/CD pipelines.
