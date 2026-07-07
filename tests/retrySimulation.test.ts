import { beforeEach, describe, expect, it, vi } from "vitest";
import deliveryRepository from "../src/repositories/deliveryRepository";
import deadLetterRepository from "../src/repositories/deadLetterRepository";
import webhookService from "../src/services/webhookService";
import workerService from "../src/services/workerService";

describe("Retry Simulation", () => {
  beforeEach(() => {
    deliveryRepository.clear();
    deadLetterRepository.clear();
    vi.restoreAllMocks();
  });

  it("should schedule the first retry after 1 minute", async () => {
    vi.spyOn(webhookService, "send").mockResolvedValue({
      attempt: 1,
      timestamp: new Date(),
      success: false,
      message: "Failed",
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
  });

  it("should move the event to the DLQ after the fifth failure", async () => {
    vi.spyOn(webhookService, "send").mockResolvedValue({
      attempt: 5,
      timestamp: new Date(),
      success: false,
      message: "Failed",
    });

    deliveryRepository.save({
      id: "2",
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
  });

  it("should stop retrying after a successful delivery", async () => {
    vi.spyOn(webhookService, "send").mockResolvedValue({
      attempt: 1,
      timestamp: new Date(),
      success: true,
      message: "Delivered",
    });

    deliveryRepository.save({
      id: "3",
      destination: "https://example.com",
      payload: {},
      attempts: 0,
      nextAttemptAt: new Date(),
      status: "pending",
      attemptHistory: [],
    });

    await workerService.process();

    const job = deliveryRepository.findById("3");

    expect(job?.status).toBe("completed");
    expect(job?.attemptHistory).toHaveLength(1);
  });
});
