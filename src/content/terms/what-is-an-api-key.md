---
title: 'What Is an API Key? The Secret Code Apps Use to Reach AI'
description: An API key is a long secret code that lets a program use an AI model on your account and your bill. Why agents ask for one, why your ChatGPT or Claude subscription usually does not cover it, and how to keep it from leaking.
pubDate: '2026-11-20T02:20:00+01:00'
section: terms
topic: agents
draft: false
---

An API key is a long secret code that lets a program use a service on your account. When an AI agent asks for "your OpenAI key" or "your Anthropic key", it wants permission to send requests to that company's models and have the cost charged to you. Anyone who holds the key can spend your money, so it needs the same care as a password.

## The API: a menu for programs

An **API** (application programming interface) is a way for one program to ask another for something. A website is built for people to click; an API is built for programs to call.

AI companies offer their models through an API. A program sends some text, the model's reply comes back, and the company counts how many [tokens](/terms/what-is-a-token/) went in and out. The key travels with every request, so the company knows whose account to charge.

## Why agents ask for a key

Hosted agents such as ChatGPT dots or Claude Duet already include the model in your subscription. Self-hosted agents and many desktop apps do not; they are only the [loop around the model](/terms/what-is-an-ai-agent-made-of/). To think, they must call a model somewhere, and that call needs a key.

OpenDot, for example, says that if you connect a cloud model "with your own API key, that provider bills you directly." OpenClaw has no paid tier at all: you pay the model provider. The software is free; the model use is your bill.

## A subscription is not an API key

This surprises many people. Paying for a chat app usually does not give you API access.

- OpenAI's help centre says ChatGPT Plus ($20/month) does not include API usage, which is "separate and billed independently." ChatGPT and the API platform have separate billing.
- Anthropic says the Claude Pro plan does not include API usage; you set up the Claude Console and pay for it separately. Its Max, Ultra and Team plans do include monthly API credits ($100, $200 and up to $500 as of November 2026), which you claim by linking a Console account.

Some tools now offer a third way: **sign in with your subscription** instead of pasting a key. Codex works with a ChatGPT sign-in, and Suparagent can use a Claude Code or Codex sign-in. Then the tool draws on your plan's allowance rather than a separate bill.

## How you pay with a key

API use is usually pay-as-you-go. With Anthropic you buy prepaid credits in the Console, and each request is deducted from them. OpenAI bills API use from its own billing settings, separate from ChatGPT.

The price depends on the model and on how much text goes in and out. A short question costs a tiny amount; an agent that reads your whole inbox every hour can cost much more. The next article in this group, on choosing a model, looks at those prices.

## Keeping a key safe

A leaked key is like a lost credit card with no PIN. OpenAI's safety guide warns that a stolen key can lead to unexpected charges and data loss. The main rules from that guide:

1. **Never paste it into a chat, a screenshot or a public file.** Never commit it to a code repository.
2. **Keep it out of browsers and phone apps.** Code there can be read by anyone.
3. **Store it as an environment variable** or in the app's own encrypted settings, not in plain text.
4. **Set a spending limit** on the account or project, with hard enforcement, so a leak cannot run up a large bill.
5. **Use one key per app or person**, and give keys an expiry date.
6. **Rotate it at once** if you think it leaked: create a new key, update your apps, delete the old one.

Good agents help. Suparagent encrypts saved keys, and OpenDot stores keys with the operating system's encryption.

## Sara gets her first key

Sara, a freelance designer, wants a self-hosted agent to sort her inbox. The setup screen asks for a model and a key.

She already pays for a Claude plan, but Pro does not include API use. So she opens the Claude Console, buys a small amount of credit and sets a monthly spend limit. She creates one key just for this agent and pastes it into the agent's settings, not into a chat.

A month later she checks the usage page. If the agent costs more than expected, she can switch to a cheaper model or check less often. If she ever pastes the key somewhere by mistake, she deletes it and makes a new one in a minute.

## Recap

- An API key is a secret code that lets a program use a service on your account and bill.
- Self-hosted agents and many desktop apps need a key, because they bring the loop but not the model.
- Chat subscriptions such as ChatGPT Plus and Claude Pro do not include API use; some higher plans include API credits.
- Some tools let you sign in with your subscription instead of using a key.
- Treat keys like passwords: never share them, set spending limits, and rotate them if they leak.

## Sources

- [OpenAI Help Center: Best practices for API key safety](https://help.openai.com/en/articles/5112595-best-practices-for-api-key-safety)
- [OpenAI Help Center: Managing billing for ChatGPT and the API platform](https://help.openai.com/en/articles/9039756-managing-billing-for-chatgpt-and-the-api-platform)
- [OpenAI Help Center: What is ChatGPT Plus?](https://help.openai.com/en/articles/6950777-what-is-chatgpt-plus)
- [Claude Help Center: What is the Pro plan?](https://support.claude.com/en/articles/8325606-what-is-the-pro-plan)
- [Claude Help Center: Why is Claude API usage billed separately?](https://support.claude.com/en/articles/9876003-why-is-claude-api-usage-billed-separately-from-my-paid-claude-plan)
- [Claude Platform docs: API credits for Max, Ultra and Team plans](https://platform.claude.com/docs/en/about-claude/api-credits-for-subscribers)
- [Claude Help Center: How do I pay for my Claude API usage?](https://support.claude.com/en/articles/8977456-how-do-i-pay-for-my-claude-api-usage)
- [OpenAI Help Center: Using Codex with your ChatGPT plan](https://help.openai.com/en/articles/11369540-using-codex-with-your-chatgpt-plan)
- [OpenDot](https://opendot.live/)
- [Suparagent on GitHub](https://github.com/Anil-matcha/suparagent)
