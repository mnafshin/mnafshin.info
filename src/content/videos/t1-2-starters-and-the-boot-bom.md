---
title: Spring Boot Starters, Dependency Management and the BOM, Explained (Spring Boot 4)
description: Here's the `pom.xml` from our first Spring Boot app. Two dependencies, and not a single version number. Yet when we ask Maven what's really on the classpath, we get thirty four jars, each with an exact version.
youtubeId: kJUbB6coI_k
pubDate: '2026-10-23T16:00:09Z'
series: tutorials
seriesLabel: T1.2
order: 30
codeUrls:
- https://github.com/mnafshin/springuniverse-code/tree/main/module-01-first-boot-app
- https://github.com/mnafshin/springuniverse-code/tree/main/module-01-bom-import
shorts:
- title: 'Why nobody downloads JARs by hand anymore #maven #java'
  youtubeId: x4xzc0J2maI
- title: 'Java vs the JVM: not the same thing #java #jvm'
  youtubeId: YI7ZIZyd3To
- title: 'Why you never write versions for Spring dependencies #springboot #java'
  youtubeId: n6nu3a0cazM
- title: 'A Spring Boot starter has no code. So what is it? #springboot #java'
  youtubeId: Ky8bxSvSlYw
- title: 'Override one Spring Boot dependency version, the right way #springboot'
  youtubeId: vVBtLp72_ko
- title: 'One property to switch on virtual threads in Spring Boot #springboot #java'
  youtubeId: NN4lNvM6idg
---

## 00 Cold open
Here's the `pom.xml` from our first Spring Boot app. Two dependencies, and not a single version number. Yet when we ask Maven what's really on the classpath, we get thirty four jars, each with an exact version. Tomcat, Jackson, Spring Framework, all pinned. So who picked them? In this video, we open that box. What a starter really is, where the versions come from, how to change one safely, and why upgrading Spring Boot is a one-line change. New to Maven, or missed the first tutorial? Both links are in the description.

## 01 What a starter is
Let's start with the starter. Spring Web, in Boot 4, is the webmvc starter. Open its jar, and you'll find almost nothing.
```
$ unzip -l spring-boot-starter-webmvc-4.1.1.jar
```
A manifest, a license, and a notice. Not one Java class. A starter isn't code. It's a dependency descriptor: a small pom that lists other dependencies. This one lists five. The core starter, a Jackson starter, a Tomcat starter, the HTTP message converters, and Spring Boot's web MVC support. So you add one starter, and you get a set of libraries that are known to work together. The docs call that a one-stop shop.

## 02 See the whole tree
To see everything a starter brings, ask Maven for the dependency tree.
```
$ ./mvnw dependency:tree -Dscope=compile
```
Starters pull in more starters, and those pull in the real libraries. Logging, with Logback. Jackson 3, for JSON. The embedded Tomcat server. And Spring Framework itself: context, web, and web MVC. Two lines in our pom became thirty four jars. And every one of them has a version that we never typed.

## 03 Names and test starters
A quick word on names. Official starters always begin with spring boot starter. Third-party starters put their own project name first, like acme spring boot starter. So you can tell at a glance who maintains it. In Boot 4, starters come with matching test starters. Webmvc has webmvc test, and that test starter brings JUnit 6, AssertJ and Mockito. And remember from the first tutorial: the old web starter is deprecated. Use webmvc.

## 04 Where versions come from: the BOM
So where do the versions come from? Follow the parents. Our pom's parent is the Spring Boot starter parent. And its parent is called spring boot dependencies. That's the Spring Boot BOM, short for bill of materials. Open it, and you'll find two big sections. First, properties: one hundred ninety five version properties, like tomcat dot version and jackson BOM dot version. Second, dependency management, with six hundred fifty two entries. Forty six of them import other BOMs, from Spring Framework, Jackson, JUnit and more. Here's the key idea. Dependency management is a list of rules, not a list of downloads. It says: if you use this library, use this version. By itself, it adds nothing to your app. When you declare a dependency without a version, Maven looks it up in that list. And it applies to transitive dependencies too, so the whole tree follows one plan.

## 05 What else the parent gives you
The starter parent adds a few build defaults on top. It sets the Java release from your java dot version property. It sets the source encoding. It compiles with the parameters flag, so Spring can read method parameter names, like the name in our request param. And it configures plugins, for example the repackage goal of the Spring Boot Maven plugin, which builds the executable jar.

## 06 No parent? Import the BOM
Sometimes you can't use that parent, because your company already gives you its own. Then you import the BOM instead.
```
<dependencyManagement>
  <dependencies>
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-dependencies</artifactId>
      <version>4.1.2</version>
      <type>pom</type>
      <scope>import</scope>
    </dependency>
  </dependencies>
</dependencyManagement>
```
In dependency management, add spring boot dependencies, with type pom and scope import. Maven copies in all of its managed versions, as if you had written them yourself. Your starters still have no versions. What you lose are the parent's extras. You configure the plugins yourself, and the parameters flag too. The companion repo has this as a complete, tested module.

## 07 Override one version
Now, what if you need a different version of one library? Say a Tomcat security fix is out, and Spring Boot hasn't shipped it yet. With the parent, you override the version property. Add tomcat dot version to your properties, and run the tree again.
```
<properties>
  <java.version>25</java.version>
  <tomcat.version>11.0.27</tomcat.version>
</properties>
```
All three Tomcat jars moved together, because they share one property. Every property name is listed in the Dependency Versions appendix of the Spring Boot docs. If you imported the BOM instead, properties don't work. Add that library to your dependency management, above the BOM import. And please don't write a version on a Spring dependency by hand. The docs strongly recommend against it, because it mixes versions that were never tested together. Any override is a small risk, so use it sparingly, and remove it when Boot catches up.

## 08 Upgrade with one number
And Boot catches up quickly. Spring Boot 4.1.2 came out on October twenty second. To upgrade, change the parent version, from 4.1.1 to 4.1.2.
```
<version>4.1.2</version>
```
That one number moved fifty five version properties. Spring Framework, Tomcat, Jackson, Micrometer, Netty, Hibernate, and many more. It includes the newer Tomcat, so our override can go. Then run the tests.
```
$ ./mvnw verify
```
All green. That's the real value of the BOM. A whole stack of versions, tested together, and you upgrade all of them by changing one number. Our companion repo is on 4.1.2 now, too.

## 09 Bonus: virtual threads with one property
One more thing needs no new dependency at all: virtual threads. They're part of Java 21 and later, and we're on Java 25. Add one line to `application.properties`: spring dot threads dot virtual dot enabled, equals true.
```
spring.threads.virtual.enabled=true
```
Now we ask a small new endpoint which thread handled the request.
```
$ curl localhost:8080/thread
```
A virtual thread. Switch the property off, and Tomcat goes back to its classic worker threads.
```
$ curl localhost:8080/thread
```
Two notes from the docs. With virtual threads on, thread pool properties no longer have any effect. And virtual threads are daemon threads, so if your app only runs scheduled jobs, also set spring dot main dot keep alive to true.

## 10 Recap
Let's recap. A starter is a small pom that brings a set of libraries that work together. The BOM, spring boot dependencies, picks every version, and the starter parent adds build defaults on top. No parent? Import the BOM. Need one different version? Override its property, and remove it when Boot catches up. To upgrade, change one number. And virtual threads are one property away. All the code, with tests, is in the companion repo. That completes Module 1. Next up, Module 2: dependency injection and the container.
