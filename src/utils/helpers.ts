import { createHmac, randomUUID } from "crypto";

export function generateId(): string {
  return randomUUID();
}

export function getCurrentTimestamp(): Date {
  return new Date();
}

export function generateSignature(
  payload: Record<string, unknown>,
  secret: string,
): string {
  return createHmac("sha256", secret)
    .update(JSON.stringify(payload))
    .digest("hex");
}
