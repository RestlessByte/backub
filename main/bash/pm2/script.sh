p() {
    local path="$(pwd)"  # Capture the current working directory
    cd "/home/$USER/" || return  # Change to the user's home directory; exit if cd fails
    pm2 "$@"            # Execute pm2 with all passed arguments
    cd "$path"          # Return to the original directory
}