# Security Policy

## Supported Versions

The project is pre-release; no production versions are currently published.

## Reporting a Vulnerability

Please do **not** disclose vulnerabilities publicly in issues.
Report privately to maintainers with:
- Impact summary
- Reproduction steps
- Affected files/areas
- Suggested mitigation (if known)

## Secret Handling Policy

- Never commit secrets (`.env`, API keys, tokens, certificates, private keys).
- Store credentials in environment variables or a managed secret store.
- Revoke and rotate credentials immediately if exposure is suspected.
- Add automated secret scanning in CI before public launch.

## Gemini / Google AI Studio Credentials

If Gemini/AI Studio integration is added later:
- Keep `GEMINI_API_KEY` / `GOOGLE_API_KEY` outside source control.
- Do not hardcode credential values in application code.
