import { Router } from "express";
import eventController from "../controllers/eventController";
import deadLetterController from "../controllers/deadLetterController";

const router = Router();

router.post("/events", (req, res) => eventController.create(req, res));

router.post("/events/:id/replay", (req, res) =>
  eventController.replay(req, res),
);

router.get("/dead-letters", (req, res) =>
  deadLetterController.getAll(req, res),
);

export default router;
