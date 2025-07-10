import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
const Router = express.Router();

// Manually define __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
Router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'Views', 'index.html'));
});

Router.get('/login.html', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'Views', 'login.html'));
});

Router.get('/signup.html', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'Views', 'signup.html'));
});

export default Router;
