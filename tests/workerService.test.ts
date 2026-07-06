import { beforeEach, describe, expect, it, vi } from "vitest";
import deliveryRepository from "../src/repositories/deliveryRepository";
import webhookService from "../src/services/webhookService";
import workerService from "../src/services/workerService";

describe("WorkerService", () => {
  beforeEach(() => {
    deliveryRepository.getAll().splice(0);
  });

  it("should mark a successful job as completed", async () => {
    vi.spyOn(webhookService, "send").mockResolvedValue({
      success: true,
      timestamp: new Date(),
      attempt: 1,
      message: "OK",
    });

    const job = {
      id: "1",
      destination: "https://example.com",
      payload: {},
      attempts: 0,
      attemptHistory: [],
      nextAttemptAt: new Date(),
      status: "pending" as const,
    };

    deliveryRepository.save(job);

    await workerService.process();

    expect(
      deliveryRepository.getAll().find((job) => job.id === "1")?.status,
    ).toBe("completed");
  });

  it("should retry a failed delivery", async () => {
    vi.spyOn(webhookService, "send").mockResolvedValue({
      success: false,
      timestamp: new Date(),
      attempt: 1,
      message: "Internal Server Error",
    });

    const job = {
      id: "1",
      destination: "https://example.com",
      payload: {},
      attempts: 0,
      attemptHistory: [],
      nextAttemptAt: new Date(),
      status: "pending" as const,
    };

    deliveryRepository.save(job);

    await workerService.process();

    expect(
      deliveryRepository.getAll().find((job) => job.id === "1")?.attempts,
    ).toBe(1);
  });

  it("should fail after five attempts", async () => {
    vi.spyOn(webhookService, "send").mockResolvedValue({
      success: false,
      timestamp: new Date(),
      attempt: 5,
      message: "Internal Server Error",
    });

    const job = {
      id: "1",
      destination: "https://example.com",
      payload: {},
      attempts: 4,
      attemptHistory: [],
      nextAttemptAt: new Date(),
      status: "pending" as const,
    };

    deliveryRepository.save(job);

    await workerService.process();

    expect(
      deliveryRepository.getAll().find((job) => job.id === "1")?.status,
    ).toBe("failed");
  });
});
