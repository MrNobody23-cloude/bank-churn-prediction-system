from flask import Flask, jsonify, request
from flask_cors import CORS
from models.churn_model import ChurnPredictor
from data.customer_data import get_all_customers, get_customer_by_id
import os

app = Flask(__name__)
CORS(app)

predictor = ChurnPredictor()

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'message': 'Bank Churn Prediction API is running'})

@app.route('/api/customers', methods=['GET'])
def get_customers():
    customers = get_all_customers()
    enriched = []
    for customer in customers:
        prob = predictor.predict(customer)
        risk = predictor.get_risk_category(prob)
        enriched.append({
            **customer,
            'probability': prob,
            'riskLevel': risk['level'],
            'riskColor': risk['color'],
            'riskBg': risk['bg']
        })
    return jsonify(enriched)

@app.route('/api/customers/<int:customer_id>', methods=['GET'])
def get_customer(customer_id):
    customer = get_customer_by_id(customer_id)
    if customer:
        prob = predictor.predict(customer)
        risk = predictor.get_risk_category(prob)
        drivers = predictor.get_churn_drivers(customer)
        return jsonify({
            **customer,
            'probability': prob,
            'riskLevel': risk['level'],
            'riskColor': risk['color'],
            'riskBg': risk['bg'],
            'drivers': drivers
        })
    return jsonify({'error': 'Customer not found'}), 404

@app.route('/api/predict', methods=['POST'])
def predict_churn():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    
    prob = predictor.predict(data)
    risk = predictor.get_risk_category(prob)
    drivers = predictor.get_churn_drivers(data)
    
    return jsonify({
        'probability': prob,
        'riskLevel': risk['level'],
        'riskColor': risk['color'],
        'riskBg': risk['bg'],
        'drivers': drivers
    })

@app.route('/api/metrics', methods=['GET'])
def get_metrics():
    customers = get_all_customers()
    metrics = predictor.calculate_metrics(customers)
    return jsonify(metrics)

@app.route('/api/analytics/distribution', methods=['GET'])
def get_distribution():
    customers = get_all_customers()
    distribution = predictor.get_distribution_data(customers)
    return jsonify(distribution)

@app.route('/api/analytics/geography', methods=['GET'])
def get_geography_analysis():
    customers = get_all_customers()
    geo_analysis = predictor.get_geography_analysis(customers)
    return jsonify(geo_analysis)

@app.route('/api/analytics/age', methods=['GET'])
def get_age_analysis():
    customers = get_all_customers()
    age_analysis = predictor.get_age_analysis(customers)
    return jsonify(age_analysis)

@app.route('/api/analytics/stats', methods=['GET'])
def get_stats():
    customers = get_all_customers()
    high_risk = 0
    medium_risk = 0
    low_risk = 0
    churned = 0
    
    for customer in customers:
        prob = predictor.predict(customer)
        if prob >= 0.6:
            high_risk += 1
        elif prob >= 0.3:
            medium_risk += 1
        else:
            low_risk += 1
        churned += customer.get('Exited', 0)
    
    return jsonify({
        'total': len(customers),
        'highRisk': high_risk,
        'mediumRisk': medium_risk,
        'lowRisk': low_risk,
        'churned': churned
    })

@app.route('/api/feature-importance', methods=['GET'])
def get_feature_importance():
    return jsonify(predictor.feature_importance)

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
