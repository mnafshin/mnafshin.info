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

Auto-configuration means Spring Boot creates the usual beans for you, based on what is on the classpath. It is why a web app gets a running server without any server code. Once you know how Boot decides, you can change what it built, give your own library the same setup, turn one auto-configuration off, and test it.

## How Boot decides

`@SpringBootApplication` switches auto-configuration on. A jar that offers auto-configurations carries an imports file, a list of those classes with one class name per line, and Boot reads every such list at startup.

Our small shop app has one class and one annotation, yet Tomcat starts on port 8080. Start it with `--debug` and Boot prints the conditions evaluation report: every auto-configuration it checked, with positive matches (applied), negative matches (skipped) and why.

The server came from `TomcatServletWebServerAutoConfiguration`. Two conditions on it decide almost everything:

- `@ConditionalOnClass` on the class: the listed classes, Tomcat among them, must be on the classpath. The web starter brought them, so it matched. Gson is not on our classpath, so its setup was skipped.
- `@ConditionalOnMissingBean` on the bean method: Boot creates its Tomcat factory only if the app has none.

## Your bean wins where Boot backs off

Add a factory of our own and watch Boot step aside:

```java
@Bean
TomcatServletWebServerFactory shopServer() {
    return new TomcatServletWebServerFactory(7070);
}
```

[ShopApp.java](https://github.com/mnafshin/springuniverse-code/blob/main/module-05-web-shop/src/main/java/info/mnafshin/springuniverse/shop/ShopApp.java)

Boot's factory moves to negative matches, and Tomcat starts on 7070. Auto-configuration is applied after your own beans are registered, so Boot sees yours in time. But your bean wins only where Boot's bean carries `@ConditionalOnMissingBean`, and the report shows you where.

And 8080? Boot's factory is created with no port. `ServerProperties`, a `@ConfigurationProperties` class with the prefix `server`, copies `server.port` into the factory only when you set it; otherwise the factory keeps its own default, 8080.

## Change what Boot built, keep the rest

Replacing the factory switched off Boot's whole server setup. To change one thing, reach for a property first: `server.servlet.context-path=/shop` puts every address under `/shop`, and Boot still builds the server. The [Common Application Properties](https://docs.spring.io/spring-boot/appendix/application-properties/index.html) list names these settings.

When no property fits, such as a second port, 8081, for an internal stock tool, add a customizer: a bean that changes something Boot builds without replacing it.

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

Boot hands the customizer its own Tomcat factory. Boot's property support is a customizer too and runs before yours, so the context path and the extra port both survive.

## Make your own library set itself up

Our price library creates a dollar `PriceFormatter` in a plain configuration class. The shop adds the library, yet startup fails: no `PriceFormatter` bean. Component scanning only searches the shop's own package, and a library cannot know where each app keeps its classes.

So the library does what Boot's jars do. It depends on Spring Boot's autoconfigure library, marks its class `@AutoConfiguration`, and lists it in `META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports`. Now the shop shows coffee in dollars.

When the shop declares its own `euroPrices` formatter, startup fails again with two candidates. A good library steps aside by itself:

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

The shop starts without a database. `@SpringBootApplication(exclude = DataSourceAutoConfiguration.class)` does the same in code, and either way the Exclusions section of the `--debug` report lists the class. Copy the exact name from the jar's own list: many older examples use an older package name, and with that name nothing is turned off.

## Test both cases

The shop's test starts the whole shop, so it only tests the case the shop happens to be in. `ApplicationContextRunner` starts a tiny Spring container inside a test, with only the library's `PriceConfiguration`. Look at how the second case adds a bean:

```java
this.runner.withBean("euroPrices", PriceFormatter.class, () -> new PriceFormatter("EUR"))
    .run((context) -> assertThat(context.getBeansOfType(PriceFormatter.class)).containsOnlyKeys("euroPrices"));
```

[PriceConfigurationTest.java](https://github.com/mnafshin/springuniverse-code/blob/main/module-05-prices/src/test/java/info/mnafshin/springuniverse/prices/PriceConfigurationTest.java)

The app's formatter is the only one, so the library stepped aside. A first test adds nothing and checks for dollars. If someone deletes `@ConditionalOnMissingBean`, the second test fails long before a real app meets two formatters. See [Creating Your Own Auto-configuration](https://docs.spring.io/spring-boot/reference/features/developing-auto-configuration.html) for more.

## Recap

- Auto-configuration builds the usual beans from the classpath; `--debug` prints why each one applied or was skipped.
- Prefer a property, then a customizer. Your own bean wins only where Boot's bean has `@ConditionalOnMissingBean`.
- A library should auto-configure itself through the imports file and step aside with `@ConditionalOnMissingBean`.
- Turn one auto-configuration off with `spring.autoconfigure.exclude` or `exclude`, using the exact class name.
- Test both cases with `ApplicationContextRunner`.
