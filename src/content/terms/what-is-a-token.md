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
draft: false
---

A token is a chunk of text that a language model treats as one unit: a whole word, part of a word, a single character or a punctuation mark. Models read in tokens, write in tokens, and most AI services bill in tokens. Because a token is not a word, both the count and the bill can surprise you.

## Ten words, twelve tokens

Take a request you might send at work: *Can you summarise the attached report in three bullet points?* You count ten words. The model counts twelve tokens.

A **tokenizer** is the tool that cuts text into tokens. The demo uses [tiktoken](https://github.com/openai/tiktoken), the open-source tokenizer OpenAI publishes for its models. It loads two of OpenAI's tokenizers, a current one and an older one, and prints the pieces of each text:

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

Most words are one token each, and the space in front of a word belongs to its token. *Summarise* is cut in two, *summar* and *ise*. The question mark is a token of its own. Each token also has an ID number, and the model never sees the letters at all, only the list of numbers.

## Why word pieces

A tokenizer could give every word its own token, but no word list is ever complete: there are new names, typos, product codes and other languages. It could use single letters instead, but then every sentence becomes a very long list, and the model does far more work for the same text.

Word pieces are the middle ground. The tokenizer learns them from a large pile of text: it starts with tiny pieces and keeps joining the pairs that appear together most often. This method is called byte pair encoding, and [Sennrich and colleagues](https://arxiv.org/abs/1508.07909) brought it to language models in 2015. The result is a fixed list of pieces, called the vocabulary. Common words get one token; rare words are built from several.

## The same word can count differently

That is why counts can surprise you. *unbelievable* with a space in front is one token. At the very start of a text, with no space, it becomes three: *un*, *bel* and *ievable*. The channel name *Termsplained* is also three tokens.

It also explains a familiar slip. Ask a model how many letters are in a word, and it may get it wrong. It never saw the letters, only a few pieces with ID numbers.

OpenAI's [rule of thumb](https://help.openai.com/en/articles/4936856-what-are-tokens-and-how-to-count-them) for English is about four characters per token, or three quarters of a word, so 100 tokens are roughly 75 words. It is only a rule of thumb, and only for English.

## Other languages cost more

The same request gives a different count in other languages, even with the same tokenizer: 12 tokens in English, 14 in French, 19 in German and 17 in Persian. With OpenAI's older tokenizer, the Persian version needs 38.

A [2023 study](https://arxiv.org/abs/2305.15425) found that the same text, translated into different languages, can differ by up to fifteen times in token count. More tokens mean a higher bill, slower answers and less room for your own text.

## How the bill works

Most usage-priced AI services charge per million tokens, and they count two directions separately. **Input tokens** are everything that goes in: your question, the attached report, the instructions the app adds, and often the earlier conversation. **Output tokens** are everything the model writes back, and they usually cost more.

On [Anthropic's price list](https://docs.anthropic.com/en/docs/about-claude/pricing), output costs five times as much as input for every Claude model listed. Some models also think before they answer, and OpenAI bills those hidden thinking tokens as output, even though you never see them. A short answer is not always a cheap one.

## A token is not a fixed unit

Each model family uses its own tokenizer, so the same text can become a different number of tokens. Anthropic says its newer Claude models produce about 30% more tokens for the same text than earlier ones. A lower price per token therefore does not always mean a cheaper job; compare what a real task costs in total.

Tokens set the limits too. How much a model can read at once, its context window, is counted in tokens.

## Recap

- A token is a chunk of text, often a piece of a word; in English, about three quarters of a word.
- Models read, write and bill in tokens, and never see the letters themselves.
- The same text gives a different count in different languages and with different tokenizers.
- Input and output are billed separately, and output usually costs more.
- Before budgeting a project, run a sample of your real documents through the provider's token counter.

## Sources

- [GitHub: openai/tiktoken](https://github.com/openai/tiktoken)
- [Sennrich et al. (2015): Neural Machine Translation of Rare Words with Subword Units](https://arxiv.org/abs/1508.07909)
- [OpenAI Help Center: Understanding and counting tokens](https://help.openai.com/en/articles/4936856-what-are-tokens-and-how-to-count-them)
- [Petrov et al. (2023): Language Model Tokenizers Introduce Unfairness Between Languages](https://arxiv.org/abs/2305.15425)
- [Claude Platform docs: Pricing](https://docs.anthropic.com/en/docs/about-claude/pricing)
