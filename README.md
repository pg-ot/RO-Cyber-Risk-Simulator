# RO-Cyber-Risk-Simulator

A pre-release repository for a future cyber risk simulation platform focused on Romanian market context.

## Project Status

This repository is currently **documentation-first** and does not yet include runnable simulator code.

### Available now
- Governance and contribution documentation.
- Security reporting and secret-handling guidance.
- Standard GitHub issue and PR templates.

### Not yet available
- Simulator implementation.
- Dependency/runtime setup.
- Automated tests and CI pipeline.

## Installation & Usage

At this stage there is no application binary/service to install.

You can clone the repo and review the documentation:

```bash
git clone https://github.com/<org-or-user>/RO-Cyber-Risk-Simulator.git
cd RO-Cyber-Risk-Simulator
```

When implementation is added, this section will be updated with:
1. Prerequisites
2. Install steps
3. Environment variables
4. Run commands
5. Test commands

## Repository Structure

- `README.md` – project overview and status.
- `CONTRIBUTING.md` – contribution workflow.
- `SECURITY.md` – vulnerability reporting and credential policy.
- `docs/PUBLIC_RELEASE_AUDIT.md` – release-readiness and indicator scan notes.
- `.github/ISSUE_TEMPLATE/*` – issue templates.
- `.github/pull_request_template.md` – pull request checklist.

## Public Release Checklist

Before public launch:
1. Add simulator source code.
2. Add reproducible setup and run instructions.
3. Add tests + CI.
4. Add dependency/vulnerability scanning.
5. Verify no credentials in git history.

## Gemini / AI Studio Cleanup

Repository scans for these indicators were documented:
- `gemini`
- `ai studio`
- `google.generativeai`
- `GEMINI_API_KEY`
- `GOOGLE_API_KEY`
- `generativelanguage.googleapis.com`

Current finding: indicator matches are documentation references only (no runtime code usage or hardcoded secrets). See `docs/PUBLIC_RELEASE_AUDIT.md`.
