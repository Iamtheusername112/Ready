"use server";

import { requireUserId } from "@/lib/auth/guards";
import { createServiceClient } from "@/lib/supabase/admin";
import { randomUUID } from "crypto";

const BUCKET = "kyc-uploads";
const MAX_BYTES = 5 * 1024 * 1024; // 5 MB per file

const FILE_FIELDS = [
  "government_id",
  "drivers_license",
  "birth_certificate",
  "tax_id_document",
  "utility_bill",
] as const;

function sanitizeFilename(name: string): string {
  const base = name.split(/[/\\]/).pop() ?? "file";
  return base.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 120);
}

/** US SSN / ITIN / EIN style: exactly 9 digits after stripping separators. */
function normalizeNineDigits(raw: string): string {
  return raw.replace(/\D/g, "").slice(0, 9);
}

function friendlyLoanKycError(message: string): string {
  const m = message.toLowerCase();
  if (
    m.includes("schema cache") ||
    (m.includes("could not find the table") && m.includes("loan_kyc"))
  ) {
    return (
      "The `loan_kyc_submissions` table is missing. In Supabase → SQL Editor, run `supabase/ensure-loan-kyc.sql` " +
      "(same project as in `.env.local`), then wait a minute and retry."
    );
  }
  return message;
}

export async function submitLoanKyc(formData: FormData) {
  const userId = await requireUserId();
  const supabase = createServiceClient();
  if (!supabase) {
    return { ok: false as const, error: "Database not configured." };
  }

  const fullName = String(formData.get("fullName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const ssn = normalizeNineDigits(String(formData.get("ssn") ?? ""));
  const taxId = normalizeNineDigits(String(formData.get("taxId") ?? ""));
  const consent = formData.get("consent") === "on" || formData.get("consent") === "true";

  if (!fullName || !email || !phone) {
    return { ok: false as const, error: "Full name, email, and phone are required." };
  }
  if (!consent) {
    return { ok: false as const, error: "Please confirm consent to continue." };
  }
  if (ssn.length !== 9) {
    return { ok: false as const, error: "SSN must be exactly 9 digits (you may use dashes when typing)." };
  }
  if (taxId.length !== 9) {
    return { ok: false as const, error: "Tax ID must be exactly 9 digits (dashes optional)." };
  }

  let uploaded = 0;
  for (const key of FILE_FIELDS) {
    const f = formData.get(key);
    if (f instanceof File && f.size > 0) {
      uploaded++;
      if (f.size > MAX_BYTES) {
        return { ok: false as const, error: `Each file must be under ${MAX_BYTES / 1024 / 1024} MB.` };
      }
    }
  }
  if (uploaded === 0) {
    return { ok: false as const, error: "Please upload at least one document (PDF or image)." };
  }

  const submissionId = randomUUID();
  const attachmentPaths: Record<string, string> = {};

  for (const key of FILE_FIELDS) {
    const f = formData.get(key);
    if (!(f instanceof File) || f.size === 0) continue;

    const objectPath = `${userId}/${submissionId}/${key}_${sanitizeFilename(f.name)}`;
    const buffer = Buffer.from(await f.arrayBuffer());
    const { error: upErr } = await supabase.storage.from(BUCKET).upload(objectPath, buffer, {
      contentType: f.type || "application/octet-stream",
      upsert: false,
    });
    if (upErr) {
      return {
        ok: false as const,
        error:
          upErr.message.includes("Bucket not found") || upErr.message.includes("not found")
            ? "Storage bucket missing. In Supabase: run migrations or create bucket `kyc-uploads` (private)."
            : upErr.message,
      };
    }
    attachmentPaths[key] = objectPath;
  }

  // Storing full SSN/TIN in plaintext is high risk; use encryption or a PCI/GLBA-compliant vault in production.
  const { error: insErr } = await supabase.from("loan_kyc_submissions").insert({
    id: submissionId,
    userid: userId,
    full_name: fullName,
    email,
    phone,
    ssn,
    tax_id: taxId,
    attachment_paths: attachmentPaths,
    consent_at: new Date().toISOString(),
  });

  if (insErr) {
    return { ok: false as const, error: friendlyLoanKycError(insErr.message) };
  }

  return { ok: true as const, id: submissionId };
}
