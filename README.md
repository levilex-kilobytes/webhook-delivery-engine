# Webhook Delivery Engine

The system delivers webhook events asynchronously using a background worker, signs every payload with HMAC, retries failed deliveries on a fixed schedule, moves permanently failed events to a Dead-Letter Queue (DLQ), and allows manual replay of failed events.

---

# What This System Does

The Webhook Delivery Engine accepts webhook delivery requests and processes them asynchronously.

Instead of sending webhook requests during the API request, each event is placed into a delivery queue. A background worker processes queued events independently, ensuring the API responds immediately.

The system provides:

- Background webhook delivery
- HMAC payload signing
- Automatic retries
- Dead-Letter Queue (DLQ)
- Replay of failed deliveries
- Idempotent delivery support
- Unit tests using Vitest

---

# Setup & Configuration

## Clone the repository

```bash
git clone <repository-url>
cd webhook-delivery-engine
```

## Install dependencies

```bash
npm install
```

## Create a `.env` file

```env
PORT=3000
WEBHOOK_SECRET=your-secret-key
```

---

# Running the Worker

Start the development server:

```bash
npm run dev
```

The background worker continuously checks for pending deliveries and processes them asynchronously.

---

# Running Tests

Run all tests with:

```bash
npm test
```

The test suite covers:

- Event creation
- Webhook delivery
- Payload signing
- Retry scheduling
- Background processing
- Dead-Letter Queue
- Replay functionality

---

# Sending an Event for Delivery

**Endpoint**

```http
POST /events
```

Example request:

```json
{
  "destination": "https://example.com/webhook",
  "payload": {
    "orderId": 1001,
    "customer": "John Doe"
  }
}
```

Successful response:

```json
{
  "id": "evt_123456",
  "status": "pending"
}
```

The event is stored and processed later by the background worker.

---

# The Retry Schedule

If a webhook delivery fails, the system automatically retries using the following schedule:

| Attempt |       Delay |
| ------: | ----------: |
|       1 | Immediately |
|       2 |    1 minute |
|       3 |   5 minutes |
|       4 |  30 minutes |
|       5 |     2 hours |

If all five attempts fail, the event is moved to the Dead-Letter Queue.

---

# Payload Signing (and How Receivers Verify It)

Every outgoing webhook request is signed using HMAC-SHA256.

Each request contains the following header:

```text
X-Webhook-Signature
```

To verify the request, a receiver should:

1. Read the raw request body.
2. Generate an HMAC using the shared secret.
3. Compare the generated signature with the value in the `X-Webhook-Signature` header.
4. Reject the request if the signatures do not match.

This ensures the payload has not been modified and confirms it came from a trusted sender.

---

# The Dead-Letter Queue

If an event fails all five delivery attempts, it is moved to the Dead-Letter Queue (DLQ).

Each dead-lettered event contains:

- Event ID
- Destination URL
- Payload
- Attempt history
- Failure messages
- Attempt count

Dead-lettered events are available through:

```http
GET /dead-letters
```

Events in the DLQ are never retried automatically.

---

# Replaying a Delivery

Failed events can be replayed using:

```http
POST /events/:id/replay
```

Replay moves the event back into the delivery queue.

The original event identifier is preserved during replay so receivers can recognize duplicate deliveries.

If the event does not exist, the API returns **404 Not Found**.

---

# The Idempotency Design

Every event is assigned a unique identifier when it is created.

The same identifier is reused for:

- The initial delivery
- Every retry
- Manual replay

Each webhook request includes the following header:

```text
X-Event-Id
```

Receivers can store processed event identifiers.

If the same `X-Event-Id` is received again, the receiver can safely ignore the duplicate instead of processing it twice.

This makes the webhook delivery process idempotent.

---

# Endpoint Health & Auto-Pause

The worker continuously checks for pending delivery jobs.

- Completed deliveries are never retried.
- Dead-lettered events are removed from the active delivery queue.
- Dead-lettered events are only processed again when manually replayed.
- If there are no pending jobs, the worker remains idle until new events are queued.

---

# Known Limitations

- Delivery jobs are lost if the application stops.
- The Dead-Letter Queue is stored in memory.
- Only one worker instance is supported.
- No persistent database is used.
- Replay requests must be initiated manually.
- No monitoring dashboard or metrics are included.
