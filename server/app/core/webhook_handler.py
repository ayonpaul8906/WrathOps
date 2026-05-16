from app.services.github_service import get_commit_files


def handle_github_webhook(event, payload):
    """
    Entry point for all GitHub webhook events
    """

    if event == "push":
        return handle_push_event(payload)

    return {"message": f"Ignored event: {event}"}



def handle_push_event(payload):
    print("[HANDLER] Push event triggered")

    repo_name = payload["repository"]["full_name"]
    ref = payload.get("ref", "")

    if "wrathops" in ref.lower():
        print(f"[HANDLER] Ignoring push from wrathops branch: {ref}")
        return {"status": "ignored"}

    commits = payload.get("commits", [])

    print("[HANDLER] Repo:", repo_name)
    print("[HANDLER] Commits:", len(commits))

    all_files = set()
    historical_findings = []

    from app.services.scanner import scan_files

    for commit in commits:
        commit_id = commit["id"]
        print(f"[HANDLER] Fetching files for commit: {commit_id}")
        
        files = get_commit_files(repo_name, commit_id)
        
        for f in files:
            all_files.add(f["filename"])
            if f.get("patch"):
                findings = scan_files([{"filename": f["filename"], "content": f["patch"]}])
                if findings:
                    historical_findings.extend(findings)
    
    before_sha = payload.get("before")

    try:
        from app.services.github_service import GITHUB_API
        from app.config import Config
        import requests
        
        branch_name = ref.replace("refs/heads/", "") if ref else ""
        if branch_name:
            res = requests.get(f"{GITHUB_API}/repos/{repo_name}/commits?sha={branch_name}&per_page=15", headers={"Authorization": f"token {Config.GITHUB_TOKEN}"})
            if res.status_code == 200:
                history_commits = res.json()
                history_commits.reverse() # Oldest to newest
                
                # We need the parent of the oldest commit
                oldest_commit = history_commits[0]
                parents = oldest_commit.get("parents", [])
                parent_sha = parents[0].get("sha") if parents else None
                
                if not parent_sha:
                    parent_sha = "ROOT"
                    
                commits = [{"id": hc["sha"]} for hc in history_commits]
                before_sha = parent_sha
                print(f"[HANDLER] Expanded rebasing window to {len(history_commits)} prior commits. before_sha = {before_sha}")
    except Exception as e:
        print("[HANDLER] Could not fetch comprehensive branch history:", e)
        
    if not before_sha or before_sha == "0000000000000000000000000000000000000000":
        try:
            from app.services.github_service import GITHUB_API
            from app.config import Config
            import requests
            first_commit_sha = commits[0]["id"]
            res = requests.get(f"{GITHUB_API}/repos/{repo_name}/commits/{first_commit_sha}", headers={"Authorization": f"token {Config.GITHUB_TOKEN}"})
            if res.status_code == 200:
                parents = res.json().get("parents", [])
                if parents:
                    before_sha = parents[0].get("sha")
        except Exception as e:
            print(f"[HANDLER] Could not resolve parent for new branch: {e}")
    ref = payload.get("ref")

    from app.core.pipeline import process_push_event

    return process_push_event(repo_name, list(all_files), before_sha, ref, commits=commits)