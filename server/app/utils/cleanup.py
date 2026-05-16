import shutil

def cleanup_repo(repo_path):
    shutil.rmtree(repo_path, ignore_errors=True)