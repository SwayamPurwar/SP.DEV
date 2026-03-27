import type { Metadata } from "next";
import { createPageMetadata } from "@/utils/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Contact",
  description:
    "Start a project with Swayam Purwar. Share your requirements and get a response within 24-48 hours.",
  path: "/contact",
});

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
