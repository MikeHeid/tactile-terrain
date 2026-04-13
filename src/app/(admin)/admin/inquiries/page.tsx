import { prisma } from "@/lib/prisma";
import { AdminShell } from "@/components/admin/admin-shell";
import { InquiriesInbox } from "@/components/admin/inquiries-inbox";
export const dynamic = "force-dynamic";

export default async function AdminInquiriesPage() {
  const [contacts, inquiries] = await Promise.all([
    prisma.contactSubmission.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.customOrderInquiry.findMany({ orderBy: { createdAt: "desc" } }),
  ]);

  return (
    <AdminShell>
      <h1 className="text-2xl font-bold font-[family-name:var(--font-space-grotesk)] mb-8">
        Inquiries
      </h1>
      <InquiriesInbox contacts={contacts} inquiries={inquiries} />
    </AdminShell>
  );
}
