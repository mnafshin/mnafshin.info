---
title: 'AI News This Week (31 October–6 November 2026): Five Stories, Five AI Words'
description: 'Five AI stories from 31 October to 6 November 2026, each with one term in plain words: GPT-6 Cyber and authorized scope, dsh-superagent and coding agents, FlashProve and provable inference, Gemini Omni 1.2 Flash and video generation, and Meta''s Active Memory.'
pubDate: '2026-11-10T12:00:21Z'
kind: weekly
section: terms
topic: weekly-r02
tags:
  - weekly-roundup
  - authorized scope
  - coding agent
  - provable inference
  - video generation
  - agent memory
relatedVideos:
  - id: R02
    title: "AI news this week: GPT-6 Cyber, DeepSeek's dsh-superagent, FlashProve"
    youtubeId: f5THBxFtKWg
    pubDate: '2026-11-10T12:00:21Z'
# The three R02 Shorts are scheduled (11, 12 and 13 Nov, 13:00 Berlin) and
# stay hidden until each one is public: flip `published` to true then.
relatedShorts:
  - title: 'Which model wrote this reply?'
    youtubeId: Q97y7KCz97o
    published: false
  - title: 'More capable, so it wanders off?'
    youtubeId: BB_9C3SBuII
    published: false
  - title: 'Ten seconds, now fifteen'
    youtubeId: NweWCXq2Rcw
    published: false
draft: false
---

The week of 31 October to 6 November 2026 brought a security model trained to stay inside its job, a coding agent that waits to be asked, a way to prove which model wrote a reply, longer AI-generated video, and chat models that remember more. Each story comes with the one term you need to follow it. Benchmark numbers are the companies' own tests or listed prices, not independent scores, and every source is linked.

## GPT-6 Cyber: stay inside the job (5 Nov)

OpenAI released [GPT-6 Cyber](https://openai.com/index/introducing-gpt-6-cyber/), a model for authorized vulnerability research. The behaviour OpenAI trained is staying in scope: the list of systems the researcher named. On OpenAI's own test without an extra safety prompt, it avoided out-of-scope services 99.93% of the time, and 100% with that prompt; the earlier cyber model, without the prompt, was at 94.49%. The [system card](https://deploymentsafety.openai.com/gpt-6-cyber) reports the same test as a 0.07% honeypot exploitation rate.

OpenAI rates the model Critical in cybersecurity, up from High for GPT-5.6 Cyber. On OpenAI's ExploitGym, the announcement gives 48.5% against 32.1% for GPT-5.6 Cyber; the system card rounds it to 48.45% and compares it with a different model, GPT-6 Astra, at 42.43%. OpenAI also reports 81 previously unknown high-severity Firefox bugs, with proposed patches, and 948 working Linux privilege-escalation exploits from a research pipeline. Access starts with approved Daybreak Red customers, in the API and Codex.

The term is **authorized scope**: the model may act, but only inside the job it was given.

## dsh-superagent: an agent that waits to be asked (31 Oct)

A DeepSeek team put [dsh-superagent](https://github.com/deepseek-ai/dsh-superagent-prototype) on GitHub. The project page calls it a research prototype for reference only, not an official DeepSeek product. It is a proactive coding agent that looks after one repository. When someone who is allowed asks for work, it opens a work item, does the job in its own session and folder, and replies in the same conversation, sometimes with a pull request: a proposed code change that a person reviews before it is merged.

It acts only when asked or when a rule the team wrote allows it, and speaks only when someone must act or can use a result. That is the useful part: an agent that works for a whole team can also waste a whole team's attention. The code is MIT-licensed and had about 22,000 GitHub stars on 10 November.

The term is **coding agent**: an AI that changes code and hands the work back for a person to review.

## FlashProve: prove which model answered (2 Nov)

A chat reply might come from the model you asked for or from a cheaper stand-in, and the words alone cannot prove which. [Anthropic's FlashProve](https://www.anthropic.com/research/provable-inference), a research prototype rather than a switch inside Claude, builds a small proof that a reply came from a committed set of weights, without showing those weights.

It was measured on Llama 4 Maverick, about 400 billion parameters, at 4-bit precision. On one H100, proving ran at about 110 tokens a second; a 1,024-token request made a proof of about 19 MB that an ordinary computer can check in seconds. Proving took about 70 to 95 times the GPU time of a normal run of the same batch. It is limited to greedy decoding, integer math and 1,024 tokens, and it does not hide how the model is built. Code and report are open under Apache 2.0.

The term is **provable inference**: a check that this answer came from these weights.

## Gemini Omni 1.2 Flash: fifteen seconds of video (5 Nov)

Google made [Gemini Omni 1.2 Flash](https://blog.google/innovation-and-ai/technology/developers-tools/introducing-gemini-omni-1-2-flash/) generally available on the Gemini API and Google Cloud. It generates and edits video up to 15 seconds, where Omni 1.1 stopped at 10. You choose a length from 3 to 15 seconds in one-second steps and can edit the same clip across turns. Google says the price is 30% lower than before, at 0.07 dollars a second for 720p, and each clip carries SynthID, an imperceptible watermark ([model card](https://deepmind.google/models/model-cards/gemini-omni-1-2-flash/)).

The term is **video generation model**: a model whose output is moving pictures, not text.

## Meta's Active Memory: facts that stay (6 Nov)

[Meta](https://research.meta.ai/blog/specialized-models-for-muse-and-metaai) is rolling out specialised versions of the models behind Muse and Meta AI, trained further with Muse Wonder. Active Memory keeps facts from earlier chats and notices when an old fact matters again. On Meta's own Active Memory test, the new model used the critical context 90% of the time, against 76% before, and Meta says forgetting of that information dropped by a factor of 2.4. Its Personal Superintelligence index went from 38% to 47%, and Meta reports a 67% improvement on everyday tasks when something unexpected gets in the way.

The term is **agent memory**: useful facts kept from earlier, instead of a blank start every time.

## Also this week, read slowly

- **Editing weights directly.** In a [2 November research post](https://rikiyat.github.io/blog/weight-space-programming/), four MIT CSAIL researchers report that GPT-6 Astra removed what made Qwen3.5-0.8B get stuck in thinking loops by changing 0.016% of its weights, without training; MATH-500 went from 7.9% to 48.1%. The authors say this fixed a loop, not missing knowledge, and the edits did not help Gemma 3 270M, which rarely loops. These are early results from one team, and experts have pushed back in public.
- **AI speeding up AI research.** [METR's 5 November assessment](https://metr.org/blog/2026-11-05-anthropic-ai-rd-acceleration-assessment/) of Anthropic gives a best estimate of about twice the earlier pace on well-specified skills, and would not be surprised by about 1.3 times or 3 times. A benchmark trend it could publish was about 1.9 times (interval 1.5 to 2.8). Anthropic redacted much of the evidence METR found most useful.

These two items are not in the video. Sources were checked on 7 November 2026; the dsh-superagent page, its star count and the weight-space post on 10 November 2026.

## Recap

- **Authorized scope**: for a security model, ask how often it stays inside the named systems, with and without the safety prompt.
- **Coding agent**: an agent that acts only when asked and hands back a pull request still needs a person to review it.
- **Provable inference**: FlashProve can show which weights produced a reply, at a large extra GPU cost and within tight limits.
- **Video generation**: Gemini Omni 1.2 Flash makes clips up to 15 seconds, each watermarked with SynthID.
- **Agent memory**: Meta's gains are on its own tests; check what a memory feature keeps before you rely on it.

## Sources

- [OpenAI: GPT-6 Cyber](https://openai.com/index/introducing-gpt-6-cyber/)
- [OpenAI: GPT-6 Cyber system card](https://deploymentsafety.openai.com/gpt-6-cyber)
- [GitHub: deepseek-ai/dsh-superagent-prototype](https://github.com/deepseek-ai/dsh-superagent-prototype)
- [Anthropic: Progress on provable inference for large language models](https://www.anthropic.com/research/provable-inference)
- [Google: Gemini Omni 1.2 Flash](https://blog.google/innovation-and-ai/technology/developers-tools/introducing-gemini-omni-1-2-flash/)
- [Google DeepMind: Gemini Omni Flash model card](https://deepmind.google/models/model-cards/gemini-omni-1-2-flash/)
- [Meta AI Research: Bringing specialized models to Muse and Meta AI](https://research.meta.ai/blog/specialized-models-for-muse-and-metaai)
- [Sparks of Weight-Space Programming](https://rikiyat.github.io/blog/weight-space-programming/)
- [METR: Independent Assessment of AI R&D Acceleration at Anthropic](https://metr.org/blog/2026-11-05-anthropic-ai-rd-acceleration-assessment/)
