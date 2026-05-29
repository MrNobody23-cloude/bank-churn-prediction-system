# Bank Customer Churn Prediction - Frontend

React application for the Bank Customer Churn Prediction System.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Configuration

Set the API URL in environment variables:

```bash
VITE_API_URL=http://localhost:5000/api
```

## Features

- **Dashboard**: Overview of churn metrics, model performance, and analytics
- **Risk Calculator**: Interactive tool to calculate churn probability for individual customers
- **Analysis**: Detailed customer data exploration with filtering and export

## Fallback Mode

If the Flask API is unavailable, the application automatically switches to local mode using client-side calculations. This ensures the application remains functional for demonstration purposes.
