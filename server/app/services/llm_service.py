from langchain_google_genai import ChatGoogleGenerativeAI
from app.config import Config


def get_llm():
    return ChatGoogleGenerativeAI(
        model="gemini-2.5-flash-lite",
        google_api_key=Config.GEMINI_API_KEY,
        temperature=0.3,
    )


def normalize_code_response(content):
    cleaned = content.strip()

    if cleaned.startswith("```"):
        lines = cleaned.splitlines()

        if lines and lines[0].startswith("```"):
            lines = lines[1:]
        if lines and lines[-1].strip() == "```":
            lines = lines[:-1]

        cleaned = "\n".join(lines).strip()

    return cleaned


def ai_fix_code(file_content, findings):
    llm = get_llm()

    prompt = f"""
            You are a senior security engineer.

            Fix the following code by removing hardcoded secrets and replacing them with environment variables using os.getenv().

            Rules:
            - Do NOT break the code
            - Keep formatting clean
            - Add import os if needed
            - Replace secrets properly based on variable names
            - Do NOT explain anything
            - Return ONLY the updated code

            Detected secrets:
            {findings}

            Code:
            {file_content}
            """

    try:
        response = llm.invoke(prompt)
        return normalize_code_response(response.content)
    except Exception as e:
        print("[AI FIX ERROR]", e)
        return None
    

def generate_pr_description(repo_name, findings, fixed_files):
    try:
        if not Config.GEMINI_API_KEY:
            print("[LLM ERROR] GEMINI_API_KEY not set, using fallback description")
            return generate_fallback_pr_description(repo_name, findings, fixed_files)
        
        llm = get_llm()

        prompt = f"""
You are a senior DevSecOps engineer.

A security automation tool detected and fixed hardcoded secrets in a repository.

Repository: {repo_name}

Findings:
{findings}

Files Modified:
{[f['path'] for f in fixed_files]}

Write a professional GitHub Pull Request description that includes:

1. Summary of the issue
2. Why hardcoded secrets are dangerous
3. What changes were made
4. How developers should use environment variables now
5. Security best practices going forward

Keep it clean, structured, and developer-friendly.
"""

        response = llm.invoke(prompt)
        return response.content
    except Exception as e:
        print(f"[LLM ERROR] Failed to generate PR description: {str(e)}")
        return generate_fallback_pr_description(repo_name, findings, fixed_files)


def generate_fallback_pr_description(repo_name, findings, fixed_files):
    """Fallback description when LLM is unavailable"""
    files_list = "\n".join([f"- {f['path']}" for f in fixed_files])
    
    return f"""🔐 **WrathOps: Security Secrets Fix**

## Summary
This PR contains automated fixes for hardcoded secrets detected in the codebase.

## Why This Matters
Hardcoded secrets are security risks because:
- They can be exposed in git history
- Anyone with repository access can see them
- They may violate compliance requirements

## Changes Made
**Files Fixed:**
{files_list}

**New File:**
- `.env.example` - Template for required environment variables

## How to Use Environment Variables
1. Copy `.env.example` to `.env` in your local environment
2. Fill in actual values in `.env` (never commit this file)
3. The code now uses `os.getenv()` to load these values at runtime

## Security Best Practices
✅ Use environment variables for all secrets
✅ Add `.env` to `.gitignore`
✅ Never commit secrets to version control
✅ Use vaults/secret managers in production
✅ Rotate compromised secrets immediately

Please review the changes and merge when ready."""