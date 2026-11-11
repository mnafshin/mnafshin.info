---
title: 'What Is an LLM? Large Language Models, Explained Simply'
description: A large language model is a giant next-token predictor that learned how language usually goes. What the letters mean, how it reads and learns, how a guesser becomes an assistant, and why it can sound sure and still be wrong.
pubDate: '2026-10-24T16:51:00Z'
section: terms
topic: llm
relatedVideos:
  - id: Explainer
    title: 'What is an LLM? Large language models, explained simply'
    youtubeId: gvSMSeP8NT4
    pubDate: '2026-10-24T16:51:00Z'
relatedShorts:
  - title: 'Capital of Australia? Ask a real AI model'
    youtubeId: 0s0PLxVx13w
codeUrl: https://github.com/mnafshin/termsplained-demos/tree/main/short-llm-next-word
draft: true
---

A large language model, or LLM, is a program that has learned how language usually goes by reading a huge amount of text. It is the technology inside chat assistants such as ChatGPT, Gemini and Claude. Its core skill is simple: guess what comes next. Knowing that one fact explains both why it writes so fluently and why it can be confidently wrong.

## Finish the sentence

Finish this sentence: peanut butter and...

Most people think *jelly*. Nobody looks it up; you just know what usually comes next. That guess is the whole trick of an LLM, done at a very large scale.

## What the three letters mean

- **Large**: billions of internal numbers, called parameters, tuned on a huge amount of text.
- **Language**: it works with text, such as questions, emails, reports and code.
- **Model**: a program that learned patterns from examples. It is not a database of facts.

Put together, an LLM is a very big program that has learned how language usually goes.

## It reads tokens, not words

An LLM does not see words. It sees **tokens**: small chunks of text such as a whole word, part of a word, or a punctuation mark. OpenAI's rule of thumb for English is that one token is about four characters, or roughly three quarters of a word, so 100 tokens are about 75 words ([OpenAI Help Center](https://help.openai.com/en/articles/4936856-what-are-tokens-and-how-to-count-them)).

Tokens matter for two practical reasons. Usage is often priced per token, and every model can only handle a limited number of tokens at once, called its context window.

## One token at a time

When you send a prompt, the model reads all the tokens so far and gives every possible next token a probability. After "peanut butter and", *jelly* scores high, *bananas* lower, *concrete* almost zero.

It picks one, adds it to the text, and does the whole thing again for the next token. Token by token, the answer appears on your screen. The [GPT-4 technical report](https://arxiv.org/abs/2303.08774) describes the model plainly as one pre-trained to predict the next token in a document.

## How it learned: a giant fill-in-the-blank

During training, the model reads huge amounts of text, tries to predict each next token, and compares its guess with the real one. Every miss nudges its parameters a tiny bit.

The scale is what makes this work. [GPT-3](https://arxiv.org/abs/2005.14165), from 2020, had 175 billion parameters and was trained on 300 billion tokens from web pages, books and Wikipedia. The design that made such scale possible is the [Transformer](https://arxiv.org/abs/1706.03762), introduced by a Google team in 2017. Its key idea, *attention*, lets each token look at every other token in the text to decide what matters.

## From guesser to assistant

A model trained only to predict the next token is good at continuing text, not at helping. Ask it a question, and it may simply continue with more questions.

So makers add a second stage. People write example answers and rank the model's replies, and the model is fine-tuned on that feedback. In [OpenAI's 2022 study](https://arxiv.org/abs/2203.02155) of this method, people preferred the answers of a 1.3-billion-parameter model trained this way over the original 175-billion-parameter GPT-3. Size is not everything; training it to follow instructions matters a lot.

## Likely is not the same as true

An LLM predicts what sounds likely, not what is true. Most of the time the two line up. When they do not, the model can still produce a fluent, confident answer that is simply wrong. That is called a **hallucination**.

A [2025 OpenAI paper](https://cdn.openai.com/pdf/d04913be-3f6f-4d2b-b283-ff432ef4aaa5/why-language-models-hallucinate.pdf) compares it to a student guessing on a hard exam question, because training and testing reward a guess more than an honest "I don't know".

On its own, the model also does not look anything up. What it knows comes from training, which stops at a cutoff date. Apps can add web search or company documents around it, but that is an extra step, not the model itself.

## Using it well

LLMs are strong at language work: drafting, summarising, rewriting, translating, explaining and writing code. Be careful with exact facts, numbers, quotes and recent events, and check those against a real source. A useful picture is a fast, well-read intern whose work you always review.

## Recap

- An LLM is a giant next-token predictor that learned how language usually goes from huge amounts of text.
- It reads and writes tokens; in English, one token is about three quarters of a word.
- It writes an answer one token at a time, always picking a likely next token.
- A second training stage, on human-written and human-ranked answers, turns the guesser into an assistant.
- It predicts what sounds likely, not what is true, and does not look anything up on its own: check facts, numbers and recent events.
