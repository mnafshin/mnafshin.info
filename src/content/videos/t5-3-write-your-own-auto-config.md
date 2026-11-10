---
title: Make Your Own Library Set Itself Up (Spring Boot 4)
description: 'We have two projects: a small library for prices, and a shop app that uses it. Spring Boot''s own jars set themselves up when you add them. In this video we make our library do the same.'
youtubeId: x3zh9foVSco
pubDate: '2026-11-04T12:00:02Z'
series: tutorials
seriesLabel: T5.3
order: 140
codeUrls:
- https://github.com/mnafshin/springuniverse-code/tree/main/module-05-prices
- https://github.com/mnafshin/springuniverse-code/tree/main/module-05-price-shop
---

## 00 A library and a shop
We have two projects: a small library for prices, and a shop app that uses it. Spring Boot's own jars set themselves up when you add them. In this video we make our library do the same. Add it, and it works. And when the app brings its own price formatter, the library steps aside. The library's Price Formatter class turns an amount into a price, with a currency. The library also has a configuration class. It creates one formatter, in US dollars, as a bean. A bean is an object that the Spring container creates and manages for you. The shop is a Spring Boot web app. Its controller shows the price of a coffee, so it needs a price formatter. The shop adds our library as a dependency.

## 01 Add the library: does it just work?
Let's start the shop. It fails. The controller needs a price formatter, and no bean of that type was found. But the library has a configuration class that makes one. Why wasn't it used? Spring Boot never looked there. A Spring Boot app finds its classes with component scanning. Component scanning means Spring searches your packages for classes marked at Component and makes them beans. It searches the package of the app class, and everything below it. Our shop lives in the shop package. The library lives in the prices package, next to it, not below it. So its configuration is never found. And that's right: a library can't know where each app keeps its classes.

## 02 Make it an auto-configuration
Spring Boot's own jars work a different way. They bring auto configurations. Auto configuration means Spring Boot creates the usual beans for you, based on what is on your classpath. The classpath is the list of jars and folders that your app's code is loaded from. Spring Boot finds them through a file inside each jar, the imports file. The imports file is the list of auto configuration classes that a jar offers, one class name per line. Here is the one inside Spring Boot's Tomcat jar. Tomcat is the web server that runs inside our app. We do the same in our library, with three small changes. We add Spring Boot's auto configure library as a dependency. We change at Configuration to at Auto Configuration, the mark of an auto configuration class. And we add the imports file, with our one class name. Start the shop again. It starts, and the page shows the coffee price in US dollars. We added the library, and it set itself up.

## 03 The shop wants its own formatter
Now our shop sells in Europe, so it wants prices in euros. The shop declares its own formatter bean: euro prices. Start it. It fails again, with a new message. The controller needs a single formatter, and Spring found two of them. The first is the shop's, euro prices. The second comes from our library. Spring suggests marking one of them as primary. That's a fix the app would have to make. A good library steps aside by itself.

## 04 The library steps aside
We go back to the library and add one annotation to its bean method: at Conditional On Missing Bean. It means: create this bean only if the app has no bean of this type yet. Spring Boot reads auto configurations after the app's own beans, so the shop's formatter is already known. Start the shop. It starts, and the price is in euros now. The library saw the shop's formatter and stepped aside. A shop without its own formatter still gets the dollar one, like before.

## 05 Recap
Let's recap. Component scanning doesn't find a library's configuration, and it shouldn't. To make a library set itself up, make its configuration an auto configuration. Then list it in the imports file inside the jar. Last, put at Conditional On Missing Bean on its beans, so the app's own bean always wins. That's how Spring Boot's own jars work, and now ours does too. The code is linked below.
