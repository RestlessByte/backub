#!/bin/bash

# Преобразуем путь к AppImage в абсолютный
APPIMAGE_PATH="$(realpath "$1")"

# Проверяем, существует ли файл
if [ -f "$APPIMAGE_PATH" ]; then
    echo "Запускаю AppImage с отключенным sandbox..."
    "$APPIMAGE_PATH" --no-sandbox --disable-dev-shm-usage --disable-gpu --disable-web-security "${@:2}"
else
    echo "Ошибка: файл $APPIMAGE_PATH не найден."
    exit 1
fi
