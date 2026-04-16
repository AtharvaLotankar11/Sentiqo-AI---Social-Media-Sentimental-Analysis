'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { login } from '@/services/auth';
import { LogIn, Brain, ShieldCheck, Zap, ArrowRight, User } from 'lucide-react';

const LoginPage = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(credentials.username, credentials.password);
      router.push('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Authentication Failed. Verify Credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white selection:bg-primary selection:text-white">
      {/* LEFT SIDE: DARK ARTISTIC PANEL */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-slate-950 text-white relative overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute top-[-10%] right-[-10%] w-80 h-80 bg-primary/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-5%] left-[-5%] w-60 h-60 bg-secondary/20 rounded-full blur-[100px]"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-10">
            <div className="p-2 bg-white rounded-8 border-2 border-primary rotate-3">
               <Brain className="text-primary" size={32} />
            </div>
            <span className="text-3xl font-black italic tracking-tighter uppercase">Sentiqo AI</span>
          </div>

          <div className="space-y-6 max-w-md">
            <h1 className="text-6xl font-black uppercase italic leading-tight tracking-tighter">
              Neural <br />
              <span className="text-primary">Intelligence</span> <br />
              Platform
            </h1>
            <p className="text-slate-400 font-bold text-lg leading-relaxed">
              Experience the next generation of social sentiment audits. Fast, precise, and mission-critical.
            </p>
          </div>
        </div>

        <div className="relative z-10 grid grid-cols-2 gap-8">
           <div className="space-y-2">
              <Zap className="text-secondary" size={24} />
              <h4 className="font-black uppercase text-xs tracking-widest">Real-time Sync</h4>
              <p className="text-[10px] text-slate-500 font-bold uppercase">Linguistic pathways processed in &lt;150ms</p>
           </div>
           <div className="space-y-2">
              <ShieldCheck className="text-primary" size={24} />
              <h4 className="font-black uppercase text-xs tracking-widest">Secure Access</h4>
              <p className="text-[10px] text-slate-500 font-bold uppercase">Encrypted analyst nodes for data integrity</p>
           </div>
        </div>
      </div>

      {/* RIGHT SIDE: CLEAN FORM PANEL */}
      <div className="flex flex-col items-center justify-center p-8 bg-slate-50">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left space-y-2">
            <h2 className="text-4xl font-black uppercase italic tracking-tighter text-dark">Welcome back</h2>
            <p className="text-slate-500 font-bold text-sm uppercase">Initialize your mission terminal</p>
          </div>

          {error && (
            <div className="p-4 bg-red-100 border-4 border-black text-negative font-black uppercase italic text-xs animate-in slide-in-from-top-4 duration-300">
              <div className="flex items-center gap-2">
                <ShieldCheck size={18} />
                {error}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-black uppercase text-slate-500 italic">User Identification</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="text"
                    required
                    placeholder="USERNAME"
                    className="w-full pl-12 pr-4 py-4 bg-white border-4 border-black rounded-8 font-bold focus:ring-8 focus:ring-primary/10 outline-none transition-all placeholder:text-slate-200"
                    value={credentials.username}
                    onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black uppercase text-slate-500 italic">Security Key</label>
                <div className="relative">
                  <LogIn className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="password"
                    required
                    placeholder="PASSWORD"
                    className="w-full pl-12 pr-4 py-4 bg-white border-4 border-black rounded-8 font-bold focus:ring-8 focus:ring-secondary/10 outline-none transition-all placeholder:text-slate-200"
                    value={credentials.password}
                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-primary text-white border-4 border-black rounded-8 font-black uppercase text-lg shadow-[8px_8px_0_0_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center gap-3 active:scale-95"
            >
              {loading ? (
                <span className="animate-pulse">AUTHENTICATING...</span>
              ) : (
                <>
                  ESTABLISH CONNECTION
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          <div className="pt-8 text-center text-xs font-bold text-slate-400 uppercase">
             New analyst to the network? 
             <Link href="/register" className="ml-2 text-primary hover:underline underline-offset-4 decoration-2">
               Request Access Node &rarr;
             </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
