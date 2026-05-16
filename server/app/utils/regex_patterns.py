PATTERNS = {
    # 🔐 OpenAI / Gemini / Google
    # "OPENAI_API_KEY": r"sk-[a-zA-Z0-9]{20,}",
    "OPENAI_API_KEY": r"sk-[a-zA-Z0-9\-]{20,100}",
    "GOOGLE_API_KEY": r"AIza[0-9A-Za-z\-_]{35}",
    "GEMINI_API_KEY": r"AIza[0-9A-Za-z\-_]{35}",

    # 🔐 AWS
    "AWS_ACCESS_KEY": r"AKIA[0-9A-Z]{16}",
    "AWS_SECRET_KEY": r"(?i)aws_secret_access_key\s*=\s*['\"]?[A-Za-z0-9/+=]{40}['\"]?",

    # 🔐 Firebase
    "FIREBASE_API_KEY": r"AIza[0-9A-Za-z\-_]{35}",
    "FIREBASE_AUTH_DOMAIN": r"[a-z0-9\-]+\.firebaseapp\.com",

    # 🔐 JWT
    "JWT_TOKEN": r"eyJ[a-zA-Z0-9_\-]+\.[a-zA-Z0-9_\-]+\.[a-zA-Z0-9_\-]+",

    # 🔐 Generic Secrets (improved)
    "GENERIC_SECRET": r"(?i)(api_key|apikey|secret|token|access_token|auth_token)\s*[:=]\s*['\"]?[a-zA-Z0-9_\-]{10,}['\"]?",

    # 🔐 Bearer tokens
    "BEARER_TOKEN": r"Bearer\s+[a-zA-Z0-9_\-\.=]+",

    # 🔐 Private keys
    "PRIVATE_KEY": r"-----BEGIN (RSA|EC|OPENSSH) PRIVATE KEY-----",

    # 🔐 Vite / Frontend exposed envs (VERY IMPORTANT)
    "VITE_API_KEY": r"VITE_[A-Z0-9_]*API[_]?KEY\s*=\s*['\"]?[a-zA-Z0-9_\-]{10,}['\"]?",
    "VITE_SECRET": r"VITE_[A-Z0-9_]*(SECRET|TOKEN)\s*=\s*['\"]?[a-zA-Z0-9_\-]{10,}['\"]?",

    # 🔐 GitHub token
    "GITHUB_TOKEN": r"ghp_[A-Za-z0-9]{36}",

    # 🔐 Slack token
    "SLACK_TOKEN": r"xox[baprs]-[0-9a-zA-Z\-]{10,48}",

    # 🔐 Stripe keys
    "STRIPE_SECRET_KEY": r"sk_live_[0-9a-zA-Z]{24}",
    "STRIPE_PUBLISHABLE_KEY": r"pk_live_[0-9a-zA-Z]{24}"
}