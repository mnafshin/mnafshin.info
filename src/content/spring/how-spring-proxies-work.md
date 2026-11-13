---
title: 'How Spring Proxies Work: the Self-Call Trap, CGLIB vs JDK, final and private'
description: Annotations such as @Async and @Transactional work through a proxy, a stand-in object Spring puts in front of your bean. Knowing what the proxy can and cannot see explains the self-call trap, final methods, final classes and private methods.
pubDate: '2026-10-27T18:03:31Z'
section: spring
topic: proxies
relatedVideos:
  - id: T4.2a
    title: 'Why @Async Does Nothing: Spring Proxies and the Self-Call Trap'
    youtubeId: CJpskEeVZSs
    pubDate: '2026-10-27T18:03:31Z'
  - id: T4.2b
    title: Why Is My Field Null? Spring CGLIB vs JDK Proxies, final and private
    youtubeId: Tr3OySYJ8Hw
    pubDate: '2026-10-28T12:00:07Z'
relatedShorts: []
codeUrl: https://github.com/mnafshin/springuniverse-code/tree/main/module-04-container
draft: false
---

A proxy is a stand-in object that Spring puts in front of your bean. Annotations such as `@Async` and `@Transactional` only work when a call goes through that proxy. Once you know that, the self-call trap, final methods, and the difference between CGLIB and JDK proxies all follow from the same idea.

## Two objects behind one bean

When the app asks Spring for the order service, it does not get the class you wrote. It gets a generated subclass, a CGLIB proxy whose class name ends in `$$SpringCGLIB`, with your real object behind it.

Each call lands on the proxy first. For an `@Async` method, the proxy hands the work to a background thread and returns at once. For a `@Transactional` method, it starts a transaction, passes the call to the real object, and ends the transaction afterwards. So an annotation such as `@Async`, `@Transactional`, `@Cacheable` or `@Retryable` only works when a call passes through the proxy.

## The self-call trap

Our shop's checkout sends a confirmation email, and the mail server takes three seconds. The email method is marked `@Async`, yet the customer still waits three seconds. Look at how `checkout` calls it:

```java
public void checkout(String id) {
    // ... save the order
    sendConfirmation(id); // this.sendConfirmation(id): skips the proxy, so not async
}

@Async
public void sendConfirmation(String id) {
    mailServer.send(id); // takes 3 seconds
}
```

[OrderService.java](https://github.com/mnafshin/springuniverse-code/blob/main/module-04-container/src/main/java/info/mnafshin/springuniverse/container/checkout/mail/OrderService.java)

The app called `checkout` on the proxy. `checkout` has no annotation, so the proxy passed the call through to the real object. Inside it, `sendConfirmation` is called on `this`, the real object, so the proxy never sees the call and the email goes out on the caller's thread.

That is the self-call trap: one method calling another method in the same object. There is no error and no warning, and other proxy annotations fall into it too:

- `@Transactional`: a checkout that calls its own `@Transactional` save can leave half an order in the database, because there was no transaction to roll back.
- `@Cacheable`: a cart total that calls its own `@Cacheable` price method can look up the same price three times.
- `@Retryable`: a payment charge that should retry can fail once and stop.

## The fix: call another bean

The reliable fix is to make the call cross from one bean to another. Move the email method into its own bean, a `ConfirmationMailer` with an `@Async` `send` method, and inject it:

```java
public void checkout(String id) {
    // ... save the order
    mailer.send(id);
}
```

[FixedOrderService.java](https://github.com/mnafshin/springuniverse-code/blob/main/module-04-container/src/main/java/info/mnafshin/springuniverse/container/checkout/mail/FixedOrderService.java) · [ConfirmationMailer.java](https://github.com/mnafshin/springuniverse-code/blob/main/module-04-container/src/main/java/info/mnafshin/springuniverse/container/checkout/mail/ConfirmationMailer.java)

Now the call hits the mailer's proxy. The customer waits zero seconds, and the email goes out a few seconds later on a background thread.

## Final methods

A CGLIB proxy is a subclass, so it can only do what a subclass can do in Java. During a cleanup, the order service's `@Transactional` `total` method was made `final`:

```java
@Transactional(readOnly = true)
public final int total(String... items) {
    int sum = 0;
    for (String item : items) {
        sum += prices.price(item);
    }
    return sum;
}
```

[BrokenOrderService.java](https://github.com/mnafshin/springuniverse-code/blob/main/module-04-container/src/main/java/info/mnafshin/springuniverse/container/checkout/finalmethod/BrokenOrderService.java)

Now `total` throws a `NullPointerException`: `prices` is null, although the constructor sets it. Spring creates the proxy without calling your constructor, so the proxy's own fields stay empty. A subclass cannot override a `final` method, so `total` runs on the proxy itself, where `prices` was never set, and without a transaction.

With Spring Boot's default logging, Spring even warns about this at startup. Remove `final` and the total is 7 again, because the call reaches the real object.

## Final classes and private methods

Java does not allow a subclass of a `final` class at all. A final `ReceiptService` with an `@Transactional` method stops the app from starting.

A private method is always a self-call. A proxy cannot override it, and only the class itself can call it, so a checkout that calls its own private `@Transactional` save reports "transaction active = false". See [PrivateOrderService.java](https://github.com/mnafshin/springuniverse-code/blob/main/module-04-container/src/main/java/info/mnafshin/springuniverse/container/checkout/finalmethod/PrivateOrderService.java).

## JDK proxies

The other kind of proxy is built into Java. A JDK proxy implements your bean's interfaces instead of subclassing its class, so a final class is fine. In Spring Framework 7, `@Proxyable(INTERFACES)` asks for one:

```java
@Proxyable(INTERFACES)
public final class JdkReceiptService implements Receipts {
```

[JdkReceiptService.java](https://github.com/mnafshin/springuniverse-code/blob/main/module-04-container/src/main/java/info/mnafshin/springuniverse/container/checkout/finalclass/JdkReceiptService.java)

The class stays final, the app starts, and the receipt runs in a transaction.

The catch is that a JDK proxy is only the interface. A payment service with a JDK proxy is no longer a `PaymentService`, so asking the container for that class fails. Ask for the `Payments` interface instead, in `getBean` and in constructors.

Plain Spring Framework uses a JDK proxy for a bean with an interface and CGLIB for one without. Spring Boot uses CGLIB for every bean, because it works for more beans and you can still ask for the class. The [Proxying Mechanisms](https://docs.spring.io/spring-framework/reference/core/aop/proxying.html) page has the full rules.

## Recap

- When an annotation seems to do nothing, ask: did this call go through the proxy?
- A self-call on `this` skips the proxy. The reliable fix is to call another bean.
- A CGLIB proxy cannot reach final methods, final classes or private methods.
- Keep proxied methods public and not final, in a class that is not final.
- A JDK proxy implements interfaces, so ask for the interface, not the class. Spring Boot uses CGLIB by default.

## Sources

Official documentation and well-known tutorials read while writing this article. The wording here is our own.

- [Spring Framework reference: Proxying Mechanisms](https://docs.spring.io/spring-framework/reference/core/aop/proxying.html)
- [Marco Behler: Spring Transaction Management: @Transactional In-Depth](https://www.marcobehler.com/guides/spring-transaction-management-transactional-in-depth)
- [Java Code Geeks: How Spring Proxies Actually Work, and the Four Cases Where They Silently Don’t](https://www.javacodegeeks.com/2026/07/how-spring-proxies-actually-work-and-the-four-cases-where-they-silently-dont.html)
- [JavaBrahman: How Spring Proxies Work and the Self-Invocation Trap](https://www.javabrahman.com/spring/spring-proxies-self-invocation-trap/)
