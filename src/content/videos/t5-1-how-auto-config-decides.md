---
title: Who Set Port 8080? How Spring Boot Auto-Configuration Decides
description: Our shop is a small web app. We start it, and a web server starts on port eighty eighty. A port is the number a server listens on, so requests can find it.
youtubeId: RekWGe1V2_U
pubDate: '2026-11-02T12:00:16Z'
series: tutorials
seriesLabel: T5.1
order: 120
codeUrl: https://github.com/mnafshin/springuniverse-code/tree/main/module-05-web-shop
---

## 00 Our app starts a web server by itself
Our shop is a small web app. We start it, and a web server starts on port eighty eighty. A port is the number a server listens on, so requests can find it. But we never wrote a web server or a port. So who decided that, and how do we change it? That's what this video teaches. Here's our code: one class, one annotation, and no web server anywhere. The server in the log is Tomcat. Tomcat is the web server that runs inside our app. We'll see how Spring Boot decided to start it, and how we take control: first with a setting, then with our own code.

## 01 Change the port with server.port
The simple way is a property. A property is a named setting, like server dot port, that you can change without touching the code. We pass it on the command line, and ask for port ninety ninety.
```
--server.port=9090
```
Tomcat started on port ninety ninety. So the port is a setting. But who reads that setting, and who builds the server? Let's find out.

## 02 Who built the server? Ask Spring Boot
The pom is our Maven build file. Ours has one starter, the web starter. A starter is a small pom that brings a set of libraries that work together. This one brings Tomcat. But a library alone doesn't start anything. Something has to build the server, and that something is auto configuration. Auto configuration means Spring Boot creates the usual beans for you, based on what is on your classpath. A bean is an object that the Spring container creates and manages for you. The classpath is the list of jars and folders that your app's code is loaded from. At Spring Boot Application switches it on. Spring Boot then reads a list of auto configuration classes from every jar that has one. Tomcat's jar brings its own list. To see what Spring Boot decided, we start the app with dash dash debug.
```
--debug
```
Spring Boot prints the conditions evaluation report. The conditions evaluation report lists every auto configuration Spring Boot checked, and why it was applied or skipped. Positive matches were applied. Negative matches were skipped. Search for Tomcat. Tomcat Servlet Web Server Auto Configuration, matched. That's who built our server.

## 03 Inside: where 8080 and server.port come from
Let's open it. It's a normal Java class, shortened here to the lines that matter. Its main bean is a Tomcat web server factory. A web server factory is the bean that builds and starts the web server. Notice that it's created with no port at all. So where does eighty eighty come from? The port comes in through another class, Server Properties. At Configuration Properties with the prefix server binds the properties that start with server dot to this class. So server dot port lands in this field. Spring Boot copies it into the factory, but only when you set it. If you don't, the factory keeps its own default. And here it is: port equals eighty eighty. So the port has two homes: a default in the factory, and a property that can replace it.

## 04 Condition one: the classpath
Back in the auto configuration, two lines decide if any of this happens. They're conditions. A condition is a check that decides if a configuration or a bean is created. The first one sits on the class: at Conditional On Class. It lists classes that must be on the classpath, and Tomcat is one of them. If one is missing, the whole class is skipped. The report shows the answer. At Conditional On Class found the required classes. The web starter brought them. The same check can also say no: Gson, a JSON library, isn't on our classpath, so its setup was skipped.

## 05 Condition two: our own bean wins
The second condition sits on the factory itself: at Conditional On Missing Bean. Spring Boot creates its factory only if the app doesn't have one yet. So let's give it one. We add one bean to our shop app: our own Tomcat factory, on port seventy seventy. Run it.
```
java -jar … (with shopServer)
```
Tomcat started on port seventy seventy. Now with dash dash debug.
```
--debug
```
Spring Boot's factory is in the negative matches. At Conditional On Missing Bean found a bean of that type: shop server, ours. So Spring Boot backed off. But how did it see our bean in time? The docs say it: auto configuration is always applied after user defined beans have been registered. One word of care. Your bean wins almost always, not always. Spring Boot backs off only where its bean has at Conditional On Missing Bean, and the report shows you where.

## 06 Recap
Let's recap. Auto configuration built our web server. Server dot port changes its port, and without it, the factory's default is eighty eighty. At Conditional On Class builds it only when Tomcat is on the classpath. At Conditional On Missing Bean lets your own bean win. When Spring Boot surprises you, run with dash dash debug and read the report. The code is linked below.
