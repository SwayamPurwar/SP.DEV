import type { Metadata } from "next";

const SITE_NAME = "Swayam Purwar";
const SITE_URL = "https://swayampurwar.com";
const DEFAULT_OG_IMAGE = "/assets/images/profile/swayam-purwar.webp";

type SeoInput = {
  title: string;
  description: string;
  path?: string;
  image?: string;
};

export function createPageMetadata({ title, description, path = "/", image }: SeoInput): Metadata {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const canonicalUrl = new URL(normalizedPath, SITE_URL).toString();
  const ogImage = image || DEFAULT_OG_IMAGE;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: "website",
      url: canonicalUrl,
      siteName: SITE_NAME,
      title,
      description,
      images: [{ url: ogImage }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}
