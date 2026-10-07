_splash_server() {
    local item cur="${COMP_WORDS[COMP_CWORD]}" prev="${COMP_WORDS[COMP_CWORD-1]}"
    case "$prev" in
        --data-dir) COMPREPLY=(); while IFS= read -r item; do COMPREPLY+=("$item"); done < <(compgen -d -- "$cur"); return ;;
        --name|--port) return ;;
    esac
    COMPREPLY=(); while IFS= read -r item; do COMPREPLY+=("$item"); done < <(compgen -W '--help --version --port --data-dir --name' -- "$cur")
    if [[ "$cur" != -* ]]; then COMPREPLY=(); while IFS= read -r item; do COMPREPLY+=("$item"); done < <(compgen -d -- "$cur"); fi
}
complete -F _splash_server splash-server
