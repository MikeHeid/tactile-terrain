import { prisma } from "@/lib/prisma";

interface Attachment {
  filename: string;
  content: Buffer;
  contentType?: string;
}

interface SendEmailOptions {
  subject: string;
  html: string;
  attachments?: Attachment[];
}

export async function sendNotificationEmail({ subject, html, attachments }: SendEmailOptions) {
  const [apiKeySetting, toEmailSetting, fromSetting] = await Promise.all([
    prisma.siteContent.findUnique({ where: { key: "resend_api_key" } }),
    prisma.siteContent.findUnique({ where: { key: "notification_email" } }),
    prisma.siteContent.findUnique({ where: { key: "email_from_address" } }),
  ]);

  const apiKey = apiKeySetting?.content;
  const toEmail = toEmailSetting?.content;
  const fromAddress = fromSetting?.content || "noreply@tactileterrain.ca";

  if (!apiKey || !toEmail) {
    console.log("Email not configured — skipping notification. Set Resend API Key and Notification Email in Admin → Site Content.");
    return;
  }

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);

    await resend.emails.send({
      from: `Tactile Terrain <${fromAddress}>`,
      to: toEmail,
      subject,
      html,
      attachments: attachments?.map((a) => ({
        filename: a.filename,
        content: a.content,
        contentType: a.contentType,
      })),
    });

    console.log(`Notification email sent to ${toEmail}: ${subject}`);
  } catch (error) {
    console.error("Failed to send notification email:", error);
  }
}

/** Fetch a file URL and return it as an attachment buffer */
export async function fileUrlToAttachment(
  fileUrl: string,
  filename?: string
): Promise<Attachment | null> {
  try {
    const res = await fetch(fileUrl);
    if (!res.ok) return null;

    const buffer = Buffer.from(await res.arrayBuffer());
    const contentType = res.headers.get("content-type") || "application/octet-stream";
    const inferredName = filename || fileUrl.split("/").pop() || "attachment";

    return {
      filename: inferredName,
      content: buffer,
      contentType,
    };
  } catch (error) {
    console.error("Failed to fetch attachment:", error);
    return null;
  }
}

export function contactEmailHtml(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #1A1D24; border-bottom: 2px solid #2D7A9C; padding-bottom: 8px;">
        New Contact Message
      </h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; color: #6B7589; width: 100px;">Name</td>
          <td style="padding: 8px 0; color: #1A1D24; font-weight: 500;">${escapeHtml(data.name)}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6B7589;">Email</td>
          <td style="padding: 8px 0;"><a href="mailto:${escapeHtml(data.email)}" style="color: #2D7A9C;">${escapeHtml(data.email)}</a></td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6B7589;">Subject</td>
          <td style="padding: 8px 0; color: #1A1D24; font-weight: 500;">${escapeHtml(data.subject)}</td>
        </tr>
      </table>
      <div style="margin-top: 16px; padding: 16px; background: #F5F6F8; border-radius: 8px; color: #1A1D24; white-space: pre-wrap;">
        ${escapeHtml(data.message)}
      </div>
      <p style="margin-top: 16px; font-size: 12px; color: #6B7589;">
        Sent from the Tactile Terrain website contact form.
      </p>
    </div>
  `;
}

export function inquiryEmailHtml(data: {
  name: string;
  email: string;
  organization?: string;
  projectType: string;
  scale?: string;
  timeline?: string;
  budgetRange?: string;
  description: string;
  fileUrl?: string;
}) {
  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #1A1D24; border-bottom: 2px solid #C9A84C; padding-bottom: 8px;">
        New Custom Project Inquiry
      </h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; color: #6B7589; width: 120px;">Name</td>
          <td style="padding: 8px 0; color: #1A1D24; font-weight: 500;">${escapeHtml(data.name)}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6B7589;">Email</td>
          <td style="padding: 8px 0;"><a href="mailto:${escapeHtml(data.email)}" style="color: #2D7A9C;">${escapeHtml(data.email)}</a></td>
        </tr>
        ${data.organization ? `<tr><td style="padding: 8px 0; color: #6B7589;">Organization</td><td style="padding: 8px 0; color: #1A1D24;">${escapeHtml(data.organization)}</td></tr>` : ""}
        <tr>
          <td style="padding: 8px 0; color: #6B7589;">Project Type</td>
          <td style="padding: 8px 0; color: #1A1D24;">${escapeHtml(data.projectType)}</td>
        </tr>
        ${data.scale ? `<tr><td style="padding: 8px 0; color: #6B7589;">Scale / Size</td><td style="padding: 8px 0; color: #1A1D24;">${escapeHtml(data.scale)}</td></tr>` : ""}
        ${data.timeline ? `<tr><td style="padding: 8px 0; color: #6B7589;">Timeline</td><td style="padding: 8px 0; color: #1A1D24;">${escapeHtml(data.timeline)}</td></tr>` : ""}
        ${data.budgetRange ? `<tr><td style="padding: 8px 0; color: #6B7589;">Budget Range</td><td style="padding: 8px 0; color: #1A1D24;">${escapeHtml(data.budgetRange)}</td></tr>` : ""}
      </table>
      <div style="margin-top: 16px; padding: 16px; background: #F5F6F8; border-radius: 8px; color: #1A1D24; white-space: pre-wrap;">
        ${escapeHtml(data.description)}
      </div>
      ${data.fileUrl ? `<p style="margin-top: 12px; font-size: 13px; color: #6B7589;">📎 File attached to this email (also available at: <a href="${escapeHtml(data.fileUrl)}" style="color: #2D7A9C;">link</a>)</p>` : ""}
      <p style="margin-top: 16px; font-size: 12px; color: #6B7589;">
        Sent from the Tactile Terrain custom project inquiry form.
      </p>
    </div>
  `;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
