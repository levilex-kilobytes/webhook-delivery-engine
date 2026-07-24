import { DeliveryJob } from "../types/eventTypes";

class DeliveryRepository {
  private jobs: DeliveryJob[] = [];

  save(job: DeliveryJob): void {
    this.jobs.push(job);
  }

  findPending(): DeliveryJob[] {
    return this.jobs.filter((job) => job.status === "pending");
  }

  update(updatedJob: DeliveryJob): void {
    const index = this.jobs.findIndex((job) => job.id === updatedJob.id);

    if (index !== -1) {
      this.jobs[index] = updatedJob;
    }
  }

  remove(id: string): void {
    this.jobs = this.jobs.filter((job) => job.id !== id);
  }

  findById(id: string): DeliveryJob | undefined {
    return this.jobs.find((job) => job.id === id);
  }

  clear(): void {
    this.jobs = [];
  }

  getAll(): DeliveryJob[] {
    return this.jobs;
  }
}

export default new DeliveryRepository();
