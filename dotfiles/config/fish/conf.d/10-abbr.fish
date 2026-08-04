# Git is the shared memory and review surface between Brayden and his agents.
# Keep staging, review, and commit separate so the human can see the boundary.
abbr -a gs 'git status --short --branch'
abbr -a gd 'git diff'
abbr -a gds 'git diff --staged'
abbr -a ga 'git add'
abbr -a gap 'git add --patch'
abbr -a gc 'git commit'
abbr -a gca 'git commit --amend'
abbr -a gl 'git log --oneline --decorate --graph -20'
abbr -a gp 'git pull --rebase --autostash'
abbr -a gpu 'git push'
abbr -a gsw 'git switch'
abbr -a grs 'git restore'

# AI harnesses and agent-facing tools. The long names remain obvious in logs;
# these abbreviations only make interactive invocation easier.
abbr -a cdx 'codex'
abbr -a pai 'pi'
abbr -a hdr 'herdr'

# Copy the current directory when giving a harness explicit working context.
abbr -a cwd 'pwd | pbcopy'
