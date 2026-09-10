<!-- agemon:start:agent-rules -->
# AI Agent Rules

This block is the canonical, repo-wide rule set for every AI coding agent in this
repository. `CLAUDE.md`, `GEMINI.md`, `.cursorrules`, and `.windsurfrules` are pointer
files that exist only because their tools look for those exact names — read this first.

## Task Lifecycle

Apply this sequence to every task:

1. Discover existing skills, tools, utilities, and conventions before writing new code.
2. Plan the smallest complete change; state assumptions and tradeoffs before implementing.
3. Verify assumptions with tests or reproducible checks.
4. Implement with clear names, modular boundaries, and no dead code.
5. Re-verify after the change and confirm no regressions were introduced.
6. Record anything out of scope in `improvements.md` instead of fixing it inline.

## Core Directives

- Simplicity first: the minimum code that solves the problem, nothing speculative.
- Reuse existing project utilities instead of duplicating logic.
- Match the surrounding code's style, naming, and structure.
- Keep every change surgical: touch only what the task requires.
- Zero waste in your own changes: no unused imports, variables, or dead branches.
- Self-documenting code: descriptive names and named constants over explanatory comments.
- Preserve user-authored content outside agemon-managed files and blocks.
- Prefer safe, reversible changes; call out irreversible or outward-facing steps first.
- Security and performance by default within scope: validate input, least privilege,
  no needless recomputation.

## Output Conventions

- Reference real, existing file paths.
- Mark the file path above each changed code block.
- End every task with a short summary of what changed and why.
<!-- agemon:end:agent-rules -->
