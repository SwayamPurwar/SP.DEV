import type { Metadata } from "next";
import { createPageMetadata } from "@/utils/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Message Sent",
  description: "Confirmation page for successful portfolio contact submissions.",
  path: "/success",
});

export default function SuccessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
