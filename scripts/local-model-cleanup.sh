#!/bin/bash
# End Local Model Window: Unload model before trading hours
# Runs at 8 AM

# Unload all models from memory
ollama stop llama3.1:8b 2>/dev/null
ollama stop phi3:mini 2>/dev/null
echo "$(date): Models unloaded"

# RAM freed for trading session
echo "$(date): RAM freed for trading/Zoom"
