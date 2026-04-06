import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import { Database, Save, BrainCircuit, ShieldAlert, Clock, DownloadCloud } from 'lucide-react';

const ResourcePage = ({ type: propType }) => {
    const { type: paramType } = useParams();
    const type = propType || paramType;
    
    const [data, setData] = useState([]);
    const [predictions, setPredictions] = useState({});
    const [newValue, setNewValue] = useState('');
    const [department, setDepartment] = useState('Hostel A');
    
    const todayStr = new Date().toISOString().split('T')[0];

    const [date, setDate] = useState(todayStr);
    const [isFullDay, setIsFullDay] = useState(true);
    const [startTime, setStartTime] = useState('10:00');
    const [endTime, setEndTime] = useState('14:00');

    const [exportRange, setExportRange] = useState('weekly');
    const [customStartDate, setCustomStartDate] = useState(todayStr);
    const [customEndDate, setCustomEndDate] = useState(todayStr);

    const fetchData = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/data/${type}`);
            setData(res.data);
            
            const predRes = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/data/predict/${type}`);
            setPredictions(predRes.data.predictions || {});
        } catch (error) {
            console.error('Fetch Error:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [type]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/data/add`, {
                type,
                value: Number(newValue),
                department,
                date,
                isFullDay,
                startTime: isFullDay ? null : startTime,
                endTime: isFullDay ? null : endTime
            });
            setNewValue('');
            fetchData();
        } catch (error) {
            alert('Failed to execute protocol.');
        }
    };

    const config = { unit: type === 'electricity' ? 'kWh' : type === 'water' ? 'L' : type === 'wifi' ? 'GB' : 'kg' };

    const uniqueDates = [...new Set(data.map(d => d.date))].sort();
    const uniqueDepartments = [...new Set(data.map(d => d.department))];
    
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
                    const entries = data.filter(d => d.date === date && d.department === dept);
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

    const handleDownloadCSV = () => {
        let filteredData = [...data];
        const today = new Date(todayStr);

        if (exportRange === 'weekly') {
            const lastWeek = new Date(today);
            lastWeek.setDate(today.getDate() - 7);
            filteredData = filteredData.filter(d => new Date(d.date) >= lastWeek && new Date(d.date) <= today);
        } else if (exportRange === 'monthly') {
            const lastMonth = new Date(today);
            lastMonth.setMonth(today.getMonth() - 1);
            filteredData = filteredData.filter(d => new Date(d.date) >= lastMonth && new Date(d.date) <= today);
        } else if (exportRange === 'custom') {
            if (customStartDate) filteredData = filteredData.filter(d => new Date(d.date) >= new Date(customStartDate));
            if (customEndDate) {
                const logicalEnd = new Date(customEndDate) > today ? today : new Date(customEndDate);
                filteredData = filteredData.filter(d => new Date(d.date) <= logicalEnd);
            }
        }

        if (filteredData.length === 0) return alert("System Error: No valid data matrices identified in range.");

        const headers = ['Date', 'Scope', 'Start Time', 'End Time', 'Department', `Value (${config.unit})`];
        const rows = filteredData.map(d => [
            d.date, d.isFullDay ? 'Absolute Block' : 'Span Track', d.startTime || 'N/A', d.endTime || 'N/A', d.department, d.value
        ]);

        const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `${type}_matrix_${Date.now()}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const formInputClass = "w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-colors shadow-inner font-mono text-xs uppercase tracking-wider placeholder-zinc-600 [&>option]:bg-zinc-900";

    return (
        <div className="space-y-10 pb-10 max-w-7xl mx-auto">
            <div className="flex justify-between items-center border-b border-white/5 pb-6">
                <div>
                   <h1 className="text-3xl font-black text-white tracking-tight capitalize drop-shadow-sm">{type} Subsystem</h1>
                   <p className="text-emerald-400 mt-2 text-xs font-bold uppercase tracking-[0.2em] drop-shadow-[0_0_2px_rgba(52,211,153,0.8)]">Operational Tracking Protocol</p>
                </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-zinc-900/40 backdrop-blur-md rounded-2xl p-8 border border-white/5 shadow-lg flex flex-col justify-between">
                    <h2 className="text-sm font-bold text-white mb-8 flex items-center gap-3 border-b border-white/5 pb-4 uppercase tracking-widest">
                        <Database size={18} className="text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]" /> Manual Data Input
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-2 gap-5">
                            <div>
                                <label className="block text-[10px] font-bold text-zinc-400 mb-2 uppercase tracking-widest">Target Date</label>
                                <input type="date" max={todayStr} className={formInputClass} value={date} onChange={(e) => setDate(e.target.value)} required />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-zinc-400 mb-2 uppercase tracking-widest">Sector</label>
                                <select className={formInputClass} value={department} onChange={(e) => setDepartment(e.target.value)}>
                                    <option>Hostel A</option><option>Hostel B</option><option>Main Academic Block</option><option>Library</option>
                                </select>
                            </div>
                        </div>
                        
                        <div className="bg-black/20 border border-white/5 rounded-lg p-5 relative overflow-hidden">
                             <div className="absolute top-0 left-0 w-1 h-full bg-zinc-700"></div>
                             <div className="flex items-center justify-between mb-5">
                                 <label className="text-xs text-zinc-300 font-bold uppercase tracking-widest">Measurement Scope</label>
                                 <label className="flex items-center cursor-pointer relative">
                                    <input type="checkbox" className="sr-only" checked={!isFullDay} onChange={() => setIsFullDay(!isFullDay)} />
                                    <div className={`w-12 h-6 rounded-full shadow-inner transition-colors ${!isFullDay ? 'bg-emerald-500' : 'bg-white/10 border border-white/5'}`}></div>
                                    <div className={`absolute w-4 h-4 bg-white rounded-full transition-transform ${!isFullDay ? 'translate-x-7' : 'translate-x-1'} top-1 shadow-[0_0_5px_rgba(0,0,0,0.5)]`}></div>
                                 </label>
                             </div>
                             
                             <p className="text-[10px] font-mono text-zinc-500 mb-4 uppercase tracking-widest border-t border-white/5 pt-3">
                                 {!isFullDay ? 'Targeting specific time boundaries.' : 'Mapping absolute 24-hour cycle variable.'}
                             </p>

                             {!isFullDay && (
                                 <div className="flex gap-5">
                                     <div className="flex-1">
                                         <label className="block text-[10px] font-bold text-emerald-400 mb-2 uppercase tracking-widest">Start Node</label>
                                         <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className={formInputClass} required />
                                     </div>
                                     <div className="flex-1">
                                         <label className="block text-[10px] font-bold text-emerald-400 mb-2 uppercase tracking-widest">End Node</label>
                                         <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className={formInputClass} required />
                                     </div>
                                 </div>
                             )}
                        </div>

                        <div>
                            <label className="block text-[10px] font-bold text-zinc-400 mb-2 uppercase tracking-widest">Telemetry Output ({config.unit})</label>
                            <input 
                                type="number" 
                                className={`${formInputClass} text-emerald-400 font-bold text-base !bg-black/80`}
                                placeholder={`Input ${config.unit}`}
                                value={newValue}
                                onChange={(e) => setNewValue(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black uppercase tracking-widest py-4 rounded-lg transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] mt-4 flex justify-center items-center gap-3 border border-emerald-400/20">
                            <Save size={18} /> Execute Data Write
                        </button>
                    </form>
                </div>

                <div className="flex flex-col gap-8">
                    <div className="bg-zinc-900/40 backdrop-blur-md rounded-2xl p-8 border border-white/5 shadow-lg flex flex-col relative overflow-hidden flex-1 group">
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                        <div className="z-10 h-full flex flex-col">
                            <h2 className="text-sm font-bold text-white mb-4 border-b border-white/5 pb-4 flex items-center gap-3 uppercase tracking-widest">
                                <BrainCircuit size={18} className="text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]" /> Statistical Extrapolation
                            </h2>
                            <div className="flex-1 flex flex-col gap-3 overflow-y-auto pr-2">
                                {uniqueDepartments.length > 0 ? uniqueDepartments.map(dept => (
<<<<<<< HEAD
                                    <div key={dept} className="bg-black/20 border border-white/5 hover:border-emerald-500/30 hover:bg-black/40 shadow-inner rounded-xl p-4 flex items-center justify-between transition-all group/item">
                                        <span className="text-xs font-bold text-zinc-300 uppercase tracking-widest">{dept}</span>
                                        {predictions[dept] !== null && predictions[dept] !== undefined ? (
                                            <span className="text-lg font-black text-emerald-400 drop-shadow-[0_0_5px_rgba(52,211,153,0.5)]">
                                                {predictions[dept].toFixed(2)} <span className="text-[10px] text-zinc-500 font-bold uppercase">{config.unit}</span>
                                            </span>
                                        ) : (
                                            <span className="text-[10px] font-mono text-zinc-500 uppercase flex items-center gap-2">
=======
                                    <div key={dept} className="bg-slate-50 border border-slate-100 hover:border-emerald-200 hover:shadow-sm rounded-xl p-4 flex items-center justify-between transition-all">
                                        <span className="text-xs font-bold text-slate-700 uppercase tracking-widest">{dept}</span>
                                        {predictions[dept] !== null && predictions[dept] !== undefined ? (
                                            <span className="text-lg font-black text-emerald-600 drop-shadow-sm">
                                                {predictions[dept].toFixed(2)} <span className="text-[10px] text-slate-400 font-bold uppercase">{config.unit}</span>
                                            </span>
                                        ) : (
                                            <span className="text-[10px] font-mono text-slate-400 uppercase flex items-center gap-2">
>>>>>>> ddc30ed (final clean code for deployment)
                                                <ShieldAlert size={12}/> Needs Min 5 Blocks
                                            </span>
                                        )}
                                    </div>
                                )) : (
<<<<<<< HEAD
                                    <div className="bg-white/5 p-5 border border-white/5 rounded-lg flex items-start gap-4">
                                        <ShieldAlert className="text-zinc-500 mt-0.5 shrink-0" size={20} />
                                        <p className="text-zinc-500 text-[10px] font-mono tracking-widest uppercase leading-loose">
=======
                                    <div className="bg-slate-50 p-5 border border-slate-200 rounded-lg flex items-start gap-4">
                                        <ShieldAlert className="text-slate-400 mt-0.5 shrink-0" size={20} />
                                        <p className="text-slate-500 text-[10px] font-mono tracking-widest uppercase leading-loose">
>>>>>>> ddc30ed (final clean code for deployment)
                                            No blocks available to predict.
                                        </p>
                                    </div>
                                )}
                            </div>
<<<<<<< HEAD
                            <p className="text-zinc-500 text-[10px] font-mono uppercase mt-4 tracking-wider leading-relaxed border-l-2 border-emerald-500/30 pl-4">
=======
                            <p className="text-slate-500 text-[10px] font-mono uppercase mt-4 tracking-wider leading-relaxed border-l-2 border-emerald-500/30 pl-4">
>>>>>>> ddc30ed (final clean code for deployment)
                                Expected operational limit for subsequent cycle mapped by sector.
                            </p>
                        </div>
                    </div>

                    <div className="bg-zinc-900/40 backdrop-blur-md rounded-2xl p-8 border border-white/5 shadow-lg">
                        <h2 className="text-sm font-bold text-white mb-6 flex items-center gap-3 border-b border-white/5 pb-4 uppercase tracking-widest">
                            <DownloadCloud size={18} className="text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]" /> Backup Extractor
                        </h2>
                        
                        <div className="space-y-5">
                            <div>
                                <label className="block text-[10px] font-bold text-zinc-400 mb-2 uppercase tracking-widest">Time Boundary Range</label>
                                <select className={formInputClass} value={exportRange} onChange={(e) => setExportRange(e.target.value)}>
                                    <option value="weekly">Rolling 7-Day Matrix</option>
                                    <option value="monthly">Rolling 30-Day Matrix</option>
                                    <option value="custom">Explicit Block Definition</option>
                                </select>
                            </div>

                            {exportRange === 'custom' && (
                                <div className="flex gap-4">
                                     <div className="flex-1">
                                         <label className="block text-[10px] font-bold text-zinc-400 mb-2 uppercase tracking-widest">Start Limit</label>
                                         <input type="date" max={todayStr} value={customStartDate} onChange={(e) => setCustomStartDate(e.target.value)} className={formInputClass} />
                                     </div>
                                     <div className="flex-1">
                                         <label className="block text-[10px] font-bold text-zinc-400 mb-2 uppercase tracking-widest">End Limit</label>
                                         <input type="date" max={todayStr} value={customEndDate} onChange={(e) => setCustomEndDate(e.target.value)} className={formInputClass} />
                                     </div>
                                </div>
                            )}

                            <button onClick={handleDownloadCSV} className="w-full bg-black/50 hover:bg-white/5 text-zinc-300 font-bold text-xs uppercase tracking-widest py-3.5 rounded-lg transition-all border border-white/10 mt-2 flex items-center justify-center gap-3 hover:text-emerald-400 hover:border-emerald-500/30 shadow-inner hover:shadow-[0_0_15px_rgba(16,185,129,0.15)]">
                                <DownloadCloud size={16} /> Compile CSV Data
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-zinc-900/40 backdrop-blur-md rounded-2xl p-8 border border-white/5 shadow-lg mt-8">
                <h2 className="text-sm font-bold text-white mb-8 flex items-center gap-3 border-b border-white/5 pb-4 uppercase tracking-widest">
                    <Clock size={18} className="text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]" /> Historical Vector Graphics
                </h2>
                {data.length > 0 ? (
                    <Line data={chartData} options={{ responsive: true, plugins: { legend: { labels: { color: '#a1a1aa', font: { family: 'Inter', weight: '600' } } } }, scales: { x: { grid: { color: 'rgba(255,255,255,0.03)' }, ticks: { color: '#71717a', font: { family: 'Inter' } } }, y: { grid: { color: 'rgba(255,255,255,0.03)' }, ticks: { color: '#71717a', font: { family: 'Inter' } } } } }} height={80} />
                ) : (
                    <div className="h-56 flex items-center justify-center border border-dashed border-white/10 rounded-xl text-zinc-500 bg-black/20 font-mono tracking-widest uppercase text-[10px]">
                        Insufficient parameters currently tracked.
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResourcePage;
