import React from 'react';
import { 
  Zap, Droplets, Trash2, ShieldAlert, Activity, Award, CheckCircle2, TrendingUp, TrendingDown, CloudFog
} from 'lucide-react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import 'chart.js/auto';

const KPICard = ({ title, value, unit, icon, trend, isPositive }) => (
  <div className="glass glow-effect rounded-2xl p-6 relative overflow-hidden group transition-all duration-300">
    <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-colors"></div>
    <div className="flex justify-between items-start mb-6 relative z-10">
      <div className="p-3 bg-white/5 rounded-xl border border-white/10 shadow-inner">
        {icon}
      </div>
      <div className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 border ${
        isPositive 
          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
          : 'bg-red-500/10 text-red-400 border-red-500/20'
      }`}>
        {isPositive ? <TrendingDown size={12}/> : <TrendingUp size={12}/>}
        {trend}%
      </div>
    </div>
    <div className="relative z-10">
      <h3 className="text-slate-400 font-medium text-xs uppercase tracking-widest mb-1">{title}</h3>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-black text-white tracking-tight">{value}</span>
        <span className="text-slate-500 font-medium text-sm">{unit}</span>
      </div>
    </div>
  </div>
);

const EcoNexusDemo = () => {
  const isDark = document.documentElement.className.includes('dark');
  const textColor = isDark ? '#94a3b8' : '#64748b';
  const gridColor = isDark ? 'rgba(255,255,255,0.05)' : '#f1f5f9';

  // Dummy Chart Data
  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { color: gridColor }, ticks: { color: textColor, font: { family: 'Inter' } } },
      y: { grid: { color: gridColor }, ticks: { color: textColor, font: { family: 'Inter' } } }
    },
    elements: {
      line: { tension: 0.4 } // smooth curve
    }
  };

  const electricityData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      label: 'Electricity (kWh)',
      data: [320, 280, 290, 340, 270, 210, 190],
      borderColor: '#10b981',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      borderWidth: 3,
      fill: true,
      pointBackgroundColor: '#0f172a',
      pointBorderColor: '#10b981',
      pointBorderWidth: 2,
      pointRadius: 4,
      pointHoverRadius: 6
    }]
  };

  const wasteData = {
    labels: ['Hostel A', 'Hostel B', 'Main Block', 'Library'],
    datasets: [{
      label: 'Waste Distribution',
      data: [120, 140, 310, 50],
      backgroundColor: ['#2dd4bf', '#3b82f6', '#f59e0b', '#8b5cf6'],
      borderRadius: 6,
      borderWidth: 0,
    }]
  };

  const resourceAllocation = {
    labels: ['Electricity', 'Water', 'HVAC', 'Other'],
    datasets: [{
      data: [45, 30, 15, 10],
      backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#64748b'],
      borderWidth: 0,
      hoverOffset: 4
    }]
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between items-start gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2 text-gradient drop-shadow-sm">
            EcoMetrics Dashboard
          </h1>
          <p className="text-slate-400 font-medium">Real-Time Sustainability Intelligence</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="glass px-4 py-2 rounded-full flex items-center gap-2 border-emerald-500/30">
            <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">System Live</span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard 
          title="Electricity" 
          value="245" 
          unit="kWh" 
          icon={<Zap className="text-yellow-400" size={24}/>} 
          trend="12.5" 
          isPositive={true}
        />
        <KPICard 
          title="Water Usage" 
          value="1,204" 
          unit="Liters" 
          icon={<Droplets className="text-blue-400" size={24}/>} 
          trend="4.2" 
          isPositive={false}
        />
        <KPICard 
          title="Waste Dist." 
          value="45" 
          unit="kg" 
          icon={<Trash2 className="text-slate-400" size={24}/>} 
          trend="8.1" 
          isPositive={true}
        />
        <KPICard 
          title="Carbon Footprint" 
          value="1.2" 
          unit="Tons" 
          icon={<CloudFog className="text-purple-400" size={24}/>} 
          trend="2.4" 
          isPositive={true}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="glass rounded-2xl p-6 lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <Activity className="text-emerald-400" size={18} />
              Electricity Trajectory
            </h2>
            <select className="bg-white/5 border border-white/10 text-slate-300 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-emerald-500 transition-colors">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-64">
            <Line data={electricityData} options={lineOptions} />
          </div>
        </div>

        {/* Gamification / Score */}
        <div className="glass rounded-2xl p-6 flex flex-col items-center justify-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <h2 className="text-sm font-bold text-slate-400 mb-8 uppercase tracking-widest w-full text-center">Sustainability Score</h2>
          
          <div className="relative w-40 h-40 flex items-center justify-center mb-6">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path className="text-slate-800" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
              <path className="text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]" strokeDasharray="85, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-4xl font-black text-white tracking-tight">85</span>
              <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-widest">Excellent</span>
            </div>
          </div>
          
          <div className="flex gap-4">
             <div className="p-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20 tooltip" title="Energy Saver">
                <Award className="text-yellow-400" size={20} />
             </div>
             <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 tooltip" title="Water Conscious">
                <Droplets className="text-blue-400" size={20} />
             </div>
             <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 tooltip" title="Zero Waste Week">
                <Leaf className="text-emerald-400" size={20} />
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Secondary Charts */}
        <div className="glass rounded-2xl p-6">
          <h2 className="text-xs font-bold text-slate-400 mb-6 uppercase tracking-widest">Waste Distribution</h2>
          <div className="h-48">
            <Bar data={wasteData} options={{...lineOptions, plugins: { legend: { display: false }}}} />
          </div>
        </div>
        
        <div className="glass rounded-2xl p-6 flex flex-col">
          <h2 className="text-xs font-bold text-slate-400 mb-6 uppercase tracking-widest">Resource Allocation</h2>
          <div className="h-48 flex items-center justify-center">
            <Doughnut data={resourceAllocation} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'right', labels: { color: textColor } } } }} />
          </div>
        </div>

        {/* Smart Insights & Feed */}
        <div className="glass rounded-2xl p-6 flex flex-col space-y-6">
          <div>
            <h2 className="text-xs font-bold text-emerald-400 mb-4 uppercase tracking-widest flex items-center gap-2">
               <Zap size={14}/> AI Engine Insights
            </h2>
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start gap-3 mb-3">
              <ShieldAlert className="text-red-400 shrink-0 mt-0.5" size={16} />
              <p className="text-sm font-medium text-red-200 leading-snug">High water usage detected at Hostel B at 3:00 AM.</p>
            </div>
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex items-start gap-3">
              <Zap className="text-blue-400 shrink-0 mt-0.5" size={16} />
              <p className="text-sm font-medium text-blue-200 leading-snug">Suggestion: Reduce HVAC usage by 12% in Library to save ₹500/month.</p>
            </div>
          </div>
          
          <div className="flex-1">
             <h2 className="text-xs font-bold text-slate-400 mb-4 uppercase tracking-widest border-t border-white/5 pt-4">Live Activity</h2>
             <div className="space-y-4">
                <div className="flex items-center gap-3">
                   <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_5px_#34d399]"></div>
                   <p className="text-sm text-slate-300">Hostel A verified daily parameters.</p>
                   <span className="text-xs text-slate-500 ml-auto font-mono">2m ago</span>
                </div>
                <div className="flex items-center gap-3">
                   <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_5px_#34d399]"></div>
                   <p className="text-sm text-slate-300">System generated weekly matrix.</p>
                   <span className="text-xs text-slate-500 ml-auto font-mono">1h ago</span>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EcoNexusDemo;
