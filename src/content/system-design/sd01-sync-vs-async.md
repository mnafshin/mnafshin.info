---
title: 'Sync vs Async: When Events Beat Calls'
description: 'A synchronous call waits for an answer; an asynchronous message does not. A simple two-question test for choosing, using one securities order flow from start to finish.'
summary: "A synchronous call waits for an answer; an asynchronous design fires an event and continues. This article shows when events beat direct calls, and the trade-offs that come with each choice."
pubDate: '2026-11-19T14:00:00+01:00'
section: system-design
topic: sd01
draft: false
---

Services talk to each other in two basic ways. In a **synchronous call**, one service asks another for something and waits for the answer before it moves on. A phone call works like this: you ask, you wait, you hear the reply. In **asynchronous messaging**, a service sends a message and moves on without waiting. A text message works like this: you send it, and the other person deals with it when they can.

Neither style is better in general. This article gives you a simple test for choosing, using one example all the way through.

## The running example: Securities Order Intake

Picture an internal platform that more than 40 teams build on. One of its services is **Order Intake**. A trading app sends it a securities order, such as "buy 100 shares of this stock at no more than 52.10". Order Intake must give the app an answer, and several other teams care about every order:

- **Risk** checks that the account is allowed to place this order.
- **Booking** records the order for settlement.
- **Compliance** watches for suspicious trading patterns.
- **Notifications** tells the customer what happened.
- **Analytics** counts orders for reports.

The first idea most of us have is to call all of them, one after another, inside the request:

```java
// First draft: the client waits for everything
OrderResult submit(Order order) {
    risk.check(order);          // must pass before we accept
    repository.save(order);
    booking.record(order);
    compliance.screen(order);
    notifications.send(order);
    analytics.track(order);
    return OrderResult.accepted(order.id());
}
```

It reads nicely, but it hides a cost that grows with every new line.

## What waiting really costs

When a service waits on a call, it takes on two things from the service it calls.

**It adds the other service's time.** If each call takes 50 milliseconds, five calls add a quarter of a second, and the slowest call on a bad day sets the pace.

**It shares the other service's failures.** If Analytics is down, the order fails, even though the customer does not care about reports. This is called **temporal coupling**: both services must be up at the same moment for the work to succeed. The numbers add up fast. If each of five services is up 99.9% of the time, the chance that all five are up together is about 99.5%. That is about five times the downtime of any one of them alone.

There is a third, quieter cost. Every team that wants to react to orders must ask the Order Intake team to add another call, so with 40+ teams, Order Intake becomes a bottleneck for other people's features.

## The two-question test

For each piece of downstream work, ask two questions.

**1. Does the caller need the result to give its answer?**
Order Intake cannot say "accepted" before Risk has said yes. The answer depends on the result, so this is a call. Booking, Compliance, Notifications and Analytics do not change the answer. Order Intake only needs to tell them that something happened.

**2. Does the work have to finish before the answer goes back?**
A customer can get the "order accepted" screen a moment before the notification email is sent. If "a little later" is fine, the work can be asynchronous.

If the answer to both questions is no, that work is a good fit for an **event**. An event is a message that states a fact in the past tense: "order 7f3a was accepted". The sender does not say who should react or what they should do.

## Reshaping the flow around one event

Applying the test, the request keeps only what the answer depends on:

```java
OrderResult submit(Order order) {
    risk.check(order);                 // call: the answer depends on it
    repository.save(order);
    events.publish(new OrderAccepted(order.id(), order.accountId(),
        order.isin(), order.side(), order.quantity(), order.limitPrice()));
    return OrderResult.accepted(order.id());
}
```

Everything else listens for one event:

```json
{
  "type": "OrderAccepted",
  "orderId": "7f3a...",
  "accountId": "ACC-1042",
  "isin": "DE0007164600",
  "side": "BUY",
  "quantity": 100,
  "limitPrice": "52.10",
  "occurredAt": "2026-11-19T10:15:02Z"
}
```

Now Analytics can be down for an hour and orders still flow; it catches up later, because the messages wait for it. A new team subscribes to the event without asking Order Intake for anything, and because the event carries the order details, most listeners never have to call back.

## What you pay for asynchronous work

Events are not free, and a good design is honest about the bill.

- **Results arrive later.** For a short time, Booking may not know about an order that the customer already sees. This is called **eventual consistency**: everyone agrees in the end, but not at every instant.
- **The flow is harder to see.** In the first draft you could read the whole process in one method. With events, the process is spread over several services, and you need tracing and good names to follow it.
- **You need a broker.** A message broker, the system that stores and delivers messages, is one more thing to run.
- **Messages can arrive twice.** Most brokers promise "at least once", so listeners must cope with duplicates.

One trap is worth naming. If Order Intake really needs another service to *do* something, such as "reserve these funds now", that is a **command**, not an event. Disguising a command as an event makes it look optional and hides who is responsible. Send commands to one known receiver, and keep events for facts that anyone may react to.

## Where this leads next

The second version still has a gap: the order is saved and the event is published as two separate steps, so a crash between them can lose the event. SD04 and SD05 close that gap (the table mechanics are covered on the Database channel). SD02 then picks the protocol for the call to Risk, and SD03 chooses between a queue and a log for the event.

## Recap

- A synchronous call waits for an answer; an asynchronous message is sent and the sender moves on.
- Use a call when the caller needs the result to give its own answer.
- Use an event when the work only needs to know that something happened and can finish a little later.
- Calls add latency and shared failure; events add delay, harder tracing, a broker, and duplicates.
- An event states a past fact. If you need a specific service to act, send a command.

## Sources

- Enterprise Integration Patterns, "Messaging" overview: https://www.enterpriseintegrationpatterns.com/patterns/messaging/index.html
- Gregor Hohpe, "Your Coffee Shop Does Not Use Two-Phase Commit": https://www.enterpriseintegrationpatterns.com/ramblings/18_starbucks.html
- Martin Fowler, "What do you mean by 'Event-Driven'?": https://martinfowler.com/articles/201701-event-driven.html
- Azure Architecture Center, "Interservice communication in microservices": https://learn.microsoft.com/en-us/azure/architecture/microservices/design/interservice-communication
- Azure Architecture Center, "Event-driven architecture style": https://learn.microsoft.com/en-us/azure/architecture/guide/architecture-styles/event-driven
- Chris Richardson, microservices.io, "Messaging" pattern: https://microservices.io/patterns/communication-style/messaging.html
