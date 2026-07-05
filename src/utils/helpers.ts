import { randomUUID } from "crypto";

export function generateId(): string {
  return randomUUID();
}

export function getCurrentTimestamp(): Date {
  return new Date();
}
