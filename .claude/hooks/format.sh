#!/bin/bash
# PostToolUse hook: auto-formats any file Claude edits or writes with Prettier.
# Reads the hook's JSON payload from stdin (see .claude/settings.json).

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

if [ -z "$FILE_PATH" ] || [ ! -f "$FILE_PATH" ]; then
  exit 0
fi

# --no-install: format only if prettier is already installed, rather than
# letting npx silently fetch it. A missing prettier just means we skip
# formatting for this edit instead of failing the tool call.
npx --no-install prettier --write "$FILE_PATH" >/dev/null 2>&1

exit 0
