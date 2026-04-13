import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Admin — Tactile Terrain",
    template: "%s | Admin",
  },
  robots: "noindex, nofollow",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
