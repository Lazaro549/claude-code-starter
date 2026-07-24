---
name: changelog
description: Drafts a CHANGELOG.md entry from recent commits.
argument-hint: [version]
disable-model-invocation: true
allowed-tools: Bash(git log *), Bash(git describe *), Bash(git rev-list *)
---

## Commits since the last tag

!`git log $(git describe --tags --abbrev=0 2>/dev/null || git rev-list --max-parents=0 HEAD)..HEAD --oneline`

## Your task

Draft a `CHANGELOG.md` entry for version $ARGUMENTS summarizing the commits above. If no version was given, head the entry `## [Unreleased]` instead of a version number.

Group entries under `Added`, `Changed`, and `Fixed`, following [Keep a Changelog](https://keepachangelog.com/) conventions. Skip commits that are pure chores — formatting, dependency bumps, CI tweaks — unless they're user-facing.

If `CHANGELOG.md` doesn't exist yet, create it with this entry as the first section. If it exists, insert the new entry above the most recent one and leave the rest of the file untouched.
