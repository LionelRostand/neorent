const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Import de la connexion MongoDB
require('./config/db');

// Routes de base
app.get('/api/health', async (req, res) => {
  try {
    // Vérifier la connexion MongoDB
    if (mongoose.connection.readyState === 1) {
      const collections = await mongoose.connection.db.listCollections().toArray();
      res.json({
        status: 'success',
        message: 'API et MongoDB connectés',
        mongodb: {
          connected: true,
          collections: collections.map(c => c.name)
        }
      });
    } else {
      res.status(500).json({
        status: 'error',
        message: 'MongoDB non connecté',
        mongodb: { connected: false }
      });
    }
  } catch (error) {
    console.error('Erreur health check:', error);
    res.status(500).json({
      status: 'error',
      message: 'Erreur lors du health check',
      error: error.message
    });
  }
});

// Route pour tester la connexion MongoDB
app.post('/api/mongo/test', async (req, res) => {
  try {
    const { connectionString } = req.body;
    
    if (!connectionString) {
      return res.status(400).json({
        success: false,
        message: 'URL de connexion manquante'
      });
    }

    // Test de connexion temporaire
    const testConnection = await mongoose.createConnection(connectionString);
    await testConnection.close();

    res.json({
      success: true,
      message: 'Connexion MongoDB réussie'
    });
  } catch (error) {
    console.error('Erreur test MongoDB:', error);
    res.json({
      success: false,
      message: `Erreur de connexion: ${error.message}`
    });
  }
});

// Route pour lister les collections
app.get('/api/collections', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(500).json({
        error: 'MongoDB non connecté'
      });
    }

    const collections = await mongoose.connection.db.listCollections().toArray();
    res.json(collections.map(c => ({
      name: c.name,
      type: c.type
    })));
  } catch (error) {
    console.error('Erreur collections:', error);
    res.status(500).json({
      error: error.message
    });
  }
});

// Gestion des erreurs globales
app.use((err, req, res, next) => {
  console.error('Erreur serveur:', err);
  res.status(500).json({
    error: 'Erreur interne du serveur',
    message: err.message
  });
});

// Route 404
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route non trouvée'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Serveur API démarré sur le port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;