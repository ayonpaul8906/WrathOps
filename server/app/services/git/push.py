from git import Repo


def push_changes(repo_path, repo_url, token):
    repo = Repo(repo_path)

    branch_name = "wrathops-deploy"

    # Configure git user for the commit (required in fresh clones)
    repo.config_writer().set_value("user", "name", "WrathOps Bot").release()
    repo.config_writer().set_value("user", "email", "bot@wrathops.dev").release()

    # Create and switch to new branch
    print(f"[PUSH] Creating branch: {branch_name}")
    repo.git.checkout("-b", branch_name)

    # Stage all changes
    repo.git.add(all=True)
    repo.index.commit("🚀 Added production-ready configs via WrathOps")

    # Build authenticated remote URL
    auth_url = repo_url.replace("https://", f"https://{token}@")

    # Push to remote
    print(f"[PUSH] Pushing branch {branch_name} to origin...")
    repo.git.push(auth_url, branch_name, "--force")
    print(f"[PUSH] Push complete")

    return branch_name