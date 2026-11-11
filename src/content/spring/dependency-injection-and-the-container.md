---
title: 'Dependency Injection and the Spring Container'
description: Why a class should ask for its helpers instead of building them, and what the Spring container does with that request — @Component and @Bean, component scanning, @Configuration and the ApplicationContext.
pubDate: '2026-10-24T16:00:35Z'
section: spring
topic: dependency-injection
relatedVideos:
  - id: T2.1
    title: Dependency Injection and IoC in Spring, from First Principles (Spring Boot 4)
    youtubeId: Z8zt0ZZ6IGY
    pubDate: '2026-10-24T16:00:35Z'
  - id: T2.2
    title: '@Configuration, @Bean and the ApplicationContext in Spring, Explained (Spring Boot 4)'
    youtubeId: 3oLs8NcriKo
    pubDate: '2026-10-25T09:00:26Z'
relatedShorts:
  - title: 'Dependency injection, without the jargon #java #spring'
    youtubeId: VZLmPVweEmQ
  - title: 'Library or framework? One question tells you which. #java #spring'
    youtubeId: KBRjeP91zBw
  - title: 'Constructor injection wins. Here''s why #springboot'
    youtubeId: Pi8ch0rIIBM
  - title: '"Required a bean that could not be found", decoded #springboot'
    youtubeId: lBYxCuMwQRM
  - title: 'Test it without Spring: the real payoff of dependency injection #springboot'
    youtubeId: uitq5zQF4-8
  - title: '@Component or @Bean? Here''s the rule #springboot'
    youtubeId: ww3SUs3vVzc
  - title: 'You don''t need Spring Boot to use Spring #springboot'
    youtubeId: P6cM0QtMspM
codeUrls:
  - https://github.com/mnafshin/springuniverse-code/tree/main/module-02-di
  - https://github.com/mnafshin/springuniverse-code/tree/main/module-02-configuration
draft: false
---

Dependency injection means a class does not build the objects it depends on. It asks for them, and someone else provides them. In Spring, that someone is the container, which creates your objects at startup and connects them, so your classes stay small, easy to test and easy to change.

## A class that builds its own helpers

Our `SignupService` registers a user: it saves them in a repository and sends a welcome message through an email notifier. In its first version, it builds both helpers itself:

```java
private final UserRepository users = new InMemoryUserRepository();
private final EmailNotifier notifier = new EmailNotifier();
```

[HardWiredSignupService.java](https://github.com/mnafshin/springuniverse-code/blob/main/module-02-di/src/main/java/info/mnafshin/springuniverse/di/plain/HardWiredSignupService.java)

It works, but every test of `register` sends a real email, and switching to text messages means editing the signup service. You also only learn what the class needs by reading its body. All three problems have one cause: the class builds its own collaborators.

## Ask instead of build

Delete the `new` calls and ask for the helpers in the constructor:

```java
public SignupService(UserRepository users, Notifier notifier) {
    this.users = users;
    this.notifier = notifier;
}
```

[SignupService.java](https://github.com/mnafshin/springuniverse-code/blob/main/module-02-di/src/main/java/info/mnafshin/springuniverse/di/spring/SignupService.java)

Both parameter types are interfaces, so the service no longer knows about email, only that something can send a message. A test can now pass a fake notifier that records messages in a list: plain JUnit, no mail server, no framework.

## Inversion of control

Someone still calls `new`; we only moved it, usually to `main`. Control over creating the helpers has moved out of the class. That is inversion of control, and dependency injection is a specialized form of it.

Wiring three objects by hand is easy. Wiring two hundred in the right order is bookkeeping, and that is the job a container takes over.

## Spring does the wiring

Put `@Service` on the signup service and `@Component` on the notifier and the repository. Nothing else changes: same constructor, no `@Autowired`.

At startup, component scanning finds these classes in the application's package and below and makes each one a bean, an object the container manages. To build the signup service, Spring reads its only constructor, finds one bean of each parameter type, creates those first, and makes the same call we wrote in `main`.

Because this happens at startup, mistakes fail early. Remove `@Component` from the notifier and the app refuses to start: parameter 1 of the constructor required a bean of type `Notifier` that could not be found. Add a second notifier and it also refuses: there are two candidates, and Spring suggests `@Primary` or `@Qualifier` instead of guessing.

## The container without Spring Boot

Boot hides the container, but you can build it yourself in plain Java:

```java
try (var context = new AnnotationConfigApplicationContext(AppConfig.class)) {
    SignupService signup = context.getBean(SignupService.class);
    signup.register("Ada");
    // ...
}
```

[ContainerApp.java](https://github.com/mnafshin/springuniverse-code/blob/main/module-02-configuration/src/main/java/info/mnafshin/springuniverse/config/app/ContainerApp.java)

That context is the container, the same kind of object Spring Boot creates at startup. It reads `AppConfig`, creates the beans, and hands us a finished signup service.

`AppConfig` is a `@Configuration` class with `@ComponentScan`, which scans from its own package downwards. A `@Component` class in a sibling package is never found, and asking for it throws `NoSuchBeanDefinitionException`. When a bean is missing, check the package first.

## @Component or @Bean

`AppConfig` also creates a bean for a class we cannot annotate. Look at the method:

```java
@Bean
public Clock clock() {
    return Clock.systemUTC();
}
```

[AppConfig.java](https://github.com/mnafshin/springuniverse-code/blob/main/module-02-configuration/src/main/java/info/mnafshin/springuniverse/config/app/AppConfig.java)

`Clock` lives in `java.time`, so Spring calls this method and keeps the result as a bean named `clock`.

The rule: your own class with a plain constructor gets `@Component`; a library class, or one that needs real setup, gets a `@Bean` method. Both become the same kind of bean, a singleton by default, and you can mix them. `@Import` pulls in more configuration classes, and beans connect across them by type.

## Why @Configuration matters

In `PersistenceConfig`, the repository's bean method calls the audit-log bean method directly, yet only one audit log exists. Spring subclasses every `@Configuration` class with CGLIB, and that subclass returns the existing bean instead of running your method again.

Turn that off with `proxyBeanMethods = false` and the same call becomes plain Java. The audit log is created twice, and the repository holds one the container does not manage. The fix that works in every mode is to take the audit log as a parameter:

```java
@Bean
public UserRepository userRepository(AuditLog auditLog) {
    return new InMemoryUserRepository(auditLog);
}
```

[LiteFixedConfig.java](https://github.com/mnafshin/springuniverse-code/blob/main/module-02-configuration/src/main/java/info/mnafshin/springuniverse/config/lite/LiteFixedConfig.java)

Spring passes the one managed audit log in, with or without the CGLIB subclass.

Back in Boot, `@SpringBootApplication` is `@SpringBootConfiguration` (itself a `@Configuration`), `@EnableAutoConfiguration` and `@ComponentScan`. Auto-configuration adds Boot's own beans to the container you now know. The [Spring Framework reference](https://docs.spring.io/spring-framework/reference/core/beans/java/basic-concepts.html) covers `@Bean` and `@Configuration` in full.

## Recap

- A class asks for what it needs in its constructor; it does not build those objects itself.
- The container creates the beans and passes them in. A single constructor needs no `@Autowired`.
- A missing or duplicate bean fails at startup, with a message naming the type.
- Use `@Component` for your own classes and a `@Bean` method for library types or anything that needs setup.
- In `@Bean` methods, take collaborators as parameters; it works with or without `proxyBeanMethods`.
