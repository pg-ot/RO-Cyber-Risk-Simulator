# Security Policy

## Supported Versions

This project is pre-release and does not currently publish versioned binaries.

## Reporting a Vulnerability

If you discover a security issue, please do not open a public issue with exploit details.
Instead, report privately to the project maintainers with:
- A clear description of the issue.
- Reproduction steps.
- Potential impact.
- Suggested remediation (if available).

## Secret Handling Requirements

- Never commit API keys, tokens, passwords, or `.env` files.
- Store credentials in environment variables or a secret manager.
- Rotate keys immediately if exposure is suspected.
- Validate pull requests with automated secret scanning before merge.

## AI Provider Credential Guidance

For any future Gemini / Google AI Studio integration:
- Keep `GEMINI_API_KEY` / `GOOGLE_API_KEY` only in runtime environment configuration.
- Do not hardcode provider endpoints or keys in source control.
