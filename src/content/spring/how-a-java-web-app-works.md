---
title: 'How a Java Web App Works: From Browser to Spring and Back'
description: What happens between typing an address and seeing a JSON answer, written as a short trip through client, HTTP, JSON and a plain Java server, and the one part of that trip Spring automates.
pubDate: '2026-10-17T16:00:21Z'
section: spring
topic: java-web-basics
relatedVideos:
  - id: T0.1
    title: 'How a Java Web App Works: From Browser to Spring and Back'
    youtubeId: qjsSDrTLdFo
    pubDate: '2026-10-17T16:00:21Z'
relatedShorts:
  - title: 'Library or framework? One question tells you which. #java #spring'
    youtubeId: KBRjeP91zBw
  - title: 'What actually happens when you open a website? #webdev #java'
    youtubeId: xLsPSGVG5ik
  - title: 'Every HTTP request is just a letter #http #webdev'
    youtubeId: Db5GQC9aNOs
  - title: 'REST isn''t a library. It''s a set of rules. #restapi #java'
    youtubeId: PCOB9eD27MU
  - title: 'JSON: the language APIs speak. #json #java'
    youtubeId: Rrxrk9LqBvQ
  - title: 'Why nobody downloads JARs by hand anymore #maven #java'
    youtubeId: x4xzc0J2maI
  - title: 'Dependency injection, without the jargon #java #spring'
    youtubeId: VZLmPVweEmQ
  - title: 'Java vs the JVM: not the same thing #java #jvm'
    youtubeId: YI7ZIZyd3To
codeUrl: https://github.com/mnafshin/springuniverse-code/tree/main/module-00-foundations
draft: false
---

A Java web app is a program that waits for HTTP requests and answers each one. Every request makes the same trip: a client asks, HTTP carries the question, a handler on the server builds the answer, and the response travels back. Spring automates one part of that trip, so it helps to know the whole route first.

## Client and server

The web has two roles. The client asks and the server answers. A browser is a client, and so is a phone app or a small Java program.

The server is a program that waits for requests and answers each one; it never calls a client first. One server can answer many clients at once. When we write Spring code, we write the server side.

## An HTTP request is a letter

Once connected, the client sends an HTTP request. Think of it as a letter. The first line says what you want: a method such as `GET` and a path such as `/hello`. Then come headers, short notes like "I accept JSON". Some requests, such as `POST`, also carry a body.

The server writes back in the same format. Its first line holds a status code: 200 means OK, 404 means not found, 500 means the server broke. Then come headers, such as the content type, and finally the body you asked for.

## APIs, REST and JSON

Often the client is another program. The set of requests a server accepts is its API, a contract between programs.

REST is a popular style for that contract. Each resource, like a book, has a URL such as `/books/42`, and the HTTP method says what to do with it: `GET` reads, `POST` creates, `PUT` updates, `DELETE` removes. Not every HTTP API follows every REST rule, and that is fine. What matters is that client and server agree.

The data usually travels as JSON: plain text with curly braces for objects, keys in double quotes, and square brackets for lists. People can read it, and programs can parse it.

## A server in plain Java

No framework is needed to answer a request. The JDK has a small built-in HTTP server, and we register one handler for `/hello`. Watch the order of the work in the handler:

```java
if (!"GET".equals(exchange.getRequestMethod())) {
    exchange.getResponseHeaders().add("Allow", "GET");
    exchange.sendResponseHeaders(405, -1);
    exchange.close();
    return;
}
String name = queryParam(exchange.getRequestURI().getRawQuery(), "name", "World");
String message = "Hello, " + name + "!";
byte[] body = JSON.writeValueAsBytes(new Greeting(message, message.length()));
exchange.getResponseHeaders().add("Content-Type", "application/json");
exchange.sendResponseHeaders(200, body.length);
```

[HelloHttpServer.java](https://github.com/mnafshin/springuniverse-code/blob/main/module-00-foundations/src/main/java/info/mnafshin/springuniverse/foundations/http/HelloHttpServer.java)

Anything but `GET` gets 405 Method Not Allowed with an `Allow: GET` header. A `GET` reads the name from the query string, turns a `Greeting` into JSON with Jackson, sets the content type and sends 200.

Here is that answer as curl prints it, status line and headers first, then the body:

```
$ curl -i 'http://localhost:8080/hello?name=Ada'
HTTP/1.1 200 OK
Content-type: application/json

{"message":"Hello, Ada!","length":11}
```

A browser gets the same JSON, because it is just another client.

## Where Spring fits

Our handler did everything by hand: it checked the method, read the parameter, wrote the JSON and picked the status code. In Spring, the same endpoint is a class marked `@RestController` with a method marked `@GetMapping("/hello")` that returns a `Greeting`. Spring receives the request, calls the method and turns the result into JSON with Jackson.

Spring also creates your objects and connects them. This is dependency injection: instead of building its helpers with `new`, a class asks for them in its constructor, and Spring's container passes them in.

So Spring does what our handler did, at scale, and the trip stays the same. For more on the request and response format, see MDN's [overview of HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview).

## Recap

- A client asks and a server answers; the server never calls first.
- An HTTP request names a method and a path. The response starts with a status code and may carry a JSON body.
- An API is a contract between programs. REST gives each resource a URL and uses the HTTP method as the action.
- A plain JDK handler can answer `/hello` by hand. In Spring, a `@RestController` method does the same, and the container wires your objects with dependency injection.
