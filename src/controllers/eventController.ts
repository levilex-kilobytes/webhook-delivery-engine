import { Request, Response } from "express";
import eventService from "../services/eventService";

class EventController {
  async createEvent(req: Request, res: Response): Promise<void> {
    try {
      const event = await eventService.createEvent(req.body);

      res.status(201).json({
        message: "Event created successfully.",
        data: event,
      });
    } catch (error) {
      res.status(500).json({
        message: "Failed to create event.",
      });
    }
  }

  getAllEvents(req: Request, res: Response): void {
    const events = eventService.getAllEvents();

    res.status(200).json({
      data: events,
    });
  }

  getEventById(req: Request, res: Response): void {
    const { id } = req.params;
    const eventId = Array.isArray(id) ? id[0] : id;

    const event = eventService.getEventById(eventId);

    if (!event) {
      res.status(404).json({
        message: "Event not found.",
      });

      return;
    }

    res.status(200).json({
      data: event,
    });
  }
}

export default new EventController();
