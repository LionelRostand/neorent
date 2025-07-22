const express = require('express');
const Property = require('../models/Property');
const router = express.Router();

// GET toutes les propriétés
router.get('/', async (req, res) => {
  try {
    const properties = await Property.find();
    res.json(properties);
  } catch (error) {
    console.error('Erreur lors de la récupération des propriétés:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// GET propriété par ID
router.get('/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Propriété non trouvée' });
    }
    res.json(property);
  } catch (error) {
    console.error('Erreur lors de la récupération de la propriété:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// POST nouvelle propriété
router.post('/', async (req, res) => {
  try {
    const newProperty = new Property(req.body);
    await newProperty.save();
    res.status(201).json(newProperty);
  } catch (error) {
    console.error('Erreur lors de la création de la propriété:', error);
    res.status(400).json({ message: 'Erreur lors de la création' });
  }
});

// PUT mise à jour propriété
router.put('/:id', async (req, res) => {
  try {
    const updatedProperty = await Property.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true }
    );
    if (!updatedProperty) {
      return res.status(404).json({ message: 'Propriété non trouvée' });
    }
    res.json(updatedProperty);
  } catch (error) {
    console.error('Erreur lors de la mise à jour:', error);
    res.status(400).json({ message: 'Erreur lors de la mise à jour' });
  }
});

// DELETE propriété
router.delete('/:id', async (req, res) => {
  try {
    const deletedProperty = await Property.findByIdAndDelete(req.params.id);
    if (!deletedProperty) {
      return res.status(404).json({ message: 'Propriété non trouvée' });
    }
    res.json({ message: 'Propriété supprimée' });
  } catch (error) {
    console.error('Erreur lors de la suppression:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;