const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  title: { type: String, required: true },
  address: { type: String, required: true },
  rent: { type: Number, required: true },
  surface: { type: Number, required: true },
  status: { type: String, enum: ['available', 'rented', 'maintenance'], default: 'available' },
  owner: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Property', propertySchema);