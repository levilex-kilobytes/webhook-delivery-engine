import { Request, Response } from "express";
import eventService from "../services/eventService";

class EventController {
  create(req: Request, res: Response): void {
    const { destination, payload } = req.body;

    const job = eventService.create(destination, payload);

    res.status(201).json(job);
  }

  replay(req: Request, res: Response): void {
    const { id } = req.params;

    const job = eventService.replay(Array.isArray(id) ? id[0] : id);

    if (!job) {
      res.status(404).json({
        message: "Event not found",
      });
      return;
    }

    res.status(200).json(job);
  }
}

export default new EventController();
