import routing from "./domain-routing-manifest.json" with { type: "json" };

const universalEntry = new URL(routing.universal_entry);
const managedHosts = new Set(routing.domains.map(({ host }) => host));

function universalEntryRedirect() {
  return Response.redirect(universalEntry, 302);
}

export default {
  async fetch(request, env) {
    const requestUrl = new URL(request.url);
    const host = requestUrl.hostname.toLowerCase();

    if (!managedHosts.has(host)) {
      return new Response("Not found", { status: 404 });
    }

    if (!env.ACCESS_RESOLVER_URL) {
      return universalEntryRedirect();
    }

    const accessResponse = await fetch(new URL("/access/resolve", env.ACCESS_RESOLVER_URL), {
      headers: {
        Cookie: request.headers.get("Cookie") || "",
        "X-Requested-Host": host
      }
    });

    if (!accessResponse.ok) {
      return universalEntryRedirect();
    }

    const access = await accessResponse.json();
    if (access.status !== "granted" || typeof access.destination !== "string") {
      return universalEntryRedirect();
    }

    let destination;
    try {
      destination = new URL(access.destination);
    } catch {
      return universalEntryRedirect();
    }

    if (destination.protocol !== "https:" || !managedHosts.has(destination.hostname)) {
      return universalEntryRedirect();
    }

    return Response.redirect(destination, 302);
  }
};
