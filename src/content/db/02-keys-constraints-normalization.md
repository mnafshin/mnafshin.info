---
title: 'Keys, constraints and normalization'
description: 'Primary and foreign keys, NOT NULL, UNIQUE and CHECK, and normalization so that every fact is stored once. We continue with the online shop from the previous article.'
summary: "Primary and foreign keys, plus NOT NULL, UNIQUE and CHECK, keep rows valid, and normalization stores each fact once. The article continues with the online shop from the previous piece."
pubDate: '2026-11-19T14:05:01+01:00'
section: db
topic: keys-constraints-normalization
draft: false
---

A **constraint** is a rule about your data that the database checks on every insert and update, and refuses to break. Keys are the most important constraints: a **primary key** gives each row an identity, and a **foreign key** makes sure a reference points at a row that really exists. **Normalization** is the design habit that decides which table each fact lives in, so that every fact is stored once. Together they make bad data hard to write. We continue with the online shop from the previous article.

## Primary keys: natural or surrogate

A primary key is a column, or group of columns, that is unique and never empty. Here is `customers`:

```sql
CREATE TABLE customers (
    customer_id  bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    email        text NOT NULL UNIQUE,
    full_name    text NOT NULL,
    country_code char(2) NOT NULL,
    created_at   timestamptz NOT NULL DEFAULT now()
);
```

A **natural key** already means something in the real world, like an email or a product SKU. A **surrogate key** is a meaningless number the database hands out, like `customer_id`. `GENERATED ALWAYS AS IDENTITY` makes PostgreSQL number new rows itself, replacing the older `serial`.

We use a surrogate as the primary key and keep the natural value as `UNIQUE`, because natural values change. If email were the key, a customer changing their email would mean updating every order that points at it. A surrogate never changes.

Sometimes the natural key is right. An order contains each product at most once, so `order_items` uses the pair `(order_id, product_id)` as a **composite key**, a key made of two columns. One small surprise: identity numbers can have gaps, because a failed insert still uses up a number.

## Foreign keys keep references honest

A **foreign key** says "this column must match a key in another table":

```sql
CREATE TABLE orders (
    order_id    bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    customer_id bigint NOT NULL REFERENCES customers,
    status      text NOT NULL DEFAULT 'pending'
                CHECK (status IN ('pending', 'paid', 'shipped', 'cancelled')),
    placed_at   timestamptz NOT NULL DEFAULT now()
);
```

An order for a customer who doesn't exist is rejected:

```sql
INSERT INTO orders (customer_id) VALUES (99);
-- ERROR:  insert or update on table "orders" violates foreign key
--         constraint "orders_customer_id_fkey"
```

It works in reverse too: deleting Sara, who has an order, fails. `ON DELETE` chooses what happens instead. The default refuses, which is right for customers, since losing order history is worse than an error. For `order_items` we wrote `REFERENCES orders ON DELETE CASCADE`: an item means nothing without its order, so it goes with it. PostgreSQL does not automatically index the pointing column, `orders.customer_id`; the next article does.

## NOT NULL, UNIQUE and CHECK

Three more cover most everyday rules:

- **`NOT NULL`**: the column must have a value. Allow `NULL` only when "unknown" is a real state.
- **`UNIQUE`**: no two rows may share the value, like `email` or `sku`.
- **`CHECK`**: a true-or-false condition on the row, like `quantity > 0` or the allowed statuses above.

```sql
INSERT INTO order_items (order_id, product_id, quantity, unit_price)
VALUES (5, 3, 0, 8.50);
-- ERROR:  new row for relation "order_items" violates
--         check constraint "order_items_quantity_check"
```

Two details catch people out. A `CHECK` passes when its condition is `NULL`, so `CHECK (price >= 0)` alone still allows a missing price; pair it with `NOT NULL`. And `UNIQUE` compares values exactly, so `Lena@Example.com` and `lena@example.com` are different emails. Store emails in lower case, or enforce uniqueness on `lower(email)` with an index (next article).

## Why the rules belong in the database

Your application should check these rules too, for friendly messages. But only the database sees every write: your API, an admin script, a data migration, and next year's second service.

It is also the only place that stays correct when requests arrive together. Two sign-ups with the same email both ask "is this email taken?", both hear "no", and both insert. Only `UNIQUE` stops the second one. Season 2 covers races like this.

When a constraint fires, PostgreSQL reports a standard error code (SQLSTATE): `23505` for unique, `23503` for foreign key, `23514` for check and `23502` for not-null. Map them to clear responses, like HTTP 409 Conflict for a duplicate email. Hibernate and JPA validation, covered on the SpringUniverse channel, is a useful first line, not a replacement.

## Normalization: one fact, one place

Imagine the shop started as a spreadsheet:

```text
order_id | placed_at  | customer_email   | customer_name | items
1        | 2026-05-04 | lena@example.com | Lena Fischer  | 2x MUG-01 Ceramic mug, 1x TEA-01 Green tea
```

The **normal forms** take this apart in three steps.

**First normal form (1NF): one value per cell.** The `items` cell holds a list, so you can't easily query "who bought green tea?". Give each item its own row with `sku`, `product_name`, `quantity` and `unit_price`. The key becomes `(order_id, sku)`.

**Second normal form (2NF): every column depends on the whole key.** `product_name` depends only on `sku`, and `placed_at` only on `order_id`, not on the pair. So a product's name repeats on every order line, and renaming it means editing many rows. Move product facts to `products` and order facts to `orders`. What stays in `order_items` really depends on both: `quantity` and `unit_price`.

**Third normal form (3NF): non-key columns depend only on the key.** `orders` now holds `customer_name`, which depends on `customer_email`, not on the order. Move customer facts to `customers` and keep only `customer_id` in `orders`.

Bill Kent's classic 1983 summary: every column depends on "the key, the whole key, and nothing but the key". The result is exactly our shop schema.

## When denormalizing is reasonable

**Denormalizing** means storing a fact in a second place on purpose. First, a look-alike: `order_items.unit_price` seems to repeat `products.price`, yet it is a different fact: the price *when the order was placed*, which must not change when the price does. Snapshots like this are correct design, not denormalization.

Real denormalization buys speed; do it only after measuring a slow, frequent read. Keep one source of truth and make the copy rebuildable. A **materialized view**, a query whose result PostgreSQL stores as a table, is the easiest way:

```sql
CREATE MATERIALIZED VIEW customer_order_totals AS
SELECT o.customer_id,
       count(DISTINCT o.order_id) AS paid_orders,
       sum(p.amount)              AS total_paid
FROM orders AS o
JOIN payments AS p ON p.order_id = o.order_id
GROUP BY o.customer_id;

REFRESH MATERIALIZED VIEW customer_order_totals;
```

The cost is freshness: the view is only as current as its last refresh.

## Recap

- Use a surrogate primary key, and keep natural values like email and SKU as `UNIQUE`.
- Foreign keys stop references to missing rows; choose `ON DELETE` deliberately, and cascade only for parts of a whole.
- `NOT NULL`, `UNIQUE` and `CHECK` belong in the database, because it sees every write and handles simultaneous requests.
- 1NF to 3NF in one line: one value per cell, and every column depends on the key, the whole key, and nothing but the key.
- A snapshot like `unit_price` is a separate fact, not a duplicate; denormalize for speed only after measuring, with one source of truth.

## Sources

- PostgreSQL 18 documentation: [Constraints](https://www.postgresql.org/docs/current/ddl-constraints.html), [Identity Columns](https://www.postgresql.org/docs/current/ddl-identity-columns.html), [Materialized Views](https://www.postgresql.org/docs/current/rules-materializedviews.html), [Error Codes](https://www.postgresql.org/docs/current/errcodes-appendix.html)
- PostgreSQL Wiki: [Don't Do This: Don't use serial](https://wiki.postgresql.org/wiki/Don%27t_Do_This#Don%27t_use_serial)
- freeCodeCamp: [Database Normalization – Normal Forms 1NF 2NF 3NF Table Examples](https://www.freecodecamp.org/news/database-normalization-1nf-2nf-3nf-table-examples/)
- Microsoft Learn: [Database normalization description](https://learn.microsoft.com/en-us/office/troubleshoot/access/database-normalization-description)
- Neon PostgreSQL Tutorial: [PostgreSQL Foreign Key](https://neon.com/postgresql/postgresql-tutorial/postgresql-foreign-key)
- William Kent, [A Simple Guide to Five Normal Forms in Relational Database Theory](https://www.bkent.net/Doc/simple5.htm) (1983)
