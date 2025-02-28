from flask import Flask, jsonify, request
from flask_cors import CORS
import os
import sqlite3

app = Flask(__name__)
CORS(app)


# Инициализация SQLite базы данных
def init_db():
    conn = sqlite3.connect('techtrack.db')
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS users
                 (id INTEGER PRIMARY KEY, username TEXT, email TEXT, password TEXT, is_superuser INTEGER)''')
    c.execute("INSERT OR IGNORE INTO users VALUES (1, 'admin', 'admin@techtrack.kz', 'admin', 1)")
    conn.commit()
    conn.close()


init_db()


@app.route('/api/v1/auth/login', methods=['POST'])
def login():
    data = request.json or {}
    username = data.get('username', '')
    password = data.get('password', '')

    if not username or not password:
        form_data = request.form
        username = form_data.get('username', '')
        password = form_data.get('password', '')

    conn = sqlite3.connect('techtrack.db')
    c = conn.cursor()
    c.execute("SELECT * FROM users WHERE username = ? AND password = ?", (username, password))
    user = c.fetchone()
    conn.close()

    if user:
        return jsonify({
            "access_token": "fake_token_for_development",
            "token_type": "bearer"
        })
    return jsonify({"detail": "Incorrect username or password"}), 401


@app.route('/api/v1/users/me', methods=['GET'])
def get_user_me():
    return jsonify({
        "id": 1,
        "username": "admin",
        "email": "admin@techtrack.kz",
        "full_name": "Administrator",
        "position": "Сервисный инженер",
        "is_active": True,
        "is_superuser": True,
        "created_at": "2023-01-01T00:00:00",
        "updated_at": "2023-01-01T00:00:00"
    })


@app.route('/api/v1/tasks', methods=['GET'])
def get_tasks():
    tasks = [
        {"id": 1, "title": "ТО ускорителя", "equipment": "Versa HD (E82736)", "location": "Онкоцентр", "city": "Алматы",
         "dateType": "fixed", "date": "27.02.2025", "priority": "высокий", "status": "новая"},
        {"id": 2, "title": "Замена MLC модуля", "equipment": "TrueBeam (V75319)", "location": "Городская больница №2",
         "city": "Алматы", "dateType": "fixed", "date": "28.02.2025", "priority": "средний", "status": "новая"},
        {"id": 3, "title": "Калибровка MLC", "equipment": "Synergy (E45628)", "location": "Областная больница",
         "city": "Астана", "dateType": "nextService", "date": "Во время следующего ТО", "priority": "низкий",
         "status": "новая"},
        {"id": 4, "title": "Проверка электроники", "equipment": "TrueBeam (V75319)",
         "location": "Городская больница №2", "city": "Алматы", "dateType": "nextService",
         "date": "Во время следующего ТО", "priority": "средний", "status": "новая"},
        {"id": 5, "title": "Настройка лазеров", "equipment": "Halcyon (H1234)", "location": "Областная клиника",
         "city": "Шымкент", "dateType": "fixed", "date": "03.03.2025", "priority": "средний", "status": "новая"}
    ]
    return jsonify(tasks)


@app.route('/api/v1/equipment', methods=['GET'])
def get_equipment():
    equipment = [
        {"id": 101, "name": "Versa HD", "serial_number": "E82736", "location": "Онкоцентр", "city": "Алматы",
         "status": "Требует ТО", "working_hours": 1450, "last_service": "12.01.2025"},
        {"id": 102, "name": "TrueBeam", "serial_number": "V75319", "location": "Городская больница №2",
         "city": "Алматы", "status": "Рабочий", "working_hours": 856, "last_service": "05.02.2025"},
        {"id": 103, "name": "Synergy", "serial_number": "E45628", "location": "Областная больница", "city": "Астана",
         "status": "Рабочий", "working_hours": 2140, "last_service": "20.01.2025"},
        {"id": 104, "name": "Halcyon", "serial_number": "H1234", "location": "Областная клиника", "city": "Шымкент",
         "status": "Требует ТО", "working_hours": 756, "last_service": "15.01.2025"}
    ]
    return jsonify(equipment)


if __name__ == '__main__':
    print("Запуск простого бэкенда TechTrack на http://localhost:8000")
    app.run(debug=True, host='0.0.0.0', port=8000)