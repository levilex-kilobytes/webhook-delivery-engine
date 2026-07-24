import deliveryRepository from "../repositories/deliveryRepository";
import deadLetterRepository from "../repositories/deadLetterRepository";
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
      attemptHistory: [],
    };

    deliveryRepository.save(job);

    return job;
  }

  replay(id: string): DeliveryJob | undefined {
    const job = deadLetterRepository.findById(id);

    if (!job) {
      return undefined;
    }

    deadLetterRepository.remove(id);

    job.status = "pending";
    job.attempts = 0;
    job.nextAttemptAt = new Date();

    deliveryRepository.save(job);

    return job;
  }
}

export default new EventService();
