import { prisma } from "@/lib/prisma";
import { AdminShell } from "@/components/admin/admin-shell";
import { Images, Mail, Users, FileEdit } from "lucide-react";
export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [galleryCount, contactCount, inquiryCount, unreadContacts, unreadInquiries] =
    await Promise.all([
      prisma.galleryItem.count(),
      prisma.contactSubmission.count(),
      prisma.customOrderInquiry.count(),
      prisma.contactSubmission.count({ where: { read: false } }),
      prisma.customOrderInquiry.count({ where: { read: false } }),
    ]);

  const stats: { label: string; value: number; icon: typeof Images; unread?: number }[] = [
    { label: "Gallery Items", value: galleryCount, icon: Images },
    { label: "Contact Messages", value: contactCount, unread: unreadContacts, icon: Mail },
    { label: "Custom Inquiries", value: inquiryCount, unread: unreadInquiries, icon: FileEdit },
    { label: "Team Members", value: 0, icon: Users },
  ];

  return (
    <AdminShell>
      <h1 className="text-2xl font-bold font-[family-name:var(--font-space-grotesk)] mb-8">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="p-5 rounded-lg bg-surface border border-border"
          >
            <div className="flex items-center justify-between mb-3">
              <stat.icon className="w-5 h-5 text-accent" />
              {stat.unread != null && stat.unread > 0 && (
                <span className="text-xs bg-accent/20 text-accent px-2 py-0.5 rounded-full">
                  {stat.unread} new
                </span>
              )}
            </div>
            <p className="text-2xl font-bold font-[family-name:var(--font-space-grotesk)]">
              {stat.value}
            </p>
            <p className="text-sm text-muted mt-1">{stat.label}</p>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
