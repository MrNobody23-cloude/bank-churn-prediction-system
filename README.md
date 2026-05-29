# Bank Customer Churn Prediction System

A full-stack predictive modeling and risk scoring system for bank customer churn analysis. Built with Flask (backend) and React (frontend).

## Project Structure

```
├── backend/                 # Flask API
│   ├── app.py              # Main Flask application
│   ├── models/             # ML model implementation
│   │   ├── __init__.py
│   │   └── churn_model.py  # Churn prediction model
│   ├── data/               # Customer data
│   │   ├── __init__.py
│   │   └── customer_data.py
│   ├── requirements.txt    # Python dependencies
│   └── README.md
│
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── Header.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── RiskCalculator.jsx
│   │   │   └── Analysis.jsx
│   │   ├── services/       # API service layer
│   │   │   └── api.js
│   │   ├── utils/          # Local model utilities
│   │   │   └── localModel.js
│   │   ├── data/           # Fallback customer data
│   │   │   └── customerData.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   └── README.md
│
├── vite.config.ts          # Vite configuration
└── README.md               # This file
```

## Features

### Dashboard
- Customer statistics overview (Total, High/Medium/Low Risk)
- Model performance metrics (Accuracy, Precision, Recall, F1-Score, ROC-AUC)
- Churn probability distribution charts
- Geography and age-based analysis
- Feature importance visualization

### Risk Calculator
- Interactive customer profile input
- Real-time churn probability calculation
- Risk level assessment (Low/Moderate/Elevated/High/Critical)
- Churn drivers identification
- Actionable recommendations

### Analysis
- Searchable and filterable customer table
- Sortable columns with pagination
- Age vs Balance scatter plot with risk coloring
- Balance distribution vs churn analysis
- Customer detail modal
- CSV export functionality

## Getting Started

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Run the server:
```bash
python app.py
```

The API will be available at `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Set API URL (optional):
```bash
export VITE_API_URL=http://localhost:5000/api
```

4. Start development server:
```bash
npm run dev
```

### Running Both Together

1. Start backend in one terminal:
```bash
cd backend && python app.py
```

2. Start frontend in another terminal:
```bash
cd frontend && npm run dev
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Health check |
| `/api/customers` | GET | Get all customers with predictions |
| `/api/customers/<id>` | GET | Get specific customer details |
| `/api/predict` | POST | Predict churn for custom input |
| `/api/metrics` | GET | Get model performance metrics |
| `/api/analytics/distribution` | GET | Churn probability distribution |
| `/api/analytics/geography` | GET | Geography-based analysis |
| `/api/analytics/age` | GET | Age-based analysis |
| `/api/analytics/stats` | GET | Overall statistics |
| `/api/feature-importance` | GET | Feature importance data |

## Fallback Mode

The frontend automatically switches to local mode if the Flask API is unavailable, ensuring the application remains functional for demonstration purposes.

## Tech Stack

- **Backend**: Python, Flask, Flask-CORS
- **Frontend**: React, JavaScript, Tailwind CSS, Recharts
- **Build Tool**: Vite

## Model Details

The churn prediction model uses logistic regression with the following key features:
- Age (18% importance)
- Number of Products (16% importance)
- Activity Status (15% importance)
- Geography (14% importance)
- Account Balance (12% importance)
- Credit Score (10% importance)

## License

This project is for educational and demonstration purposes.
