#!/bin/bash
# Local Model Window: Kill memory hogs, run Ollama
# Runs at 4 AM, model available until 8 AM

# Kill Zoom
pkill -f "zoom.us" 2>/dev/null
echo "$(date): Killed Zoom"

# Kill Chrome (both profiles)
pkill -f "Google Chrome" 2>/dev/null
echo "$(date): Killed Chrome"

# Wait for memory to free
sleep 5

# Warm up the model (loads into memory)
ollama run llama3.1:8b "System ready. Local model loaded." 2>&1 | tail -5
echo "$(date): Llama 3.1 8B loaded and ready"
