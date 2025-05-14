from flask import Flask
from routes.users import user_routes  # Import the user routes
from routes.reviews import review_routes
from routes.movies import movie_routes
from functools import wraps
from flask import request, jsonify, g
import jwt
import os
import requests

REVIEW_SERVICE_URL = "http://localhost:8080/reviews"
JWT_SECRET = os.environ.get("JWT_SECRET")

def review_ownership_middleware(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        review_id = kwargs.get('id')  # Assuming your route parameter for review ID is 'id'
        if not review_id:
            return jsonify({"error": "Review ID missing from parameters."}), 400

        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({"error": "Missing or invalid token."}), 401

        token = auth_header.split(' ')[1]
        try:
            payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
            logged_in_user_id = payload.get('userId')
            user_role = payload.get('role')
            g.user = payload  # Store user info in Flask's 'g' context
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token has expired."}), 403
        except jwt.InvalidTokenError:
            return jsonify({"error": "Invalid token."}), 403

        try:
            response = requests.get(f"{REVIEW_SERVICE_URL}/{review_id}")
            response.raise_for_status()  # Raise an exception for bad status codes
            review = response.json()

            if not review:
                return jsonify({"error": "Review not found."}), 404

            review_user_id = review.get('userId')

            if user_role == "admin" or review_user_id == logged_in_user_id:
                return f(*args, **kwargs)
            else:
                print("Review ID:", review_id)
                print("Review User ID:", review_user_id)
                print("Logged In User ID:", logged_in_user_id)
                return jsonify({"error": "Access denied. You do not have permission to manage this review."}), 403

        except requests.exceptions.RequestException as e:
            if e.response and e.response.status_code == 404:
                return jsonify({"error": "Review not found."}), 404
            else:
                print("Error fetching review:", e)
                return jsonify({"error": "Internal server error while checking review ownership."}), 500

    return decorated_function

def jwt_middleware(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({"error": "Missing token for access."}), 401

        token = auth_header.split(' ')[1]
        try:
            payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
            g.user = payload  # Store user info in Flask's 'g' context
            return f(*args, **kwargs)
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token has expired."}), 403
        except jwt.InvalidTokenError:
            return jsonify({"error": "Invalid token."}), 403
    return decorated_function

def role_middleware(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not hasattr(g, 'user') or not g.user:
            return jsonify({"error": "User information not found in request context."}), 401

        logged_in_user_id = g.user.get('userId')
        user_role = g.user.get('role')
        resource_id = kwargs.get('id')  # Assuming your route parameter for resource ID is 'id'

        if user_role == "admin" or (resource_id is not None and str(logged_in_user_id) == str(resource_id)):
            return f(*args, **kwargs)
        else:
            print("Resource ID:", resource_id)
            print("Logged In User ID:", logged_in_user_id)
            return jsonify({"error": "Access denied. Insufficient permissions."}), 403
    return decorated_function

app = Flask(__name__)

# Register the Blueprint for user-related routes
app.register_blueprint(user_routes, url_prefix='/users')
app.register_blueprint(review_routes, url_prefix='/reviews')

app.register_blueprint(movie_routes, url_prefix='/movies')

# Home route (optional)
@app.route("/", methods=["GET"])
def home():
    return "Flask BFF for Users is up!"

if __name__ == "__main__":
    app.run(debug=True, port=3002)