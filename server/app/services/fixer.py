import re


def generate_env_name(secret_type, index=0):
    return f"{secret_type}_{index}".upper()
    

def fix_file_content(filename, content, findings):
    """
    Replace secrets with os.getenv()
    """

    updated_content = content
    env_vars = {}
    is_env_file = filename and (".env" in filename)

    for i, finding in enumerate(findings):
        secret_value = finding["secret"]
        env_name = f"{finding['type']}_{i}".upper()

        pattern = re.escape(secret_value)
        
        if is_env_file:
            updated_content = re.sub(
                pattern,
                "your_value_here",
                updated_content
            )
        else:
            updated_content = re.sub(
                rf'(["\']?){pattern}(["\']?)',
                f'process.env.{env_name}',
                updated_content
            )

        env_vars[env_name] = secret_value

    if not is_env_file:
        if "import os" not in updated_content:
            updated_content = "import os\n" + updated_content

    return updated_content, env_vars


def create_env_example(env_vars):
    lines = []

    for key in env_vars:
        lines.append(f"{key}=your_value_here")

    return "\n".join(lines)