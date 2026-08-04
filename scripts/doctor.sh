#!/bin/sh

set -eu

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
REPOSITORY_ROOT=$(CDPATH= cd -- "$SCRIPT_DIR/.." && pwd)
FAILED=0

run_check() {
    LABEL=$1
    shift
    printf '%-28s' "$LABEL"
    if "$@" >/dev/null 2>&1; then
        echo "ok"
    else
        echo "needs attention"
        FAILED=1
    fi
}

run_check "Git available" command -v git
run_check "Managed links" "$SCRIPT_DIR/link-dotfiles.sh" --check

if command -v fish >/dev/null 2>&1; then
    run_check "Fish syntax" fish --no-execute \
        "$REPOSITORY_ROOT/dotfiles/config/fish/config.fish" \
        "$REPOSITORY_ROOT/dotfiles/config/fish/conf.d/00-init.fish" \
        "$REPOSITORY_ROOT/dotfiles/config/fish/conf.d/10-abbr.fish" \
        "$REPOSITORY_ROOT/dotfiles/config/fish/functions/handbook-sync.fish"
fi

if command -v node >/dev/null 2>&1; then
    run_check "Public boundary" node "$SCRIPT_DIR/check-secrets.mjs"
    run_check "Content integrity" node "$SCRIPT_DIR/check-content.mjs"
fi

if command -v brew >/dev/null 2>&1; then
    run_check "Homebrew bundle" brew bundle check --file "$REPOSITORY_ROOT/setup/Brewfile"
fi

if [ "$FAILED" -ne 0 ]; then
    echo
    echo "Doctor found one or more items that need attention."
    exit 1
fi

echo
echo "Device setup is healthy."
