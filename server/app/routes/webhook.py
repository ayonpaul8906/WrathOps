from flask import Blueprint, request, jsonify
from app.core.webhook_handler import handle_github_webhook
import traceback

webhook_bp = Blueprint("webhook", __name__)

@webhook_bp.route("/github", methods=["POST"])
def github_webhook():
    try:
        event = request.headers.get("X-GitHub-Event")
        payload = request.json

        if not event:
            return jsonify({"error": "Missing GitHub event header"}), 400

        print(f"[WEBHOOK] Event received: {event}")
        
        try:
            result = handle_github_webhook(event, payload)
            print(f"[WEBHOOK] Processing complete: {result}")
            return jsonify(result), 200
        except Exception as e:
            error_msg = f"Error processing webhook: {str(e)}"
            print(f"[WEBHOOK ERROR] {error_msg}")
            print(f"[WEBHOOK TRACEBACK] {traceback.format_exc()}")
            return jsonify({"error": error_msg}), 500
    
    except Exception as e:
        error_msg = f"Critical webhook error: {str(e)}"
        print(f"[WEBHOOK CRITICAL] {error_msg}")
        return jsonify({"error": error_msg}), 500
