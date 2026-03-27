import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Analytics Admin",
  description: "Protected analytics dashboard for SP.DEV",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AnalyticsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
