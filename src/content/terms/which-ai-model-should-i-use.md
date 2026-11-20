---
title: 'Which AI Model Should I Use? Quality, Price, Speed and Privacy'
description: The same agent or chat app can run on very different models. How to choose one by quality, price per token, speed, context size, open versus closed, and whether it can run on your own computer, with real prices from November 2026.
pubDate: '2026-11-20T02:40:00+01:00'
section: terms
topic: models
draft: false
---

An AI model is the engine that reads your text and writes the reply. Many apps and agents let you pick which model they use, and the choice changes how good the answers are, how much each task costs, how fast it feels, and where your data goes. There is no single best model; there is a best model for a job and a budget.

## The model is a part you can swap

A chat app, an agent or a coding tool is a program wrapped around a [language model](/terms/what-is-an-llm/). Hosted products often choose the model for you. Self-hosted agents and desktop apps such as OpenDot, Hermes Agent or OpenClaw usually let you choose, and some let you pick a different model for each task.

So "which model?" really means five smaller questions: how good, how expensive, how fast, how much can it read at once, and where does it run.

## Quality: how good is it at your task?

Bigger, newer models usually reason better, but not on every task. Independent sites test models and publish rankings. Artificial Analysis, for example, scores leading models on intelligence, speed and cost from its own evaluations.

Treat rankings as a starting list, not an answer. The real test is your own work: give two or three models the same ten tasks you care about and compare the results.

## Price per million tokens

API prices are quoted per million [tokens](/terms/what-is-a-token/), with one price for text going in and a higher one for text coming out. Some examples from the official pricing pages on 20 November 2026:

| Model | Input, per million tokens | Output, per million tokens |
|---|---|---|
| Claude Opus 5.5 (Anthropic) | $4 | $20 |
| Claude Sonnet 5.5 (Anthropic) | $2 | $10 |
| Claude Haiku 5.5 (Anthropic) | $0.10 | $0.50 |
| DeepSeek Flash (DeepSeek, peak hours) | $0.30 | $1.20 |

The top model costs forty times more per output token than the small one. DeepSeek even halves its prices outside peak hours. For an agent that reads long emails all day, that gap decides whether the monthly bill is a few cents or many dollars. Prices change often, so check the provider's page before you commit.

A chat subscription hides these numbers behind a monthly fee. They matter when an agent uses your own [API key](/terms/what-is-an-api-key/).

## Speed and context

**Speed** has two parts: how long before the first word appears, and how many tokens per second follow. Small models usually feel instant; the largest can pause to think. Anthropic, for example, sells a "fast mode" for some models at double the price.

**Context** is how much text the model can read in one go, its [context window](/terms/what-is-a-context-window/). DeepSeek's page lists a context length of one million tokens. A big window lets an agent read a long contract or a whole folder, but every token read is a token paid for.

## Open or closed?

A **closed** model is only available through its maker's API or apps. You cannot download it. Claude models and OpenAI's main GPT models are closed.

An **open-weights** model can be downloaded and run by anyone with suitable hardware. Ollama's library lists families such as Llama, Qwen, Gemma and DeepSeek-R1, in sizes from about 1 billion to hundreds of billions of [parameters](/terms/what-parameters-mean/). Open models give you control and privacy; the best closed models still often lead on hard tasks.

## Running a model on your own computer

Tools called **local model runners** download an open model and run it on your machine. Ollama is the best known; it says it serves millions of installs a month. LM Studio is a desktop app for the same job, and Open WebUI gives local models a chat page in your browser.

A local model costs nothing per token and your text never leaves your computer. The price is hardware and quality: small models run on a normal laptop, large ones need a powerful graphics card, and a small local model will not match a top closed model on difficult work.

## A simple way to choose

1. **Start in the middle.** A mid-priced model, such as Sonnet 5.5 in the table above, handles most everyday work.
2. **Move up for hard jobs.** Use the top model for tricky reasoning, long documents or code.
3. **Move down for volume.** Sorting, tagging and short summaries run fine on small, cheap models.
4. **Go local for private data**, if your computer can handle it.
5. **Measure.** Check the usage page after a week and switch if the cost or quality is wrong.

## Sara picks models for her agent

Sara, a freelance designer, runs a small agent for her inbox and invoices. Sorting fifty emails a day into "client", "invoice" and "ignore" is simple, so she uses a small, cheap model for it. Drafting a careful reply to an unhappy client is harder, so that step uses a stronger model.

For her private client contracts, she tries a local model through Ollama on her laptop. It is slower and a little less polished, but nothing leaves her desk. After a month her bill is a fraction of what a top model for everything would have cost.

## Recap

- The model is a swappable part; the right one depends on the job and the budget.
- Judge quality by testing your own tasks; use rankings only as a shortlist.
- API prices are per million tokens, output costs more, and the gap between big and small models can be forty times or more.
- Open-weights models can run on your own computer with tools like Ollama, for privacy and zero token cost.
- Start with a mid-priced model, move up for hard work, down for simple volume, and check your usage.

## Sources

- [Anthropic: Claude API pricing](https://platform.claude.com/docs/en/about-claude/pricing)
- [DeepSeek API docs: Models and pricing](https://api-docs.deepseek.com/quick_start/pricing)
- [Artificial Analysis](https://artificialanalysis.ai/)
- [Ollama](https://ollama.com/)
- [Ollama model library](https://ollama.com/library)
- [Ollama docs](https://docs.ollama.com/)
- [LM Studio](https://lmstudio.ai/)
- [Open WebUI docs](https://docs.openwebui.com/)
- [OpenDot](https://opendot.live/)
