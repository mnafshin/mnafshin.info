---
title: Spring Boot 4.2 RC2, HTTP QUERY, RestTemplate Deprecated | W45
description: This week we cover the second Spring release candidate wave, the Framework seven point one headlines, Project Detroit, and the JDK twenty seven garbage collector changes.
youtubeId: mXlChNpxj_M
pubDate: '2026-11-09T07:27:21Z'
series: weekly
seriesLabel: W45
order: 1010
shorts:
- title: 'HTTP QUERY: A Search With a Body | Spring Framework 7.1'
  youtubeId: Mkb1vQw31xA
- title: RestTemplate Is Deprecated in Spring Framework 7.1
  youtubeId: 88C6K7pVVJc
- title: 'Spring AI DecisionModel: Ask, Don''t Parse the Paragraph'
  youtubeId: JyUQin-qXOo
---

## Week goal stated

This week we cover the second Spring release candidate wave, the Framework seven point one headlines, Project Detroit, and the JDK twenty seven garbage collector changes.

## Date window named

The window is October thirtieth to November fifth.

## Thursday RC2 wave

On Thursday, Spring Boot, Framework, Cloud and Spring AI all moved to release candidate two.

## Embed and G1 preview

We'll also look at embedding V8 and CPython from Java, and at jee one becoming the default garbage collector everywhere.

## Boot release date

Spring Boot 4.2, release candidate two, shipped on November fifth.

## Forwarded prefix support

First, Reactor Netty now supports the X-Forwarded-Prefix header. If a reverse proxy strips a path prefix, the reactive app can see that prefix.

## LDAP reload removed

Second, LDAP SSL reload support is removed.

## Framework Micrometer versions

The release also pulls in Framework seven point one, release candidate two, and Micrometer one point eighteen, release candidate two.

## Redis database change

One upgrade note matters for Redis. The spring data redis database setting, or the database segment of the Redis URL, is now applied to master and replica connections. Before, it was silently ignored and the factory always used database zero.

## Move from RC1

If you tried release candidate one, move to two before the final release.

## Framework same day

Spring Framework 7.1, release candidate two, landed the same day.

## Wiki versus tag

The bigger story is in the seven point one release notes wiki.

## HTTP QUERY method

HTTP QUERY. QUERY is the new idempotent HTTP method with a body, defined in RFC one zero zero zero eight.

## Map and curl

In seven point one you map it like any other method. And you can call it with curl.

## RestTemplate deprecated

RestTemplate and related types are formally deprecated for removal in Framework eight.

## RestClient migration path

The migration path is RestClient, or the HTTP Interface Client.

## Start the move

If your code still builds on RestTemplate, start the move on a branch now.

## Problem details opt-in

Problem Details for unhandled exceptions is now opt-in, through WebMvcConfigurer's configure Problem Details.

## Multipart converter split

There is a new Multipart HTTP Message Converter; form data stays on Form HTTP Message Converter.

## JsonUnit alternative

JsonUnit is supported in spring-test as an alternative to JSONassert.

## JPA Hibernate support

And seven point one adds support for JPA four and Hibernate 8.

## RC2 polish list

Release candidate two itself is the polish pass: stricter profile expressions, alias-cycle detection, and repeatable in-memory multipart content, among other fixes.

## Cloud train line

Spring Cloud 2026.0, code name Paddington, is at release candidate two, on Boot four point two, release candidate two.

## GCS config backend

Config Server can use Google Cloud Storage as a backend.

## Gateway response cache

Gateway Server Web MVC gains a Local Response Cache filter.

## Nested query map

And OpenFeign sends nested objects of Spring Query Map as nested query parameters.

## DecisionModel definition

Spring AI 2.1, release candidate two, adds the Decision Model API. A Decision Model answers typed yes or no, choice, or score questions with probabilities. That is faster and cheaper than free-text chat when you need classification, guardrails or triage.

## Ollama tool index

There is an Ollama Decision Model, and a Decision Tool Index for tool search.

## RAG post processors

Decision-based RAG document post-processors are in too.

## Local model name

The docs point at the Ollama starter with d1-omni six hundred M as the quickest local try.

## Detroit attribution

On November fourth, Maurizio Cimadamore wrote about Project Detroit on inside.java.

## Call versus embed

The Foreign Function and Memory API already made calling foreign libraries easier. Embedding a whole foreign language runtime is still hard.

## Rewrite path Nashorn

The old path was to rewrite the runtime in Java. Nashorn did that for JavaScript. It shipped in JDK eight, was deprecated in eleven, and removed in fifteen. That did not scale.

## Detroit embeds runtimes

Project Detroit uses the Foreign Function and Memory API to embed industry-standard native runtimes, like V8 and CPython, inside a Java application.

## Talk scope Devoxx

The talk covers garbage collector interaction and virtual-thread pinning. It was recorded at Devoxx Belgium twenty twenty six.

## Schatzl write-up

Also this week, Thomas Schatzl's JDK twenty seven garbage collector write-up landed on inside.java.

## JEP default G1

JEP five twenty three makes jee one the default garbage collector in all environments.

## Serial still available

Serial is still there, with Use Serial GC.

## Small machine case

On small or single-CPU boxes, jee one is no longer skipped just because the machine is small.

## Other collector notes

The write-up also covers heap free-ratio default changes, a Parallel tenuring fix, and better TLAB handling for short-lived threads.

## Quarkus Hibernate Valkey

Quick hits. Quarkus four point oh, beta three, moves with Hibernate ORM eight, beta four, and adds Valkey URI support.

## InfoQ other projects

The InfoQ Java news roundup for the week of October 26 covers TornadoVM eight, with a new pure-Java compiler, LangChain4j one point twenty three and its own Decision Model, and Gradle nine point nine, release candidate one.

## Kotlin Maven quiet

Kotlin and Maven were quiet for Spring viewers.

## Security Modulith Data

Spring Security, Modulith and Spring Data stayed on last week's release candidates. No new bump in this window.

## Recap Boot Redis

One, if you tried Boot four point two release candidate one, move to two, and watch the Redis database behavior change.

## Recap QUERY client

Two, read the Framework seven point one notes: try HTTP QUERY, and plan the RestTemplate to RestClient move.

## Recap AI decision

Three, if you build AI features, look at Spring AI's Decision Model.

## Recap JDK default

Four, on JDK twenty seven, jee one is default everywhere.

## Closing source reminder

All the links are in the description.

## See you next

See you next week.
