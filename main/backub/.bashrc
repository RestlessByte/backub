
# ~/.bashrc ------------------------------------------------------------

#----- ENV VARIABLES ---------------------------------------------------
export PATH="$HOME/.cargo/bin:$PATH:/home/$USER/usingPM2_Linux:/home/$USER/.yarn/bin:/home/localhost/main/arudion/esp32/motionSensor/bin:/usr/local/cuda/bin"
export LD_LIBRARY_PATH="/usr/local/cuda/lib64:$LD_LIBRARY_PATH"
export CUDA_VISIBLE_DEVICES=0
export OLLAMA_GPU=1
export NVM_DIR="$HOME/.nvm"

#----- ALIASES ---------------------------------------------------------
#--- File operations ---
alias rmr='rm -r'
alias rmf='rm -f'
alias rmrf='rm -rf'
alias bac='sudo rsync -ru /home/$USER/* /media/$USER/Backup\ drive/'
alias server='cd /home/localhost/main/server-app'

#--- Navigation ---
alias m='cd /media/$USER/'
alias h='cd /home/$USER/'
alias s='cd /home/$USER/main'
alias hub='cd /home/$USER/main/Git\ Hub\ Repository'
alias github='cd /home/$USER/main/github'
alias f='cd /home/$USER/main/web/main'
alias fui='cd /home/$USER/main/web/main/ui'
alias fux='cd /home/$USER/main/web/main/ux'
alias fsc='cd /home/$USER/main/web/main/scss'
alias fb='cd /home/$USER/main/web/backend'
alias telegram='cd /home/$USER/main/telegram'
alias telegramai='cd /home/$USER/main/telegram/hub'
alias telegramgame='cd /home/$USER/main/telegram/game'
alias telegramaigithubpush='cd /home/$USER/main/telegram/hub && git add . && git commit -m "v5" && git push ByteMindAIHubTelegram'
alias sshServer='ssh -p 61950 localhost@84.39.243.205'
alias sshLaptop='ssh -p 60563 user@84.39.243.205'
alias gameservers='cd /home/$USER/main/game-servers'
#--- Development ---
alias y='yarn'
alias compile='function _compile() { g++ -o "$1" "${1%.cpp}.cpp"; echo "Compiling $1"; sed -i "/g++ -o/s|.*$|$1|" /opt/security/backend/run.sh; }; _compile'
alias psqlbackup='pg_dump -U postgres -d server -F c -f "/media/localhost/Жесткий\ диск/backup/postgresql/$(date +%Y-%m-%d).dump"'

#--- System ---
alias o='sudo poweroff'
alias cache='sudo apt autoremove'
alias linux='echo "Linux top!"'
alias aiterminal='bun /home/localhost/main/ai/terminal/index.ts'
#--- Utils ---
alias ls=lsd
alias rm=rmt
alias kp=killport
alias alert='notify-send --urgency=low -i "$([ $? = 0 ] && echo terminal || echo error)" "$(history | tail -n1 | sed -e "s/^\s*[0-9]\+\s*//;s/[;&|]\s*alert\$//")"'

#----- FUNCTIONS -------------------------------------------------------
# Safe command execution with clear
c() {
    if "$@"; then
        clear
    else
        echo "Error command: $*"
        return 1
    fi
}

# PM2 wrapper
p() {
    local current_path=$(pwd)
    cd "/home/$USER/main/" || return
    pm2 "$1" "$2"
    cd "$current_path" || return
}

#----- COMPLETION ------------------------------------------------------
if ! shopt -oq posix; then
  if [ -f /usr/share/bash-completion/bash_completion ]; then
    . /usr/share/bash-completion/bash_completion
  elif [ -f /etc/bash_completion ]; then
    . /etc/bash_completion
  fi
fi

#----- PROMPT ----------------------------------------------------------
export PS1='\[\e[32m\]\u@\h:\[\e[34m\]\w\[\e[0m\]$ '

#----- LOADERS ---------------------------------------------------------
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"
[ -f ~/.bash_aliases ] && . ~/.bash_aliases

#----- MISCELLANEOUS ---------------------------------------------------
tools() {
    local path="$(pwd)"
    bash "/home/$USER/installation_menu.sh"
    cd "$path"
}

appImageOpen() {
    local path="/home/localhost"
    bash "/home/localhost/appImageOpenForLinux/appimage-launcher.sh"
    cd "/home/localhost/main/github/main/appImageOpenForLinux"
}