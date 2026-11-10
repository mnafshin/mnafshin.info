---
title: 'Spring Framework 7 API Versioning: Keep Old Callers, Add a New Response'
description: We want an API that returns the shop's drinks. Our current list has Tea and Coffee. The agreed response is a list of drinks that callers already agreed to.
youtubeId: d3fzHUy9rsA
pubDate: '2026-11-11T12:00:00Z'
series: tutorials
seriesLabel: T6.3
order: 190
draft: true
---

## 00 The drinks
We want an API that returns the shop's drinks.
Our current list has Tea and Coffee.
The agreed response is a list of drinks that callers already agreed to.
Each drink has an id, a name, and a price.

## 01 The new response
A new response should also say whether each drink is in stock.
Coffee is in stock.
Tea is not in stock.
Old callers keep the list they agreed to.
New callers get the same drinks, plus inStock.
An extra field would not always break a client, but we keep the old response because that was the agreement.

## 02 Before Framework 7
An API version is the value that chooses which response you get.
Previously we solved this with slash v one slash products and slash v two slash products.
Two controller classes do that, one class for each path, in two version packages, in one application.
A package here is a group of classes.
A header is a name and a value sent beside the path.
No version header is required in the previous approach.
We run GET slash v one slash products, and the old list comes back.
We run GET slash v two slash products, and the stock list comes back.
The path chooses.
We run GET slash products with no version, and the status is four oh four.
We run GET slash v three slash products, and the status is four oh four too.
Path versioning is still a valid way to ship both responses.

## 03 Framework 7
Those four calls stay on the path application.
We move forward to a second application on Spring Framework seven.
The same problem has a built-in answer there.
We keep one products path.
The framework can read a version from a header, a path, or a media type.
A media type is the label that names the kind of body.
This demo uses a header.
First the setting: spring dot MVC dot API version dot use dot header.
It names the header API-Version.
The first method is marked version one.
The second method is marked version two.
The methods declare which versions are supported.
A missing or unsupported version is four hundred under this configuration.

## 04 Requests under this configuration
This app requires a version; not every Spring app does.
We run GET slash products with API-Version one, and the old list comes back.
We run GET slash products with API-Version two, and the stock list comes back.
We omit the header, and the status is four hundred.
We send an unmapped version, one this app does not declare, three, and the status is four hundred too.

## 05 Recap
Before Framework seven, the path chose the list.
Framework seven, in this demo, uses one path and the API-Version header.
Version one is the old list.
Version two adds stock.
Under this configuration, an omitted header is four hundred.
An unmapped version is four hundred too.
The header chooses the old list or the stock list.

## 06 The choice
For an app already on Framework seven, native versioning is a sensible choice when that app needs versions.
That is our guidance for this case, not a demand to migrate an API that already works.
The framework can match, parse, and validate the version, then choose the method.
Where the client sends the version is a separate choice.
Native versioning can use a path as well as a header.
The class paths we showed were declarations too.
A declaration here is a mapping we wrote down.
A public link, or a simple browser call, can keep the version in the path.
A team that controls its clients, and wants one products address, can use the header.
With a header, the clients, the tools, and any cache must tell the versions apart.
A cache keeps a result in memory, so the next time you ask for it, the work is skipped.
We do not claim that a cache tells the versions apart on its own.
Neither choice wins for every team.
Choose for the callers, the operations, and the old agreement.
