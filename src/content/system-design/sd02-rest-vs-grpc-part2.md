---
title: 'REST vs gRPC for Internal Calls (Part 2): JSON at the Edge and the Event Bridge'
description: 'How one gRPC contract can also serve JSON callers at the edge through transcoding, and how an event bridge turns calls into events for the rest of the platform.'
summary: "One gRPC contract can also serve JSON callers at the edge through transcoding. An event bridge then turns calls into events for the rest of the platform."
pubDate: '2026-11-19T14:02:00+01:00'
section: system-design
topic: sd02
draft: false
---

A platform has an inside and an outside. The **edge** is the line where traffic from the outside comes in: browsers, mobile apps, partner systems, and scripts written by other companies. Inside, services can agree on gRPC, a fast style of calling functions on another machine with strict contracts. Outside callers usually expect plain HTTP with JSON.

**gRPC-JSON transcoding** joins the two. A proxy at the edge receives an ordinary HTTP/JSON request, turns it into a gRPC call, and turns the gRPC reply back into JSON. The service itself only speaks gRPC.

The platform has a second meeting point, between **calls** (ask and wait) and **events** (announce and move on). The piece that sits there is often called an **event bridge**. This article explains both, so you know where each one belongs. It stands on its own; [Part 1](/system-design/sd02-rest-vs-grpc-part1/) covers why we chose gRPC inside and how to write the protobuf contract.

## The running example: one order, two worlds

Our platform runs **Securities Order Intake**, used by more than 40 teams. Inside, Order Intake calls Risk over gRPC. But the trading app that sends orders is outside the platform and sends JSON over HTTPS. After an order is accepted, many teams want to hear about it as an event. So one order crosses both meeting points: JSON to gRPC at the front, and call to event at the back.

## One contract, two front doors

The trick behind transcoding is that the HTTP shape is written into the same `.proto` file as the gRPC service. You add an **HTTP rule** to each function, using an option defined by Google's API annotations:

```proto
package platform.orderintake.v1;

import "google/api/annotations.proto";

service OrderIntakeService {
  rpc SubmitOrder(SubmitOrderRequest) returns (SubmitOrderResponse) {
    option (google.api.http) = {
      post: "/v1/orders"
      body: "*"
    };
  }
  rpc GetOrder(GetOrderRequest) returns (Order) {
    option (google.api.http) = {
      get: "/v1/orders/{order_id}"
    };
  }
}
```

Read it out loud and it makes sense. A `POST` to `/v1/orders` becomes a `SubmitOrder` call, and `body: "*"` means the whole JSON body fills the request message. A `GET` to `/v1/orders/7f3a` becomes a `GetOrder` call, with `order_id` taken from the URL. `GET` rules have no body.

Now the trading app can send this:

```http
POST /v1/orders
Content-Type: application/json

{ "accountId": "ACC-1042", "isin": "DE0007164600",
  "side": "SIDE_BUY", "quantity": 100, "limitPrice": "52.10" }
```

Notice the field names. The `.proto` file says `account_id`, but the JSON says `accountId`. Protobuf's standard JSON mapping turns field names into lowerCamelCase by default. Most transcoders can keep the original names instead, so pick one style for the whole platform and write it down.

## Where the translation happens

Something must read those HTTP rules and do the work. Common choices are:

- **Envoy**, a widely used proxy, with its gRPC-JSON transcoder filter.
- **grpc-gateway**, which generates a small Go proxy from the `.proto` file.
- Managed gateways, such as Google Cloud Endpoints, that read the same rules.

With Envoy, the edge configuration names the compiled contract and the services to expose:

```yaml
http_filters:
  - name: envoy.filters.http.grpc_json_transcoder
    typed_config:
      "@type": type.googleapis.com/envoy.extensions.filters.http.grpc_json_transcoder.v3.GrpcJsonTranscoder
      proto_descriptor: /etc/envoy/order_intake.pb
      services: ["platform.orderintake.v1.OrderIntakeService"]
```

The `proto_descriptor` file is the compiled `.proto` contract. When the contract changes, the descriptor must be rebuilt and redeployed, so make that part of the same release.

A few cautions. Keep the edge thin: translate, authenticate, and route, but put no business rules there. Decide how gRPC error codes map to HTTP status codes, such as `NOT_FOUND` to 404, so outside callers get useful answers. Long streams of messages are not always a clean fit for JSON over HTTP. How the proxy runs inside the cluster, and how services trust each other with mutual TLS, is covered on the Kubernetes channel.

## The event bridge: from calls to events

Transcoding handles the front of the order's journey. The back is a different meeting point. Order Intake is a call-based service: requests come in, answers go out. But in SD01 we decided that Booking, Compliance, Notifications and Analytics should not be called. They should react to an `OrderAccepted` event.

An **event bridge** is the component that turns "something happened inside a call-based service" into an event on a broker, and routes it to whoever is interested. It can also work the other way: read events and call a system that only has an API, such as an older booking system with a REST endpoint. Amazon EventBridge is one managed example: it receives events, matches them against rules, and sends them to targets, including plain HTTP endpoints.

Where should the bridge sit? Three rules help:

1. **After the commit, never inside the request.** The event should go out only once the order is safely saved. Doing that safely is the subject of SD04 and SD05.
2. **In one owned place.** If every team writes its own little bridge, you get many copies of the same event with slightly different shapes. One bridge, owned by the platform, keeps one event per fact.
3. **With its own contract.** The event shape is a contract, just like the `.proto` file. How to change it without breaking listeners is SD09.

## Recap

- The edge is where outside traffic enters; outside callers usually speak HTTP/JSON.
- gRPC-JSON transcoding lets one gRPC service also serve HTTP/JSON, using HTTP rules in the `.proto` file.
- A proxy such as Envoy or grpc-gateway does the translation; keep it thin and agree on error and naming mappings.
- An event bridge turns facts from call-based services into events, and can turn events back into calls.
- Put the bridge after the commit, in one owned place, with its event shape treated as a contract.

## Sources

- Google AIP-127, "HTTP and gRPC Transcoding": https://google.aip.dev/127
- Envoy, "gRPC-JSON transcoder" filter: https://www.envoyproxy.io/docs/envoy/latest/configuration/http/http_filters/grpc_json_transcoder_filter
- Google Cloud Endpoints, "Transcoding HTTP/JSON to gRPC": https://cloud.google.com/endpoints/docs/grpc/transcoding
- Protocol Buffers, "ProtoJSON Format" (JSON mapping): https://protobuf.dev/programming-guides/json/
- grpc-gateway documentation: https://grpc-ecosystem.github.io/grpc-gateway/
- Amazon EventBridge, "API destinations": https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-api-destinations.html
- Amazon EventBridge, "What is Amazon EventBridge?": https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-what-is.html
- Microsoft Learn, "Compare gRPC services with HTTP APIs": https://learn.microsoft.com/en-us/aspnet/core/grpc/comparison
- Google Cloud blog, "gRPC vs REST: Understanding gRPC, OpenAPI and REST and when to use them in API design": https://cloud.google.com/blog/products/api-management/understanding-grpc-openapi-and-rest-and-when-to-use-them
