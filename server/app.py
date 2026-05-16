from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
import requests
import traceback


load_dotenv()

from app.services.git.clone import clone_repo
from app.services.pre.pre_runner import run_pre
from app.services.git.push import push_changes
from app.utils.cleanup import cleanup_repo

app = Flask(__name__)
CORS(app)  # Allow cross-origin requests from the Next.js frontend

from app.routes.webhook import webhook_bp
app.register_blueprint(webhook_bp, url_prefix="/api/webhook")


@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "service": "WrathOps Backend",
        "status": "running",
        "version": "1.0"
    }), 200


@app.route("/deploy", methods=["POST"])
def deploy():
    try:
        data = request.json
        repo_url = data.get("repoUrl")
        github_token = data.get("githubToken")

        if not repo_url or not github_token:
            return jsonify({"error": "Missing repoUrl or githubToken"}), 400

        # Normalize: remove trailing .git if present
        clean_repo_url = repo_url.rstrip("/")
        if clean_repo_url.endswith(".git"):
            clean_repo_url = clean_repo_url[:-4]

        print(f"[DEPLOY] Starting deploy for: {clean_repo_url}")

        # 1. Clone repo
        print("[DEPLOY] Step 1: Cloning repo...")
        repo_path = clone_repo(clean_repo_url, github_token)
        print(f"[DEPLOY] Cloned to: {repo_path}")

        # 2. Dynamic generation
        print("[DEPLOY] Step 2: Scanning and generating DevOps plan...")
        from app.services.devops_generator import generate_devops_plan
        plan = generate_devops_plan(repo_path)
        print("[DEPLOY] DevOps Plan generated.")

        for f in plan.get("files", []):
            try:
                out_path = os.path.join(repo_path, f["name"])
                os.makedirs(os.path.dirname(out_path), exist_ok=True)
                with open(out_path, "w", encoding="utf-8") as out_f:
                    out_f.write(f["content"])
            except Exception as e:
                print(f"[DEPLOY] Error writing file {f.get('name')}: {e}")

        # 3. Push changes to new branch
        print("[DEPLOY] Step 3: Pushing changes to wrathops-deploy branch...")
        branch = push_changes(repo_path, clean_repo_url, github_token)
        print(f"[DEPLOY] Pushed to branch: {branch}")

        # 4. Create PR via GitHub API
        print("[DEPLOY] Step 4: Creating Pull Request...")
        pr_url = None
        try:
            parts = clean_repo_url.replace("https://github.com/", "").split("/")
            owner = parts[0]
            repo_name = parts[1]

            pr_response = requests.post(
                f"https://api.github.com/repos/{owner}/{repo_name}/pulls",
                headers={
                    "Authorization": f"Bearer {github_token}",
                    "Accept": "application/vnd.github+json",
                },
                json={
                    "title": "🚀 WrathOps: Custom Production-Ready Configs",
                    "body": (
                        "## WrathOps AI Readiness Engine\n\n"
                        "This PR adds dynamic production-ready files customized exactly to your codebase syntax.\n\n"
                        "### Deployment Guide\n\n" + plan.get("guide", "No guide generated")
                    ),
                    "head": branch,
                    "base": "main",
                },
            )

            if pr_response.status_code in (200, 201):
                pr_data = pr_response.json()
                pr_url = pr_data.get("html_url")
                print(f"[DEPLOY] PR created: {pr_url}")
            else:
                if pr_response.status_code == 422:
                    pr_response2 = requests.post(
                        f"https://api.github.com/repos/{owner}/{repo_name}/pulls",
                        headers={
                            "Authorization": f"Bearer {github_token}",
                            "Accept": "application/vnd.github+json",
                        },
                        json={
                            "title": "🚀 WrathOps: Custom Production-Ready Configs",
                            "body": (
                                "## WrathOps AI Readiness Engine\n\n"
                                "This PR adds dynamic production-ready files customized exactly to your codebase.\n\n"
                                "### Deployment Guide\n\n" + plan.get("guide", "No guide generated")
                            ),
                            "head": branch,
                            "base": "master",
                        },
                    )
                    if pr_response2.status_code in (200, 201):
                        pr_data = pr_response2.json()
                        pr_url = pr_data.get("html_url")
                        print(f"[DEPLOY] PR created (master): {pr_url}")

        except Exception as pr_err:
            print(f"[DEPLOY] PR creation error: {pr_err}")

        # 5. Deploy links
        vercel_url = f"https://vercel.com/new/clone?repository-url={clean_repo_url}"
        render_url = "https://dashboard.render.com/select-repo"

        # 6. Cleanup
        print("[DEPLOY] Step 5: Cleaning up...")
        cleanup_repo(repo_path)

        print("[DEPLOY] ✅ Deploy complete!")

        return jsonify({
            "success": True,
            "branch": branch,
            "prUrl": pr_url,
            "guides": plan.get("guides", {"vercel": [], "render": [], "docker": []}),
            "deploy": {
                "vercel": vercel_url,
                "render": render_url
            }
        })

    except Exception as e:
        print(f"[DEPLOY] ❌ Error: {e}")
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(port=5000, debug=True, use_reloader=False)