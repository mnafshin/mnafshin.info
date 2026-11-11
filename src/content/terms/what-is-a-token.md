---
title: 'What Is a Token? Why AI Bills You per Token, Not per Word'
description: A token is a chunk of text that a model treats as one unit. Models read, write and bill in tokens, so a ten-word request can be twelve tokens, and the same request costs more in some languages than in others.
pubDate: '2026-10-25T11:00:21Z'
section: terms
topic: token
relatedVideos:
  - id: Explainer
    title: 'What is a token? Why AI bills you per token, not per word'
    youtubeId: ToM34-nf6wM
    pubDate: '2026-10-25T11:00:21Z'
relatedShorts:
  - title: '10 words. How many tokens?'
    youtubeId: h5xQuQNqOeY
codeUrl: https://github.com/mnafshin/termsplained-demos/tree/main/006-token
draft: true
---

A token is a chunk of text that a language model treats as one unit: a whole word, part of a word, a single character, or a punctuation mark. Tokens are what models read, what they write, and what most AI services bill you for. Because a token is not a word, the count can surprise you, and so can the bill.

## Ten words, twelve tokens

Take a request you might send at work: *Can you summarise the attached report in three bullet points?* To you, that is ten words. To the model, it is twelve tokens.

The demo splits it with [tiktoken](https://github.com/openai/tiktoken), the open-source tokenizer OpenAI publishes for its models. Look at the two encodings it loads, the current one and an older one:

```python
import tiktoken
NEW, OLD = tiktoken.get_encoding("o200k_base"), tiktoken.get_encoding("cl100k_base")
TEXTS = [
    ("English request", "Can you summarise the attached report in three bullet points?"),
    # ... the same request in German, French and Persian, and a few single words
]
for name, s in TEXTS:
    a, b = NEW.encode(s), OLD.encode(s)
    print(f"  o200k_base {len(a):>3}: {[NEW.decode([x]) for x in a]}")
```

[006-token/measure_tokens.py](https://github.com/mnafshin/termsplained-demos/blob/main/006-token/measure_tokens.py)

Most words are one token each, and the space in front of a word is part of its token. *Summarise* is cut in two, *summar* and *ise*, and the question mark is a token of its own. Every token also has an ID number; the model never sees the letters, only a list of numbers.

## Why word pieces

Giving every word its own token does not work, because no list of words is ever complete: there are new names, typos, product codes and other languages. Single letters do not work well either; every sentence would become a very long list, and the model would do far more work for the same text.

Word pieces are the middle ground. A method called byte pair encoding starts from small pieces and keeps merging the pairs that appear together most often, until it has a fixed vocabulary. [Sennrich and colleagues](https://arxiv.org/abs/1508.07909) brought the idea to language models in 2015. The tokenizer above has a vocabulary of about 200,000 tokens: common words get one, rare words are built from pieces.

## Same word, different count

That is why counts can surprise you. *unbelievable* with a space in front is a single token. At the very start of the text, with no space, it becomes three: *un*, *bel* and *ievable*. The channel name *Termsplained* is three tokens, and a date written as `2026-10-25` is six.

OpenAI's [rule of thumb](https://help.openai.com/en/articles/4936856-what-are-tokens-and-how-to-count-them) for English is about four characters per token, or three quarters of a word, so 100 tokens are roughly 75 words. It is only a rule of thumb, and only for English.

## Not every language costs the same

The same request in other languages gives different counts with the same tokenizer: 12 tokens in English, 14 in French, 19 in German and 17 in Persian. With OpenAI's older tokenizer, the Persian version is 38.

A [2023 study led by Aleksandar Petrov](https://arxiv.org/abs/2305.15425) found that the same text translated into different languages can differ by up to fifteen times in token count. More tokens mean a higher bill, slower answers and less room for your text.

## How the bill works

Most usage-priced AI services charge per million tokens and count two directions separately. **Input tokens** are everything that goes in: your question, the attached report, the instructions the app adds, and often the earlier conversation. **Output tokens** are everything the model writes back, and they usually cost more.

On [Anthropic's price list](https://docs.anthropic.com/en/docs/about-claude/pricing), output costs five times as much as input for every Claude model listed; Claude Sonnet 5, for example, is 2 dollars per million input tokens and 10 per million output. Reasoning models add a twist: OpenAI bills their hidden thinking tokens as output, even though you never see them. A short answer is not always a cheap one.

## A token is not a fixed unit

Each model family uses its own tokenizer, so the same text can be cut into a different number of tokens. Anthropic says its newer Claude models use a tokenizer that produces about 30% more tokens for the same text. A lower price per token therefore does not automatically mean a cheaper job; compare what a real task costs in total.

Tokens also set the limits: how much a model can read at once, its context window, is counted in tokens too.

## Recap

- A token is a chunk of text, often a piece of a word; in English, about three quarters of a word.
- Models read, write and bill in tokens, not words.
- The same text costs a different number of tokens in different languages and with different tokenizers.
- Input and output are billed separately, and output usually costs more; start a fresh chat when you change topic, and ask for the length you need.
- Before budgeting a project, run a sample of your real documents through the provider's token counter.
