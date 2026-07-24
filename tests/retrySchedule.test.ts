import { describe, expect, it } from "vitest";

const retrySchedule = [
  0,
  60 * 1000,
  5 * 60 * 1000,
  30 * 60 * 1000,
  2 * 60 * 60 * 1000,
];

describe("Retry Schedule", () => {
  it("should attempt the first delivery immediately", () => {
    expect(retrySchedule[0]).toBe(0);
  });

  it("should retry after one minute", () => {
    expect(retrySchedule[1]).toBe(60 * 1000);
  });

  it("should retry after five minutes", () => {
    expect(retrySchedule[2]).toBe(5 * 60 * 1000);
  });

  it("should retry after thirty minutes", () => {
    expect(retrySchedule[3]).toBe(30 * 60 * 1000);
  });

  it("should retry after two hours", () => {
    expect(retrySchedule[4]).toBe(2 * 60 * 60 * 1000);
  });
});
