import { beforeEach, describe, expect, it, vi } from "vitest";
import deliveryRepository from "../src/repositories/deliveryRepository";
import deadLetterRepository from "../src/repositories/deadLetterRepository";
import webhookService from "../src/services/webhookService";
import workerService from "../src/services/workerService";

describe("WorkerService", () => {
  beforeEach(() => {
    deliveryRepository.clear();
    deadLetterRepository.clear();
    vi.restoreAllMocks();
  });

  it("should mark a successful job as completed", async () => {
    vi.spyOn(webhookService, "send").mockResolvedValue({
      attempt: 1,
      timestamp: new Date(),
      success: true,
      message: "Delivery successful",
    });

    deliveryRepository.save({
      id: "1",
      destination: "https://example.com",
      payload: {},
      attempts: 0,
      nextAttemptAt: new Date(),
      status: "pending",
      attemptHistory: [],
    });

    await workerService.process();

    expect(deliveryRepository.findById("1")?.status).toBe("completed");
    expect(deadLetterRepository.getAll()).toHaveLength(0);
  });

  it("should retry a failed delivery", async () => {
    vi.spyOn(webhookService, "send").mockResolvedValue({
      attempt: 1,
      timestamp: new Date(),
      success: false,
      message: "Delivery failed",
    });

    deliveryRepository.save({
      id: "1",
      destination: "https://example.com",
      payload: {},
      attempts: 0,
      nextAttemptAt: new Date(),
      status: "pending",
      attemptHistory: [],
    });

    await workerService.process();

    const job = deliveryRepository.findById("1");

    expect(job?.attempts).toBe(1);
    expect(job?.status).toBe("pending");
    expect(deadLetterRepository.getAll()).toHaveLength(0);
  });

  it("should fail after five attempts", async () => {
    vi.spyOn(webhookService, "send").mockResolvedValue({
      attempt: 5,
      timestamp: new Date(),
      success: false,
      message: "Delivery failed",
    });

    deliveryRepository.save({
      id: "1",
      destination: "https://example.com",
      payload: {},
      attempts: 4,
      nextAttemptAt: new Date(),
      status: "pending",
      attemptHistory: [],
    });

    await workerService.process();

    expect(deliveryRepository.getAll()).toHaveLength(0);

    expect(deadLetterRepository.getAll()).toHaveLength(1);

    expect(deadLetterRepository.findById("1")?.status).toBe("failed");
  });
});
