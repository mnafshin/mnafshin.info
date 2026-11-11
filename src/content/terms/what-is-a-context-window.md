---
title: 'What Is a Context Window? Why AI Seems to Forget'
description: A context window is all the text a model can look at while it writes one answer, measured in tokens. The app resends the whole chat every turn, old parts fall out when the window is full, and even a huge window is not read equally well.
pubDate: '2026-10-26T23:12:59Z'
section: terms
topic: context-window
relatedVideos:
  - id: Explainer
    title: 'What is a context window? Why AI "forgets", explained simply'
    youtubeId: ktq37DbApL4
    pubDate: '2026-10-26T23:12:59Z'
relatedShorts: []
codeUrl: https://github.com/mnafshin/termsplained-demos/tree/main/009-context-window
draft: false
---

A context window is all the text a language model can look at while it writes one answer. Anthropic's documentation calls it the model's [working memory](https://docs.claude.com/en/docs/build-with-claude/context-windows), and it is separate from the huge pile of text the model was trained on. When a chatbot seems to forget something you said earlier, the context window is usually the reason: the detail was no longer in front of it.

## The whole desk, not just your question

The window is measured in **tokens**, the small pieces of words that models read; in English, one token is roughly three quarters of a word.

Everything shares it: the hidden instructions from the app, every message so far, any files or tool results, and the answer being written. Think of a desk with a fixed size. Your question is only one sheet on it.

## The model keeps nothing between messages

Between your messages, the model itself remembers nothing. OpenAI's documentation says each request is [independent and stateless](https://platform.openai.com/docs/guides/conversation-state). To hold a conversation, the app sends the whole chat again on every turn.

The demo uses a short example work chat with a marketing assistant. The first message sets the launch budget at 40,000 euros. Measured with a real tokenizer, the first request carries 27 tokens. By the sixth message, the request carries 183 tokens, because it repeats everything before it. Across all six requests, the model reads 636 tokens for a chat that is only 183 tokens long. That is also why long chats cost more and get slower.

## When the desk is full

If a request is too big for the window, a developer API can simply refuse it; Anthropic's API returns an error that says the prompt is too long. Chat apps usually do something quieter and manage the window on a rolling basis: first in, first out.

To see it, the demo shrinks the window to a toy size of 150 tokens and trims the oldest messages whenever the chat no longer fits:

```python
WIN = 150
hist = []
for i, (who, s) in enumerate(CHAT):
    hist.append((i, who, s))
    dropped = []
    while n(SYSTEM) + sum(n(x[2]) for x in hist) > WIN:
        dropped.append(hist.pop(0))
```

[009-context-window/measure_context.py](https://github.com/mnafshin/termsplained-demos/blob/main/009-context-window/measure_context.py)

After the ninth message, the very first one, with the budget, slides out. On the last turn, when you ask whether the plan fits the budget, the model never sees the budget at all. It did not forget it; it was simply not on the desk.

Some tools summarise the old part instead, which Anthropic calls compaction. That keeps the gist, but a summary can still lose the detail you needed.

## How big windows are today

The desk has grown a lot. Google's [long context guide](https://ai.google.dev/gemini-api/docs/long-context) says earlier models could take about 8,000 tokens at a time. OpenAI lists 128,000 tokens for one version of GPT-4o, and many current models from Anthropic and Google accept a million tokens or more. Google puts a million tokens at about eight average-length novels, or 50,000 lines of code.

## A big window is not read evenly

A big desk does not mean every part of it is read equally well. In the 2023 paper [Lost in the Middle](https://arxiv.org/abs/2307.03172), researchers hid the one useful document among twenty and moved it around. With the answer at the start, one model was right about 76% of the time. With the answer in the middle, about 54%, lower than the 56% it scored with no documents at all.

In 2025, Chroma tested eighteen models and found the same trend, which it calls [context rot](https://research.trychroma.com/context-rot): as the input grows, results get less reliable, even on simple tasks. In one test, models did much better with a focused input of about 300 tokens than with the full input of about 113,000.

## Training, window and retrieval

Three things are easy to mix up. **Training** is what the model learned before you ever met it; it does not change during your chat. The **context window** is what it can see right now, for this one answer.

When the window is too small, the usual workarounds are to drop old messages, summarise them, or use **retrieval**. Retrieval is the idea behind RAG: instead of piling everything onto the desk, fetch only the pages that matter for this question.

## Recap

- The context window is the model's working memory for one answer, measured in tokens.
- App instructions, the whole chat, files, tool results and the answer all share it.
- The app resends the chat every turn; when the window is full, old parts are dropped or summarised.
- Bigger windows help, but the middle of a long input is read less reliably.
- Start a new chat for a new task, restate key facts near your question, and paste only the part of a document you need.
