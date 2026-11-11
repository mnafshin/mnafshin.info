---
title: "AI news this week (31 October–6 November 2026): five stories, five AI words"
description: "Five AI stories from 31 October to 6 November 2026, each with one term in plain words: GPT-6 Cyber, dsh-superagent, FlashProve, Gemini Omni 1.2 Flash, and Meta’s specialized Muse models."
pubDate: 2026-11-10T12:00:00Z
draft: true
tags:
  - weekly-roundup
  - authorized scope
  - coding agent
  - provable inference
  - video generation
  - agent memory
---

Every week we pick the AI news that matters and explain the one term you need to follow it. All benchmark numbers below are the companies' own tests, or a listed price, not an independent score. Every source is linked.

Watch the video version: [AI news this week: GPT-6 Cyber, DeepSeek's dsh-superagent, FlashProve](https://youtu.be/f5THBxFtKWg).

## 1. GPT-6 Cyber: stay inside the job (5 Nov)
OpenAI released [GPT-6 Cyber](https://openai.com/index/introducing-gpt-6-cyber/), a model for authorized vulnerability research. The behavior they trained is staying in scope: the list of systems the researcher named. On OpenAI's own test, without an extra safety prompt, it avoided out-of-scope services 99.93% of the time, and 100% with that prompt. The earlier cyber model, without the prompt, was at 94.49%. The [system card](https://deploymentsafety.openai.com/gpt-6-cyber) reports the same test as a honeypot exploitation rate of 0.07% without the prompt. OpenAI rates the model Critical in cybersecurity, up from High for GPT-5.6 Cyber. On OpenAI's ExploitGym the announcement says 48.5%, against 32.1% for GPT-5.6 Cyber. The system card rounds that to 48.45% and compares it with a different model, GPT-6 Astra, at 42.43%. Access starts with approved Daybreak Red customers, in the API and Codex.

The term is **authorized scope**: the model may act, but only inside the job it was given. OpenAI also reports 81 previously unknown high-severity Firefox bugs, with proposed patches, and 948 working Linux privilege-escalation exploits from a research pipeline. Those are outcomes they reported. This post does not explain how.

## 2. dsh-superagent: an agent that waits to be asked (31 Oct)
On 31 October a DeepSeek team put [dsh-superagent](https://github.com/deepseek-ai/dsh-superagent-prototype) on GitHub. The project page calls it a research prototype for reference only, not an official DeepSeek product. It is a proactive coding agent that looks after one GitHub repository. When someone who is allowed asks for work, it opens a work item, does the job in its own session and folder, and replies in the same conversation. That reply can be a pull request: a proposed code change that a person reviews before it is merged. Think of a new teammate who reads the team chat, but only picks up a ticket when someone assigns it. It acts only when asked, or when a rule the team wrote allows it, and it speaks only when someone must act or can use a result. For programmers, that is the useful part: an agent that works for a whole team can also waste a whole team's attention. The code is under the MIT license, and on 10 November it had about 22,000 stars on GitHub.

The term is **coding agent**: an AI that changes code and hands the work back for a person to review.

## 3. FlashProve: prove which model answered (2 Nov)
[Anthropic's FlashProve](https://www.anthropic.com/research/provable-inference) is a research prototype, not a switch inside Claude. A chat reply might come from the model you asked for, or from a cheaper stand-in, and the words alone cannot prove which. FlashProve builds a small proof that the reply came from a committed set of weights, without showing those weights. They measured it on Llama 4 Maverick, about 400 billion parameters, at 4-bit precision. A parameter is one number inside a model that is set during training. Only some of those numbers run on each piece of text, and the proof's work follows the ones that ran. A token is a chunk of text that the model treats as one unit. On one H100, proving ran at about 110 tokens a second. A 1,024-token request made a proof of about 19 megabytes, and an ordinary computer can check it in seconds. Proving took about 70 to 95 times as much GPU time as a normal run of the same batch. It stops at greedy decoding, integer math, and 1,024 tokens, and it does not hide how the model is built. The code and the report are open, under Apache 2.0.

The term is **provable inference**: a check that this answer came from these weights.

## 4. Fifteen seconds of video (5 Nov)
Google made [Gemini Omni 1.2 Flash](https://blog.google/innovation-and-ai/technology/developers-tools/introducing-gemini-omni-1-2-flash/) generally available on the Gemini API and Google Cloud. It generates and edits video up to 15 seconds. Omni 1.1 stopped at 10. You choose a length from 3 seconds to 15, in steps of one second, and you can edit the same clip across turns. Google says the price is 30% lower than before: $0.07 a second for 720p. Each clip carries SynthID, an imperceptible watermark. The [model card](https://deepmind.google/models/model-cards/gemini-omni-1-2-flash/) is also dated 5 Nov 2026. The blog's published and modified times are both that day.

The term is **video generation model**: a model whose output is moving pictures, not text.

## 5. Memory that stays (6 Nov)
[Meta](https://research.meta.ai/blog/specialized-models-for-muse-and-metaai) is rolling out specialized versions of the models behind Muse and Meta AI, trained further with Muse Wonder. Active Memory keeps facts from earlier chats and notices when an old fact matters again. On Meta's own Active Memory test, the new model used the critical context 90% of the time, against 76% before. Meta also says forgetting of that critical information dropped by a factor of 2.4. A separate index Meta calls Personal Superintelligence went from 38% to 47%, and Meta reports a 67% improvement on everyday tasks when something unexpected gets in the way. Those are Meta's own tests.

The term is **agent memory**: useful facts kept from earlier, instead of a blank start every time.

## Also this week: a model that edits another model's weights
In a [2 November research post](https://rikiyat.github.io/blog/weight-space-programming/), four MIT CSAIL researchers report that GPT-6 Astra can read and edit a neural network's weights directly, without training. In their largest test it found what made Qwen3.5-0.8B get stuck in thinking loops and removed it by changing 0.016% of the weights. MATH-500 went from 7.9% to 48.1%. The authors say this fixed a loop, not missing knowledge: on Gemma 3 270M, a small model that rarely loops, the edits did not help. These are early results from one team, on small models, and experts have pushed back in public discussion. It is in this post, not in the video.

## Also this week, read slowly
[METR's 5 Nov assessment](https://metr.org/blog/2026-11-05-anthropic-ai-rd-acceleration-assessment/) asks whether AI is speeding up AI research at Anthropic. It is not a product, and it is not one settled number. METR's best estimate is about twice the earlier pace on well-specified skills, and they would not be surprised by about 1.3 times or by 3 times. A benchmark trend they could publish was about 1.9 times (interval 1.5 to 2.8). Anthropic redacted much of the evidence METR found most useful. The term, if you want one, is **AI R&D acceleration**: research getting faster, only as sure as the evidence you can still see. This item is in the digest, not in the video.

## This week's words
Authorized scope, coding agent, provable inference, video generation model, agent memory.

*Narration in the video uses an AI-generated voice (Kokoro-82M). Sources fetched 7 November 2026; the dsh-superagent page, its star count and the weight-space post were checked on 10 November 2026.*
