#!/bin/sh

set -eu

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
REPOSITORY_ROOT=$(CDPATH= cd -- "$SCRIPT_DIR/.." && pwd)
APPLY=0
INSTALL_TOOLS=0

usage() {
    cat <<'EOF'
Usage: ./scripts/bootstrap.sh [options]

Preview or apply the public Bandit's Handbook setup.

Options:
  --apply          Back up conflicts and create the managed links
  --install-tools  Install missing Homebrew packages from setup/Brewfile
  -h, --help       Show this help

The default is read-only. It checks the tool bundle and previews every link.
No existing file is overwritten. With --apply, conflicts move into a private
timestamped backup tree under ~/.bandits-handbook-backups first.
EOF
}

while [ "$#" -gt 0 ]; do
    case "$1" in
        --apply) APPLY=1 ;;
        --install-tools) INSTALL_TOOLS=1 ;;
        -h|--help) usage; exit 0 ;;
        *) echo "bootstrap: unknown option: $1" >&2; usage >&2; exit 2 ;;
    esac
    shift
done

if [ "$(id -u)" -eq 0 ]; then
    echo "bootstrap: do not run this script as root" >&2
    exit 1
fi

if ! command -v git >/dev/null 2>&1; then
    echo "bootstrap: git is required" >&2
    exit 1
fi

if [ "$INSTALL_TOOLS" -eq 1 ]; then
    if [ "$(uname -s)" != "Darwin" ]; then
        echo "bootstrap: the managed Homebrew tool bundle is macOS-only" >&2
        exit 1
    fi

    if ! command -v brew >/dev/null 2>&1; then
        echo "bootstrap: Homebrew is required for --install-tools" >&2
        echo "Install it from https://brew.sh, inspect the installer, then rerun." >&2
        exit 1
    fi

    brew bundle install --file "$REPOSITORY_ROOT/setup/Brewfile"
elif command -v brew >/dev/null 2>&1; then
    if ! brew bundle check --file "$REPOSITORY_ROOT/setup/Brewfile"; then
        echo
        echo "Some optional tools are missing. Rerun with --install-tools to install them."
    fi
fi

if [ "$APPLY" -eq 1 ]; then
    "$SCRIPT_DIR/link-dotfiles.sh" --apply
else
    "$SCRIPT_DIR/link-dotfiles.sh" --preview
fi

echo
echo "Bootstrap complete. Run ./scripts/doctor.sh for a full health check."
