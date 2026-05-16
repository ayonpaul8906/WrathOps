import re
from app.utils.regex_patterns import PATTERNS

def is_already_env_based(content):
    return "process.env" in content or "os.getenv" in content

def scan_text(content):
    findings = []

    for pattern_name, pattern in PATTERNS.items():
        matches = re.findall(pattern, content)

        for match in matches:
            findings.append({
                "type": pattern_name,
                "value": match
            })

    return findings


def is_probably_secret(value):
    """
    Basic heuristic to reduce false positives
    """

    # Too short → ignore
    if len(value) < 10:
        return False

    # Ignore obvious fake values
    fake_keywords = ["test", "example", "dummy", "12345", "your_value"]

    for word in fake_keywords:
        if word in value.lower():
            return False

    return True


def scan_files(file_contents):
    """
    file_contents = [
        {"filename": "app.py", "content": "..."}
    ]
    """

    results = []

    for file in file_contents:
        filename = file["filename"]
        content = file["content"]

        # 🔥 SKIP already safe files
        if is_already_env_based(content):
            print(f"[SCANNER] Skipping already safe file: {filename}")
            continue

        findings = scan_text(content)

        for finding in findings:
            if is_probably_secret(finding["value"]):
                results.append({
                    "file": filename,
                    "type": finding["type"],
                    "secret": finding["value"]
                })

    return results