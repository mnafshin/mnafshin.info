---
title: Test Your Spring Boot Auto-Configuration (ApplicationContextRunner)
description: In this video, we test both cases of the library, without changing the shop. Here is our shop app. Its page shows the price of a coffee, in euros.
youtubeId: q_N1TERi5Fc
pubDate: '2026-11-09T12:00:06Z'
series: tutorials
seriesLabel: T5.5
order: 160
---

## 00 Where the shop is now
In this video, we test both cases of the library, without changing the shop. Here is our shop app. Its page shows the price of a coffee, in euros. The prices come from our small price library. On its own, the library gives dollars. But the shop has its own euro formatter, so the library steps aside. Auto configuration means Spring Boot creates the usual beans for you, based on what is on your classpath. A bean is an object that the Spring container creates and manages for you. Our library's auto configuration makes a dollar formatter bean, but only when the app has none. So in the shop, we can't see the dollars anymore.

## 01 A tiny app inside a test
The shop already has a test. It starts the whole shop, with its web server, so it can only test the shop as it is. We want to build each case ourselves. So we add Spring Boot's test starter, the libraries for writing tests, to the library, only for tests. Then we write a test class. At its top, we make an Application Context Runner. The application context is the Spring container: it creates your beans, connects them, and hands them out. The runner starts a tiny application context inside a test. We give it just one thing, our auto configuration: the test passes in the Price Configuration class. This test does not check whether Boot finds that class from the imports file. No shop, and no web server. When it starts, the runner hands our test the context, so we can check which beans are in it. Our first test runs it with nothing else added, so the app has no formatter of its own. We check two things. There's exactly one price formatter, and it shows a coffee in dollars. We run the tests. One test, and it passes. And no web server started.

## 02 The app brings its own
Now the shop's case. The second test starts from the same runner, and adds one bean named euro prices, just like the shop's. The runner's with bean method puts it into the tiny app before it starts. This time we check three things. There's still exactly one bean of the price formatter class. That bean is named euro prices. The library's bean, named price formatter, isn't there. That's the condition on the library's bean doing its job: it only runs when the app has no formatter. So a coffee costs euros here. We run the tests again. Both tests pass. If someone deletes that condition from the library, this second test fails, long before a real app ends up with two of them. And the shop's code didn't change at all.

## 03 Recap
Let's recap. An Application Context Runner checks an auto configuration on its own, in a tiny app inside a test. It starts with just the auto configuration you give it. Each case is one short test. With nothing added, the library gives dollars. With the app's own bean, it steps aside. And the app itself stays as it is. The code is linked below.
