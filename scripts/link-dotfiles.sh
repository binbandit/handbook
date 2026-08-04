#!/bin/sh

set -eu
umask 077

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
REPOSITORY_ROOT=$(CDPATH= cd -- "$SCRIPT_DIR/.." && pwd)
MANIFEST="$REPOSITORY_ROOT/setup/links.tsv"
MODE="preview"
BACKUP_BASE=${BANDITS_BACKUP_ROOT:-"$HOME/.bandits-handbook-backups"}
TIMESTAMP=$(date -u +%Y%m%dT%H%M%SZ)
BACKUP_ROOT="$BACKUP_BASE/$TIMESTAMP"
ACTION_COUNT=0
BACKUP_COUNT=0
ERROR_COUNT=0
TAB=$(printf '\t')

usage() {
    cat <<'EOF'
Usage: ./scripts/link-dotfiles.sh [mode] [--manifest path]

Modes:
  --preview   Show links and backups without changing anything (default)
  --apply     Back up conflicts, then create or repair links
  --check     Exit nonzero unless every managed link is correct

Manifest format: repository-relative source, a tab, then a ~/ target.
EOF
}

while [ "$#" -gt 0 ]; do
    case "$1" in
        --preview) MODE="preview" ;;
        --apply) MODE="apply" ;;
        --check) MODE="check" ;;
        --manifest)
            shift
            if [ "$#" -eq 0 ]; then
                echo "link-dotfiles: --manifest requires a path" >&2
                exit 2
            fi
            MANIFEST=$1
            ;;
        -h|--help) usage; exit 0 ;;
        *) echo "link-dotfiles: unknown option: $1" >&2; usage >&2; exit 2 ;;
    esac
    shift
done

case "$MANIFEST" in
    /*) ;;
    *) MANIFEST="$REPOSITORY_ROOT/$MANIFEST" ;;
esac

if [ ! -f "$MANIFEST" ]; then
    echo "link-dotfiles: manifest not found: $MANIFEST" >&2
    exit 1
fi

record_error() {
    echo "ERROR  $1" >&2
    ERROR_COUNT=$((ERROR_COUNT + 1))
}

while IFS="$TAB" read -r SOURCE_PATH TARGET_PATH EXTRA_FIELDS || [ -n "${SOURCE_PATH:-}" ]; do
    case "${SOURCE_PATH:-}" in
        ""|\#*) continue ;;
    esac

    if [ -n "${EXTRA_FIELDS:-}" ] || [ -z "${TARGET_PATH:-}" ]; then
        record_error "invalid manifest row for $SOURCE_PATH"
        continue
    fi

    case "/$SOURCE_PATH/" in
        *"/../"*|*"/./"*|//* )
            record_error "unsafe source path: $SOURCE_PATH"
            continue
            ;;
    esac

    case "$TARGET_PATH" in
        "~/"*) ;;
        *)
            record_error "target must start with ~/: $TARGET_PATH"
            continue
            ;;
    esac

    TARGET_RELATIVE=${TARGET_PATH#\~/}
    case "/$TARGET_RELATIVE/" in
        *"/../"*|*"/./"*|//* )
            record_error "unsafe target path: $TARGET_PATH"
            continue
            ;;
    esac

    SOURCE_ABSOLUTE="$REPOSITORY_ROOT/$SOURCE_PATH"
    TARGET_ABSOLUTE="$HOME/$TARGET_RELATIVE"

    if [ ! -e "$SOURCE_ABSOLUTE" ] && [ ! -L "$SOURCE_ABSOLUTE" ]; then
        record_error "missing source: $SOURCE_PATH"
        continue
    fi

    if [ -L "$TARGET_ABSOLUTE" ] && [ "$(readlink "$TARGET_ABSOLUTE")" = "$SOURCE_ABSOLUTE" ]; then
        printf 'OK     %s\n' "$TARGET_PATH"
        continue
    fi

    ACTION_COUNT=$((ACTION_COUNT + 1))

    if [ -e "$TARGET_ABSOLUTE" ] || [ -L "$TARGET_ABSOLUTE" ]; then
        BACKUP_ABSOLUTE="$BACKUP_ROOT/$TARGET_RELATIVE"
        BACKUP_COUNT=$((BACKUP_COUNT + 1))
        printf 'BACKUP %s -> %s\n' "$TARGET_PATH" "$BACKUP_ABSOLUTE"

        if [ "$MODE" = "apply" ]; then
            if [ -e "$BACKUP_ABSOLUTE" ] || [ -L "$BACKUP_ABSOLUTE" ]; then
                record_error "backup target already exists: $BACKUP_ABSOLUTE"
                continue
            fi
            mkdir -p "$(dirname "$BACKUP_ABSOLUTE")"
            mv "$TARGET_ABSOLUTE" "$BACKUP_ABSOLUTE"
        fi
    fi

    printf 'LINK   %s -> %s\n' "$TARGET_PATH" "$SOURCE_PATH"
    if [ "$MODE" = "apply" ]; then
        mkdir -p "$(dirname "$TARGET_ABSOLUTE")"
        ln -s "$SOURCE_ABSOLUTE" "$TARGET_ABSOLUTE"
    fi
done < "$MANIFEST"

if [ "$ERROR_COUNT" -gt 0 ]; then
    echo "link-dotfiles: $ERROR_COUNT error(s)" >&2
    exit 1
fi

if [ "$MODE" = "check" ] && [ "$ACTION_COUNT" -gt 0 ]; then
    echo "link-dotfiles: $ACTION_COUNT managed link(s) need repair" >&2
    exit 1
fi

case "$MODE" in
    apply)
        echo "Applied $ACTION_COUNT link change(s)."
        if [ "$BACKUP_COUNT" -gt 0 ]; then
            echo "Moved $BACKUP_COUNT conflict(s) to $BACKUP_ROOT"
        fi
        ;;
    check) echo "All managed links are correct." ;;
    preview)
        echo "Previewed $ACTION_COUNT link change(s); nothing was modified."
        if [ "$BACKUP_COUNT" -gt 0 ]; then
            echo "$BACKUP_COUNT existing target(s) would be backed up by original path."
        fi
        ;;
esac
