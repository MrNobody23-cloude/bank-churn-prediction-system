import { useState, useMemo, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ScatterChart, Scatter, ZAxis, Cell
} from 'recharts';
import { Search, Filter, Download, ChevronUp, ChevronDown, Eye } from 'lucide-react';
import apiService from '../services/api';
import { predictChurnProbability, getRiskCategory } from '../utils/localModel';

export default function Analysis({ data, onApiStatus }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'probability', direction: 'desc' });
  const [filterRisk, setFilterRisk] = useState('all');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 10;

  useEffect(() => {
    async function fetchCustomers() {
      setLoading(true);
      const apiCustomers = await apiService.getCustomers();
      
      if (apiCustomers) {
        setCustomers(apiCustomers.map(c => ({
          ...c,
          probability: c.probability,
          risk: { level: c.riskLevel, color: c.riskColor, bg: c.riskBg }
        })));
        onApiStatus(true);
      } else {
        setCustomers(data.map(customer => ({
          ...customer,
          probability: predictChurnProbability(customer),
          risk: getRiskCategory(predictChurnProbability(customer))
        })));
        onApiStatus(false);
      }
      setLoading(false);
    }
    
    fetchCustomers();
  }, [data, onApiStatus]);

  const filteredData = useMemo(() => {
    let filtered = [...customers];

    if (searchTerm) {
      filtered = filtered.filter(c => 
        c.CustomerId.toString().includes(searchTerm) ||
        c.Surname.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterRisk !== 'all') {
      filtered = filtered.filter(c => c.risk.level.toLowerCase() === filterRisk);
    }

    filtered.sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      if (sortConfig.direction === 'asc') {
        return aVal > bVal ? 1 : -1;
      }
      return aVal < bVal ? 1 : -1;
    });

    return filtered;
  }, [customers, searchTerm, filterRisk, sortConfig]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc'
    }));
  };

  const scatterData = useMemo(() => {
    return customers.slice(0, 200).map(c => ({
      age: c.Age,
      balance: c.Balance / 1000,
      probability: c.probability,
      name: c.Surname
    }));
  }, [customers]);

  const balanceDistribution = useMemo(() => {
    const groups = [
      { range: '0', churned: 0, retained: 0 },
      { range: '1-50K', churned: 0, retained: 0 },
      { range: '50-100K', churned: 0, retained: 0 },
      { range: '100-150K', churned: 0, retained: 0 },
      { range: '150K+', churned: 0, retained: 0 }
    ];

    customers.forEach(c => {
      let idx;
      if (c.Balance === 0) idx = 0;
      else if (c.Balance < 50000) idx = 1;
      else if (c.Balance < 100000) idx = 2;
      else if (c.Balance < 150000) idx = 3;
      else idx = 4;

      if (c.Exited === 1) groups[idx].churned++;
      else groups[idx].retained++;
    });

    return groups;
  }, [customers]);

  const exportToCSV = () => {
    const headers = ['CustomerId', 'Surname', 'CreditScore', 'Geography', 'Gender', 'Age', 'Tenure', 'Balance', 'NumOfProducts', 'IsActiveMember', 'ChurnProbability', 'RiskLevel'];
    const rows = filteredData.map(c => [
      c.CustomerId, c.Surname, c.CreditScore, c.Geography, c.Gender, c.Age, c.Tenure, c.Balance, c.NumOfProducts, c.IsActiveMember, (c.probability * 100).toFixed(1), c.risk.level
    ]);
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'churn_analysis.csv';
    a.click();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Age vs Balance Risk Analysis</h3>
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="age" name="Age" tick={{ fontSize: 12 }} label={{ value: 'Age', position: 'bottom' }} />
              <YAxis dataKey="balance" name="Balance (K)" tick={{ fontSize: 12 }} label={{ value: 'Balance (K)', angle: -90, position: 'left' }} />
              <ZAxis dataKey="probability" range={[50, 400]} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0' }}
                formatter={(value, name) => {
                  if (name === 'probability') return [(value * 100).toFixed(1) + '%', 'Churn Risk'];
                  return [value, name];
                }}
              />
              <Scatter data={scatterData}>
                {scatterData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.probability > 0.5 ? '#EF4444' : entry.probability > 0.3 ? '#F59E0B' : '#10B981'} 
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Balance Distribution vs Churn</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={balanceDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="range" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0' }} />
              <Bar dataKey="retained" stackId="a" fill="#10B981" name="Retained" />
              <Bar dataKey="churned" stackId="a" fill="#EF4444" name="Churned" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h3 className="text-lg font-semibold text-slate-800">Customer Risk Analysis</h3>
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search customers..."
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                  className="pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-48"
                />
              </div>
              <div className="relative">
                <Filter className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <select
                  value={filterRisk}
                  onChange={(e) => { setFilterRisk(e.target.value); setCurrentPage(1); }}
                  className="pl-9 pr-8 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                >
                  <option value="all">All Risks</option>
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="elevated">Elevated</option>
                  <option value="moderate">Moderate</option>
                  <option value="low">Low</option>
                </select>
              </div>
              <button
                onClick={exportToCSV}
                className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                {['CustomerId', 'Name', 'Geography', 'Age', 'Balance', 'Products', 'Active', 'Probability'].map((header) => (
                  <th
                    key={header}
                    onClick={() => handleSort(header.toLowerCase() === 'name' ? 'Surname' : header.toLowerCase() === 'products' ? 'NumOfProducts' : header.toLowerCase() === 'active' ? 'IsActiveMember' : header.toLowerCase())}
                    className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider cursor-pointer hover:bg-slate-100"
                  >
                    <div className="flex items-center gap-1">
                      {header}
                      {sortConfig.key === (header.toLowerCase() === 'name' ? 'Surname' : header.toLowerCase()) && (
                        sortConfig.direction === 'desc' ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />
                      )}
                    </div>
                  </th>
                ))}
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Risk</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {paginatedData.map((customer) => (
                <tr key={customer.CustomerId} className="hover:bg-slate-50">
                  <td className="px-6 py-4 text-sm text-slate-600">{customer.CustomerId}</td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-800">{customer.Surname}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{customer.Geography}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{customer.Age}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">${customer.Balance.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{customer.NumOfProducts}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${customer.IsActiveMember ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                      {customer.IsActiveMember ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-slate-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            customer.probability > 0.6 ? 'bg-red-500' :
                            customer.probability > 0.3 ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${customer.probability * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-slate-600">{(customer.probability * 100).toFixed(0)}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${customer.risk.bg} ${customer.risk.color}`}>
                      {customer.risk.level}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => setSelectedCustomer(customer)}
                      className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      <Eye className="w-4 h-4 text-slate-500" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
          <div className="text-sm text-slate-500">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} results
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-slate-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
            >
              Previous
            </button>
            <span className="text-sm text-slate-600">Page {currentPage} of {totalPages}</span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-slate-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {selectedCustomer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-800">Customer Details</h3>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <span className="text-slate-400 text-xl">&times;</span>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-500">Customer ID</label>
                  <p className="font-medium text-slate-800">{selectedCustomer.CustomerId}</p>
                </div>
                <div>
                  <label className="text-xs text-slate-500">Name</label>
                  <p className="font-medium text-slate-800">{selectedCustomer.Surname}</p>
                </div>
                <div>
                  <label className="text-xs text-slate-500">Geography</label>
                  <p className="font-medium text-slate-800">{selectedCustomer.Geography}</p>
                </div>
                <div>
                  <label className="text-xs text-slate-500">Gender</label>
                  <p className="font-medium text-slate-800">{selectedCustomer.Gender}</p>
                </div>
                <div>
                  <label className="text-xs text-slate-500">Age</label>
                  <p className="font-medium text-slate-800">{selectedCustomer.Age} years</p>
                </div>
                <div>
                  <label className="text-xs text-slate-500">Tenure</label>
                  <p className="font-medium text-slate-800">{selectedCustomer.Tenure} years</p>
                </div>
                <div>
                  <label className="text-xs text-slate-500">Credit Score</label>
                  <p className="font-medium text-slate-800">{selectedCustomer.CreditScore}</p>
                </div>
                <div>
                  <label className="text-xs text-slate-500">Balance</label>
                  <p className="font-medium text-slate-800">${selectedCustomer.Balance.toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-xs text-slate-500">Products</label>
                  <p className="font-medium text-slate-800">{selectedCustomer.NumOfProducts}</p>
                </div>
                <div>
                  <label className="text-xs text-slate-500">Active Member</label>
                  <p className="font-medium text-slate-800">{selectedCustomer.IsActiveMember ? 'Yes' : 'No'}</p>
                </div>
              </div>
              <div className={`p-4 rounded-lg ${selectedCustomer.risk.bg}`}>
                <div className="text-center">
                  <p className={`text-3xl font-bold ${selectedCustomer.risk.color}`}>
                    {(selectedCustomer.probability * 100).toFixed(1)}%
                  </p>
                  <p className={`text-sm font-medium ${selectedCustomer.risk.color}`}>
                    {selectedCustomer.risk.level} Risk
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
