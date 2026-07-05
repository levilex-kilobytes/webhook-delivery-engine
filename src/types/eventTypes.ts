export interface Event {
  id: string;
  destination: string;
  payload: Record<string, unknown>;
  delivered: boolean;
  attempts: DeliveryAttempt[];
}

export interface DeliveryAttempt {
  timestamp: Date;
  status: number | null;
  success: boolean;
  error?: string;
}

export interface CreateEventRequest {
  destination: string;
  payload: Record<string, unknown>;
}
