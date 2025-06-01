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

module.exports = upload;
