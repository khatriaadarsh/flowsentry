# Security policy

## Reporting a vulnerability

Please do not report suspected vulnerabilities in a public issue. Contact the project maintainers privately with a description, affected files or endpoints, and steps to reproduce. Avoid including real credentials or personal data in reports.

## Deployment guidance

- Store `GOOGLE_GEMINI_API_KEY` (or the legacy `GEMINI_API_KEY`) only in server-side environment configuration. Do not use a `NEXT_PUBLIC_` prefix.
- Use HTTPS and restrict access to incident data in production deployments.
- The included incident and diagnostic data are examples; replace them with an authenticated, access-controlled data source before production use.

## Scope

This is a demonstration project and does not currently provide authentication, durable incident storage, or production service integrations. Do not use it to handle sensitive operational data without adding those controls.
