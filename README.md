# DriveOps - Car Management System

## 🚗 Project Overview

DriveOps is a comprehensive full-stack car management system built with the MERN stack (MongoDB, Express.js, React.js, Node.js). The application provides users with a complete platform for discovering, managing, and organizing detailed information about various vehicles, including maintenance history tracking, interactive maps, and location-based features.

## 🎯 Key Features

### Core Functionality
- **User Authentication**: Secure JWT-based registration and login system
- **Car Management**: Full CRUD operations for vehicle listings
- **Search & Filter**: Advanced search functionality by model, manufacturer, and specifications
- **Maintenance History**: Comprehensive vehicle service record tracking
- **Interactive Maps**: Location-based features using Leaflet.js and OpenStreetMap
- **Car Comparison**: Side-by-side vehicle specification comparison
- **Responsive Design**: Mobile-first design accessible across all devices

### Advanced Features
- **Location Services**: Interactive map selection for vehicle locations
- **Service Type Icons**: Visual categorization of maintenance records
- **Cost Tracking**: Financial management for vehicle expenses
- **Parts Management**: Track replaced parts and service providers
- **Real-time Updates**: Dynamic content updates without page refresh

## 🛠️ Technical Stack

### Frontend
- **Framework**: React.js 18.3.1
- **Routing**: React Router DOM 6.28.0
- **HTTP Client**: Axios 1.7.7
- **Maps**: Leaflet.js 1.9.4 with React Leaflet 4.2.1
- **Styling**: CSS3 with Tailwind CSS 3.4.16
- **Testing**: Jest with React Testing Library

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js 4.21.1
- **Database**: MongoDB with Mongoose 8.8.1
- **Authentication**: JWT (jsonwebtoken 9.0.2)
- **Password Hashing**: bcryptjs 2.4.3
- **File Upload**: Multer 1.4.5
- **CORS**: cors 2.8.5

### DevOps & Deployment
- **Containerization**: Docker with multi-stage builds
- **CI/CD**: GitHub Actions
- **Deployment**: Render (Primary), Docker Hub (Container Registry)
- **Database**: MongoDB Atlas (Cloud)

## 📁 Project Structure

```
DriveOps/
├── README.md
├── render.yaml                 # Render deployment configuration
├── .github/
│   └── workflows/
│       ├── ci.yml             # Continuous Integration
│       ├── cd.yml             # Continuous Deployment
│       ├── artifacts.yml      # Build artifacts management
│       ├── docker-container.yml # Docker container builds
│       └── main.yml           # Main workflow
└── Car-Management-main/
    ├── deploy.sh              # Deployment script
    ├── docker-compose.yml     # Development containers
    ├── docker-compose.prod.yml # Production containers
    ├── LICENSE.md
    ├── README.md
    ├── backend/
    │   └── api/
    │       ├── .env           # Environment variables
    │       ├── .gitignore
    │       ├── Dockerfile     # Backend container
    │       ├── package.json
    │       ├── server.js      # Main server file
    │       ├── db.js          # Database connection
    │       ├── controllers/   # Route controllers
    │       ├── middleware/    # Custom middleware
    │       ├── models/        # MongoDB schemas
    │       └── routes/        # API endpoints
    └── frontend/
        ├── .gitignore
        ├── Dockerfile         # Frontend container
        ├── jest.config.js     # Testing configuration
        ├── nginx.conf         # Nginx configuration
        ├── package.json
        ├── render.json        # Render-specific config
        ├── tailwind.config.js # Tailwind CSS config
        ├── public/            # Static assets
        └── src/
            ├── api/           # API integration
            ├── components/    # React components
            ├── styles/        # CSS stylesheets
            ├── App.js         # Main App component
            ├── index.js       # React entry point
            └── output.css     # Compiled Tailwind CSS
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Docker (optional)
- Git

### Local Development Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/AtharvaManchalkar/DriveOps.git
   cd DriveOps
   ```

2. **Backend Setup**
   ```bash
   cd Car-Management-main/backend/api
   npm install
   
   # Create .env file
   cat > .env << EOF
   MONGO_URI=mongodb://localhost:27017/car_management
   JWT_SECRET=your_jwt_secret_key_here
   PORT=5000
   NODE_ENV=development
   EOF
   
   # Start backend server
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd Car-Management-main/frontend
   npm install
   
   # Generate Tailwind CSS
   npm run dev
   
   # Start development server
   npm start
   ```

4. **Access Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

### Docker Development Setup

1. **Using Docker Compose**
   ```bash
   cd Car-Management-main
   docker-compose up -d
   ```

2. **Access Services**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000
   - MongoDB: localhost:27017

## 🧪 Testing

### Frontend Testing
```bash
cd Car-Management-main/frontend
npm test                    # Run tests
npm test -- --coverage     # Run with coverage
```

### Test Configuration
- **Test Framework**: Jest with jsdom environment
- **Testing Library**: React Testing Library
- **Coverage Threshold**: 70% for statements, branches, functions, and lines
- **Mock Files**: CSS imports and problematic modules mocked

## 🏗️ Build & Production

### Manual Build
```bash
# Frontend build
cd Car-Management-main/frontend
npm run build

# Backend (production ready)
cd Car-Management-main/backend/api
npm start
```

### Docker Production Build
```bash
cd Car-Management-main
docker-compose -f docker-compose.prod.yml up -d
```

## 🚀 CI/CD Pipeline

### Continuous Integration (CI)
Our CI pipeline runs on every push and pull request:

1. **Linting**: Code quality checks
2. **Testing**: Automated test suite execution
3. **Build**: Production build generation
4. **Docker**: Container image creation
5. **Artifacts**: Build artifact storage

### Continuous Deployment (CD)
Automated deployment to production:

1. **Render Deployment**: Frontend and backend services
2. **Docker Hub**: Container image publishing
3. **Environment Management**: Secure secret handling

### GitHub Actions Workflows

#### Primary Workflows
- **ci.yml**: Complete CI pipeline with testing and Docker builds
- **cd.yml**: Deployment to Render platform
- **artifacts.yml**: Build artifact management
- **`docker-container.yml`**: Specialized Docker container builds

#### Workflow Features
- **Multi-stage builds**: Optimized Docker images
- **Secret management**: Secure environment variable handling
- **Artifact caching**: Improved build performance
- **Branch protection**: Main branch deployment only

## 🌐 Deployment

### Production Environment (Render)

#### Backend Service Configuration
- **Platform**: Render Web Service
- **Runtime**: Node.js
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Environment Variables**:
  ```
  MONGO_URI=mongodb+srv://...
  JWT_SECRET=production_secret
  NODE_ENV=production
  PORT=5000
  ```

#### Frontend Service Configuration
- **Platform**: Render Static Site
- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `build`
- **Environment Variables**:
  ```
  REACT_APP_API_URL=https://driveops-backend.onrender.com
  NODE_VERSION=16
  ```

### Alternative Deployment Options

#### Docker Hub
- **Frontend Image**: `atharvamanchalkar/driveops-frontend:latest`
- **Backend Image**: `atharvamanchalkar/driveops-backend:latest`

#### Self-Hosted Deployment
```bash
# Using deployment script
cd Car-Management-main
chmod +x deploy.sh
./deploy.sh
```

## 🔧 Environment Variables

### Backend (.env)
```env
MONGO_URI=mongodb://localhost:27017/car_management
JWT_SECRET=your_super_secret_jwt_key
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### Frontend
```env
REACT_APP_API_URL=http://localhost:5000
```

## 📊 Database Schema

### User Schema
```javascript
{
  username: String (required, unique),
  email: String (required, unique),
  password: String (required, hashed),
  createdAt: Date
}
```

### Car Schema
```javascript
{
  name: String (required),
  manufacturer: String (required),
  year: Number (required),
  price: Number,
  description: String,
  image: String,
  location: {
    lat: Number,
    lng: Number
  },
  userId: ObjectId (ref: User),
  createdAt: Date
}
```

### Maintenance Record Schema
```javascript
{
  title: String (required),
  description: String,
  date: Date (required),
  mileage: Number (required),
  cost: Number (required),
  serviceType: String (enum),
  partsReplaced: String,
  serviceProvider: String,
  carId: ObjectId (ref: Car),
  userId: ObjectId (ref: User)
}
```

## 🔐 Security Features

### Authentication & Authorization
- **JWT Tokens**: Secure stateless authentication
- **Password Hashing**: bcrypt with salt rounds
- **Protected Routes**: Middleware-based route protection
- **CORS Configuration**: Controlled cross-origin requests

### Input Validation
- **Request Sanitization**: Express middleware
- **File Upload Limits**: Multer configuration
- **Environment Variables**: Sensitive data protection

## 🎨 UI/UX Features

### Design System
- **Color Scheme**: Professional blue and gray palette
- **Typography**: System fonts with fallbacks
- **Responsive Grid**: Mobile-first approach
- **Icons**: Service type visual indicators
- **Loading States**: User feedback during operations

### User Experience
- **Intuitive Navigation**: Clear menu structure
- **Search Functionality**: Real-time filtering
- **Form Validation**: Client-side input validation
- **Error Handling**: User-friendly error messages
- **Success Feedback**: Action confirmation

## 📈 Performance Optimizations

### Frontend
- **Code Splitting**: Dynamic imports for components
- **Image Optimization**: Compressed assets
- **CSS Optimization**: Tailwind CSS purging
- **Bundle Analysis**: Webpack bundle optimization

### Backend
- **Database Indexing**: Optimized query performance
- **Middleware Optimization**: Streamlined request processing
- **Error Handling**: Graceful error responses
- **CORS Optimization**: Specific origin allowlisting

## 🔍 API Documentation

### Authentication Endpoints
```
POST /auth/register - User registration
POST /auth/login    - User login
```

### Car Management Endpoints
```
GET    /cars       - Get all cars
POST   /cars       - Create new car
GET    /cars/:id   - Get specific car
PUT    /cars/:id   - Update car
DELETE /cars/:id   - Delete car
```

### Maintenance Endpoints
```
GET    /maintenance/:carId - Get maintenance records
POST   /maintenance        - Create maintenance record
PUT    /maintenance/:id    - Update maintenance record
DELETE /maintenance/:id    - Delete maintenance record
```

## 🚨 Troubleshooting

### Common Issues

#### Package Lock Sync Issues
```bash
rm package-lock.json
npm install
```

#### Docker Build Issues
```bash
docker system prune
docker-compose build --no-cache
```

#### Environment Variable Issues
- Verify `.env` file exists
- Check variable naming (REACT_APP_ prefix for frontend)
- Restart development servers after changes

### Development Tips
- Use `npm run dev` for Tailwind CSS watch mode
- Check browser console for React errors
- Monitor backend logs for API issues
- Use MongoDB Compass for database inspection

## 📚 Additional Resources

### Documentation Links
- [React Documentation](https://reactjs.org/)
- [Express.js Guide](https://expressjs.com/)
- [MongoDB Manual](https://docs.mongodb.com/)
- [Docker Documentation](https://docs.docker.com/)
- [Render Deployment Guide](https://render.com/docs)

### Learning Resources
- [MERN Stack Tutorial](https://www.mongodb.com/languages/mern-stack-tutorial)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [JWT Authentication Guide](https://jwt.io/introduction)

## 👥 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE.md file for details.

## 👨‍💻 Author

**Atharva Manchalkar**
- GitHub: [@AtharvaManchalkar](https://github.com/AtharvaManchalkar)
- Project Link: [DriveOps](https://github.com/AtharvaManchalkar/DriveOps)

## 🙏 Acknowledgments

- Original car management concept by Shubham Sharma
- React community for excellent documentation
- MongoDB Atlas for reliable database hosting
- Render platform for seamless deployment
- Open source community for various libraries and tools

---
