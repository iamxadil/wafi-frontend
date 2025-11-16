export default async (request, context) => {
  const url = new URL(request.url);
  const ua = (request.headers.get("user-agent") || "").toLowerCase();

  // Only care about product pages
  const match = url.pathname.match(/^\/product\/([a-zA-Z0-9]+)/);
  if (!match) return; // Not a product page, let React handle it

  const id = match[1];

  const isBot =
    ua.includes("facebook") ||
    ua.includes("whatsapp") ||
    ua.includes("twitterbot") ||
    ua.includes("telegram") ||
    ua.includes("discord") ||
    ua.includes("linkedinbot") ||
    ua.includes("bot");

  if (isBot) {
    // Redirect bot to backend preview route
    return Response.redirect(
      `https://www.api.alwafi.net/api/products/preview/${id}`,
      302
    );
  }

  // Human → continue normally to React
  return;
};
