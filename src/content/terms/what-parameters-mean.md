---
title: 'What AI Model Parameters Mean: 8B, 70B and 405B'
description: A parameter is one number inside a model that is set during training, and the B in 8B or 70B counts how many there are. A two-knob taxi-fare model shows what a parameter is, and a real 0.5B model shows what the count costs.
pubDate: '2026-11-05T17:00:23Z'
section: terms
topic: parameters
relatedVideos:
  - id: Explainer
    title: '8B, 70B, 405B: what AI model parameters actually mean'
    youtubeId: 64JlC90D0JQ
    pubDate: '2026-11-05T17:00:23Z'
relatedShorts:
  - title: 'Does AI search for the next word?'
    youtubeId: kEj-aYdK0qU
codeUrl: https://github.com/mnafshin/termsplained-demos/tree/main/017-parameters
draft: true
---

A parameter is one number inside an AI model that is set during training. The B in a model name such as Llama 3.1 8B, 70B or 405B means billion, and it counts those numbers. That count tells you how much memory the model needs and how much math it does for every word. It does not, on its own, tell you how good the model is.

## A model with two knobs

Start with a model small enough to run in your head: guessing a taxi fare from the distance. The guess uses two numbers, a starting fee and a price per kilometre.

The fare is the starting fee plus the price per kilometre times the distance. Those two numbers are this model's parameters. Think of each one as a knob: turn a knob, and every guess changes.

## Training turns the knobs

Nobody types the numbers in. Both knobs start at zero, so every first guess is 0 euros. The model is then shown three past rides: 2 km cost 8 euros, 5 km cost 14, and 10 km cost 24.

After each round of guesses, the model checks how far off it was and nudges each knob a little in the direction that makes the guesses less wrong. Here is the loop from the demo:

```python
rides = [(2, 8.0), (5, 14.0), (10, 24.0)]
base, per_km, lr = 0.0, 0.0, 0.01
for step in range(1, 5001):
    gb = gk = 0.0
    for km, fare in rides:
        err = base + per_km * km - fare
        gb += 2 * err / len(rides); gk += 2 * err * km / len(rides)
    base -= lr * gb; per_km -= lr * gk
```

[017-parameters/run_demo.py](https://github.com/mnafshin/termsplained-demos/blob/main/017-parameters/run_demo.py)

After about a thousand of these nudges, the guesses are off by less than one cent. The knobs settle on a starting fee of 4 euros and 2 euros per kilometre, so the model can now guess a ride it has never seen: 7 km, 18 euros. That is training: turning the knobs until the guesses match the examples.

## From two knobs to half a billion

A large language model (LLM) works the same way, only much bigger. The demo opens a small open model, Qwen2.5 in its 0.5B size, and counts its knobs: 494,032,768. Reading one aloud every second would take more than 15 years.

Each knob is just a number. One on its own means nothing; together they hold what the model learned. They were set like the taxi knobs: guess the next word, check, nudge every knob a little, over and over.

## The model calculates; it does not search

When you type a prompt, the model does not look the next word up in a list or a database. It calculates it.

Your text is split into tokens, and each token becomes a list of numbers. Those numbers pass through the model's 24 layers; in every layer they are multiplied by knobs and added up. At the end, every possible next token gets a score. For *The capital of France is*, *Paris* got the top score at 30%.

The model picks a token, adds it to the text, and runs the whole calculation again. In a normal model like this one, every new token uses almost all of the knobs.

## What the B costs

While the model runs, every knob has to sit in memory, usually at two bytes each. The 0.5B model is a file of about one gigabyte, which matches.

The same arithmetic, for the weights alone, gives about 16 GB for an 8B model, which fits on one big graphics card. A 70B model needs about 140 GB, more than one 80 GB [NVIDIA H100](https://www.nvidia.com/en-us/data-center/h100/) can hold. The 405B model needs about 810 GB, so more than ten of those cards.

Math grows too. An 8B model has about 16 times more knobs than the 0.5B one, so it does about 16 times more math per token. More knobs means slower answers or more expensive computers.

## Bigger is not always better

In 2022, DeepMind compared two of its own models ([Hoffmann et al.](https://arxiv.org/abs/2203.15556)). Gopher had 280 billion parameters; Chinchilla had 70 billion. Both used the same amount of computing to train, but Chinchilla learned from about four times more text, and it beat Gopher on most of the tests.

More knobs only help if the model gets enough practice to set them well. The B tells you the size and the running cost, not the score. Some newer models are huge but use only a small slice of their knobs for each token; that design is called mixture of experts.

## Recap

- A parameter is one number in a model that is set during training; the B counts them in billions.
- Training nudges the knobs, round after round, until the guesses match the examples.
- For each token, the model calculates a score for every possible next token with its knobs; it does not search.
- At about two bytes per knob, the B sets the memory you need, and more knobs mean more math per token.
- A bigger B does not promise a better model; enough training data matters too.
