---
title: Spring Boot 4 Profiles for dev, test and prod, plus a Little SpEL
description: 'Here''s the same jar, started three times. No profile: the daily signup limit is a hundred. The dev profile: five.'
youtubeId: Gdzp28_5FaQ
pubDate: '2026-10-26T12:00:20Z'
series: tutorials
seriesLabel: T3.2
order: 70
codeUrl: https://github.com/mnafshin/springuniverse-code/tree/main/module-03-configuration
---

## 00 Cold open
Here's the same jar, started three times. No profile: the daily signup limit is a hundred. The dev profile: five. The prod profile: a thousand, and a different bean handles the welcome mail. Nothing was rebuilt. In this video, you'll learn what a profile is, how to write profile specific files, how to switch profiles on, and how to swap whole beans per environment. Then we'll keep secrets out of those files, and finish with the one piece of SpEL that's still worth knowing.

## 01 What a profile is
A profile is just a name, like dev, test, or prod. When a profile is active, Spring adds the settings and beans that belong to it. When it's not active, they're ignored. Your laptop wants small limits and fake mail. Your tests want their own values. Production wants real limits and a real mail server. Profiles let one build serve all three. The code doesn't check which environment it's in. Spring picks the right pieces at startup.

## 02 `application-dev.yml`: only the differences
The simplest tool is a profile specific file. Next to application dot YAML, add application dash dev dot YAML.
```
app:
  signup:
    welcome-message: "Welcome, developer"
    daily-limit: 5
```
It only lists the keys that are different in dev. When the dev profile is active, Spring Boot loads the normal file first, then the dev file on top. Values merge key by key. The welcome message and the limit come from the dev file. The link expiry isn't in it, so it still comes from application dot YAML. In the same folder, the profile specific file wins over the plain one.

## 03 Turning a profile on
Nothing happens until a profile is active. The property that does it is spring dot profiles dot active. You can set it like any other property. On the command line, pass dash dash spring dot profiles dot active equals dev. The startup log tells you: the following one profile is active, dev. On a server or in a container, the usual way is the environment variable spring profiles active, in capitals, set to prod. It's the same naming rule as last time. You can also put a fallback value in application dot YAML, but let the environment decide in production.

## 04 No profile? You get "default"
What if you set nothing? Spring Boot says so in the log: no active profile set, falling back to one default profile, default. So there's always at least one profile. That's why a file called application dash default dot YAML is only loaded when no other profile is active. Most apps never need it. Plain application dot YAML already holds the common values. Just remember the word default in that log line. It means no profile is active.

## 05 Two profiles at once: the last one wins
You can activate more than one profile, separated by commas. If two profile files set the same key, the profile listed last wins. With prod comma dev, both are active, and the limit is five, from dev. Order matters, so keep combinations rare and simple. One more rule from the last video still holds. A profile file is still a file. A command line argument or an environment variable for the same key beats it.

## 06 One file instead: multi-document YAML
Some teams prefer one file. YAML lets you split a file into documents with three dashes. A document can say when it applies, with spring dot config dot activate dot on profile.
```
---
spring:
  config:
    activate:
      on-profile: "prod | staging"
app:
  signup:
    daily-limit: 1000
```
This document only counts when prod or staging is active. That vertical bar means or. Later documents override earlier ones. It's the same result as separate files, so pick whichever your team finds easier to read.

## 07 Beans per profile with `@Profile`
Profiles can switch whole beans, not just values. Our app has one welcome notifier interface, and two implementations.
```
@Component
@Profile("!prod")
public class LogWelcomeNotifier implements WelcomeNotifier {
```
The exclamation mark means not. So this one exists everywhere except prod, and it only logs. The mail version has at Profile prod. Exactly one of them is created, so any class that needs a notifier always gets one, without a single if statement. Profile expressions also support and, and or. You can put at Profile on a component, a configuration class, or a single bean method. The profile endpoint shows which one won: the log notifier in dev, the mail one in prod.

## 08 The test profile
Tests often want their own settings. Put application dash test dot YAML in source test resources, so it only exists when tests run. Then activate it with at Active Profiles.
```
@SpringBootTest
@ActiveProfiles("test")
class TestProfileTest {
```
Our test file sets the limit to three, and the test checks exactly that. You can use the same annotation to start a test with dev, or prod. That's how the companion repository tests every claim in this video.

## 09 Secrets stay out of the files
Production has a mail password. It's tempting to write it into application dash prod dot YAML. Don't. That file is committed, and anyone with the repository can read it. Spring Boot doesn't encrypt property values either. So our prod file names the mail server and the user, and stops there. The password binds to a record that only exists in prod, and it's marked at Not Blank. Start prod without it, and the app refuses to start: app dot mail dot password, must not be blank. Now set the environment variable app underscore mail underscore password, and it starts. On Kubernetes, you can also mount secrets as files and import them with a config tree. For a real secret store, look at Spring Cloud Vault.

## 10 A little SpEL
Now, SpEL, the Spring Expression Language. You've already seen dollar brace in at Value. That's a property placeholder. It looks a key up, and after a colon you can give a default. Hash brace is different. It's an expression, and Spring evaluates it.
```
@Value("#{${app.signup.daily-limit} * 8 / 10}") int warnAt
```
The placeholder inside is resolved first, then the expression does the math. We want a warning at eighty percent of the daily limit. That's eighty without a profile, four in dev, and eight hundred in prod, always in step with the limit. That small calculation is the useful part. At Configuration Properties doesn't evaluate SpEL, so keep expressions short, and keep real logic in Java, where you can test it.

## 11 Recap
Let's recap. A profile is a named set of settings and beans. Application dash profile dot YAML holds only the differences, merged on top of the plain file. Switch profiles on with spring dot profiles dot active, usually from the environment. No profile means the default profile, and with several, the last one wins. At Profile swaps beans, and at Active Profiles sets them in tests. Secrets come from the environment, never from a committed file. And dollar brace looks a value up, while hash brace calculates. That completes the configuration module. Next, we look inside the container itself. The code is linked in the description.
