---
title: 'What Is OpenRouter? One Key for Many AI Models'
description: OpenRouter gives you one account, one API key and one balance for more than 600 AI models from many companies, with automatic fallbacks. How it works, what it costs as of November 2026, the privacy settings, the downsides, and the alternatives.
pubDate: '2026-11-20T03:00:00+01:00'
section: terms
topic: models
draft: false
---

OpenRouter is a service that sits between your app and the AI companies. Instead of opening an account and an [API key](/terms/what-is-an-api-key/) with each one, you open one OpenRouter account, add credit, and reach more than 600 models from over 80 providers with a single key. It is not an assistant or an agent itself; it is plumbing that agents and apps plug into.

## Why one key helps

Every AI company has its own website, key, bill and way of calling its models. If you want to compare three models, that means three accounts and three bills.

OpenRouter replaces that with one account, one balance and one way of calling every model. Many self-hosted agents and desktop apps, such as OpenDot and Hermes Agent, list it as a supported option, so switching models becomes a setting rather than a new sign-up.

## How routing works

Popular models are often served by several providers. OpenRouter calls this choice **routing**. By default it picks a provider for each request based on measured price, speed, latency and reliability, and it reacts within minutes when one gets slower or fails.

A **fallback** is the backup plan. If a provider errors, OpenRouter can retry another provider or another model you listed. According to its pricing page, an attempt that errors is not charged for model tokens, so you pay only for the run that answers.

## What it costs

From OpenRouter's pricing page on 20 November 2026:

- Model use is billed at each provider's **list price**; OpenRouter does not add a markup per request.
- OpenRouter's fee is charged when you **buy credits**: 5.5% on the Standard plan, 8% on Business.
- A **free tier** allows 50 requests a day, and some models have free versions with their own limits.
- **Bring your own key** (BYOK): you connect your own provider key, and the provider bills you directly. The first $25,000 of list-price use per month through BYOK has no OpenRouter fee; above that, a 5% fee applies.

On a $100 top-up, the Standard fee is $5.50; the model use itself costs the same as at the provider. Check the [model prices](/terms/which-ai-model-should-i-use/) of the models you plan to use; that is where most of the money goes.

## Privacy

Your prompts pass through OpenRouter on their way to the provider. Its privacy docs say:

- OpenRouter keeps prompts only if you opt in to logging, or where the law requires it, for example to review child-abuse material.
- A **zero data retention** setting limits your requests to providers that do not store them.
- It documents which providers may use data for training, with settings to block them.
- Requests sent to its EU or US address are processed entirely in that region.

The provider's own policy still applies to whatever reaches it. For private client data, check both.

## The downsides

- **One more company** sees your requests.
- **The fee** on credit purchases, small but real.
- **The provider can change** from one request to the next, and the same model can behave slightly differently or be slower on another host. You can pin a provider if that matters.
- **Free models are limited** and not suited to an agent that runs all day.
- **Some special features** a company offers only through its own API may arrive later, or not at all.

## The alternatives

- **Direct keys** from OpenAI, Anthropic, Google, Mistral or DeepSeek: no middleman and no extra fee, but one account and bill per company.
- **LiteLLM**: an open-source gateway you run yourself that calls more than 100 providers through one format. Same idea as OpenRouter, but on your own server and with your own keys.
- **Vercel AI Gateway**: a hosted gateway for developers, with fallbacks, budgets and bring-your-own-key.
- **A local model** through Ollama: no key, no bill per token, and nothing leaves your computer.

## Sara tries three models with one key

Sara, a freelance designer, runs a self-hosted inbox agent. She wants to know whether a cheap model is good enough for sorting emails and which model writes the best client replies.

She opens an OpenRouter account, buys $20 of credit, sets a spending limit and pastes one key into her agent. Over a week she switches between three models in the settings and compares the drafts and the cost of each on OpenRouter's usage page. Once she has picked, she can stay on OpenRouter or move to a direct key from that one company to skip the fee.

## Recap

- OpenRouter gives you one account, one key and one balance for more than 600 models.
- Routing picks a provider by price, speed and reliability; fallbacks retry when one fails.
- Model use is billed at list price, with a fee when you buy credits (5.5% Standard as of November 2026).
- Your prompts pass through OpenRouter; use its privacy settings and check the provider's policy too.
- Alternatives: direct provider keys, LiteLLM on your own server, Vercel AI Gateway, or a local model.

## Sources

- [OpenRouter](https://openrouter.ai/)
- [OpenRouter Learn: What is OpenRouter?](https://learn.openrouter.ai/courses/what-is-openrouter/welcome)
- [OpenRouter pricing](https://openrouter.ai/pricing)
- [OpenRouter FAQ](https://openrouter.ai/docs/faq)
- [OpenRouter docs: Provider routing](https://openrouter.ai/docs/features/provider-routing)
- [OpenRouter docs: Data collection and privacy](https://openrouter.ai/docs/guides/privacy/data-collection)
- [LiteLLM on GitHub](https://github.com/BerriAI/litellm)
- [Vercel AI Gateway docs](https://vercel.com/docs/ai-gateway)
- [OpenDot](https://opendot.live/)
- [Hermes Agent](https://hermes-agent.nousresearch.com/open-source-ai-agent)
