const Car = require('../models/Car');
const multer = require('multer');
const path = require('path');

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Folder where files will be stored
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Add timestamp to avoid filename conflicts
  }
});

// Set up file filter to only allow images (optional)
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true); // File is allowed
  } else {
    cb(new Error('Only image files are allowed'), false); // Reject file
  }
};

// Initialize multer with storage settings
const upload = multer({
  storage: storage,
  fileFilter: fileFilter
});

// Controller functions

// Update the createCar function
// This should be in your backend car controller (likely car.controller.js)
exports.createCar = async (req, res) => {
  try {
    // Debug log to see what's being received
    console.log("Creating car with data:", req.body);
    console.log("Files received:", req.files ? req.files.length : 'No files');
    
    // Parse location if it's a string
    let locationData = null;
    if (req.body.location) {
      try {
        locationData = typeof req.body.location === 'string' 
          ? JSON.parse(req.body.location) 
          : req.body.location;
        
        // Ensure coordinates are numbers
        if (locationData.coordinates) {
          locationData.coordinates = locationData.coordinates.map(coord => 
            typeof coord === 'string' ? parseFloat(coord) : coord
          );
        }
      } catch (err) {
        console.error('Error parsing location:', err);
      }
    }
    
    // Parse specifications
    let specifications = {};
    if (req.body.specifications) {
      try {
        specifications = typeof req.body.specifications === 'string'
          ? JSON.parse(req.body.specifications)
          : req.body.specifications;
        
        // Convert string values to numbers
        if (specifications.horsepower) specifications.horsepower = Number(specifications.horsepower);
        if (specifications.torque) specifications.torque = Number(specifications.torque);
        if (specifications.acceleration) specifications.acceleration = Number(specifications.acceleration);
        if (specifications.topSpeed) specifications.topSpeed = Number(specifications.topSpeed);
        if (specifications.fuelEconomy) specifications.fuelEconomy = Number(specifications.fuelEconomy);
      } catch (err) {
        console.error('Error parsing specifications:', err);
      }
    }
    
    // Parse features
    let features = [];
    if (req.body.features) {
      try {
        features = typeof req.body.features === 'string'
          ? JSON.parse(req.body.features)
          : req.body.features;
      } catch (err) {
        console.error('Error parsing features:', err);
      }
    }
    
    // Parse tags
    let tags = [];
    if (req.body.tags) {
      if (typeof req.body.tags === 'string') {
        tags = req.body.tags.split(',').map(tag => tag.trim());
      } else {
        tags = req.body.tags;
      }
    }
    
    // Create the car data object
    const carData = {
      title: req.body.title,
      description: req.body.description,
      tags: tags,
      make: req.body.make,
      model: req.body.model,
      year: Number(req.body.year),
      price: Number(req.body.price),
      mileage: Number(req.body.mileage),
      bodyType: req.body.bodyType,
      engineType: req.body.engineType,
      transmission: req.body.transmission,
      fuelType: req.body.fuelType,
      color: req.body.color,
      features: features,
      specifications: specifications,
      location: locationData,
      images: req.files ? req.files.map(file => file.path) : []
    };
    
    // Log the processed car data
    console.log("Processed car data:", carData);
    
    // Create the car in the database
    const car = await Car.create(carData);
    console.log("Car created successfully with ID:", car._id);
    res.status(201).json(car);
  } catch (error) {
    console.error('Error creating car:', error);
    res.status(500).json({ 
      message: 'Failed to create car', 
      error: error.message,
      stack: error.stack 
    });
  }
};


// Update the updateCar function
exports.updateCar = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Parse location if it's a string
    let locationData = null;
    if (req.body.location) {
      try {
        locationData = typeof req.body.location === 'string' 
          ? JSON.parse(req.body.location) 
          : req.body.location;
        
        // Ensure coordinates are numbers
        if (locationData.coordinates) {
          locationData.coordinates = locationData.coordinates.map(coord => 
            typeof coord === 'string' ? parseFloat(coord) : coord
          );
        }
      } catch (err) {
        console.error('Error parsing location:', err);
      }
    }
    
    // Parse specifications
    let specifications = {};
    if (req.body.specifications) {
      try {
        specifications = typeof req.body.specifications === 'string'
          ? JSON.parse(req.body.specifications)
          : req.body.specifications;
        
        // Convert string values to numbers
        if (specifications.horsepower) specifications.horsepower = Number(specifications.horsepower);
        if (specifications.torque) specifications.torque = Number(specifications.torque);
        if (specifications.acceleration) specifications.acceleration = Number(specifications.acceleration);
        if (specifications.topSpeed) specifications.topSpeed = Number(specifications.topSpeed);
        if (specifications.fuelEconomy) specifications.fuelEconomy = Number(specifications.fuelEconomy);
      } catch (err) {
        console.error('Error parsing specifications:', err);
      }
    }
    
    // Parse features
    let features = [];
    if (req.body.features) {
      try {
        features = typeof req.body.features === 'string'
          ? JSON.parse(req.body.features)
          : req.body.features;
      } catch (err) {
        console.error('Error parsing features:', err);
      }
    }
    
    // Create update object
    const updateData = {
      title: req.body.title,
      description: req.body.description
    };
    
    // Only update fields that are provided in the request
    if (req.body.tags) {
      updateData.tags = typeof req.body.tags === 'string'
        ? req.body.tags.split(',').map(tag => tag.trim())
        : req.body.tags;
    }
    if (req.body.make) updateData.make = req.body.make;
    if (req.body.model) updateData.model = req.body.model;
    if (req.body.year) updateData.year = Number(req.body.year);
    if (req.body.price) updateData.price = Number(req.body.price);
    if (req.body.mileage) updateData.mileage = Number(req.body.mileage);
    if (req.body.bodyType) updateData.bodyType = req.body.bodyType;
    if (req.body.engineType) updateData.engineType = req.body.engineType;
    if (req.body.transmission) updateData.transmission = req.body.transmission;
    if (req.body.fuelType) updateData.fuelType = req.body.fuelType;
    if (req.body.color) updateData.color = req.body.color;
    if (features.length > 0) updateData.features = features;
    if (Object.keys(specifications).length > 0) updateData.specifications = specifications;
    if (locationData) updateData.location = locationData;
    if (req.files && req.files.length > 0) updateData.images = req.files.map(file => file.path);
    
    const car = await Car.findByIdAndUpdate(id, updateData, { new: true });
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }
    res.json(car);
  } catch (error) {
    console.error('Error updating car:', error);
    res.status(500).json({ message: 'Failed to update car', error: error.message });
  }
};
exports.getAllCars = async (req, res) => {
  try {
    const cars = await Car.find({});
    console.log(`Found ${cars.length} cars`);
    res.json(cars);
  } catch (error) {
    console.error('Error fetching cars:', error);
    res.status(500).json({ message: 'Failed to fetch cars' });
  }
};


exports.getCarById = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }
    res.json(car);
  } catch (error) {
    console.error('Error fetching car:', error);
    res.status(500).json({ message: 'Failed to fetch car' });
  }
};

exports.deleteCar = async (req, res) => {
  try {
    const car = await Car.findByIdAndDelete(req.params.id);
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }
    res.json({ message: 'Car deleted successfully' });
  } catch (error) {
    console.error('Error deleting car:', error);
    res.status(500).json({ message: 'Failed to delete car' });
  }
};