import deliveryRepository from "../repositories/deliveryRepository";
import deadLetterRepository from "../repositories/deadLetterRepository";
import webhookService from "./webhookService";

const retryDelays = [
  0,
  60 * 1000,
  5 * 60 * 1000,
  30 * 60 * 1000,
  2 * 60 * 60 * 1000,
];

class WorkerService {
  async process(): Promise<void> {
    const jobs = deliveryRepository.findPending();

    for (const job of jobs) {
      job.status = "processing";
      deliveryRepository.update(job);

      const result = await webhookService.send(job.destination, job.payload);

      if (result.success) {
        job.attemptHistory.push({
          attempt: job.attempts + 1,
          timestamp: new Date(),
          success: true,
          message: "Delivery successful",
        });

        job.status = "completed";
      } else {
        job.attempts++;

        job.attemptHistory.push({
          attempt: job.attempts,
          timestamp: new Date(),
          success: false,
          message: "Delivery failed",
        });

        if (job.attempts >= 5) {
          job.status = "failed";

          deliveryRepository.update(job);
          deadLetterRepository.save(job);
        } else {
          job.status = "pending";
          job.nextAttemptAt = new Date(Date.now() + retryDelays[job.attempts]);

          deliveryRepository.update(job);
        }
      }
    }
  }

  start(): void {
    setInterval(() => {
      void this.process();
    }, 1000);
  }
}

export default new WorkerService();
