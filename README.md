# RO-Cyber-Risk-Simulator

Interactive browser-based simulation of a desalination plant cyber-physical attack scenario, including operator-vs-attacker state, equipment degradation, alerting, and optional Gemini incident analysis.

## Functionality

- Real-time process simulation for key desalination stages (intake, pre-treatment, HPP, membranes, distribution).
- Attacker control panel to manipulate operational parameters (pressure, chlorination, pH) and spoof selected sensors.
- Ground-truth impact panel for asset health, water safety, and personnel safety conditions.
- Terminal-style command log for parameter writes and spoof events.
- Optional AI incident report generation using Gemini (`@google/genai`) after stopping the simulation.

## Installation & Usage

This app runs as static frontend files.

1. Serve the repository with a local HTTP server:

```bash
python -m http.server 4173
```

2. Open the simulator in browser:

```text
http://localhost:4173/index.html
```

3. Start simulation with **START SIMULATION**.
4. Adjust controls and observe impact/alerts.
5. (Optional) Click **Analyze Incident** when simulation is stopped.
   - Enter Gemini API key when prompted.
   - Key is stored in browser `localStorage` as `GEMINI_API_KEY`.

## Repository Structure

- `index.html` – static HTML shell + import map.
- `index.js` – full React simulation UI and logic.
- `CONTRIBUTING.md` – contribution workflow.
- `SECURITY.md` – vulnerability reporting and credential policy.
- `docs/PUBLIC_RELEASE_AUDIT.md` – release-readiness and indicator scan notes.
- `docs/PROJECT_UNDERSTANDING.md` – current project understanding and roadmap.
- `.github/ISSUE_TEMPLATE/*` – issue templates.
- `.github/pull_request_template.md` – pull request checklist.

## Security Notes

- Do not commit API keys or `.env` files.
- Gemini key is requested at runtime and stored client-side in local browser storage.
- For production usage, route Gemini requests through a backend proxy to avoid exposing keys in browser environments.
