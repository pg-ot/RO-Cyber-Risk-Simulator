# RO-Cyber-Risk-Simulator

Interactive browser-based simulation of a desalination plant cyber-physical attack scenario, including operator-vs-attacker state, equipment degradation, alerting, and optional Gemini incident analysis.

## Functionality

- Real-time process simulation for key desalination stages (intake, pre-treatment, HPP, membranes, distribution).
- Attacker control panel to manipulate operational parameters (pressure, chlorination, pH) and spoof selected sensors.
- Ground-truth impact panel for asset health, water safety, and personnel safety conditions.
- Terminal-style command log for parameter writes and spoof events.
- Optional AI incident report generation using Gemini (`@google/genai`) after stopping the simulation.

## Installation & Usage

For the full step-by-step manual (from `git clone` to opening the simulator page), see:
- `docs/INSTALLATION_RUN_MANUAL.md`

Quick start:

1. Clone repository:

```bash
git clone https://github.com/pg-ot/RO-Cyber-Risk-Simulator.git
cd RO-Cyber-Risk-Simulator
```

2. Start local server:

```bash
python -m http.server 4173
```

3. Open:

```text
http://localhost:4173/index.html
```

4. Click **START SIMULATION**.

## Repository Structure

- `index.html` – static HTML shell + import map.
- `index.js` – full React simulation UI and logic.
- `CONTRIBUTING.md` – contribution workflow.
- `SECURITY.md` – vulnerability reporting and credential policy.
- `docs/PUBLIC_RELEASE_AUDIT.md` – release-readiness and indicator scan notes.
- `docs/PROJECT_UNDERSTANDING.md` – current project understanding and roadmap.
- `docs/INSTALLATION_RUN_MANUAL.md` – detailed installation/run guide from clone to browser access.
- `.github/ISSUE_TEMPLATE/*` – issue templates.
- `.github/pull_request_template.md` – pull request checklist.

## Security Notes

- Do not commit API keys or `.env` files.
- Gemini key is requested at runtime and stored client-side in local browser storage.
- For production usage, route Gemini requests through a backend proxy to avoid exposing keys in browser environments.
