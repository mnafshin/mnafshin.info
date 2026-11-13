---
title: 'Spring Boot Auto-Configuration: How It Decides, and How to Change, Write, Disable and Test It'
description: How Spring Boot builds beans such as the web server from what is on the classpath, why your own bean wins, and how to change one setting, write an auto-configuration for your own library, turn one off and test it with ApplicationContextRunner.
pubDate: '2026-11-02T12:00:16Z'
section: spring
topic: auto-configuration
relatedVideos:
  - id: T5.1
    title: Who Set Port 8080? How Spring Boot Auto-Configuration Decides
    youtubeId: RekWGe1V2_U
    pubDate: '2026-11-02T12:00:16Z'
  - id: T5.2
    title: Change the Web Server Spring Boot Built (and Keep the Rest)
    youtubeId: Q-lEBoKJIs4
    pubDate: '2026-11-03T12:00:19Z'
  - id: T5.3
    title: Make Your Own Library Set Itself Up (Spring Boot 4)
    youtubeId: x3zh9foVSco
    pubDate: '2026-11-04T12:00:02Z'
  - id: T5.4
    title: Turn Off One Spring Boot Auto-Configuration (Spring Boot 4)
    youtubeId: dqlQulmudTY
    pubDate: '2026-11-05T12:00:19Z'
  - id: T5.5
    title: Test Your Spring Boot Auto-Configuration (ApplicationContextRunner)
    youtubeId: q_N1TERi5Fc
    pubDate: '2026-11-09T12:00:06Z'
relatedShorts: []
codeUrls:
  - https://github.com/mnafshin/springuniverse-code/tree/main/module-05-web-shop
  - https://github.com/mnafshin/springuniverse-code/tree/main/module-05-shop-settings
  - https://github.com/mnafshin/springuniverse-code/tree/main/module-05-prices
  - https://github.com/mnafshin/springuniverse-code/tree/main/module-05-price-shop
  - https://github.com/mnafshin/springuniverse-code/tree/main/module-05-shop-exclude
draft: false
---

Auto-configuration means Spring Boot creates the usual beans for you, based on what is on the classpath: the jars your app is built with. It is why a web app gets a running server without any server code. Once you know how Boot decides, you can change what it built, give your own library the same setup, turn one auto-configuration off, and test it.

## How Boot decides

`@SpringBootApplication` switches auto-configuration on. Each Boot jar carries a short list of auto-configuration classes. These are ordinary configuration classes with conditions on them. At startup, Boot reads every list and keeps only the classes whose conditions are true.

Our small shop app has one class and one annotation, yet Tomcat starts on port 8080. To see why, start it with `--debug`. Boot prints the conditions evaluation report: every auto-configuration it checked, sorted into positive matches (applied) and negative matches (skipped), each with a reason.

The server came from `TomcatServletWebServerAutoConfiguration`. Two conditions on it decide almost everything:

- `@ConditionalOnClass`: build this only if certain classes are on the classpath. The web starter brought Tomcat, so it matched. Gson is not on our classpath, so Boot skipped its Gson setup.
- `@ConditionalOnMissingBean`: build this bean only if the app has none of its own. Boot creates its Tomcat factory only when you have not defined one.

## Your bean wins where Boot backs off

Add a factory of our own and watch Boot step aside:

```java
@Bean
TomcatServletWebServerFactory shopServer() {
    return new TomcatServletWebServerFactory(7070);
}
```

[ShopApp.java](https://github.com/mnafshin/springuniverse-code/blob/main/module-05-web-shop/src/main/java/info/mnafshin/springuniverse/shop/ShopApp.java)

Tomcat now starts on 7070, and the report moves Boot's factory to negative matches. Boot applies auto-configuration after it has registered your own beans, so it sees yours in time.

This only works where Boot's bean carries `@ConditionalOnMissingBean`. The report shows you where that is.

## Change what Boot built, keep the rest

Replacing the factory also replaced everything Boot set up on its server. To change one thing, try a property first: `server.servlet.context-path=/shop` puts every address under `/shop`, and Boot still builds the server. The [Common Application Properties](https://docs.spring.io/spring-boot/appendix/application-properties/index.html) list names these settings.

When no property fits, add a customizer: a bean that changes something Boot builds without replacing it. Here the shop opens a second port, 8081, for an internal stock tool:

```java
@Bean
WebServerFactoryCustomizer<TomcatServletWebServerFactory> secondPort() {
    return factory -> {
        Connector connector = new Connector();
        connector.setPort(8081);
        factory.addAdditionalConnectors(connector);
    };
}
```

[ShopApp.java](https://github.com/mnafshin/springuniverse-code/blob/main/module-05-shop-settings/src/main/java/info/mnafshin/springuniverse/shop/ShopApp.java)

Boot passes its own Tomcat factory to the customizer. Boot applies your properties through a customizer too, and that one runs first, so the context path and the extra port both survive.

## Make your own library set itself up

Our price library creates a dollar `PriceFormatter` in a plain configuration class. The shop adds the library, yet startup fails: there is no `PriceFormatter` bean. Component scanning only searches the shop's own packages, and a library cannot know where each app keeps its classes.

So the library does what Boot's jars do. It depends on `spring-boot-autoconfigure`, marks its class `@AutoConfiguration`, and names that class in its own list, the file `META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports`. Now the shop shows coffee in dollars.

When the shop declares its own `euroPrices` formatter, startup fails again, this time with two candidates. A good library steps aside on its own:

```java
@Bean
@ConditionalOnMissingBean
PriceFormatter priceFormatter() {
    return new PriceFormatter("USD");
}
```

[PriceConfiguration.java](https://github.com/mnafshin/springuniverse-code/blob/main/module-05-prices/src/main/java/info/mnafshin/springuniverse/prices/PriceConfiguration.java)

The shop now shows euros, and a shop without its own formatter still gets dollars.

## Turn one auto-configuration off

Adding the JDBC starter before the database is ready stops the shop with "Failed to configure a DataSource". `DataSourceAutoConfiguration` saw the jar and tried to build a data source with no URL. Keep the starter and exclude just that class:

```properties
spring.autoconfigure.exclude=org.springframework.boot.jdbc.autoconfigure.DataSourceAutoConfiguration
```

[application.properties](https://github.com/mnafshin/springuniverse-code/blob/main/module-05-shop-exclude/src/main/resources/application.properties)

The shop starts without a database. `@SpringBootApplication(exclude = DataSourceAutoConfiguration.class)` does the same in code, and either way the Exclusions section of the `--debug` report lists the class.

Copy the exact class name from the jar's own list. Many older examples use an older package name, and with that name nothing is turned off.

## Test both cases

The shop's own test starts the whole shop, so it only checks the one case the shop happens to be in. `ApplicationContextRunner` starts a tiny Spring container inside a test, with only the library's `PriceConfiguration`, so each test can set up exactly the case it needs.

The first test adds nothing and checks for dollars. The second adds the app's own formatter:

```java
this.runner.withBean("euroPrices", PriceFormatter.class, () -> new PriceFormatter("EUR"))
    .run((context) -> assertThat(context.getBeansOfType(PriceFormatter.class)).containsOnlyKeys("euroPrices"));
```

[PriceConfigurationTest.java](https://github.com/mnafshin/springuniverse-code/blob/main/module-05-prices/src/test/java/info/mnafshin/springuniverse/prices/PriceConfigurationTest.java)

Only `euroPrices` exists, so the library stepped aside. If someone deletes `@ConditionalOnMissingBean`, this test fails long before a real app meets two formatters. See [Creating Your Own Auto-configuration](https://docs.spring.io/spring-boot/reference/features/developing-auto-configuration.html) for more.

## Recap

- Auto-configuration builds the usual beans from what is on the classpath; `--debug` prints why each one applied or was skipped.
- Prefer a property, then a customizer. Your own bean wins only where Boot's bean has `@ConditionalOnMissingBean`.
- A library should auto-configure itself through the imports file and step aside with `@ConditionalOnMissingBean`.
- Turn one auto-configuration off with `spring.autoconfigure.exclude` or `exclude`, using the exact class name.
- Test both cases with `ApplicationContextRunner`.

## Sources

Official documentation and well-known tutorials read while writing this article. The wording here is our own.

- [Spring Boot reference: Auto-configuration](https://docs.spring.io/spring-boot/reference/using/auto-configuration.html)
- [Spring Boot reference: Creating Your Own Auto-configuration](https://docs.spring.io/spring-boot/reference/features/developing-auto-configuration.html)
- [Spring Boot reference: Common Application Properties](https://docs.spring.io/spring-boot/appendix/application-properties/index.html)
- [Marco Behler: How Spring Boot’s Autoconfigurations Work](https://www.marcobehler.com/guides/spring-boot-autoconfiguration)
- [Baeldung: Create a Custom Auto-Configuration with Spring Boot](https://www.baeldung.com/spring-boot-custom-auto-configuration)
- [Baeldung: Guide to ApplicationContextRunner in Spring Boot](https://www.baeldung.com/spring-boot-context-runner)
