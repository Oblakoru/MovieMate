# users.py (Flask Blueprint)
import requests
from flask import Blueprint, jsonify, request

USER_SERVICE_URL = "http://localhost:3000/users"

# Create a Blueprint for users
user_routes = Blueprint('user_routes', __name__)

# Register User
@user_routes.route('/register', methods=['POST'])
def register_user():
    data = request.get_json()
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    try:
        response = requests.post(f"{USER_SERVICE_URL}/register",
                                 json={"name": name, "email": email, "password": password})
        response_data = response.json()
        if response.status_code == 201:
            return jsonify({"message": "User successfully registered.", "user": response_data}), 201
        else:
            return jsonify({"error": response_data.get("error", "Registration failed.")}), 400
    except Exception as error:
        return jsonify({"error": str(error)}), 400


# Login User
@user_routes.route('/login', methods=['POST'])
def login_user_route():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    try:
        response = requests.post(f"{USER_SERVICE_URL}/login", json={"email": email, "password": password})
        response_data = response.json()
        if response.status_code == 200:
            return jsonify({"message": "Login successful.", "user": response_data}), 200
        else:
            return jsonify({"error": response_data.get("error", "Login failed.")}), 400
    except Exception as error:
        return jsonify({"error": str(error)}), 400


# Get All Users
@user_routes.route('/', methods=['GET'])
def get_users():
    try:
        response = requests.get(f"{USER_SERVICE_URL}")
        if response.status_code == 200:
            return jsonify(response.json()), 200
        else:
            return jsonify({"error": "Error retrieving users."}), 400
    except Exception as error:
        return jsonify({"error": str(error)}), 400


# Get User by ID
@user_routes.route('/<int:id>', methods=['GET'])
def get_user(id):
    try:
        response = requests.get(f"{USER_SERVICE_URL}/{id}")
        if response.status_code == 200:
            return jsonify(response.json()), 200
        else:
            return jsonify({"error": "User not found."}), 404
    except Exception as error:
        return jsonify({"error": str(error)}), 400


# Update User by ID
@user_routes.route('/<int:id>', methods=['PUT'])
def update_user_route(id):
    data = request.get_json()
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    try:
        response = requests.put(f"{USER_SERVICE_URL}/{id}", json={"name": name, "email": email, "password": password})
        if response.status_code == 200:
            return jsonify({"message": "User updated successfully.", "user": response.json()}), 200
        else:
            return jsonify({"error": "Update failed."}), 400
    except Exception as error:
        return jsonify({"error": str(error)}), 400


# Delete User by ID
@user_routes.route('/<int:id>', methods=['DELETE'])
def delete_user_route(id):
    try:
        response = requests.delete(f"{USER_SERVICE_URL}/{id}")
        if response.status_code == 200:
            return jsonify({"message": "User deleted successfully."}), 200
        else:
            return jsonify({"error": "Error deleting user."}), 400
    except Exception as error:
        return jsonify({"error": str(error)}), 400
