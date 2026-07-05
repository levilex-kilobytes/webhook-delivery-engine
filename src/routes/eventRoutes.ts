import { Router } from "express";
import eventController from "../controllers/eventController";

const router = Router();

router.post("/events", eventController.createEvent);

export default router;
