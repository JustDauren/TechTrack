import psycopg2

try:
    # Попытка подключения к PostgreSQL
    connection = psycopg2.connect(
        host="localhost",
        port="5433",  # Измените на ваш порт PostgreSQL 17
        database="techtrack",
        user="postgres",
        password="postgres"  # Измените на ваш пароль
    )

    # Создание курсора
    cursor = connection.cursor()

    # Простой запрос для проверки
    cursor.execute("SELECT version();")

    # Получение и вывод результата
    version = cursor.fetchone()
    print(f"PostgreSQL версия: {version[0]}")

    # Закрытие соединения
    cursor.close()
    connection.close()
    print("Подключение успешно!")

except Exception as e:
    print(f"Ошибка при подключении к PostgreSQL: {e}")