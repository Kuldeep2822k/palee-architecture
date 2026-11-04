# Architecture Overview

::: details Referenced Files in This Document

- [README.md](https://github.com/Kuldeep2822k/cli/blob/main/README.md)
- [package.json](https://github.com/Kuldeep2822k/cli/blob/main/package.json)
- [bin/palee.ts](https://github.com/Kuldeep2822k/cli/blob/main/bin/palee.ts)
- [src/index.ts](https://github.com/Kuldeep2822k/cli/blob/main/src/index.ts)
- [src/types.ts](https://github.com/Kuldeep2822k/cli/blob/main/src/types.ts)
- [src/cli/config.ts](https://github.com/Kuldeep2822k/cli/blob/main/src/cli/config.ts)
- [src/cli/exit-codes.ts](https://github.com/Kuldeep2822k/cli/blob/main/src/cli/exit-codes.ts)
- [src/cli/next.ts](https://github.com/Kuldeep2822k/cli/blob/main/src/cli/next.ts)
- [src/application/get-next-topics.ts](https://github.com/Kuldeep2822k/cli/blob/main/src/application/get-next-topics.ts)
- [src/engine/index.ts](https://github.com/Kuldeep2822k/cli/blob/main/src/engine/index.ts)
- [src/storage/index.ts](https://github.com/Kuldeep2822k/cli/blob/main/src/storage/index.ts)
- [src/storage/atomic-write.ts](https://github.com/Kuldeep2822k/cli/blob/main/src/storage/atomic-write.ts)
- [src/storage/containment.ts](https://github.com/Kuldeep2822k/cli/blob/main/src/storage/containment.ts)
- [src/validation/index.ts](https://github.com/Kuldeep2822k/cli/blob/main/src/validation/index.ts)
- [docs/01-2-architecture-overview.md](https://github.com/Kuldeep2822k/cli/blob/main/docs/01-2-architecture-overview.md)
- [docs/03-0-engine-core.md](https://github.com/Kuldeep2822k/cli/blob/main/docs/03-0-engine-core.md)
- [docs/04-0-storage-layer.md](https://github.com/Kuldeep2822k/cli/blob/main/docs/04-0-storage-layer.md)
- [docs/05-0-data-model-and-types.md](https://github.com/Kuldeep2822k/cli/blob/main/docs/05-0-data-model-and-types.md)
- [docs/adr/0002-atomic-file-locking-and-occ.md](https://github.com/Kuldeep2822k/cli/blob/main/docs/adr/0002-atomic-file-locking-and-occ.md)

:::

## Table of Contents
1. [Introduction](#introduction)
2. [Project Structure](#project-structure)
3. [Core Components](#core-components)
4. [Architecture Overview](#architecture-overview)
5. [Detailed Component Analysis](#detailed-component-analysis)
6. [Dependency Analysis](#dependency-analysis)
7. [Performance Considerations](#performance-considerations)
8. [Security Model and System Boundaries](#security-model-and-system-boundaries)
9. [Concurrency, Atomicity, and Containment](#concurrency-atomicity-and-containment)
10. [Validation Framework](#validation-framework)
11. [Data Flow from User Input to Storage](#data-flow-from-user-input-to-storage)
12. [Technology Stack](#technology-stack)
13. [Deployment Topology and Infrastructure Requirements](#deployment-topology-and-infrastructure-requirements)
14. [Extension Points and Future Capabilities](#extension-points-and-future-capabilities)
15. [Troubleshooting Guide](#troubleshooting-guide)
16. [Conclusion](#conclusion)

## Introduction
PALEE is a Personal Active Learning & Evaluation Engine that turns an Obsidian vault into a deterministic study workspace. It reads Markdown notes with YAML frontmatter, computes spaced-repetition schedules using SuperMemo SM-2, evaluates four-pillar mastery, and enforces prerequisite dependencies through a directed acyclic graph. The CLI is the user-facing boundary; the engine is pure computation; the storage layer owns filesystem operations safely; and the validation layer audits vault integrity.

The high-level design principles are:
- Layered architecture with strict downward dependency direction: CLI depends on application, which depends on engine and storage; engine and storage do not depend on CLI.
- Domain-driven design: domain concepts such as `Topic`, `Assessment`, `Review`, sessions, and mastery are modeled explicitly in shared types.
- Separation of concerns: command parsing and terminal output belong in CLI; scheduling and readiness logic belong in application and engine; persistence, locking, caching, and vault traversal belong in storage.
- Vault-first data model: the Obsidian vault is the source of truth; PALEE does not introduce a separate database for topic state.
- Deterministic core: engine algorithms produce identical outputs for identical inputs and avoid I/O.

**Section sources**
- [README.md:1-120](https://github.com/Kuldeep2822k/cli/blob/main/README.md#L1-L120)
- [docs/01-2-architecture-overview.md:1-135](https://github.com/Kuldeep2822k/cli/blob/main/docs/01-2-architecture-overview.md#L1-L135)

## Project Structure
At the repository root, the project separates executable entry points, source modules, documentation, planning artifacts, examples, tests, and deployment/build scripts. The main runtime package is published under `@kuldeep2822k/palee`, ships compiled JavaScript under `dist`, and exposes a `palee` binary.

```mermaid
graph TB
    Root["Repository Root"]
    Bin["bin/palee.ts<br/>CLI entry point"]
    Src["src/<br/>Runtime modules"]
    Types["src/types.ts<br/>Shared domain models"]
    Engine["src/engine/*<br/>Pure computation"]
    Application["src/application/*<br/>Use cases"]
    Validation["src/validation/*<br/>Audit framework"]
    Storage["src/storage/*<br/>Filesystem and memory"]
    Docs["docs/<br/>Architecture and ADRs"]
    Tests["test/<br/>Unit, integration, e2e"]
    Package["package.json<br/>Node, TypeScript, Commander, YAML"]

    Root --> Bin
    Root --> Src
    Root --> Docs
    Root --> Tests
    Root --> Package
    Src --> Engine
    Src --> Application
    Src --> Validation
    Src --> Storage
    Src --> Types
    Bin --> Src
```

**Diagram sources**
- [package.json:1-85](https://github.com/Kuldeep2822k/cli/blob/main/package.json#L1-L85)
- [bin/palee.ts:1-60](https://github.com/Kuldeep2822k/cli/blob/main/bin/palee.ts#L1-L60)
- [src/index.ts:1-27](https://github.com/Kuldeep2822k/cli/blob/main/src/index.ts#L1-L27)

**Section sources**
- [package.json:1-85](https://github.com/Kuldeep2822k/cli/blob/main/package.json#L1-L85)
- [bin/palee.ts:1-60](https://github.com/Kuldeep2822k/cli/blob/main/bin/palee.ts#L1-L60)
- [src/index.ts:1-27](https://github.com/Kuldeep2822k/cli/blob/main/src/index.ts#L1-L27)

## Core Components
PALEE is organized around five import-reachable layers plus shared types and optional AI integration:

| Layer | Responsibility | Primary Source |
|---|---|---|
| CLI | Command registration, argument parsing, terminal or JSON output, error mapping | [bin/palee.ts](https://github.com/Kuldeep2822k/cli/blob/main/bin/palee.ts), [src/cli/*.ts](https://github.com/Kuldeep2822k/cli/blob/main/src/cli/next.ts) |
| Application | Pure use-case orchestration such as next-topic selection, review updates, assessment summaries | [src/application/get-next-topics.ts](https://github.com/Kuldeep2822k/cli/blob/main/src/application/get-next-topics.ts) |
| Engine | Spaced repetition, mastery calculation, dependency graph analysis | [src/engine/index.ts](https://github.com/Kuldeep2822k/cli/blob/main/src/engine/index.ts) |
| Storage | Vault walking, frontmatter parsing, locking, atomic writes, session memory, caching | [src/storage/index.ts](https://github.com/Kuldeep2822k/cli/blob/main/src/storage/index.ts) |
| Validation | Vault collection, rule execution, issue formatting, fixability classification | [src/validation/index.ts](https://github.com/Kuldeep2822k/cli/blob/main/src/validation/index.ts) |
| Shared Types | Domain models, CLI options, configuration, errors, session schemas | [src/types.ts](https://github.com/Kuldeep2822k/cli/blob/main/src/types.ts) |

The library barrel at [src/index.ts](https://github.com/Kuldeep2822k/cli/blob/main/src/index.ts) re-exports domain types, engine, storage, and validation subsystems so consumers can import the public contract without coupling to internal module layout.

**Section sources**
- [src/index.ts:1-27](https://github.com/Kuldeep2822k/cli/blob/main/src/index.ts#L1-L27)
- [src/types.ts:1-120](https://github.com/Kuldeep2822k/cli/blob/main/src/types.ts#L1-L120)
- [docs/01-2-architecture-overview.md:25-85](https://github.com/Kuldeep2822k/cli/blob/main/docs/01-2-architecture-overview.md#L25-L85)

## Architecture Overview
PALEE follows a layered architecture where each higher layer calls lower layers but never imports upward. The system boundaries are:

```mermaid
graph TB
    User["User or External Agent"]
    OS["Operating System and Filesystem"]
    Obsidian["Obsidian Vault (.md files)"]
    NPM["npm Registry (optional update check)"]
    Provider["AI Provider Endpoint (optional, only for config test-connection)"]

    subgraph "PALEE Process"
        CLI["CLI Layer<br/>bin/palee.ts, src/cli/*"]
        App["Application Layer<br/>src/application/*"]
        Engine["Engine Layer<br/>src/engine/*"]
        Storage["Storage Layer<br/>src/storage/*"]
        Validation["Validation Layer<br/>src/validation/*"]
        Types["Shared Types<br/>src/types.ts"]
    end

    User --> CLI
    CLI --> App
    CLI --> Validation
    App --> Engine
    App --> Storage
    Validation --> Storage
    Engine --> Types
    Storage --> Types
    CLI --> Types

    Storage --> OS
    Storage --> Obsidian
    CLI -. "Optional" .-> Provider
    CLI -. "Delegates update" .-> NPM
```

**Diagram sources**
- [bin/palee.ts:1-60](https://github.com/Kuldeep2822k/cli/blob/main/bin/palee.ts#L1-L60)
- [src/application/get-next-topics.ts:1-60](https://github.com/Kuldeep2822k/cli/blob/main/src/application/get-next-topics.ts#L1-L60)
- [src/engine/index.ts:1-40](https://github.com/Kuldeep2822k/cli/blob/main/src/engine/index.ts#L1-L40)
- [src/storage/index.ts:1-40](https://github.com/Kuldeep2822k/cli/blob/main/src/storage/index.ts#L1-L40)
- [src/validation/index.ts:1-40](https://github.com/Kuldeep2822k/cli/blob/main/src/validation/index.ts#L1-L40)
- [src/types.ts:1-60](https://github.com/Kuldeep2822k/cli/blob/main/src/types.ts#L1-L60)
- [README.md:1-120](https://github.com/Kuldeep2822k/cli/blob/main/README.md#L1-L120)

The architecture emphasizes:
- **Vault as source of truth**: Notes are Markdown with YAML frontmatter. No secondary database holds topic state.
- **Deterministic computation**: Engine functions are side-effect free and testable in isolation.
- **Safe persistence**: All mutations go through storage abstractions that enforce containment, locking, and atomic replacement.
- **Auditable integrity**: Validation rules run in a fixed order and produce structured findings rather than ad hoc console warnings.

**Section sources**
- [docs/01-2-architecture-overview.md:1-135](https://github.com/Kuldeep2822k/cli/blob/main/docs/01-2-architecture-overview.md#L1-L135)
- [docs/03-0-engine-core.md:1-60](https://github.com/Kuldeep2822k/cli/blob/main/docs/03-0-engine-core.md#L1-L60)
- [docs/04-0-storage-layer.md:1-60](https://github.com/Kuldeep2822k/cli/blob/main/docs/04-0-storage-layer.md#L1-L60)

## Detailed Component Analysis

### CLI Layer
The CLI is the process boundary. Its responsibilities include:
- Registering commands through Commander.
- Deriving the invoked program name so help text matches the actual binary.
- Loading per-user or environment-scoped configuration.
- Validating vault paths and options.
- Calling application or validation services.
- Formatting human-readable or JSON output.
- Mapping exceptions to documented exit codes.

Key implementation details:
- Entry point: [bin/palee.ts](https://github.com/Kuldeep2822k/cli/blob/main/bin/palee.ts).
- Program-name resolution: [src/cli/program-name.ts](https://github.com/Kuldeep2822k/cli/blob/main/src/cli/program-name.ts).
- Configuration management: [src/cli/config.ts](https://github.com/Kuldeep2822k/cli/blob/main/src/cli/config.ts).
- Exit-code contract: [src/cli/exit-codes.ts](https://github.com/Kuldeep2822k/cli/blob/main/src/cli/exit-codes.ts).
- Read-only example command: [src/cli/next.ts](https://github.com/Kuldeep2822k/cli/blob/main/src/cli/next.ts).

```mermaid
sequenceDiagram
    participant User as "User"
    participant CLI as "CLI Entry Point"
    participant Config as "Config Handler"
    participant Loader as "Storage Loader"
    participant UseCase as "Application Use Case"
    participant Engine as "Engine"
    participant Output as "Terminal / JSON"

    User->>CLI: "palee next --json"
    CLI->>Config: loadConfig()
    Config-->>CLI: PaleeConfig
    CLI->>Loader: loadTopics(vaultPath)
    Loader-->>CLI: LoadedTopic[]
    CLI->>UseCase: getNextTopics(topics, now)
    UseCase->>Engine: areDependenciesSatisfied(...)
    Engine-->>UseCase: readiness result
    UseCase-->>CLI: NextTopicsResult
    CLI-->>Output: JSON or formatted response
```

**Diagram sources**
- [bin/palee.ts:1-120](https://github.com/Kuldeep2822k/cli/blob/main/bin/palee.ts#L1-L120)
- [src/cli/next.ts:1-60](https://github.com/Kuldeep2822k/cli/blob/main/src/cli/next.ts#L1-L60)
- [src/cli/config.ts:1-60](https://github.com/Kuldeep2822k/cli/blob/main/src/cli/config.ts#L1-L60)
- [src/application/get-next-topics.ts:1-60](https://github.com/Kuldeep2822k/cli/blob/main/src/application/get-next-topics.ts#L1-L60)
- [src/engine/index.ts:1-40](https://github.com/Kuldeep2822k/cli/blob/main/src/engine/index.ts#L1-L40)

**Section sources**
- [bin/palee.ts:1-120](https://github.com/Kuldeep2822k/cli/blob/main/bin/palee.ts#L1-L120)
- [src/cli/program-name.ts:1-91](https://github.com/Kuldeep2822k/cli/blob/main/src/cli/program-name.ts#L1-L91)
- [src/cli/config.ts:1-80](https://github.com/Kuldeep2822k/cli/blob/main/src/cli/config.ts#L1-L80)
- [src/cli/exit-codes.ts:1-65](https://github.com/Kuldeep2822k/cli/blob/main/src/cli/exit-codes.ts#L1-L65)
- [src/cli/next.ts:1-60](https://github.com/Kuldeep2822k/cli/blob/main/src/cli/next.ts#L1-L60)

### Application Layer
The application layer encapsulates business workflows that combine storage reads and engine computations without touching Commander or process globals. The primary example is next-topic selection:

- It loads topics through storage.
- It partitions due and never-reviewed candidates.
- It applies the prerequisite gate using the engine.
- It returns actionable topics and explains blocked topics.

```mermaid
flowchart TD
    Start["getNextTopics(topics, now)"] --> BuildCandidates["Build candidate list from LoadedTopic"]
    BuildCandidates --> PartitionDue["Partition into never-reviewed and due reviews"]
    PartitionDue --> ApplyGate["Apply prerequisite gate"]
    ApplyGate --> Blocked{"Prerequisite unmet?"}
    Blocked -->|Yes| AddBlocked["Add to blockedTopics"]
    Blocked -->|No| AddActionable["Add to dueTopics"]
    AddBlocked --> Result["Return { dueTopics, totalTopics, blockedTopics }"]
    AddActionable --> Result
```

**Diagram sources**
- [src/application/get-next-topics.ts:1-199](https://github.com/Kuldeep2822k/cli/blob/main/src/application/get-next-topics.ts#L1-L199)
- [src/engine/index.ts:40-126](https://github.com/Kuldeep2822k/cli/blob/main/src/engine/index.ts#L40-L126)

**Section sources**
- [src/application/get-next-topics.ts:1-199](https://github.com/Kuldeep2822k/cli/blob/main/src/application/get-next-topics.ts#L1-L199)

### Engine Layer
The engine is the deterministic core. It provides:
- SM-2 spaced repetition scheduling.
- Four-pillar mastery computation.
- Dependency graph operations including cycle detection, readiness evaluation, and canonical dependency extraction.

```mermaid
classDiagram
    class EngineIndex {
        +processReview()
        +computeDueDate()
        +MASTERY_THRESHOLD
        +computeTopicMastery()
        +normalizeScore()
        +resolveTopicMastery()
        +detectCycle()
        +detectCycles()
        +detectCyclesBounded()
        +quarantineCyclicTopics()
        +findCyclicSccNodes()
        +getReadyTopics()
        +areDependenciesSatisfied()
        +getTopicDependencies()
        +validateDependencyGraph()
        +findMissingDependencies()
        +generateTopicId()
    }

    class SM2 {
        +processReview()
        +computeDueDate()
    }

    class Mastery {
        +computeTopicMastery()
        +normalizeScore()
        +resolveTopicMastery()
        +MASTERY_THRESHOLD
    }

    class Dependency {
        +detectCycle()
        +detectCycles()
        +detectCyclesBounded()
        +quarantineCyclicTopics()
        +findCyclicSccNodes()
        +getReadyTopics()
        +areDependenciesSatisfied()
        +getTopicDependencies()
        +validateDependencyGraph()
        +findMissingDependencies()
    }

    EngineIndex --> SM2 : "delegates"
    EngineIndex --> Mastery : "delegates"
    EngineIndex --> Dependency : "delegates"
```

**Diagram sources**
- [src/engine/index.ts:1-126](https://github.com/Kuldeep2822k/cli/blob/main/src/engine/index.ts#L1-L126)

**Section sources**
- [docs/03-0-engine-core.md:1-120](https://github.com/Kuldeep2822k/cli/blob/main/docs/03-0-engine-core.md#L1-L120)
- [src/engine/index.ts:1-126](https://github.com/Kuldeep2822k/cli/blob/main/src/engine/index.ts#L1-L126)

### Storage Layer
The storage layer is the single boundary over the filesystem. Its public API bundles vault traversal, frontmatter manipulation, locking, atomic writes, caching, roadmap parsing, pattern matching, TOC discovery, session memory, and topic loading.

```mermaid
flowchart TD
    Vault["Obsidian Vault"]
    Walker["vault-walker.ts"]
    Scanner["scanner.ts"]
    Loader["loader.ts"]
    Frontmatter["frontmatter.ts"]
    Cache["cache.ts"]
    Lock["lock.ts"]
    AtomicWrite["atomic-write.ts"]
    Containment["containment.ts"]
    Memory["memory.ts"]
    Sessions["sessions.ts"]

    Vault --> Walker
    Walker --> Scanner
    Scanner --> Loader
    Loader --> Frontmatter
    Loader --> Cache
    AtomicWrite --> Frontmatter
    AtomicWrite --> Lock
    AtomicWrite --> Containment
    Memory --> Sessions
```

**Diagram sources**
- [src/storage/index.ts:1-142](https://github.com/Kuldeep2822k/cli/blob/main/src/storage/index.ts#L1-L142)
- [src/storage/atomic-write.ts:1-60](https://github.com/Kuldeep2822k/cli/blob/main/src/storage/atomic-write.ts#L1-L60)
- [src/storage/containment.ts:1-60](https://github.com/Kuldeep2822k/cli/blob/main/src/storage/containment.ts#L1-L60)

**Section sources**
- [docs/04-0-storage-layer.md:1-145](https://github.com/Kuldeep2822k/cli/blob/main/docs/04-0-storage-layer.md#L1-L145)
- [src/storage/index.ts:1-142](https://github.com/Kuldeep2822k/cli/blob/main/src/storage/index.ts#L1-L142)

### Validation Layer
The validation layer runs a fixed catalog of rules over collected vault entities. Its role is to audit data integrity, classify severity and fixability, and produce deterministic output suitable for humans and machines.

```mermaid
flowchart TD
    Collect["collectVault()<br/>One read pass, malformed files do not abort scan"] --> Rules["runRules()<br/>Fixed ordered catalog"]
    Rules --> FormatHuman["formatHuman()"]
    Rules --> FormatJson["formatJson()"]
    Rules --> Issues["Structured ValidationIssue[]"]

    subgraph "Rule Categories"
        Parse["parse-frontmatter, read-failure"]
        Kind["valid-managed-note-kind"]
        Schema["valid-palee-schema"]
        Identity["valid-topic-id-format, no-duplicate-topic-id"]
        Graph["valid-dependency-list, no-missing-dependency, no-dependency-cycle"]
        Assessment["valid-assessment-fields, valid-topic-mastery"]
        Review["valid-review-fields, valid-review-dates"]
        Session["valid-session-schema, no-session-unknown-topic, valid-session-index"]
        HotMemory["valid-hot-memory"]
        Paths["safe-vault-paths"]
    end

    Rules --> Parse
    Rules --> Kind
    Rules --> Schema
    Rules --> Identity
    Rules --> Graph
    Rules --> Assessment
    Rules --> Review
    Rules --> Session
    Rules --> HotMemory
    Rules --> Paths
```

**Diagram sources**
- [src/validation/index.ts:1-130](https://github.com/Kuldeep2822k/cli/blob/main/src/validation/index.ts#L1-L130)

**Section sources**
- [src/validation/index.ts:1-130](https://github.com/Kuldeep2822k/cli/blob/main/src/validation/index.ts#L1-L130)

## Dependency Analysis
The dependency direction is intentionally restrictive:

- CLI depends on application, validation, shared types, and configuration helpers.
- Application depends on engine and storage.
- Validation depends on storage reads and shared types.
- Engine depends only on shared types and pure algorithm modules.
- Storage depends on Node.js filesystem APIs and shared types.
- No layer imports its caller.

```mermaid
graph LR
    CLI["CLI"] --> Application["Application"]
    CLI --> Validation["Validation"]
    CLI --> Types["Types"]
    Application --> Engine["Engine"]
    Application --> Storage["Storage"]
    Validation --> Storage
    Validation --> Types
    Engine --> Types
    Storage --> Types
```

**Diagram sources**
- [bin/palee.ts:1-60](https://github.com/Kuldeep2822k/cli/blob/main/bin/palee.ts#L1-L60)
- [src/application/get-next-topics.ts:1-40](https://github.com/Kuldeep2822k/cli/blob/main/src/application/get-next-topics.ts#L1-L40)
- [src/validation/index.ts:1-40](https://github.com/Kuldeep2822k/cli/blob/main/src/validation/index.ts#L1-L40)
- [src/engine/index.ts:1-40](https://github.com/Kuldeep2822k/cli/blob/main/src/engine/index.ts#L1-L40)
- [src/storage/index.ts:1-40](https://github.com/Kuldeep2822k/cli/blob/main/src/storage/index.ts#L1-L40)
- [src/types.ts:1-40](https://github.com/Kuldeep2822k/cli/blob/main/src/types.ts#L1-L40)

**Section sources**
- [docs/01-2-architecture-overview.md:15-40](https://github.com/Kuldeep2822k/cli/blob/main/docs/01-2-architecture-overview.md#L15-L40)

## Performance Considerations
Performance is primarily addressed by the storage layer's read path and cache:

- `walkVault` discovers markdown files while ignoring internal directories.
- `FileCache` tracks metadata and uses an unsettled horizon to force fingerprint verification shortly after changes.
- SHA-256 fallback preserves cache entries when file modification times shift without content changes.
- Engine computations operate on plain objects and are CPU-bound but small enough for interactive CLI workloads.
- Concurrency control avoids long-held locks; lock acquisition is bounded, and OCC retries short-lived conflicts.

Optimization opportunities should preserve the existing contracts:
- Keep engine functions pure and side-effect free.
- Avoid adding network calls to hot read paths.
- Treat `FileCache` as performance-only; it must be deletable without changing behavior.
- Do not replace the vault-first model with an in-process database.

[No sources needed since this section provides general guidance]

## Security Model and System Boundaries
The security model centers on three boundaries:

1. **Vault containment**: Write destinations must resolve inside the configured vault root. Escape attempts raise a containment error rather than a retryable conflict.
2. **Credential handling**: API keys are stored securely on POSIX (`0600`) and refused outside safe profile roots on Windows unless explicitly overridden. Keys are never printed.
3. **Network boundary**: Only `config test-connection` reaches a provider endpoint directly. Other commands delegate update checks to npm and do not open network sockets themselves.

```mermaid
flowchart TD
    UserInput["User Path or Link"] --> Containment["assertContainedInVault()"]
    Containment --> Inside{"Resolves inside vault?"}
    Inside -->|Yes| Proceed["Allow write"]
    Inside -->|No| ContainmentError["ECONTAINMENT<br/>Exit 3"]

    Credential["API Key"] --> ConfigDir["Config Directory"]
    ConfigDir --> WinCheck{"Windows profile-safe root?"}
    WinCheck -->|Yes| Store["Store key"]
    WinCheck -->|No| Refuse["Refuse or require confirmation"]

    NetworkCommand["config test-connection"] --> Provider["Provider Endpoint"]
    OtherCommands["Other Commands"] --> NoDirect["No direct network call"]
```

**Diagram sources**
- [src/storage/containment.ts:1-185](https://github.com/Kuldeep2822k/cli/blob/main/src/storage/containment.ts#L1-L185)
- [src/cli/config.ts:1-120](https://github.com/Kuldeep2822k/cli/blob/main/src/cli/config.ts#L1-L120)
- [README.md:60-120](https://github.com/Kuldeep2822k/cli/blob/main/README.md#L60-L120)

**Section sources**
- [src/storage/containment.ts:1-185](https://github.com/Kuldeep2822k/cli/blob/main/src/storage/containment.ts#L1-L185)
- [src/cli/config.ts:1-120](https://github.com/Kuldeep2822k/cli/blob/main/src/cli/config.ts#L1-L120)
- [README.md:60-120](https://github.com/Kuldeep2822k/cli/blob/main/README.md#L60-L120)

## Concurrency, Atomicity, and Containment
PALEE implements a two-tier synchronization mechanism for vault writes:

1. **Cross-process mutex**: Directory-based locking under `.palee/locks/` prevents concurrent PALEE writers from stepping on each other. Heartbeats allow stale-lock recovery.
2. **Optimistic concurrency control**: Before writing, the expected content fingerprint is validated. A mismatch raises a conflict error mapped to exit code `4`.
3. **Atomic replacement**: Writes target a unique temporary file, flush data, then atomically rename it over the destination.
4. **Stale temp reclaim**: Crashed writers may leave temporary files; the current writer reclaims only its own abandoned temps after staleness and owner liveness checks.
5. **Containment refusal**: Any resolved destination outside the vault is rejected with a dedicated containment error.

```mermaid
flowchart TD
    Start["atomicWrite(target, content, expectedFingerprint)"] --> Contain["Assert contained in vault"]
    Contain --> Lock["Acquire Lock"]
    Lock --> CheckFingerprint["Compare expected fingerprint"]
    CheckFingerprint --> Conflict{"Fingerprint changed?"}
    Conflict -->|Yes| ConflictError["ECONFLICT<br/>Exit 4"]
    Conflict -->|No| ReclaimTemps["Reclaim stale temps for this target"]
    ReclaimTemps --> WriteTemp["Write unique temp file"]
    WriteTemp --> Fsync["fsyncSync temp fd"]
    Fsync --> Rename["renameSync(temp -> target)"]
    Rename --> DirFsync["Best-effort directory fsync"]
    DirFsync --> Success["Success"]
```

**Diagram sources**
- [src/storage/atomic-write.ts:1-120](https://github.com/Kuldeep2822k/cli/blob/main/src/storage/atomic-write.ts#L1-L120)
- [src/storage/containment.ts:120-185](https://github.com/Kuldeep2822k/cli/blob/main/src/storage/containment.ts#L120-L185)
- [docs/adr/0002-atomic-file-locking-and-occ.md:1-56](https://github.com/Kuldeep2822k/cli/blob/main/docs/adr/0002-atomic-file-locking-and-occ.md#L1-L56)

**Section sources**
- [docs/adr/0002-atomic-file-locking-and-occ.md:1-56](https://github.com/Kuldeep2822k/cli/blob/main/docs/adr/0002-atomic-file-locking-and-occ.md#L1-L56)
- [src/storage/atomic-write.ts:1-120](https://github.com/Kuldeep2822k/cli/blob/main/src/storage/atomic-write.ts#L1-L120)
- [src/storage/containment.ts:1-185](https://github.com/Kuldeep2822k/cli/blob/main/src/storage/containment.ts#L1-L185)
- [src/cli/exit-codes.ts:1-65](https://github.com/Kuldeep2822k/cli/blob/main/src/cli/exit-codes.ts#L1-L65)

## Validation Framework
The validation framework is an auditable pipeline:

1. **Collection**: One pass over the vault collects managed notes and records malformed files without aborting the entire scan.
2. **Execution**: Rules run in a fixed, documented order so output is deterministic.
3. **Classification**: Each finding has severity and fixability information.
4. **Formatting**: Human and JSON formatters support both interactive users and automation.

The canonical rule catalog includes parse/read failures, managed-note kind, schema version, identity, dependency shape, missing dependencies, cycles, assessment fields, mastery consistency, review fields, review dates, session schema, unknown session references, session index, hot memory, and safe vault paths.

**Section sources**
- [src/validation/index.ts:1-130](https://github.com/Kuldeep2822k/cli/blob/main/src/validation/index.ts#L1-L130)

## Data Flow from User Input to Storage
A typical write flow, such as recording a review, moves through the following stages:

1. CLI parses arguments and validates vault configuration.
2. Storage loader reads topics from the vault, optionally using cache.
3. Application transforms user input into an update payload.
4. Engine computes new SM-2 state and mastery.
5. Storage performs containment check, locking, fingerprint verification, atomic write, and cleanup.

```mermaid
sequenceDiagram
    participant User as "User"
    participant CLI as "CLI Handler"
    participant Storage as "Storage Loader"
    participant App as "Application Builder"
    participant Engine as "Engine"
    participant FS as "Filesystem"

    User->>CLI: "palee review <topic> <quality>"
    CLI->>Storage: loadTopics(vaultPath)
    Storage-->>CLI: Topics
    CLI->>App: buildReviewUpdate(topic, quality)
    App->>Engine: processReview(reviewState, quality)
    Engine-->>App: Updated review state
    App-->>CLI: Update payload
    CLI->>FS: atomicWrite(target, updated frontmatter, fingerprint)
    FS-->>CLI: Success or Conflict
```

**Diagram sources**
- [src/cli/next.ts:1-60](https://github.com/Kuldeep2822k/cli/blob/main/src/cli/next.ts#L1-L60)
- [src/application/get-next-topics.ts:1-60](https://github.com/Kuldeep2822k/cli/blob/main/src/application/get-next-topics.ts#L1-L60)
- [src/engine/index.ts:1-40](https://github.com/Kuldeep2822k/cli/blob/main/src/engine/index.ts#L1-L40)
- [src/storage/atomic-write.ts:1-60](https://github.com/Kuldeep2822k/cli/blob/main/src/storage/atomic-write.ts#L1-L60)

**Section sources**
- [docs/01-2-architecture-overview.md:85-135](https://github.com/Kuldeep2822k/cli/blob/main/docs/01-2-architecture-overview.md#L85-L135)
- [docs/04-0-storage-layer.md:120-145](https://github.com/Kuldeep2822k/cli/blob/main/docs/04-0-storage-layer.md#L120-L145)

## Technology Stack
PALEE is a Node.js application written in TypeScript:

| Concern | Choice | Reason |
|---|---|---|
| Runtime | Node.js >= 22.12.0 | Modern ECMAScript features, stable CLI tooling, broad platform support |
| Language | TypeScript | Strong typing for domain models, safer refactoring, shared type contracts |
| CLI Framework | Commander | Declarative command registration and option parsing |
| YAML Parsing | YAML | Reads and writes YAML frontmatter used by Obsidian notes |
| Persistence | Markdown + YAML frontmatter | Vault-first design keeps data human-readable and portable |
| Test Runner | Node test runner with TSX | Fast unit, integration, and e2e testing without extra runtime dependencies |

**Section sources**
- [package.json:1-85](https://github.com/Kuldeep2822k/cli/blob/main/package.json#L1-L85)
- [README.md:30-60](https://github.com/Kuldeep2822k/cli/blob/main/README.md#L30-L60)

## Deployment Topology and Infrastructure Requirements
PALEE is deployed as a local CLI tool installed through npm. The topology is simple because it does not run a server.

```mermaid
graph TB
    Developer["Developer Machine"]
    CI["CI Pipeline"]
    Registry["npm Registry"]
    UserMachine["User Machine"]
    Vault["Local Obsidian Vault"]
    Provider["Optional AI Provider"]

    Developer --> Registry
    CI --> Registry
    Registry --> UserMachine
    UserMachine --> Vault
    UserMachine -. "Only config test-connection" .-> Provider
```

Infrastructure requirements:
- Node.js >= 22.12.0.
- A writable local filesystem containing an Obsidian vault.
- Optional network access only for `palee update` (delegated to npm) and `palee config test-connection`.
- Platform-specific file permissions respected on POSIX; Windows relies on profile-root safety checks for credential-bearing config.

**Diagram sources**
- [README.md:30-120](https://github.com/Kuldeep2822k/cli/blob/main/README.md#L30-L120)
- [package.json:1-85](https://github.com/Kuldeep2822k/cli/blob/main/package.json#L1-L85)

**Section sources**
- [README.md:30-120](https://github.com/Kuldeep2822k/cli/blob/main/README.md#L30-L120)
- [package.json:1-85](https://github.com/Kuldeep2822k/cli/blob/main/package.json#L1-L85)

## Extension Points and Future Capabilities
The architecture leaves deliberate extension points:

- **AI provider boundary**: The optional AI module is separated behind a provider abstraction. Phase 2 plans add Feynman testing and tutoring while keeping user confirmation for state-changing actions.
- **Validation rule registry**: New rules can be added to the ordered catalog without changing the runner contract.
- **Application use cases**: New CLI commands can compose storage and engine capabilities without touching filesystem internals.
- **Engine extensions**: New pedagogical or scheduling algorithms can be added alongside SM-2 and mastery logic as long as they remain pure and typed.
- **Storage adapters**: The storage barrel centralizes filesystem operations, making future enhancements like additional caches or transport layers easier to isolate.

Future capabilities should respect existing constraints:
- Do not bypass vault containment.
- Do not store secrets in command-line arguments.
- Do not introduce network calls from non-AI commands.
- Keep engine calculations deterministic and side-effect free.
- Preserve backward compatibility of frontmatter fields and session schemas through migration and validation rules.

**Section sources**
- [README.md:1-120](https://github.com/Kuldeep2822k/cli/blob/main/README.md#L1-L120)
- [src/validation/index.ts:80-130](https://github.com/Kuldeep2822k/cli/blob/main/src/validation/index.ts#L80-L130)
- [src/engine/index.ts:1-126](https://github.com/Kuldeep2822k/cli/blob/main/src/engine/index.ts#L1-L126)
- [src/storage/index.ts:1-142](https://github.com/Kuldeep2822k/cli/blob/main/src/storage/index.ts#L1-L142)

## Troubleshooting Guide
Common operational signals and their architectural meaning:

| Symptom | Likely Cause | Correct Handling |
|---|---|---|
| Exit code `2` | Invalid usage, missing vault, or provider configuration problem | Fix CLI arguments or configuration; do not retry automatically |
| Exit code `3` | Validation failure, bad schema, or destination escapes vault containment | Repair vault data or correct path/link; retrying will not fix containment |
| Exit code `4` | Optimistic concurrency conflict or active lock | Reload vault state and retry the write once or with backoff |
| Exit code `5` | Unexpected runtime exception or provider I/O failure | Inspect logs; treat as a crash-class error rather than user-config error |
| Note not updated | Concurrent edit or lock held by another process | Wait, close conflicting editors, or investigate stale locks |
| Temporary file remains | Crash during atomic write before rename | The next compatible writer may reclaim it if ownership and age checks pass |
| Provider connection fails | Bad URL, reserved address, unsupported protocol, or authentication failure | Use `config test-connection`; confirm base URL, origin, and credentials |

The exit-code mapper centralizes conflict, containment, and provider error classification so handlers do not hard-code numeric values.

**Section sources**
- [src/cli/exit-codes.ts:1-65](https://github.com/Kuldeep2822k/cli/blob/main/src/cli/exit-codes.ts#L1-L65)
- [src/storage/atomic-write.ts:1-120](https://github.com/Kuldeep2822k/cli/blob/main/src/storage/atomic-write.ts#L1-L120)
- [src/storage/containment.ts:1-185](https://github.com/Kuldeep2822k/cli/blob/main/src/storage/containment.ts#L1-L185)
- [README.md:60-120](https://github.com/Kuldeep2822k/cli/blob/main/README.md#L60-L120)

## Conclusion
PALEE’s architecture is a disciplined separation between user interface, business workflow, pure computation, and safe persistence. The Obsidian vault is the authoritative data store, the engine is deterministic, and the storage layer enforces containment, locking, atomicity, and optimistic concurrency. The validation framework provides a stable audit surface for vault integrity, while the optional AI boundary allows future capability growth without compromising the security and determinism guarantees of the core system. For maintainers, the most important rule is to keep dependencies downward, keep engine logic pure, and route every filesystem mutation through the storage layer.

[No sources needed since this section summarizes without analyzing specific files]