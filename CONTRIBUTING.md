# Contributing

Contributions are welcome. For substantial changes, open an issue first to discuss the intended behavior.

## Local setup

1. Install Node.js 20.9+ and npm.
2. Run `npm install`.
3. Copy `.env.example` to `.env.local`. A model key is optional.
4. Start the app with `npm run dev`.

## Before opening a pull request

Run `npm test`, `npm run lint`, and `npm run build`. Include or update tests when changing validation, diagnostic behavior, or API response shapes. Keep sample incidents fictional and do not commit secrets or real customer data.

## Pull requests

Describe the user-visible change, note any API or configuration impact, and include screenshots for UI changes where useful. Keep changes focused and follow the existing JavaScript and CSS conventions.
