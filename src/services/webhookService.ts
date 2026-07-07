import axios from "axios";
import { DeliveryAttempt } from "../types/eventTypes";
import { generateSignature, getCurrentTimestamp } from "../utils/helpers";

class WebhookService {
  async send(
    id: string,
    destination: string,
    payload: Record<string, unknown>,
  ): Promise<DeliveryAttempt> {
    const signature = generateSignature(
      payload,
      process.env.WEBHOOK_SECRET ?? "",
    );

    try {
      const response = await axios.post(destination, payload, {
        headers: {
          "X-Webhook-Signature": signature,
          "X-Event-Id": id,
        },
      });

      return {
        attempt: 0,
        timestamp: getCurrentTimestamp(),
        success: true,
        message: `HTTP ${response.status}`,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          attempt: 0,
          timestamp: getCurrentTimestamp(),
          success: false,
          message: error.message,
        };
      }

      return {
        attempt: 0,
        timestamp: getCurrentTimestamp(),
        success: false,
        message: "An unexpected error occurred.",
      };
    }
  }
}

export default new WebhookService();
