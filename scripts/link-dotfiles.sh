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
LOCK_DIRECTORY=""

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

path_is_safe() {
    case "/$1/" in
        *"/../"*|*"/./"*|//* ) return 1 ;;
        *) return 0 ;;
    esac
}

target_parent_is_safe() {
    CHECK_TARGET=$1
    CHECK_PARENT=$(dirname "$CHECK_TARGET")

    while [ ! -e "$CHECK_PARENT" ] && [ ! -L "$CHECK_PARENT" ]; do
        CHECK_NEXT_PARENT=$(dirname "$CHECK_PARENT")
        if [ "$CHECK_NEXT_PARENT" = "$CHECK_PARENT" ]; then
            return 1
        fi
        CHECK_PARENT=$CHECK_NEXT_PARENT
    done

    if [ ! -d "$CHECK_PARENT" ]; then
        return 1
    fi

    CHECK_RESOLVED_PARENT=$(CDPATH= cd -- "$CHECK_PARENT" 2>/dev/null && pwd -P) || return 1
    case "$CHECK_RESOLVED_PARENT" in
        "$HOME_PHYSICAL"|"$HOME_PHYSICAL"/*) return 0 ;;
        *) return 1 ;;
    esac
}

validate_manifest() {
    if ! awk -F '\t' '
        /^[[:space:]]*#/ || NF == 0 { next }
        NF >= 2 && $2 != "" {
            seen[$2]++
            if (seen[$2] == 2) {
                printf "ERROR  duplicate target in manifest: %s\n", $2 > "/dev/stderr"
                duplicate = 1
            }
        }
        END { exit duplicate }
    ' "$MANIFEST"; then
        ERROR_COUNT=$((ERROR_COUNT + 1))
    fi

    while IFS="$TAB" read -r SOURCE_PATH TARGET_PATH EXTRA_FIELDS || [ -n "${SOURCE_PATH:-}" ]; do
        case "${SOURCE_PATH:-}" in
            ""|\#*) continue ;;
        esac

        if [ -n "${EXTRA_FIELDS:-}" ] || [ -z "${TARGET_PATH:-}" ]; then
            record_error "invalid manifest row for $SOURCE_PATH"
            continue
        fi

        if ! path_is_safe "$SOURCE_PATH"; then
            record_error "unsafe source path: $SOURCE_PATH"
            continue
        fi

        case "$TARGET_PATH" in
            "~/"*) ;;
            *)
                record_error "target must start with ~/: $TARGET_PATH"
                continue
                ;;
        esac

        TARGET_RELATIVE=${TARGET_PATH#\~/}
        if ! path_is_safe "$TARGET_RELATIVE"; then
            record_error "unsafe target path: $TARGET_PATH"
            continue
        fi

        SOURCE_ABSOLUTE="$REPOSITORY_ROOT/$SOURCE_PATH"
        TARGET_ABSOLUTE="$HOME/$TARGET_RELATIVE"

        if [ ! -e "$SOURCE_ABSOLUTE" ] && [ ! -L "$SOURCE_ABSOLUTE" ]; then
            record_error "missing source: $SOURCE_PATH"
            continue
        fi

        if ! target_parent_is_safe "$TARGET_ABSOLUTE"; then
            record_error "target parent escapes the physical home directory: $TARGET_PATH"
        fi
    done < "$MANIFEST"
}

release_lock() {
    if [ -n "$LOCK_DIRECTORY" ]; then
        rmdir "$LOCK_DIRECTORY" 2>/dev/null || true
    fi
}

acquire_lock() {
    mkdir -p "$BACKUP_BASE"
    LOCK_DIRECTORY="$BACKUP_BASE/.link-dotfiles.lock"
    if ! mkdir "$LOCK_DIRECTORY" 2>/dev/null; then
        echo "link-dotfiles: another apply may be running: $LOCK_DIRECTORY" >&2
        echo "Remove the lock only after confirming no linker process is active." >&2
        exit 1
    fi
    trap 'release_lock' EXIT
    trap 'release_lock; exit 130' HUP INT TERM
}

process_manifest() {
    while IFS="$TAB" read -r SOURCE_PATH TARGET_PATH EXTRA_FIELDS || [ -n "${SOURCE_PATH:-}" ]; do
        case "${SOURCE_PATH:-}" in
            ""|\#*) continue ;;
        esac

        TARGET_RELATIVE=${TARGET_PATH#\~/}
        SOURCE_ABSOLUTE="$REPOSITORY_ROOT/$SOURCE_PATH"
        TARGET_ABSOLUTE="$HOME/$TARGET_RELATIVE"
        ROW_BACKUP=""

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
                if ! mkdir -p "$(dirname "$BACKUP_ABSOLUTE")"; then
                    record_error "could not create backup directory for $TARGET_PATH"
                    continue
                fi
                if ! mv "$TARGET_ABSOLUTE" "$BACKUP_ABSOLUTE"; then
                    record_error "could not back up $TARGET_PATH"
                    continue
                fi
                ROW_BACKUP=$BACKUP_ABSOLUTE
            fi
        fi

        printf 'LINK   %s -> %s\n' "$TARGET_PATH" "$SOURCE_PATH"
        if [ "$MODE" = "apply" ]; then
            if ! mkdir -p "$(dirname "$TARGET_ABSOLUTE")"; then
                record_error "could not create target directory for $TARGET_PATH"
            elif ! ln -s "$SOURCE_ABSOLUTE" "$TARGET_ABSOLUTE"; then
                record_error "could not link $TARGET_PATH"
            else
                continue
            fi

            if [ -n "$ROW_BACKUP" ] && [ ! -e "$TARGET_ABSOLUTE" ] && [ ! -L "$TARGET_ABSOLUTE" ]; then
                if mv "$ROW_BACKUP" "$TARGET_ABSOLUTE"; then
                    echo "RESTORE $TARGET_PATH after link failure" >&2
                else
                    record_error "restore failed; recover $TARGET_PATH from $ROW_BACKUP"
                fi
            fi
        fi
    done < "$MANIFEST"
}

HOME_PHYSICAL=$(CDPATH= cd -- "$HOME" && pwd -P)

validate_manifest
if [ "$ERROR_COUNT" -gt 0 ]; then
    echo "link-dotfiles: $ERROR_COUNT preflight error(s); nothing was modified" >&2
    exit 1
fi

if [ "$MODE" = "apply" ]; then
    acquire_lock
fi

process_manifest

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
