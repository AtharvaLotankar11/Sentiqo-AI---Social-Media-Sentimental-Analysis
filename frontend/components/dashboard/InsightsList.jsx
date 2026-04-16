import React from 'react';
import Card from '../ui/Card';
import { Lightbulb, AlertCircle, CheckCircle, Info } from 'lucide-react';

const InsightsList = ({ insights }) => {
  const getIcon = (type) => {
    switch (type) {
      case 'warning': return <AlertCircle size={18} className="text-negative" />;
      case 'success': return <CheckCircle size={18} className="text-secondary" />;
      case 'action': return <Lightbulb size={18} className="text-primary" />;
      default: return <Info size={18} className="text-slate-400" />;
    }
  };

  const getBg = (type) => {
    switch (type) {
      case 'warning': return 'bg-red-50';
      case 'success': return 'bg-green-50';
      case 'action': return 'bg-blue-50';
      default: return 'bg-slate-50';
    }
  };

  return (
    <Card title="AI Intelligence Hub" className="h-full">
      <div className="space-y-3">
        {insights.length > 0 ? (
          insights.map((insight) => (
            <div 
              key={insight.id} 
              className={`p-3 border-2 border-black rounded-8 shadow-sm flex gap-3 transition-transform hover:scale-[1.01] ${getBg(insight.type)}`}
            >
              <div className="shrink-0 pt-1">
                {getIcon(insight.type)}
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-black uppercase tracking-tight text-dark">{insight.title}</h4>
                <p className="text-[11px] font-bold text-slate-700 leading-tight uppercase">{insight.message}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-xs font-bold text-slate-400 uppercase">Analyzing live patterns...</p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default InsightsList;
