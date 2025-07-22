const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/collections', require('./routes/collectionRoutes'));
app.use('/api/properties', require('./routes/propertyRoutes'));

// Route de test
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'API Neorent fonctionne' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Serveur démarré sur le port ${PORT}`));