# Portable shell initialization

if test -d /opt/homebrew
    fish_add_path /opt/homebrew/bin /opt/homebrew/sbin
end

if test -d "$HOME/.local/bin"
    fish_add_path "$HOME/.local/bin"
end

if test -d "$HOME/.cargo/bin"
    fish_add_path "$HOME/.cargo/bin"
end

if test -d "$HOME/.local/share/mise/shims"
    fish_add_path --prepend "$HOME/.local/share/mise/shims"
end

# Disable terminal flow control so Ctrl+S cannot freeze an interactive shell.
stty -ixon 2>/dev/null

# This optional file is owned by the local machine or a private repository.
# The public Handbook never creates it or stores its values.
if test -f "$HOME/.config/fish/conf.d/90-private.fish"
    source "$HOME/.config/fish/conf.d/90-private.fish"
end
