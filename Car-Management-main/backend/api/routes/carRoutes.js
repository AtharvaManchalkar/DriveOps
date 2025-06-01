const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const carController = require('../controllers/car.controller');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Make sure this directory exists
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

// Routes
router.get('/', carController.getAllCars);
router.get('/:id', carController.getCarById);
router.post('/', upload.array('images', 10), carController.createCar);
router.put('/:id', upload.array('images', 10), carController.updateCar);
router.delete('/:id', carController.deleteCar);

module.exports = router;