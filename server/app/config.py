import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
    GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
    GITHUB_WEBHOOK_SECRET = os.getenv("GITHUB_WEBHOOK_SECRET")
    
    @classmethod
    def validate(cls):
        """Validate required environment variables"""
        missing = []
        
        if not cls.GITHUB_TOKEN:
            missing.append("GITHUB_TOKEN")
        
        if not cls.GITHUB_WEBHOOK_SECRET:
            missing.append("GITHUB_WEBHOOK_SECRET")
        
        if missing:
            print(f"[CONFIG WARNING] Missing environment variables: {', '.join(missing)}")
            print("[CONFIG WARNING] PR creation may fail without GITHUB_TOKEN")
        
        if not cls.GEMINI_API_KEY:
            print("[CONFIG WARNING] GEMINI_API_KEY not set - will use fallback PR descriptions")