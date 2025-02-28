import os
import subprocess
import sys
import platform
import time


def install_dependencies():
    """Install the required dependencies"""
    print("Installing backend dependencies...")
    backend_dir = os.path.join("techtrack", "backend")

    if platform.system() == "Windows":
        subprocess.run(f"cd {backend_dir} && pip install -r requirements.txt", shell=True, check=True)
    else:
        subprocess.run(f"cd {backend_dir} && pip install -r requirements.txt", shell=True, check=True)

    print("Dependencies installed successfully!")


def create_env_file():
    """Create .env file if it doesn't exist"""
    # Создаем .env в корневой директории проекта
    root_env_file = ".env"
    # Создаем .env в директории бэкенда
    backend_env_file = os.path.join("techtrack", "backend", ".env")
    # Создаем .env.example в директории бэкенда
    backend_env_example = os.path.join("techtrack", "backend", ".env.example")

    # Содержимое .env файла
    env_content = """API_V1_STR=/api/v1
PROJECT_NAME=TechTrack
BACKEND_CORS_ORIGINS=["http://localhost:3000","http://localhost:8000"]
SECRET_KEY=temporary_secret_key_for_development_environment

# PostgreSQL
POSTGRES_SERVER=localhost
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=techtrack

# First superuser
FIRST_SUPERUSER=admin
FIRST_SUPERUSER_PASSWORD=admin
FIRST_SUPERUSER_EMAIL=admin@techtrack.kz

# Weather API (optional)
WEATHER_API_KEY=
WEATHER_API_URL=https://api.openweathermap.org/data/2.5
"""

    # Проверяем и создаем .env.example
    if not os.path.exists(backend_env_example):
        print(f"Creating .env.example file at {os.path.abspath(backend_env_example)}")
        with open(backend_env_example, 'w') as f:
            f.write(env_content)
    else:
        print(f".env.example file exists at {os.path.abspath(backend_env_example)}")

    # Проверяем и создаем .env в корневой директории
    if not os.path.exists(root_env_file):
        print(f"Creating .env file at {os.path.abspath(root_env_file)}")
        with open(root_env_file, 'w') as f:
            f.write(env_content)
    else:
        print(f".env file exists at {os.path.abspath(root_env_file)}")

    # Проверяем и создаем .env в директории бэкенда
    if not os.path.exists(backend_env_file):
        print(f"Creating .env file at {os.path.abspath(backend_env_file)}")
        with open(backend_env_file, 'w') as f:
            f.write(env_content)
    else:
        print(f".env file exists at {os.path.abspath(backend_env_file)}")


def init_database():
    """Initialize the database"""
    print("Initializing database...")

    # Устанавливаем переменные окружения напрямую
    os.environ["POSTGRES_SERVER"] = "localhost"
    os.environ["POSTGRES_USER"] = "postgres"
    os.environ["POSTGRES_PASSWORD"] = "postgres"
    os.environ["POSTGRES_DB"] = "techtrack"
    os.environ["FIRST_SUPERUSER"] = "admin"
    os.environ["FIRST_SUPERUSER_PASSWORD"] = "admin"
    os.environ["FIRST_SUPERUSER_EMAIL"] = "admin@techtrack.kz"

    # Путь к директории backend должен быть добавлен к sys.path
    backend_path = os.path.join(os.getcwd(), "techtrack", "backend")
    if backend_path not in sys.path:
        sys.path.append(backend_path)

    # Переходим в директорию бэкенда для запуска init_db
    os.chdir(backend_path)

    try:
        # Импортируем и запускаем инициализацию базы данных
        from app.db.init_db import main as init_db_main
        init_db_main()
        print("Database initialized successfully!")
    except Exception as e:
        print(f"Error initializing database: {e}")

        try:
            # Альтернативный способ - через подпроцесс
            print("Trying alternative initialization method...")
            subprocess.run("python -m app.db.init_db", shell=True, check=True)
            print("Database initialized successfully!")
        except subprocess.CalledProcessError as e:
            print(f"Error initializing database: {e}")
            return False

    # Возвращаемся в исходную директорию
    os.chdir(os.path.dirname(backend_path))
    return True


def run_backend():
    """Run the backend server"""
    print("Starting backend server...")
    backend_dir = os.path.join(os.getcwd(), "techtrack", "backend")

    # Переходим в директорию бэкенда для запуска сервера
    os.chdir(backend_dir)

    # Запускаем uvicorn напрямую
    try:
        subprocess.run("uvicorn app.main:app --reload --host 0.0.0.0 --port 8000", shell=True)
    except KeyboardInterrupt:
        print("Server stopped by user")
    except Exception as e:
        print(f"Error running server: {e}")


def main():
    print("=======================")
    print("TechTrack Backend Setup")
    print("=======================")

    try:
        # Check if the structure exists
        if not os.path.exists(os.path.join("techtrack", "backend")):
            print("Error: Project structure not found. Please run setup_project.py first.")
            return

        # Install dependencies
        install_dependencies()

        # Create .env file if it doesn't exist
        create_env_file()

        # Initialize database
        if not init_database():
            print("Failed to initialize database. Please check the errors above.")
            return

        # Small pause
        print("\nAll setup complete! Starting the backend server in 3 seconds...")
        time.sleep(3)

        # Run the backend server
        run_backend()

    except subprocess.CalledProcessError as e:
        print(f"Error during setup: {e}")
    except Exception as e:
        print(f"Unexpected error: {e}")


if __name__ == "__main__":
    main()