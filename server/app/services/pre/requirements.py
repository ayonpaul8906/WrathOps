import os

def ensure_requirements(repo_path):
    req_path = os.path.join(repo_path, "requirements.txt")

    if not os.path.exists(req_path):
        with open(req_path, "w") as f:
            f.write("Flask\ngunicorn\n")