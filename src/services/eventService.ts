import eventRepository from "../repositories/eventRepository";
import { CreateEventRequest, Event } from "../types/eventTypes";
import { generateId } from "../utils/helpers";
import webhookService from "./webhookService";

class EventService {
  async createEvent(data: CreateEventRequest): Promise<Event> {
    const event: Event = {
      id: generateId(),
      destination: data.destination,
      payload: data.payload,
      delivered: false,
      attempts: [],
    };

    eventRepository.create(event);

    const attempt = await webhookService.send(event.destination, event.payload);

    eventRepository.addAttempt(event.id, attempt);

    if (attempt.success) {
      event.delivered = true;
      eventRepository.update(event);
    }

    return event;
  }

  getAllEvents(): Event[] {
    return eventRepository.getAll();
  }

  getEventById(id: string): Event | undefined {
    return eventRepository.findById(id);
  }
}

export default new EventService();
