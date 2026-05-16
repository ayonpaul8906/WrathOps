import os

from .docker import generate_dockerfile
from .env import generate_env
from .dockerignore import generate_dockerignore
from .requirements import ensure_requirements

def run_pre(repo_path):
    # Ensure requirements.txt
    ensure_requirements(repo_path)

    files = {
        "Dockerfile": generate_dockerfile(),
        ".env.example": generate_env(),
        ".dockerignore": generate_dockerignore(),
    }

    for filename, content in files.items():
        with open(os.path.join(repo_path, filename), "w") as f:
            f.write(content)