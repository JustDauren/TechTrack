import os
import subprocess
import sys
import platform
import shutil
from pathlib import Path

# Define the project structure
project_structure = {
    "techtrack": {
        "backend": {
            "app": {
                "api": {
                    "v1": {
                        "endpoints": {
                            "auth.py": "",
                            "users.py": "",
                            "tasks.py": "",
                            "equipment.py": "",
                            "parts.py": "",
                            "reports.py": "",
                            "trips.py": "",
                            "knowledge.py": "",
                        },
                        "api.py": "",
                        "__init__.py": "",
                    },
                    "__init__.py": "",
                },
                "core": {
                    "config.py": "",
                    "security.py": "",
                    "dependencies.py": "",
                    "__init__.py": "",
                },
                "db": {
                    "session.py": "",
                    "base.py": "",
                    "init_db.py": "",
                    "__init__.py": "",
                },
                "models": {
                    "user.py": "",
                    "task.py": "",
                    "equipment.py": "",
                    "part.py": "",
                    "report.py": "",
                    "trip.py": "",
                    "knowledge.py": "",
                    "__init__.py": "",
                },
                "schemas": {
                    "user.py": "",
                    "task.py": "",
                    "equipment.py": "",
                    "part.py": "",
                    "report.py": "",
                    "trip.py": "",
                    "knowledge.py": "",
                    "token.py": "",
                    "__init__.py": "",
                },
                "services": {
                    "auth.py": "",
                    "user.py": "",
                    "task.py": "",
                    "equipment.py": "",
                    "part.py": "",
                    "report.py": "",
                    "trip.py": "",
                    "knowledge.py": "",
                    "__init__.py": "",
                },
                "main.py": "",
                "__init__.py": "",
            },
            "alembic": {
                "versions": {},
                "env.py": "",
                "script.py.mako": "",
            },
            "tests": {
                "api": {
                    "__init__.py": "",
                },
                "conftest.py": "",
                "__init__.py": "",
            },
            "requirements.txt": "",
            ".env.example": "",
            "alembic.ini": "",
        },
        "frontend": {
            "public": {
                "index.html": "",
                "manifest.json": "",
                "robots.txt": "",
                "favicon.ico": "",
                "logo192.png": {},
                "logo512.png": {},
            },
            "src": {
                "assets": {
                    "icons": {},
                    "images": {},
                    "styles": {
                        "index.css": "",
                    },
                },
                "components": {
                    "layout": {
                        "Header.tsx": "",
                        "Sidebar.tsx": "",
                        "Footer.tsx": "",
                        "Layout.tsx": "",
                        "index.ts": "",
                    },
                    "ui": {
                        "Button.tsx": "",
                        "Card.tsx": "",
                        "Input.tsx": "",
                        "Modal.tsx": "",
                        "Select.tsx": "",
                        "Tabs.tsx": "",
                        "FloatingActionButton.tsx": "",
                        "index.ts": "",
                    },
                    "dashboard": {
                        "WeatherWidget.tsx": "",
                        "TasksWidget.tsx": "",
                        "EquipmentWidget.tsx": "",
                        "index.ts": "",
                    },
                    "tasks": {
                        "TaskList.tsx": "",
                        "TaskItem.tsx": "",
                        "TaskForm.tsx": "",
                        "index.ts": "",
                    },
                    "equipment": {
                        "EquipmentList.tsx": "",
                        "EquipmentItem.tsx": "",
                        "EquipmentDetails.tsx": "",
                        "ServiceChecklist.tsx": "",
                        "index.ts": "",
                    },
                    "parts": {
                        "PartsList.tsx": "",
                        "PartItem.tsx": "",
                        "PartForm.tsx": "",
                        "index.ts": "",
                    },
                    "reports": {
                        "ReportList.tsx": "",
                        "ReportForm.tsx": "",
                        "index.ts": "",
                    },
                    "trips": {
                        "TripList.tsx": "",
                        "TripItem.tsx": "",
                        "TripForm.tsx": "",
                        "index.ts": "",
                    },
                    "knowledge": {
                        "KnowledgeList.tsx": "",
                        "KnowledgeItem.tsx": "",
                        "index.ts": "",
                    },
                    "auth": {
                        "LoginForm.tsx": "",
                        "RegisterForm.tsx": "",
                        "ForgotPasswordForm.tsx": "",
                        "index.ts": "",
                    },
                },
                "contexts": {
                    "AuthContext.tsx": "",
                    "UIContext.tsx": "",
                },
                "hooks": {
                    "useAuth.ts": "",
                    "useApi.ts": "",
                    "useOffline.ts": "",
                    "useForm.ts": "",
                },
                "pages": {
                    "Dashboard.tsx": "",
                    "Tasks.tsx": "",
                    "Equipment.tsx": "",
                    "EquipmentDetail.tsx": "",
                    "Parts.tsx": "",
                    "Reports.tsx": "",
                    "Trips.tsx": "",
                    "Knowledge.tsx": "",
                    "Profile.tsx": "",
                    "Login.tsx": "",
                    "Register.tsx": "",
                    "ForgotPassword.tsx": "",
                    "NotFound.tsx": "",
                    "index.ts": "",
                },
                "services": {
                    "api.ts": "",
                    "auth.ts": "",
                    "storage.ts": "",
                    "sync.ts": "",
                    "weather.ts": "",
                },
                "store": {
                    "slices": {
                        "authSlice.ts": "",
                        "tasksSlice.ts": "",
                        "equipmentSlice.ts": "",
                        "partsSlice.ts": "",
                        "uiSlice.ts": "",
                    },
                    "store.ts": "",
                    "hooks.ts": "",
                },
                "types": {
                    "index.ts": "",
                },
                "utils": {
                    "formatters.ts": "",
                    "validators.ts": "",
                    "constants.ts": "",
                    "helpers.ts": "",
                },
                "App.tsx": "",
                "index.tsx": "",
                "service-worker.ts": "",
                "react-app-env.d.ts": "",
            },
            "package.json": "",
            "tsconfig.json": "",
            ".env.example": "",
            "tailwind.config.js": "",
            "postcss.config.js": "",
        },
        "docker": {
            "Dockerfile.backend": "",
            "Dockerfile.frontend": "",
            "docker-compose.yml": "",
            ".dockerignore": "",
        },
        "scripts": {
            "seed_database.py": "",
        },
        ".gitignore": "",
        "README.md": "",
    }
}


def create_directory_structure(base_path, structure):
    """Recursively create directory structure based on the provided dictionary"""
    for name, contents in structure.items():
        path = os.path.join(base_path, name)

        if isinstance(contents, dict):
            os.makedirs(path, exist_ok=True)
            create_directory_structure(path, contents)
        else:
            # This is a file
            with open(path, 'w') as f:
                f.write(contents)


def setup_virtual_environment(project_dir):
    """Set up a Python virtual environment"""
    venv_dir = os.path.join(project_dir, "backend", "venv")

    # Create virtual environment
    subprocess.run([sys.executable, "-m", "venv", venv_dir], check=True)

    # Get the path to the activate script
    if platform.system() == "Windows":
        activate_script = os.path.join(venv_dir, "Scripts", "activate")
    else:
        activate_script = os.path.join(venv_dir, "bin", "activate")

    print(f"Virtual environment created at: {venv_dir}")
    print(f"To activate, run: ")
    if platform.system() == "Windows":
        print(f"{activate_script}")
    else:
        print(f"source {activate_script}")


def setup_node_modules(project_dir):
    """Initialize npm project and install dependencies"""
    frontend_dir = os.path.join(project_dir, "frontend")

    # We're not actually running npm install here as it would take too long
    # Just creating the directory structure
    node_modules_dir = os.path.join(frontend_dir, "node_modules")
    os.makedirs(node_modules_dir, exist_ok=True)

    print(f"Node modules directory created at: {node_modules_dir}")
    print("To install dependencies, navigate to the frontend directory and run: npm install")


def main():
    # Get the current directory
    current_dir = os.getcwd()

    # Create the project directory
    project_dir = os.path.join(current_dir, "techtrack")

    # Check if the project directory already exists
    if os.path.exists(project_dir):
        print(f"The directory {project_dir} already exists.")
        overwrite = input("Do you want to delete it and continue? (y/n): ")
        if overwrite.lower() == 'y':
            shutil.rmtree(project_dir)
        else:
            print("Setup aborted.")
            return

    # Create the project structure
    os.makedirs(project_dir, exist_ok=True)
    create_directory_structure(current_dir, {"techtrack": project_structure["techtrack"]})

    # Set up virtual environment for backend
    setup_virtual_environment(project_dir)

    # Set up node_modules for frontend
    setup_node_modules(project_dir)

    print("\nProject structure created successfully!")
    print(f"Project directory: {project_dir}")
    print("\nNext steps:")
    print("1. Populate the backend requirements.txt file with dependencies")
    print("2. Activate the virtual environment and install dependencies")
    print("3. Set up the frontend package.json and install dependencies")
    print("4. Configure the database connection in backend/.env")
    print("5. Start the development servers")


if __name__ == "__main__":
    main()