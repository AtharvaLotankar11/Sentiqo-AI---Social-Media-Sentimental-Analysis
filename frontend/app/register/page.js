'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { register } from '@/services/auth';
import { UserPlus, Brain, Sparkles, Target, ArrowRight, User, Mail, Lock } from 'lucide-react';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Password Mismatch Detected.');
      return;
    }
    
    setLoading(true);
    setError('');
    try {
      await register(formData.username, formData.email, formData.password);
      router.push('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Registry Failure. Protocol Aborted.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white selection:bg-primary selection:text-white">
      {/* LEFT SIDE: DESIGN PANEL */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-primary text-white relative overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute top-[-5%] right-[-5%] w-96 h-96 bg-white/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[10%] left-[-10%] w-72 h-72 bg-secondary/30 rounded-full blur-[80px]"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-10">
            <div className="p-2 bg-white rounded-8 border-2 border-black rotate-3">
               <Brain className="text-primary" size={32} />
            </div>
            <span className="text-3xl font-black italic tracking-tighter uppercase text-white shadow-sm">Sentiqo AI</span>
          </div>

          <div className="space-y-6 max-w-md">
            <h1 className="text-6xl font-black uppercase italic leading-tight tracking-tighter">
              Join the <br />
              Collective <br />
              <span className="bg-white text-primary px-3">Intelligence</span>
            </h1>
            <p className="text-white/80 font-bold text-lg leading-relaxed">
              Create your analyst identity and begin processing massive-scale linguistic streams today.
            </p>
          </div>
        </div>

        <div className="relative z-10 grid grid-cols-1 gap-6">
           <div className="flex items-center gap-4 p-4 bg-white/10 border-2 border-white/20 rounded-8 backdrop-blur-sm">
             <Target className="text-secondary shrink-0" size={24} />
             <div>
                <h4 className="font-black uppercase text-[10px] tracking-widest">Target Acquisition</h4>
                <p className="text-[9px] text-white/60 font-bold uppercase">Pinpoint brand risks with 98% precision</p>
             </div>
           </div>
           <div className="flex items-center gap-4 p-4 bg-white/10 border-2 border-white/20 rounded-8 backdrop-blur-sm">
             <Sparkles className="text-accent shrink-0" size={24} />
             <div>
                <h4 className="font-black uppercase text-[10px] tracking-widest">Enhanced Vision</h4>
                <p className="text-[9px] text-white/60 font-bold uppercase">See the trends before they go viral</p>
             </div>
           </div>
        </div>
      </div>

      {/* RIGHT SIDE: FORM PANEL */}
      <div className="flex flex-col items-center justify-center p-8 bg-slate-50">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left space-y-2">
            <h2 className="text-4xl font-black uppercase italic tracking-tighter text-dark">Register Node</h2>
            <p className="text-slate-500 font-bold text-sm uppercase">Secure your unique analyst handle</p>
          </div>

          {error && (
            <div className="p-4 bg-red-100 border-4 border-black text-negative font-black uppercase italic text-xs animate-in slide-in-from-top-4 duration-300">
               {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-3">
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  required
                  placeholder="USERNAME"
                  className="w-full pl-12 pr-4 py-3 bg-white border-4 border-black rounded-8 font-bold focus:ring-8 focus:ring-primary/10 outline-none transition-all"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                />
              </div>

              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="email"
                  required
                  placeholder="EMAIL ADDRESS"
                  className="w-full pl-12 pr-4 py-3 bg-white border-4 border-black rounded-8 font-bold focus:ring-8 focus:ring-primary/10 outline-none transition-all"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="password"
                  required
                  placeholder="CHOOSE PASSWORD"
                  className="w-full pl-12 pr-4 py-3 bg-white border-4 border-black rounded-8 font-bold focus:ring-8 focus:ring-secondary/10 outline-none transition-all"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="password"
                  required
                  placeholder="CONFIRM PASSWORD"
                  className="w-full pl-12 pr-4 py-3 bg-white border-4 border-black rounded-8 font-bold focus:ring-8 focus:ring-secondary/10 outline-none transition-all"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 py-4 bg-dark text-white border-4 border-black rounded-8 font-black uppercase text-lg shadow-[8px_8px_0_0_rgba(15,23,42,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center gap-3 active:scale-95"
            >
              {loading ? (
                <span className="animate-pulse">PROVISIONING...</span>
              ) : (
                <>
                  PROCEED TO ACCESS
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          <div className="pt-6 text-center text-xs font-bold text-slate-400 uppercase">
             Already have credentials? 
             <Link href="/login" className="ml-2 text-primary hover:underline underline-offset-4 decoration-2">
               Connect Existing Node &rarr;
             </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
