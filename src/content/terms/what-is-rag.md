---
title: 'What Is RAG? How an AI Looks Things Up Before It Answers'
description: RAG, retrieval-augmented generation, means the AI looks up the right documents first and then answers from them. How the lookup works, where the idea came from, what it fixes, and what it does not.
pubDate: '2026-11-03T12:00:00Z'
section: terms
topic: rag
relatedVideos:
  - id: Explainer
    title: 'What is RAG? How an AI looks things up before it answers'
    youtubeId: rgnr6MIabpc
    pubDate: '2026-11-03T12:00:00Z'
relatedShorts: []
draft: true
---

RAG, short for retrieval-augmented generation, means the AI looks up the right documents first, then answers from them. The model itself does not change; what changes is what it reads right before it answers. That lets a chatbot answer from your own documents, stay current when they change, and show where an answer came from.

## The closed-book problem

Take a company chatbot and one question: *How many vacation days do you get after five years?* A plain chatbot answers at once: 30 days. It sounds sure, but the HR policy says 25. A chatbot that uses RAG says 25 days and shows the policy page it read.

Inside both is a large language model (LLM), a program trained on huge amounts of text to predict the next word. After training, what it learned is frozen, like a student taking a closed-book exam. That causes three problems at work: it has never seen your company's documents, its knowledge stops on the day training ended, and when it does not know, it often guesses. The 30 days was a **hallucination**, an answer that sounds right but is false.

## What the letters mean

RAG turns the closed-book exam into an open-book one.

- **Retrieval**: before it answers, the system searches your documents for the parts that matter.
- **Augmented**: those parts are added to the prompt, right next to your question. The prompt is all the text the model reads before it writes.
- **Generation**: the model writes its answer from what it was just given.

## Three steps: search, build, answer

Follow the vacation question. First, the question goes to a search tool called the **retriever**, which brings back the best few passages; here, three paragraphs from the HR policy. Second, the system builds a new prompt that holds an instruction, the three passages and the question. Third, the model reads that prompt and writes the answer. Because the policy is right there, it can quote the rule and name the document.

## How search finds meaning

To make documents searchable, each one is cut into small pieces called **chunks**, often a few hundred words. Each chunk is turned into a list of numbers called an **embedding**, which captures what the text is about: texts with similar meaning get similar numbers. The numbers are kept in a **vector database**.

A question is turned into numbers the same way, and the database returns the chunks with the closest numbers. So a search for *paid time off* can find a paragraph that only says *annual leave*: it searches by meaning, not by exact words. OpenAI's [retrieval guide](https://developers.openai.com/api/docs/guides/retrieval) shows typical chunking settings.

## Where the idea came from

The name comes from a [2020 paper](https://arxiv.org/abs/2005.11401) by Patrick Lewis and colleagues at Facebook AI Research, University College London and New York University. They connected a language model to Wikipedia, cut into chunks of 100 words, about 21 million of them. People judged its answers more factual than those of the same kind of model without search far more often.

Then the team swapped in an older Wikipedia, from 2016. Answers about world leaders changed to match, with no retraining. To update what a RAG system knows, you update the documents.

## What it fixes, and what it does not

RAG lets an AI answer from your own documents, stay current when they change, and show its sources so people can check. It also makes hallucinations rarer, because the facts are right in front of the model.

It does not end them. A [Stanford study](https://law.stanford.edu/publications/hallucination-free-assessing-the-reliability-of-leading-ai-legal-research-tools/) of legal research tools that work this way found they still made things up on more than one in six questions. If search brings back the wrong chunk, the model writes a smooth answer from the wrong text. If the documents are old or disagree with each other, so do the answers. And if nothing useful is found, a good system should say "I don't know". When a RAG chatbot is wrong, check the search step first.

## Three questions to ask about a RAG product

1. Which documents does it search, and how often are they updated?
2. Does every answer show its sources?
3. How do you test that search finds the right passage?

Those answers tell you more than any demo.

## Recap

- RAG means look it up first, then answer from what was found; the model itself does not change.
- It fixes three closed-book problems: no access to your documents, a training cutoff, and guessing.
- Documents are cut into chunks and searched by meaning with embeddings.
- To update what it knows, update the documents; no retraining needed.
- It makes hallucinations rarer, not impossible: when it is wrong, check the search step and the documents first.
