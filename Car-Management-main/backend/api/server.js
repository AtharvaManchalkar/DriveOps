require('dotenv').config(); // Make sure this is at the very top
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const path = require('path'); 
const multer = require('multer'); // Add this line
const authRoutes = require('./routes/authRoutes'); 
const carRoutes = require('./routes/carRoutes');
const app = express();

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection failed:', error);
  }
};

connectDB();

// Middleware
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Add this to handle JSON data from forms
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Add this line

// Routes
app.use('/auth', authRoutes); 
app.use('/cars', carRoutes); 

app.get('/', (req, res) => {
  res.json({message:'Hello World'})
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));