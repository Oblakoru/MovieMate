from flask import Flask
from routes.users import user_routes  # Import the user routes
from routes.reviews import review_routes
from routes.movies import movie_routes
from functools import wraps
from flask import request, jsonify, g
import jwt
import os
import requests

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