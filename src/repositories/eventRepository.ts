import { DeliveryAttempt, Event } from "../types/eventTypes";

class EventRepository {
  private events: Event[] = [];

  create(event: Event): Event {
    this.events.push(event);
    return event;
  }

  findById(id: string): Event | undefined {
    return this.events.find((event) => event.id === id);
  }

  update(event: Event): Event {
    const index = this.events.findIndex((item) => item.id === event.id);

    if (index !== -1) {
      this.events[index] = event;
    }

    return event;
  }

  addAttempt(id: string, attempt: DeliveryAttempt): void {
    const event = this.findById(id);

    if (!event) {
      return;
    }

    event.attempts.push(attempt);
  }

  getAll(): Event[] {
    return this.events;
  }
}

export default new EventRepository();
