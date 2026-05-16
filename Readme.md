<div align="center">

```
██╗    ██╗██████╗  █████╗ ████████╗██╗  ██╗ ██████╗ ██████╗ ███████╗
██║    ██║██╔══██╗██╔══██╗╚══██╔══╝██║  ██║██╔═══██╗██╔══██╗██╔════╝
██║ █╗ ██║██████╔╝███████║   ██║   ███████║██║   ██║██████╔╝███████╗
██║███╗██║██╔══██╗██╔══██║   ██║   ██╔══██║██║   ██║██╔═══╝ ╚════██║
╚███╔███╔╝██║  ██║██║  ██║   ██║   ██║  ██║╚██████╔╝██║     ███████║
 ╚══╝╚══╝ ╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝ ╚═╝     ╚══════╝
```

### 🔐 AI-Powered DevSecOps — Detect. Classify. Remediate. Prevent.

<br/>

[![License](https://img.shields.io/badge/license-MIT-crimson?style=for-the-badge&logo=opensourceinitiative&logoColor=white)](LICENSE)
[![Python](https://img.shields.io/badge/python-3.8+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![CLI](https://img.shields.io/badge/CLI-WrathOps--cli-FF6B35?style=for-the-badge&logo=gnubash&logoColor=white)](https://github.com/tulu-g559/WrathOps-cli)
[![pre-commit](https://img.shields.io/badge/pre--commit-ready-FAB040?style=for-the-badge&logo=precommit&logoColor=black)](https://pre-commit.com)
[![Security](https://img.shields.io/badge/security-first-00C896?style=for-the-badge&logo=shieldsdotio&logoColor=white)](#)

<br/>

> *Stop secrets before they stop you.*
> WrathOps doesn't just detect — it **understands**, **remediates**, and **prevents**.

<br/>

</div>

---

## ⚡ Why WrathOps?

Most security tools tell you a secret was found and leave you to figure out the rest. **WrathOps closes the entire loop — automatically.**

```
Traditional Tools  →  "Secret detected. Good luck."

WrathOps           →  "Found it. Classified it. Explained the risk.
                        Rewrote the code. Cleaned git history.
                        Opened the PR. You're secure."
```

| Question | WrathOps Answers It |
|---|---|
| 🎯 **What is it?** | Identifies exact provider and secret type |
| ⚠️ **How dangerous?** | Scores risk 0–100 with confidence metrics |
| 💥 **Why does it matter?** | Explains real-world impact in plain language |
| 🔧 **How is it fixed?** | Migrates to env vars, rewrites code, opens a PR |
| 🧹 **What about history?** | Scrubs exposed commits from git history automatically |

---

## 🧱 System Overview

WrathOps is a two-part system:

```
┌──────────────────────────────────────────────────────────┐
│                                                          │
│   WrathOps CLI  (wrathops-cli)                           │
│   ─────────────────────────────                          │
│   Runs on your machine. Scans before you commit.         │
│   Blocks bad commits locally. Zero network calls.        │
│                                                          │
├──────────────────────────────────────────────────────────┤
│                                                          │
│   WrathOps Backend  (this repo)                          │
│   ────────────────────────────                           │
│   Connects to GitHub via webhooks. Watches every push.   │
│   Runs AI analysis, remediates code, cleans history,     │
│   and opens hardened PRs — automatically.                │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

Together they enforce security **before** and **after** every commit.

---

## 💻 Part 1 — CLI Tool

### Installation

```bash
pip install git+https://github.com/tulu-g559/WrathOps-cli.git
wrathops install
```

### Scan a File or Directory

```bash
wrathops scan ./my_project
```

### Pre-Commit Setup *(Recommended)*

Add to your `.pre-commit-config.yaml`:

```yaml
repos:
  - repo: https://github.com/your-org/wrathops
    rev: v1.0.0
    hooks:
      - id: wrathops
```

Then install the hook:

```bash
pre-commit install
```

---

## 🛠️ Example Output

```
🚨 Secrets Detected in ./app.py
════════════════════════════════════════════════════════════

  → AWS_SECRET_KEY
    Risk: 100/100  │  Class: real_and_dangerous  │  Confidence: 0.99
    ──────────────────────────────────────────────────────
    This appears to be a production AWS secret key. If exposed,
    attackers could access your cloud resources and incur costs.
    Status: ❓ Unknown (valid format, not externally verified)

  → GOOGLE_API_KEY
    Risk: 82/100   │  Class: real_and_dangerous  │  Confidence: 0.82
    ──────────────────────────────────────────────────────
    This appears to be a Google API key. It could allow access to
    your services and lead to data exposure or abuse.
    Status: ⚠️ Likely Inactive (test/example pattern detected)

════════════════════════════════════════════════════════════
❌ Commit blocked: 2 secret(s) detected. Remediate before committing.
```

---

## 🤖 Part 2 — Automated Remediation (Backend)

When a secret slips through locally — or is found in an existing repository — the WrathOps backend takes over. It listens to GitHub events and runs the full remediation pipeline without manual intervention.

### How It Works

```
  GitHub Push / PR Event
          │
          ▼
  ┌────────────────────┐
  │   Webhook Receiver  │  ← Receives the event from GitHub
  └────────┬───────────┘
           │
           ▼
  ┌────────────────────┐
  │   Detection Engine  │  ← Context-aware scan across changed files
  └────────┬───────────┘
           │
           ▼
  ┌────────────────────┐
  │   AI Analysis       │  ← Risk score · Severity · Confidence · Impact
  └────────┬───────────┘
           │
     ┌─────▼──────┐
     │  Severity?  │
     └──┬──────┬──┘
        │      │
     WARNING  CRITICAL
        │      │
        └──────▼──────────────────────────────────┐
                                                  │
                          ┌───────────────────────▼──────────────────┐
                          │           Remediation Engine              │
                          │                                           │
                          │  1. Rewrites hardcoded secret             │
                          │     → os.environ.get("KEY_NAME")          │
                          │                                           │
                          │  2. Generates .env.example                │
                          │     → placeholder keys for devs           │
                          │                                           │
                          │  3. Hardens .gitignore                    │
                          │     → adds .env, .env.*, *.pem            │
                          └───────────────────────┬──────────────────┘
                                                  │
                          ┌───────────────────────▼──────────────────┐
                          │   Git History Cleaner  (CRITICAL only)    │
                          │                                           │
                          │  Finds every commit containing the        │
                          │  exposed value and automates              │
                          │  git filter-repo to rewrite them          │
                          │  out of history entirely.                 │
                          └───────────────────────┬──────────────────┘
                                                  │
                          ┌───────────────────────▼──────────────────┐
                          │         Pull Request Generator            │
                          │                                           │
                          │  Opens a secure PR containing:            │
                          │  • Code rewrite diff                      │
                          │  • .env.example with placeholders         │
                          │  • .gitignore hardening                   │
                          │  • Audit trail with finding IDs           │
                          │  • Credential rotation links              │
                          └──────────────────────────────────────────┘
```

<br/>

### Step-by-Step: What Automation Does

**🔁 Step 1 — Code Rewrite**

WrathOps rewrites the offending file in-place, replacing the hardcoded secret with a safe environment variable reference:

```python
# Before  (detected by WrathOps)
gemini.api_key = "AIzaSyD-EXAMPLE-KEY-1234567890abcdef"

# After   (rewritten by WrathOps)
import os
gemini.api_key = os.environ.get("GEMINI_API_KEY")
```

```python
# Before
conn = psycopg2.connect("postgresql://admin:s3cr3tpass@db.prod.io:5432/main")

# After
import os
conn = psycopg2.connect(os.environ.get("DATABASE_URL"))
```

<br/>

**📄 Step 2 — Environment File Generation**

```bash
# .env.example  (committed to repo — safe, no real values)
STRIPE_API_KEY=your_stripe_secret_key_here
AWS_ACCESS_KEY_ID=your_aws_access_key_here
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key_here
DATABASE_URL=your_database_connection_string_here
```

```bash
# .gitignore  (hardened by WrathOps)
.env
.env.local
.env.staging
.env.production
*.pem
*.key
```

<br/>

**🧹 Step 3 — Git History Deletion** *(CRITICAL findings only)*

If the secret exists in previous commits, it must be erased from history — not just from the latest file. WrathOps automates this entirely:

```bash
# WrathOps runs this sequence for you — no manual steps required

# Remove the file from all commits in history
git filter-repo --path src/config/aws.py --invert-paths

# Or scrub the specific string value from all blobs
bfg --replace-text secrets.txt --no-blob-protection

# Expire reflogs and repack
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# Force-push the clean history
git push origin --force --all
git push origin --force --tags
```

After rewriting, WrathOps runs a second scan on the cleaned history to confirm the value is fully gone before the PR is opened.

<br/>

**🔀 Step 4 — Pull Request Opened Automatically**

The generated PR contains everything in one place:

```
Title:   [WrathOps] Security Remediation — AWS Key + Stripe Key

Changes:
  • src/config/aws.py        → secret replaced with os.environ.get()
  • src/payments/stripe.py   → secret replaced with os.environ.get()
  • .env.example             → added with placeholder values
  • .gitignore               → hardened

Audit Trail:
  Finding ID   : wops-20240915-a3f9c1
  Detected at  : 2024-09-15T14:32:07Z
  Secret Types : AWS_ACCESS_KEY_ID · STRIPE_SECRET_KEY_LIVE
  Risk Scores  : 94 · 71
  History Clean: ✅ Verified — value absent from all prior commits

Next Steps for You:
  → Rotate AWS key at:     https://console.aws.amazon.com/iam
  → Rotate Stripe key at:  https://dashboard.stripe.com/apikeys
  → Add real values to your local .env  (never commit this file)
  → Merge this PR
```

<br/>

### GitHub Webhook Setup

```bash
# In your GitHub repository:
# Settings → Webhooks → Add webhook

Payload URL  :  https://your-wrathops-instance.com/webhook/github
Content type :  application/json
Secret       :  <your-webhook-secret>
Events       :  ✅ Pushes
                ✅ Pull requests
                ✅ Branch or tag creation
```

<br/>

### Running the Backend

```bash
# Clone the repo
git clone https://github.com/tulu-g559/WrathOps.git
cd WrathOps

# Set up environment
cp .env.example .env
# Fill in: GITHUB_TOKEN, WEBHOOK_SECRET, AI provider key

# Run with Docker
docker-compose up --build

# Or run directly
pip install -r requirements.txt
uvicorn backend.api.webhooks:app --host 0.0.0.0 --port 8000
```

---

## 🔒 Safety & Privacy

WrathOps is designed so that your secrets never leave your control — at any layer.

```
✅  CLI runs fully locally         — zero network calls during scanning
✅  Secrets are never logged       — redacted in all outputs and audit trails
✅  AI analysis uses metadata only — type, line, entropy score; not raw values
✅  PRs contain no plaintext keys  — only env-var references and placeholders
✅  Self-hostable backend          — no mandatory third-party cloud dependency
✅  WrathOps scans itself          — every push runs wrathops-self-scan.yml
```

> **Your code is your business. WrathOps keeps it that way.**

---

## 🛠️ Supported Secret Types

| Provider | Detected Types |
|---|---|
| **AWS** | `ACCESS_KEY_ID`, `SECRET_ACCESS_KEY`, `SESSION_TOKEN` |
| **GCP** | Service account JSON, `GOOGLE_API_KEY`, OAuth2 client secrets |
| **Stripe** | `sk_live_*`, `pk_live_*`, restricted keys |
| **JWT** | Full token structure with claim inspection |
| **OAuth** | Client secrets, bearer tokens, refresh tokens |
| **Database** | PostgreSQL, MySQL, MongoDB URIs with embedded credentials |
| **Generic** | RSA/EC/PEM private keys, `.env` leaks, config file secrets |

---

## 🚀 Roadmap

- [x] CLI secret scanner with risk scoring and pre-commit enforcement
- [x] AI-based classification — severity, confidence, and impact explanation
- [x] Code rewriting — hardcoded secrets → `os.environ.get()`
- [x] `.env.example` generation and `.gitignore` hardening
- [x] Automated pull request generation with audit trail
- [x] Git history sanitization for CRITICAL findings
- [ ] 
---

## 📦 Use Cases

| Who | How They Use It |
|---|---|
| 👨‍💻 **Individual Developers** | CLI pre-commit hook — catches mistakes before they hit remote |
| 🎓 **Students & Learners** | Understand what secrets are risky and exactly why |
| 👔 **Engineering Teams** | Automated backend enforcement across every repo and PR |
| 🔐 **Security Engineers** | Full audit trail, history sanitization, and dashboard monitoring |

---

<div align="center">

<br/>

**Built for developers who treat security as a system property, not an afterthought.**

<br/>

*WrathOps — Detect. Understand. Remediate. Prevent.*

<br/>

[![Star on GitHub](https://img.shields.io/badge/⭐_Star_on_GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/ayonpaul8906/WrathOps)

</div>