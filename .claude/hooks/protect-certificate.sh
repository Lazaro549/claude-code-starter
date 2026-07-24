#!/bin/bash
# PreToolUse hook: denies any Write or Edit under certificate/, regardless of
# how the request is phrased. certificate/ holds the course completion
# certificate, not project output — see CLAUDE.md "Do not touch".

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

if [[ "$FILE_PATH" == "certificate/"* || "$FILE_PATH" == *"/certificate/"* ]]; then
  jq -n '{
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: "deny",
      permissionDecisionReason: "certificate/ holds the course completion certificate, not project output (see CLAUDE.md \"Do not touch\")."
    }
  }'
else
  exit 0
fi
