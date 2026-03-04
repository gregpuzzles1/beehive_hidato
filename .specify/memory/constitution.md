<!--
Sync Impact Report
- Version change: N/A (template) → 1.0.0
- Modified principles:
	- Template Principle 1 → I. Static-Only Web Delivery
	- Template Principle 2 → II. React + TypeScript Baseline
	- Template Principle 3 → III. Responsive & Accessible by Default
	- Template Principle 4 → IV. Main-Branch Controlled Deployment
	- Template Principle 5 → V. Minimal Quality Gates
- Added sections:
	- Platform Constraints
	- Workflow & Quality Gates
- Removed sections:
	- None
- Templates requiring updates:
	- ✅ updated: .specify/templates/plan-template.md
	- ✅ updated: .specify/templates/spec-template.md
	- ✅ updated: .specify/templates/tasks-template.md
	- ⚠ pending (not present in repo): .specify/templates/commands/*.md
- Deferred items:
	- None
-->

# Beehive Hidato Constitution

## Core Principles

### I. Static-Only Web Delivery
The product MUST be implemented and deployed as a static web application. Runtime server
code, server-side rendering dependencies, and database requirements are prohibited for
production operation. All puzzle logic and rendering must execute in the browser.
Rationale: static hosting keeps operations simple, low cost, and compatible with GitHub
Pages.

### II. React + TypeScript Baseline
The frontend MUST use React and TypeScript as the implementation baseline. Any additional
libraries MUST be justified by clear product value and MUST not require backend services.
Core puzzle behavior MUST remain deterministic and fully client-side.
Rationale: a consistent stack reduces implementation risk and maintenance overhead.

### III. Responsive & Accessible by Default
All user-facing features MUST support mobile, tablet, and desktop layouts. Interfaces MUST
meet WCAG 2.1 AA-aligned accessibility expectations for keyboard navigation, semantic
structure, visible focus states, and sufficient color contrast.
Rationale: usability and inclusivity are baseline quality requirements, not optional polish.

### IV. Main-Branch Controlled Deployment
Production deployment MUST occur only through GitHub Actions workflows triggered from the
`main` branch. Manual production deployments and deployments from non-`main` branches are
not permitted. GitHub Pages is the only approved production hosting target.
Rationale: a single deployment path improves traceability and release safety.

### V. Minimal Quality Gates
Every change to user-facing behavior MUST include: (1) functional verification for the
changed behavior, (2) responsive verification at mobile and desktop breakpoints, and (3)
an accessibility check for keyboard flow and labels/roles in changed areas. CI on pull
requests to `main` MUST pass before merge.
Rationale: minimum enforceable quality gates prevent regressions while keeping process
lightweight.

## Platform Constraints

- Application type MUST remain static SPA content suitable for GitHub Pages.
- Backend APIs, persistent databases, and server-managed sessions are out of scope.
- The preferred stack is React + TypeScript with static assets (HTML/CSS/JS/media).
- Styling decisions SHOULD follow the Hidato CSS plan guidance for color usage and visual
	consistency.

## Workflow & Quality Gates

- Work is proposed through specs/plans/tasks and delivered through pull requests.
- Pull requests targeting `main` MUST pass configured CI checks before merge.
- Release to production occurs via GitHub Actions workflow from `main` only.
- Each change MUST document how responsiveness and accessibility were verified.

## Governance

This constitution is authoritative for project delivery decisions. In any conflict between
this constitution and feature-level documents, this constitution takes precedence.

Amendments require a pull request that: (1) states the proposed change, (2) identifies
impacted templates and workflows, and (3) includes a version bump justification using the
semantic policy below.

Versioning policy for this constitution follows semantic versioning:
- MAJOR: incompatible governance changes or principle removals/redefinitions.
- MINOR: new principle or materially expanded mandatory guidance.
- PATCH: clarifications, wording refinements, or typo-level edits with no behavioral impact.

Compliance review is required in every planning and review cycle: plans MUST include a
Constitution Check, specs MUST reflect mandatory constraints, and tasks MUST include work
items for required quality gates.

**Version**: 1.0.0 | **Ratified**: 2026-03-04 | **Last Amended**: 2026-03-04
