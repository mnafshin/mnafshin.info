---
title: Build a CRUD REST API with Spring Boot 4 (GET, POST, PUT, DELETE)
description: 'In this video, we build a small REST API for our shop''s products. Programs will read, add, change and remove products through URLs and HTTP methods: the action on each request. These are the CRUD actions: create, read, update and delete.'
youtubeId: QQxZaIkA5CQ
pubDate: '2026-11-06T12:00:01Z'
series: tutorials
seriesLabel: T6.1
order: 170
codeUrl: https://github.com/mnafshin/springuniverse-code/tree/main/module-06-products
---

## 00 The shop's product list
In this video, we build a small REST API for our shop's products. Programs will read, add, change and remove products through URLs and HTTP methods: the action on each request. These are the CRUD actions: create, read, update and delete. Here is the shop, with coffee and tea. When a program asks for slash products, the shop answers with JSON: text that groups values by name. Each product has an id, a name and a price. Each product is a record: a short Java class that just holds a few values. The list lives in memory, in a map inside the controller: the class that handles the requests. Restart the app, and our changes are gone. The first line of the answer says two hundred, OK. That's the status code: a number at the top of every answer that says how the request went. Right now, other programs can only read the whole list. We will add the other actions, with clear answers for each.

## 01 Read one product
Reading uses the GET method. To read one product, the program adds its id to the URL: slash products, slash one. In the controller, a new method takes the id from the path, and looks the product up in the map. If it's there, we answer with the product. If it's not, we answer with four oh four, Not Found. To choose the status code ourselves, the method returns a Response Entity: the answer's body together with its status. Ask for product one, and we get coffee, with two hundred. Ask for product ninety nine, and we get four oh four, and no body.

## 02 Add a product
To add a product, the program sends a POST to slash products, with the new product as JSON in the request body. It sends only a name and a price. The shop picks the id, so the request gets its own small record, without an id. At Request Body tells Spring to turn the JSON into that record. The new method reads that body, gives it the next id, and puts it in the map. Then it answers two oh one, Created, and a Location header with the new product's URL. We post cocoa. The answer is two oh one, and the location is slash products, slash three. Read the list again, and cocoa is there.

## 03 Change and remove
Changing a product uses PUT, on the product's own URL. The body sends both the name and price again, with the new values. If the id exists, we replace it and answer two hundred with the result. If not, four oh four. Removing uses DELETE, on the same URL. When it works, there's nothing left to send back, so the answer is two oh four, No Content. We change cocoa's price, and get two hundred with the new price. We delete it, and get two oh four. Ask for it again, and it's four oh four. The URL picks the product, and the method picks the action.

## 04 Turn away bad input
There's still a gap. A program can post a product with an empty name and a negative price, and the shop saves it as product four, with two oh one. Validation means checking the input before we use it. We add Spring Boot's validation starter, a bundle of libraries that checks the rules on our fields. In the request record, the name gets Not Blank, and the price gets Not Null and Positive, so it must be present and greater than zero. Then, in the controller, we put At Valid in front of the request body, for POST and PUT. We restart the app to load the change, so its in-memory list starts fresh. Now the same request gets four hundred, Bad Request, and our method never runs. The list stays clean.

## 05 Recap
Let's recap. A REST API lets programs work with products through URLs and HTTP methods. GET reads, POST adds, PUT changes, and DELETE removes. Every answer has a status code, and Response Entity lets us choose it. At Valid turns bad input away with four hundred, before our code runs. The code is linked below.
