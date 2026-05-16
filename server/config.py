import os
import tempfile

BASE_TEMP_DIR = os.path.join(tempfile.gettempdir(), "wrathops")
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")

# Ensure the temp directory exists
os.makedirs(BASE_TEMP_DIR, exist_ok=True)