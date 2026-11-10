---
title: Dependency Injection and IoC in Spring, from First Principles (Spring Boot 4)
description: This signup service builds its own helpers with new. It works. But every test sends a real email, and you can't swap anything without editing the class.
youtubeId: Z8zt0ZZ6IGY
pubDate: '2026-10-24T16:00:35Z'
series: tutorials
seriesLabel: T2.1
order: 40
codeUrl: https://github.com/mnafshin/springuniverse-code/tree/main/module-02-di
shorts:
- title: 'Dependency injection, without the jargon #java #spring'
  youtubeId: VZLmPVweEmQ
- title: 'Library or framework? One question tells you which. #java #spring'
  youtubeId: KBRjeP91zBw
- title: 'Constructor injection wins. Here''s why #springboot'
  youtubeId: Pi8ch0rIIBM
- title: '"Required a bean that could not be found", decoded #springboot'
  youtubeId: lBYxCuMwQRM
- title: 'Test it without Spring: the real payoff of dependency injection #springboot'
  youtubeId: uitq5zQF4-8
---

## 00 Cold open
This signup service builds its own helpers with new. It works. But every test sends a real email, and you can't swap anything without editing the class. In this video, we fix that step by step. First in plain Java, with no framework at all. Then we hand the same classes to Spring, and watch the container do the wiring for us. By the end, you'll know what inversion of control and dependency injection really mean, and you'll be able to read the two errors every Spring beginner meets. The one minute version of dependency injection is a Short, linked in the description.

## 01 A hard-wired service
Here's our starting point. A signup service with one method: register a user by name.
```
private final EmailNotifier notifier = new EmailNotifier();
```
It saves the user in a repository, then sends a welcome message through an email notifier. Look at the two fields. The service creates both of them itself, with new. So the service decides which repository and which notifier exist. It controls its own dependencies.

## 02 Why that hurts
That control comes at a price. First, testing. Every test of register now sends a real email, because there's no way to pass in anything else. Second, change. Want text messages instead of email? You have to edit the signup service, even though signup didn't change. Third, it's hidden. From the outside, the constructor takes nothing, so you can't see what this class depends on until you read its body. Three problems, one root cause: the class builds its own collaborators.

## 03 Step one: ask in the constructor
The fix is small. Delete both new calls. Instead, ask for the dependencies in the constructor.
```
public SignupService(UserRepository users, Notifier notifier) {
```
And notice the types. We ask for a user repository and a notifier, which are interfaces. The service no longer knows about email at all. It just knows that something can send a message. The fields are final, so once the object exists, its dependencies are set and can't be null by accident. That's dependency injection: the object declares what it needs, and someone else provides it.

## 04 The payoff: a test with a fake
Now testing gets easy. Write a fake notifier that just records messages in a list.
```
var signup = new SignupService(new InMemoryUserRepository(), fake);
```
Create the service with the fake, register Ada, and check that exactly one welcome message was recorded. No email server, no framework, no special tooling. It's plain JUnit and plain Java, and it runs in milliseconds. Here's the real run: four tests, all green.

## 05 The composition root
But someone still has to call new. We just moved it. In plain Java, that someone is usually main.
```
SignupService signup = new SignupService(users, notifier);
```
Create the repository, create the notifier, pass both into the service, and call register. One place that builds the whole object graph. It's often called the composition root. Run it, and the email notifier prints its message. Three objects are easy to wire by hand. Now imagine two hundred, each with its own dependencies, created in the right order. That bookkeeping is exactly the job a container takes over.

## 06 Where inversion of control comes in
So where's the inversion? Before, the service controlled the creation of its own dependencies. Now that control is inverted. Something outside creates them and hands them in. The Spring reference says it directly: dependency injection is a specialized form of IoC. And it calls the process the inverse of the bean controlling the creation of its own dependencies. You saw the bigger idea, the framework calling your code, in the library versus framework Short. This is the same idea, applied to creating objects.

## 07 Same classes, now Spring
Now let's give the same classes to Spring. We add a Spring Boot application class, and one annotation per class. The signup service gets at Service. The email notifier and the repository get at Component.
```
@Service
public class SignupService {
```
Everything else is unchanged. Same fields, same constructor, and no at Autowired anywhere. A controller asks for the signup service in its constructor too. Start the app, and post a signup for Ada.
```
$ curl -X POST 'localhost:8080/signups?name=Ada'
```
We get the welcome back as JSON, and the log shows the email notifier ran. We never called new on any of these classes. Spring did.

## 08 What the container actually did
Here's what happened at startup. At Spring Boot application turns on component scanning in its package. Spring finds every class marked at Component. At Service counts too, it's a more specific kind of component. Each one becomes a bean definition. Then Spring creates the beans. To build the signup service, it looks at the only constructor, sees that it needs a user repository and a notifier, finds the one bean of each type, creates those first, and calls the constructor. The same call we wrote by hand in main. The Spring docs say it plainly: if a class has only one constructor, it's always used, even without at Autowired. Our test asks the application context for the signup service, and confirms that its notifier is the email notifier.

## 09 When the wiring fails
Because Spring wires everything at startup, mistakes show up early, and loudly. Remove at Component from the email notifier, and start again.
```
Parameter 1 of constructor in ...SignupService required a bean of type '...Notifier' that could not be found.
```
Read it literally. Parameter one of the signup service constructor, counting from zero, needs a notifier, and there's no notifier bean. The fix: make one a bean. Now the opposite. Add a second notifier for text messages, and start again. This time Spring finds two candidates, and it refuses to guess. It even suggests the fixes: at Primary or at Qualifier. That's a topic for its own Short.

## 10 Recap
Let's recap. A class that builds its own helpers with new is hard to test and hard to change. Ask for dependencies in the constructor instead, and depend on interfaces. Then a fake in a test is one line, and wiring happens in one place. Spring's container does that wiring for you: it finds your components, creates them in the right order, and calls your constructors. Your classes stay plain Java. Next time, we open the container itself: at Configuration, at Bean, and the application context. The code is linked in the description.
