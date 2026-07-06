export interface DeliveryAttempt {
  attempt: number;
  timestamp: Date;
  success: boolean;
  message: string;
}

export interface Event {
  id: string;
  destination: string;
  payload: Record<string, unknown>;
  delivered: boolean;
  attempts: DeliveryAttempt[];
}

export interface CreateEventRequest {
  destination: string;
  payload: Record<string, unknown>;
}

export interface DeliveryJob {
  id: string;
  destination: string;
  payload: Record<string, unknown>;
  attempts: number;
  nextAttemptAt: Date;
  status: "pending" | "processing" | "completed" | "failed";
  attemptHistory: DeliveryAttempt[];
}
