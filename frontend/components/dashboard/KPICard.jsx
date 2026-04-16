import React from 'react';
import Card from '../ui/Card';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

const KPICard = ({ title, value, icon, change, type = 'neutral' }) => {
  const colors = {
    positive: 'text-secondary',
    negative: 'text-negative',
    neutral: 'text-primary',
  };

  return (
    <Card className="flex flex-col justify-between min-h-[120px]">
      <div className="flex justify-between items-start">
        <div className="p-2 border-2 border-black rounded-8 bg-slate-50">
          {icon}
        </div>
        {change && (
          <div className={`flex items-center gap-1 text-xs font-bold uppercase ${change > 0 ? 'text-secondary' : 'text-negative'}`}>
            {change > 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            {Math.abs(change)}%
          </div>
        )}
      </div>
      
      <div className="mt-3">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{title}</p>
        <h2 className={`text-3xl font-black ${colors[type]}`}>{value}</h2>
      </div>
    </Card>
  );
};

export default KPICard;
