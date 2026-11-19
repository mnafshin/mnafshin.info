---
title: 'REST vs gRPC for Internal Calls (Part 1): Choosing the Protocol and Writing the Contract'
description: 'How to choose between REST and gRPC for calls inside a platform, write a protobuf contract that 40 teams can evolve safely, and call another service with a deadline.'
pubDate: '2026-11-19T14:01:00+01:00'
section: system-design
topic: sd02
draft: false
---

When one service calls another, the two sides need a **contract**: an agreement about what a request looks like, what the reply looks like, and how both travel over the network. For internal calls, two styles cover most cases.

**REST** models things as resources with URLs, such as `/orders/7f3a`, and uses plain HTTP methods like `GET` and `POST` on them. The body is usually JSON, a text format people can read. The contract is often written down with OpenAPI, a standard way to describe HTTP APIs.

**gRPC** models things as functions you call on another machine. This idea is called a remote procedure call, or RPC. You describe the functions and their messages in a `.proto` file. Messages are encoded with **Protocol Buffers** (protobuf), a compact binary format, and sent over HTTP/2. Tools then generate client and server code for many languages from that one file.

This part shows how to choose, and how to write a protobuf contract that stays safe as it changes. [Part 2](/system-design/sd02-rest-vs-grpc-part2/) covers how outside callers reach a gRPC service and where events fit in.

## The running example: one call that must be fast

Our platform runs **Securities Order Intake**, used by more than 40 teams. In SD01 we decided that one step must stay a synchronous call: before Order Intake accepts an order, it asks **Risk** whether the account may place it. The customer is waiting, and the call runs for every order, so it must be quick and predictable.

## Comparing the two for internal calls

Here is how they differ for a call like this.

- **Contract strength.** A `.proto` file is strict: types, field names and functions are fixed, and generated code will not compile if you use them wrongly. REST is looser. OpenAPI helps, but nothing forces every team to keep it accurate.
- **Speed and size.** Protobuf messages are smaller than the same data in JSON and faster to read and write. HTTP/2 also lets many calls share one long-lived connection, so load balancing must spread calls, not connections (covered on the Kubernetes channel).
- **Streaming.** gRPC supports a stream of messages in either direction, or both. REST is mostly one request and one reply.
- **Time limits.** gRPC has **deadlines**: the caller says how long it is willing to wait, and the deadline travels with the call. By default no deadline is set, so you must set one yourself.
- **Reach and tools.** Browsers cannot call gRPC directly, and you cannot test it with a plain `curl`. REST works everywhere, and standard HTTP caching works on `GET` requests.

For our Risk call, both sides are services we own, the call is on the hot path, and teams use several languages. That points to **gRPC inside the platform**. REST stays the right choice for public or browser-facing APIs, for simple create-read-update-delete services with few callers, and for teams without protobuf tooling.

## The contract for the Risk check

A gRPC contract is a short `.proto` file. This is the one for the Risk call:

```proto
syntax = "proto3";

package platform.risk.v1;

service RiskService {
  rpc CheckOrder(CheckOrderRequest) returns (CheckOrderResponse);
}

message CheckOrderRequest {
  string order_id = 1;
  string account_id = 2;
  string isin = 3;
  Side side = 4;
  int64 quantity = 5;
  string limit_price = 6;  // decimal as text, never a float
  reserved 7;              // was trader_name, removed
  reserved "trader_name";
}

enum Side {
  SIDE_UNSPECIFIED = 0;
  SIDE_BUY = 1;
  SIDE_SELL = 2;
}

message CheckOrderResponse {
  Decision decision = 1;
  string reason = 2;
}

enum Decision {
  DECISION_UNSPECIFIED = 0;
  DECISION_APPROVED = 1;
  DECISION_REJECTED = 2;
}
```

The numbers after each field are **field numbers**. They, not the names, identify a field on the wire. That one fact explains most of the rules below.

## Protobuf conventions that keep 40 teams safe

The official protobuf style guide and best-practices page list many rules. These matter most on a shared platform:

1. **Put a version in the package name**, like `platform.risk.v1`. A breaking change becomes a new `v2` package that can live next to `v1` while teams move over.
2. **Follow the naming style.** Messages and enums use `PascalCase`, fields use `lower_snake_case`, and enum values use `UPPER_SNAKE_CASE` with the enum name as a prefix (`SIDE_BUY`).
3. **Make the zero enum value mean "not set"**, such as `SIDE_UNSPECIFIED = 0`. In proto3 a missing enum reads as zero, so zero must never mean a real choice like "buy".
4. **Never reuse a field number.** When you delete a field, mark its number and name as `reserved`. Old messages may still exist in logs and queues, and a reused number would make them decode into the wrong field.
5. **Do not change a field's type.** Add a new field instead. For the same reason, prefer an enum to a `bool` when more states may come later; that is why the reply uses `Decision` and not `approved = true`.
6. **Give every RPC its own request and response message**, even when it has only one field today. Then you can add fields later without changing the function.
7. **Keep money out of floats.** A binary float cannot hold `52.10` exactly. Use a decimal string or a decimal message type.

Writing rules down is not enough with this many teams. A tool such as `buf breaking` can compare each change to the last released version in CI and fail the build if it would break existing callers.

## Calling Risk with a deadline

The generated client makes the call look local. The one thing to add every time is the deadline:

```java
CheckOrderResponse risk = riskStub
    .withDeadlineAfter(200, TimeUnit.MILLISECONDS)
    .checkOrder(request);
```

If Risk does not answer within 200 milliseconds, the call fails fast with a `DEADLINE_EXCEEDED` status, and Order Intake can reject the order cleanly instead of hanging. How to wire gRPC clients and servers in Spring is covered on SpringUniverse: https://mnafshin.info/spring/

## Recap

- REST models resources over plain HTTP with JSON; gRPC models function calls with protobuf over HTTP/2.
- For fast, frequent calls between services you own, gRPC gives a strict contract, smaller messages, streaming and deadlines.
- REST is still the better fit for browsers, public APIs and simple services with few callers.
- Version the package, use `_UNSPECIFIED = 0`, never reuse field numbers, and check breaking changes in CI.
- Always set a deadline on a gRPC call; there is none by default.

## Sources

- gRPC, "Core concepts": https://grpc.io/docs/what-is-grpc/core-concepts/
- gRPC, "Deadlines": https://grpc.io/docs/guides/deadlines/
- Protocol Buffers, "Overview": https://protobuf.dev/overview/
- Protocol Buffers, "Style Guide": https://protobuf.dev/programming-guides/style/
- Protocol Buffers, "Proto Best Practices": https://protobuf.dev/best-practices/dos-donts/
- Buf, "Breaking change detection": https://buf.build/docs/breaking/
- Microsoft Learn, "Compare gRPC services with HTTP APIs": https://learn.microsoft.com/en-us/aspnet/core/grpc/comparison
- AWS, "What's the difference between gRPC and REST?": https://aws.amazon.com/compare/the-difference-between-grpc-and-rest/
- Google Cloud blog, "gRPC vs REST: Understanding gRPC, OpenAPI and REST and when to use them in API design": https://cloud.google.com/blog/products/api-management/understanding-grpc-openapi-and-rest-and-when-to-use-them
