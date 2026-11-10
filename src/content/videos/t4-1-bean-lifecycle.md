---
title: 'Spring Bean Lifecycle Explained: @PostConstruct, @PreDestroy, @Lazy, @DependsOn'
description: Our shop app crashed during startup. The price cache needed its price source, and in its constructor, that source was null. And when the app stopped, its price export folder was never deleted.
youtubeId: loahk4gher0
pubDate: '2026-10-29T17:11:43Z'
series: tutorials
seriesLabel: T4.1
order: 80
codeUrl: https://github.com/mnafshin/springuniverse-code/tree/main/module-04-container/src/main/java/info/mnafshin/springuniverse/container/shop
---

## 00 Cold open
Our shop app crashed during startup. The price cache needed its price source, and in its constructor, that source was null. And when the app stopped, its price export folder was never deleted. Both bugs come from code running at the wrong moment in a bean's life. So where does setup code belong, and when does cleanup really run? By the end of this video, you'll know both answers, and you'll fix both bugs. We'll stay in one small shop app the whole time, and every line of output is real.

## 01 A bean's life in five steps
A bean is simply an object that the Spring container creates and manages for you. Let's follow one bean of our shop app, the price cache, from start to end. Think of a real shop. First, the building is there. Then the deliveries arrive. Then someone stocks the shelves and opens the door. The shop serves customers all day. And at night, someone cleans up and locks the door. A Spring bean goes through the same five steps. First, the container calls the constructor. Second, it injects the dependencies. Third, it calls your init callback, the place for setup code. Fourth, the bean is in use. Fifth, when the container closes, it calls your destroy callback. Every example in this video is one of these steps going wrong in our shop app, and then right.

## 02 Example 1: null in the constructor
Here's our shop's price cache. Its price source is injected into a field with at Autowired. And its constructor loads the prices from that source. Let's run it. The constructor prints the source, and it's null. Then startup fails with a null pointer exception. Why? Look at the five steps. Spring has to create the object before it can set its fields. So while the constructor runs, step two hasn't happened yet. The fix is to move the setup code to step three.
```
@PostConstruct
```
A method marked at Post Construct runs after all dependencies are injected. Run it again. In the constructor, the source is still null. But in the post construct method, it's there, and coffee costs three. There's an even simpler fix: constructor injection. The dependency arrives as a constructor parameter, so it's never null. That's the first choice. Use at Post Construct for setup work that needs the finished bean.

## 03 Example 2: when beans are created
When does step one happen? Our shop has two beans here: the price cache, and a sales report that's slow to build and rarely used. We start the container. Both beans are created right away, before the container is ready. That's the default for singletons. They're built at startup, so a broken bean stops the app at once, not hours later. And they're built once. Ask for the sales report twice, and you get the same object. But our sales report slows down every startup, even when nobody uses it.
```
@Lazy
```
Mark it at Lazy. Now the container is ready without it. The sales report is created the first time someone asks for it. Use this sparingly, because a lazy bean with a problem only fails when it's first used.

## 04 Example 3: init and destroy callbacks
Step three and step five each have three ways to hook in. Our price cache uses all of them at once, only so we can see the order. For setup, at Post Construct runs first. Then after properties set, from Spring's initializing bean interface. Then the init method named on at Bean. Cleanup follows the same pattern. At Pre Destroy, then destroy, then the destroy method named on at Bean. In real code, pick one. The Spring docs recommend at Post Construct and at Pre Destroy, because they don't tie your class to Spring. For beans from at Bean methods, there's a shortcut. The shop's price store has a public close method, and nothing else. Spring finds it, and calls it at shutdown on its own. One tip: keep init callbacks short, because startup waits for every one of them.

## 05 Example 4: cleanup that never runs
Step five has a catch. Our shop writes its nightly price export into a real temp folder at startup, and deletes the folder in its at Pre Destroy method. Here's a small main method. It starts a container, uses the bean, and ends. Look at the output. The folder was created, but the delete line never appears. Destroy callbacks only run when the container is closed, and nobody closed it.
```
try (var context = new AnnotationConfigApplicationContext(PriceExport.class)) {
```
With try with resources, the container is closed at the end of the block. Now the folder is deleted. What about Spring Boot? Boot registers a shutdown hook with the JVM. So when you press control C, or a server stops your app normally, Boot closes the context, and at Pre Destroy runs. Here's a Boot version of the shop, stopped with a normal stop signal. The export folder is deleted. But a forced kill, like kill dash nine, ends the JVM at once, and no cleanup runs at all.

## 06 Example 5: creation order and `@DependsOn`
Last question: which bean is created first? Here are three of our shop's beans: a price cache, a price source, and migrations that create the prices table. The price cache needs the price source in its constructor. So Spring creates the price source first, then the cache. A dependency is always ready before the bean that needs it. But look at the first line. The price source reads the prices table, and the table is missing. The migrations ran last. The price source needs them, but never calls them, so Spring can't know. That's a hidden dependency.
```
@DependsOn("migrations")
```
At Depends On tells Spring about it. Now the migrations run first, the price source finds its table, and then the cache is created. Watch the shutdown, too. It runs in reverse. The cache closes first, then the price source, then the migrations. So a bean is never destroyed while a bean that needs it is still running.

## 07 Example 6: the whole shop app
Now let's put every fix into one run of the shop app. The price cache gets its source through the constructor, and loads its prices in at Post Construct. The price source depends on the migrations. The sales report is lazy, and the price export cleans up in at Pre Destroy. And main closes the container with try with resources. Let's run it. The migrations run first, then the price source finds its table, and the cache loads two prices. The export folder is created, and the shop is ready. The sales report only appears when the shop asks for it. And when the shop closes, the export folder is deleted, and the beans close in reverse order. Same app, no null fields, and no leftover folders.

## 08 Recap
Let's recap the life of a bean. One: the constructor runs, and injected fields are still null, so prefer constructor injection. Two: dependencies are injected, and they're always created first. Use at Depends On when a dependency is hidden. Three: init callbacks, where setup code goes. Use at Post Construct. Four: the bean is in use. Singletons are created at startup, and only once, unless they're marked at Lazy. Five: destroy callbacks, with at Pre Destroy. They run only when the container is closed, and Spring Boot does that for you on a normal stop. Next: why an annotation like at Transactional sometimes does nothing. The code for the whole shop app is linked below.
