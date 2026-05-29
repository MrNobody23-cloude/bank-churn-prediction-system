# Bank Customer Churn Prediction - Backend

Flask API for the Bank Customer Churn Prediction System.

## Setup

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run the server:
```bash
python app.py
```

The API will be available at `http://localhost:5000`

## API Endpoints

### Health Check
- `GET /api/health` - Check API status

### Customers
- `GET /api/customers` - Get all customers with churn predictions
- `GET /api/customers/<id>` - Get specific customer details

### Predictions
- `POST /api/predict` - Predict churn for custom input

### Analytics
- `GET /api/metrics` - Get model performance metrics
- `GET /api/analytics/distribution` - Get churn probability distribution
- `GET /api/analytics/geography` - Get geography-based analysis
- `GET /api/analytics/age` - Get age-based analysis
- `GET /api/analytics/stats` - Get overall statistics
- `GET /api/feature-importance` - Get feature importance data

## Example Request

```bash
curl -X POST http://localhost:5000/api/predict \
  -H "Content-Type: application/json" \
  -d '{
    "CreditScore": 650,
    "Geography": "Germany",
    "Gender": "Female",
    "Age": 45,
    "Tenure": 3,
    "Balance": 125000,
    "NumOfProducts": 2,
    "HasCrCard": 1,
    "IsActiveMember": 0,
    "EstimatedSalary": 80000
  }'
```
