'use client';

import React, { useState, useEffect } from 'react';
import KPICard from '@/components/dashboard/KPICard';
import SentimentPieChart from '@/components/dashboard/SentimentPieChart';
import TrendLineChart from '@/components/dashboard/TrendLineChart';
import WordCloud from '@/components/dashboard/WordCloud';
import ThemeList from '@/components/dashboard/ThemeList';
import InsightsList from '@/components/dashboard/InsightsList';
import { MessageCircle, BarChart, TrendingUp, RefreshCw, AlertTriangle, Sparkles } from 'lucide-react';
import { fetchDashboardStats, fetchTrends, fetchThemes, fetchInsights } from '@/services/api';

const DashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [trendData, setTrendData] = useState([]);
  const [themes, setThemes] = useState({ positive: [], negative: [] });
  const [pieData, setPieData] = useState([]);
  const [insights, setInsights] = useState([]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsData, trendsData, themesData, insightsData] = await Promise.all([
        fetchDashboardStats(),
        fetchTrends(),
        fetchThemes(),
        fetchInsights()
      ]);

      setStats(statsData);
      setTrendData(trendsData);
      setInsights(insightsData);
      
      // Process pie data
      setPieData([
        { name: 'Positive', value: statsData.positive },
        { name: 'Negative', value: statsData.negative },
        { name: 'Neutral', value: statsData.neutral },
      ]);

      // Process themes into categories
      const categorizedThemes = {
        positive: themesData.filter(t => t.sentiment_category === 'positive'),
        negative: themesData.filter(t => t.sentiment_category === 'negative')
      };
      setThemes(categorizedThemes);

    } catch (err) {
      setError('Failed to connect to the analysis engine. Please ensure the backend is running.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center gap-4 text-primary animate-pulse">
        <RefreshCw size={48} className="animate-spin" />
        <h2 className="text-xl font-black uppercase italic tracking-tighter">Synchronizing Intelligence...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center gap-4 text-negative bg-red-50 border-2 border-negative rounded-8 m-4 p-8">
        <AlertTriangle size={48} />
        <h2 className="text-xl font-black uppercase italic tracking-tighter">{error}</h2>
        <button 
          onClick={loadData}
          className="px-4 py-2 bg-negative text-white font-bold rounded-8 border-2 border-black shadow-neo"
        >
          RETRY CONNECTION
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black uppercase italic tracking-tighter text-dark">Executive Dashboard</h1>
          <p className="text-sm font-bold text-slate-500 uppercase">Real-time sentiment insights & trend analysis</p>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-black text-secondary uppercase animate-pulse">
          <Sparkles size={12} />
          <span>Live AI Sync Active</span>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <KPICard 
          title="Total Social Mentions" 
          value={stats?.total_posts?.toLocaleString() || '0'} 
          icon={<MessageCircle size={24} />} 
          change={12}
        />
        <KPICard 
          title="Positive Sentiment" 
          value={`${stats?.positive_percentage}%`} 
          icon={<TrendingUp size={24} />} 
          change={5}
          type="positive"
        />
        <KPICard 
          title="Brand Risk Level" 
          value={`${stats?.negative_percentage}%`} 
          icon={<BarChart size={24} />} 
          change={-2}
          type="negative"
        />
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <SentimentPieChart data={pieData} />
        <TrendLineChart data={trendData} />
      </div>

      {/* Insights Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <div className="lg:col-span-1">
          <InsightsList insights={insights} />
        </div>
        <div className="lg:col-span-1">
          <WordCloud 
            words={themes.positive.concat(themes.negative).map(t => ({
              text: t.keyword,
              score: t.frequency,
              type: t.sentiment_category
            }))} 
          />
        </div>
        <div className="lg:col-span-1">
          <ThemeList themes={themes} />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
