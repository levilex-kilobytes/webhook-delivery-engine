import { beforeEach, describe, expect, it } from "vitest";
import eventService from "../src/services/eventService";
import deliveryRepository from "../src/repositories/deliveryRepository";

describe("EventService", () => {
  beforeEach(() => {
    deliveryRepository.getAll().splice(0);
  });

  it("should create a pending delivery job", () => {
    const job = eventService.create("https://example.com", {
      orderId: 1,
    });

    expect(job.status).toBe("pending");
  });

  it("should enqueue a delivery job", () => {
    eventService.create("https://example.com", {
      orderId: 1,
    });

    expect(deliveryRepository.getAll()).toHaveLength(1);
  });
});
