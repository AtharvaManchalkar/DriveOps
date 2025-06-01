const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CarSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  tags: {
    type: [String],
    default: []
  },
  images: {
    type: [String],
    default: []
  },
  make: {
    type: String
  },
  model: {
    type: String
  },
  year: {
    type: Number
  },
  price: {
    type: Number
  },
  mileage: {
    type: Number
  },
  bodyType: {
    type: String
  },
  engineType: {
    type: String
  },
  transmission: {
    type: String
  },
  fuelType: {
    type: String
  },
  color: {
    type: String
  },
  features: {
    type: [String],
    default: []
  },
  specifications: {
    engine: String,
    horsepower: Number,
    torque: Number,
    acceleration: Number,
    topSpeed: Number,
    fuelEconomy: Number
  },
  location: {
    coordinates: {
      type: [Number], // [latitude, longitude]
      validate: {
        validator: function(v) {
          return v.length === 2 && !isNaN(v[0]) && !isNaN(v[1]);
        },
        message: props => `${props.value} is not a valid coordinate pair!`
      }
    },
    address: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Car', CarSchema);