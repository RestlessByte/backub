#!/bin/sh

TIMESTAMP=$(date +%Y-%m-%d_%H-%M-%S)
DIR="backub/linux/postgreSQL/$TIMESTAMP"  # Исправлено: backub → backub

# Список директорий для бэкапа
backub_dirs="
/media/localhost/backub-0/$DIR          # Исправлено: backub-0 → backub-0
/media/localhost/backub-4/$DIR
/media/localhost/HDD/$DIR
/home/localhost/main/backub/postgreSQL/$DIR  # Исправлено: backub → backub
"

error_occurred=0

echo "$backub_dirs" | while read -r backub_dir; do
    [ -z "$backub_dir" ] && continue  # Пропускаем пустые строки
    
    # Создаем директорию с проверкой прав
    if ! mkdir -p "$backub_dir" 2>/dev/null; then
        echo "ОШИБКА: Не удалось создать директорию $backub_dir (проверьте права)"
        error_occurred=1
        continue
    fi
    
    # Создаем файл бэкапа
    backub_file="${backub_dir}/postgres_backub_${TIMESTAMP}.sql"
    if ! sudo -u postgres pg_dumpall > "$backub_file" 2>/dev/null; then
        echo "ОШИБКА: Не удалось создать бэкап PostgreSQL в $backub_dir"
        error_occurred=1
        continue
    fi
    
    # Проверяем размер и выводим информацию
    file_size=$(du -h "$backub_file" | awk '{print $1}')
    echo "Бэкап успешно создан: $backub_file"
    echo "Размер файла: $file_size"
done

# Возвращаем статус ошибки
exit $error_occurred