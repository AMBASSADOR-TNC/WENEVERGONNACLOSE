import routing from "./domain-routing-manifest.json" with { type: "json" };

const canonicalEntry = new URL(routing.canonical_entry);
const managedHosts = new Set(routing.domains.map(({ host }) => host));

export default {
  fetch(request) {
    const requestUrl = new URL(request.url);
    const host = requestUrl.hostname.toLowerCase();

    if (!managedHosts.has(host)) {
      return new Response("Not found", { status: 404 });
    }

    const destination = new URL(requestUrl.pathname + requestUrl.search, canonicalEntry);
    return Response.redirect(destination, routing.redirect_status);
  }
};
