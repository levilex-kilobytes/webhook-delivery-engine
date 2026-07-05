import { describe, expect, it } from "vitest";
import { generateSignature } from "../src/utils/helpers";

describe("generateSignature", () => {
  it("should generate a consistent HMAC signature", () => {
    const payload = {
      orderId: 1,
      status: "paid",
    };

    const secret = "my-secret-key";

    const first = generateSignature(payload, secret);
    const second = generateSignature(payload, secret);

    expect(first).toBe(second);
  });

  it("should generate different signatures for different secrets", () => {
    const payload = {
      orderId: 1,
    };

    const first = generateSignature(payload, "secret-one");
    const second = generateSignature(payload, "secret-two");

    expect(first).not.toBe(second);
  });
});
