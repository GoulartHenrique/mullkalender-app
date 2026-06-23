// Reads JWT_SECRET from the environment. Throws immediately if it's
// missing, rather than silently falling back to a hardcoded value —
// a hardcoded fallback would make every token forgeable if the env
// var ever fails to load (e.g. misconfigured deploy).
export function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error(
      "JWT_SECRET is not set. Add it to your .env file before starting the server."
    );
  }
  return secret;
}