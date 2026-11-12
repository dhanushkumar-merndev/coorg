"use server";

import { contactPhone } from "@/data/contact";
import { emailPattern, enquiryLimits, interestOptions, isValidPhone, plotQuestions, type EnquiryResult } from "@/data/enquiry";

const genericError = `We couldn't send your enquiry just now. Please try again, or call ${contactPhone}.`;

function read(formData: FormData, key: string, max: number) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

/**
 * Saves an enquiry as a new row in the Google Sheet behind
 * ENQUIRY_SHEET_WEBHOOK_URL (see integrations/google-sheets/enquiry-webhook.gs).
 * Public form, so no auth: everything is re-validated here and the webhook is
 * protected by a shared secret that never leaves the server.
 */
export async function submitEnquiry(formData: FormData): Promise<EnquiryResult> {
  // Honeypot: real visitors never see or fill this field.
  if (read(formData, "company", 200)) return { ok: true };

  const name = read(formData, "name", enquiryLimits.name);
  const phone = read(formData, "phone", enquiryLimits.phone);
  const email = read(formData, "email", enquiryLimits.email);
  const interest = read(formData, "interest", 100);
  const note = read(formData, "note", enquiryLimits.note);
  const page = read(formData, "page", enquiryLimits.page);

  const answers: Record<string, string> = {};
  for (const question of plotQuestions) {
    const value = read(formData, question.name, 100);
    if (!(question.options as readonly string[]).includes(value)) return { ok: false, error: `Please answer: ${question.legend}` };
    answers[question.name] = value;
  }

  if (name.length < 2) return { ok: false, error: "Please enter your full name." };
  if (!isValidPhone(phone)) return { ok: false, error: "Please enter a valid phone number." };
  if (!emailPattern.test(email)) return { ok: false, error: "Please enter a valid email address." };
  if (interest && !(interestOptions as readonly string[]).includes(interest)) return { ok: false, error: genericError };

  const url = process.env.ENQUIRY_SHEET_WEBHOOK_URL;
  const secret = process.env.ENQUIRY_SHEET_SECRET;
  if (!url || !secret) {
    console.error("[enquiry] ENQUIRY_SHEET_WEBHOOK_URL or ENQUIRY_SHEET_SECRET is not set; enquiry was not saved.");
    return { ok: false, error: genericError };
  }

  try {
    const response = await fetch(url, {
      method: "POST",
      // text/plain keeps Apps Script happy (no CORS preflight semantics server-side either way).
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({
        secret,
        submittedAt: new Date().toISOString(),
        name,
        phone,
        email,
        ...answers,
        interest,
        note,
        page,
      }),
      cache: "no-store",
      redirect: "follow",
      signal: AbortSignal.timeout(10_000),
    });
    const result = (await response.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
    if (!response.ok || !result?.ok) {
      console.error("[enquiry] Sheet webhook rejected the enquiry", response.status, result?.error ?? "");
      return { ok: false, error: genericError };
    }
    return { ok: true };
  } catch (error) {
    console.error("[enquiry] Sheet webhook request failed", error);
    return { ok: false, error: genericError };
  }
}
