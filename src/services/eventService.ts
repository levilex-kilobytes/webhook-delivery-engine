import deliveryRepository from "../repositories/deliveryRepository";
import { DeliveryJob } from "../types/eventTypes";
import { generateId } from "../utils/helpers";

class EventService {
  create(destination: string, payload: Record<string, unknown>): DeliveryJob {
    const job: DeliveryJob = {
      id: generateId(),
      destination,
      payload,
      attempts: 0,
      nextAttemptAt: new Date(),
      status: "pending",
    };

    deliveryRepository.save(job);

    return job;
  }
}

export default new EventService();
