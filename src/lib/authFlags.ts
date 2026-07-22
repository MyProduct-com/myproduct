/**
 * TEMPORARY SWITCH — flip to `false` once real login is wired up end-to-end
 * (DB migrated + seeded, credentials verified). While `true`, every
 * dashboard layout skips its auth redirect so pages can be built/viewed
 * without signing in. Login, signup, and next-auth themselves are untouched
 * — only the *enforcement* is bypassed.
 */
export const AUTH_DISABLED = true;
