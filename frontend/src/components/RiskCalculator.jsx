import { useState, useEffect } from 'react';
import { Calculator, AlertCircle, CheckCircle, TrendingDown, Lightbulb, RefreshCw } from 'lucide-react';
import apiService from '../services/api';
import { predictChurnProbability, getRiskCategory, getChurnDrivers } from '../utils/localModel';

export default function RiskCalculator({ onApiStatus }) {
  const [formData, setFormData] = useState({
    CreditScore: 650,
    Geography: 'France',
    Gender: 'Male',
    Age: 35,
    Tenure: 5,
    Balance: 75000,
    NumOfProducts: 1,
    HasCrCard: 1,
    IsActiveMember: 1,
    EstimatedSalary: 80000
  });

  const [result, setResult] = useState(null);
  const [drivers, setDrivers] = useState([]);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  const calculateRisk = async () => {
    setIsCalculating(true);
    
    const apiResult = await apiService.predict(formData);
    
    if (apiResult) {
      setResult({
        probability: apiResult.probability,
        risk: {
          level: apiResult.riskLevel,
          color: apiResult.riskColor,
          bg: apiResult.riskBg
        }
      });
      setDrivers(apiResult.drivers || []);
      onApiStatus(true);
    } else {
      const probability = predictChurnProbability(formData);
      const risk = getRiskCategory(probability);
      const churnDrivers = getChurnDrivers(formData);
      setResult({ probability, risk });
      setDrivers(churnDrivers);
      onApiStatus(false);
    }
    
    setIsCalculating(false);
  };

  const resetForm = () => {
    setFormData({
      CreditScore: 650,
      Geography: 'France',
      Gender: 'Male',
      Age: 35,
      Tenure: 5,
      Balance: 75000,
      NumOfProducts: 1,
      HasCrCard: 1,
      IsActiveMember: 1,
      EstimatedSalary: 80000
    });
    setResult(null);
    setDrivers([]);
  };

  useEffect(() => {
    if (result) {
      const timer = setTimeout(() => {
        calculateRisk();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [formData]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-blue-500" />
              Customer Churn Risk Calculator
            </h3>
            <button
              onClick={resetForm}
              className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Reset
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Credit Score</label>
              <input
                type="range"
                name="CreditScore"
                min="300"
                max="850"
                value={formData.CreditScore}
                onChange={handleChange}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex justify-between text-sm text-slate-500 mt-1">
                <span>300</span>
                <span className="font-semibold text-blue-600">{formData.CreditScore}</span>
                <span>850</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Age</label>
              <input
                type="range"
                name="Age"
                min="18"
                max="90"
                value={formData.Age}
                onChange={handleChange}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex justify-between text-sm text-slate-500 mt-1">
                <span>18</span>
                <span className="font-semibold text-blue-600">{formData.Age} years</span>
                <span>90</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Geography</label>
              <select
                name="Geography"
                value={formData.Geography}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              >
                <option value="France">France</option>
                <option value="Germany">Germany</option>
                <option value="Spain">Spain</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Gender</label>
              <select
                name="Gender"
                value={formData.Gender}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Tenure (Years)</label>
              <input
                type="range"
                name="Tenure"
                min="0"
                max="10"
                value={formData.Tenure}
                onChange={handleChange}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex justify-between text-sm text-slate-500 mt-1">
                <span>0</span>
                <span className="font-semibold text-blue-600">{formData.Tenure} years</span>
                <span>10</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Account Balance</label>
              <input
                type="number"
                name="Balance"
                value={formData.Balance}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="Enter balance"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Number of Products</label>
              <select
                name="NumOfProducts"
                value={formData.NumOfProducts}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              >
                <option value={1}>1 Product</option>
                <option value={2}>2 Products</option>
                <option value={3}>3 Products</option>
                <option value={4}>4 Products</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Estimated Salary</label>
              <input
                type="number"
                name="EstimatedSalary"
                value={formData.EstimatedSalary}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="Enter salary"
              />
            </div>

            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="HasCrCard"
                  checked={formData.HasCrCard === 1}
                  onChange={(e) => setFormData(prev => ({ ...prev, HasCrCard: e.target.checked ? 1 : 0 }))}
                  className="w-5 h-5 text-blue-500 border-slate-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-slate-700">Has Credit Card</span>
              </label>
            </div>

            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="IsActiveMember"
                  checked={formData.IsActiveMember === 1}
                  onChange={(e) => setFormData(prev => ({ ...prev, IsActiveMember: e.target.checked ? 1 : 0 }))}
                  className="w-5 h-5 text-blue-500 border-slate-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-slate-700">Active Member</span>
              </label>
            </div>
          </div>

          <button
            onClick={calculateRisk}
            disabled={isCalculating}
            className="mt-6 w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isCalculating ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                Calculating...
              </>
            ) : (
              <>
                <TrendingDown className="w-5 h-5" />
                Calculate Churn Risk
              </>
            )}
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {result && (
          <div className={`rounded-xl shadow-sm border p-6 ${result.risk.bg}`}>
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              {result.risk.level === 'Low' || result.risk.level === 'Moderate' ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-500" />
              )}
              Churn Risk Assessment
            </h3>

            <div className="text-center mb-6">
              <div className={`text-5xl font-bold ${result.risk.color}`}>
                {(result.probability * 100).toFixed(1)}%
              </div>
              <div className={`text-lg font-semibold ${result.risk.color} mt-1`}>
                {result.risk.level} Risk
              </div>
            </div>

            <div className="w-full bg-white rounded-full h-4 overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  result.probability < 0.3 ? 'bg-green-500' :
                  result.probability < 0.6 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${result.probability * 100}%` }}
              />
            </div>

            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>Low Risk</span>
              <span>High Risk</span>
            </div>
          </div>
        )}

        {drivers.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-yellow-500" />
              Churn Drivers & Recommendations
            </h3>

            <div className="space-y-4">
              {drivers.map((driver, index) => (
                <div key={index} className="p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-slate-700">{driver.factor}</span>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      driver.impact === 'High' ? 'bg-red-100 text-red-700' :
                      driver.impact === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {driver.impact} Impact
                    </span>
                  </div>
                  <p className="text-sm text-slate-500">{driver.suggestion}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {!result && (
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-200 p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-3">How It Works</h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5">1</span>
                Enter customer profile information
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5">2</span>
                Our ML model analyzes the data
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5">3</span>
                Get churn probability score
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5">4</span>
                Review actionable recommendations
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
