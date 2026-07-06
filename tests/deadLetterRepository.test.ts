import { beforeEach, describe, expect, it } from "vitest";
import deadLetterRepository from "../src/repositories/deadLetterRepository";

describe("DeadLetterRepository", () => {
  beforeEach(() => {
    deadLetterRepository.clear();
  });

  it("should save a dead-lettered job", () => {
    deadLetterRepository.save({
      id: "1",
      destination: "https://example.com",
      payload: {},
      attempts: 5,
      nextAttemptAt: new Date(),
      status: "failed",
      attemptHistory: [],
    });

    expect(deadLetterRepository.getAll()).toHaveLength(1);
  });

  it("should find a dead-lettered job", () => {
    const job = {
      id: "1",
      destination: "https://example.com",
      payload: {},
      attempts: 5,
      nextAttemptAt: new Date(),
      status: "failed" as const,
      attemptHistory: [],
    };

    deadLetterRepository.save(job);

    expect(deadLetterRepository.findById("1")).toEqual(job);
  });

  it("should remove a dead-lettered job", () => {
    deadLetterRepository.save({
      id: "1",
      destination: "https://example.com",
      payload: {},
      attempts: 5,
      nextAttemptAt: new Date(),
      status: "failed",
      attemptHistory: [],
    });

    deadLetterRepository.remove("1");

    expect(deadLetterRepository.getAll()).toHaveLength(0);
  });
});
