---
title: 'Spring Boot Configuration: application.yml, @ConfigurationProperties, Profiles and a Little SpEL'
description: How one Spring Boot jar runs with different settings on a laptop, in tests and in production. Properties live outside the code, sources override each other in a fixed order, and profiles switch values and beans.
pubDate: '2026-10-25T10:30:30Z'
section: spring
topic: configuration
relatedVideos:
  - id: T3.1
    title: 'Spring Boot 4 Configuration: application.yml, Property Precedence and @ConfigurationProperties'
    youtubeId: tn6wQ83HbXQ
    pubDate: '2026-10-25T10:30:30Z'
  - id: T3.2
    title: Spring Boot 4 Profiles for dev, test and prod, plus a Little SpEL
    youtubeId: Gdzp28_5FaQ
    pubDate: '2026-10-26T12:00:20Z'
relatedShorts:
  - title: 'Stop using @Value everywhere #springboot'
    youtubeId: tHTlx-TIxcM
  - title: 'Which Spring Boot property wins? #springboot'
    youtubeId: UV80e-_Iijk
  - title: 'Any Spring property as an environment variable #springboot'
    youtubeId: VNjNq2-m0jQ
  - title: 'Bad config? Make Spring Boot refuse to start #springboot'
    youtubeId: HbcAe-CKfM8
codeUrl: https://github.com/mnafshin/springuniverse-code/tree/main/module-03-configuration
draft: false
---

Spring Boot keeps configuration outside the code. The code says which settings it needs, and the values come from files, environment variables or the command line. That way one jar can run with a small signup limit on a laptop and a large one in production, without a new build.

## Settings live in application.yml

The usual home for settings is `src/main/resources/application.yml` (or `application.properties`). Our signup example keeps three settings under one prefix:

```yaml
app:
  signup:
    welcome-message: "Welcome"
    daily-limit: 100
    link-expiry: 30m
```

[application.yml](https://github.com/mnafshin/springuniverse-code/blob/main/module-03-configuration/src/main/resources/application.yml)

Boot flattens the nesting into keys such as `app.signup.daily-limit`. Write keys in kebab case, as the docs recommend.

## Bind a group of settings to a record

`@Value("${app.signup.daily-limit}")` reads one value, and it works. But the key is a string repeated in every class that needs it, nothing groups related settings, and nothing checks them.

For your own settings, bind the whole group to one record:

```java
@Validated
@ConfigurationProperties("app.signup")
public record SignupProperties(
        @NotBlank String welcomeMessage,
        @Min(1) int dailyLimit,
        @DefaultValue("30m") Duration linkExpiry) {
}
```

[SignupProperties.java](https://github.com/mnafshin/springuniverse-code/blob/main/module-03-configuration/src/main/java/info/mnafshin/springuniverse/config/SignupProperties.java)

`daily-limit` binds to `dailyLimit` (relaxed binding), and `30m` becomes a real `Duration`. With `@ConfigurationPropertiesScan` on the application class, the record is a bean any class can ask for in its constructor.

The constraints come from the validation starter. A daily limit of 0 now stops the app at startup, with a message naming the property, its value, where it came from and the rule it broke. A bad setting fails at startup, not on the first request in production.

## Which property source wins

Boot reads many property sources, and a stronger source overrides a weaker one, key by key. The ones you meet most, weakest first:

1. `application.yml` inside the jar
2. `application.yml` next to the jar or in a `config` folder
3. environment variables
4. Java system properties (`-D`)
5. command-line arguments

So the same jar gives a limit of 100 from its file, 50 with an environment variable, and 10 with `--app.signup.daily-limit=10`. The [Externalized Configuration](https://docs.spring.io/spring-boot/reference/features/external-config.html) page lists every source.

Environment variable names follow one rule: dots become underscores, dashes disappear, letters are capitals. `app.signup.daily-limit` becomes `APP_SIGNUP_DAILYLIMIT`. That is how containers pass settings in.

## Profiles hold only the differences

A profile is a name such as `dev`, `test` or `prod`. Next to `application.yml`, a profile file holds only what changes:

```yaml
app:
  signup:
    welcome-message: "Welcome, developer"
    daily-limit: 5
```

[application-dev.yml](https://github.com/mnafshin/springuniverse-code/blob/main/module-03-configuration/src/main/resources/application-dev.yml)

Activate it with `--spring.profiles.active=dev`, or `SPRING_PROFILES_ACTIVE=dev` in the environment. Boot loads the normal file, then the profile file on top; `link-expiry` still comes from `application.yml`.

With no active profile, Boot uses the `default` profile. With several, the one listed last wins a conflict. A profile file is still a file, so an environment variable or command-line argument for the same key beats it.

## Profiles can switch beans

Profiles also decide which beans exist. The notifier that only logs is marked like this:

```java
@Component
@Profile("!prod")
public class LogWelcomeNotifier implements WelcomeNotifier {
```

[LogWelcomeNotifier.java](https://github.com/mnafshin/springuniverse-code/blob/main/module-03-configuration/src/main/java/info/mnafshin/springuniverse/config/LogWelcomeNotifier.java)

The mail notifier carries `@Profile("prod")`, so exactly one notifier exists in every environment, with no `if` in the code. Tests get `application-test.yml` in `src/test/resources` and `@ActiveProfiles("test")`.

## Secrets stay out of the files

Profile files are committed, and Spring Boot does not encrypt property values, so secrets do not belong in them. The prod mail password binds to a record field marked `@NotBlank`. Prod without `APP_MAIL_PASSWORD` in the environment refuses to start.

## A little SpEL

`${...}` looks a property up. `#{...}` is a Spring Expression Language (SpEL) expression that Spring evaluates. Look at how the two combine:

```java
public SignupLimits(@Value("#{${app.signup.daily-limit} * 8 / 10}") int warnAt,
                    @Value("${app.signup.support-email:support@example.com}") String supportEmail) {
```

[SignupLimits.java](https://github.com/mnafshin/springuniverse-code/blob/main/module-03-configuration/src/main/java/info/mnafshin/springuniverse/config/SignupLimits.java)

The placeholder resolves first, then the expression computes a warning at 80% of the limit: 80 with no profile, 4 in dev, always in step with the limit. The second parameter is a plain placeholder with a default after the colon, used because no file sets that key.

`@ConfigurationProperties` does not evaluate SpEL. Keep expressions this small, and keep real logic in Java, where you can test it.

## Recap

- Keep settings outside the code. Bind a group of keys to a `@ConfigurationProperties` record and validate it at startup.
- Stronger sources override weaker ones, key by key; environment variables and command-line arguments beat files.
- Profile files hold only what changes, and `@Profile` switches beans with no `if` in the code.
- Keep secrets out of committed files; Spring Boot does not encrypt property values.
- Use SpEL sparingly. `@ConfigurationProperties` does not evaluate it.

## Sources

Official documentation and well-known tutorials read while writing this article. The wording here is our own.

- [Spring Boot reference: Externalized Configuration](https://docs.spring.io/spring-boot/reference/features/external-config.html)
- [Spring Boot reference: Profiles](https://docs.spring.io/spring-boot/reference/features/profiles.html)
- [Spring Framework reference: Spring Expression Language (SpEL)](https://docs.spring.io/spring-framework/reference/core/expressions.html)
- [Baeldung: Guide to @ConfigurationProperties in Spring Boot](https://www.baeldung.com/configuration-properties-in-spring-boot)
- [Reflectoring: Configuring a Spring Boot Module with @ConfigurationProperties](https://reflectoring.io/spring-boot-configuration-properties/)
- [Baeldung: Spring Profiles](https://www.baeldung.com/spring-profiles)
