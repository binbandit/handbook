import type { Metadata, Viewport } from "next";
import { requestOrigin, socialImage } from "./site-url";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const origin = await requestOrigin();
  const image = socialImage(origin);

  return {
    metadataBase: new URL(origin),
    title: {
      default: "Bandit's Handbook",
      template: "%s | Bandit's Handbook",
    },
    description:
      "Brayden's public AI operating system: instructions, harnesses, tools, playbooks, and portable configuration for dependable engineering work.",
    applicationName: "Bandit's Handbook",
    authors: [{ name: "Brayden" }],
    creator: "Brayden",
    category: "technology",
    alternates: {
      canonical: origin,
    },
    openGraph: {
      type: "website",
      url: origin,
      siteName: "Bandit's Handbook",
      title: "Bandit's Handbook",
      description:
        "The field-tested system for giving AI better context, sharper tools, and a real verification loop.",
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: "Bandit's Handbook",
      description:
        "The field-tested system for giving AI better context, sharper tools, and a real verification loop.",
      images: [image.url],
    },
  };
}

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#101210",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
