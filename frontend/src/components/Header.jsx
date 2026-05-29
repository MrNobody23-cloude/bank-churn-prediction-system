import { TrendingDown, Shield, BarChart3, Server, ServerOff } from 'lucide-react';

export default function Header({ activeTab, setActiveTab, apiConnected }) {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'calculator', label: 'Risk Calculator', icon: TrendingDown },
    { id: 'analysis', label: 'Analysis', icon: Shield }
  ];

  return (
    <header className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center shadow-lg">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">ChurnGuard</h1>
              <p className="text-xs text-slate-400">Predictive Analytics Platform</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs ${apiConnected ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
              {apiConnected ? <Server className="w-3 h-3" /> : <ServerOff className="w-3 h-3" />}
              <span>{apiConnected ? 'API Connected' : 'Local Mode'}</span>
            </div>
            
            <nav className="flex space-x-1">
              {tabs.map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'text-slate-300 hover:text-white hover:bg-slate-700'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-medium hidden sm:inline">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
