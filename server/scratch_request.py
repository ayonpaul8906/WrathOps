import requests
def fetch():
    from app.config import Config
    url = f"https://api.github.com/repos/ayonpaul8906/webhook_test/commits?sha=master&per_page=15"
    headers = {"Authorization": f"token {Config.GITHUB_TOKEN}"}
    res = requests.get(url, headers=headers)
    print(res.status_code)
    print(len(res.json()))

if __name__ == "__main__":
    fetch()
