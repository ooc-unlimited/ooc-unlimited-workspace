#!/bin/bash
# discord-post.sh — Quick Discord poster for agents
# Usage: discord-post.sh <channel> <message> [--username "Name"]
# Example: discord-post.sh alerts "🚨 NQ down 200pts!"
# Example: discord-post.sh donna "Task complete" --username "Donna"

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
exec node "$SCRIPT_DIR/discord-post.js" "$@"
