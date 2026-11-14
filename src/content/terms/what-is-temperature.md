---
title: 'What Is Temperature in AI? The Setting That Makes It Random or Predictable'
description: Temperature decides how often a language model takes a less likely word. Low is predictable, high is varied and, past a point, nonsense. A coffee-shop slogan at different settings shows the whole dial.
pubDate: '2026-11-03T17:00:29Z'
section: terms
topic: temperature
relatedVideos:
  - id: Explainer
    title: 'What is temperature in AI? The setting that makes it random or predictable'
    youtubeId: -JKjVL1NTbs
    pubDate: '2026-11-03T17:00:29Z'
relatedShorts:
  - title: 'Same prompt, 5 runs. How many different answers?'
    youtubeId: 95YWTJN3QpM
codeUrl: https://github.com/mnafshin/termsplained-demos/tree/main/013-temperature
draft: false
---

Temperature is a setting that decides how often a language model takes a less likely word. Turned down, the model almost always picks its favourite, so the same question gets the same answer. Turned up, it picks long shots more often, so answers vary and, past a point, stop making sense. It does not add knowledge or effort; it only changes how the next word is drawn.

## How a model picks a word

A chatbot runs on a large language model (LLM), a program trained on huge amounts of text to predict the next token, a chunk of text the model treats as one unit. For every next token, the model gives each option a chance.

The demo gave a small open model, Qwen2.5-1.5B-Instruct, the sentence *The best drink in the morning is...* It gave *coffee* 67%. *Coffee* with a capital C got 12%, because to the model that is a different token. *Water* got about 4%, and *tea* under 2%. Then the model picks one, a bit like a weighted dice roll: coffee wins most of the time, but not every time.

## What the dial does

Temperature reshapes those chances before the dice are rolled. The demo divides the model's scores by the temperature before turning them into chances:

```python
for T in [0.2, 0.5, 1.0, 1.5, 2.0]:
    p = torch.softmax(logits / T, -1)
```

[013-temperature/run_demo.py](https://github.com/mnafshin/termsplained-demos/blob/main/013-temperature/run_demo.py)

At 1, the model uses its chances as they are. At 0.2, the favourite gets stronger and coffee goes to almost 100%. At 2, the chances even out: coffee drops to about 10%, and the long tail of odd words gets a real shot. At 0, the model simply takes the top choice every time.

## Same prompt, different settings

The same idea shows up in whole answers. Asked five times for *a one-line slogan for a small coffee shop* at temperature 0, the model wrote the same line five times: *Every sip, a moment of tranquility in the heart of the city.*

At 0.7, every slogan was new and all of them made sense. At 1, still fine, just more varied. At 1.5, things started to slip, and two answers drifted into other languages. At 2, every answer was word soup, mixing scripts and languages.

The reason is that each new word builds on the words before it. Once one odd word slips in, the next guess starts from a strange place. IBM's [guide to temperature](https://www.ibm.com/think/topics/llm-temperature) warns that settings close to 2 can start to produce nonsense.

## Why it is called temperature

The formula that turns scores into chances is called [softmax](https://en.wikipedia.org/wiki/Softmax_function). In physics, the same formula describes how particles spread across energy levels, and there, T stands for temperature. In a cold system almost everything sits in the lowest state; in a hot one it spreads out. AI researchers kept the name, and the effect is the same: low temperature lets the top word dominate, high temperature flattens the chances.

## Not really a creativity dial

Temperature is often called the creativity setting. In 2024, a team led by the University of Kent [tested that idea](https://arxiv.org/abs/2405.00492): an open model wrote stories at seven temperatures from almost 0 to 2, and people rated them. Higher temperature made the stories only a little more novel, but noticeably harder to follow. More randomness is not the same as better ideas; a clearer request usually does more than a hotter dial.

## Which setting, when

For facts, data extraction or code, keep it low: you want the most likely answer every time. For drafts and brainstorming, a middle setting gives variety without nonsense. Very high settings are rarely worth it.

The ranges differ between tools. OpenAI's [API reference](https://developers.openai.com/api/reference/resources/completions/methods/create) accepts 0 to 2, describes 0.8 as more random and 0.2 as more focused, and suggests changing temperature or a similar setting called top p, but not both. Anthropic's older models accept 0 to 1, and some of its newest models do not let you change it at all. Even at 0, answers are not guaranteed to be identical; Anthropic says so in its [glossary](https://platform.claude.com/docs/en/about-claude/glossary).

## Recap

- Every next word is a weighted dice roll; temperature decides how weighted it is.
- Low temperature is predictable: the favourite almost always wins. At 0, the model takes the top choice.
- High temperature is varied, and past about 1.5 answers start to slip into nonsense.
- It is not a creativity or effort dial; a clearer request usually helps more.
- Keep it low for facts and code, use a middle setting for drafts, and check each tool's allowed range.

## Sources

- [IBM: What is LLM temperature?](https://www.ibm.com/think/topics/llm-temperature)
- [Wikipedia: Softmax function](https://en.wikipedia.org/wiki/Softmax_function)
- [Peeperkorn et al. (2024): Is Temperature the Creativity Parameter of Large Language Models?](https://arxiv.org/abs/2405.00492)
- [OpenAI API reference: Create completion](https://developers.openai.com/api/reference/resources/completions/methods/create)
- [Claude Platform docs: Glossary](https://platform.claude.com/docs/en/about-claude/glossary)
