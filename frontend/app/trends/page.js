'use client';

import React, { useState, useEffect, useRef } from 'react';
import Card from '@/components/ui/Card';
import TrendLineChart from '@/components/dashboard/TrendLineChart';
import { Filter, Download, Calendar, RefreshCw, AlertTriangle } from 'lucide-react';
import Button from '@/components/ui/Button';
import { fetchTrends } from '@/services/api';

const TrendsPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [trendData, setTrendData] = useState([]);
  const [exporting, setExporting] = useState(false);
  const pageRef = useRef(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchTrends();
      setTrendData(data);
    } catch (err) {
      setError('Historical engine unreachable.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = async () => {
    setExporting(true);
    try {
      const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
        import('jspdf'),
        import('html2canvas'),
      ]);

      const element = pageRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'px', format: 'a4' });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`sentiqo-trends-${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (err) {
      console.error('PDF export failed:', err);
    } finally {
      setExporting(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center gap-4 text-primary animate-pulse">
        <RefreshCw size={48} className="animate-spin" />
        <h2 className="text-xl font-black uppercase italic tracking-tighter">Retrieving Chronological Data...</h2>
      </div>
    );
  }

  return (
    <div className="space-y-4" ref={pageRef}>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black uppercase italic tracking-tighter text-dark">Historical Trends</h1>
          <p className="text-sm font-bold text-slate-500 uppercase">Long-form sentiment trajectory analysis</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2" onClick={loadData}>
            <Filter size={16} />
            REFRESH
          </Button>
          <Button variant="primary" className="flex items-center gap-2" onClick={handleExportPDF} disabled={exporting}>
            <Download size={16} />
            {exporting ? 'EXPORTING...' : 'EXPORT PDF'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {error ? (
          <Card className="bg-red-50 border-negative">
             <div className="flex items-center gap-2 p-4 text-negative font-bold uppercase">
              <AlertTriangle size={18} />
              {error}
            </div>
          </Card>
        ) : (
          <TrendLineChart data={trendData} />
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Card title="Volatility Index">
            <div className="p-4 text-center">
              <h3 className="text-4xl font-black text-primary">STABLE</h3>
              <p className="text-xs font-bold text-slate-500 uppercase mt-2">The sentiment has remained stable with minimal spikes in negative mentions.</p>
            </div>
          </Card>
          
          <Card title="Engagement Forecast">
            <div className="p-4 text-center text-secondary">
              <h3 className="text-4xl font-black">POSITIVE</h3>
              <p className="text-xs font-bold text-slate-500 uppercase mt-2">Anticipated increase in positive engagement based on current keyword momentum.</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TrendsPage;
