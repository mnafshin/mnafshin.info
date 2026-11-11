---
title: 'What Is an AI Hallucination? Why AI Sounds Sure and Is Still Wrong'
description: An AI hallucination is an answer that sounds right but is false. It comes from how language models write, a perfect form filled with a guess, and it can be made rarer but not switched off.
pubDate: '2026-11-02T16:18:59Z'
section: terms
topic: hallucination
relatedVideos:
  - id: Explainer
    title: 'What is an AI hallucination? Why AI sounds sure and is still wrong'
    youtubeId: n2kh-j8Is6w
    pubDate: '2026-11-02T16:18:59Z'
relatedShorts: []
draft: true
---

An AI hallucination is when an AI gives an answer that sounds right but is false. OpenAI describes it as a model [confidently giving an answer that isn't true](https://openai.com/index/why-language-models-hallucinate/). It matters because a hallucination looks exactly like a correct answer: same calm tone, same neat details. Knowing where it comes from tells you what to check.

## What a hallucination looks like

The name is borrowed from people, seeing something that is not there. But the AI is not lying the way a person lies; there is no plan to fool you.

The common shapes are made-up facts, wrong numbers, fake quotes and sources that do not exist. A well-known case is from 2023: two New York lawyers gave a federal court a legal argument that cited six earlier decisions, with names, page numbers and quotes. None of the six existed; ChatGPT had made them up. One lawyer had even asked ChatGPT whether a case was real, and it said yes. The court [fined the lawyers and their firm 5,000 dollars](https://storage.courtlistener.com/recap/gov.uscourts.nysd.575368/gov.uscourts.nysd.575368.54.0.pdf).

## It learned what answers look like

Chatbots such as ChatGPT, Claude and Gemini run on a large language model (LLM): a program trained on huge amounts of text to predict the next word. It practises that billions of times, so it becomes very good at writing text that sounds right. Your answer is written the same way, one likely word at a time.

Nobody marked each training sentence as true or false. So the model learned what answers look like, not which ones are true.

## A perfect form, filled with a guess

One of the fake cases was *Varghese v. China Southern Airlines*. Look at its shape: a name, versus a company, then a book volume, a page, a court and a year. Every part has the right form, because legal writing is full of citations like this and the pattern is easy to learn.

Whether one case exists, though, is not a pattern. It is a single fact. OpenAI's researchers make the same point: spelling follows patterns, but rare one-off facts do not. For a little-known case or an exact number, the model fills the gap with something that fits.

## Why "are you sure?" is not a check

A true answer and a guess come out of the same process, so they sound the same. A confident tone is a writing style; it does not measure whether the answer is right. The reply to "are you sure?" is predicted text too, which is why the lawyer got a yes.

## Tests that reward guessing

Part of the reason models guess instead of saying "I don't know" is how they are tested. Most popular tests only count right answers: right gets a point, "I don't know" gets zero, and wrong also gets zero. A guess never scores worse than staying quiet.

OpenAI's researchers [argued this in 2025](https://arxiv.org/abs/2509.04664) with their own numbers. On short fact questions, an older model got 24% right and 75% wrong. A newer model got 22% right, but said "I don't know" more than half the time and was wrong only 26% of the time: almost the same score, with about a third as many wrong answers. Their proposal is that tests should punish confident wrong answers more than honest uncertainty.

## A side effect of the job, not a bug

There is no broken line of code to find and delete. A hallucination comes from the job itself: give the most likely answer, even without knowing. Newer models hallucinate less, but they still do, and accuracy will never reach 100%, because some questions cannot be answered. The goal is a model that says "I don't know" when it should.

## Making hallucinations rarer

You cannot switch hallucinations off, but you can make them rarer.

1. **Give it the source.** Paste the document and ask it to answer only from that text. This is called grounding; RAG does it by looking up the right documents first.
2. **Give it permission.** Tell it that "I don't know" is a fine answer. Anthropic's guide to [reducing hallucinations](https://docs.claude.com/en/docs/test-and-evaluate/strengthen-guardrails/reduce-hallucinations) recommends this.
3. **Ask for proof.** A quote from the source for each claim: no quote, no claim.

Grounding does not end hallucinations. In a [Stanford study](https://law.stanford.edu/publications/hallucination-free-assessing-the-reliability-of-leading-ai-legal-research-tools/), legal AI tools built on real case law still hallucinated on one in six to one in three questions. Fewer than a general chatbot, but far from zero. The last check is yours.

## Recap

- A hallucination is a confident answer that is false.
- The model predicts likely words; it learned what answers look like, not which are true, so a guess sounds as sure as a fact.
- Asking "are you sure?" is not a reliable check.
- Sources, permission to say "I don't know" and a quote per claim make hallucinations rarer, not impossible.
- Before you send, sign or publish: check names, numbers, quotes and sources yourself.
