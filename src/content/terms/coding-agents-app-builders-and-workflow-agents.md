---
title: 'Coding Agents, App Builders and Workflow Agents'
description: Some AI tools are not personal assistants but builders. Coding agents such as Claude Code, Codex, Cursor and Devin change code; app builders such as Replit Agent and Lovable turn a prompt into a website; n8n and Zapier Agents automate repeated work. How they differ and what they cost as of November 2026.
summary: "Coding agents, app builders and workflow agents build or automate things instead of chatting: they change a project's files, turn a description into a website, or run the same steps across your apps. The article explains how they differ and what they cost as of November 2026."
pubDate: '2026-11-20T03:20:00+01:00'
section: terms
topic: agents
draft: false
---

Coding agents, app builders and workflow agents are AI tools that build or automate things instead of chatting with you about your day. A coding agent changes the files of a software project. An app builder turns a description into a working website. A workflow agent runs the same business steps across your apps, again and again. They use the same [parts as any agent](/terms/what-is-an-ai-agent-made-of/), pointed at code or at a process.

## From suggestions to pull requests

Early coding tools only suggested the next line while you typed. Today's coding agents take a whole task. They read the project, edit many files, run the tests and hand back the result.

That result is often a **pull request**: a proposed change to a code project that a person reviews before it is merged. GitHub describes the pattern plainly. A task is written down, an agent picks it up, and the change comes back as a pull request. A person reviews it and merges it. You stay the reviewer; the agent does the typing.

## The main coding agents

| Tool | Where it works | Price note (20 Nov 2026) |
|---|---|---|
| **Claude Code** (Anthropic) | Terminal, code editors, desktop and web | Included in paid Claude plans from Pro ($20/month), or billed by API use |
| **Codex** (OpenAI) | ChatGPT desktop app, a terminal tool, editor extension, web, and cloud tasks on OpenAI's computers | Included across ChatGPT plans, even Free and Go; cloud tasks need Plus or higher |
| **Cursor** | An AI code editor with agents, a CLI and cloud agents | The X Subscription tiers (Plus $8, Premium $30, Super $100); other companies' models billed separately at API price |
| **Devin** (Cognition) | Devin Desktop (formerly the Windsurf editor), a CLI, and Devin Cloud, an agent on its own cloud machine | Free; Pro $20; Max $200; Team $80 per month |

If you used Windsurf, look at the last row. Cognition renamed Windsurf to Devin Desktop on 2 June 2026. The editor and plans stayed the same. GitHub Copilot is also a coding agent; it gets its own article, [Copilot explained](/terms/copilot-explained-microsoft-vs-github/).

Mistral's Vibe has a coding mode too. DeepSeek has published dsh-superagent, a research prototype. It watches one GitHub project and answers requests with pull requests. It is not a product.

## App builders: from a sentence to a website

An app builder lets someone who does not code describe an app and get a working one, hosted online.

- **Replit Agent** builds and hosts apps in the browser. Core costs $20/month, Pro $100/month. Replit itself warns that the agent "may occasionally make mistakes."
- **Lovable** builds web apps from prompts. Its free plan gives 5 build credits a day, up to 30 a month.
- **Bolt.new** and **v0** by Vercel do similar work, and both have free plans.

These are great for a first version, a prototype or a simple internal tool. For anything that handles money or private data, have someone who codes review it.

## Workflow agents: repeated work across apps

Many jobs are the same steps every time: a form arrives, a row goes into a sheet, an email goes out. Workflow tools have automated this for years. The new part is an AI step that can read messy text and decide what to do.

- **n8n** is a visual workflow tool with AI agent steps. You can host it yourself, and its cloud plans are priced by how many workflows run each month.
- **Zapier Agents** do work across more than 9,000 apps, "on command and while you sleep." Check Zapier's pricing page for current plans.
- **Make** offers AI agents inside its visual workflows. A panel shows each decision the agent made. Make says agents are on all plans.

Make gives a good rule of thumb. If a job just needs doing, use plain automation. If it needs judgement, add an agent.

## How you pay

- **Subscriptions** with included usage: Claude Code, Codex, Cursor, Devin, Replit.
- **Credits**: Lovable, Bolt and v0 count prompts or tokens against a monthly allowance.
- **API billing**: some tools let you bring your own [API key](/terms/what-is-an-api-key/) and pay per token instead.

Heavy agent use burns through allowances fast. Most tools show a usage page; check it in your first week.

## Sara fixes her site and automates invoices

Sara, a freelance designer, has two jobs for this group of tools.

Her portfolio site has a broken contact form. She opens the project in a coding agent, describes the problem, and gets back a small change and a short explanation. She reads it, tests the form and accepts it.

Her invoices follow the same path every month: a project is marked done, an invoice is created, a reminder goes out after 14 days. She builds that in a workflow tool, with one AI step that writes a friendly reminder in the client's language. The steps are fixed; only the wording needs judgement.

## Recap

- Coding agents edit projects and usually return a pull request for a person to review.
- Claude Code, Codex, Cursor and Devin (formerly Windsurf) are the main coding agents; GitHub Copilot is covered separately.
- App builders such as Replit Agent and Lovable turn a description into a hosted app; review anything important.
- Workflow tools such as n8n, Zapier Agents and Make automate repeated steps, with AI only where judgement is needed.
- Payment is by subscription, credits or your own API key; watch the usage page.

## Sources

- [GitHub Docs: What is GitHub Copilot?](https://docs.github.com/en/copilot/get-started/what-is-github-copilot)
- [Claude Code docs: Overview](https://code.claude.com/docs/en/overview)
- [Claude pricing](https://claude.com/pricing)
- [OpenAI Help Center: Using Codex with your ChatGPT plan](https://help.openai.com/en/articles/11369540-using-codex-with-your-chatgpt-plan)
- [Cursor docs](https://docs.cursor.com/)
- [Cursor pricing](https://cursor.com/pricing)
- [Devin: Windsurf is now Devin Desktop](https://devin.ai/blog/windsurf-is-now-devin-desktop)
- [Devin pricing](https://devin.ai/pricing)
- [Mistral docs: Vibe](https://docs.mistral.ai/vibe)
- [DeepSeek: dsh-superagent prototype](https://github.com/deepseek-ai/dsh-superagent-prototype)
- [Replit pricing](https://replit.com/pricing)
- [Lovable pricing](https://lovable.dev/pricing)
- [Bolt pricing](https://bolt.new/pricing)
- [v0 pricing](https://v0.app/pricing)
- [n8n pricing](https://n8n.io/pricing/)
- [n8n docs: Advanced AI](https://docs.n8n.io/advanced-ai/)
- [Zapier Agents](https://zapier.com/agents)
- [Make AI Agents](https://www.make.com/en/ai-agents)
