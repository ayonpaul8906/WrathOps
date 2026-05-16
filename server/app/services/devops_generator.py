import os
import re
from langchain_google_genai import ChatGoogleGenerativeAI
from app.config import Config

def get_llm():
    llm = ChatGoogleGenerativeAI(
        model="gemini-2.5-flash-lite",
        google_api_key=Config.GEMINI_API_KEY,
        temperature=0.3,
    )
    return llm

def generate_devops_plan(repo_path):
    file_structure = []
    dependencies = ""
    for root, dirs, files in os.walk(repo_path):
        level = root.replace(repo_path, '').count(os.sep)
        if '.git' in root or 'node_modules' in root or 'venv' in root:
            continue
        if level > 2:
            continue
            
        for file in files:
            file_structure.append(os.path.join(root.replace(repo_path, "").strip(os.sep), file))
            if file in ['package.json', 'requirements.txt', 'Pipfile', 'pom.xml', 'go.mod'] and not dependencies:
                try:
                    with open(os.path.join(root, file), 'r', encoding='utf-8') as f:
                        dependencies += f"\nFile {file}:\n" + f.read()[:2000]
                except Exception:
                    pass

    prompt = f"""
You are an expert DevOps engineer evaluating a codebase layout.
File Structure:
{chr(10).join(file_structure[:150])}

Key Dependencies Config:
{dependencies}

Based on this actual codebase content, generate robust production-ready template files.
1. `Dockerfile` - An optimized Dockerfile.
2. `docker-compose.yml` - A functional docker compose.

DO NOT OUTPUT JSON. Output your response EXACTLY formatted with XML tags as follows without exception.

Provide detailed, codebase-aware deployment steps for Vercel, Render, and Docker.
Crucially: If you detect environment variables or secrets, mention them explicitly in the Environment Variables step natively inside the description. Do NOT use markdown outside of the description text.

<file name="Dockerfile">
[Dockerfile content here]
</file>

<file name="docker-compose.yml">
[docker-compose.yml content here]
</file>

<guide provider="vercel">
  <step title="Go to Vercel Dashboard">Navigate to Vercel and click Add New -> Project.</step>
  <step title="Import Repository">Select this repository and ensure the framework preset is correct.</step>
  <step title="Set Environment Variables">Configure the following detected required secrets: [List them here clearly].</step>
  <step title="Deploy">Click Deploy!</step>
</guide>

<guide provider="render">
  <step title="Create Web Service">Navigate to the Render dashboard and create a new Web Service.</step>
  <step title="Connect Repository">Select your GitHub repo.</step>
  <step title="Environment Configurations">Add the required environment variables: [List them here clearly].</step>
  <step title="Deploy">Click Create Web Service.</step>
</guide>

<guide provider="docker">
  <step title="Local Docker Engine">Ensure Docker Desktop or Engine is running on your machine.</step>
  <step title="Environment Variables">Create a local .env file with the following variables: [List them here].</step>
  <step title="Build and Run">Run the command `docker compose up -d --build` to start the application stack locally.</step>
</guide>
"""
    try:
        llm = get_llm()
        response = llm.invoke(prompt)
        text = response.content
        
        files = []
        file_matches = re.finditer(r'<file name=["\']([^"\']+)["\']>(.*?)</file>', text, re.DOTALL)
        for match in file_matches:
            name = match.group(1).strip()
            content = match.group(2).strip()
            if content.startswith("```"):
                content = content.split("```", 1)[1]
                if "\\n" in content[:10]:
                    content = content.split("\\n", 1)[1]
                elif "\n" in content[:10]:
                    content = content.split("\n", 1)[1]
            if content.endswith("```"):
                content = content.rsplit("```", 1)[0].strip()
            files.append({"name": name, "content": content})
            
        guides = {"vercel": [], "render": [], "docker": []}
        guide_matches = re.finditer(r'<guide provider=["\']([^"\']+)["\']>(.*?)</guide>', text, re.IGNORECASE | re.DOTALL)
        for match in guide_matches:
            provider = match.group(1).lower().strip()
            content = match.group(2)
            
            steps = []
            step_matches = re.finditer(r'<step title=["\']([^"\']+)["\']>(.*?)</step>', content, re.IGNORECASE | re.DOTALL)
            for sm in step_matches:
                steps.append({
                    "title": sm.group(1).strip(),
                    "description": sm.group(2).strip()
                })
            
            if not steps:
                steps = [{"title": "Deployment Instructions", "description": content.strip()}]
            
            guides[provider] = steps
        
        return {
            "files": files,
            "guides": guides
        }

    except Exception as e:
        print(f"[DEVOPS GEN ERROR] Generative AI failed: {e}")
        return {
            "files": [], 
            "guide": f"Failed to generate DevOps plan due to an Error: {str(e)}"
        }