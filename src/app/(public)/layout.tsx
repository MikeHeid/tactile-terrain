import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { getStudioInfo } from "@/lib/studio-info";

export const dynamic = "force-dynamic";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const studioInfo = await getStudioInfo();

  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer studioInfo={studioInfo} />
    </>
  );
}
