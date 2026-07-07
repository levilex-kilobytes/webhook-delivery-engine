import deliveryRepository from "../repositories/deliveryRepository";
import deadLetterRepository from "../repositories/deadLetterRepository";
import webhookService from "./webhookService";

const retrySchedule = [
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

      const result = await webhookService.send(
        job.id,
        job.destination,
        job.payload,
      );

      if (result.success) {
        job.attempts++;

        job.attemptHistory.push({
          attempt: job.attempts,
          timestamp: result.timestamp,
          success: true,
          message: result.message,
        });

        job.status = "completed";
        deliveryRepository.update(job);
        continue;
      }

      job.attempts++;

      job.attemptHistory.push({
        attempt: job.attempts,
        timestamp: result.timestamp,
        success: false,
        message: result.message,
      });

      if (job.attempts >= 5) {
        job.status = "failed";

        deliveryRepository.remove(job.id);
        deadLetterRepository.save(job);

        continue;
      }

      job.status = "pending";

      job.nextAttemptAt = new Date(Date.now() + retrySchedule[job.attempts]);

      deliveryRepository.update(job);
    }
  }

  start(): void {
    setInterval(() => {
      void this.process();
    }, 1000);
  }
}

export default new WorkerService();
