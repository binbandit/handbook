function handbook-sync --description 'Rebase, preview, and apply Bandit\'s Handbook links safely'
    argparse 'a/apply' 'h/help' -- $argv
    or return 2

    if set -q _flag_help
        echo 'Usage: handbook-sync [--apply]'
        echo 'Fetch and rebase the Handbook, then verify its managed links.'
        echo 'Pass --apply to back up conflicts and repair links.'
        return 0
    end

    set -l handbook_root "$HOME/.bandits-handbook"
    if set -q BANDITS_HANDBOOK_HOME
        set handbook_root "$BANDITS_HANDBOOK_HOME"
    end

    if not test -d "$handbook_root/.git"
        echo "handbook-sync: repository not found at $handbook_root" >&2
        return 1
    end

    if test -n (git -C "$handbook_root" status --porcelain)
        echo 'handbook-sync: commit or stash local changes before syncing' >&2
        git -C "$handbook_root" status --short
        return 1
    end

    set -l sync_args
    if set -q _flag_apply
        set sync_args --apply
    end

    "$handbook_root/scripts/sync.sh" $sync_args
end
