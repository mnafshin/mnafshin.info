---
title: 'What "Secure Software" Means: Five Plain Words and One Missing Check'
description: 'Secure software keeps the risks to what it must protect low, on purpose, and keeps doing so with every change. Five words explain it: asset, threat, vulnerability, risk and control, shown on one small team notes app.'
summary: "Secure software is software whose team knows what it protects, has thought about what could harm it, and has brought each important risk down to a level it accepts. Five words carry the whole idea: asset, threat, vulnerability, risk and control."
pubDate: '2026-11-24T10:00:00+01:00'
section: security
topic: secure-software
relatedVideos:
  - id: S1.1
    title: 'What "secure software" means'
    youtubeId: 5sbJCA49Yf8
    pubDate: '2026-11-12T13:00:00+01:00'
relatedShorts:
  - title: 'Security is a quality, not a final gate'
    youtubeId: P3xDKXbfCOA
  - title: 'What is an asset?'
    youtubeId: p1EsZo4iNaM
  - title: 'What is a threat?'
    youtubeId: uFq6SaV__do
  - title: 'What is a vulnerability?'
    youtubeId: EgBYLuoyu5k
  - title: 'Threat vs. vulnerability'
    youtubeId: G4g00oaEVBo
  - title: 'What is risk?'
    youtubeId: 1vsVwWDlabc
  - title: 'What is a control?'
    youtubeId: 0Xhzej2D--E
  - title: 'Vulnerability vs. risk'
    youtubeId: i4yPIqnFIMc
draft: false
---

Software is **secure** when the people who build it know what it must protect, have thought about what could harm it, and have brought each important risk down to a level they are willing to live with. And they keep doing that every time the software changes. Security is not a stamp you get at the end. It is a quality, like correctness, that every feature either has or lacks.

Five plain words carry this whole idea: **asset**, **threat**, **vulnerability**, **risk** and **control**. We will meet them one at a time, on one small app.

## TeamNotes, the app we use in this path

TeamNotes is a small web app where each team keeps its shared notes, and people see only their own team's notes. It is an illustration for teaching, not a real repository, so the code below is a short sketch.

## Asset: what is worth protecting

Start by asking what TeamNotes holds that someone would care about. Three things stand out:

- the **notes**, which a team may treat as private;
- the **logins**, the passwords and sessions that prove who someone is;
- the **database password** the server uses to reach all of that data.

Each of these is an **asset**: something worth protecting in the software. Every security question starts here.

## Threat and vulnerability: harm outside, weakness inside

Next, ask what could harm those assets. A member of another team might like to read your notes. A script somewhere might try leaked passwords on the login page. Neither is a bug in your code; they simply exist in the world. A **threat** is something that could harm an asset.

Now look inside TeamNotes, at the server rule that returns one note:

```ts
// TeamNotes (illustrative sketch): return one note, before the fix
function getNote(user: User, noteId: string): Note {
  requireSignedIn(user);
  return notes.findById(noteId);   // whose note is it? never asked
}
```

The rule checks that you are signed in. It never checks that the note belongs to your team. That gap is not out in the world; it is in our own code. A **vulnerability** is a weakness that a threat can use to reach an asset.

A handy way to keep the two apart: you can fix a vulnerability, but you cannot fix a threat. The curious member of another team will always exist. What you control is whether your software gives them a way in.

## Risk: chance and harm together

How worried should the team be? Two things decide it. First, the **chance** that it happens: how easy the weakness is to find, and who would try. Second, the **harm** if it does: here, a team's private notes in the wrong hands.

Put the two together and you have a **risk**: the chance that a threat will use a weakness, and the harm that would follow. An easy-to-reach weakness that guards something precious is a high risk.

This particular risk is far from rare. The [OWASP Top 10](https://top10.owasp.org/2025/), the best-known list of the most serious risks to web applications, puts **broken access control** at number one in its 2025 edition. OWASP reports finding some form of it in every application it tested. The missing team check in TeamNotes is exactly that kind of problem.

## Control: what brings the risk down

The fix is one more rule on the server. Before it returns a note, it checks that the note belongs to the reader's team, and it refuses otherwise:

```ts
// TeamNotes (illustrative sketch): return one note, with the team check
function getNote(user: User, noteId: string): Note {
  requireSignedIn(user);
  const note = notes.findById(noteId);
  if (!note || note.teamId !== user.teamId) {
    throw new NotFound();   // deny unless the note is in the reader's team
  }
  return note;
}
```

This rule is a **control**: a measure that reduces a risk. It follows OWASP's own advice for this risk: deny by default, and enforce who owns each record. Answering "not found" instead of "forbidden" is a common extra choice, because then the reply does not even confirm that the note exists.

Notice what the control does and does not do. The threat has not gone away; the curious outsider is still there. But the weakness they needed is closed, so the chance drops, and the risk drops with it. Controls rarely bring a risk to zero. They bring it down to a level the team can accept.

The control has to live on the server. Hiding a button in the browser is not a control, because the browser belongs to the user, not to you. (How to wire such a check in Spring is a framework question; it belongs on the [SpringUniverse path](/spring/).)

## Why security is a quality, not a final gate

Many teams treat security as a gate: build the feature, then run a scan the night before release. But a scan can only look at code that exists. If nobody ever designed the team check, nobody wrote it, and there may be nothing obvious for the scan to find.

OWASP says it directly: an insecure design cannot be fixed by a perfect implementation. NIST's [Secure Software Development Framework](https://csrc.nist.gov/projects/ssdf) notes that few development processes cover security in detail, so security practices need to be added into each one. And CISA, the United States cyber defense agency, asks for products that are [secure by design](https://www.cisa.gov/securebydesign): safe out of the box, because security was part of the design.

So "secure" is not something you test for once. It is the habit of asking the five questions (what do we protect, what could harm it, where are we weak, how bad is it, what reduces it) from a feature's first sketch to its last fix. How that habit fits into a normal sprint is the next article, [Secure by design and the development lifecycle](/security/secure-by-design-lifecycle/).

## Recap

- An **asset** is what is worth protecting; a **threat** could harm it; a **vulnerability** is the weakness a threat can use.
- A **risk** is chance and harm together; a **control** brings it down, rarely to zero.
- You can fix a vulnerability, not a threat. Controls belong on the server, not in the browser.
- Broken access control, like TeamNotes' missing team check, is number one in the OWASP Top 10:2025.
- Secure software keeps its important risks low on purpose, by design and through every change. It is a quality, not a final gate.

## Sources

- NIST CSRC Glossary: [asset](https://csrc.nist.gov/glossary/term/asset), [threat](https://csrc.nist.gov/glossary/term/threat), [vulnerability](https://csrc.nist.gov/glossary/term/vulnerability), [risk](https://csrc.nist.gov/glossary/term/risk), [security control](https://csrc.nist.gov/glossary/term/security_control)
- OWASP: [Top 10:2025](https://top10.owasp.org/2025/), [A01:2025 Broken Access Control](https://top10.owasp.org/2025/A01_2025-Broken_Access_Control/), [A06:2025 Insecure Design](https://top10.owasp.org/2025/A06_2025-Insecure_Design/)
- OWASP Developer Guide: [Security fundamentals](https://devguide.owasp.org/en/02-foundations/01-security-fundamentals/)
- NIST: [SP 800-218, Secure Software Development Framework (SSDF) v1.1](https://csrc.nist.gov/pubs/sp/800/218/final)
- CISA: [Secure by Design](https://www.cisa.gov/securebydesign)
