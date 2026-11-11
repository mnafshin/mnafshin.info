---
title: 'Grounding and Citations: Did That AI Answer Come From Its Source?'
description: Grounding means tying an AI's answer to a real source so every claim can be traced back to it. Having the right page is not enough, a rule in the prompt cannot be trusted alone, and citations plus a check make the difference, though a grounded answer is only as good as its page.
pubDate: '2026-11-05T12:00:35Z'
section: terms
topic: grounding
relatedVideos:
  - id: Explainer
    title: 'Grounding and citations: did that AI answer come from its source?'
    youtubeId: dfbKevBE_cU
    pubDate: '2026-11-05T12:00:35Z'
relatedShorts: []
codeUrl: https://github.com/mnafshin/termsplained-demos/tree/main/016-grounding
draft: false
---

Grounding means tying an AI's answer to a real source, so every claim can be traced back to it. A citation is a pointer from a claim to the exact place in the source that supports it. Together they let you check whether an answer really came from the document it was given, which matters most in tools that already look things up and therefore look trustworthy.

## The right page, the wrong answer

The example is the help bot of a small bike shop, Northside Bikes. It already uses RAG: it looks up the right help page first, then answers from it. For returns, it finds a page with three sentences:

1. You can return a bike within 60 days of purchase.
2. Bring the receipt.
3. Used bikes can be returned too, if they are clean.

A customer asks: *Do I get my money back when I return a bike?* The search picks the returns page, the right page. The bot, a small open model run with randomness off, says: *Yes, you typically receive your full refund when returning a used bike.* The page never mentions money, refunds or store credit. That part is a hallucination, and it is hard to spot because the rest really is on the page. The bot had a source, but its answer was not tied to it.

## A rule in the prompt is not enough

The obvious fix is to tell the bot. A **system prompt** is the set of instructions an app gives the AI before your first message. The shop adds: use only facts from the help page, and if the page does not answer the question, say *The help page doesn't say. Please ask us in the shop.*

The answer: *Yes, you will receive your full refund when returning a bike.* Still yes, and without *typically* it sounds even more sure. Four different wordings of the rule all still said yes. A rule is a good start, but you cannot take it on trust; you need a way to check.

## Citations: show the receipt

The app numbers the page sentences 1, 2 and 3. For each sentence of the answer, it looks for a page sentence that shares at least two of the words that carry meaning.

Asked *Can I return a used bike?*, the bot said: *Yes, you can return a used bike as long as it is clean and in good condition. Just bring the receipt.* Returning a clean used bike is sentence 3, and bring the receipt is sentence 2, so the app adds [3] and [2]. Anyone can tap a number and read that exact line. The matching is done by the app in code, not by the model. Big platforms do the same; Anthropic's [citations feature](https://docs.claude.com/en/docs/build-with-claude/citations), for example, returns the exact quoted text next to each claim.

## No receipt, no answer

The check then decides what the customer sees. If any sentence has a part that is on no line of the page, the whole answer is replaced by the shop's fixed reply:

```python
blocked = any(r.get("verdict") == "NOT ON THE PAGE" for r in rows)
# ...
cited = " ".join(with_nums(r) for r in rows)
shown = FALLBACK if blocked else cited
```

[016-grounding/run_demo.py](https://github.com/mnafshin/termsplained-demos/blob/main/016-grounding/run_demo.py)

In the refund answer, *return* and *bike* are in sentence 1, but *receive*, *full* and *refund* are on no line, so it is blocked. The used-bike answer fails too, because *good condition* is on no line. Google's [grounding check](https://docs.cloud.google.com/generative-ai-app-builder/docs/check-grounding) uses the same rule: one unsupported part fails the sentence. The customer sees *The help page doesn't say. Please ask us in the shop.*, written by the app, not the model. Less exciting than yes, but true.

This word check is simple on purpose. It would miss a sentence that uses the page's words but flips their meaning; real checkers use a second AI model to judge whether a line supports a claim.

## Grounded is not the same as true

Now the shop changes its rule to 90 days, but nobody updates the help page. Asked how many days they have, the bot says 60 days [1], and the check passes, because the page really says 60. The answer is grounded, and it is wrong.

Grounding checks the answer against the page. It cannot check the page against the real world. Someone should own each page, and the page should show when it was last updated. The citation helps here too: a staff member who reads sentence 1 can spot the old rule in seconds.

## Reading citations as a user

Many AI tools show citations now, but a citation is only a claim about where an answer came from. In 2025, the Tow Center at Columbia University [tested eight AI search tools](https://www.cjr.org/tow_center/we-compared-eight-ai-search-engines-theyre-all-bad-at-citing-news.php) with 1,600 questions, each about finding the news article behind a quote. They gave wrong answers to more than six in ten, often linking to the wrong article or a page that did not exist, and rarely said they were unsure.

So open the citation, find the actual line that says what the answer says, and check how old the page is.

## Recap

- Having the right page does not make an answer grounded.
- A rule in the prompt helps, but you cannot take it on trust.
- Citations show which line each sentence came from; the app can add them in code.
- A check blocks sentences with no line behind them and falls back to "the page doesn't say".
- A grounded answer is only as good as its page: keep sources owned and dated, and open citations before you trust them.
