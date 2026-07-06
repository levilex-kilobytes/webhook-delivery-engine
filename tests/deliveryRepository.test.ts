import { beforeEach, describe, expect, it } from "vitest";
import deliveryRepository from "../src/repositories/deliveryRepository";

describe("DeliveryRepository", () => {
  beforeEach(() => {
    deliveryRepository.getAll().splice(0);
  });

  it("should save a job", () => {
    const job = {
      id: "1",
      destination: "https://example.com",
      payload: {},
      attempts: 0,
      nextAttemptAt: new Date(),
      status: "pending" as const,
      attemptHistory: [],
    };

    deliveryRepository.save(job);

    expect(deliveryRepository.getAll()).toHaveLength(1);
  });

  it("should find a job by id", () => {
    const job = {
      id: "1",
      destination: "https://example.com",
      payload: {},
      attempts: 0,
      nextAttemptAt: new Date(),
      status: "pending" as const,
      attemptHistory: [],
    };

    deliveryRepository.save(job);

    expect(deliveryRepository.getAll().find((j) => j.id === "1")).toEqual(job);
  });

  it("should update a job", () => {
    const job = {
      id: "1",
      destination: "https://example.com",
      payload: {},
      attempts: 0,
      nextAttemptAt: new Date(),
      status: "pending" as const,
      attemptHistory: [],
    };

    deliveryRepository.save(job);

    const updated = { ...job, status: "completed" as const };

    deliveryRepository.update(updated);

    expect(deliveryRepository.getAll().find((j) => j.id === "1")?.status).toBe(
      "completed",
    );
  });

  it("should return pending jobs", () => {
    deliveryRepository.save({
      id: "1",
      destination: "https://example.com",
      payload: {},
      attempts: 0,
      nextAttemptAt: new Date(),
      status: "pending" as const,
      attemptHistory: [],
    });

    deliveryRepository.save({
      id: "2",
      destination: "https://example.com",
      payload: {},
      attempts: 0,
      nextAttemptAt: new Date(),
      status: "completed" as const,
      attemptHistory: [],
    });

    expect(deliveryRepository.findPending()).toHaveLength(1);
  });
});
