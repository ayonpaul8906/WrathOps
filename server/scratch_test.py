import os
from github import Github, InputGitTreeElement

def test_rebase():
    from app.config import Config
    g = Github(Config.GITHUB_TOKEN)
    repo = g.get_repo("ayonpaul8906/webhook_test")
    
    branch = repo.default_branch
    print(f"Default branch: {branch}")
    commits = list(repo.get_commits(sha=branch))[:2]
    head_sha = commits[0].sha
    
    # Just fetch the tree of head
    tree = repo.get_git_tree(head_sha, recursive=True)
    
    new_elements = []
    for e in tree.tree:
        # print(e.path, e.type, e.mode, e.sha)
        if e.type == 'blob':
            new_elements.append(InputGitTreeElement(path=e.path, mode=e.mode, type=e.type, sha=e.sha))
            
    print(f"Filtered tree length: {len(new_elements)}")
    new_tree = repo.create_git_tree(new_elements)
    print(f"New tree created successfully! Tree SHA: {new_tree.sha}")
    
    # Create commit
    new_cm = repo.create_git_commit(message="Test", tree=new_tree, parents=[commits[1]])
    print(f"New commit successfully created! {new_cm.sha}")
    
if __name__ == "__main__":
    test_rebase()
