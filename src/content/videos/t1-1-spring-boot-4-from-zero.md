---
title: 'Spring Boot 4 from Zero: start.spring.io, Project Tour, Run, and Your First REST Controller'
description: This is a Spring Boot 4 app. One command starts it, and a web server is now listening on port 8080. We ask it for a greeting, and it answers in JSON.
youtubeId: 9CZ7CHIHmNM
pubDate: '2026-10-22T16:00:21Z'
series: tutorials
seriesLabel: T1.1
order: 20
codeUrl: https://github.com/mnafshin/springuniverse-code/tree/main/module-01-first-boot-app
shorts:
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
- title: 'Your first Spring Boot 4 app in 30 seconds #springboot #java'
  youtubeId: wmkFxvytXhw
- title: 'What @SpringBootApplication actually does #springboot #java'
  youtubeId: jmYG3djkfbY
- title: 'Spring Boot 4 needs which Java? (17... but use 25) #java #springboot'
  youtubeId: Ue_tJ-v9ClI
- title: 'Every file in a new Spring Boot project, explained #springboot #java'
  youtubeId: Ohms2FZaMKI
---

## 00 Cold open
This is a Spring Boot 4 app. One command starts it, and a web server is now listening on port 8080. We ask it for a greeting, and it answers in JSON. In this video, we build exactly this, from zero. We generate the project on `start.spring.io`, take a tour of every file, run it, and write our first REST controller. If terms like HTTP, JSON or Maven are new to you, the Foundations Shorts in the description explain each one in under a minute.

## 01 What you need
You need three things: a JDK, a code editor, and a terminal. You don't need to install Maven. The project brings its own Maven wrapper. Here are the versions in this video: Spring Boot 4.1.1, Java 25, and Maven. Which Java does Boot 4 need? At least Java 17, and it works up to Java 26. We use Java 25, because it's the current long-term support release, and the Spring team encourages the latest LTS. Check yours with java dash version.
```
$ java -version
openjdk version "25.0.4.1" 2026-08-18 LTS
```
If it says 17 or higher, you're good to go.

## 02 `start.spring.io`
Spring Initializr, at `start.spring.io`, generates a ready-to-run project for you. Let's fill in the form. Project: Maven. Language: Java. Spring Boot: 4.1.1, the latest stable version. Skip the snapshot and milestone versions, because they aren't final yet. Group: your reversed domain name. We use the domain of our blog. Artifact: hello. That becomes the project name, and it names the main class too. Packaging: Jar. Java: 25. Careful, the default here is 17, so change it. Now the most important part: dependencies. Click Add, and pick Spring Web. That's all we need for a REST API with an embedded Tomcat server. Click Generate, and you get a zip file. Unzip it, and open the folder in your editor.

## 03 A tour of the project
Here's what's inside, from top to bottom. First, the Maven wrapper: two small scripts, one for Mac and Linux, and one for Windows, plus a hidden folder with its settings. On first use, it downloads the right Maven version for you. Next, `pom.xml`, the build file. `HELP.md` has links to the docs and guides. Then source, main, java, with our package, and exactly one class: HelloApplication. Under source, main, resources, there's `application.properties`, for configuration, and two empty folders, static and templates, for web pages. We don't need them for a REST API. And under source, test, there's one test class, already written for us. Now let's open `pom.xml`. At the top is the parent: the Spring Boot starter parent, version 4.1.1. It brings sensible defaults, and it manages versions for us. Then the Java version, 25. Then two dependencies. The webmvc starter is what Spring Web means in Boot 4. Its old name, starter web, is deprecated. Next to it is its test partner, the webmvc test starter. Notice that there are no version numbers. The parent picks versions that work together, and we'll open that box in the next tutorial. Last, the Spring Boot Maven plugin runs our app and packages it.

## 04 The main class and `@SpringBootApplication`
Now the only Java class, HelloApplication. It has a main method, the normal Java entry point. It calls SpringApplication dot run, which starts Spring, and then the embedded web server. On top, there's one annotation: Spring Boot Application. It's really three annotations in one. Enable auto-configuration: Boot looks at your dependencies, sees Spring MVC and Tomcat, and sets up a web app for you. Component scan: Spring finds your classes, like controllers, in this package and below it. And Spring Boot configuration: this class can also hold configuration of its own. The component scan rule matters right away. Put your controllers in this package, or in a sub-package. A class in a sibling package isn't found, and its endpoints simply don't exist.

## 05 First run
Let's run it. In the project folder, start the app with the Maven wrapper and the spring-boot run goal.
```
$ ./mvnw spring-boot:run
:: Spring Boot ::  (v4.1.1)
Tomcat initialized with port 8080 (http)
Tomcat started on port 8080 (http) with context path '/'
Started HelloApplication in 0.809 seconds
```
There's the Spring Boot banner, and then the log. Tomcat started on port 8080, and the whole app started in under a second. No server to install, and no configuration to write. Now let's call it with curl.
```
$ curl localhost:8080/
{"timestamp":"...","status":404,"error":"Not Found","path":"/"}
```
Four oh four, not found. That's correct! The server works, but we haven't written a single endpoint yet. Stop the app with control C, and let's write one.

## 06 Your first REST controller
Create a new class, HelloController, in the same package as HelloApplication. First, the REST controller annotation. It tells Spring two things: this class handles web requests, and whatever a method returns becomes the response body. Then a method. GET mapping, slash hello, sends GET requests for slash hello to this method. The method takes a name from the query string. Request param, with a default value of World, makes the name optional. And it returns a Greeting. Greeting is a tiny Java record, with one field: message. We don't write any JSON code. Spring MVC hands the record to Jackson, which turns it into JSON for us. In Boot 4, that's Jackson 3. And notice what we didn't write: new HelloController. Component scan finds the class, creates it, and registers its endpoint.

## 07 Try it
Restart the app, and call it again.
```
$ curl localhost:8080/hello
{"message":"Hello, World!"}
```
Hello, World! Now let's pass a name, and add dash i to see the headers too.
```
$ curl -i 'localhost:8080/hello?name=Ada'
HTTP/1.1 200
Content-Type: application/json
Content-Length: 25

{"message":"Hello, Ada!"}
```
Status two hundred, the content type is application JSON, and the body has our greeting. Jackson did all of that. What about a POST?
```
$ curl -i -X POST localhost:8080/hello
HTTP/1.1 405
Allow: GET
```
We only mapped GET, so Spring answers four oh five, method not allowed, and even tells us which method is allowed. Open the same address in a browser, and you get the same JSON.

## 08 Package it as a jar
One more step. To ship the app, package it.
```
$ ./mvnw package
[INFO] Tests run: 1, Failures: 0, Errors: 0, Skipped: 0
[INFO] Building jar: target/hello-0.0.1-SNAPSHOT.jar
[INFO] BUILD SUCCESS
```
The build ran the test that came with the project. It checks that the application starts. Then it built one executable jar, about twenty megabytes, with Tomcat and every library inside. Any machine with Java 25 can run it with java dash jar.
```
$ java -jar target/hello-0.0.1-SNAPSHOT.jar
Tomcat started on port 8080 (http) with context path '/'
```
The companion repo has this exact app, plus tests for the controller. One test checks the web layer only, and another starts the real server on a random port. The link is in the description.

## 09 Recap
Let's recap. Generate the project on `start.spring.io`: Maven, Java 25, Boot 4.1.1, and Spring Web. The Spring Boot Application annotation turns on auto-configuration and component scan, so keep your classes in its package. Run it with the Maven wrapper, because Tomcat is built in. A REST controller with a GET mapping returns a record, and Jackson turns it into JSON. And package it as one jar, ready to run. That's your first Spring Boot 4 app.
