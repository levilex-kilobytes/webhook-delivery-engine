import axios from "axios";
import { DeliveryAttempt } from "../types/eventTypes";
import { getCurrentTimestamp } from "../utils/helpers";

class WebhookService {
  async send(
    destination: string,
    payload: Record<string, unknown>,
  ): Promise<DeliveryAttempt> {
    try {
      const response = await axios.post(destination, payload);

      return {
        timestamp: getCurrentTimestamp(),
        status: response.status,
        success: true,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          timestamp: getCurrentTimestamp(),
          status: error.response?.status ?? null,
          success: false,
          error: error.message,
        };
      }

      return {
        timestamp: getCurrentTimestamp(),
        status: null,
        success: false,
        error: "An unexpected error occurred.",
      };
    }
  }
}

export default new WebhookService();
