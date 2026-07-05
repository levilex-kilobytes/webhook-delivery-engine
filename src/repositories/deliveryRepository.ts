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

  getAll(): DeliveryJob[] {
    return this.jobs;
  }
}

export default new DeliveryRepository();
