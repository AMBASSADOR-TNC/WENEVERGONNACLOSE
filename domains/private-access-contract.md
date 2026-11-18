# Private access-code contract

## Public experience

The public entry asks for no name, email address, account name, public profile,
or personal identifier. A stick figure is the welcome representation and is
held only in browser memory during the entry sequence.

After a visitor completes that sequence, the access service may issue an opaque
private code for the designated side. The code is private access material, not
a public identity and must never appear in a URL, analytics event, or client
log.

## Required server controls

The static site and an edge redirect alone cannot enforce one-time entry,
protect a private code, or prevent direct access to a protected destination.
Before activating a protected host, deploy a reviewed server-side resolver that:

1. Generates high-entropy opaque codes and stores only a slow hash.
2. Associates each code with a designated protocol/side and expiry, never a
   public name or profile.
3. Accepts a code only through a secure POST, exchanges it for a signed,
   `HttpOnly`, `Secure`, `SameSite=Lax` session cookie, and never reflects the
   code.
4. Verifies that cookie on every protected-host request before returning a
   destination.
5. Returns only an allowlisted HTTPS destination from the ecosystem-domain
   manifest.
6. Rate-limits issuance and verification, records only operational security
   events with a short documented retention period, and provides an abuse and
   recovery path.
7. Fails closed for protected content. A failed resolver check may return the
   visitor to the public universal entry but must never grant a destination.

## One-time-visitor boundary

Without a name, email address, account, or another durable identifier, a system
cannot truthfully guarantee one registration per human. A privacy-preserving
service can enforce one-time code redemption and a browser session, but any
stronger uniqueness rule requires a separate, explicitly approved anti-abuse
design. Do not claim IP-, email-, or person-level uniqueness until that design
exists and is reviewed.
