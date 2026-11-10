---
title: 'Spring Boot 4 Configuration: application.yml, Property Precedence and @ConfigurationProperties'
description: Here's one jar file. I start it three times, and without recompiling anything, the daily limit changes from a hundred, to fifty, to ten. The first value comes from application dot YAML.
youtubeId: tn6wQ83HbXQ
pubDate: '2026-10-25T10:30:30Z'
series: tutorials
seriesLabel: T3.1
order: 60
codeUrl: https://github.com/mnafshin/springuniverse-code/tree/main/module-03-configuration
shorts:
- title: 'Stop using @Value everywhere #springboot'
  youtubeId: tHTlx-TIxcM
- title: 'Which Spring Boot property wins? #springboot'
  youtubeId: UV80e-_Iijk
- title: 'Any Spring property as an environment variable #springboot'
  youtubeId: VNjNq2-m0jQ
- title: 'Bad config? Make Spring Boot refuse to start #springboot'
  youtubeId: HbcAe-CKfM8
---

## 00 Cold open
Here's one jar file. I start it three times, and without recompiling anything, the daily limit changes from a hundred, to fifty, to ten. The first value comes from application dot YAML. The second comes from an environment variable. The third comes from the command line. In this video, you'll learn where Spring Boot looks for settings, which source wins when they disagree, and how to bind them into one type safe record that is checked at startup. We'll also compare it with at Value, and see why the Spring Boot docs recommend grouping your settings instead.

## 01 Settings live outside the code
Our signup app has a few settings. A welcome message, a daily signup limit, and how long a confirmation link stays valid. We could hard code them as constants. But then every change needs a new build, and the same jar can't run with a small limit on your laptop and a large one in production. So Spring Boot externalizes configuration. The code says which settings it needs. The values come from outside: files, environment variables, or command line arguments. The jar stays the same everywhere.

## 02 `application.yml`
The most common place is a file in source main resources. Spring Boot reads application dot properties, or application dot YAML. Here's ours in YAML.
```
app:
  signup:
    daily-limit: 100
```
YAML nests keys by indentation. Spring Boot flattens them into the same dotted keys you'd write in a properties file: app dot signup dot daily dash limit. Pick one format per project. If both files sit in the same place, the properties file wins. And write keys in kebab case: lowercase words joined by dashes. That's the format the docs recommend.

## 03 One value with `@Value`
How does the code read a value? The quickest way is at Value, with the key inside a placeholder.
```
@Value("${app.signup.daily-limit}") int dailyLimit
```
It works, and Spring converts the text to a number for you. But watch what happens as the app grows. The key is a string, repeated in every class that needs it. Nothing groups related settings together. There's no single place to see what the app expects, and nothing checks the values. For your own settings, the Spring Boot docs recommend a better tool.

## 04 A record with `@ConfigurationProperties`
Declare one record for the whole group, and annotate it with at Configuration Properties, plus the prefix app dot signup.
```
@ConfigurationProperties("app.signup")
public record SignupProperties(String welcomeMessage, int dailyLimit, Duration linkExpiry) { }
```
Each component maps to one key under the prefix. Daily dash limit in the file binds to daily limit in camel case. That's called relaxed binding. The link expiry is a real Duration, and the file just says thirty m, for thirty minutes. A record has one constructor, so Spring Boot uses constructor binding. There are no setters, and the values can't change after startup. One more step: Spring Boot has to find the record. We add at Configuration Properties Scan to the application class.

## 05 Use it like any bean
Now the record is a bean. Any class can ask for it in its constructor, just like the dependencies from the last module.
```
public SignupService(SignupProperties props) {
```
Let's start the app, and call a small settings endpoint that returns the record. The welcome message, a hundred, and thirty minutes, which JSON shows in ISO format. Every value came from the YAML file, already converted to the right type.

## 06 Defaults and validation
A record gives you two more things. First, defaults. Put at Default Value on a component, and it's used when the key is missing.
```
@DefaultValue("30m") Duration linkExpiry
```
Second, validation. Add at Validated to the record, and constraints like at Not Blank and at Min one to its components. This needs the validation starter on the classpath. Now start the app with a daily limit of zero. It refuses to start. The message names the property, the value, where it came from, and the reason: must be greater than or equal to one. A bad setting fails at startup, not on the first request in production.

## 07 Where values come from
So far, every value came from one file. But Spring Boot reads many property sources, in a fixed order, and a later source overrides an earlier one. Here are the ones you'll use most, from weakest to strongest. Application dot YAML inside the jar. Then an application dot YAML outside the jar, next to it or in a config folder. Then operating system environment variables. Then Java system properties, set with dash D. And then command line arguments, which always beat files. In tests, test properties sit even higher. Keys you don't override still come from the file below, because sources merge key by key. Profile specific files are the next video.

## 08 Which one wins, live
Let's prove it with the real jar. First, plain java dash jar. The settings endpoint says a daily limit of a hundred, from the file. Now set the environment variable for the same key to fifty. The limit is fifty, so the environment beat the file. Keep the variable, and also pass dash dash app dot signup dot daily dash limit equals ten on the command line. Ten. The command line wins. And if you drop an application dot YAML with two hundred next to the jar, it overrides the packaged one without a rebuild. That's how one artifact runs everywhere.

## 09 Environment variable names
But how did fifty find the right key? Most systems don't allow dots or dashes in environment variable names. So Spring Boot uses a simple rule. Replace each dot with an underscore. Remove the dashes. Make it uppercase. App dot signup dot daily dash limit becomes app underscore signup underscore daily limit, all in capitals. This is also how containers and cloud platforms pass settings into your app. And it's the right home for secrets. A password doesn't belong in a file you commit. Read it from the environment instead.

## 10 Recap
Let's recap. Keep settings outside the code, so one jar runs everywhere. Write them in application dot YAML, with kebab case keys. For your own settings, group them in a record with at Configuration Properties: typed, with defaults, and validated at startup. When sources disagree, the later one wins: the file, then the environment, then system properties, then the command line. And an environment variable name is the key in capitals, with underscores and no dashes. Next time: profiles, one app with different settings for each environment. The code is linked in the description.
