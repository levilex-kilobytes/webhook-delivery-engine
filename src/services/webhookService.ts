import axios from "axios";
import { DeliveryAttempt } from "../types/eventTypes";
import { generateSignature, getCurrentTimestamp } from "../utils/helpers";

class WebhookService {
  async send(
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
        },
      });

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
