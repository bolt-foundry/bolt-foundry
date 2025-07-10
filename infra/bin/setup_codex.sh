#!/usr/bin/env bash
set -euo pipefail

###############################################################################
# 0. Helpers
###############################################################################
need() { command -v "$1" >/dev/null 2>&1; }
log()  { printf '\e[1;32m==>\e[0m %s\n' "$*"; }

###############################################################################
# 0.1  Enable persistent logging *immediately*
###############################################################################
LOG_FILE="/var/log/codex-setup.log"
mkdir -p "$(dirname "$LOG_FILE")"

# Redirect both stdout and stderr to the log file *and* to the console
exec > >(tee -a "$LOG_FILE") 2>&1

log "-------------------------------------------------------------------------------"
log "Codex setup script starting at $(date '+%Y-%m-%d %H:%M:%S %Z')"

# Always record the final exit status
trap 'log "Script finished with exit code $? at $(date "+%Y-%m-%d %H:%M:%S %Z")"' EXIT

###############################################################################
# 1. Detect OS / distro
###############################################################################
OS="$(uname -s)"
DISTRO=""
if [[ "$OS" == "Linux" && -f /etc/os-release ]]; then
  DISTRO="$(. /etc/os-release; echo "$ID")"
fi

###############################################################################
# 2. Install / refresh CA certificates
###############################################################################
case "$OS" in
  Darwin)
    log "macOS detected — system root store is usually populated."
    ;;
  Linux)
    case "$DISTRO" in
      ubuntu|debian)
        log "Installing CA certificates on Debian/Ubuntu…"
        sudo apt update
        sudo apt install -y ca-certificates
        sudo update-ca-certificates --fresh
        ;;
      alpine)
        log "Installing CA certificates on Alpine…"
        sudo apk update
        sudo apk add ca-certificates
        sudo update-ca-certificates
        ;;
      centos|rhel|fedora)
        log "Installing CA certificates on RHEL/CentOS/Fedora…"
        sudo yum install -y ca-certificates
        sudo update-ca-trust extract
        ;;
      *)
        log "Unknown Linux distro ($DISTRO) — install ca-certificates manually if needed."
        ;;
    esac
    ;;
  *) echo "Unsupported OS: $OS"; exit 1 ;;
esac

###############################################################################
# 3. Install Determinate Nix (if missing)
###############################################################################
if ! need nix; then
  log "Installing Determinate Nix…"
  curl --proto '=https' --tlsv1.2 -sSfL https://install.determinate.systems/nix \
    | bash -s -- install linux --no-confirm --init none

  # Enable nix in this very shell
  if [[ -f /nix/var/nix/profiles/default/etc/profile.d/nix-daemon.sh ]]; then
    . /nix/var/nix/profiles/default/etc/profile.d/nix-daemon.sh
  elif [[ -f "$HOME/.nix-profile/etc/profile.d/nix.sh" ]]; then
    . "$HOME/.nix-profile/etc/profile.d/nix.sh"
  fi
fi
log "Nix version: $(nix --version 2>/dev/null || echo 'nix not found')"

###############################################################################
# 4. Auto-enter Codex dev-shell in *interactive* shells
###############################################################################
FLAKE_URL="https://flakehub.com/f/bolt-foundry/bolt-foundry/*"
DEV_HOOK=$(cat <<'EOS'
# ─── Auto-enter Bolt-Foundry Codex dev-shell ────────────────────────────────
if [[ -z "$IN_NIX_SHELL" && $- == *i* ]]; then
  exec nix develop "https://flakehub.com/f/bolt-foundry/bolt-foundry/*#codex" \
       --command "$SHELL" -l
fi
# ────────────────────────────────────────────────────────────────────────────
EOS
)

log "Configuring ~/.bashrc to launch Codex dev-shell…"
if ! grep -Fq "Auto-enter Bolt-Foundry Codex" "$HOME/.bashrc" 2>/dev/null; then
  printf "\n%s\n" "$DEV_HOOK" >> "$HOME/.bashrc"
  log "✓ Added dev-shell hand-off to ~/.bashrc"
else
  log "✓ Dev-shell hook already present in ~/.bashrc"
fi

###############################################################################
# 5. Make login shells source ~/.bashrc
###############################################################################
PROFILE_FILE="$HOME/.bash_profile"
[[ -f $PROFILE_FILE ]] || PROFILE_FILE="$HOME/.profile"

SOURCE_LINE='[ -r ~/.bashrc ] && . ~/.bashrc'
if ! grep -Fxq "$SOURCE_LINE" "$PROFILE_FILE" 2>/dev/null; then
  printf "\n# Source ~/.bashrc for login shells\n%s\n" "$SOURCE_LINE" >> "$PROFILE_FILE"
  log "✓ Added ~/.bashrc sourcing line to $(basename "$PROFILE_FILE")"
else
  log "✓ $(basename "$PROFILE_FILE") already sources ~/.bashrc"
fi

###############################################################################
# 6. (Optional) hand the env to non-interactive Bash via $BASH_ENV
###############################################################################
BASH_ENV_FILE="$HOME/.bash_env"
BASH_ENV_LINE='export BASH_ENV="$HOME/.bash_env"'

if [[ ! -f $BASH_ENV_FILE ]]; then
  cat > "$BASH_ENV_FILE" <<'EOF'
# Auto-import Codex environment for non-interactive Bash
if [[ -z "$IN_NIX_SHELL" ]]; then
  eval "$(nix print-dev-env https://flakehub.com/f/bolt-foundry/bolt-foundry/*#codex)"
fi
EOF
  log "✓ Created ~/.bash_env helper"
fi

if ! grep -Fxq "$BASH_ENV_LINE" "$PROFILE_FILE"; then
  printf "\n# Provide Codex env to non-interactive Bash\n%s\n" "$BASH_ENV_LINE" >> "$PROFILE_FILE"
  log "✓ Added BASH_ENV export to $(basename "$PROFILE_FILE")"
else
  log "✓ $(basename "$PROFILE_FILE") already exports BASH_ENV"
fi

###############################################################################
# 7. PRE-BUILD the Codex dev-shell so first launch is instant
###############################################################################
log "Pre-building Codex dev-shell (this can take a few minutes)…"
if nix develop "${FLAKE_URL}#codex" --print-build-logs -v --command true; then
  log "✓ Codex dev-shell built and cached"
else
  log "⚠️  Pre-build failed — you can still enter it manually later"
fi

###############################################################################
# 8. Done
###############################################################################
log "Setup complete — new shells will now start inside Codex 🎉"