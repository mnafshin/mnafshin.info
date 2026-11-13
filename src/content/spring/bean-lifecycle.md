---
title: 'Spring Bean Lifecycle: @PostConstruct, @PreDestroy, @Lazy and @DependsOn'
description: When Spring creates a bean, injects it, runs its setup and cleans it up, and how to put your code at the right moment. Covers @PostConstruct, @PreDestroy, @Lazy, @DependsOn and why cleanup needs a closed container.
pubDate: '2026-10-29T17:11:43Z'
section: spring
topic: bean-lifecycle
relatedVideos:
  - id: T4.1
    title: 'Spring Bean Lifecycle Explained: @PostConstruct, @PreDestroy, @Lazy, @DependsOn'
    youtubeId: loahk4gher0
    pubDate: '2026-10-29T17:11:43Z'
relatedShorts: []
codeUrl: https://github.com/mnafshin/springuniverse-code/tree/main/module-04-container/src/main/java/info/mnafshin/springuniverse/container/shop
draft: false
---

A Spring bean has a lifecycle: the container creates it, injects its dependencies, runs its setup, hands it out for use, and runs its cleanup when the container closes. Knowing those steps tells you where your own setup and cleanup code belong. Code placed at the wrong step fails in quiet ways, so the order is worth learning once.

## The five steps

A bean is an object the Spring container creates and manages. Each one goes through the same steps:

1. the container calls the constructor;
2. it injects the dependencies;
3. it calls your init callback, the place for setup code;
4. the bean is in use;
5. when the container closes, it calls your destroy callback.

## Setup belongs after injection

Our shop's price cache loads prices from a price source at startup. In its first version, the source is injected into a field, and the constructor uses it:

```java
@Autowired
private PriceSource source;

public BrokenPriceCache() {
    System.out.println("constructor: source = " + source);
    prices.putAll(source.load());   // source is still null here
}
```

[BrokenPriceCache.java](https://github.com/mnafshin/springuniverse-code/blob/main/module-04-container/src/main/java/info/mnafshin/springuniverse/container/shop/nullfield/BrokenPriceCache.java)

Spring must create the object before it can set its fields. During the constructor, step 2 has not happened, so `source` is null and startup fails with a `NullPointerException`.

The first choice is constructor injection, where the dependency arrives as a parameter and is never null:

```java
public ConstructorPriceCache(PriceSource source) {
    System.out.println("constructor: source = " + source);
    prices.putAll(source.load());
}
```

[ConstructorPriceCache.java](https://github.com/mnafshin/springuniverse-code/blob/main/module-04-container/src/main/java/info/mnafshin/springuniverse/container/shop/nullfield/ConstructorPriceCache.java)

The other fix is a method marked `@PostConstruct`, which runs after every dependency is injected; see [FixedPriceCache.java](https://github.com/mnafshin/springuniverse-code/blob/main/module-04-container/src/main/java/info/mnafshin/springuniverse/container/shop/nullfield/FixedPriceCache.java). Keep `@PostConstruct` for setup that needs the finished bean, and keep it short, because startup waits for it.

## Three ways to hook in

Spring offers three hooks for setup: `@PostConstruct`, `InitializingBean.afterPropertiesSet` and an init method named on `@Bean`. It offers three matching hooks for cleanup. The Spring docs recommend [`@PostConstruct` and `@PreDestroy`](https://docs.spring.io/spring-framework/reference/core/beans/annotation-config/postconstruct-and-predestroy-annotations.html), because they do not tie your class to Spring. For `@Bean` methods, a public `close` method is called at shutdown on its own.

## When beans are created

Singletons are created once, at startup, so a broken bean stops the app at once instead of hours later. For a slow, rarely used bean such as our sales report, that delays every start. One annotation changes the moment:

```java
@Component
@Lazy
public class LazySalesReport {
```

[LazySalesReport.java](https://github.com/mnafshin/springuniverse-code/blob/main/module-04-container/src/main/java/info/mnafshin/springuniverse/container/shop/whencreated/LazySalesReport.java)

The report is now created the first time someone asks for it. But a lazy bean with a problem only fails when first used, so use `@Lazy` sparingly.

## Cleanup needs a closed container

The price export creates a temp folder at startup and deletes it in `@PreDestroy`. A small `main` that starts a container, uses the bean and ends leaves the folder behind, because destroy callbacks run only when the container closes. The fix is to close it:

```java
try (var context = new AnnotationConfigApplicationContext(PriceExport.class)) {
    System.out.println("working with " + context.getBean(PriceExport.class).getClass().getSimpleName());
}
```

[CloseApp.java](https://github.com/mnafshin/springuniverse-code/blob/main/module-04-container/src/main/java/info/mnafshin/springuniverse/container/shop/cleanup/CloseApp.java)

With try-with-resources, the container closes at the end of the block, and the folder goes. Spring Boot registers a shutdown hook, so Ctrl+C or a normal stop signal also closes the context. A forced `kill -9` ends the JVM at once, and no cleanup runs.

## Creation order and @DependsOn

A dependency is always created before the bean that needs it, so the price source exists before the price cache. But the price source reads a table that the migrations bean creates, and it never calls the migrations, so Spring cannot see that link. Name it explicitly:

```java
@Bean
@DependsOn("migrations")
public PriceSource priceSource() {
    return new PriceSource();
}
```

[DependsOnConfig.java](https://github.com/mnafshin/springuniverse-code/blob/main/module-04-container/src/main/java/info/mnafshin/springuniverse/container/shop/order/DependsOnConfig.java)

Now the migrations run first, and the price source finds its table.

Shutdown runs in reverse: the cache closes first, then the price source, then the migrations. A bean is never destroyed while a bean that needs it is still running.

## Recap

- A bean is constructed, injected, initialized, used, then destroyed when the container closes.
- Don't do setup in a constructor that needs injected fields. Prefer constructor injection, and `@PostConstruct` for work that needs the finished bean.
- `@Lazy` delays creation, so a broken lazy bean fails only when first used.
- Destroy callbacks run only when the container closes. Spring Boot registers a shutdown hook, but `kill -9` skips cleanup.
- `@DependsOn` states a dependency Spring cannot see. Shutdown runs in reverse order.

## Sources

Official documentation and well-known tutorials read while writing this article. The wording here is our own.

- [Spring Framework reference: Using @PostConstruct and @PreDestroy](https://docs.spring.io/spring-framework/reference/core/beans/annotation-config/postconstruct-and-predestroy-annotations.html)
- [Spring Framework reference: Customizing the Nature of a Bean](https://docs.spring.io/spring-framework/reference/core/beans/factory-nature.html)
- [Baeldung: Spring PostConstruct and PreDestroy Annotations](https://www.baeldung.com/spring-postconstruct-predestroy)
- [HowToDoInJava: Spring Bean Life Cycle in Spring Boot: Phases and Order](https://howtodoinjava.com/spring-core/spring-bean-life-cycle/)
- [LogicBig: Receiving lifecycle callbacks by using @PostConstruct and @PreDestroy](https://logicbig.com/tutorials/spring-framework/spring-core/lifecycle-callbacks.html)
