import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Leaf } from 'lucide-react';

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const endpoint = isLogin ? '/auth/login' : '/auth/register';
            const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${endpoint}`, {
                email, password, role: 'admin'
            });

            if (isLogin) {
                login(res.data.token, res.data.user);
                navigate('/dashboard');
            } else {
                setIsLogin(true);
                setEmail('');
                setPassword('');
                alert('Registration successful! Please login.');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Authentication failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-transparent p-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/20 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="bg-zinc-900/40 backdrop-blur-xl w-full max-w-md p-10 rounded-2xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative z-10 transition-all">
                <div className="text-center mb-10 flex flex-col items-center">
                    <div className="bg-emerald-500/10 p-3 rounded-full mb-4 border border-emerald-500/30">
                         <Leaf className="text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]" size={32} />
                    </div>
                    <h1 className="text-2xl font-black font-sans text-white mb-2 tracking-tight drop-shadow-sm">
                        {isLogin ? 'Sign In' : 'Sign Up'}
                    </h1>
                    <p className="text-zinc-400 text-sm">
                        {isLogin ? 'Sign in to access your dashboard' : 'Create a new account'}
                    </p>
                </div>

                {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-md text-sm mb-6 text-center shadow-inner">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">Email Address</label>
                        <input 
                            type="email" 
                            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-colors shadow-inner placeholder-zinc-600"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">Password</label>
                        <input 
                            type="password" 
                            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-colors shadow-inner placeholder-zinc-600"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button 
                        type="submit" 
                        className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold uppercase tracking-wider py-3.5 rounded-lg transition-all shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:shadow-[0_0_30px_rgba(16,185,129,0.6)] box-shadow mt-4 border border-emerald-400/20"
                    >
                        {isLogin ? 'Login' : 'Register'}
                    </button>
                </form>

                <div className="mt-8 text-center pt-6 border-t border-white/5">
                    <button 
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-emerald-400 hover:text-emerald-300 text-xs font-semibold uppercase tracking-wider transition-colors hover:underline drop-shadow-sm"
                    >
                        {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Auth;
