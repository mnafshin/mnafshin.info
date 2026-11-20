---
title: 'Self-Hosted AI Agents: OpenClaw, Hermes and Friends'
description: A self-hosted agent is free software you run on your own computer or a small rented server and talk to from Telegram, WhatsApp or Slack. What OpenClaw, Hermes Agent, NanoClaw, Rakazo and Suparagent do, what they really cost, and what you must maintain.
summary: "A self-hosted AI agent is software you install and run yourself, on your own computer or a small rented server, and usually talk to from a chat app. The software is often free; the costs are the model, perhaps a server, and the time to keep it running."
pubDate: '2026-11-20T02:50:00+01:00'
section: terms
topic: agents
draft: false
---

A self-hosted AI agent is agent software you install and run yourself, on your own computer or on a small server you rent. You choose the model, you keep the data, and you usually talk to it from a chat app you already use. The software is often free; the costs are the model you connect, perhaps a server, and your own time to keep it running.

## What self-hosted means

With a [hosted agent](/terms/hosted-ai-agents/), a company runs everything. Self-hosted turns that around: you download the program, start it on a machine you control, and connect it to a model with an [API key](/terms/what-is-an-api-key/) or a local model.

Most of these projects are a **gateway**: a program that sits between your chat apps and the model. A message arrives from Telegram, the gateway runs the [agent loop](/terms/what-is-an-ai-agent-made-of/) with the model and its tools, and the answer goes back to Telegram. To you, it feels like texting a person.

## Your PC or a $5 server?

An agent can only work while its machine is on.

- **Your own computer** is free and keeps everything at home. But when the laptop sleeps, the agent sleeps. A morning check at 7:00 will not happen if the lid is closed.
- **A small rented server**, often called a VPS, runs day and night. Hermes Agent's docs say a $5-a-month VPS is plenty, and that the model calls are what cost money. The catch is that you now look after a server.

A spare always-on machine at home, such as a mini PC, sits between the two.

## The real bill

The software below is open source and free. What you pay for:

1. **The model.** Each request is charged per token by the provider, unless you run a local model with a tool such as Ollama. See [Which AI model should I use?](/terms/which-ai-model-should-i-use/)
2. **A server**, if you want the agent always on.
3. **Your time** for setup, updates and fixing things.

Some projects also accept a sign-in from a subscription you already have, such as a Claude Code or Codex account, instead of a separate API bill.

## The main projects

Star counts are from GitHub on 20 November 2026; they show popularity, not quality.

| Project | What stands out | Runs on | Talk to it from |
|---|---|---|---|
| **OpenClaw** (MIT, about 395k stars) | The best-known project; memory, skills and any model; a one-line installer | Mac, Windows, Linux, home server or VPS | About 29 chat apps, including WhatsApp, Telegram, Slack, Signal and iMessage, plus a web control panel |
| **Hermes Agent** by Nous Research (MIT, about 265k stars) | Learns by writing its own skills; built-in scheduler; can import OpenClaw setups | Your PC or a VPS; also a desktop app and a hosted option in Nous Portal | Telegram, Discord, Slack, WhatsApp, Signal, email, terminal |
| **NanoClaw** (MIT, about 31k stars) | Small and readable; each agent runs in its own Docker container; works with Claude Code, Codex, Cursor or OpenCode | Your PC or a VPS with Docker | Slack, WhatsApp, Telegram, Discord, iMessage, Teams |
| **Rakazo** (open source) | Persistent "AI teammates" with browser, shell, memory and routines | Self-hosted with Docker and Postgres, or the hosted plan | Slack mentions or texts from your phone |
| **Suparagent** (Apache-2.0, about 7.1k stars) | Named "AI coworkers" with memory, routines, optional isolated computers and approval before actions | A desktop app, your own Linux server, or a separate hosted app | Desktop app, a phone app paired to your server |

Smaller but growing projects include nanobot (about 50k stars) and ZeroClaw (about 33k), and newer "Grok Bot alternatives" such as OpenMausBot and munder-difflin. New ones appear every week. Before trusting one, check when it last released, how many people use it, and how it keeps the agent away from the rest of your computer.

## What you must maintain

Self-hosting means you are the support team.

- **Updates.** These projects change weekly. Updating fixes bugs and security holes but can break your setup.
- **Keys and passwords.** The agent holds your model key and access to your email or calendar. Store them in the app's encrypted settings and set a spending limit.
- **Access to your computer.** OpenClaw can run with full system access or in a sandbox. A sandbox or container, as NanoClaw uses by default, limits the damage if the agent makes a mistake or reads a malicious instruction hidden in an email.
- **Approvals.** Turn on "ask first" for sending, paying and deleting. Suparagent, for example, offers an Ask-first mode, and its routines never approve an action by themselves.

## Sara sets up Hermes on a server

Sara, a freelance designer, wants her inbox agent on Telegram and running all day, without paying a hosted plan. She rents a small VPS, runs the Hermes installer, adds a model key with a monthly spending limit, and connects Telegram and her email.

She asks it to send a client summary every morning at 7:00 and to draft, never send, replies. An evening of setup gets it working. After that, she spends a few minutes a week checking updates and the usage page. Her total cost is the server plus the model bill.

## Recap

- A self-hosted agent is free software you run on your own computer or server and usually reach through a chat app.
- Your PC is free but sleeps; a small VPS runs all day for a few dollars a month.
- The real costs are the model, the server and your time.
- OpenClaw is the best known; Hermes, NanoClaw, Rakazo and Suparagent each add their own strengths.
- You handle updates, keys, sandboxing and approvals yourself.

## Sources

- [OpenClaw](https://openclaw.ai/)
- [OpenClaw docs](https://docs.openclaw.ai/)
- [OpenClaw on GitHub](https://github.com/openclaw/openclaw)
- [Hermes Agent](https://hermes-agent.nousresearch.com/open-source-ai-agent)
- [Hermes Agent on GitHub](https://github.com/nousresearch/hermes-agent)
- [NanoClaw on GitHub](https://github.com/nanocoai/nanoclaw)
- [Rakazo](https://rakazo.com/)
- [Rakazo self-hosting docs](https://rakazo.com/docs/self-host/)
- [Suparagent on GitHub](https://github.com/Anil-matcha/suparagent)
- [nanobot on GitHub](https://github.com/HKUDS/nanobot)
- [ZeroClaw on GitHub](https://github.com/zeroclaw-labs/zeroclaw)
- [GitHub topic: grok-bot-alternative](https://github.com/topics/grok-bot-alternative)
