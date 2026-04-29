#!/bin/bash

# Status line script for Claude Code
# Displays: Model name | [progress bar] percentage | tokens used/max

input=$(cat)

# Extract values using jq
model=$(echo "$input" | jq -r '.model.display_name // "Unknown"')
used_pct=$(echo "$input" | jq -r '.context_window.used_percentage // empty')
total_tokens=$(echo "$input" | jq -r '.context_window.context_window_size // 200000')
current_input=$(echo "$input" | jq -r '.context_window.current_usage.input_tokens // 0')
current_output=$(echo "$input" | jq -r '.context_window.current_usage.output_tokens // 0')

# Calculate total tokens used
total_used=$((current_input + current_output))

# Build the status line
status=""

# Model name (shorten if needed)
if [ -n "$model" ] && [ "$model" != "Unknown" ]; then
    # Extract just the model identifier (e.g., "Opus 4.5" from "Claude 3.5 Opus")
    status="$model"
fi

# Progress bar and percentage
if [ -n "$used_pct" ]; then
    # Create progress bar with 20 characters
    filled=$(printf "%.0f" "$(echo "$used_pct * 0.2" | bc)")
    empty=$((20 - filled))

    bar=""
    for ((i=0; i<filled; i++)); do
        bar="${bar}█"
    done
    for ((i=0; i<empty; i++)); do
        bar="${bar}░"
    done

    # Format percentage as integer
    pct_int=$(printf "%.0f" "$used_pct")

    status="$status | [$bar] ${pct_int}% | ${total_used}/${total_tokens} tokens"
fi

# Output the status line
if [ -n "$status" ]; then
    printf "%s" "$status"
else
    printf "Ready"
fi