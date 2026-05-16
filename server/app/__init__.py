from flask import Flask, jsonify
from app.config import Config


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Validate configuration on startup
    Config.validate()

    # Root route
    @app.route("/", methods=["GET"])
    def home():
        return jsonify({
            "service": "WrathOps Backend",
            "status": "running",
            "version": "1.0"
        }), 200

    # Register Blueprints
    from app.routes.webhook import webhook_bp
    from app.routes.devops import devops_bp
    from app.routes.health import health_bp

    app.register_blueprint(webhook_bp, url_prefix="/api/webhook")
    app.register_blueprint(devops_bp, url_prefix="/api/devops")
    app.register_blueprint(health_bp, url_prefix="/api")

    return app