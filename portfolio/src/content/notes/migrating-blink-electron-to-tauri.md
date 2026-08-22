---
title: Starting the Electron → Tauri migration
date: 2026-08-18
summary: First pass at moving Blink off Electron — what changes, what stays, and why it's worth it.
tags: [tauri, rust, electron]
---

<!-- PLACEHOLDER — replace with real content before publishing. -->

Blink started as an Electron app because that was the fastest way to get
something working. The trade-off is well known: a Chromium runtime for what
is mostly one window and a few native calls.

The Tauri migration is about shrinking that overhead. The plan so far:

- Keep the existing UI layer; replace the shell.
- Move provider routing into Rust incrementally, not all at once.
- Measure startup time and memory before/after at each step.

Nothing here is final — the point of writing it down is to have a baseline
to argue with later.
