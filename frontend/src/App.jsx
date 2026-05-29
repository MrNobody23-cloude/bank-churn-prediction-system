import { useState, useCallback } from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import RiskCalculator from './components/RiskCalculator';
import Analysis from './components/Analysis';
import customerData from './data/customerData';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [apiConnected, setApiConnected] = useState(false);

  const handleApiStatus = useCallback((status) => {
    setApiConnected(status);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} apiConnected={apiConnected} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-800">
            {activeTab === 'dashboard' && 'Churn Analytics Dashboard'}
            {activeTab === 'calculator' && 'Customer Risk Calculator'}
            {activeTab === 'analysis' && 'Detailed Analysis'}
          </h2>
          <p className="text-slate-500 mt-1">
            {activeTab === 'dashboard' && 'Overview of customer churn metrics and model performance'}
            {activeTab === 'calculator' && 'Calculate churn probability for individual customers'}
            {activeTab === 'analysis' && 'Explore customer data and identify at-risk segments'}
          </p>
        </div>

        {activeTab === 'dashboard' && <Dashboard data={customerData} onApiStatus={handleApiStatus} />}
        {activeTab === 'calculator' && <RiskCalculator onApiStatus={handleApiStatus} />}
        {activeTab === 'analysis' && <Analysis data={customerData} onApiStatus={handleApiStatus} />}
      </main>

      <footer className="bg-white border-t border-slate-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <span className="font-semibold text-slate-700">ChurnGuard</span>
            </div>
            <p className="text-sm text-slate-500 mt-4 md:mt-0">
              Predictive Modeling for Bank Customer Churn - European Central Bank
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
