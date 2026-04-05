import React, { useEffect, useState } from 'react';
import LiveUsageCard from '../components/LiveUsageCard';
import { Line, Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import axios from 'axios';
import { Activity, Zap } from 'lucide-react';

const Dashboard = () => {
    const [alerts, setAlerts] = useState([]);
    const [summary, setSummary] = useState(null);

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/alerts`)
            .then(res => setAlerts(res.data))
            .catch(console.error);
            
        axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/data/dashboard/summary`)
            .then(res => setSummary(res.data))
            .catch(console.error);
    }, []);

    const themeMap = {
        electricity: { color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)', name: 'Electricity', unit: 'kWh' },
        water: { color: '#38bdf8', bg: 'rgba(56, 189, 248, 0.1)', name: 'Water', unit: 'L' },
        wifi: { color: '#a78bfa', bg: 'rgba(167, 139, 250, 0.1)', name: 'WiFi Bandwidth', unit: 'GB' },
        waste: { color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)', name: 'Waste Collected', unit: 'kg' }
    };

    const options = {
        responsive: true,
        plugins: { legend: { labels: { color: '#a1a1aa', font: { family: 'Inter, sans-serif', weight: '600' } } } },
        scales: {
            x: { grid: { color: 'rgba(255, 255, 255, 0.03)' }, ticks: { color: '#71717a', font: { family: 'Inter' } } },
            y: { grid: { color: 'rgba(255, 255, 255, 0.03)' }, ticks: { color: '#71717a', font: { family: 'Inter' } } }
        }
    };

    if (!summary) {
         return <div className="text-zinc-500 font-mono tracking-widest uppercase p-8 flex items-center gap-3"><Zap className="animate-pulse text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]" size={18}/> Booting Analytics...</div>;
    }

    const { activeTypes, currentDay, weekly, fullData } = summary;

    let sustainabilityScore = 85; 
    if (activeTypes.length > 0) {
        let totalDelta = 0;
        activeTypes.forEach(type => {
             const change = Number(weekly[type].change);
             if (!isNaN(change) && change !== 100) {
                  totalDelta -= (change * 0.5); 
             }
        });
        sustainabilityScore = Math.min(100, Math.max(10, Math.round(sustainabilityScore + totalDelta)));
    }

    return (
        <div className="space-y-10 pb-10 max-w-7xl mx-auto">
            <div className="flex justify-between items-center border-b border-white/5 pb-6">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight drop-shadow-sm">EcoMetrics Dashboard</h1>
                    <p className="text-emerald-400 mt-2 text-xs font-bold uppercase tracking-[0.2em] drop-shadow-[0_0_2px_rgba(52,211,153,0.8)]">Real-Time Sustainability Matrix</p>
                </div>
                
                <div className="bg-zinc-900/40 backdrop-blur-md px-6 py-4 rounded-xl border border-white/5 shadow-lg flex items-center gap-6">
                    <div className="text-right">
                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1">Efficiency Ratio</p>
                        <p className={`text-2xl font-black tracking-tighter drop-shadow-md ${sustainabilityScore > 75 ? 'text-emerald-400' : sustainabilityScore > 50 ? 'text-blue-400' : 'text-red-400'}`}>
                             {activeTypes.length > 0 ? `${sustainabilityScore} / 100` : 'N/A'}
                        </p>
                    </div>
                </div>
            </div>

            {activeTypes.length === 0 && (
                <div className="bg-zinc-900/40 backdrop-blur-md rounded-2xl p-12 border border-white/5 text-center shadow-lg relative overflow-hidden">
                    <Activity className="mx-auto text-emerald-500/20 mb-6 relative z-10" size={56} />
                    <h3 className="text-xl text-white font-bold mb-3 uppercase tracking-widest relative z-10">Data Matrix Empty</h3>
                    <p className="text-zinc-400 max-w-lg mx-auto text-sm tracking-wide leading-relaxed relative z-10">
                        The analytical engine expects parameters. Select a sector on the tracking panel.
                    </p>
                </div>
            )}

            {activeTypes.length > 0 && (
                <div className="space-y-10 pb-4">
                    <div>
                        <h2 className="text-sm font-bold text-white mb-5 border-b border-white/5 pb-3 uppercase tracking-widest flex items-center gap-3">
                           <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></span> Primary Cycle (Today)
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {activeTypes.map(type => (
                                <LiveUsageCard 
                                    key={`current-${type}`}
                                    title={themeMap[type].name} 
                                    value={currentDay[type] || 0} 
                                    unit={themeMap[type].unit} 
                                    change={0}
                                    type={type} 
                                />
                            ))}
                        </div>
                    </div>

                    <div className="pt-2">
                        <h2 className="text-sm font-bold text-white mb-5 border-b border-white/5 pb-3 uppercase tracking-widest flex items-center gap-3">
                           <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span> Trailing Sector (7 Days)
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {activeTypes.map(type => (
                                <LiveUsageCard 
                                    key={`weekly-${type}`}
                                    title={`${themeMap[type].name}`} 
                                    value={weekly[type].total} 
                                    unit={themeMap[type].unit} 
                                    change={Number(weekly[type].change)} 
                                    type={type} 
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 pt-4">
                 <div className="xl:col-span-2 space-y-10">
                     {activeTypes.map(type => {
                         const rawData = fullData[type];
                         
                         const uniqueDates = [...new Set(rawData.map(d => d.date))].sort();
                         const uniqueDepartments = [...new Set(rawData.map(d => d.department))];
                         
                         const getEcoShade = (idx) => {
                             // Use highly contrasting eco-friendly colors for clear line distinction
                             const shades = ['#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#3b82f6', '#ec4899'];
                             return shades[idx % shades.length];
                         };
                         
                         const chartData = {
                             labels: uniqueDates,
                             datasets: uniqueDepartments.map((dept, idx) => {
                                 const color = getEcoShade(idx);
                                 return {
                                     label: `${dept}`,
                                     data: uniqueDates.map(date => {
                                         const entries = rawData.filter(d => d.date === date && d.department === dept);
                                         return entries.reduce((sum, curr) => sum + curr.value, 0);
                                     }),
                                     borderColor: color,
                                     backgroundColor: 'transparent',
                                     borderWidth: 2,
                                     tension: 0.4,
                                     fill: true,
                                     pointBackgroundColor: '#0a0a0a',
                                     pointBorderColor: color,
                                     pointBorderWidth: 2,
                                     pointHoverBackgroundColor: color,
                                     pointHoverBorderColor: 'white'
                                 };
                             })
                         };

                         const barData = {
                             labels: rawData.map(d => d.isFullDay ? 'Absolute Block' : `${d.startTime} - ${d.endTime}`),
                             datasets: [{
                                 label: `Time Span Dist. (${themeMap[type].unit})`,
                                 data: rawData.map(d => d.value),
                                 backgroundColor: '#10b981',
                                 borderRadius: 4
                             }]
                         };
                         
                         return (
                             <div key={type} className="space-y-6 pt-8 break-inside-avoid border-t border-white/5">
                                 <h2 className="text-xl font-black text-white capitalize tracking-tight flex items-center gap-3">
                                     <span className="text-emerald-400 uppercase text-xs font-bold tracking-widest border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 rounded-sm shadow-[0_0_10px_rgba(16,185,129,0.1)]">Node {type}</span>
                                     Analytics Detail
                                 </h2>
                                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                     <div className="bg-zinc-900/40 backdrop-blur-md rounded-xl p-6 border border-white/5 shadow-lg">
                                         <h3 className="text-[10px] font-bold text-zinc-500 mb-5 uppercase tracking-widest">Chronological Output</h3>
                                         <Line data={chartData} options={options} height={180} />
                                     </div>
                                     <div className="bg-zinc-900/40 backdrop-blur-md rounded-xl p-6 border border-white/5 shadow-lg">
                                         <h3 className="text-[10px] font-bold text-zinc-500 mb-5 uppercase tracking-widest">Span Reporting</h3>
                                         <Bar data={barData} options={options} height={180} />
                                     </div>
                                 </div>
                             </div>
                         )
                     })}
                 </div>

                 <div className="space-y-6 pt-8 xl:pt-0">
                    {activeTypes.length > 0 && (
                        <div className="bg-zinc-900/40 backdrop-blur-md rounded-xl p-6 border border-white/5 shadow-lg flex flex-col h-full max-h-[550px] sticky top-28">
                            <h3 className="text-xs font-bold text-white mb-5 uppercase tracking-[0.2em] flex items-center gap-3 border-b border-white/5 pb-4">
                                <span className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.8)] animate-pulse"></span>
                                Live Telemetry Feed
                            </h3>
                            <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                                {alerts.length === 0 ? (
                                    <p className="text-zinc-500 font-mono text-sm">Awaiting inputs...</p>
                                ) : (
                                    alerts.map(alert => (
                                        <div key={alert._id} className="bg-black/20 border border-white/5 p-4 rounded-lg relative overflow-hidden group hover:bg-black/40 transition-colors">
                                            <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                                            <p className="text-zinc-300 text-sm font-medium leading-relaxed">{alert.message}</p>
                                            <p className="text-[10px] text-zinc-500 mt-2 font-mono uppercase tracking-widest">{new Date(alert.timestamp).toLocaleString()}</p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                 </div>
            </div>
        </div>
    );
};

export default Dashboard;
