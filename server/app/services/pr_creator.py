from github import Github
from app.config import Config
import time

from app.services.llm_service import generate_pr_description


def pr_already_exists(repo, base_branch):
    pulls = repo.get_pulls(state="open")

    for pr in pulls:
        if "wrathops" in pr.title.lower():
            print(f"[PR_CREATOR] Existing PR found: {pr.html_url}")
            return pr.html_url

    return None


def create_fix_pr(repo_name, fixed_files, env_example, findings, before_sha=None, ref=None, commits=None):
    try:
        print(f"[PR_CREATOR] Starting PR creation for {repo_name}")
        
        if not Config.GITHUB_TOKEN:
            raise ValueError("GITHUB_TOKEN environment variable not set")
        
        g = Github(Config.GITHUB_TOKEN)
        repo = g.get_repo(repo_name)

        base_branch = repo.default_branch
        if ref and ref.startswith("refs/heads/"):
            base_branch = ref.replace("refs/heads/", "")

        # Check if a WrathOps PR already exists before creating a branch
        existing_pr = pr_already_exists(repo, base_branch)
        if existing_pr:
            return existing_pr

        # 1. REBASE history FIRST to cleanly drop .env and scrub secrets from past commits
        if before_sha and before_sha != "0000000000000000000000000000000000000000" and commits:
            try:
                import github
                print(f"[PR_CREATOR] Rebasing history over {before_sha}")
                
                current_parent_sha = before_sha if before_sha != "ROOT" else None
                
                for commit_data in commits:
                    commit_sha = commit_data["id"]
                    git_commit = repo.get_git_commit(commit_sha)
                    
                    tree = repo.get_git_tree(commit_sha, recursive=True)
                    new_tree_elements = []
                    
                    for element in tree.tree:
                        if element.type != 'blob':
                            continue
                            
                        # If this is .env, we drop it entirely from the old commit
                        if ".env" in element.path:
                            continue
                            
                        # If this file was fixed by AI, inject the safe version into the history!
                        fixed_match = next((f for f in fixed_files if f["path"] == element.path), None)
                        if fixed_match:
                            new_blob = repo.create_git_blob(fixed_match["content"], "utf-8")
                            new_tree_elements.append(github.InputGitTreeElement(path=element.path, mode=element.mode, type=element.type, sha=new_blob.sha))
                        else:
                            new_tree_elements.append(github.InputGitTreeElement(path=element.path, mode=element.mode, type=element.type, sha=element.sha))
                            
                    new_tree = repo.create_git_tree(new_tree_elements)
                    
                    parent_commits = [repo.get_git_commit(current_parent_sha)] if current_parent_sha else []
                    new_commit = repo.create_git_commit(
                        message=git_commit.message,
                        tree=new_tree,
                        parents=parent_commits
                    )
                    current_parent_sha = new_commit.sha
                
                # Force update the base branch to the neatly rebased commits!
                base_branch_ref = repo.get_git_ref(f"heads/{base_branch}")
                base_branch_ref.edit(sha=current_parent_sha, force=True)
                print(f"[PR_CREATOR] History nicely rebased successfully. Secrets scrubbed from {base_branch}.")
            except Exception as e:
                print(f"[PR_CREATOR] Could not rebase git history: {str(e)}")

        # 2. Create the PR branch from the scrubbed base_branch
        new_branch = f"wrathops/fix-secrets-{int(time.time())}"
        print(f"[PR_CREATOR] Creating branch: {new_branch}")

        source = repo.get_branch(base_branch)
        repo.create_git_ref(ref=f"refs/heads/{new_branch}", sha=source.commit.sha)

        files_updated = 0
        try:
            repo.create_file(
                path=".env.example",
                message="add env example",
                content=env_example,
                branch=new_branch
            )
            print(f"[PR_CREATOR] Created .env.example")
            files_updated += 1
        except Exception as e:
            print(f"[PR_CREATOR] .env.example already exists or error: {str(e)}")

        # 🔥 AI-generated PR description
        print(f"[PR_CREATOR] Generating PR description with AI")
        try:
            pr_body = generate_pr_description(repo_name, findings, fixed_files)
        except Exception as e:
            print(f"[PR_CREATOR] AI description failed, using fallback: {str(e)}")
            pr_body = f"🔐 **WrathOps: Security Fix**\n\nAutomatically detected and fixed {len(findings)} hardcoded secrets.\n\nFiles modified: {len(fixed_files)}\n\nPlease review the changes and merge when ready."

        print(f"[PR_CREATOR] Creating pull request")
        pr = repo.create_pull(
            title="🔐 WrathOps: Secure secrets automatically",
            body=pr_body,
            head=new_branch,
            base=base_branch
        )
        
        print(f"[PR_CREATOR] PR created successfully: {pr.html_url}")
        return pr.html_url
    
    except Exception as e:
        print(f"[PR_CREATOR CRITICAL ERROR] {str(e)}")
        raise