"use server";

import { EMAIL } from "@/data/social";

export async function sendContactMessage(formData: FormData): Promise<{ ok: boolean; error?: string }> {
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const message = String(formData.get("message") || "").trim();

  if (!name || !email || !message) {
    return { ok: false, error: "Missing fields" };
  }

  try {
    const response = await fetch(`https://formsubmit.co/ajax/${EMAIL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        message,
        _subject: `Portafolio · ${name}`,
        _replyto: email,
        _template: "table",
        _captcha: "false",
        _honey: "",
      }),
    });

    if (!response.ok) {
      return { ok: false, error: "Provider error" };
    }

    return { ok: true };
  } catch {
    return { ok: false, error: "Network error" };
  }
}
