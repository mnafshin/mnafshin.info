---
title: 'Spring Boot Starters and the BOM: Who Picks Your Versions'
description: Why a Spring Boot pom.xml needs no version numbers. A starter is a list of dependencies, the BOM is a list of version rules, and together they let you upgrade a whole stack by changing one number.
pubDate: '2026-10-23T16:00:09Z'
section: spring
topic: starters-bom
relatedVideos:
  - id: T1.2
    title: Spring Boot Starters, Dependency Management and the BOM, Explained (Spring Boot 4)
    youtubeId: kJUbB6coI_k
    pubDate: '2026-10-23T16:00:09Z'
relatedShorts:
  - title: 'Why you never write versions for Spring dependencies #springboot #java'
    youtubeId: n6nu3a0cazM
  - title: 'A Spring Boot starter has no code. So what is it? #springboot #java'
    youtubeId: Ky8bxSvSlYw
  - title: 'Override one Spring Boot dependency version, the right way #springboot'
    youtubeId: vVBtLp72_ko
  - title: 'One property to switch on virtual threads in Spring Boot #springboot #java'
    youtubeId: NN4lNvM6idg
  - title: 'Why nobody downloads JARs by hand anymore #maven #java'
    youtubeId: x4xzc0J2maI
  - title: 'Java vs the JVM: not the same thing #java #jvm'
    youtubeId: YI7ZIZyd3To
codeUrls:
  - https://github.com/mnafshin/springuniverse-code/tree/main/module-01-first-boot-app
  - https://github.com/mnafshin/springuniverse-code/tree/main/module-01-bom-import
draft: false
---

In Spring Boot, you rarely write library versions yourself. A starter decides which libraries arrive, and the BOM, or bill of materials, decides which versions they have. Together they give you a stack that was tested together, and let you upgrade all of it by changing one number.

## Two dependencies, 34 jars

The first Boot app's `pom.xml` has two dependencies and no version numbers. Yet it puts 34 jars on the classpath, among them Tomcat, Jackson and Spring Framework, each with an exact version.

Here is the main dependency. Notice what is missing:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-webmvc</artifactId>
</dependency>
```

[pom.xml](https://github.com/mnafshin/springuniverse-code/blob/main/module-01-first-boot-app/pom.xml)

There is no `<version>`. The starter brings the libraries, and the BOM fills in the versions.

## A starter is a list, not code

Spring Web in Boot 4 is `spring-boot-starter-webmvc`. Open its jar and you find a manifest, a license and a notice, but not a single Java class. A starter is a dependency descriptor: a small pom that lists other dependencies.

This one lists five, including a Jackson starter and a Tomcat starter, and those pull in the real libraries: Logback, Jackson 3, embedded Tomcat and Spring Framework. `./mvnw dependency:tree` shows the whole tree.

The name tells you who maintains a starter. Official ones begin with `spring-boot-starter`; third-party ones put their own name first, such as `acme-spring-boot-starter`. In Boot 4, starters also have matching test starters: `webmvc` has `webmvc-test`, which brings JUnit 6, AssertJ and Mockito.

## The BOM decides the versions

Follow the parents. Our parent is `spring-boot-starter-parent`, and its parent is `spring-boot-dependencies`: the Spring Boot BOM. It holds 195 version properties, such as `tomcat.version`, and a dependency-management section with 652 entries, some of which import other projects' BOMs.

Dependency management is a list of rules, not downloads. It says "if you use this library, use this version", and adds nothing by itself. When you declare a dependency without a version, Maven looks it up there. The same rules apply to transitive dependencies, so the whole tree follows one plan.

The starter parent adds build defaults on top: the Java release, the source encoding, compiling with `-parameters` so Spring can read parameter names, and the repackage goal that builds the executable jar.

## Importing the BOM instead of the parent

If your company already gives you a parent pom, import the BOM instead. Look at the type and the scope:

```xml
<dependencyManagement>
    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-dependencies</artifactId>
            <version>${spring-boot.version}</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
    </dependencies>
</dependencyManagement>
```

[pom.xml](https://github.com/mnafshin/springuniverse-code/blob/main/module-01-bom-import/pom.xml)

Starters still need no versions. You only lose the parent's build defaults and configure them yourself.

## Overriding one version

Say a Tomcat security fix is out before Boot ships it. The tempting move is to write a version on the Tomcat dependency by hand. That mixes versions that were never tested together, so do not hand-write versions on Spring-managed dependencies.

With the parent, override the one property instead:

```xml
<tomcat.version>11.0.27</tomcat.version>
```

All three Tomcat jars move together, because they share that property. The property names are listed in the [Version Properties](https://docs.spring.io/spring-boot/appendix/dependency-versions/properties.html) appendix. With an imported BOM, properties do not work, so you add the library to your own dependency management above the import. Treat any override as temporary.

## Upgrading is one number

Spring Boot 4.1.2 came out on October 22. Changing the parent from 4.1.1 to 4.1.2 moved 55 version properties at once, including Spring Framework, Tomcat, Jackson and Hibernate. The new Tomcat made the override unnecessary, so it could go, and the tests still pass.

Some features need no new dependency at all. On Java 21 or later, one line moves request handling onto virtual threads:

```properties
spring.threads.virtual.enabled=true
```

[application.properties](https://github.com/mnafshin/springuniverse-code/blob/main/module-01-first-boot-app/src/main/resources/application.properties)

Thread-pool properties then stop having any effect. An app that only runs scheduled jobs should also set `spring.main.keep-alive=true`, because virtual threads are daemon threads.

## Recap

- A starter is a list of dependencies, not code; it decides which libraries arrive.
- The BOM decides the versions. Dependency management is a set of rules, not downloads.
- With your own parent pom, import `spring-boot-dependencies` with `<type>pom</type>` and `<scope>import</scope>`.
- Override one version through its property, and only for a while. Never hand-write versions on managed dependencies.
- Upgrading Spring Boot by one number moves the whole tested stack at once.
