---
title: 'Spring Boot 4 from Zero: Your First App and REST Controller'
description: How to generate a Spring Boot 4 project, what each file is for, how @SpringBootApplication finds your classes, and how a small REST controller returns JSON.
pubDate: '2026-10-22T16:00:21Z'
section: spring
topic: first-boot-app
relatedVideos:
  - id: T1.1
    title: 'Spring Boot 4 from Zero: start.spring.io, Project Tour, Run, and Your First REST Controller'
    youtubeId: 9CZ7CHIHmNM
    pubDate: '2026-10-22T16:00:21Z'
relatedShorts:
  - title: 'Your first Spring Boot 4 app in 30 seconds #springboot #java'
    youtubeId: wmkFxvytXhw
  - title: 'What @SpringBootApplication actually does #springboot #java'
    youtubeId: jmYG3djkfbY
  - title: 'Spring Boot 4 needs which Java? (17... but use 25) #java #springboot'
    youtubeId: Ue_tJ-v9ClI
  - title: 'Every file in a new Spring Boot project, explained #springboot #java'
    youtubeId: Ohms2FZaMKI
  - title: 'Every HTTP request is just a letter #http #webdev'
    youtubeId: Db5GQC9aNOs
  - title: 'JSON: the language APIs speak. #json #java'
    youtubeId: Rrxrk9LqBvQ
  - title: 'Why nobody downloads JARs by hand anymore #maven #java'
    youtubeId: x4xzc0J2maI
  - title: 'Java vs the JVM: not the same thing #java #jvm'
    youtubeId: YI7ZIZyd3To
  - title: 'Dependency injection, without the jargon #java #spring'
    youtubeId: VZLmPVweEmQ
codeUrl: https://github.com/mnafshin/springuniverse-code/tree/main/module-01-first-boot-app
draft: false
---

Spring Boot lets you start a Spring web app with one command and very little code. It generates the project, brings an embedded web server, and sets up the usual parts for you, so your first class can be the one that answers requests. The example here is a small Spring Boot 4 app that listens on port 8080 and answers a greeting request with JSON.

## Generate the project

You need a JDK, an editor and a terminal, but not Maven: the project brings its own Maven wrapper. Spring Boot 4 needs at least Java 17; the examples here use Spring Boot 4.1.1 and Java 25, the current long-term support release.

[Spring Initializr](https://start.spring.io) builds a ready-to-run project. Choose Maven, Java and a final Boot version (not a snapshot or milestone), name the artifact `hello`, pick Jar packaging, set Java to 25 (the default is 17), and add one dependency: Spring Web. That is enough for a REST API with an embedded Tomcat server.

## What is inside the project

The project has the Maven wrapper, a `pom.xml`, one main class called `HelloApplication`, an `application.properties` file and one ready-made test.

The `pom.xml` names `spring-boot-starter-parent` as its parent, which brings defaults and picks versions. Its two dependencies are the webmvc starter and its test partner. "Spring Web" means `spring-boot-starter-webmvc` in Boot 4; the old `spring-boot-starter-web` name is deprecated. Neither dependency has a version number, which the article on starters and the BOM explains.

## The main class and component scanning

The main class is short. Look at its one annotation and its one call:

```java
@SpringBootApplication
public class HelloApplication {

    public static void main(String[] args) {
        SpringApplication.run(HelloApplication.class, args);
    }
}
```

[HelloApplication.java](https://github.com/mnafshin/springuniverse-code/blob/main/module-01-first-boot-app/src/main/java/info/mnafshin/springuniverse/hello/HelloApplication.java)

`SpringApplication.run` starts Spring and then the web server. `@SpringBootApplication` is three annotations in one:

- auto-configuration: Boot sees Spring MVC and Tomcat on the classpath and sets up a web app;
- component scanning: Spring finds your classes in this package and below;
- configuration: the class can hold configuration of its own.

The scanning rule matters at once. A controller in a sibling package is never found, and its endpoints simply do not exist.

## A running app with no endpoint

`./mvnw spring-boot:run` starts the app, and the log shows Tomcat on port 8080. A request to `/` returns 404.

That 404 is correct. The server works, but nothing handles that path yet.

## A REST controller returns JSON

We add a controller in the same package as the main class. Look at the two annotations and the return type:

```java
@RestController
public class HelloController {

    @GetMapping("/hello")
    public Greeting hello(
            @RequestParam(defaultValue = "World") String name) {
        return new Greeting("Hello, " + name + "!");
    }
}
```

[HelloController.java](https://github.com/mnafshin/springuniverse-code/blob/main/module-01-first-boot-app/src/main/java/info/mnafshin/springuniverse/hello/HelloController.java)

`@RestController` says the class handles web requests and its return values become the response body. `@GetMapping("/hello")` routes `GET /hello` here, and `@RequestParam` with a default makes the name optional.

`Greeting` is a record with one field, `message`. There is no JSON code: Spring MVC hands the record to Jackson 3. Nobody writes `new HelloController()` either; component scanning finds it.

After a restart, `/hello?name=Ada` returns 200, `application/json` and `{"message":"Hello, Ada!"}`. A `POST` gets 405 with `Allow: GET`, because only `GET` was mapped.

## Ship one jar

`./mvnw package` runs the generated test, which checks that the application starts. It then builds one executable jar of about 20 MB, with Tomcat and every library inside. Any machine with Java 25 runs it with `java -jar`.

The [Spring Boot reference](https://docs.spring.io/spring-boot/reference/using/using-the-springbootapplication-annotation.html) covers `@SpringBootApplication` and its options in full.

## Recap

- Generate the project at start.spring.io with Maven, Java, a final Boot version and Spring Web.
- `@SpringBootApplication` turns on auto-configuration, component scanning and configuration.
- Keep your classes in the main class's package or below, or component scanning will not find them.
- A `@RestController` method can return a record; Spring MVC and Jackson turn it into JSON.
- `./mvnw package` builds one executable jar that runs with `java -jar`.
