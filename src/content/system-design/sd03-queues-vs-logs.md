---
title: 'Queues vs Logs: SNS/SQS or Kafka?'
description: 'Queues hand each message to one consumer and forget it; logs keep messages so many readers can replay them. When to pick SNS/SQS and when to pick Kafka.'
pubDate: '2026-11-19T14:03:00+01:00'
section: system-design
topic: sd03
draft: false
---

Once a service sends an event instead of making a call, the event needs somewhere to go. Most message systems build on one of two ideas: a **queue** or a **log**.

A **queue** is a waiting line for work. A message waits until a consumer takes it, handles it, and deletes it; then it is gone. With several workers on one queue, each message goes to only one of them, so they share the work.

A **log** is a list where records are only added at the end and kept for a set time, read or not. Reading removes nothing. Each reader keeps its own bookmark, called an **offset**, that says how far it has read. Many readers can read the same records at their own pace, and any reader can move its bookmark back to read old records again, called **replay**.

On AWS, the common queue setup is **SNS with SQS**. **Kafka** is the best-known log. This article compares them using one event.

## The running example: who needs OrderAccepted?

Our platform runs **Securities Order Intake**, used by more than 40 teams. In SD01 we decided that every accepted order produces an `OrderAccepted` event. Today four teams read it, and more will come:

- **Booking** must see each account's events in order. A cancel must never be handled before the order it cancels.
- **Compliance** sometimes changes its detection rules and wants to run the new rules over the last 30 days of orders.
- **Notifications** sends one email per order.
- **Analytics** loads everything into reports.

So we need **fan-out** (many teams get the same event), **replay**, and **ordering** per account.

## How SNS and SQS work together

**Amazon SQS** is a managed queue. A consumer receives a message, and SQS hides it from other consumers for a while, the **visibility timeout**. If the consumer deletes it in time, it is done. If not, the message shows up again and someone retries it. SQS keeps unread messages for 4 days by default and 14 days at most.

One queue gives each message to one consumer, so it cannot feed four teams alone. That is the job of **Amazon SNS**, a publish-subscribe service. You publish once to an SNS **topic**, and SNS pushes a copy to every subscriber. The usual pattern is **fan-out**: one SNS topic, with one SQS queue per team behind it.

A subscription can carry a **filter policy**, so a team only gets the messages it cares about. Here Compliance only wants large orders, based on a message attribute:

```json
{ "quantity": [ { "numeric": [">=", 10000] } ] }
```

Each team owns its queue: its own speed, retries, and dead-letter queue for messages that keep failing.

For ordering, SQS has two kinds of queue. **Standard** queues may deliver a message more than once and do not promise order. **FIFO** queues ("first in, first out") keep order within a **message group**, so using the account ID as the group keeps each account's events in line. FIFO queues also drop duplicate sends within a five-minute window.

Replay is the weak spot: once a team deletes a message, that copy is gone. SNS can archive messages and replay them to a subscriber, but only for FIFO topics, and you must turn it on.

## How Kafka works as a log

In **Kafka**, a **topic** is split into **partitions**. Each partition is its own log, and records inside one partition stay in the order they were written. The producer picks the partition from a **key**: records with the same key always go to the same partition.

```java
producer.send(new ProducerRecord<>(
    "orders.order-accepted.v1",
    event.accountId(),      // key: same account, same partition, same order
    event));
```

Each team reads the topic as its own **consumer group**. Kafka tracks each group's offsets separately, so all four teams read every record without getting in each other's way. A new team adds a new group and can start from the oldest record still kept, with no change to the producer.

How long records stay is a topic setting, by time or by size:

```bash
kafka-topics.sh --create --topic orders.order-accepted.v1 \
  --partitions 12 --replication-factor 3 \
  --config retention.ms=2592000000   # 30 days
```

This retention lets Compliance replay: it resets its offsets to 30 days ago and reads forward.

Kafka has costs too. Inside a group, each partition is read by one consumer at a time, so the partition count limits parallel work. Running Kafka well also takes skill, unless you use a managed service. Newer versions blur the line: Kafka 4.2 made **share groups** production-ready, letting several consumers share one partition, queue-style.

## Choosing for OrderAccepted

Put the needs side by side:

- **Fan-out:** both can do it. SNS copies the message into one queue per team; Kafka lets each group read the same records.
- **Replay:** built into Kafka through retention and offsets. With SNS/SQS it needs FIFO topics with archiving turned on.
- **Ordering per account:** Kafka keys or SQS FIFO message groups.
- **Sharing out tasks:** what a queue does best, with built-in retries and dead-letter queues.

`OrderAccepted` is a **fact** that many teams read, and some want to read again. That fits a log, so it goes on a Kafka topic keyed by account ID. Notifications, whose work is really a list of jobs, can still put those jobs on its own queue. A log for shared facts and a queue for one team's work is a common, healthy mix.

Both choices deliver *at least once*, so a reader may see an event twice. SD06 covers what each system really promises, and SD07 how to handle duplicates.

## Recap

- A queue holds work until one consumer handles and deletes it; a log keeps records, and each reader tracks its own offset.
- SNS + SQS fans out one message to a queue per team, with filters, retries and dead-letter queues per team.
- Kafka keeps order inside a partition, chosen by key, and lets any group replay within the retention time.
- Use a log for shared facts that many teams read or replay; use a queue for jobs one team works through.
- Neither removes duplicates for you; readers must handle the same event arriving twice.

## Sources

- Apache Kafka documentation, "Introduction" and design: https://kafka.apache.org/documentation/
- Apache Kafka 4.2.0 release announcement (share groups): https://kafka.apache.org/blog/2026/02/17/apache-kafka-4.2.0-release-announcement/
- Amazon SQS Developer Guide, visibility timeout: https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-visibility-timeout.html
- Amazon SQS Developer Guide, FIFO queues: https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/FIFO-queues.html
- Amazon SQS Developer Guide, message quotas (retention): https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/quotas-messages.html
- Amazon SNS Developer Guide, fan-out to SQS: https://docs.aws.amazon.com/sns/latest/dg/sns-sqs-as-subscriber.html
- Amazon SNS Developer Guide, message filtering: https://docs.aws.amazon.com/sns/latest/dg/sns-message-filtering.html
- Amazon SNS Developer Guide, archiving and replay for FIFO topics: https://docs.aws.amazon.com/sns/latest/dg/fifo-message-archiving-replay.html
- Martin Kleppmann, "Using logs to build a solid data infrastructure": https://martin.kleppmann.com/2015/05/27/logs-for-data-infrastructure.html
- AWS Compute Blog, "Choosing between messaging services for serverless applications": https://aws.amazon.com/blogs/compute/choosing-between-messaging-services-for-serverless-applications/
- CloudAMQP, "When to use RabbitMQ or Apache Kafka": https://www.cloudamqp.com/blog/when-to-use-rabbitmq-or-apache-kafka.html
- AWS, "What's the difference between Kafka and RabbitMQ?": https://aws.amazon.com/compare/the-difference-between-rabbitmq-and-kafka/
