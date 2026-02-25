# Project Understanding (Current State)

## What this repository is

`RO-Cyber-Risk-Simulator` is now a runnable static web simulation demonstrating cyber-physical attack effects on a desalination process.

## Current functionality

- Frontend-only React application (`index.js`) loaded directly in browser via import map.
- Process component visualization and simplified degradation logic.
- Attacker controls for key process parameters + sensor spoofing toggles.
- Active alerts and impact assessment panels.
- Optional Gemini-generated incident analysis.

## Architecture notes

- No backend service is currently implemented.
- Gemini API calls are performed from browser code.
- API key is provided interactively and stored in `localStorage` (`GEMINI_API_KEY`).

## Known gaps / next steps

1. Add backend API proxy for AI calls to avoid exposing provider keys in browser context.
2. Add automated tests (unit + integration/UI).
3. Add CI workflows (lint/test/secret scan).
4. Split `index.js` into modular components for maintainability.
5. Add scenario presets and export/import of run state.
