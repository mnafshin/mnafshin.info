---
title: 'Reading a Database with JdbcClient and Flyway'
description: 'How Flyway creates and fills a products table from one numbered SQL file when the app starts, and how JdbcClient, which Spring Boot builds for you, maps those rows to records: a list with list(), and one product with param() and optional().'
summary: "Flyway creates and fills a products table from one numbered SQL file when the app starts. JdbcClient, which Spring Boot builds for you, then maps those rows to records."
pubDate: '2026-11-13T12:00:00Z'
section: spring
topic: jdbcclient
relatedVideos:
  - id: T8.1
    title: Read a database with JdbcClient in Spring Boot 4, with Flyway
    youtubeId: s0yKhf5Fur8
    pubDate: '2026-11-13T12:00:00Z'
relatedShorts: []
codeUrl: https://github.com/mnafshin/springuniverse-code/tree/main/module-08-shop
draft: false
---

When a catalog lives in a database, two jobs remain: create the tables, and read the rows with SQL. Flyway applies those table changes in version order when the application starts. `JdbcClient` is Spring's class for sending SQL and turning the rows into Java objects. Spring Boot builds a `JdbcClient` for you once a database is available.

## A numbered SQL file runs on startup

Our coffee shop still sells coffee and tea, but the catalog now lives in a database instead of a list in memory. The shop uses H2, a small database that runs inside the app. Spring Boot connects to it by itself, so this example sets no connection URL.

The database starts empty. It needs a `products` table, with coffee and tea already in it. Each change is a migration: a SQL file whose name carries its version. Flyway runs any that have not been applied yet, in order, and only once.

The file sits in the folder Flyway looks at by default, `db/migration`. Its name starts with `V1`, then two underscores, then a short description: `V1__create_products.sql`. `V1` means version 1. Inside, one statement creates the table, and two more insert the rows:

```sql
CREATE TABLE products (
    id   BIGINT PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

INSERT INTO products (id, name) VALUES (1, 'Coffee');
INSERT INTO products (id, name) VALUES (2, 'Tea');
```

[V1__create_products.sql](https://github.com/mnafshin/springuniverse-code/blob/main/module-08-shop/src/main/resources/db/migration/V1__create_products.sql)

This `Product` has an id and a name only; it has no price. When the shop starts, the log says Flyway is migrating to version 1, create products, and that the migration was applied successfully. Because this H2 database lives in memory, it starts empty on every start, and Flyway fills it again each time. The [Database Initialization](https://docs.spring.io/spring-boot/how-to/data-initialization.html) guide covers how Boot runs Flyway, and where to put later versions such as `V2__...`.

## Map rows to records with JdbcClient

Java still needs to read those rows. Spring Boot already built a `JdbcClient`, connected to our H2 database, so the catalog controller asks for one in its constructor and Spring passes it in.

`GET /catalog` calls `sql()` with plain SQL, then `query()` with the `Product` record class, then `list()`:

```java
CatalogController(JdbcClient jdbcClient) {
    this.jdbcClient = jdbcClient;
}

@GetMapping("/catalog")
List<Product> all() {
    return jdbcClient.sql("SELECT id, name FROM products ORDER BY id")
            .query(Product.class)
            .list();
}
```

[CatalogController.java](https://github.com/mnafshin/springuniverse-code/blob/main/module-08-shop/src/main/java/info/mnafshin/springuniverse/shop/CatalogController.java)

A record is a short Java class that holds a few values. For each row, `JdbcClient` makes one `Product`: the `id` column fills `id`, and the `name` column fills `name`. `GET /catalog` returns that list as JSON, 200 OK, with coffee as id 1 and tea as id 2: the rows from the SQL file.

The [SQL Databases](https://docs.spring.io/spring-boot/reference/data/sql.html) page explains that Boot auto-configures `JdbcClient` so you can inject it directly.

## One product, or 404

`GET /catalog/{id}` uses the same SQL, plus a filter: `WHERE id = :id`. `:id` is a named placeholder. It stands in for a value that `param("id", id)` supplies when the query runs, here the id from the URL.

This time the chain ends with `optional()` instead of `list()`. An `Optional` either holds one product or is empty. `ResponseEntity` holds the answer's body together with its status. `ResponseEntity.of` turns a present product into 200 with that product, and an empty `Optional` into 404 Not Found:

```java
@GetMapping("/catalog/{id}")
ResponseEntity<Product> one(@PathVariable Long id) {
    Optional<Product> product = jdbcClient.sql("SELECT id, name FROM products WHERE id = :id")
            .param("id", id)
            .query(Product.class)
            .optional();
    return ResponseEntity.of(product);
}
```

[CatalogController.java](https://github.com/mnafshin/springuniverse-code/blob/main/module-08-shop/src/main/java/info/mnafshin/springuniverse/shop/CatalogController.java)

`GET /catalog/1` answers 200 with coffee. `GET /catalog/99` answers 404: there is no row with that id.

If the SQL itself fails, Spring does not leave you with a raw database error. It translates the `SQLException` into a `DataAccessException` that names the problem more clearly. The [JDBC exception translation](https://docs.spring.io/spring-framework/reference/data-access/jdbc/core.html#jdbc-SQLExceptionTranslator) page covers how that works.

In a finished product, the controller usually would not talk to the database itself. This example keeps them together so the client is easy to see.

## Recap

- Put a numbered SQL file in `db/migration`, named like `V1__create_products.sql`. Flyway runs it when the app starts.
- Inject the `JdbcClient` Spring Boot builds. Call `sql()`, then `query(YourRecord.class)`, then `list()` to map each row to a record.
- For one row, add a named placeholder, fill it with `param()`, and end with `optional()`. `ResponseEntity.of` turns a product into 200 and an empty result into 404.
- If the SQL fails, Spring translates the database error into a `DataAccessException`.
- Keep the controller and the database together only while you learn the client. In a finished product, a layer usually sits between them.

## Sources

Official documentation and well-known tutorials read while writing this article. The wording here is our own.

- [Spring Boot reference: SQL Databases](https://docs.spring.io/spring-boot/reference/data/sql.html)
- [Spring Boot how-to: Database Initialization](https://docs.spring.io/spring-boot/how-to/data-initialization.html)
- [Spring Framework reference: JDBC core classes, including JdbcClient and SQLExceptionTranslator](https://docs.spring.io/spring-framework/reference/data-access/jdbc/core.html)
- [Dan Vega: A First Look at the new JDBC Client in Spring Boot 3.2](https://www.danvega.dev/blog/spring-jdbc-client)
- [Baeldung: A Guide to Spring JdbcClient API](https://www.baeldung.com/spring-6-jdbcclient-api)
- [Baeldung: Database Migrations with Flyway](https://www.baeldung.com/database-migrations-with-flyway)
