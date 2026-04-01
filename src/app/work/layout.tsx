import type { Metadata } from "next";
import { createPageMetadata } from "@/utils/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Work - Swayam Purwar",
  description:
    "Explore a curated portfolio of product design, full-stack engineering, fintech systems, and AI-powered projects by Swayam Purwar.",
  path: "/work",
});

export default function WorkLayout({ children }: { children: React.ReactNode }) {
  return <div className="work-route-layout">{children}</div>;
}