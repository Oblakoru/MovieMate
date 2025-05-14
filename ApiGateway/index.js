
require('dotenv').config();
const express = require('express');
const axios = require('axios');
const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');
const cors = require('cors'); // Import the cors middleware

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    console.error('FATAL ERROR: JWT_SECRET environment variable not set!');
    process.exit(1); // Exit the process if the secret is missing
}

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        console.log('Authentication failed: Token missing');
        return res.status(401).json({ error: 'Token missing' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            console.log('Authentication failed: Invalid or expired token', err);
            return res.status(403).json({ error: 'Invalid or expired token' });
        }
        req.user = user; // Attach the user to the request
        next();
    });
}

const app = express();
const port = 3003;

const KOA_SERVICE_URL = 'http://localhost:3001';
const FLASK_SERVICE_URL = 'http://localhost:3002';

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: "Too many requests from this IP, please try again later"
});

// Enable CORS for all origins (adjust as needed for production)
app.use(cors());
app.use(limiter);
app.use(express.json());

function resolveService(req) {
    const clientType = req.headers['x-client-type'];
    if (clientType === 'mobile') return FLASK_SERVICE_URL;
    if (clientType === 'web') return KOA_SERVICE_URL;
    console.warn(`Warning: Missing or invalid X-Client-Type header: ${clientType}`);
    return null; // Explicitly return null for clarity
}

async function proxyRequest(req, res, targetUrl) {
  try {
    console.log(`Proxying request to: ${targetUrl}`);  
    const response = await axios({
      method: req.method,
      url: targetUrl,
      data: req.body,
      headers: { ...req.headers },
      params: req.query,
      timeout: 10000  
    });
    console.log('Response from service:', response.data);  // Log the response from the backend
    return res.status(response.status).json(response.data);
  } catch (error) {
    console.error('Error during proxy request:', error);  // Log error if something goes wrong
    const status = error.response?.status || 500;
    const message = error.response?.data || { error: 'Internal error' };
    console.error('Error response:', message);  // Log the response error
    return res.status(status).json(message);
  }
}

// Unprotected routes for login and register
app.post('/users/login', async (req, res) => {
    const baseUrl = resolveService(req);
    if (!baseUrl) {
        return res.status(400).json({ error: 'Missing or invalid X-Client-Type header' });
    }
    return proxyRequest(req, res, `${baseUrl}/users/login`);
});

app.post('/users/register', async (req, res) => {
    const baseUrl = resolveService(req);
    if (!baseUrl) {
        return res.status(400).json({ error: 'Missing or invalid X-Client-Type header' });
    }
    return proxyRequest(req, res, `${baseUrl}/users/register`);
});

// Apply JWT authentication middleware to all other routes
app.use(authenticateToken); // This will protect all routes below

app.get('/movies/:id', async (req, res) => {
    const baseUrl = resolveService(req);
    if (!baseUrl) {
        return res.status(400).json({ error: 'Missing or invalid X-Client-Type header' });
    }
    return proxyRequest(req, res, `${baseUrl}/movies/${req.params.id}`);
});

app.get('/reviews/:movieId', async (req, res) => {
    const baseUrl = resolveService(req);
    if (!baseUrl) {
        return res.status(400).json({ error: 'Missing or invalid X-Client-Type header' });
    }
    return proxyRequest(req, res, `${baseUrl}/reviews/movie/${req.params.movieId}`);
});

app.get('/movies/:id/details', async (req, res) => {
    try {
        console.log(`Fetching details for movie ID: ${req.params.id}`);
        const flaskPromise = axios.get(`${FLASK_SERVICE_URL}/movies/${req.params.id}`);
        const koaPromise = axios.get(`${KOA_SERVICE_URL}/reviews/movie/${req.params.id}`);
        const [movieRes, reviewsRes] = await Promise.all([flaskPromise, koaPromise]);

        const combinedData = {
            ...movieRes.data,
            reviews: reviewsRes.data
        };
        console.log('Successfully fetched and combined movie details.');
        return res.json(combinedData);
    } catch (error) {
        console.error('Error fetching movie details:', error.message);
        if (error.response) {
            console.error('Flask/Koa response error:', error.response.status, error.response.data);
        }
        return res.status(500).json({ error: 'Failed to fetch movie details from backend services.' });
    }
});

app.listen(port, () => {
    console.log(`API Gateway running at http://localhost:${port}`);
});