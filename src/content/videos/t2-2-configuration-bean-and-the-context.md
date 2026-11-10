---
title: '@Configuration, @Bean and the ApplicationContext in Spring, Explained (Spring Boot 4)'
description: In the last video, Spring Boot wired our signup service for us. Today we take the Boot part away, and create the Spring container ourselves, in plain Java. One line builds it, from one configuration class.
youtubeId: 3oLs8NcriKo
pubDate: '2026-10-25T09:00:26Z'
series: tutorials
seriesLabel: T2.2
order: 50
codeUrl: https://github.com/mnafshin/springuniverse-code/tree/main/module-02-configuration
shorts:
- title: '@Component or @Bean? Here''s the rule #springboot'
  youtubeId: ww3SUs3vVzc
- title: 'You don''t need Spring Boot to use Spring #springboot'
  youtubeId: P6cM0QtMspM
---

## 00 Cold open
In the last video, Spring Boot wired our signup service for us. Today we take the Boot part away, and create the Spring container ourselves, in plain Java. One line builds it, from one configuration class. Ask it for the signup service, and it's fully wired. Then we list every bean it created, and by the end you'll know where each one came from. Along the way: at Configuration, at Bean, component scanning, the application context, and configuration split across several classes. The first video of this module, on dependency injection, is linked in the description.

## 01 The container without Boot
Here's the whole program.
```
try (var context = new AnnotationConfigApplicationContext(AppConfig.class)) {
```
We create an annotation config application context, and give it one class: app config. That's the container. It's the same kind of object Spring Boot creates for you at startup. Next, we ask it for the signup service by type, and call register. The context is closeable, so try with resources shuts it down cleanly at the end. Let's run it.
```
EMAIL to Ada: Welcome, Ada! (signed up 2026-10-24T13:47:32.704591267Z)
```
The audit log is created, and the welcome email goes out. No Spring Boot code runs here. Just the core container from Spring Framework.

## 02 Bean methods
So what's inside app config? It's a class marked at Configuration, with one method marked at Bean.
```
@Bean
public Clock clock() {
```
The Spring docs put it simply: at Bean indicates that a method instantiates, configures, and initializes a new object to be managed by the container. Spring calls this method, and keeps the clock it returns as a bean. By default, the bean's name is the method name, so this bean is called clock. Why a method, and not an annotation on the class? Because Clock lives in java dot time. It's not our code, so we can't put at Component on it. A bean method is how you give Spring objects from libraries, or objects that need a few lines of setup. And the signup service simply asks for a Clock in its constructor, like any other dependency.

## 03 Bean or Component?
That gives us a simple rule. Your own class, created with a plain constructor? Put at Component on it, or at Service, and let scanning find it. A class you can't edit, or one that needs real setup code? Write an at Bean method for it. Both end up as the same thing in the container: a bean definition, with a name, a type, and singleton scope by default. You can mix them freely. In our app, the email notifier and the signup service are scanned components, and the clock comes from a bean method.

## 04 Why at Configuration matters
Here's a second configuration class, for persistence. It has two bean methods. One creates an audit log, and the other creates the user repository.
```
return new InMemoryUserRepository(auditLog());
```
Look closely. The repository method calls audit log directly, like a normal Java method. So shouldn't that create a second audit log? Run it, and audit log created prints exactly once. The repository got the same audit log that the container holds. That's the job of at Configuration. At startup, Spring subclasses every configuration class with a library called CGLIB. The subclass checks the container first, and only runs your method if the bean doesn't exist yet. You can see it in the bean list: the type is persistence config, dollar dollar, Spring CGLIB. Now let's turn that off, with proxy bean methods equals false. This is called lite mode.
```
@Configuration(proxyBeanMethods = false)
```
Same code, same call, but now audit log created prints twice. The repository holds an extra audit log that the container doesn't manage. The fix works in every mode. Ask for the audit log as a parameter of the bean method, and Spring passes in the real bean.

## 05 Component scanning
Next question: how did Spring find the email notifier and the signup service? App config also has at ComponentScan, with no package given.
```
@ComponentScan
```
With no package, scanning starts at the package of the class that declares it, and goes down through every package below it. App config lives in config dot app, so everything in config dot app and below is found. Now here's an SMS gateway, also marked at Component, but in a sibling package: config dot outside. Ask the context for it, and you get a no such bean definition exception. The annotation is there, but nobody scanned that package. So when a bean isn't found, check the package first. Either move the class under your configuration's package, or name the extra package in at ComponentScan.

## 06 The application context
Now let's look at the context itself. The application context is the container's main interface, and you've already used its most important method: get bean.
```
context.getBean(SignupService.class)
```
Get bean by type is the usual way. Get bean by name works too: ask for clock, and you get the clock. Get bean definition names lists every bean, and that's how we printed this list. App config and persistence config are beans too. Then come the email notifier and the signup service, found by scanning. And the audit log, the user repository and the clock, from bean methods. Get beans of type returns every bean of one type, in a map. Our lite mode demo used it to show that the container holds just one audit log, even though two were created. And close shuts the container down, which is what try with resources did for us. In application code, you'll rarely call get bean, because constructor injection does that work. But in tests and while debugging, these methods show you exactly what the container holds.

## 07 Several configuration classes
Real applications split configuration by topic. Web in one class, persistence in another, security in a third. So how did the container find persistence config? We only passed it app config. The answer is at Import, on app config.
```
@Import(PersistenceConfig.class)
```
At Import loads the bean definitions from another configuration class, so starting the container with app config is enough. You could also pass several classes to the constructor, or call register, and then refresh. And beans connect across classes. The signup service needs the user repository from persistence config, and the clock from app config. No class has to know where the others are defined. The container matches them by type. In our tests, a context with only persistence config has a user repository, but no signup service, because it never saw the rest.

## 08 The same thing in Spring Boot
So where is all of this in a Spring Boot app? It's hidden in one annotation. At Spring Boot application is the same as three annotations: at Spring Boot configuration, at Enable Auto Configuration, and at ComponentScan.
```
@SpringBootApplication
```
At Spring Boot configuration is itself marked at Configuration, so your main class is a configuration class, and can hold bean methods. At ComponentScan starts at the main class's package. That's why the Boot docs recommend putting the main class in a root package, above your other classes. Our Boot app lives in config dot boot, so it pulls in app config with at Import, and gets exactly the same wiring. And Spring application dot run returns the application context. Print its class, and it's an annotation config application context, the same type we built by hand. Auto configuration adds Boot's own beans on top, and that's a topic for later in the course.

## 09 Recap
Let's recap. An annotation config application context is the container, created from configuration classes. At Bean methods create objects you can't annotate, and the bean name is the method name. At Configuration makes calls between bean methods return the same singleton, thanks to a CGLIB subclass. In lite mode, use method parameters instead. Component scanning starts at the package of the configuration class, so a component outside it is never found. At Import joins configuration classes, and at Spring Boot application does all of this in one annotation. Next time, we feed the app settings from outside: properties, YAML and environment variables. The code is linked in the description.
