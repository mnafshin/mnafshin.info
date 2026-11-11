---
title: 'Spring Circular Dependencies: Why Boot Refuses Them and How to Fix Them'
description: Two beans that need each other cannot both be created first, so Spring Boot stops at startup. Why the allow-circular-references flag and @Lazy only hide the cycle, and two ways to remove it.
pubDate: '2026-10-30T12:00:26Z'
section: spring
topic: circular-dependencies
relatedVideos:
  - id: T4.3
    title: 'Spring Circular Dependencies: Why Boot Refuses Them and How to Fix Them'
    youtubeId: pWrdkeQv-WM
    pubDate: '2026-10-30T12:00:26Z'
relatedShorts: []
codeUrl: https://github.com/mnafshin/springuniverse-code/tree/main/module-04-container/src/main/java/info/mnafshin/springuniverse/container/cycles
draft: false
---

A circular dependency is when two beans need each other to be created: A needs B, and B needs A. Spring Boot refuses this by default, because neither bean can be finished first. The lasting fix is to break the cycle in the design, not to hide it with a setting.

## Why Spring cannot build a cycle

Spring creates a dependency before the bean that needs it. In our billing app, invoices started looking up the customer's name, and the two services ended up needing each other through their constructors:

```java
public InvoiceService(CustomerService customers) {
    this.customers = customers;
}
```

[InvoiceService.java](https://github.com/mnafshin/springuniverse-code/blob/main/module-04-container/src/main/java/info/mnafshin/springuniverse/container/cycles/ctor/InvoiceService.java)

The customer service's constructor asks for the invoice service in the same way, so neither can go first. Spring Boot stops at startup and draws the cycle as a loop from customer service to invoice service and back. It says circular references are discouraged and prohibited by default, and names a flag as a last resort.

That is the good side of a cycle: it fails at startup with a clear report, not later in production.

## The flag starts the app with a half-built bean

Field injection gives the same report. The flag makes that version start:

```
--spring.main.allow-circular-references=true
```

[cycles examples](https://github.com/mnafshin/springuniverse-code/tree/main/module-04-container/src/main/java/info/mnafshin/springuniverse/container/cycles)

Spring creates the customer service and, before its field is set, hands an early reference to the invoice service. With constructor injection, the flag cannot help at all, because there is no object to hand out early.

That early reference is the danger. Give the invoice service a `@PostConstruct` method that asks the customer service a question:

```java
@PostConstruct
void warmUp() {
    System.out.println("InvoiceService @PostConstruct: asking the customer service");
    System.out.println("open invoices: " + customers.openInvoices("c-1"));
}
```

[InvoiceService.java](https://github.com/mnafshin/springuniverse-code/blob/main/module-04-container/src/main/java/info/mnafshin/springuniverse/container/cycles/halfbuilt/InvoiceService.java)

The customer service asks the invoice service in turn, and its `invoices` field is still null, so the result is a `NullPointerException`. `@PostConstruct` is normally the safe place for setup; inside a cycle, even it is not.

## Fix 1: extract the shared part

The invoice service only needs a customer's name. Looking up names is a separate job, so move it into its own bean, a `CustomerDirectory`:

```java
public InvoiceService(CustomerDirectory directory) {
    this.directory = directory;
}
```

[InvoiceService.java](https://github.com/mnafshin/springuniverse-code/blob/main/module-04-container/src/main/java/info/mnafshin/springuniverse/container/cycles/extract/InvoiceService.java)

The customer service depends on the directory and the invoice service, and the invoice service depends only on the directory. The arrows point one way, with no flag.

Try this first. A cycle often means one class is doing two jobs.

## Fix 2: publish an event

Sometimes the call back is the problem. After taking a payment, the invoice service wants to tell the customer service the customer has paid. Instead of calling it, it publishes an event:

```java
public void pay(String customerId) {
    System.out.println("invoice paid by " + customerId);
    events.publishEvent(new InvoicePaid(customerId));
}
```

[InvoiceService.java](https://github.com/mnafshin/springuniverse-code/blob/main/module-04-container/src/main/java/info/mnafshin/springuniverse/container/cycles/events/InvoiceService.java)

The invoice service depends only on Spring's `ApplicationEventPublisher`, and the customer service listens with an `@EventListener` method. The invoice service does not know who listens, so the arrow points one way.

## @Lazy is also a last resort

If you cannot change the design yet, `@Lazy` on one constructor parameter lets the app start:

```java
public InvoiceService(@Lazy CustomerService customers) {   // last resort
    this.customers = customers;
}
```

[InvoiceService.java](https://github.com/mnafshin/springuniverse-code/blob/main/module-04-container/src/main/java/info/mnafshin/springuniverse/container/cycles/lazy/InvoiceService.java)

The invoice service gets a `$$SpringCGLIB` proxy that looks up the real customer service on its first call. If that target is missing, you only find out through an exception when you call it. The cycle is still there, just hidden.

The [Spring Framework reference on dependency injection](https://docs.spring.io/spring-framework/reference/core/beans/dependencies/factory-collaborators.html) explains how the container resolves dependencies and circular references.

## Recap

- A circular dependency is two beans that need each other to be created. Spring Boot refuses it by default and reports the loop at startup.
- `allow-circular-references` cannot break a constructor cycle, and with field injection it can hand out a half-built bean. Even `@PostConstruct` is not safe inside a cycle.
- First choice: extract the shared part into its own bean.
- Second choice: publish an event instead of calling back.
- `@Lazy` and the flag only hide the cycle. Use them as a last resort.
