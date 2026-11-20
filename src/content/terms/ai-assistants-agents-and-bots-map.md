---
title: 'AI Assistants, Agents and Bots: A Simple Map'
description: ChatGPT dots, Claude Duet, OpenClaw, Hermes, Cursor… Two questions sort almost every AI helper you hear about. Does it only answer, or does it act? And whose computer does it run on?
pubDate: '2026-11-20T01:30:00+01:00'
section: terms
topic: agents
draft: false
---

AI assistants, agents and bots are programs built on a language model that help you with tasks, usually through a chat. They differ in two ways: how much they do on their own, and whose computer they run on. New names appear every week, but two questions place almost any of them on one map, and the spot tells you roughly what a product can do and what it costs to run.

## Three words on one scale

The three words describe one idea at different strengths.

An **assistant** answers when you ask. You type a question, it replies, and it waits for you. An **agent** takes steps on its own toward a goal: it searches, clicks, writes and checks its work until the job is done. A **bot** is the loosest word. Today it usually means an assistant or agent you message inside a chat app such as Telegram, WhatsApp or Slack.

[AI agent vs agentic AI vs chatbot](/terms/agent-vs-agentic-vs-chatbot/) explains the agent loop in detail. Here we only need the scale, from talking to doing.

Meet **Sara**, a freelance designer. She wants help with four jobs: researching new clients, sorting her inbox, chasing unpaid invoices and fixing her small website. Each job needs a different spot on the map.

## Question one: does it answer or act?

Picture three steps on the scale.

1. **Answers when asked.** The everyday chat apps: ChatGPT, Claude, Gemini and Perplexity. Sara asks, "What does this client's company do?" and gets a summary.
2. **Acts when asked.** You give a task, and it works through many steps by itself. ChatGPT Work, for example, has its own cloud browser that keeps going after you close your laptop and pauses when it needs your sign-in or confirmation.
3. **Acts on its own schedule.** This kind is called **proactive**: it starts work without being asked each time. Anthropic's Claude Duet, a research preview, prepares a morning brief and checks your connected apps every few hours.

The further down the list, the more the tool can save you, and the more you need to trust it. That is why products such as Claude Duet and OpenDot ask before they send, pay or delete anything.

## Question two: whose computer does it run on?

An agent needs a computer to work on. There are four common answers.

- **The company's cloud.** You sign up and the company runs everything. ChatGPT dots, Claude Duet, Meta Muse, Grok Bot and Manus work this way. You pay a subscription; you maintain nothing.
- **Your own computer.** The app runs on your Mac or PC. OpenDot, a free open-source app, gives you small single-job assistants that watch your email, calendar and files, and keeps the data on your machine.
- **Your own server.** This is called **self-hosted**: you install free software on a machine you control, often a small rented server, and talk to it from a chat app. OpenClaw and Hermes Agent are the best-known examples. Hermes' docs say a $5-a-month server is plenty, and that the real cost is the AI model it calls.
- **Your code editor.** Coding agents such as Claude Code, Codex and Cursor work inside your project and your terminal.

Who runs the computer also decides who fixes it when it breaks. With a cloud product, the company does. With a self-hosted one, you handle updates, keys and security yourself.

## The map

Put the two questions together and most names fall into one of these boxes.

| Kind | What it does | Examples | Read more |
|---|---|---|---|
| Chat assistant | Answers, and sometimes acts when asked | ChatGPT, Claude, Gemini, Perplexity | This article |
| Hosted agent | Works for you on the company's computer, often on a schedule | ChatGPT dots, Claude Duet, Claude Cowork, Meta Muse, Grok Bot, Manus | Part 2 (coming soon) |
| Self-hosted agent | Free software on your computer or server, reached from chat apps | OpenClaw, Hermes Agent, NanoClaw, Suparagent | Part 3 (coming soon) |
| Builder tools | Write code, build apps or run automations | Claude Code, Codex, Cursor, Lovable, n8n | Part 4 (coming soon) |

Some famous names are not agents at all. **OpenRouter** gives you one account and one key for many AI models; it is plumbing that other tools plug into. **Copilot** is a brand name that covers several Microsoft and GitHub products. Both get their own articles in this group. Until then, [What is an AI copilot?](/terms/what-is-an-ai-copilot/) explains the brand versus the idea.

## Where Sara starts

Sara now matches each job to a box.

- **Client research:** a chat assistant is enough. She asks, reads the answer and checks the sources.
- **Inbox and invoices:** these repeat every day, so an agent that acts on a schedule helps most. She can pick a hosted agent and pay a subscription, or run a self-hosted one and pay for model use plus perhaps a small server.
- **The website:** a coding agent fits, because it can read her site's files and propose changes.

She does not need one tool for everything. A chat assistant for daily questions and one agent for the work that repeats is often enough.

## Behind every helper: a model

Every product on this map sends your words to a **language model**, the engine that writes the replies (see [What is an LLM?](/terms/what-is-an-llm/)). Some products choose the model for you. Others, especially self-hosted ones, ask you to pick a model and paste in a key that pays for it. What an agent is actually made of, from the model to its tools and instruction files, is the next article in this group (coming soon). Later ones explain those keys, how to choose a model, and where OpenRouter fits.

## Recap

- Assistant, agent and bot sit on one scale: an assistant answers, an agent acts, and a bot is the chat-app face of either.
- Question one: does it only answer, act when asked, or act on its own schedule?
- Question two: does it run on the company's cloud, your computer, your own server or your code editor?
- Hosted agents cost a subscription and no upkeep; self-hosted agents are often free software, but you pay for the model and do the maintenance.
- OpenRouter and Copilot are not agents: one is model plumbing, the other a brand name.

## Sources

- [Anthropic: Building effective agents](https://www.anthropic.com/engineering/building-effective-agents)
- [IBM: AI agents vs. AI assistants](https://www.ibm.com/think/topics/ai-agents-vs-ai-assistants)
- [OpenAI Help Center: Using cloud browser in ChatGPT](https://help.openai.com/en/articles/20001280-using-cloud-browser-in-chatgpt)
- [OpenAI: Introducing dots](https://openai.com/index/introducing-dots/)
- [The Verge: Anthropic's Claude Duet AI agent](https://www.theverge.com/ai-artificial-intelligence/1015843/anthropic-claude-duet-ai-agent)
- [Meta: Introducing Muse, a personal AI agent](https://about.fb.com/news/2026/09/introducing-muse-personal-ai-agent/)
- [Manus docs: Welcome](https://manus.im/docs/introduction/welcome)
- [Grok Bot 101](https://x.ai/bot/guides/grok-bot-101)
- [OpenDot](https://opendot.live/)
- [OpenClaw](https://openclaw.ai/)
- [Hermes Agent by Nous Research](https://hermes-agent.nousresearch.com/open-source-ai-agent)
- [Claude Cowork](https://claude.com/product/cowork)
- [OpenRouter FAQ](https://openrouter.ai/docs/faq)
