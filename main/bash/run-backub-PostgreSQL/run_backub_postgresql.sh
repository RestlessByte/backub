#!/bin/bash

# Генерируем временную метку
TIMESTAMP=$(date +%Y-%m-%d_%H-%M-%S-%N)

# Путь к директории бэкапа
BACKUP_DIR="/media/localhost/HDD/Linux Backub/PostgreSQL/$TIMESTAMP"

# Создаем директорию для бэкапа
mkdir -p "$BACKUP_DIR"

# Проверяем успешность создания директории
if [ $? -ne 0 ]; then
    echo "Ошибка: Не удалось создать директорию $BACKUP_DIR"
    exit 1
fi

# Выполняем бэкап PostgreSQL
sudo -u postgres pg_dumpall > "$BACKUP_DIR/postgres_backup_$TIMESTAMP.sql"

# Проверяем успешность бэкапа
if [ $? -eq 0 ]; then
    echo "Бэкап успешно создан в $BACKUP_DIR"
else
    echo "Ошибка: Не удалось создать бэкап PostgreSQL"
    exit 1
fi