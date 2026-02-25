# Installation and Run Manual

This guide explains exactly how to go from cloning the repository to opening the simulator in your browser.

Repository: `https://github.com/pg-ot/RO-Cyber-Risk-Simulator`

## 1) Prerequisites

You only need:
- `git`
- `python` (for a lightweight local HTTP server)
- A modern browser (Chrome / Edge / Firefox)

Check tools:

```bash
git --version
python --version
```

> If your system uses `python3` instead of `python`, replace `python` with `python3` in all commands below.

## 2) Clone the repository

```bash
git clone https://github.com/pg-ot/RO-Cyber-Risk-Simulator.git
cd RO-Cyber-Risk-Simulator
```

## 3) Verify files are present

```bash
ls
```

You should see at least:
- `index.html`
- `index.js`
- `README.md`

## 4) Start local web server

Run this from the repository root:

```bash
python -m http.server 4173
```

Expected output includes something like:

```text
Serving HTTP on 0.0.0.0 port 4173
```

Keep this terminal running while using the simulator.

## 5) Open simulator in browser

Open:

```text
http://localhost:4173/index.html
```

You should see the **DESALINATION PLANT SIMULATOR** page with controls and gauges.

## 6) Basic run flow

1. Click **START SIMULATION**.
2. Change attacker controls (pressure/chlorination/pH/spoof toggles).
3. Observe:
   - process view,
   - operator gauges,
   - impact assessment,
   - active alerts,
   - terminal command log.
4. Click **STOP SIMULATION** when finished.

## 7) Optional Gemini incident analysis

After stopping simulation:

1. Click **Analyze Incident**.
2. Enter Gemini API key when prompted.
3. Wait for analysis modal output.

Notes:
- Key is stored in browser local storage under `GEMINI_API_KEY`.
- Key is never written to repository files by this app.

## 8) Stop server

Return to server terminal and press:

```text
Ctrl + C
```

## 9) Troubleshooting

### Browser opens blank page or module errors
- Confirm server is running from repo root.
- Ensure URL is `http://localhost:4173/index.html`.
- Hard refresh browser (`Ctrl+Shift+R`).

### `python: command not found`
Try:

```bash
python3 -m http.server 4173
```

### Gemini analysis fails
- Confirm internet access.
- Confirm valid Gemini API key.
- Re-run and re-enter key.

## 10) Security recommendation for production

Current implementation performs Gemini calls from browser for demo simplicity.
For production/public deployment, move AI calls behind a backend proxy and keep provider keys server-side only.
