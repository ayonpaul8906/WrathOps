import os
import shutil
from git import Repo

# Import from the top-level config module
import config


import uuid

def clone_repo(repo_url, token):
    repo_name = repo_url.split("/")[-1].replace(".git", "")
    unique_id = uuid.uuid4().hex[:8]
    repo_path = os.path.join(config.BASE_TEMP_DIR, f"{repo_name}_{unique_id}")

    os.makedirs(config.BASE_TEMP_DIR, exist_ok=True)

    # Build authenticated URL
    auth_url = repo_url.replace("https://", f"https://{token}@")

    print(f"[CLONE] Cloning {repo_url} -> {repo_path}")
    Repo.clone_from(auth_url, repo_path)
    print(f"[CLONE] Done")

    return repo_path