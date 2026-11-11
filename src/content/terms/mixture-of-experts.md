---
title: 'What Is Mixture of Experts (MoE)? Less Math, Not a Smaller Model'
description: A mixture of experts model splits many of its parameters into groups called experts, and a router picks a few of them for each token. That cuts the math per token, but every expert still has to sit in memory.
pubDate: '2026-11-07T12:00:34Z'
section: terms
topic: mixture-of-experts
relatedVideos:
  - id: Explainer
    title: 'What is Mixture of Experts (MoE)? Less math, not a smaller model'
    youtubeId: 0MvhsZqriUE
    pubDate: '2026-11-07T12:00:34Z'
relatedShorts:
  - title: 'Does AI search for the next word?'
    youtubeId: kEj-aYdK0qU
codeUrl: https://github.com/mnafshin/termsplained-demos/tree/main/018-mixture-of-experts
draft: false
---

Mixture of experts, or MoE, is a way of building AI models in which many of the model's parameters are split into groups called experts, and a small router picks a few of them for each token. Models such as Mixtral, Kimi K2 and Mistral Large 4 are built this way. The point is to keep a very large model while doing much less math for every word. What it does not do is make the model smaller.

## Every token, almost every knob

A **parameter** is one number inside a model that is set during training; think of each one as a knob. A **token** is a chunk of text that the model treats as one unit.

In a normal model, every new token goes through almost all of the knobs. Double the knobs and you roughly double the math for every token, which is why bigger models need more computing for every answer. Mixture of experts keeps many knobs but does less math per token.

## A company with a front desk

Picture a big company with a front desk. A question comes in, and the front desk sends it to a few specialists. Only they work on it; everyone else stays idle for this one. The next question may go to different specialists.

An MoE model works the same way. Many of its knobs are split into groups, the experts. The front desk is a small part called the **router**. For each token, the router picks a few experts, and only those do the math.

## Inside a real one

The demo opens a small open MoE model, IBM's [Granite 3.1 1B-A400M](https://huggingface.co/ibm-granite/granite-3.1-1b-a400m-instruct), on an ordinary computer. It has about 1.3 billion knobs in 24 layers. In every layer, it keeps many of them in 32 experts, and for every token the router picks 8 of the 32.

This is the step where the demo records those picks: the router gives each expert a score, and the top 8 per token are the ones that work.

```python
for li, r in enumerate(rl):
    r = r.float().reshape(-1, E)
    p = torch.softmax(r, -1)
    top = torch.topk(p, K, -1)
    picks.append([[int(e) for e in row] for row in top.indices])
```

[018-mixture-of-experts/run_demo.py](https://github.com/mnafshin/termsplained-demos/blob/main/018-mixture-of-experts/run_demo.py)

Run on a recipe line, *Whisk two eggs with a cup of milk, then pour the batter into a hot pan.*, each token lights up its own 8 experts, and the next token usually gets a different mix, in all 24 layers. At the end the model guesses the next token like any other: after *a cup of*, its top guess was *mil*, the first piece of *milk*. Nothing changes for the person typing; the difference is which knobs did the work.

## Less math for every token

Each token goes through the knobs outside the experts plus 8 of the 32 experts in every layer. That is a bit over 400 million knobs, about a third of the model. The other two thirds sit out for that token.

So the math per token is about that of a 400-million-knob model, not a 1.3-billion one. IBM's model card says the same: about 400 million active. That is the saving.

## Not a smaller model

The model file is still 2.7 GB, for all 1.3 billion knobs. You cannot keep only the experts you need, because you do not know which ones in advance; the router decides only when the token arrives.

The recipe line, just 22 tokens, used 707 of the model's 768 experts across all 24 layers. A single line of code then needed 33 experts the recipe never touched, and most experts that worked on the code had also worked on the recipe. Experts are not neat departments like a cooking team and a coding team. The team behind Mixtral looked across many kinds of text and [found no obvious pattern by topic](https://arxiv.org/abs/2401.04088) either.

Back to the company: each question needs only a few specialists, but the company still needs a desk for every one of them, because the next question could need anyone. In a model, the desks are memory.

## Two numbers for big models

Big models use the same trick. [Mixtral](https://mistral.ai/news/mixtral-of-experts) has 8 experts per layer and the router picks 2 for every token. In total it has about 47 billion knobs; each token uses about 13 billion. The math per token is like a 13-billion-knob model, but the memory follows the 47 billion: at two bytes per knob, about 94 GB, more than one 80 GB graphics card can hold. Mistral Large 4 takes this much further, with [about a trillion knobs in total](https://huggingface.co/blog/mistral-large4).

That is why MoE models are often described with two numbers. The total sets the memory. The active part sets the math for each token.

## Recap

- In a normal model, every token uses almost all of the parameters.
- An MoE model splits many parameters into experts, and a router picks a few experts for each token.
- Only the picked experts do the math, so the work per token follows the active count.
- Any expert can be needed next, so all of them stay in memory: the total sets the memory.
- Mixture of experts means less math for every token, not a smaller model.
