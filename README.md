# RO-Cyber-Risk-Simulator

## Current Repository Status

This repository is currently a **skeleton project** with no runnable simulator source code yet.

What exists today:
- Project initialization and release-governance baseline docs.
- GitHub collaboration templates for issues and pull requests.

What is missing for a public release:
- Application source code (frontend/backend/simulation engine).
- Dependency manifests and lockfiles.
- Build/run instructions.
- Tests and CI automation.
- Architecture and data model documentation.

## Installation & Usage Guide

### Current state (available now)

There is no installable simulator build yet. For now, this repository can be used for:
- Reviewing governance and security policies.
- Planning contribution workflow and issue/PR process.

You can clone and review documentation locally:

```bash
git clone https://github.com/<org-or-user>/RO-Cyber-Risk-Simulator.git
cd RO-Cyber-Risk-Simulator
```

### Planned runtime usage (once simulator code is added)

When implementation is introduced, this section will be expanded with:
1. Prerequisites.
2. Dependency installation commands.
3. Environment variable setup.
4. Run/start commands.
5. Test commands.

## GitHub Structure Readiness

The repository is now organized with standard GitHub community files:

- `README.md` (project overview)
- `SECURITY.md` (security policy)
- `CONTRIBUTING.md` (contributor guide)
- `.github/ISSUE_TEMPLATE/bug_report.md`
- `.github/ISSUE_TEMPLATE/feature_request.md`
- `.github/pull_request_template.md`

This structure is suitable for public visibility and contributor onboarding.

## Public Release Readiness (Initial)

Before publishing broadly, complete the following:

1. Add implementation code and a reproducible run path.
2. Add tests and CI checks.
3. Add security controls (secret handling, vulnerability scanning).
4. Add licensing, contribution, and support policy documentation.
5. Verify no vendor-specific API keys or credentials are present.

## Gemini / AI Studio Cleanup Status

A repository-wide scan was performed for common Gemini / Google AI Studio indicators:
- `gemini`
- `ai studio`
- `google.generativeai`
- `GEMINI_API_KEY`
- `GOOGLE_API_KEY`

**Result:** no hardcoded Gemini/AI Studio credentials or SDK usage were found in project code (only documentation mentions).

See [`PUBLIC_RELEASE_AUDIT.md`](PUBLIC_RELEASE_AUDIT.md) for full details and command logs.
