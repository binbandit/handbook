import { headers } from "next/headers";

export async function requestOrigin() {
  const requestHeaders = await headers();
  const forwardedHost = requestHeaders
    .get("x-forwarded-host")
    ?.split(",")[0]
    .trim();
  const host = forwardedHost || requestHeaders.get("host") || "localhost:3000";
  const forwardedProtocol = requestHeaders
    .get("x-forwarded-proto")
    ?.split(",")[0]
    .trim();
  const protocol =
    forwardedProtocol || (host.startsWith("localhost") ? "http" : "https");

  try {
    return new URL(`${protocol}://${host}`).origin;
  } catch {
    return "http://localhost:3000";
  }
}

export function socialImage(origin: string) {
  return {
    url: new URL("/og.png", origin).toString(),
    width: 1731,
    height: 909,
    alt: "Bandit's Handbook: give AI a better way to work",
  };
}
