import { Request, Response } from "express";
import deadLetterRepository from "../repositories/deadLetterRepository";

class DeadLetterController {
  getAll(_req: Request, res: Response): void {
    res.status(200).json(deadLetterRepository.getAll());
  }
}

export default new DeadLetterController();
