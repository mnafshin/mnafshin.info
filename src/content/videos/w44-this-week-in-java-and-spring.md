---
title: Java Trust Store Alert, Spring Boot 4.2 RC1, JDK 28 AOT Code | W44
description: If your Java app talks to anything over HTTPS, it may still trust certificates that someone else can forge. That's the first thing to check this week. The keys of eight certificates from one authority, eMudhra, were compromised, and many Java runtimes still trust them.
youtubeId: NCTEPi415CQ
pubDate: '2026-10-30T19:48:48Z'
series: weekly
seriesLabel: W44
order: 1000
shorts:
- title: Chrome blocks these certs. Your Java app may still trust them
  youtubeId: 1THR-4MRhxA
- title: JDK 28 caches compiled code for faster startup. One catch
  youtubeId: lnZAONnZQYU
- title: What is a value class? One word changes == in Java
  youtubeId: pmK7bEh0DKY
- title: This Java line throws in JDK 28 preview. Here's what to check
  youtubeId: aeI_Vto-HxM
---

## 00 Cold open
If your Java app talks to anything over HTTPS, it may still trust certificates that someone else can forge. That's the first thing to check this week. The keys of eight certificates from one authority, eMudhra, were compromised, and many Java runtimes still trust them. This is This Week in Java and Spring, for October twenty third to thirtieth. After the security fix, we'll cover the big Spring release candidate train, and a JDK twenty eight feature that cuts startup time by up to about eighty percent. Every item links to its source in the description.

## 01 Check your Java trust store
Here's what happened. A certificate authority signs the certificates that prove a website is who it says it is. One of them is eMudhra. The private keys of eight of its intermediate certificates were compromised. With those keys, someone can sign a certificate for any site. Chrome already blocks them. But a Java runtime has its own list of trusted roots, called cacerts. And by default, Java doesn't check if a certificate was revoked. So updating your browser doesn't fix your JDK. OpenJDK published an advisory with four options. First, update to a runtime whose release notes include the fix. Eclipse Temurin already shipped fixed builds for Java twenty seven, twenty five, twenty one and seventeen. As of October twenty sixth, Java eleven and eight were still waiting for upstream fixes. Second, run the Check Certs program from the advisory, to see if your runtime still trusts the bad roots. Third, remove those roots yourself with keytool. Fourth, turn on revocation checking. On Ubuntu and Debian, the Java trust store is rebuilt from the system list.
```
sudo rm -f /etc/ssl/certs/java/cacerts
sudo update-ca-certificates --fresh
```
Delete the old Java cacerts file, then rebuild it fresh. If you use Temurin, Check Certs may flag one more root, emSign Root CA G one. Adoptium says Mozilla still trusts that one, so Temurin keeps it. And the advisory says to check again, even if you updated in the last few days.

## 02 Spring Boot 4.2 release candidate
On October twenty third, Spring shipped almost its whole portfolio on one day. Most of it as release candidates. A release candidate is the last test version before the final release. So this is the time to try it on your app. Spring Boot four point two, release candidate one, has one hundred and thirteen changes. Three stand out. First, startup gets faster. Boot now finds classes and resources inside an executable jar more quickly. Second, the properties migrator can now fail your app on errors or warnings. So a renamed property can't hide in a log line anymore. Third, the default buildpacks builder moved to Ubuntu twenty six oh four. If you build container images with buildpacks, your base image changes. The older lines got fixes too. Spring Boot four point one point two has one hundred and twenty six fixes, docs and dependency upgrades, and four point oh point nine has ninety nine.

## 03 Spring Framework 7.1 release candidate
Spring Framework seven point one, release candidate one, came the same day. It removes the APIs that were deprecated for removal. So if your build shows deprecation warnings, now is the time to fix them. Next, a timeout of zero now means no timeout, across Mock MVC, the web test client and the HTTP clients. Then error responses. An exception that no exception handler catches is now rendered as problem details. Problem details is the standard JSON format for HTTP errors. And you can configure it through Web MVC Configurer. For tests, JSON Unit is now supported as an alternative to JSON assert. There's also support for the bean container of Hibernate eight. And seven point oh point ten fixes the current line.

## 04 Spring AI 2.1 release candidate
Spring AI two point one, release candidate one, changes what a chat message is. A message is no longer just text. It's an ordered list of parts: text, reasoning, tool calls, tool results and media. Why does that matter? Some models send their reasoning with a signature, and expect it back unchanged on the next turn. In his article this week, Dimitar Proynov gives three rules. Keep the order. Replay what you were given, unchanged. And store the parts, not just the text. The release also adds session memory. It replaces chat memory, which is deprecated and will be removed in Spring AI three. And tools can now ask for confirmation before they run.
```
@Tool(requiresConfirmation = true)
```
Set requires confirmation to true, and the tool call needs a decision before it runs. In a second article, Soby Chacko shows how to store your own embeddings. The new upsert method takes vectors you already computed, for example from photos. In this release candidate, it works with PG vector, Redis, Elasticsearch, Qdrant and OpenSearch.

## 05 The rest of the train
The rest of the train, quickly. Spring Cloud twenty twenty six point oh, code name Paddington, is at release candidate one. Spring Cloud Bus is merged into Spring Cloud Stream, and the artifact coordinates stay the same. The config client supports OAuth two. Gateway MVC supports websockets. And some modules are deprecated, like the reactive Kafka binder in Stream. Spring Security seven point two, Spring Data JPA four point two, Spring Session and Spring LDAP have release candidates too. So does Spring Modulith two point two. And Modulith one point four point fourteen is the last one point x release. If you're still on Modulith one, plan the upgrade.

## 06 JDK 28: AOT code compilation
Now Java. JEP five forty four, AOT code compilation, is targeted to JDK twenty eight. You may know the AOT cache from JDK twenty four and twenty five. You do a training run, and the JVM saves what it learned into a file. The next start reads that file and skips work. With this JEP, the file also stores the native code that the JIT compilers produced during training. So the app starts with compiled code, not just loaded classes. The commands stay the same.
```
java -XX:AOTCacheOutput=app.aot -jar app.jar
java -XX:AOTCache=app.aot -jar app.jar
```
First, a training run writes app dot AOT. Then every production run reads it. In OpenJDK's benchmarks, startup time dropped by about fifty to seventy percent without the stored code. With it, about sixty five to eighty percent. There's one condition. The production machine needs the same CPU features and the same garbage collector. If not, the JVM simply compiles as usual. JDK twenty eight is planned for March ninth, twenty twenty seven, and the first rampdown starts on December third.

## 07 JDK 28: value classes and faster off-heap memory
Next, a heads-up from the OpenJDK quality outreach team. JDK twenty eight has value objects as a preview feature. With preview on, about thirty JDK classes become value classes. That includes Integer, Long, Optional, LocalDate, Instant and Duration. A value class has no identity. So two equal LocalDate values can now be equal with double equals. And if your code synchronizes on an Integer, or puts these values in a weak hash map, it throws an identity exception. Nicolai Parlog asks you to test on the JDK twenty eight early access builds, with preview on and off. And one free speed-up. Per Minborg measured small off-heap allocations in a confined arena. In JDK twenty eight, they come from small reusable pools, and are typically six to eighteen times faster. You don't change any code. Allocations above sixty four bytes stay about the same.

## 08 Quick hits
Quick hits. Hibernate ORM eight point oh, beta four, is out. Quarkus four point oh, beta two, adds client attestation for OIDC, and JFR events for the REST client. Micronaut shipped several patch releases. And it was a quiet week for Kotlin, Maven and Gradle, with no new releases in this window.

## 09 Recap
So, three things for this week. One, check your Java trust store, and update your JDK. Two, try the Spring Boot four point two release candidate on a branch, and fix your deprecation warnings. Three, if startup time matters to you, keep an eye on JEP five forty four in JDK twenty eight. All the links are in the description. And if Spring proxies or circular dependencies ever confused you, the tutorials on this channel explain them step by step. See you next week.
