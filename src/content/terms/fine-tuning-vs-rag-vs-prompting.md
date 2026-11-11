---
title: 'Fine-Tuning vs RAG vs Prompting: Which One Your Project Needs'
description: Prompting changes what you tell the model, RAG changes what it reads, and fine-tuning changes the model itself. One bike-shop help bot, upgraded step by step, shows what each one fixes and why facts that change belong in a lookup, not in training.
pubDate: '2026-11-04T17:00:25Z'
section: terms
topic: fine-tuning-vs-rag
relatedVideos:
  - id: Explainer
    title: 'Fine-tuning vs RAG vs prompting: which one does your project need?'
    youtubeId: v-t8nT8JmHs
    pubDate: '2026-11-04T17:00:25Z'
relatedShorts: []
codeUrl: https://github.com/mnafshin/termsplained-demos/tree/main/015-fine-tuning-vs-rag
draft: false
---

Prompting, RAG and fine-tuning are three ways to make an AI model work better for a project. A better prompt changes what you tell the model. RAG changes what the model reads before it answers. Fine-tuning changes the model itself. They fix different problems, so the useful question is not which one is best, but which problem you have.

## The plain bot: wrong voice, missing fact

The example is a help bot for a small bike shop, Northside Bikes. A customer asks: *How many days do I have to return a bike?* The shop's own help page says 60 days. Every answer below is a real run of a small open model with randomness turned off.

Inside the bot is a large language model (LLM), trained on huge amounts of text to predict the next word. It has read a lot about bikes and shops in general, but never this shop's rules. The plain model talked about proof of purchase and types of bikes and never gave a number of days. Two problems: the wrong voice and a missing fact.

## Prompting changes how it answers

The cheapest fix is better instructions. A **system prompt** is the set of instructions an app gives the AI before your first message. This one says: you are the help bot for Northside Bikes, answer in one or two short, friendly sentences, and end every answer with *Happy riding!*

The answer became one short sentence: you typically have 30 days. Short and clear, but wrong, and it forgot the sign-off. A prompt changes how the model answers; it cannot give the model a fact it never saw, unless you type the fact in yourself. A real shop has many rules, and pasting all of them into every prompt does not scale.

## RAG gives it the facts

**RAG** means the AI looks up the right documents first, then answers from them. The bot gets the shop's six help pages: returns, delivery, repairs, opening hours, warranty and kids' bikes. For each question, a simple search picks the best-matching page and puts it into the prompt, right above the question.

Now the answer is: you have 60 days to return your bike; bring the receipt. Right, and it came from the shop's own page. When a rule changes, you edit the page. The voice is still a little loose: *Happy riding!* came at the start instead of the end.

## Fine-tuning teaches a habit

**Fine-tuning** means training an existing model a little more on your own examples. Instead of telling the bot how to talk, you show it. The demo uses forty short example chats in the shop's voice, each ending with *Happy riding!*, with no instructions in them. Four also mention the 60-day return window. Training went through them three times, in under a minute on a computer with no graphics card, only because the model and data are tiny.

Asked something it never saw, *Do you sell bikes for kids?*, it answered: *Yes! We have bikes for kids in the shop. Happy riding!* The voice is there without any instructions. Asked about returns with no lookup, it said 60 days, so it seemed to have learned the fact as well.

## When a trained-in fact goes stale

Then the shop changes its rule to 90 days and updates the help page. The fine-tuned bot on its own still says 60, which is expected. But given the new page the RAG way, with 90 written right in front of it, it still answered 60. The trained-in fact beat the page it was reading. Facts change, and a trained model keeps the old ones until you train it again.

The fix is to train habits only. The demo retrains from the same starting model, after dropping every example that states the return rule:

```python
NEW_PAGES = dict(PAGES); NEW_PAGES["Returns"] = PAGES["Returns"].replace("60 days", "90 days")
# ...
HABITS = [(q, a) for q, a in TRAIN if "60 days" not in a]
data2 = [encode(q, a) for q, a in HABITS]
```

[015-fine-tuning-vs-rag/run_demo.py](https://github.com/mnafshin/termsplained-demos/blob/main/015-fine-tuning-vs-rag/run_demo.py)

Asked with no lookup, the retrained bot no longer knows, and makes something up; facts are no longer its job. Asked with the new page, it says: *Return it within 90 days of purchase. Happy riding!* The fact came from the page; the voice came from training.

## Which one to try first

Start with a prompt: it costs nothing to change and you see the result right away. OpenAI's guide to [optimizing LLM accuracy](https://platform.openai.com/docs/guides/optimizing-llm-accuracy) calls prompting the best place to start, and notes that many of its largest customer projects used only prompting and RAG.

Add RAG when answers need facts the model cannot know: your files, prices, rules and anything that changes. Consider fine-tuning when the bot still does not behave the same way every time: a tone, a format, or one task done the same way again and again. OpenAI's [supervised fine-tuning guide](https://platform.openai.com/docs/guides/supervised-fine-tuning) suggests starting with about fifty good examples and checking whether it helped. Keep facts that change out of the training examples.

## Recap

- A prompt changes what you tell the model; start there.
- RAG changes what the model reads; use it for facts, especially facts that change.
- Fine-tuning changes the model itself; use it for habits such as tone and format.
- A fact trained into a model goes stale and can even beat a fresh page in the prompt.
- Train the habits, look up the facts; many apps never need the third step.
