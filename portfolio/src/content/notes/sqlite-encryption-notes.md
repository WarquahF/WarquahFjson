---
title: Notes on SQLite encryption
date: 2026-08-08
summary: Options for encrypting local chat history in Blink, and the trade-offs between them.
tags: [sqlite, security]
---

<!-- PLACEHOLDER — replace with real content before publishing. -->

Blink stores chat history in SQLite, locally. Encrypting it is not about
hiding from anyone in particular — it's about making "the data lives on
your machine" mean something if that machine changes hands.

The short version of the options being compared:

- Encrypt-at-rest via an encrypted SQLite build (e.g. SEE/SQLCipher-style).
- Encrypt sensitive columns at the application layer.
- Full-disk encryption only, and trust the OS.

Each shifts where the key lives, which is the actual decision. More once
there are numbers instead of opinions.
