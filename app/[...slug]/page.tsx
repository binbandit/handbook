import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { handbookPageBySlug, handbookPages } from "../content";
import { requestOrigin, socialImage } from "../site-url";
import { Guide } from "../ui/Guide";

type RouteProps = {
  params: Promise<{ slug: string[] }>;
};

export function generateStaticParams() {
  return handbookPages.map((page) => ({
    slug: page.slug.split("/").filter(Boolean),
  }));
}

export async function generateMetadata({ params }: RouteProps): Promise<Metadata> {
  const { slug } = await params;
  const page = handbookPageBySlug.get(`/${slug.join("/")}`);

  if (!page) return {};

  const origin = await requestOrigin();
  const image = socialImage(origin);

  return {
    title: page.navTitle,
    description: page.description,
    alternates: {
      canonical: `${origin}${page.slug}`,
    },
    openGraph: {
      title: `${page.title} | Bandit's Handbook`,
      description: page.description,
      type: "article",
      url: `${origin}${page.slug}`,
      siteName: "Bandit's Handbook",
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: `${page.title} | Bandit's Handbook`,
      description: page.description,
      images: [image.url],
    },
  };
}

export default async function HandbookRoute({ params }: RouteProps) {
  const { slug } = await params;
  const page = handbookPageBySlug.get(`/${slug.join("/")}`);

  if (!page) notFound();

  return <Guide page={page} />;
}
