---
title: 'Spring Circular Dependencies: Why Boot Refuses Them and How to Fix Them'
description: In our billing app, invoices now look up the customer's name, and suddenly the app won't start. Application failed to start. The beans form a cycle.
youtubeId: pWrdkeQv-WM
pubDate: '2026-10-30T12:00:26Z'
series: tutorials
seriesLabel: T4.3
order: 110
codeUrl: https://github.com/mnafshin/springuniverse-code/tree/main/module-04-container/src/main/java/info/mnafshin/springuniverse/container/cycles
---

## 00 Cold open
In our billing app, invoices now look up the customer's name, and suddenly the app won't start. Application failed to start. The beans form a cycle. The customer service needs the invoice service, and the invoice service needs the customer service. So how do you get the app running again, without just hiding the problem? In this video, you'll see why Spring Boot refuses this, the flag that makes it start anyway, why that flag is a last resort, and three ways out. It's one small billing app all the way through, and every line of output is real.

## 01 Example 1: the cycle report
Spring has one simple rule: a dependency is always created before the bean that needs it. Now look at these two services. The customer service gets the invoice service through its constructor. And the invoice service gets the customer service through its constructor. So which one does Spring create first? To create the customer service, it needs the invoice service. To create the invoice service, it needs the customer service. Neither can go first. Run it. Spring Boot stops at startup and prints this report. Let's read it line by line. First, the problem: the beans form a cycle. Then the cycle itself, drawn as a loop. The customer service needs the invoice service, and the arrow goes back up to the customer service. Then the action. Circular references are discouraged, and prohibited by default. Remove the cycle. And as a last resort, it names a flag. That's the good side of a cycle. It fails at startup, with a clear report, not later in production.

## 02 Example 2: field injection and the flag
A common first idea is to switch to field injection. Now Spring could create both objects first, and fill in the fields later. Run it. Spring Boot still refuses. Same report, but now it names the fields. Spring Boot refuses cycles on purpose. Now let's try the flag from the report.
```
--spring.main.allow-circular-references=true
```
Run it with spring dot main dot allow circular references set to true. Now it starts. Each service holds the other one. How? Spring created the customer service, and before its field was set, it handed an early reference to the invoice service. The Spring docs call this a classic chicken and egg scenario. One bean is injected into the other before it's fully initialized. And the flag can't help with constructors. With constructor injection, there's no object to hand out early. Same report, and now Spring Boot says the cycle could not be broken.

## 03 Example 3: a half-built bean
So why not turn the flag on and move on? Here's why. Same two services, with the flag on. The invoice service has a post construct method. It asks the customer service for the open invoices of one customer. And to answer, the customer service asks the invoice service. Run it. A null pointer exception: the customer service's invoices field is null. Let's follow the startup. Spring creates the customer service first. Before it can set its field, it needs the invoice service, so it creates that. The invoice service gets the early customer service, the one whose field isn't set yet. Then the invoice service's post construct method runs, and calls the half built customer service. Its invoices field is still null. A post construct method normally runs after all dependencies are injected, so it's the safe place for setup code. In a cycle, even that isn't safe. That's why the flag is a last resort. The real fix is to remove the cycle.

## 04 Example 4: the fix: extract the shared part
Look at what each service really needs. The invoice service only needs a customer's name. Looking up names is a separate job. So move it into its own bean: a customer directory. The invoice service now asks the directory.
```
public InvoiceService(CustomerDirectory directory) {
```
The customer service needs the directory and the invoice service. Now the arrows point one way. Customer service, to invoice service, to directory. No cycle, and no flag. Run it. It starts, and both services work. Welcome Ada, invoice for Ada. This is the fix to try first. A cycle often means that one class does two jobs.

## 05 Example 5: the fix: an event
Sometimes the call back is the problem. Here, the customer service asks the invoice service to take a payment. Afterwards, the invoice service wants to tell the customer service that the customer has paid. A direct call would need the customer service, and that's the cycle again. Instead, the invoice service publishes an event.
```
events.publishEvent(new InvoicePaid(customerId));
```
It gets an event publisher from Spring, not the customer service. And the customer service listens for it with an at Event Listener method. Run it. The invoice is paid, and then the customer is marked as paid. The invoice service doesn't know who listens. The arrow only points one way.

## 06 Example 6: `@Lazy`, the last resort
If you can't change the design right now, there's one more tool. Back to the constructor cycle from example one. Add at Lazy to one constructor parameter.
```
public InvoiceService(@Lazy CustomerService customers) {
```
Run it. It starts. But look at what the invoice service got: customer service, dollar dollar, Spring CGLIB. That's a proxy: a stand-in object that Spring generated in place of the real one. The real customer service is looked up when you first call it, and that call works. The Spring docs call this a lazy resolution proxy. And they warn: if the target doesn't exist, you only find out through an exception when you call it. So the cycle is still there. It's just hidden behind a proxy. Use at Lazy as a last resort, like the flag.

## 07 Recap
Let's recap. Two beans that need each other form a cycle. Spring Boot refuses it at startup, and the report shows the loop. Field injection doesn't change that. The allow circular references flag lets a field cycle start, with an early reference to a half built bean. That can fail in surprising ways, and it can't fix constructor cycles. So the real fix is to remove the cycle. Move the shared part into its own bean, or publish an event instead of calling back. At Lazy only hides a cycle behind a proxy. That's the end of module four. Next, module five: how Spring Boot's auto configuration decides what to set up for you. The code for all six examples is linked below.
