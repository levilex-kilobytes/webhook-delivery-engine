import { DeliveryJob } from "../types/eventTypes";

class DeadLetterRepository {
  private jobs: DeliveryJob[] = [];

  save(job: DeliveryJob): void {
    this.jobs.push(job);
  }

  getAll(): DeliveryJob[] {
    return this.jobs;
  }

  findById(id: string): DeliveryJob | undefined {
    return this.jobs.find((job) => job.id === id);
  }

  remove(id: string): void {
    this.jobs = this.jobs.filter((job) => job.id !== id);
  }

  clear(): void {
    this.jobs = [];
  }
}

export default new DeadLetterRepository();
