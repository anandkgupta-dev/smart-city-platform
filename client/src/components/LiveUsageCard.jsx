import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const LiveUsageCard = ({ title, value, unit, change, type }) => {
    const isIncrease = change >= 0;

    return (
        <div className="bg-zinc-900/40 backdrop-blur-md rounded-xl p-6 border border-white/5 shadow-lg relative overflow-hidden group hover:border-emerald-500/30 hover:bg-zinc-900/60 hover:shadow-[0_0_20px_rgba(16,185,129,0.15)] transition-all duration-300 transform hover:-translate-y-1">
            <h3 className="text-zinc-400 font-bold text-xs mb-3 uppercase tracking-widest">{title}</h3>
            
            <div className="flex items-end gap-2 mb-5">
                <span className="text-4xl font-black text-white tracking-tight drop-shadow-md">
                    {value}
                </span>
                <span className="text-emerald-400 font-bold pb-1 text-sm tracking-widest drop-shadow-[0_0_2px_rgba(52,211,153,0.8)]">{unit}</span>
            </div>
            
            <div className="flex items-center gap-3">
                <div className={`flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-sm uppercase tracking-wider ${isIncrease ? 'text-red-400 bg-red-500/10 border border-red-500/20' : 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20'}`}>
                    {isIncrease ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                    {Math.abs(change)}%
                </div>
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Aggregate Shift</span>
            </div>
        </div>
    );
};

export default LiveUsageCard;
