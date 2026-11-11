---
title: 'REST APIs with Spring Boot 4: CRUD, Useful Errors and API Versioning'
description: How a small Spring Boot product API reads, adds, changes and removes data with the right status codes, answers errors with ProblemDetail, and keeps old callers working when the response has to change.
pubDate: '2026-11-06T12:00:01Z'
section: spring
topic: rest-apis
relatedVideos:
  - id: T6.1
    title: Build a CRUD REST API with Spring Boot 4 (GET, POST, PUT, DELETE)
    youtubeId: QQxZaIkA5CQ
    pubDate: '2026-11-06T12:00:01Z'
  - id: T6.2
    title: Useful API Errors with ProblemDetail in Spring Boot 4
    youtubeId: lCIWzOvK9Nw
    pubDate: '2026-11-10T12:00:16Z'
  - id: T6.3
    title: 'Spring Framework 7 API Versioning: Keep Old Callers, Add a New Response'
    youtubeId: d3fzHUy9rsA
    pubDate: '2026-11-11T12:00:00Z'
relatedShorts: []
codeUrl: https://github.com/mnafshin/springuniverse-code/tree/main/module-06-products
draft: false
---

A REST API lets programs read and change resources through URLs and HTTP methods. A good one answers each action with a clear status code, explains what went wrong when a request fails, and can add a new response without breaking the programs that already call it. Spring Boot gives you each of those pieces with little code.

## The URL picks the product, the method picks the action

Our shop has a product list, coffee and tea. Each product is a record with an id, a name and a price, and `GET /products` returns the list as JSON with 200 OK. Every answer carries a status code like that one, saying how the request went.

Reading one product takes the id from the path:

```java
@GetMapping("/products/{id}")
ResponseEntity<Product> one(@PathVariable Long id) {
    Product p = products.get(id);
    return p != null ? ResponseEntity.ok(p) : ResponseEntity.notFound().build();
}
```

[ProductController.java](https://github.com/mnafshin/springuniverse-code/blob/main/module-06-products/src/main/java/info/mnafshin/springuniverse/products/ProductController.java)

A `ResponseEntity` holds the body together with its status, so `GET /products/1` answers 200 with coffee, and product 99 gets 404 Not Found.

## Add, change and remove

The other actions follow the same pattern:

- **Add.** `POST /products` carries a name and a price as JSON. The shop picks the id, so the request has its own small record without one, and `@RequestBody` turns the JSON into it. The answer is 201 Created with a `Location` header such as `/products/3`.
- **Change.** `PUT /products/3` with the full name and price replaces the product: 200 with the result, or 404 if the id does not exist.
- **Remove.** `DELETE /products/3` has nothing to send back, so it answers 204 No Content.

## Validate input before the controller runs

Without rules, a program can post an empty name and a negative price and get 201. With the validation starter, the request record states its rules:

```java
public record ProductRequest(@NotBlank String name, @NotNull @Positive BigDecimal price) {}
```

[ProductRequest.java](https://github.com/mnafshin/springuniverse-code/blob/main/module-06-products/src/main/java/info/mnafshin/springuniverse/products/ProductRequest.java)

`@Valid` goes in front of the request body for `POST` and `PUT`. The same bad request now gets 400 Bad Request, and the controller method never runs.

## Errors that say what went wrong

That 400 and the 404 for product 99 still say too little: the 404 has an empty body, and the 400 does not name the fields that failed.

`ProblemDetail` is a standard JSON shape for HTTP API errors, with members such as `title`, `status`, `detail` and `instance` (the request path). One property makes Spring Boot use it for Spring's own web exceptions:

```properties
spring.mvc.problemdetails.enabled=true
```

The bad post now answers with `Content-Type: application/problem+json`. Product 99 still returns an empty 404, because that 404 never was an exception; our method returned "not found" by itself.

## One place for error handling

So the errors move into one `@RestControllerAdvice`, a class that watches for exceptions from controllers. The read-one method throws a small `ProductNotFoundException`, and a handler in the advice turns it into a 404 `ProblemDetail` naming the missing product. The controller stays on the happy path.

The same advice extends Spring's `ResponseEntityExceptionHandler` and overrides its validation method to add an `errors` property: name must not be blank, price must be greater than zero. The [Error Responses](https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-ann-rest-exceptions.html) page covers the details.

## A new response without breaking old callers

Later, each drink should say whether it is in stock. Old callers agreed to the list without `inStock`, so that response stays, and new callers get the same drinks plus the new field. An API version is the value that chooses which response you get. The question is where it lives.

The familiar answer is the path: `/v1/products` and `/v2/products`, served by two controllers. That is still a valid way to ship both.

## Built-in versioning in Spring Framework 7

Spring Framework 7 also has [built-in versioning](https://docs.spring.io/spring-framework/reference/web/webmvc-versioning.html). One `/products` path stays, and the framework reads the version from the request: a header, the path or a media type. With a header:

```properties
spring.mvc.apiversion.use.header=API-Version
```

One method is marked as version 1 and the other as version 2. `API-Version: 1` returns the old list and `API-Version: 2` the stock list. Our app requires a version, so a missing header, or a version it does not declare such as 3, returns 400.

For an app already on Framework 7 that needs versions, this is a sensible choice, not a reason to migrate an API that works. The path suits public links and simple browser calls. A header keeps one address, but then clients, tools and any cache must all tell the versions apart.

## Recap

- The URL picks the resource; the HTTP method picks the action. Answer with the right status code: 200, 201, 204, 404.
- Validate input so a bad request gets 400 before the controller method runs.
- Use `ProblemDetail` and one `@RestControllerAdvice` so error bodies name what went wrong.
- When a response must change, keep the old contract. An API version, in the path or a header, chooses which response the caller gets.
- Built-in versioning in Spring Framework 7 suits a new need, not a migration of an API that already works.
