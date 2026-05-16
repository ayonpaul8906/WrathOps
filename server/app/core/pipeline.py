from app.services.github_service import get_file_content
from app.services.scanner import scan_files
from app.services.fixer import fix_file_content, create_env_example
from app.services.pr_creator import create_fix_pr
from app.services.llm_service import ai_fix_code

print("[PIPELINE] STARTED")

def process_push_event(repo_name, files, before_sha=None, ref=None, commits=None):
    try:
        print(f"[PIPELINE] Processing push event for {repo_name} with {len(files)} files")
        file_contents = []

        for file_path in files:
            try:
                content = get_file_content(repo_name, file_path)

                if content:
                    file_contents.append({
                        "filename": file_path,
                        "content": content
                    })
            except Exception as e:
                print(f"[PIPELINE ERROR] Failed to fetch {file_path}: {str(e)}")
                continue

        findings = scan_files(file_contents)
        print(f"[PIPELINE] Scan complete. Found {len(findings)} potential secrets")

        if not findings:
            return {
                "status": "clean",
                "message": "No secrets detected"
            }

        fixed_files = []
        all_env_vars = {}

        for file in file_contents:
            file_findings = [
                f for f in findings if f["file"] == file["filename"]
            ]

            if not file_findings:
                continue

            try:
                if ".env" in file["filename"]:
                    updated_content, env_vars = fix_file_content(
                        file["filename"],
                        file["content"],
                        file_findings
                    )
                else:
                    # 🔥 TRY AI FIX FIRST
                    ai_fixed = ai_fix_code(file["content"], file_findings)

                    if ai_fixed and len(ai_fixed) > 0:
                        updated_content = ai_fixed

                        # fallback env extraction (simple)
                        _, env_vars = fix_file_content(file["filename"], file["content"], file_findings)

                    else:
                        # 🧯 FALLBACK (SAFE)
                        updated_content, env_vars = fix_file_content(
                            file["filename"],
                            file["content"],
                            file_findings
                        )

                fixed_files.append({
                    "path": file["filename"],
                    "content": updated_content
                })

                all_env_vars.update(env_vars)
            except Exception as e:
                print(f"[PIPELINE ERROR] Failed to fix {file['filename']}: {str(e)}")
                continue

        if not fixed_files:
            print("[PIPELINE] No files were fixed")
            return {
                "status": "clean",
                "message": "No files could be fixed"
            }

        env_example = create_env_example(all_env_vars)

        try:
            pr_url = create_fix_pr(
                repo_name,
                fixed_files,
                env_example,
                findings,
                before_sha,
                ref,
                commits
            )
            print(f"[PIPELINE] PR created successfully: {pr_url}")

            return {
                "status": "pr_created",
                "pr_url": pr_url,
                "files_fixed": len(fixed_files)
            }
        except Exception as e:
            print(f"[PIPELINE ERROR] Failed to create PR: {str(e)}")
            return {
                "status": "error",
                "message": f"Failed to create PR: {str(e)}"
            }

    except Exception as e:
        print(f"[PIPELINE CRITICAL ERROR] {str(e)}")
        return {
            "status": "error",
            "message": f"Pipeline error: {str(e)}"
        }