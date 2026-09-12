/**
 * Manual delivery after human approval.
 *
 * wa.me can open a chat with prefilled text. It cannot attach audio.
 * Native WhatsApp voice notes (Ogg/Opus, Cloud API `voice: true`) are the
 * later path — only inside an owner-initiated service window.
 */

export function whatsappDigits(phoneE164: string): string {
  return phoneE164.replace(/\D/g, "");
}

export function waMeUrl(phoneE164: string, text: string): string {
  const digits = whatsappDigits(phoneE164);
  const url = new URL(`https://wa.me/${digits}`);
  url.searchParams.set("text", text);
  return url.toString();
}

export function wavFilename(contactName: string): string {
  const slug = contactName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);
  return `recado-${slug || "proprietario"}.wav`;
}
