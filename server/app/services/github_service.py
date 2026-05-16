import requests
from app.config import Config

GITHUB_API = "https://api.github.com"


def get_file_content(repo, file_path):
    """
    Fetch latest file content from GitHub
    """
    url = f"{GITHUB_API}/repos/{repo}/contents/{file_path}"

    headers = {
        "Authorization": f"token {Config.GITHUB_TOKEN}",
        "Accept": "application/vnd.github.v3.raw"               
    }

    response = requests.get(url, headers=headers)

    if response.status_code == 200:
        return response.text

    print("[GITHUB ERROR - FILE]", response.text)
    return None


def get_commit_files(repo, commit_sha):
    """
    Fetch files changed in a commit
    """
    url = f"{GITHUB_API}/repos/{repo}/commits/{commit_sha}"

    headers = {
        "Authorization": f"token {Config.GITHUB_TOKEN}"
    }

    response = requests.get(url, headers=headers)

    if response.status_code != 200:
        print("[GITHUB ERROR - COMMIT]", response.text)
        return []

    data = response.json()

    return [{"filename": file["filename"], "patch": file.get("patch", ""), "status": file.get("status", "")} for file in data.get("files", [])]