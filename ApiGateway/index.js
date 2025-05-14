const express = require('express');
const axios = require('axios');
const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'mojskrivnikljuc'; 

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; 

    if (!token) return res.status(401).json({ error: 'Token missing' });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid or expired token' });
        req.user = user;
        next();
    });
}

const app = express();
const port = 4000;

const KOA_SERVICE_URL = 'http://localhost:3001';  
const FLASK_SERVICE_URL = 'http://localhost:3002'; 

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later"
});

app.use(limiter);
app.use(express.json());

function resolveService(req) {
  const clientType = req.headers['x-client-type'];
  if (clientType === 'mobile') return FLASK_SERVICE_URL;
  if (clientType === 'web') return KOA_SERVICE_URL;
  return null;
}

async function proxyRequest(req, res, targetUrl) {
  try {
    const response = await axios({
      method: req.method,
      url: targetUrl,
      data: req.body,
      headers: { ...req.headers },
      params: req.query
    });
    return res.status(response.status).json(response.data);
  } catch (error) {
    const status = error.response?.status || 500;
    const message = error.response?.data || { error: 'Internal error' };
    return res.status(status).json(message);
  }
}

app.get('/movies/:id', async (req, res) => {
  const baseUrl = resolveService(req);
  if (!baseUrl) return res.status(400).json({ error: 'Missing or invalid X-Client-Type header' });
  return proxyRequest(req, res, `${baseUrl}/movies/${req.params.id}`);
});

app.get('/reviews/:movieId', async (req, res) => {
  const baseUrl = resolveService(req);
  if (!baseUrl) return res.status(400).json({ error: 'Missing or invalid X-Client-Type header' });
  return proxyRequest(req, res, `${baseUrl}/reviews/movie/${req.params.movieId}`);
});

app.get('/movies/:id/details', async (req, res) => {
  try {
    const flaskPromise = axios.get(`${FLASK_SERVICE_URL}/movies/${req.params.id}`);
    const koaPromise = axios.get(`${KOA_SERVICE_URL}/reviews/movie/${req.params.id}`);
    const [movieRes, reviewsRes] = await Promise.all([flaskPromise, koaPromise]);

    return res.json({
      ...movieRes.data,
      reviews: reviewsRes.data
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch movie details' });
  }
});

app.post('/users/register', async (req, res) => {
  const baseUrl = resolveService(req);
  if (!baseUrl) return res.status(400).json({ error: 'Missing or invalid X-Client-Type header' });
  return proxyRequest(req, res, `${baseUrl}/users/register`);
});

app.listen(port, () => {
  console.log(`API Gateway running at http://localhost:${port}`);
});
