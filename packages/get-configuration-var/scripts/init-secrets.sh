#!/usr/bin/env bash
# init-secrets.sh - Shell initialization script for Bolt Foundry secrets
# This script exports 1Password secrets to the shell environment

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to log messages
log_info() {
    echo -e "${GREEN}[BF Secrets]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[BF Secrets]${NC} $1"
}

log_error() {
    echo -e "${RED}[BF Secrets]${NC} $1"
}

# Check if we're in a Bolt Foundry project
if [ ! -f "$PWD/deno.jsonc" ] && [ ! -f "$PWD/../deno.jsonc" ] && [ ! -f "$PWD/../../deno.jsonc" ]; then
    log_warn "Not in a Bolt Foundry project directory, skipping secret initialization"
    return 0 2>/dev/null || exit 0
fi

# Check if 1Password CLI is available
if ! command -v op &> /dev/null; then
    log_warn "1Password CLI not found, secrets will not be injected"
    return 0 2>/dev/null || exit 0
fi

# Check if we're authenticated with 1Password
if ! op whoami &> /dev/null; then
    log_warn "Not authenticated with 1Password CLI. Run 'op signin' to authenticate"
    return 0 2>/dev/null || exit 0
fi

# Detect if we're in Replit
if [ -n "$REPL_ID" ] || [ -n "$REPL_SLUG" ] || [ -n "$REPLIT_DB_URL" ]; then
    export BF_IS_REPLIT=true
    log_info "Detected Replit environment"
fi

# Function to export secrets
export_secrets() {
    local cache_file="$HOME/.cache/bf-secrets-env"
    local cache_ttl=300 # 5 minutes
    
    # Create cache directory if it doesn't exist
    mkdir -p "$(dirname "$cache_file")"
    
    # Check if cache is still valid
    if [ -f "$cache_file" ]; then
        local cache_age=$(($(date +%s) - $(stat -f%m "$cache_file" 2>/dev/null || stat -c%Y "$cache_file" 2>/dev/null)))
        if [ "$cache_age" -lt "$cache_ttl" ]; then
            log_info "Loading secrets from cache (${cache_age}s old)"
            # Source the cache file
            set -a
            source "$cache_file"
            set +a
            return 0
        fi
    fi
    
    log_info "Fetching secrets from 1Password..."
    
    # Generate the list of known keys by running the configuration var module
    local keys_json=$(deno eval "
        import { PUBLIC_CONFIG_KEYS, PRIVATE_CONFIG_KEYS } from 'apps/boltFoundry/__generated__/configKeys.ts';
        console.log(JSON.stringify([...PUBLIC_CONFIG_KEYS, ...PRIVATE_CONFIG_KEYS]));
    " 2>/dev/null)
    
    if [ -z "$keys_json" ] || [ "$keys_json" = "[]" ]; then
        log_warn "Could not determine configuration keys, using minimal set"
        # Fallback to essential keys only
        keys_json='["BF_VAULT_ID", "BF_CACHE_TTL_SEC"]'
    fi
    
    # Convert JSON array to bash array
    local keys=()
    while IFS= read -r key; do
        keys+=("$key")
    done < <(echo "$keys_json" | jq -r '.[]' 2>/dev/null || echo "$keys_json" | sed 's/[][",]//g' | tr ' ' '\n')
    
    # Try to get vault ID
    local vault_id="${BF_VAULT_ID:-}"
    if [ -z "$vault_id" ]; then
        # Get all vaults
        local vaults_json=$(op vault list --format=json 2>/dev/null)
        if [ -n "$vaults_json" ]; then
            # Try to find a Bolt Foundry vault by name
            vault_id=$(echo "$vaults_json" | jq -r '.[] | select(.name | test("bolt|foundry|bf"; "i")) | .id' | head -1)
            
            if [ -z "$vault_id" ]; then
                # No BF vault found, use first vault and warn
                vault_id=$(echo "$vaults_json" | jq -r '.[0].id' 2>/dev/null)
                log_warn "No Bolt Foundry vault detected. Available vaults:"
                echo "$vaults_json" | jq -r '.[] | "  \(.name) (\(.id))"' >&2
                log_warn "Set BF_VAULT_ID environment variable to specify the correct vault"
            else
                log_info "Auto-detected Bolt Foundry vault"
            fi
            
            if [ -n "$vault_id" ]; then
                export BF_VAULT_ID="$vault_id"
            fi
        fi
    fi
    
    # Clear the cache file
    > "$cache_file"
    
    # Export each secret
    local exported_count=0
    for key in "${keys[@]}"; do
        # Skip if already in environment (respect local overrides)
        if [ -n "${!key}" ]; then
            continue
        fi
        
        # Try to fetch from 1Password
        if [ -n "$vault_id" ]; then
            local value=$(op read "op://${vault_id}/${key}/value" 2>/dev/null)
            if [ -n "$value" ]; then
                export "$key=$value"
                echo "export $key='$value'" >> "$cache_file"
                ((exported_count++))
            fi
        fi
    done
    
    log_info "Exported ${exported_count} secrets to environment"
}

# Function to be called by users to refresh secrets
bf_refresh_secrets() {
    rm -f "$HOME/.cache/bf-secrets-env"
    export_secrets
}

# Export the function so it's available in the shell
export -f bf_refresh_secrets

# Auto-export on shell initialization
export_secrets