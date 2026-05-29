import { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { Users, AlertTriangle, TrendingUp, CheckCircle, Activity, Target } from 'lucide-react';
import apiService from '../services/api';
import { 
  predictChurnProbability, 
  calculateModelMetrics, 
  getDistributionData,
  getGeographyAnalysis,
  getAgeAnalysis,
  getStats,
  featureImportance
} from '../utils/localModel';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

export default function Dashboard({ data, onApiStatus }) {
  const [metrics, setMetrics] = useState(null);
  const [distribution, setDistribution] = useState([]);
  const [geoAnalysis, setGeoAnalysis] = useState([]);
  const [ageAnalysis, setAgeAnalysis] = useState([]);
  const [stats, setStats] = useState({ total: 0, highRisk: 0, mediumRisk: 0, lowRisk: 0, churned: 0 });
  const [importance, setImportance] = useState(featureImportance);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      
      const apiMetrics = await apiService.getMetrics();
      const apiDist = await apiService.getDistribution();
      const apiGeo = await apiService.getGeographyAnalysis();
      const apiAge = await apiService.getAgeAnalysis();
      const apiStats = await apiService.getStats();
      const apiImportance = await apiService.getFeatureImportance();
      
      if (apiMetrics) {
        setMetrics(apiMetrics);
        onApiStatus(true);
      } else {
        setMetrics(calculateModelMetrics(data));
        onApiStatus(false);
      }
      
      if (apiDist) {
        setDistribution(apiDist);
      } else {
        setDistribution(getDistributionData(data));
      }
      
      if (apiGeo) {
        setGeoAnalysis(apiGeo);
      } else {
        setGeoAnalysis(getGeographyAnalysis(data));
      }
      
      if (apiAge) {
        setAgeAnalysis(apiAge);
      } else {
        setAgeAnalysis(getAgeAnalysis(data));
      }
      
      if (apiStats) {
        setStats(apiStats);
      } else {
        setStats(getStats(data));
      }
      
      if (apiImportance) {
        setImportance(apiImportance);
      }
      
      setLoading(false);
    }
    
    fetchData();
  }, [data, onApiStatus]);

  const statCards = [
    { title: 'Total Customers', value: stats.total.toLocaleString(), icon: Users, color: 'from-blue-500 to-blue-600' },
    { title: 'High Risk', value: stats.highRisk.toLocaleString(), icon: AlertTriangle, color: 'from-red-500 to-red-600' },
    { title: 'Medium Risk', value: stats.mediumRisk.toLocaleString(), icon: Activity, color: 'from-yellow-500 to-orange-500' },
    { title: 'Low Risk', value: stats.lowRisk.toLocaleString(), icon: CheckCircle, color: 'from-green-500 to-green-600' }
  ];

  const pieData = [
    { name: 'High Risk', value: stats.highRisk },
    { name: 'Medium Risk', value: stats.mediumRisk },
    { name: 'Low Risk', value: stats.lowRisk }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className={`h-1 bg-gradient-to-r ${card.color}`} />
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500 font-medium">{card.title}</p>
                    <p className="text-2xl font-bold text-slate-800 mt-1">{card.value}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {metrics && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-500" />
            Model Performance Metrics
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { label: 'Accuracy', value: `${metrics.accuracy}%` },
              { label: 'Precision', value: `${metrics.precision}%` },
              { label: 'Recall', value: `${metrics.recall}%` },
              { label: 'F1 Score', value: `${metrics.f1Score}%` },
              { label: 'ROC-AUC', value: metrics.rocAuc }
            ].map((metric, i) => (
              <div key={i} className="text-center p-4 bg-slate-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">{metric.value}</p>
                <p className="text-sm text-slate-500 mt-1">{metric.label}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Churn Probability Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={distribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="range" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0' }}
                formatter={(value) => [value, 'Customers']}
              />
              <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Risk Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={['#EF4444', '#F59E0B', '#10B981'][index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Churn Rate by Geography</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={geoAnalysis} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis type="number" domain={[0, 50]} tick={{ fontSize: 12 }} />
              <YAxis dataKey="geography" type="category" tick={{ fontSize: 12 }} width={80} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0' }}
                formatter={(value) => [`${value}%`, 'Churn Rate']}
              />
              <Bar dataKey="churnRate" fill="#8B5CF6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Churn Rate by Age Group</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={ageAnalysis}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="ageGroup" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0' }}
                formatter={(value, name) => [name === 'churnRate' ? `${value}%` : value, name === 'churnRate' ? 'Churn Rate' : 'Total']}
              />
              <Area type="monotone" dataKey="churnRate" stroke="#3B82F6" fill="#93C5FD" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-500" />
          Feature Importance Analysis
        </h3>
        <div className="space-y-3">
          {importance.map((item, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className="w-32 text-sm font-medium text-slate-700">{item.feature}</div>
              <div className="flex-1">
                <div className="h-6 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-500"
                    style={{ width: `${item.importance * 100}%` }}
                  />
                </div>
              </div>
              <div className="w-16 text-sm font-semibold text-slate-600">{(item.importance * 100).toFixed(0)}%</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
