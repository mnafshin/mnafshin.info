---
title: Turn Off One Spring Boot Auto-Configuration (Spring Boot 4)
description: Here is our shop app. Its page shows the price of a coffee. Soon the shop will save its orders in a database.
youtubeId: dqlQulmudTY
pubDate: '2026-11-05T12:00:19Z'
series: tutorials
seriesLabel: T5.4
order: 150
codeUrl: https://github.com/mnafshin/springuniverse-code/tree/main/module-05-shop-exclude
---

## 00 The shop adds a database starter
Here is our shop app. Its page shows the price of a coffee. Soon the shop will save its orders in a database. So today we add the JDBC starter, Spring Boot's part for talking to a database. The database itself isn't ready yet. In this video, the shop turns off the one auto configuration it doesn't want yet, and keeps the starter. Auto configuration means Spring Boot creates the usual beans for you, based on what is on your classpath. The classpath is the list of jars and folders that your app's code is loaded from.

## 01 The new jar stops the start
We add the JDBC starter to the shop's build file, and start the shop. It fails before it serves a single page. Failed to configure a data source. A data source is the object your app uses to open connections to a database. And no URL, the database's address, is set. Our shop never asked for one. So who did? The starter put Spring Boot's JDBC jar on the classpath. Inside that jar, a small file lists the auto configurations it brings, one class name per line. The first one is Data Source Auto Configuration. It saw the jar and tried to build a data source. There's no address, so the start fails.

## 02 Turn it off in the code
We keep the starter, because the orders code will need it soon. We only want this one auto configuration off. At Spring Boot Application, the annotation on our app class, has an attribute for that: exclude. We give it the Data Source Auto Configuration class. Start the shop. It starts, and the page shows the coffee price. Is it really off? We start the shop with dash dash debug, to print the conditions evaluation report. The conditions evaluation report lists every auto configuration Spring Boot checked, and why it was applied or skipped. At the end, it has a section called Exclusions. Before our change, it said None. Now it lists Data Source Auto Configuration. If the class isn't on your code's classpath, write its full name as text instead, with exclude name.

## 03 Turn it off with a property
Turning it off is really a setting: today there's no database, soon there will be. Settings belong in a property. A property is a named setting, like server dot port, that you can change without touching the code. Spring Boot reads one for exclusions: spring dot auto configure dot exclude. We put it in application dot properties, with the full class name, and the annotation is plain again. Start the shop. It starts, and the coffee price is there. The report's Exclusions section lists Data Source Auto Configuration, from the property this time. One warning. Many older examples online use an older package name for this class. With that name, nothing is turned off: the start fails the same way, and Exclusions still shows the name. So copy the name from the jar's list. When the database is ready, we delete this one line, add the database settings, and the auto configuration runs again.

## 04 Recap
Let's recap. A jar can bring an auto configuration you don't want yet. The list inside the jar tells you its exact class name. Turn it off with exclude, or exclude name, on at Spring Boot Application. Or with the spring dot auto configure dot exclude property, outside the code. The starter stays. The report's Exclusions section shows what's off. The code is linked below.
