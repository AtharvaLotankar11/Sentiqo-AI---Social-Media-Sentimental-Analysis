'use client';

import React, { useState } from 'react';
import { Search, Calendar, Bell, HelpCircle, Menu, X, Brain, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { analyzeSentiment } from '@/services/api';

const TopNavbar = ({ onMenuClick }) => {
  const [searchValue, setSearchValue] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [quickResult, setQuickResult] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [dateRange, setDateRange] = useState('Last 30 Days');

  const handleQuickAnalyze = async (e) => {
    if (e.key === 'Enter' && searchValue.trim()) {
      setIsAnalyzing(true);
      try {
        const data = await analyzeSentiment(searchValue);
        setQuickResult(data);
        setSearchValue('');
      } catch (err) {
        console.error(err);
      } finally {
        setIsAnalyzing(false);
      }
    }
  };

  const notifications = [
    { id: 1, title: 'Sentiment Spike', msg: 'Negative mentions up 12% in last hour', time: '12m ago', level: 'critical' },
    { id: 2, title: 'Analysis Complete', msg: 'Bulk ingestion of 5,000 posts finished', time: '1h ago', level: 'success' },
  ];

  const dateOptions = ['Last 24 Hours', 'Last 7 Days', 'Last 30 Days', 'All Time'];

  return (
    <header className="h-16 bg-white border-b-2 border-black flex items-center justify-between px-4 sticky top-0 z-40 w-full">
      {/* Mobile Menu & Quick Analysis Search */}
      <div className="flex items-center gap-3 w-full md:w-1/3">
        <button 
          onClick={onMenuClick}
          className="md:hidden p-1.5 border-2 border-black rounded-8 hover:bg-slate-100"
        >
          <Menu size={24} />
        </button>
        
        <div className="flex-1 flex items-center gap-2 relative group">
          <Search className={`absolute left-2 transition-colors ${isAnalyzing ? 'text-primary animate-pulse' : 'text-slate-400'}`} size={18} />
          <input 
            type="text" 
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={handleQuickAnalyze}
            placeholder={isAnalyzing ? "ANALYZING NEURAL PATHWAYS..." : "QUICK VIBE CHECK (ENTER)..."} 
            className="w-full pl-8 pr-2 py-1.5 border-2 border-black rounded-8 focus:outline-none focus:ring-4 focus:ring-primary/20 font-bold uppercase text-[10px] transition-all"
          />
        </div>
      </div>

      {/* Right Side Tools */}
      <div className="flex items-center gap-4">
        {/* Date Selector */}
        <div className="relative group hidden md:block">
          <div className="flex items-center gap-2 px-3 py-1.5 border-2 border-black rounded-8 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-all shadow-neo-sm active:translate-x-0.5 active:translate-y-0.5" onClick={() => {
            const nextIndex = (dateOptions.indexOf(dateRange) + 1) % dateOptions.length;
            setDateRange(dateOptions[nextIndex]);
          }}>
            <Calendar size={18} />
            <span className="font-bold text-[10px] uppercase truncate min-w-[80px] text-center">{dateRange}</span>
          </div>
        </div>

        {/* Action Icons */}
        <div className="flex items-center gap-2 relative">
          {/* Notifications */}
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className={`p-1.5 border-2 rounded-8 transition-all relative ${showNotifications ? 'border-black bg-slate-100 shadow-inner' : 'border-transparent hover:border-black'}`}
          >
            <Bell size={20} />
            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-negative rounded-full border-2 border-white"></span>
          </button>

          {showNotifications && (
            <div className="absolute top-12 right-0 w-64 bg-white border-4 border-black shadow-[8px_8px_0_0_rgba(0,0,0,1)] z-50 animate-in fade-in slide-in-from-top-2">
              <div className="p-2 border-b-2 border-black bg-slate-50 flex justify-between items-center">
                <span className="font-black text-[10px] uppercase">Protocol Logs</span>
                <X size={14} className="cursor-pointer" onClick={() => setShowNotifications(false)} />
              </div>
              <div className="max-h-60 overflow-y-auto">
                {notifications.map(n => (
                  <div key={n.id} className="p-3 border-b border-slate-100 hover:bg-slate-50 cursor-pointer group">
                    <div className="flex items-center gap-2 mb-1">
                      <div className={`w-1.5 h-1.5 rounded-full ${n.level === 'critical' ? 'bg-negative' : 'bg-secondary'}`}></div>
                      <span className="font-black text-[10px] uppercase group-hover:text-primary">{n.title}</span>
                    </div>
                    <p className="text-[10px] font-bold text-slate-500 leading-tight">{n.msg}</p>
                    <p className="text-[8px] font-black text-slate-300 mt-1">{n.time}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button 
            onClick={() => setShowHelp(true)}
            className="p-1.5 border-2 border-transparent hover:border-black rounded-8 transition-all"
          >
            <HelpCircle size={20} />
          </button>
        </div>
      </div>

      {/* QUICK RESULT POPUP */}
      {quickResult && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[60] animate-in zoom-in duration-300">
          <div className={`p-4 border-4 border-black shadow-[8px_8px_0_0_rgba(0,0,0,1)] flex items-center gap-4 ${quickResult.sentiment === 'positive' ? 'bg-secondary text-white' : 'bg-negative text-white'}`}>
             {quickResult.sentiment === 'positive' ? <CheckCircle2 size={32} /> : <AlertTriangle size={32} />}
             <div>
                <h3 className="font-black uppercase text-sm tracking-tighter">Instant Analysis Result</h3>
                <p className="font-bold text-xs">SENTIMENT: {quickResult.sentiment.toUpperCase()} ({(quickResult.confidence * 100).toFixed(1)}%)</p>
             </div>
             <button onClick={() => setQuickResult(null)} className="ml-2 hover:rotate-90 transition-transform">
               <X size={20} />
             </button>
          </div>
        </div>
      )}

      {/* HELP MODAL */}
      {showHelp && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
           <div className="w-full max-w-lg bg-white border-4 border-black shadow-[16px_16px_0_0_rgba(0,0,0,1)] p-8 relative">
              <button 
                onClick={() => setShowHelp(false)}
                className="absolute top-4 right-4 p-1 hover:bg-slate-100 rounded-lg"
              >
                <X size={20} />
              </button>
              <div className="flex items-center gap-3 mb-6">
                 <div className="p-3 bg-primary text-white rounded-8">
                    <Brain size={32} />
                 </div>
                 <h2 className="text-3xl font-black uppercase italic tracking-tighter">System Protocol</h2>
              </div>
              <div className="space-y-4">
                <div className="flex gap-4 p-3 border-2 border-black rounded-8">
                  <div className="font-black text-xl text-primary">01</div>
                  <div>
                    <h3 className="font-black uppercase text-xs">Data Ingestion</h3>
                    <p className="text-[10px] font-bold text-slate-500 uppercase">Upload CSV datasets in the Ingestion portal to seed your neural engine.</p>
                  </div>
                </div>
                <div className="flex gap-4 p-3 border-2 border-black rounded-8">
                  <div className="font-black text-xl text-primary">02</div>
                  <div>
                    <h3 className="font-black uppercase text-xs">Intelligence Hub</h3>
                    <p className="text-[10px] font-bold text-slate-500 uppercase">View high-level KPIs and automated insights on the Executive Dashboard.</p>
                  </div>
                </div>
                <div className="flex gap-4 p-3 border-2 border-black rounded-8">
                  <div className="font-black text-xl text-primary">03</div>
                  <div>
                    <h3 className="font-black uppercase text-xs">Vibe Check</h3>
                    <p className="text-[10px] font-bold text-slate-500 uppercase">Use the search bar above or the Analysis page for real-time sentiment testing.</p>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setShowHelp(false)}
                className="w-full mt-8 py-4 bg-black text-white font-black uppercase text-sm shadow-neo-sm active:translate-y-1 active:translate-x-1 transition-all"
              >
                Acknowledge Protocol
              </button>
           </div>
        </div>
      )}
    </header>
  );
};

export default TopNavbar;
