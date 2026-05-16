from flask import Blueprint, request, jsonify

devops_bp = Blueprint("devops", __name__)

@devops_bp.route("/generate", methods=["POST"])
def generate_devops():
    data = request.json
    return jsonify({"message": "DevOps endpoint ready", "input": data}), 200