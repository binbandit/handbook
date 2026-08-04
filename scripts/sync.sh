#!/bin/sh

set -eu

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
REPOSITORY_ROOT=$(CDPATH= cd -- "$SCRIPT_DIR/.." && pwd)
APPLY=0

if [ "${1:-}" = "--apply" ]; then
    APPLY=1
elif [ "$#" -gt 0 ]; then
    echo "Usage: ./scripts/sync.sh [--apply]" >&2
    exit 2
fi

if [ -n "$(git -C "$REPOSITORY_ROOT" status --porcelain)" ]; then
    echo "sync: commit or stash local changes before rebasing" >&2
    git -C "$REPOSITORY_ROOT" status --short
    exit 1
fi

git -C "$REPOSITORY_ROOT" fetch origin
git -C "$REPOSITORY_ROOT" rebase origin/main

if [ "$APPLY" -eq 1 ]; then
    "$SCRIPT_DIR/link-dotfiles.sh" --apply
else
    "$SCRIPT_DIR/link-dotfiles.sh" --preview
fi

echo
echo "Git is current. Run ./scripts/doctor.sh to verify the device."
