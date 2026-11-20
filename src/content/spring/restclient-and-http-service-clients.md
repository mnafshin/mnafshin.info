---
title: 'Calling Another API with RestClient and HTTP Service Clients'
description: How a Spring Boot app calls another app's API, first with the RestClient builder Spring Boot provides, then with an HTTP service client described by @GetExchange, imported with @ImportHttpServices, and given its base URL by one property.
summary: "How a Spring Boot app calls another app's API, first with the RestClient builder Spring Boot provides, then with an HTTP service client described by @GetExchange and imported with @ImportHttpServices."
pubDate: '2026-11-12T12:00:00Z'
section: spring
topic: restclient
relatedVideos:
  - id: T7.1
    title: RestClient and HTTP interface clients in Spring Boot 4
    youtubeId: rtlM9kZ5YDU
    pubDate: '2026-11-12T12:00:00Z'
relatedShorts: []
codeUrls:
  - https://github.com/mnafshin/springuniverse-code/tree/main/module-07-shop
  - https://github.com/mnafshin/springuniverse-code/tree/main/module-07-storefront
draft: false
---

A Spring Boot app often needs to call an API that another app already provides. `RestClient` is Spring's class for sending those HTTP requests from Java. Spring Boot gives you a `RestClient.Builder` that is already set up for JSON: you set a base URL, build a client, and send the request. For later calls, you can describe the request on an interface and let Spring Boot build the client for you.

## Two apps, one catalog

Our coffee shop is its own app. It listens on port 8081 and serves the familiar product list: coffee at 4.50 and tea at 3.20. `GET /products` returns that list as JSON with 200 OK. `GET /products/1` returns coffee, and `GET /products/99` returns 404 Not Found, because no product has that id.

The storefront is a second app, on port 8080. It has no products of its own. It needs the shop's catalog, over HTTP, so its own pages can show the same drinks. In a company, that split is common: one team provides an API, and another team calls it.

## Take the builder, set a base URL, and build

In the storefront's catalog class, we ask Spring Boot for a `RestClient.Builder`. A base URL is the prefix shared by every address this client will call. Here it is the shop on port 8081. We set that on the builder and call `build()`:

```java
CatalogController(RestClient.Builder builder, ProductClient productClient) {
    this.restClient = builder.baseUrl("http://localhost:8081").build();
    this.productClient = productClient;
}

@GetMapping("/catalog")
List<Product> catalog() {
    return restClient.get()
            .uri("/products")
            .retrieve()
            .body(new ParameterizedTypeReference<List<Product>>() {});
}
```

[CatalogController.java](https://github.com/mnafshin/springuniverse-code/blob/main/module-07-storefront/src/main/java/info/mnafshin/springuniverse/storefront/CatalogController.java)

Spring Boot already configured that builder with JSON converters, so we inject it rather than calling `RestClient.create()` ourselves. `GET /catalog` now sends `GET /products` to the shop. `ParameterizedTypeReference` tells `RestClient` that the JSON is a list of `Product` values, not a single object. `GET /catalog` then answers 200 with coffee and tea: the storefront fetched that list from the shop. The constructor also takes a `ProductClient`, which the next section uses.

The [Calling REST Services](https://docs.spring.io/spring-boot/reference/io/rest-client.html) page in the Spring Boot reference is the official guide to the builder, and to the interface clients below.

## Describe the next call on an interface

Next, the storefront wants one product, at `GET /catalog/{id}`. We could write another `RestClient` call by hand. Or we can describe the call and let Spring write it.

An HTTP service client is an interface that names the calls to one API. Spring turns that interface into a client for you. `@GetExchange` marks a method as a GET call. The interface itself has no address:

```java
interface ProductClient {

    @GetExchange("/products/{id}")
    Product one(@PathVariable Long id);

}
```

[ProductClient.java](https://github.com/mnafshin/springuniverse-code/blob/main/module-07-storefront/src/main/java/info/mnafshin/springuniverse/storefront/ProductClient.java)

On the storefront app, `@ImportHttpServices` tells Spring Boot which interfaces to turn into clients, in a named group. A group is a set of interfaces that share one client setup, usually one other host. We call this group `shop` and list `ProductClient`. Then one property gives that group its base URL:

```java
@SpringBootApplication
@ImportHttpServices(group = "shop", types = ProductClient.class)
public class StorefrontApp { /* ... */ }
```

```properties
spring.http.serviceclient.shop.base-url=http://localhost:8081
```

[StorefrontApp.java](https://github.com/mnafshin/springuniverse-code/blob/main/module-07-storefront/src/main/java/info/mnafshin/springuniverse/storefront/StorefrontApp.java) · [application.properties](https://github.com/mnafshin/springuniverse-code/blob/main/module-07-storefront/src/main/resources/application.properties)

The address stays out of the interface, so you can change it without touching the Java. `GET /catalog/{id}` now asks `productClient.one(id)`.

## When the shop answers 404

`productClient.one(1)` returns coffee, and `GET /catalog/1` answers 200 with that product. For product 99, the shop still answers 404. The client does not return an empty body; it throws `HttpClientErrorException.NotFound`. The catalog method catches that exception and answers 404 too, so the storefront passes the miss along:

```java
@GetMapping("/catalog/{id}")
ResponseEntity<Product> one(@PathVariable Long id) {
    try {
        return ResponseEntity.ok(productClient.one(id));
    } catch (HttpClientErrorException.NotFound e) {
        return ResponseEntity.notFound().build();
    }
}
```

[CatalogController.java](https://github.com/mnafshin/springuniverse-code/blob/main/module-07-storefront/src/main/java/info/mnafshin/springuniverse/storefront/CatalogController.java)

`GET /catalog` still returns coffee and tea through `RestClient`. The interface added the next call; it did not replace the first one.

## Recap

- Inject the `RestClient.Builder` Spring Boot provides, set a base URL, and call `build()`.
- Send a request with `get()`, `uri()`, `retrieve()`, and `body(...)`.
- For later calls, describe the request on an interface with `@GetExchange`. Leave the address off the interface.
- Register the interface with `@ImportHttpServices` in a named group, and set that group's base URL with `spring.http.serviceclient.<group>.base-url`.
- When the other app answers 404, the client throws `HttpClientErrorException.NotFound`. Catch it if you want to pass that 404 along.

## Sources

Official documentation and well-known tutorials read while writing this article. The wording here is our own.

- [Spring Boot reference: Calling REST Services](https://docs.spring.io/spring-boot/reference/io/rest-client.html)
- [Spring Framework reference: REST Clients](https://docs.spring.io/spring-framework/reference/integration/rest-clients.html)
- [Dan Vega: HTTP Interfaces in Spring Boot 4](https://www.danvega.dev/blog/http-interfaces-spring-boot-4)
- [Baeldung: A Guide to RestClient in Spring Boot](https://www.baeldung.com/spring-boot-restclient)
- [Dimitri's tutorials: Improvements to HTTP interfaces](https://dimitri.codes/restclient/)
