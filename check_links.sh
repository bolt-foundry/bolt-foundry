#!/bin/bash

# Script to check markdown links
cd /home/runner/workspace

echo "Checking markdown links..."
echo "========================="

# Function to check if a file exists
check_link() {
    local file="$1"
    local link="$2"
    local dir=$(dirname "$file")
    
    # Handle absolute paths
    if [[ "$link" =~ ^/ ]]; then
        target="/home/runner/workspace$link"
    else
        # Handle relative paths
        target=$(cd "$dir" && realpath -m "$link" 2>/dev/null || echo "")
    fi
    
    if [ -z "$target" ] || [ ! -f "$target" ]; then
        echo "BROKEN: $file -> $link"
        return 1
    else
        return 0
    fi
}

broken_count=0

# Check all markdown files for links
while IFS= read -r file; do
    # Extract links from the file
    while IFS= read -r link; do
        if ! check_link "$file" "$link"; then
            ((broken_count++))
        fi
    done < <(grep -oE '\[([^\]]+)\]\(([./][^)]+\.md[^)]*)\)' "$file" | sed -E 's/\[[^\]]+\]\(([^)]+)\)/\1/')
done < <(find . -name "*.md" -type f | grep -v node_modules | grep -v .next | grep -v build)

echo "========================="
echo "Total broken links: $broken_count"