const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// GET toutes les collections
router.get('/', async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    
    const collectionsWithData = await Promise.all(
      collections.map(async (collection) => {
        const collectionRef = db.collection(collection.name);
        const count = await collectionRef.countDocuments();
        return {
          name: collection.name,
          count: count,
          documents: []
        };
      })
    );
    
    res.json(collectionsWithData);
  } catch (error) {
    console.error('Erreur lors de la récupération des collections:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// GET documents d'une collection spécifique
router.get('/:collectionName', async (req, res) => {
  try {
    const { collectionName } = req.params;
    const db = mongoose.connection.db;
    const collection = db.collection(collectionName);
    
    const documents = await collection.find({}).limit(100).toArray();
    const count = await collection.countDocuments();
    
    res.json({
      name: collectionName,
      count: count,
      documents: documents
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de la collection:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;