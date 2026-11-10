---
title: Change the Web Server Spring Boot Built (and Keep the Rest)
description: Our shop is a small web app with one page. We start it, and Tomcat starts on port eighty eighty. Tomcat is the web server that runs inside our app.
youtubeId: Q-lEBoKJIs4
pubDate: '2026-11-03T12:00:19Z'
series: tutorials
seriesLabel: T5.2
order: 130
codeUrl: https://github.com/mnafshin/springuniverse-code/tree/main/module-05-shop-settings
---

## 00 Spring Boot built our web server
Our shop is a small web app with one page. We start it, and Tomcat starts on port eighty eighty. Tomcat is the web server that runs inside our app. We never wrote any server code. Spring Boot built the server for us. In this video we change that server in two ways. First with one line of settings, then with a little code. And we keep everything else Spring Boot set up. A port is the number a server listens on, so requests can find it. We open the page, and the shop says welcome.

## 01 First choice: a property
We want every address of our shop to start with slash shop. The context path is the first part of every address in your app, like slash shop. Right now it's just a slash. The easy way to change it is a property. A property is a named setting, like server dot port, that you can change without touching the code. We add one line to application dot properties: server dot servlet dot context path equals slash shop. Run it again.
```
java -jar … (with application.properties)
```
Tomcat started with context path slash shop. The welcome page now lives under slash shop, and the old address finds nothing. One line, and Spring Boot still built the whole server.

## 02 Where the property lands
How do we know that name? Spring Boot lists its properties in the docs, under common application properties. Here is ours, with its meaning: the context path of the application. Behind the list is plain Java. This class is Server Properties. Its annotation, at Configuration Properties, binds every property that starts with server dot to this class. Servlet is a group of web settings inside it, and context path is a field in that group. That's where our line lands. So when you want to change something Spring Boot built, look in this list first.

## 03 No property? Add a customizer
Now a new wish. A stock tool inside our company should reach the shop on its own port, eighty eighty one. The list has server dot port, but that's one port. There's no property for a second one. The docs say what to do next: write a customizer. A customizer is a bean that changes something Spring Boot builds, without replacing it. A bean is an object that the Spring container creates and manages for you. We write one method in the shop app that returns our customizer. We mark it with at Bean, so Spring makes it a bean. The customizer's type says what it changes: Tomcat's web server factory. A web server factory is the bean that builds and starts the web server. Spring Boot hands us its factory, and we add one more connector. A connector is Tomcat's name for a port it listens on. Ours listens on eighty eighty one. Run it.
```
java -jar … (with secondPort)
```
Tomcat started on two ports, eighty eighty and eighty eighty one, still with context path slash shop. The welcome page answers on the new port too. Our code added a port, and our property still works.

## 04 How both changes reach the server
How do the property and our code both reach the server? The answer is in Spring Boot's own code. Spring Boot uses a customizer too. This class is one. It takes the server properties and copies them into the factory. Here is the line for our context path. The docs add the order: Spring Boot runs its own customizers first, then yours. So Spring Boot builds its factory, its customizer sets slash shop, and ours adds the second port. We added a customizer, not our own factory, so nothing of Spring Boot's setup was switched off. That's why both changes show up in one line.

## 05 Recap
Let's recap. Spring Boot built our web server, and we changed it from the outside. First choice: a property, one line in application dot properties. Look in the property list first. No property for what you need? Add a customizer bean. It changes only what you need. Both work together, because Spring Boot's own property support is a customizer too. The code is linked below.
