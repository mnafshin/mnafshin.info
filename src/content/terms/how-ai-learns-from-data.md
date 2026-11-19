---
title: 'How AI Learns From Data: Supervised, Unsupervised and Reinforcement Learning'
description: Machine learning learns in three classic ways, and the difference is what comes with the data. Right answers mean supervised learning, no answers mean unsupervised learning, and a score for each try means reinforcement learning. One music app shows all three.
pubDate: '2026-11-19T12:00:00Z'
section: terms
topic: how-ai-learns
relatedVideos: []
relatedShorts:
  - title: 'What is supervised learning? Examples with the right answer marked'
    youtubeId: DHWtf0Yg4tM
    draft: true
  - title: 'What is reinforcement learning? It learns by trying what went well'
    youtubeId: JOX5OA07oDE
    draft: true
draft: false
---

Machine learning is the part of AI where a program gets better at a task from data, not from rules a person wrote. It learns in three classic ways: supervised, unsupervised and reinforcement learning. The difference is what comes with the data. It can come with the right answers, with no answers at all, or with only a score for what the program tried. Knowing which one a product uses tells you what it needed to learn, and what it can and cannot know.

## One music app, three kinds of data

Picture a music app that wants to play songs a listener will enjoy. To keep it simple, each song is just two numbers: how fast it is, and how loud and busy it sounds.

The songs and the listener are made up, but every result below comes from a real run of a small program. The same app learns three times, each time from a different kind of data.

## Learning from the right answers

**Supervised learning** means the program learns from examples that already have the right answer marked on them.

The listener goes through sixty songs and marks each one: liked or skipped. The program looks at where the liked songs sit and where the skipped ones sit, and draws a line between the two groups. For this listener, the line depends mostly on loudness, because the songs they like are the loud, busy ones.

A spam filter works the same way. It learns from emails that people have already marked as spam or not spam. Google's [crash course](https://developers.google.com/machine-learning/intro-to-ml/what-is-ml) compares it to a student who studies old exams that include the answers.

## Checking it on songs it has never seen

Learning the examples is not the goal; guessing well on new ones is. So the program gets forty songs it has never seen and guesses liked or skipped for each one. Then its guesses are compared with the listener's own marks.

It gets thirty-five of the forty right. Four of the five misses are the listener's own exceptions: quiet songs they liked anyway. The last one sits right on the line.

The catch is the marking. Somebody has to mark every example first, and that takes time and money.

## Learning with no answers at all

**Unsupervised learning** means the program gets examples with no marks at all and finds groups or patterns on its own.

This time the app gets its whole catalogue, three hundred songs, and nobody marks anything. The task is to sort them into groups of similar songs. A person still makes one choice: how many groups to make. Here it is three. The program does not discover that number. Ask for four, and it makes four.

## How the groups form

Sorting similar things into groups is called **clustering**. A common way to do it is simple enough to follow by hand, and Google's [clustering guide](https://developers.google.com/machine-learning/clustering/kmeans/overview) describes the same steps.

The program places three starting points, far apart. Each song joins the point nearest to it. Then each point moves to the middle of its own songs. The two steps repeat until nothing moves. After four rounds, the app has a slow, quiet group, a middle group and a fast, loud group.

Those names are ours; the program only made the groups. Because the songs were made up, we can check: 298 of the 300 landed with their own kind. The groups help with playlists and with "more like this". But they say nothing about what this listener likes, because nothing in the data told the program.

## Learning from a score

**Reinforcement learning** means the program learns by trying things and getting a score for how each try went.

Now the app plays songs one at a time, each from one of the three groups. If the listener hears a song to the end, the score is one. If they skip it, the score is zero. Nobody tells the app which group would have been right; it only learns how its own choice went. Here the listener is a few lines of code with the same taste as before.

## Playing it safe, and trying something new

The app keeps an average score for each group. Most of the time, it plays the group with the best average so far. One time in ten, it picks a group at random, in case another one is better.

Early on, a single skip from the fast group does not make it give up; one bad try can be bad luck. By the end, ninety-two of its last hundred songs come from the fast group, and the other eight are its random tries. It learned the listener's taste without a single marked song, only from skips and full listens. In a game the score can arrive many moves later, as a win at the end, which makes learning much harder.

## Real systems mix all three

Big systems often combine the three. AlphaGo, the Go program from Google DeepMind, first learned from games played by human experts, which is supervised. Then it improved by playing against itself, with winning as the score, which is reinforcement learning. Its [2016 paper](https://www.nature.com/articles/nature16961) came out after it beat a professional player.

When OpenAI [introduced ChatGPT](https://openai.com/index/chatgpt/), it described the same mix. First came supervised training on conversations people wrote. Then came reinforcement learning, where people ranked the model's answers and those rankings became the score.

So when you meet a new AI product, ask one question: what came with its data? Right answers, no answers, or a score for what it tried?

## Recap

- Machine learning gets better at a task from data, not from rules a person wrote.
- Supervised learning learns from examples with the right answers marked; somebody has to mark them first.
- Unsupervised learning finds groups in examples with no answers; a person still chooses how many groups, and the program names none of them.
- Reinforcement learning learns from a score for each try, and balances what works with trying something new.
- Real systems, from music apps to chatbots, often mix all three.

## Sources

- [Google for Developers: What is machine learning?](https://developers.google.com/machine-learning/intro-to-ml/what-is-ml)
- [Google for Developers: What is k-means clustering?](https://developers.google.com/machine-learning/clustering/kmeans/overview)
- [Silver et al. (2016): Mastering the game of Go with deep neural networks and tree search, Nature](https://www.nature.com/articles/nature16961)
- [OpenAI (2022): Introducing ChatGPT](https://openai.com/index/chatgpt/)
