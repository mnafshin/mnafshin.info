---
title: Useful API Errors with ProblemDetail in Spring Boot 4
description: 'In this video, we give our shop API useful, predictable error responses with Problem Detail. Here is the shop''s product API: coffee and tea. Ask for product ninety nine, and the answer is four oh four.'
youtubeId: lCIWzOvK9Nw
pubDate: '2026-11-10T12:00:16Z'
series: tutorials
seriesLabel: T6.2
order: 180
---

## 00 Errors that say too little
In this video, we give our shop API useful, predictable error responses with Problem Detail.
Here is the shop's product API: coffee and tea.
Ask for product ninety nine, and the answer is four oh four.
The status is clear.
The body is empty.
Post a product with an empty name and a negative price, and the answer is four hundred.
The body is JSON, but it only repeats the status and the path.
It does not say which fields failed.

## 01 Who answers when a controller throws
A Rest Controller Advice is one class that watches for exceptions from our controllers.
When a controller method throws, a matching exception handler in that advice runs instead, and builds the HTTP response: the status and the body.
The controller stays on the happy path.
The advice owns the error answer.
We have not changed the app yet.
Next we choose what that body looks like.

## 02 Problem Detail, and one property
Problem Detail is a standard JSON shape for HTTP API errors.
The members we use here are title, status, detail and instance: the request path.
A type member is optional, and our answers omit it.
Spring Boot can emit that shape for its own web exceptions with one property: spring dot M V C dot problem details dot enabled equals true.
We restart the app to load the property, so its in-memory list starts fresh.
The same bad post now answers with Content-Type application slash problem plus JSON, and a Problem Detail body.
The detail still says only invalid request content.
Ask for product ninety nine again, and the body is still empty.
That four oh four never became an exception: our read method returned not found by itself.
The property helps Spring's errors.
Our missing product still needs our own advice.

## 03 Our missing product as Problem Detail
So we change the read-one method.
If the id is missing, we throw a small Product Not Found Exception.
Then we add a Rest Controller Advice with an exception handler that builds a Problem Detail for four oh four, naming the missing product.
We restart again to load the change.
Ask for ninety nine.
The answer is four oh four, and a Problem Detail body.
Ask for product one: coffee is still there, with two hundred.
Only this read-one path throws today.
A missing id on put or delete still returns an empty four oh four, until we teach those the same way.

## 04 Field errors in the 400
The validation four hundred is already a Problem Detail, but its detail is still vague.
At Valid already rejects bad input.
We make the same advice extend Spring's Response Entity Exception Handler, and override its validation method.
First we call the base method to build the standard Problem Detail response.
Then we read the field errors, put each field name and its message into a map, and set that map as an errors property on the Problem Detail.
We return that response.
Boot's built-in handler steps aside.
After a restart, the same bad post still has title, status, detail and instance, and it adds an errors object: name must not be blank, price must be greater than zero.
A good post still creates cocoa with two oh one, at slash products slash three.
The bad post did not take an id.

## 05 Recap
Let's recap.
A Rest Controller Advice turns a thrown exception into an HTTP answer.
Problem Detail is the JSON error body: title, status, detail, instance.
One property covers Spring's own web errors.
Our missing product needs an exception and an advice handler that can also attach field errors.
The body finally tells the client what went wrong.
The code is linked below.
