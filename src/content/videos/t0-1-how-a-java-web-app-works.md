---
title: 'How a Java Web App Works: From Browser to Spring and Back'
description: You type an address, press Enter, and this appears. A greeting, as JSON. It took a few milliseconds.
youtubeId: qjsSDrTLdFo
pubDate: '2026-10-17T16:00:21Z'
series: tutorials
seriesLabel: T0.1
order: 10
codeUrl: https://github.com/mnafshin/springuniverse-code/tree/main/module-00-foundations
shorts:
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
---

## 00 Cold open
You type an address, press Enter, and this appears. A greeting, as JSON. It took a few milliseconds. But in those milliseconds, your request went on a trip: through the network, into a Java program, and back again. In this video, we follow that trip, step by step. And then we build the server ourselves, in plain Java, so you'll know exactly what Spring does for you later.

## 01 The whole trip in 60 seconds
Here's the whole trip, before we zoom in. Your browser is the client. First, it connects to the server's address and sends an HTTP request. On the other side, a server is listening. That server is a Java program. Inside it, a piece of code handles the request. Later in this series, that code will be Spring. It builds a response, usually JSON, and sends it back with a status code, like two hundred, OK. The browser reads the response and shows it to you. Four stops, one round trip. Now let's walk through each one.

## 02 Client and server
The web works with two roles. The client asks. The server answers. Your browser is a client. So is your phone app, or a tiny Java program, as we'll see in the demo. The server is a program that waits for requests, and answers each one. It never calls you first. It only responds. One server can answer many clients at the same time. And one machine can be a client and a server. In fact, in our demo, your laptop plays both roles. Remember this split, because everything else hangs on it. When we write Spring code, we write the server side.

## 03 The HTTP letter: request and response
Once connected, the browser sends an HTTP request. Think of it as a letter. The first line says what you want: a method, like GET, and a path, like slash hello. Then come headers, extra notes like, I accept JSON. Some requests, like POST, also carry a body. The server writes back. Its first line has a status code. Two hundred means OK. Four oh four means not found. Five hundred means the server broke. Then come headers, like the content type, and finally the body: the thing you asked for. Every web app you'll ever build speaks this same letter format.

## 04 APIs, REST and JSON
Often, the client isn't a person looking at a page. It's another program. The set of requests a server accepts is its API, a contract between programs. A popular style for that contract is REST. You work with resources, like a book, and each one has a URL, like slash books slash forty-two. HTTP methods say what to do. GET reads. POST creates. PUT updates. DELETE removes. And the data usually travels as JSON. It's just text: curly braces for an object, keys in double quotes, then values, and square brackets for lists. People can read it, and programs can parse it. You might ask: is every HTTP API truly RESTful? Not always. Many only follow some of the rules. That's fine. What matters is that client and server agree.

## 05 Inside the server: a handler answers
So what happens inside the server? Let's look at real code, from our companion repo. This is plain Java, no framework. We create an HTTP server from the JDK, and register a handler for the path slash hello. When a request arrives, the server calls our handler. We check the method: only GET is allowed, anything else gets four oh five, method not allowed. We read the name from the query string. Then we build a Java object, a Greeting, and turn it into JSON with Jackson. Finally, we set the content type, send status two hundred, and write the body.

## 06 Live demo: our own tiny server
Let's run it. Clone the companion repo, and in the first terminal, start the server from its README.
```
# start HelloHttpServer (exact command: see the repo README)
Try: curl 'http://localhost:8080/hello?name=Ada'
```
The server is now listening on port eight oh eight oh. In a second terminal, we play the browser, with curl.
```
$ curl -i 'http://localhost:8080/hello?name=Ada'
HTTP/1.1 200 OK
Content-type: application/json
Content-length: 37

{"message":"Hello, Ada!","length":11}
```
There's the whole letter. Status line, two hundred OK. Headers, with the content type, JSON. And the body. Now let's break the rules. Send a POST instead.
```
$ curl -i -X POST 'http://localhost:8080/hello'
HTTP/1.1 405 Method Not Allowed
Allow: GET
```
Four oh five, and the server even tells us what it allows. Now open the same address in a real browser, and you'll see the same JSON. Same request, same answer. The browser is just another client. And if you want a client in Java, the clientserver package does exactly this with the JDK's HttpClient, and the rest package has a small REST API for books, with GET, POST, PUT and DELETE. All of it is covered by tests, so you can change things and see what breaks.

## 07 Where Spring fits
So, where does Spring fit? In Spring, the same endpoint looks like this: a class marked as a REST controller, and a method marked with GET mapping, slash hello, that just returns a Greeting. Spring receives the request, calls your method, and turns the result into JSON with Jackson, for you. It also creates your objects and wires them together. That's dependency injection: instead of building its helpers with new, your class asks for them in the constructor, and Spring's container passes them in. You might ask: so was all this plain Java a waste of time? No. Spring does exactly what we just did, at scale. So when Spring answers a request, you'll know what is happening behind it.

## 08 Recap: the whole trip again
Let's take the trip one last time. The browser is the client. The browser sends an HTTP request: a method, a path, headers. A server is listening: a Java program. A handler, and later Spring, answers with a status code and a JSON body. And the browser shows it. Client asks. Server answers. That's how a Java web app works.
