'use client';

import React, { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Search, Brain, CheckCircle2, AlertCircle, AlertTriangle } from 'lucide-react';
import { analyzeSentiment } from '@/services/api';

const SentimentPage = () => {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    
    setLoading(true);
    setError(null);
    try {
      const data = await analyzeSentiment(text);
      setResult({
        sentiment: data.sentiment,
        confidence: data.confidence,
        suggestion: data.sentiment === 'positive' 
          ? 'Strong positive engagement detected. High potential for brand advocacy.' 
          : 'Negative sentiment detected. Immediate attention recommended to prevent escalation.'
      });
    } catch (err) {
      setError('Analysis engine unavailable. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      <div className="text-center space-y-2 py-4">
        <h1 className="text-4xl font-black uppercase italic tracking-tighter text-dark">Neural Sentiment Analyzer</h1>
        <p className="text-sm font-bold text-slate-500 uppercase">Instant AI-powered linguistic evaluation</p>
      </div>

      <Card>
        <div className="space-y-4 p-2">
          <div className="relative">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="PASTE SOCIAL MEDIA POST OR CUSTOM TEXT HERE..."
              className="w-full h-40 p-3 border-2 border-black rounded-8 focus:outline-none focus:ring-2 focus:ring-primary font-bold text-sm resize-none placeholder:text-slate-300"
            />
            <div className="absolute bottom-3 right-3 text-[10px] font-black text-slate-400 uppercase">
              {text.length} Characters
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-2 bg-red-50 text-negative text-xs font-bold rounded-8 border-2 border-negative uppercase">
              <AlertTriangle size={14} />
              {error}
            </div>
          )}

          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <span className="px-2 py-1 bg-slate-100 border-2 border-black rounded-8 text-[10px] font-bold uppercase shrink-0">Auto-Detect: English</span>
              <span className="px-2 py-1 bg-slate-100 border-2 border-black rounded-8 text-[10px] font-bold uppercase shrink-0">System: Hybrid-v1</span>
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={() => {
                  setText('');
                  setResult(null);
                }}
                className="px-4 py-2 bg-white text-dark border-2 border-black rounded-8 font-black uppercase text-xs hover:bg-slate-50 transition-all"
              >
                RESET
              </button>
              <Button 
                onClick={handleAnalyze} 
                disabled={loading || !text}
                className="flex items-center gap-2 px-6"
              >
                {loading ? 'PROCESSING...' : (
                  <>
                    <Brain size={18} />
                    ANALYZE TEXT
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {result && !loading && (
        <Card className={`animate-in fade-in slide-in-from-bottom-4 duration-500 ${result.sentiment === 'positive' ? 'bg-green-50' : 'bg-red-50'}`}>
          <div className="flex items-start gap-4 p-2">
            <div className={`p-3 border-2 border-black rounded-8 ${result.sentiment === 'positive' ? 'bg-secondary' : 'bg-negative'} text-white`}>
              {result.sentiment === 'positive' ? <CheckCircle2 size={32} /> : <AlertCircle size={32} />}
            </div>
            
            <div className="flex-1 space-y-1">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-black uppercase italic tracking-tighter">
                  Result: <span className={result.sentiment === 'positive' ? 'text-secondary' : 'text-negative'}>{result.sentiment}</span>
                </h2>
                <div className="px-2 py-1 bg-black text-white text-[10px] font-black rounded-sm uppercase">
                  Confidence: {(result.confidence * 100).toFixed(1)}%
                </div>
              </div>
              <p className="text-sm font-bold text-slate-700 italic">"{result.suggestion}"</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default SentimentPage;
