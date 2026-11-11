---
title: 'AI News This Week (24–30 October 2026): Five Stories, Five AI Words'
description: 'Five AI stories from 24–30 October 2026, each with one term in plain words: GPT-6.1 Terra and computer use, Gemini 4 Carbon and prompt injection, Mistral Large 4 and mixture of experts, a shared AI-training signal in robots.txt, and Google Research''s sleep framework.'
pubDate: '2026-11-01T10:00:03Z'
kind: weekly
section: terms
topic: weekly-r01
tags:
  - weekly-roundup
  - computer use
  - hallucination
  - prompt injection
  - mixture of experts
  - training data
  - catastrophic forgetting
relatedVideos:
  - id: R01
    title: 'AI news this week: GPT-6.1 Terra, Gemini 4 Carbon, Mistral Large 4'
    youtubeId: 794FliCQkMg
    pubDate: '2026-11-01T10:00:03Z'
relatedShorts:
  - title: 'Does this robots.txt line stop AI training?'
    youtubeId: WqYSGjWrTPo
  - title: '53.6% wrong, now 16.7%. Still not zero'
    youtubeId: RhEQd_VDDFc
draft: false
---

The week of 24–30 October 2026 brought a model that operates a computer for you, a frontier model aimed at security teams, an open model with a trillion parameters, a proposed web standard for saying no to AI training, and research on models that keep learning after release. Each story comes with the one term you need to follow it. All numbers are the companies' own tests, not independent results, and every source is linked.

## GPT-6.1 Terra: a model that clicks for you (26 Oct)

OpenAI released [GPT-6.1 Terra](https://openai.com/index/introducing-gpt-6-1-terra), a fast model built for **computer use**: the model looks at a screen and clicks, types and scrolls like a person would. It costs 1 dollar per million input tokens and 5 dollars per million output tokens, which OpenAI says is half the price of GPT-5.6 Terra and GPT-6.1 Sol.

On OpenAI's internal set of prompts built to trip models up, wrong answers at low effort fell from 53.6% to 16.7%, and to 4.3% at maximum effort. That is real progress, but 16.7% is still about one answer in six. A confident wrong answer is a **hallucination**, and fewer is not none.

## Gemini 4 Carbon: security teams first (28 Oct)

Google's [Gemini 4 Carbon](https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-gemini-4-carbon/) is a frontier model with its headline results in cybersecurity: Google reports 88.2% on SEC-bench Pro, a test of finding software vulnerabilities. First access goes to a limited group of cyber defenders through Google's Fairwind Program, and Google says the model takes part in the U.S. government's voluntary pre-release testing.

The term is **prompt injection**: hidden text on a web page or in a file that tries to give an AI new orders. Google reports a 0.0% attack success rate on Gray Swan's indirect prompt-injection test.

## Mistral Large 4: a trillion parameters, a few at a time (29 Oct)

[Mistral Large 4](https://huggingface.co/blog/mistral-large4) has about one trillion parameters, but only about 49 billion work on each token. That design is a **mixture of experts**: inside are 128 expert networks, a router picks 4 of them per token, and 1 shared expert always runs. The weights are open under the Mistral Ecosystem Open-Weight License, so anyone can download and run the model. The model ID on the page says A52B while the text says about 49B active; this recap quotes the text.

## One robots.txt line for "no AI training" (30 Oct)

A new [IETF draft](https://www.ietf.org/archive/id/draft-kelley-aipref-training-preference-signal-00.html) by Kevin Kelley of Anthropic adds one shared signal for **training data** consent. Instead of one rule per crawler, a site can write:

```
User-Agent: __usage_ai-training
Disallow: /
Allow: /press-kit/
```

`Disallow: /` says no AI training on any page, and `Allow: /press-kit/` keeps one folder open. The draft also says a wildcard group (`User-Agent: *`) must not be read as this signal. [OpenAI](https://openai.com/index/helping-websites-express-ai-training-preferences/) says it will honour the signal "in the coming months", and [Google](https://developers.google.com/search/blog/2026/10/ai-training-control) aims to support it in 2027; [The Verge](https://www.theverge.com/tech/1023763/openai-google-microsoft-ai-scraping-standard-opt-out) has more on who backs it. It is a preference, not a lock.

## A model that sleeps (27 Oct)

Google Research's [sleep framework](https://research.google/blog/the-sleep-framework-a-new-way-for-llms-to-retain-knowledge-in-continual-learning/) lets a model keep learning after release. It alternates *wake*, normal use, with *sleep*, when new knowledge is stored in small new expert blocks and practised, which the team calls dreaming. The problem it targets is **catastrophic forgetting**: teach a model something new, and it can lose old skills. Google reports near-zero forgetting when teaching it rare languages such as Manchu and Kalamang. This is research, not a product.

## Also this week

- [Genie 4](https://blog.google/innovation-and-ai/models-and-research/google-deepmind/introducing-genie-4/) from Google DeepMind is a real-time interactive world model with native audio, steered in plain language, starting with trusted testers.
- The [Claude Platform](https://platform.claude.com/docs/en/release-notes/overview) added a Usage and Cost Analytics API in beta, so teams can see where their tokens go.
- [ChatGPT "dots"](https://help.openai.com/en/articles/6825453-chatgpt-release-notes) can now text you over iMessage or RCS, in beta for U.S. Pro users.

Sources were checked on 31 October 2026.

## Recap

- **Computer use**: a model that operates a screen; check the error rate at the effort level you will actually run, since fewer hallucinations is not zero.
- **Prompt injection**: hidden instructions in pages and files; a vendor's 0.0% is on one named test, not a guarantee.
- **Mixture of experts**: count total parameters for memory and active parameters for the work per token.
- **Training-data signal**: `User-Agent: __usage_ai-training` is a stated preference, and `User-Agent: *` does not count as one.
- **Catastrophic forgetting**: the sleep framework is research on keeping old skills while learning new ones, not a shipped feature.
