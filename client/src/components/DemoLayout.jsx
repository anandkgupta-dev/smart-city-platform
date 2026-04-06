import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Leaf, LayoutDashboard, Zap, Droplets, Trash2, Wifi, 
  Settings, LogOut, Bell, Search, Menu, ChevronLeft, Sun, Moon 
} from 'lucide-react';

const DemoLayout = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  // In a real app we'd attach a class to document.documentElement
  // We'll mimic dark mode class to root for demo purposes
  React.useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.body.style.backgroundColor = '#090a0f';
    } else {
      document.documentElement.classList.remove('dark');
      document.body.style.backgroundColor = '#f8fafc';
    }
  }, [isDarkMode]);

  const menuItems = [
    { path: '/demo', label: 'Overview', icon: <LayoutDashboard size={20} /> },
    { path: '/electricity', label: 'Electricity', icon: <Zap size={20} /> },
    { path: '/water', label: 'Water', icon: <Droplets size={20} /> },
    { path: '/waste', label: 'Waste', icon: <Trash2 size={20} /> },
    { path: '/wifi', label: 'Network', icon: <Wifi size={20} /> },
    { path: '/settings', label: 'Settings', icon: <Settings size={20} /> },
  ];

  return (
    <div className={`flex min-h-screen font-sans ${isDarkMode ? 'dark text-slate-300' : 'text-slate-800'}`}>
      {/* Sidebar */}
      <aside 
        className={`${isCollapsed ? 'w-20' : 'w-64'} transition-all duration-300 flex flex-col shrink-0 sticky top-0 h-screen overflow-hidden ${isDarkMode ? 'bg-panel/50 border-r border-white/5 backdrop-blur-xl' : 'bg-white border-r border-slate-200'}`}
      >
        <div className="p-6 flex items-center justify-between border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 shadow-lg flex items-center justify-center shadow-emerald-500/20">
              <Leaf className="text-white" size={18} />
            </div>
            {!isCollapsed && (
              <span className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-200 tracking-tight">EcoNexus</span>
            )}
          </div>
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)} 
            className={`p-1.5 rounded-md hover:bg-white/10 transition-colors ${isCollapsed ? 'mx-auto' : ''}`}
          >
            {isCollapsed ? <Menu size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-2">
          {menuItems.map((item, idx) => (
            <NavLink
              key={idx}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium ${
                  item.label === 'Overview' // Hardcode active state for demo if not using real router matches
                    ? (isDarkMode ? 'bg-white/10 text-emerald-400 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]' : 'bg-emerald-50 text-emerald-600')
                    : (isDarkMode ? 'text-slate-400 hover:bg-white/5 hover:text-slate-200' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900')
                }`
              }
            >
              <div className={item.label === 'Overview' && !isDarkMode ? 'text-emerald-500' : ''}>
                {item.icon}
              </div>
              {!isCollapsed && item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 mt-auto">
          <button className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors border border-transparent text-sm font-medium ${isDarkMode ? 'text-slate-400 hover:text-red-400 hover:bg-red-500/10' : 'hover:bg-red-50 hover:text-red-500 text-slate-500'}`}>
            <LogOut size={20} />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative max-h-screen overflow-y-auto custom-scrollbar">
        {/* Top Navbar */}
        <header className={`sticky top-0 z-50 px-8 py-4 flex justify-between items-center backdrop-blur-xl ${isDarkMode ? 'bg-background/80 border-b border-white/5' : 'bg-white/80 border-b border-slate-200'}`}>
          <div className="relative w-64 md:w-96">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} size={18} />
            <input 
              type="text" 
              placeholder="Search metrics, insights..." 
              className={`w-full pl-10 pr-4 py-2 rounded-full text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all ${
                isDarkMode 
                  ? 'bg-card text-white placeholder-slate-500 border border-white/5' 
                  : 'bg-slate-100 text-slate-900 border-none'
              }`}
            />
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)} 
              className={`p-2 rounded-full transition-colors ${isDarkMode ? 'hover:bg-white/10 text-slate-400 hover:text-yellow-400' : 'hover:bg-slate-100 text-slate-500'}`}
            >
               {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button className={`relative p-2 rounded-full transition-colors ${isDarkMode ? 'hover:bg-white/10 text-slate-400 hover:text-white' : 'hover:bg-slate-100 text-slate-500'}`}>
              <Bell size={18} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
            </button>
            <div className="h-6 w-px bg-slate-700/50"></div>
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-emerald-500/30 group-hover:border-emerald-500 transition-colors">
                 <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=b6e3f4" alt="User Avatar" />
              </div>
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

export default DemoLayout;
