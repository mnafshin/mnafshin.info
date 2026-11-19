---
title: 'The relational model and the SQL a backend developer actually writes'
description: 'A relational database stores facts in tables, linked by shared ids. We build the shop used across this channel, then write the queries a backend developer needs most: joins, aggregates and subqueries.'
pubDate: '2026-11-19T14:05:00+01:00'
section: db
topic: relational-model-and-sql
draft: false
---

A relational database stores facts in **tables**. Each table describes one kind of thing, each **row** is one fact about one of those things, and each **column** is one property of it. A row in `orders` says "order 3 was placed by customer 2 and is paid". Tables are linked by shared values: an order row holds the id of its customer, and that id is the **relationship** between the two. (Strictly, *relation* is the mathematical name for the table itself, which is where "relational" comes from.) SQL is the language you use to ask questions across those links.

Below we build the shop used across this channel, then write the queries a backend developer needs most.

## The online shop we will use in every article

Our shop has six tables (a `sku` is a product's stock code):

```text
customers   (customer_id, email, full_name, country_code, created_at)
products    (product_id, sku, name, category, price)
inventory   (product_id, quantity_on_hand)
orders      (order_id, customer_id, status, placed_at)
order_items (order_id, product_id, quantity, unit_price)
payments    (payment_id, order_id, amount, method, paid_at)
```

`orders.customer_id` points to a customer, and each `order_items` row points to one order and one product. One order has many items; one product appears in many orders.

The sample data is tiny on purpose: four customers (Jonas has no orders yet), five products (nobody has bought the coffee grinder), and five orders with different statuses. Keys, constraints and `CREATE TABLE` come in the next article.

## Reading one table: SELECT, WHERE and ORDER BY

A query names the columns you want (`SELECT`), the table they come from (`FROM`), which rows to keep (`WHERE`), and how to sort them (`ORDER BY`):

```sql
SELECT name, price
FROM products
WHERE category = 'tea'
ORDER BY price;
```

```text
      name      | price
----------------+-------
 Black tea 100g |  7.00
 Green tea 100g |  8.50
```

Two habits to build now. List the columns you need instead of `SELECT *`, so your code doesn't change when someone adds a column. And never trust row order without `ORDER BY`; it can change at any time.

## Combining tables with an inner join

Orders store a `customer_id`, but people want to see names. A **join** pairs rows from two tables using a condition, usually "this id equals that id":

```sql
SELECT o.order_id, c.full_name, o.status
FROM orders AS o
JOIN customers AS c ON c.customer_id = o.customer_id
WHERE o.status <> 'cancelled'
ORDER BY o.order_id;
```

```text
 order_id |  full_name   | status
----------+--------------+---------
        1 | Lena Fischer | paid
        2 | Lena Fischer | shipped
        3 | Omar Haddad  | paid
        5 | Omar Haddad  | pending
```

`o` and `c` are **aliases**, short nicknames for the tables. Prefixing columns with them keeps the query clear, and safe if both tables later share a column name.

A plain `JOIN` is an **inner join**: it keeps only the pairs that match. A customer with no orders simply does not appear.

## Keeping unmatched rows with a left join

Suppose the admin page lists every customer with their number of orders. Jonas has none, so an inner join would quietly drop him. A **left join** keeps every row from the left table (the one in `FROM`) and fills the right side with `NULL`, SQL's marker for "no value", when nothing matches:

```sql
SELECT c.full_name, count(o.order_id) AS order_count
FROM customers AS c
LEFT JOIN orders AS o ON o.customer_id = c.customer_id
GROUP BY c.customer_id
ORDER BY order_count DESC, c.full_name;
```

```text
  full_name   | order_count
--------------+-------------
 Lena Fischer |           2
 Omar Haddad  |           2
 Sara Rossi   |           1
 Jonas Berg   |           0
```

Notice `count(o.order_id)`, not `count(*)`. `count(*)` counts rows, and Jonas still has one row, full of `NULL`s, so he would show 1. `count(column)` skips `NULL`s and gives the honest 0.

A second trap: if you want "every customer, with their *paid* orders", the filter on the right table must go in `ON`, not `WHERE`:

```sql
SELECT c.full_name, o.order_id
FROM customers AS c
LEFT JOIN orders AS o ON o.customer_id = c.customer_id
                     AND o.status = 'paid'
ORDER BY c.full_name;
```

```text
  full_name   | order_id
--------------+----------
 Jonas Berg   |
 Lena Fischer |        1
 Omar Haddad  |        3
 Sara Rossi   |
```

Move `o.status = 'paid'` into `WHERE` and Jonas and Sara vanish: `WHERE` runs after the join, their `NULL` rows fail the test, and the left join has silently become an inner join.

You will also see `RIGHT JOIN`, which is a left join with the tables swapped, and `FULL JOIN`, which keeps unmatched rows from both sides. Backend code rarely needs either.

## Summarizing with GROUP BY, aggregates and HAVING

An **aggregate** function such as `count`, `sum`, `avg`, `min` or `max` turns many rows into one value. `GROUP BY` decides which rows go together. Here is revenue per category from orders that were really paid for:

```sql
SELECT p.category,
       sum(oi.quantity * oi.unit_price) AS revenue
FROM order_items AS oi
JOIN orders   AS o ON o.order_id   = oi.order_id
JOIN products AS p ON p.product_id = oi.product_id
WHERE o.status IN ('paid', 'shipped')
GROUP BY p.category
HAVING sum(oi.quantity * oi.unit_price) > 50
ORDER BY revenue DESC;
```

```text
 category | revenue
----------+---------
 kitchen  |   63.90
```

Conceptually, the clauses run in a fixed order, and once you see it, the rules make sense:

1. `FROM` and the joins build the rows.
2. `WHERE` drops single rows.
3. `GROUP BY` forms groups, and the aggregates are computed.
4. `HAVING` drops whole groups.
5. `SELECT` and `ORDER BY` shape the output.

That is why `sum(...)` can't go in `WHERE`: the sums don't exist yet. Without the `HAVING` line, tea would appear too, with 48.00.

One more rule: every selected column must be grouped or aggregated. In the left join example we selected `c.full_name` but grouped by `c.customer_id`. PostgreSQL allows that because `customer_id` is the **primary key**, the column that identifies each customer uniquely, so each group has exactly one name.

## Subqueries and joins: two ways to ask the same question

A **subquery** is a query inside another query. It often reads closer to the question in your head. "Which products has nobody ordered?":

```sql
SELECT name
FROM products AS p
WHERE NOT EXISTS (
    SELECT 1 FROM order_items AS oi
    WHERE oi.product_id = p.product_id
);
```

The same answer, the coffee grinder, comes from a left join that keeps only unmatched rows:

```sql
SELECT p.name
FROM products AS p
LEFT JOIN order_items AS oi ON oi.product_id = p.product_id
WHERE oi.product_id IS NULL;
```

The choice is about what you want back:

- Use a **join** when you need columns from the other table.
- Use **`EXISTS`**, **`NOT EXISTS`** or **`IN`** when the other table only answers yes or no. A join repeats a row once per match: joined to her orders, Lena appears twice.
- For "not in the other table", prefer `NOT EXISTS` to `NOT IN`. If the subquery returns even one `NULL`, `NOT IN` returns no rows at all.

Speed is rarely the deciding factor: PostgreSQL usually runs both styles the same way, as we will see with `EXPLAIN` later this season.

An ORM writes this SQL for you, but reading it is still your job. How Hibernate and JPA turn entities into joins is covered on the SpringUniverse channel.

## Recap

- A table holds one kind of fact; rows are facts, columns are properties, and shared ids are the relationships.
- An inner join keeps only matching pairs; a left join keeps every left row and fills the gaps with `NULL`.
- With a left join, count a right-side column, and put filters on the right table in `ON`, not `WHERE`.
- `WHERE` filters rows before grouping; `HAVING` filters groups after aggregates are computed.
- Use a join when you need the other table's columns, and `EXISTS` / `NOT EXISTS` when you only need a yes or no.

## Sources

- PostgreSQL 18 documentation: [Joins Between Tables](https://www.postgresql.org/docs/current/tutorial-join.html), [Aggregate Functions](https://www.postgresql.org/docs/current/tutorial-agg.html), [Table Expressions](https://www.postgresql.org/docs/current/queries-table-expressions.html), [Subquery Expressions](https://www.postgresql.org/docs/current/functions-subquery.html)
- Neon PostgreSQL Tutorial: [PostgreSQL Joins](https://neon.com/postgresql/postgresql-tutorial/postgresql-joins)
- Mode SQL Tutorial: [SQL Joins](https://mode.com/sql-tutorial/sql-joins)
- SQLBolt: [Queries with aggregates](https://sqlbolt.com/lesson/select_queries_with_aggregates)
