---
title: 'AI vs Machine Learning vs Deep Learning vs Generative AI'
description: Four names that overlap but do not stack. AI contains machine learning, machine learning contains deep learning, and generative names the job, not a smaller circle. One shop email shows each of them.
pubDate: '2026-11-06T12:00:07Z'
section: terms
topic: ai-ml-dl-genai
relatedVideos:
  - id: Explainer
    title: 'AI vs ML vs Deep Learning vs Generative AI'
    youtubeId: 8dF3KLvJfwQ
    pubDate: '2026-11-06T12:00:07Z'
relatedShorts: []
draft: false
---

Artificial intelligence, machine learning, deep learning and generative AI are often used as if they were four sizes of one thing. Three of them do nest: AI contains machine learning, and machine learning contains deep learning. The fourth, generative AI, names a job, producing new content, rather than a smaller circle. Knowing which is which tells you what a product actually does when a vendor uses one of the words.

## One email, four ways to handle it

The example is a single email to a shop: *Where is my order?*

It is handled four times. First a program files it using knowledge a person wrote down. Then a program learns the folder from old emails. Then that program is swapped for a stack of layers. Last, a program writes a reply instead of only filing the email.

## AI: not every system learns

**Artificial intelligence (AI)** is the broad field of building systems that decide or create, and not all of them learn from data. International definitions, such as the [OECD's](https://www.oecd.org/content/dam/oecd/en/publications/reports/2024/03/explanatory-memorandum-on-the-updated-oecd-definition-of-an-ai-system_3c815e51/623da898-en.pdf) and the one in the [EU AI Act](https://eur-lex.europa.eu/eli/reg/2024/1689/2026-07-27/eng), include systems that reason from knowledge a person wrote, as well as systems that learn.

For the shop email, a person writes two statements. An email whose words include *where* and *order* asks where an order is, and that is a shipping question. A shipping question is filed under Shipping.

The program applies the first statement, then the second, and files the email under Shipping. The folder was never written as one rule; it came from the chain. No past emails were used, and nothing was learned.

## Machine learning: learning from examples

**Machine learning** is the part of AI where a program improves at a task from data, not from rules a person wrote.

Take the two statements away. Give the program old emails, each already labelled with a folder. It counts which words show up in which folder. In those examples, only the Shipping emails use the word *order*, so the program files the new email under Shipping.

The choice came from the examples. There is no stack of layers here, so this is machine learning, but not deep learning yet.

## Deep learning: a stack of layers

**Deep learning** is the part of machine learning that uses a neural network with many layers. A neural network is a stack of layers, and each layer is a simple step that learns its numbers from data ([Goodfellow, Bengio and Courville](https://www.deeplearningbook.org/)).

A small network trained on the same labelled emails has two layers in the middle. The first mixes the words, the second mixes that result, and the last step picks the folder. It also files the email under Shipping. Nothing here says it is better or faster; only the machinery changed, from a word count to a stack.

A large deep learning model is the same kind of stack with many more layers. And a network that only picks a folder does not write anything.

## Generative AI: the job is new content

**Generative AI** is AI that produces new content, such as text or images, by following patterns in the data it was given.

Filing picks a label. Writing a reply produces something new. A small program is given a few reply lines and learns which words tend to follow which. Starting from *Your*, it draws *parcel*, and keeps drawing until a full stop: *Your parcel is on the way.* That full line is not one of the lines it was given, even though it reuses their words.

This program has no neural network. Claude Shannon built this kind of word-following text [in 1948](https://people.math.harvard.edu/~ctm/home/text/others/shannon/entropy/entropy.pdf), also without one. So *generative* names the job, not a kind of deep learning.

## Why the names get mixed up

The writing tools people use now are usually deep neural networks that learn from broad data and then produce text. NIST's [generative AI profile](https://doi.org/10.6028/NIST.AI.600-1) notes that generative AI generally means those large models, while not every generator is one. A reply-writing tool today is often all four at once: it is AI, it learns, it uses many layers, and it produces text.

When the words get swapped, ask three questions. Does it learn? Does it use a stack of layers? Does it produce something new? A knowledge-based program can be AI and not learn. A word counter can learn and not be deep. A deep network can pick a folder and not write. And a writer does not have to be a deep network.

## Recap

- AI is the broad field; some AI systems reason from written knowledge and learn nothing.
- Machine learning is AI that improves at a task from data, such as labelled examples.
- Deep learning is machine learning with a neural network of many layers.
- Generative AI names the job, producing new content; it is not a smaller circle inside deep learning.
- To place a product, ask: does it learn, does it use layers, does it produce something new?

## Sources

- [OECD (2024): Explanatory memorandum on the updated OECD definition of an AI system (PDF)](https://www.oecd.org/content/dam/oecd/en/publications/reports/2024/03/explanatory-memorandum-on-the-updated-oecd-definition-of-an-ai-system_3c815e51/623da898-en.pdf)
- [EUR-Lex: Regulation (EU) 2024/1689 (AI Act)](https://eur-lex.europa.eu/eli/reg/2024/1689/2026-07-27/eng)
- [Goodfellow, Bengio and Courville: Deep Learning](https://www.deeplearningbook.org/)
- [Claude Shannon (1948): A Mathematical Theory of Communication (PDF)](https://people.math.harvard.edu/~ctm/home/text/others/shannon/entropy/entropy.pdf)
- [NIST AI 600-1: Generative Artificial Intelligence Profile](https://doi.org/10.6028/NIST.AI.600-1)
