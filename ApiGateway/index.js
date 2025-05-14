require('dotenv').config();
const express = require('express');
const axios = require('axios');
const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    console.error('FATAL ERROR: JWT_SECRET environment variable not set!');
    process.exit(1);
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
        req.user = user; 
        next();
    });
}

const app = express();
const port = 3003;

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100,
    message: "Too many requests from this IP, please try again later"
});

app.use(cors());
app.use(limiter);
app.use(express.json());

const KOA_SERVICE_URL = 'http://localhost:3001';
const FLASK_SERVICE_URL = 'http://localhost:3002';


function getServiceUrl(clientType) {
    if (clientType === 'mobile') {
        return FLASK_SERVICE_URL;
    } else if (clientType === 'web') {
        return KOA_SERVICE_URL;
    } else {
        return null;
    }
}

app.post('/users/login', async (req, res) => {
    const clientType = req.headers['x-client-type'];
    const baseUrl = getServiceUrl(clientType);
    
    if (!baseUrl) {
        return res.status(400).json({ error: 'Missing or invalid X-Client-Type header' });
    }

    try {
        const response = await axios.post(`${baseUrl}/users/login`, req.body);
        return res.json(response.data);
    } catch (error) {
        console.error('Error during login call:', error);
        return res.status(error.response?.status || 500).json({ error: 'Error during login call' });
    }
});

app.post('/users/register', async (req, res) => {
    const clientType = req.headers['x-client-type'];
    const baseUrl = getServiceUrl(clientType);
    
    if (!baseUrl) {
        return res.status(400).json({ error: 'Missing or invalid X-Client-Type header' });
    }

    try {
        const response = await axios.post(`${baseUrl}/users/register`, req.body);
        return res.json(response.data);
    } catch (error) {
        console.error('Error during registration call:', error);
        return res.status(error.response?.status || 500).json({ error: 'Error during registration call' });
    }
});


app.use(authenticateToken); 

app.get('/movies/:id', async (req, res) => {
    const clientType = req.headers['x-client-type'];
    const baseUrl = getServiceUrl(clientType);
    
    if (!baseUrl) {
        return res.status(400).json({ error: 'Missing or invalid X-Client-Type header' });
    }

    try {
        const response = await axios.get(`${baseUrl}/movies/${req.params.id}`);
        return res.json(response.data);
    } catch (error) {
        console.error('Error fetching movie:', error);
        return res.status(error.response?.status || 500).json({ error: 'Failed to fetch movie' });
    }
});

app.get('/reviews/:movieId', async (req, res) => {
    const clientType = req.headers['x-client-type'];
    const baseUrl = getServiceUrl(clientType);
    
    if (!baseUrl) {
        return res.status(400).json({ error: 'Missing or invalid X-Client-Type header' });
    }

    try {
        const response = await axios.get(`${baseUrl}/reviews/movie/${req.params.movieId}`);
        return res.json(response.data);
    } catch (error) {
        console.error('Error fetching reviews:', error);
        return res.status(error.response?.status || 500).json({ error: 'Failed to fetch reviews' });
    }
});

app.listen(port, () => {
    console.log(`API Gateway running at http://localhost:${port}`);
});
