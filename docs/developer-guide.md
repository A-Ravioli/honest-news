# Honest News: Developer Guide

This guide will help you set up your development environment and understand the codebase structure for the Honest News application.

## Development Environment Setup

### Prerequisites

- Node.js (v16 or later)
- npm or Yarn
- React Native CLI
- MongoDB (local or Atlas account)
- Redis (optional for local development)
- API keys for news services and LLM providers

### Initial Setup

1. **Clone the repository**

```bash
git clone https://github.com/your-org/honest-news.git
cd honest-news
```

2. **Install dependencies**

```bash
# Install root dependencies
npm install

# Navigate to the mobile app directory
cd mobile
npm install

# Navigate to the server directory
cd ../server
npm install
```

3. **Set up environment variables**

Create `.env` files in both the `server` and `mobile` directories:

**server/.env**
```
# Server Configuration
PORT=4000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/honest-news
REDIS_URL=redis://localhost:6379

# Authentication
JWT_SECRET=your_jwt_secret
JWT_EXPIRY=7d

# News APIs
NEWSAPI_KEY=your_newsapi_key
GUARDIAN_API_KEY=your_guardian_key
NYT_API_KEY=your_nyt_key

# LLM APIs
OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_anthropic_key
```

**mobile/.env**
```
API_URL=http://localhost:4000/api
```

4. **Start the development servers**

```bash
# In the server directory
npm run dev

# In a new terminal, in the mobile directory
npm start
```

## Project Structure

### Mobile App (React Native)

```
mobile/
├── src/
│   ├── api/              # API service calls
│   ├── assets/           # Images, fonts, etc.
│   ├── components/       # Reusable UI components
│   ├── constants/        # App constants and theme
│   ├── contexts/         # React context providers
│   ├── hooks/            # Custom React hooks
│   ├── navigation/       # Navigation configuration
│   ├── screens/          # Screen components
│   ├── store/            # Redux store setup
│   ├── types/            # TypeScript type definitions
│   └── utils/            # Utility functions
├── App.tsx              # Root component
└── index.js             # Entry point
```

### Backend (Node.js/Express)

```
server/
├── src/
│   ├── config/           # Configuration files
│   ├── controllers/      # Request handlers
│   ├── middleware/       # Express middleware
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── services/         # Business logic
│   │   ├── news/         # News aggregation services
│   │   ├── ai/           # AI processing services
│   │   └── user/         # User management services
│   ├── utils/            # Utility functions
│   └── app.js            # Express app setup
└── index.js              # Entry point
```

## Development Workflow

### Mobile App Development

1. **Create new components in the appropriate directories**
   - UI components go in `mobile/src/components/`
   - Screens go in `mobile/src/screens/`

2. **Follow the styling guidelines**
   - Use the theme defined in `mobile/src/constants/theme.js`
   - Create styled components for complex UI elements

3. **State management**
   - Use Redux for global state
   - Use React Context for theme/auth state
   - Use local state for component-specific state

4. **API integration**
   - Add new API endpoints in `mobile/src/api/`
   - Use the API hooks in `mobile/src/hooks/`

### Backend Development

1. **Create new endpoints**
   - Define routes in `server/src/routes/`
   - Implement controllers in `server/src/controllers/`
   - Add business logic in `server/src/services/`

2. **Database models**
   - Define MongoDB schemas in `server/src/models/`
   - Use Mongoose for database operations

3. **AI processing**
   - Implement LLM logic in `server/src/services/ai/`
   - Follow the prompt templates defined in the AI documentation

## Code Style and Best Practices

### General Guidelines

- Follow the Airbnb JavaScript Style Guide
- Use meaningful variable and function names
- Write JSDoc comments for functions
- Write unit tests for critical functionality

### React Native Guidelines

- Use functional components with hooks
- Break down complex screens into smaller components
- Use the React Navigation API consistently
- Handle loading and error states for all data fetching

### Backend Guidelines

- Follow RESTful API design principles
- Implement proper error handling
- Log important events and errors
- Use async/await for asynchronous code

## Testing

### Mobile App Testing

```bash
# In the mobile directory
npm test
```

### Backend Testing

```bash
# In the server directory
npm test
```

## Deployment

### Mobile App Deployment

1. **Build the app for production**

```bash
# In the mobile directory
npm run build
```

2. **Deploy to app stores**
   - Follow the React Native [deployment guide](https://reactnative.dev/docs/publishing-to-app-store)

### Backend Deployment

1. **Build the server for production**

```bash
# In the server directory
npm run build
```

2. **Deploy to your hosting provider**
   - We recommend using Docker containers with Kubernetes
   - Set up CI/CD pipelines for automated deployment

## Contribution Guidelines

1. **Create a new branch for each feature or bugfix**
2. **Follow the commit message convention**
   - Format: `type(scope): message`
   - Example: `feat(news-feed): add pull-to-refresh functionality`
3. **Submit a pull request for review**
4. **Ensure all tests pass before merging**

## Troubleshooting

### Common Issues

1. **Metro bundler port conflicts**
   - Change the port using `npm start -- --port 8088`

2. **MongoDB connection errors**
   - Check your MongoDB connection string
   - Ensure MongoDB is running

3. **API rate limiting**
   - Implement proper caching to reduce API calls
   - Use the development API keys with caution

4. **React Native build errors**
   - Clear the cache: `npm start -- --reset-cache`
   - Rebuild: `cd android && ./gradlew clean` or `cd ios && pod install`

## Resources

- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Redux Documentation](https://redux.js.org/) 