const mongoose = require('mongoose');

const carSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    subtitle: { type: String, default: '', trim: true },
    imageUrl: { type: String, required: true, trim: true },
    price: { type: String, default: '' },
    description: { type: String, default: '' },
    features: { type: [String], default: [] },
    specs: { type: Object, default: {} }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Car', carSchema);


