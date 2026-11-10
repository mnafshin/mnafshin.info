---
title: 'Why @Async Does Nothing: Spring Proxies and the Self-Call Trap'
description: Our shop's checkout sends a confirmation email, and the mail server takes three seconds. So we marked the email method at Async, to send it in the background. But the customer still waits three seconds.
youtubeId: CJpskEeVZSs
pubDate: '2026-10-27T18:03:31Z'
series: tutorials
seriesLabel: T4.2a
order: 90
codeUrl: https://github.com/mnafshin/springuniverse-code/tree/main/module-04-container
---

## 00 Cold open
Our shop's checkout sends a confirmation email, and the mail server takes three seconds. So we marked the email method at Async, to send it in the background. But the customer still waits three seconds. Why didn't at Async work? The log gives a hint: the email was sent on main, the same thread as checkout. A thread is one line of work in your program, and an app can run several threads at the same time. At Async should send the email on another thread, so checkout can answer right away. The answer is a proxy. A proxy is a stand-in object that Spring puts in front of your bean. A bean is an object that the Spring container creates and manages for you. First we fix this bug, then we find the same trap in three more annotations. Everything happens in one small checkout app, and every line of output is real.

## 01 Not your class: a CGLIB proxy
Here's the code. Checkout saves the order, then calls send confirmation. Send confirmation is marked at Async, and it hands the email to the mail server. Let's see what Spring gives us for each bean. Run it, and print the class of each one. The mail server is just a mail server. But the order service is something else: order service, dollar dollar, Spring CGLIB. We never wrote that class: Spring made it with CGLIB. CGLIB is a library that Spring uses to generate a subclass of your class at startup. Is it a proxy? The mail server, no. The order service, yes. It's still an order service, because it's a subclass of our class. And behind it sits the real object that we wrote. So when you call send confirmation on the proxy, the proxy hands the work to another thread. Then it returns right away. That's how at Async works.

## 02 The self-call
So why did the customer wait? Let's follow the calls. Our app calls checkout on the proxy. Checkout has no annotation, so the proxy just passes the call to the real object. Inside the real object, checkout calls send confirmation. That call goes through Java's this reference, straight to the real object, not through the proxy. The proxy never sees it, so it can't move the email to another thread. The email is sent on main, and the customer waits the full three seconds. This is the self-call trap: one method calling another method in the same object. No error, no warning: that's what makes this bug so hard to spot.

## 03 The fix: another bean
The fix is to make the call go through a proxy. Move the email method into its own bean: a confirmation mailer. Its send method is marked at Async. The order service gets the mailer's proxy through its constructor.
```
mailer.send(id);
```
Checkout now calls send on the mailer. Run it. The customer waited zero seconds. Three seconds later, the email is sent on task one, a background thread that Spring Boot gives you. The call crosses from one bean to another, so it passes the proxy. Spring's own docs call this the best fix. There are other tricks, like letting a bean call itself through its own proxy. But they make the code harder to follow.

## 04 The same trap with `@Transactional`
At Transactional has the same trap. A transaction makes a group of saves all or nothing: if one part fails, it undoes, or rolls back, the rest. Here, checkout calls its own save method, marked at Transactional. Save writes the order, then one line per item. A muffin has no price yet, so an order of coffee and muffin fails on the second line. Run it. Transaction active: false. The order and its first line stay in the database: half an order. The self call skipped the proxy, so there was no transaction to roll back. Same fix: move save into another bean, an order writer.
```
writer.save(id, items);
```
Now the transaction is active. It still fails on the muffin, but everything rolls back: no orders, no lines.

## 05 The same trap with `@Cacheable`
At Cacheable has the same trap too. A cache keeps a result in memory, so the next time you ask for it, the work is skipped. Here, the order service adds up a total, and it calls price for each item. Price is marked at Cacheable, and it counts how often it really looks in the price table. Run it with three coffees. Three price lookups for the same coffee: the cache was never used. Total calls price on this, so the call skipped the proxy. Same fix: a price cache bean, with the at Cacheable price method.
```
sum += prices.price(item);
```
Now there's only one lookup: the other two coffees come from the cache.

## 06 The same trap with `@Retryable`
At Retryable runs a method again when it fails. It's built into Spring Framework 7, and you switch it on with at Enable Resilient Methods. Charging a payment fails the first time, because the payment provider is busy, and works the second time. Checkout calls charge, which is marked at Retryable. Run it. One attempt, then it fails: no retry at all. Same trap: the call went through this, not through the proxy. Same fix: a payment client bean.
```
return payments.charge(id);
```
Now the first attempt fails, the second one works, and the order is charged.

## 07 Recap
Let's recap. At Async, at Transactional, at Cacheable, and at Retryable all work through a proxy in front of your bean. A call from one method to another in the same object skips the proxy, so the annotation does nothing. The fix is to move the method into another bean. So when an annotation seems to do nothing, ask one question: did this call go through the proxy? And some methods can't go through this kind of proxy at all, like final and private methods. That's the next video, on proxy types and final, and it's linked below. The code for the whole checkout app is linked too.
