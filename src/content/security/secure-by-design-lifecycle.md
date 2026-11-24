---
title: 'Secure by Design: Where Security Work Goes in a Normal Sprint'
description: 'Secure by design means security is planned, built and checked inside your normal way of working. NIST groups that work into four kinds of practice, and each one has a natural place before, during and after a sprint.'
summary: "Secure by design means security is part of how software is planned, written, reviewed and maintained, not a step after it. NIST's SSDF sorts that work into four groups: prepare, protect, produce and respond, and each fits into an ordinary sprint."
pubDate: '2026-11-24T10:05:00+01:00'
section: security
topic: secure-by-design
relatedVideos:
  - id: S1.2
    title: 'Secure by design: where security fits in a normal sprint'
    youtubeId: BgjGiWYoUTM
    pubDate: '2026-11-13T13:00:00+01:00'
draft: false
---

**Secure by design** means that security is part of how a team plans, writes, reviews and maintains its software, from the first idea onward. It is not a separate project and not a final check. The security work lives inside the process the team already has, whether that is a two-week sprint or something slower.

So what is the security work, and where in a sprint does it go? NIST, the United States standards institute, gives a useful answer in its **Secure Software Development Framework**, or **SSDF** (published as SP 800-218).

## The SSDF in one paragraph

The SSDF is a short set of high-level practices for building software securely. NIST wrote it because few development processes say much about security, so these practices are meant to be added to whatever process you already use: waterfall, agile or DevOps. It describes outcomes, not tools, and NIST says plainly that it is not a checklist. Each team picks how much of each practice it needs, based on its own risks. The practices fall into four groups:

| Group | In one line | Where it sits in a sprint |
|---|---|---|
| Prepare the organization | people, rules and tools are ready | before the work |
| Protect the software | code and releases are safe from tampering | around the work |
| Produce well-secured software | each feature has as few weaknesses as possible | inside the work |
| Respond to vulnerabilities | problems found later are fixed and learned from | after the release |

The right-hand column is our teaching picture, not NIST's wording, but it makes the four groups easy to place. Let us follow one sprint of TeamNotes, the small team notes app used across this path, where every team must see only its own notes. This sprint adds one feature: **search**.

## Prepare: before anyone writes code

Preparing means making sure the team's people, processes and technology are ready for secure work. For a small team that can be three plain things:

1. **Write the security requirements down once.** For TeamNotes: *every request that reads notes must check the reader's team.*
2. **Add a security line to the definition of done**, so no feature counts as finished without it. NIST itself gives this as an example.
3. **Make sure everyone knows their part**, and has the training for it.

## Protect: around the code and every release

Protecting the software means keeping all of it, including source code, build settings and releases, safe from tampering and from people who should not have access. In TeamNotes that means two things. Only team members can change the code, each with no more access than they need. And every release comes with a way to check that it is the real one and was not changed on the way. The tools for that are a later topic.

## Produce: inside the feature

Producing well-secured software is where most of the sprint happens. For search, security shows up four times: in the **design**, the **code**, the **review** and the **test**.

**Design.** Before coding, the team asks what could go wrong with search. The clearest answer: search could show notes from another team. So the design says search looks only inside the reader's team. (A structured way to ask "what could go wrong" is [threat modeling](/security/threat-modeling-in-30-minutes/), the next article.)

**Code.** The search function follows the design:

```ts
// TeamNotes (illustrative sketch): search only the reader's team
function searchNotes(user: User, words: string): Note[] {
  requireSignedIn(user);
  return notes.search({ teamId: user.teamId, text: words });
}
```

Notes from other teams are never even looked at, because the team is part of the query, not a filter applied afterwards.

**Review.** A teammate reads the change against the requirement written in *prepare*: does every request that reads notes check the reader's team? Here it does.

**Test.** The team adds an automated test that proves the requirement, not just the happy path:

```ts
// TeamNotes (illustrative sketch): the security line in the definition of done
test("search never returns another team's notes", () => {
  const ana = memberOf("team-a");
  addNote("team-b", "budget plan");
  expect(searchNotes(ana, "budget")).toEqual([]);
});
```

This is the opposite of a scan the night before release. The team check was designed, written, reviewed and tested as part of the feature. NIST makes the same point: the earlier security is handled, the less effort it takes to reach the same level of security.

## Respond: after the release, and back into the next sprint

Search goes live. But real software is rarely perfect; Britain's National Cyber Security Centre notes that all but the simplest software is likely to contain bugs, some with a security impact. So the team gives people a clear way to report problems.

Say a customer reports that an older feature, **export**, lets a user download another team's notes. The team responds in three steps:

1. **Confirm and fix it quickly**, because the risk is high.
2. **Ask why it happened**, and look for the same missing check everywhere else that reads notes.
3. **Improve the process**: a team-check test is now part of the definition of done for every feature that reads notes.

The third step closes the loop. What the team learns from responding goes back into *prepare*, so the next sprint starts a little better than the last.

## What CISA adds: secure by default

CISA, the United States cyber defense agency, uses "secure by design" for the same idea at product level, and pairs it with **secure by default**: a product should be safe out of the box, with protections such as multi-factor sign-in and logging included at no extra cost. For TeamNotes, that would mean the team check is simply how the app works, not a setting someone has to turn on.

## Recap

- Secure by design means security work lives inside your normal process, from the first design to the last fix.
- NIST's SSDF sorts that work into four groups: prepare the organization, protect the software, produce well-secured software, and respond to vulnerabilities.
- In a sprint: prepare comes before, protect surrounds the work, produce lives inside each feature, respond follows the release.
- Inside a feature, security appears four times: design, code, review and test.
- The SSDF is not a checklist; each team scales each practice to its own risks.

## Sources

- NIST: [SP 800-218, Secure Software Development Framework (SSDF) v1.1](https://csrc.nist.gov/pubs/sp/800/218/final) and the [SSDF project page](https://csrc.nist.gov/projects/ssdf)
- CISA: [Secure by Design](https://www.cisa.gov/securebydesign)
- UK NCSC: [Secure development principles](https://www.ncsc.gov.uk/collection/developers-collection/principles)
- OWASP Developer Guide: [Secure development and integration](https://devguide.owasp.org/en/02-foundations/02-secure-development/)
