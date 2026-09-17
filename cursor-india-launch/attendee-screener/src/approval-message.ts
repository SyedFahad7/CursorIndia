const DEFAULT_WHATSAPP =
  "https://chat.whatsapp.com/ESTicelwIAODZXd7haWLQx?s=cl&p=i&ilr=1";

export function whatsappInviteUrl(): string {
  return (
    process.env.WHATSAPP_INVITE_URL?.trim() ||
    process.env.LUMA_APPROVAL_WHATSAPP_URL?.trim() ||
    DEFAULT_WHATSAPP
  );
}

/** Paste this into Luma's "optional, custom message" box when Approving (Notify Guest on). */
export function lumaApprovalMessage(name?: string): string {
  const first = name?.trim().split(/\s+/)[0];
  const hi = first ? `Hi ${first},` : "Hi,";
  const link = whatsappInviteUrl();

  return `${hi}

You're approved for the event — excited to have you.

Please join the WhatsApp group for updates, venue details, and day-of coordination:
${link}

See you there.`;
}

export function approvalMessageForDecision(
  decision: string,
  name?: string,
): string {
  if (decision !== "accept") return "";
  return lumaApprovalMessage(name);
}
