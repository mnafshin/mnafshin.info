---
title: Why Is My Field Null? Spring CGLIB vs JDK Proxies, final and private
description: 'Our order service adds up the total of an order. In a cleanup, we made that method final. Now it crashes with a null pointer exception: the prices field is null.'
youtubeId: Tr3OySYJ8Hw
pubDate: '2026-10-28T12:00:07Z'
series: tutorials
seriesLabel: T4.2b
order: 100
codeUrl: https://github.com/mnafshin/springuniverse-code/tree/main/module-04-container
---

## 00 Cold open
Our order service adds up the total of an order. In a cleanup, we made that method final. Now it crashes with a null pointer exception: the prices field is null. But the constructor sets it. How can it be null? The answer is the proxy around this bean. A bean is an object that the Spring container creates and manages for you. A proxy is a stand-in object that Spring puts in front of your bean. The previous video showed why calls inside one object skip the proxy. It's linked below, but you don't need it for this one. Today we look at how Spring builds a proxy, the two kinds of proxy, and what a proxy can't handle. Everything happens in the same checkout app, and every line of output is real.

## 01 What Spring built: a CGLIB proxy
Here's the code. The price table comes in through the constructor. Total is marked at Transactional. A transaction makes a group of saves all or nothing: if one part fails, it undoes, or rolls back, the rest. At Transactional needs a proxy, so this bean gets one. Let's print the class of the order service. The name ends in dollar dollar, Spring CGLIB. That's a CGLIB proxy. CGLIB is a library that Spring uses to generate a subclass of your class at startup. So a CGLIB proxy is a generated subclass of your class. The proxy overrides each of your methods. It starts the transaction, passes the call to the real object, and then ends the transaction. So there are two objects: the proxy, and the real object behind it.

## 02 Why the field is null
Now let's look inside both objects. We read the prices field of the proxy, and of the real object behind it. In the proxy, prices is null. In the real object, it's set. Spring creates the proxy without calling our constructor, so the proxy's own fields stay empty. That's fine, as long as the proxy passes every call on. But Java doesn't let a subclass override a final method. So the proxy can't pass total on. Total runs on the proxy itself, where prices was never set. With Spring Boot's default logging, Spring even warns about this at startup. Remove final, and run it again.
```
public int total(String... items) {
```
Total: seven. The call goes through the proxy to the real object again.

## 03 A final class
What if the whole class is final? A CGLIB proxy is a subclass, and Java doesn't allow a subclass of a final class. Here, the receipt service is a final class, with an at Transactional method. Run it. This time the app doesn't even start: Spring cannot subclass the final class. The simplest fix is to remove final. But what if the class must stay final? Then you need the other kind of proxy.

## 04 The other kind: a JDK proxy
A JDK proxy is built into Java, and it only implements interfaces. It doesn't need a subclass, so a final class is fine. Our receipt service implements a receipts interface. We ask for a JDK proxy with at Proxyable interfaces, which is new in Spring Framework 7. Run it. The app starts, the proxy is a JDK proxy, and the receipt runs in a transaction. But there's a catch. Our payment service asks for a JDK proxy too. That proxy only implements the payments interface, so it's not a payment service anymore. Asking the container for the payment service class fails.
```
Payments payments = context.getBean(Payments.class);
```
Ask for the interface instead, and it works. In a constructor too, ask for the interface, not the class.

## 05 Which proxy does Spring pick?
So which kind does Spring pick by itself? Our shipping service implements a shipping interface. First, we run it in plain Spring Framework, without Spring Boot. It gets a JDK proxy, so it's not a shipping service anymore. Plain Spring uses a JDK proxy when your bean has an interface, and CGLIB when it doesn't. Now the same bean in Spring Boot. It gets a CGLIB proxy, so it's still a shipping service. Spring Boot changes the default: it uses CGLIB for every bean.

## 06 Which one is better?
So which one is better? A CGLIB proxy works without an interface, and you can ask for the class. But it can't handle final classes or final methods. A JDK proxy works with final classes, because it doesn't need a subclass. But only interface methods go through it, so you have to ask for the interface. Spring Boot picks CGLIB, because it works for more beans. And you can ask for the class, with no surprises.

## 07 Private methods
And private methods? Here, checkout calls its own private save method, marked at Transactional. Run it. Transaction active: false, with no error and no warning. A proxy can't override a private method. And only the class itself can call it, so the call never goes through a proxy anyway. If save needs a transaction, make it public and move it into another bean.

## 08 Recap
Let's recap. Spring Boot puts a CGLIB proxy in front of a bean that needs one: a generated subclass. Spring builds that proxy without your constructor, so its own fields are empty. A final method runs on the proxy itself, so it sees empty fields and skips the annotation. A final class can't get a CGLIB proxy at all, so the app won't start. At Proxyable interfaces gives it a JDK proxy, but then you ask for the interface, not the class. A private method never goes through a proxy. So keep proxied methods public and not final, in a class that isn't final. The first video, on the self-call trap, is linked below, with the code for the whole checkout app.
