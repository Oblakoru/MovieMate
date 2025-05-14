# reviews.py (Flask Blueprint)
import requests
from flask import Blueprint, jsonify, request
from middleware import jwt_middleware, role_middleware, review_ownership_middleware

REVIEW_SERVICE_URL = "http://localhost:8080/reviews"

# Create a Blueprint for reviews
review_routes = Blueprint('review_routes', __name__)

# Add a new review
@review_routes.route('/', methods=['POST'])
@jwt_middleware
def add_review():
    data = request.get_json()
    try:
        response = requests.post(REVIEW_SERVICE_URL, json=data)
        if response.status_code == 201:
            return jsonify({"message": "Review successfully added."}), 201
        else:
            return jsonify({"error": "Error adding review."}), 400
    except Exception as error:
        return jsonify({"error": str(error)}), 400

# Get all reviews
@review_routes.route('/', methods=['GET'])
def get_all_reviews():
    try:
        response = requests.get(REVIEW_SERVICE_URL)
        if response.status_code == 200:
            return jsonify(response.json()), 200
        else:
            return jsonify({"error": "Error retrieving reviews."}), 400
    except Exception as error:
        return jsonify({"error": str(error)}), 400

# Get reviews by movie ID
@review_routes.route('/movie/<int:movie_id>', methods=['GET'])
def get_reviews_by_movie(movie_id):
    try:
        response = requests.get(f"{REVIEW_SERVICE_URL}/movie/{movie_id}")
        if response.status_code == 200:
            return jsonify(response.json()), 200
        else:
            return jsonify({"error": "Error retrieving reviews for this movie."}), 400
    except Exception as error:
        return jsonify({"error": str(error)}), 400

# Update a review by ID
@review_routes.route('/<int:id>', methods=['PUT'])
@jwt_middleware
@review_ownership_middleware
def update_review(id):
    data = request.get_json()
    try:
        response = requests.put(f"{REVIEW_SERVICE_URL}/{id}", json=data)
        if response.status_code == 200:
            return jsonify({"message": "Review updated successfully."}), 200
        else:
            return jsonify({"error": "Error updating review."}), 400
    except Exception as error:
        return jsonify({"error": str(error)}), 400

# Delete a review by ID
@review_routes.route('/<int:id>', methods=['DELETE'])
@jwt_middleware
@review_ownership_middleware
def delete_review(id):
    try:
        response = requests.delete(f"{REVIEW_SERVICE_URL}/{id}")
        if response.status_code == 204:
            return jsonify({"message": "Review deleted successfully."}), 204
        else:
            return jsonify({"error": "Error deleting review."}), 400
    except Exception as error:
        return jsonify({"error": str(error)}), 400

# Get a review by ID
@review_routes.route('/<int:id>', methods=['GET'])
def get_review_by_id(id):
    try:
        response = requests.get(f"{REVIEW_SERVICE_URL}/{id}")
        if response.status_code == 200:
            return jsonify(response.json()), 200
        else:
            return jsonify({"error": "Review not found."}), 404
    except Exception as error:
        return jsonify({"error": str(error)}), 400
