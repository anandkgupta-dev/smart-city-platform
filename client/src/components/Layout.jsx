import React, { useContext, useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Zap, Droplets, Wifi, Trash2, LayoutDashboard, LogOut, Bell, Leaf } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const Sidebar = () => {
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const menuItems = [
        { path: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
        { path: '/electricity', label: 'Electricity', icon: <Zap size={20} /> },
        { path: '/water', label: 'Water', icon: <Droplets size={20} /> },
        { path: '/wifi', label: 'WiFi', icon: <Wifi size={20} /> },
        { path: '/waste', label: 'Waste', icon: <Trash2 size={20} /> },
    ];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <aside className="w-64 bg-zinc-950/50 backdrop-blur-2xl border-r border-white/5 flex flex-col h-screen shrink-0 sticky top-0 shadow-2xl z-20">
            <div className="p-7 border-b border-white/5 flex items-center gap-3">
                <Leaf className="text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]" size={26} />
                <div>
                   <h1 className="text-xl font-black text-white tracking-tight drop-shadow-sm">
                       EcoNexus
                   </h1>
                   <p className="text-[10px] text-zinc-400 mt-1 uppercase font-bold tracking-[0.2em]">Smart Platform</p>
                </div>
            </div>
            
            <nav className="flex-1 px-4 space-y-2 mt-8">
                {menuItems.map(item => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm font-semibold tracking-wide ${
                                isActive 
                                ? 'bg-white/10 text-emerald-400 border border-white/10 shadow-[0_4px_24px_-8px_rgba(52,211,153,0.3)]' 
                                : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-100 border border-transparent'
                            }`
                        }
                    >
                        <div className={`${item.path === window.location.pathname ? 'text-emerald-400 drop-shadow-[0_0_5px_rgba(52,211,153,0.5)]' : 'text-zinc-500 group-hover:text-zinc-300 transition-colors'}`}>
                           {item.icon}
                        </div>
                        {item.label}
                    </NavLink>
                ))}
            </nav>

            <div className="p-5 border-t border-white/5 mt-auto">
                <button 
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg hover:bg-red-500/10 hover:text-red-400 text-zinc-500 text-xs font-bold uppercase tracking-widest transition-colors border border-transparent hover:border-red-500/20 group"
                >
                    <LogOut size={16} className="group-hover:text-red-400 transition-colors" />
                    <span>Disconnect</span>
                </button>
            </div>
        </aside>
    );
};

export const Layout = ({ children }) => {
    const { user, logout } = useContext(AuthContext);
    const [alerts, setAlerts] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if(user) {
             axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/alerts`)
                 .then(res => setAlerts(res.data))
                 .catch(console.error);
        }
    }, [user]);

    const handleLogout = () => {
         logout();
         navigate('/login');
    }

    return (
        <div className="flex bg-transparent min-h-screen text-zinc-100 font-sans">
            <Sidebar />
            <main className="flex-1 flex flex-col relative max-h-screen overflow-y-auto">
                <header className="sticky top-0 z-30 bg-black/40 backdrop-blur-2xl border-b border-white/5 px-8 py-4 flex justify-between items-center">
                    <div className="text-xs font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.8)] animate-pulse"></span>
                        Secure Link Valid
                    </div>
                    <div className="flex items-center gap-5 relative z-50">
                        <div className="relative">
                            <button onClick={() => setShowNotifications(!showNotifications)} className="relative p-2 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-emerald-400 transition-all border border-transparent">
                                <Bell size={18} />
                                {alerts.length > 0 && <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-zinc-950 shadow-[0_0_8px_rgba(239,68,68,0.8)]"></span>}
                            </button>
                            
                            {showNotifications && (
                                <div className="absolute right-0 mt-3 w-80 bg-zinc-950/90 backdrop-blur-3xl border border-white/10 rounded-xl shadow-2xl py-2 z-50 overflow-hidden">
                                    <div className="px-5 py-3 border-b border-white/5 font-bold text-[10px] text-emerald-500 uppercase tracking-widest bg-emerald-500/5">System Diagnostics</div>
                                    <div className="max-h-64 overflow-y-auto custom-scrollbar">
                                        {alerts.length === 0 ? (
                                            <p className="p-5 text-sm text-zinc-500 font-medium tracking-wide">All infrastructure operating optimally.</p>
                                        ) : (
                                            alerts.map((a, i) => (
                                                <div key={a._id} className={`p-4 hover:bg-white/5 transition duration-150 ${i !== alerts.length -1 ? 'border-b border-white/5' : ''}`}>
                                                    <p className="text-sm font-medium text-zinc-300 leading-relaxed">{a.message}</p>
                                                    <p className="text-xs text-zinc-500 mt-2 font-mono">{new Date(a.timestamp).toLocaleString()}</p>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="h-5 w-px bg-white/10"></div>

                        <div className="relative">
                            <button onClick={() => setShowProfile(!showProfile)} className="flex items-center gap-3 hover:bg-white/5 p-1.5 pr-3 rounded-lg transition-colors border border-transparent hover:border-white/10">
                                <div className="w-8 h-8 rounded-md bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center font-bold text-xs tracking-tighter shadow-[0_0_15px_rgba(16,185,129,0.4)]">
                                    {user?.role === 'admin' ? 'AD' : 'OP'}
                                </div>
                                <div className="text-xs font-semibold text-zinc-400 capitalize hidden sm:block">Director</div>
                            </button>

                            {showProfile && (
                                <div className="absolute right-0 mt-3 w-56 bg-zinc-950/90 backdrop-blur-3xl border border-white/10 rounded-xl shadow-2xl py-2 z-50 overflow-hidden text-sm">
                                    <div className="px-5 py-4 border-b border-white/5 bg-white/5">
                                        <p className="text-white font-bold truncate text-sm">{user?.id}</p>
                                        <p className="text-[10px] uppercase tracking-widest text-emerald-400 mt-1 font-bold">{user?.role || 'Standard'}</p>
                                    </div>
                                    <div className="p-2">
                                        <button onClick={handleLogout} className="w-full text-left px-3 py-2.5 rounded-lg text-zinc-400 font-medium hover:bg-red-500/10 hover:text-red-400 flex items-center gap-3 transition-colors">
                                            <LogOut size={16} /> End Session
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </header>
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
};
