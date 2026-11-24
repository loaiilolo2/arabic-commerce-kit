# Contributing

Thanks for helping improve arabic-commerce-kit!

## Ground rules

- Zero runtime dependencies — keep it that way. Dev-only tooling (TypeScript, Vitest) is fine.
- Every new function needs tests in `test/` and a short usage example in the README.
- Code and comments in English; user-facing strings (like the WhatsApp order message) in Arabic.
- Numbers, prices and phone rules must reflect how merchants in Egypt and the Arab world actually work — if a rule differs by country, add it to `COUNTRY_RULES` with a test.

## Workflow

1. Fork the repo and create a branch: `feat/my-change`.
2. Run `npm install`, then `npm test` and `npm run typecheck` before opening a PR.
3. Open a pull request describing the merchant problem your change solves.

## Ideas welcome

- More country rules (MA, DZ, IQ, SD…).
- Zakat / VAT helpers for invoices.
- Arabic pluralization for product quantities.
