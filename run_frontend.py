import os
import subprocess
import sys
import platform
import time


def install_dependencies():
    """Install the required dependencies"""
    print("Installing frontend dependencies...")
    frontend_dir = os.path.join("techtrack", "frontend")

    if platform.system() == "Windows":
        subprocess.run(f"cd {frontend_dir} && npm install", shell=True, check=True)
    else:
        subprocess.run(f"cd {frontend_dir} && npm install", shell=True, check=True)

    print("Dependencies installed successfully!")


def create_env_file():
    """Create .env file from .env.example if it doesn't exist"""
    env_file = os.path.join("techtrack", "frontend", ".env")
    example_file = os.path.join("techtrack", "frontend", ".env.example")

    if not os.path.exists(env_file):
        print("Creating .env file...")
        with open(env_file, 'w') as f:
            f.write("REACT_APP_API_URL=http://localhost:8000/api/v1\n")
        print(".env file created.")


def run_frontend():
    """Run the frontend development server"""
    print("Starting frontend development server...")
    frontend_dir = os.path.join("techtrack", "frontend")

    if platform.system() == "Windows":
        subprocess.run(f"cd {frontend_dir} && npm start", shell=True)
    else:
        subprocess.run(f"cd {frontend_dir} && npm start", shell=True)


def main():
    print("========================")
    print("TechTrack Frontend Setup")
    print("========================")

    try:
        # Check if the structure exists
        if not os.path.exists(os.path.join("techtrack", "frontend")):
            print("Error: Project structure not found. Please run setup_project.py first.")
            return

        # Install dependencies
        install_dependencies()

        # Create .env file if it doesn't exist
        create_env_file()

        # Small pause
        print("\nAll setup complete! Starting the frontend development server in 3 seconds...")
        time.sleep(3)

        # Run the frontend development server
        run_frontend()

    except subprocess.CalledProcessError as e:
        print(f"Error during setup: {e}")
    except Exception as e:
        print(f"Unexpected error: {e}")


if __name__ == "__main__":
    main()