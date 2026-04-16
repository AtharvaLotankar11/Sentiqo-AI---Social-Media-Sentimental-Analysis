import React from 'react';
import Card from '../ui/Card';
import { TrendingUp, TrendingDown } from 'lucide-react';

const ThemeList = ({ themes }) => {
  // Expected themes: { positive: ['love', 'thanks'], negative: ['sorry', 'miss'] }
  
  return (
    <Card title="Top Themes by Category" className="h-[350px]">
      <div className="grid grid-cols-2 gap-3 h-full overflow-y-auto pr-1">
        {/* Positive Themes */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-secondary font-black uppercase text-xs border-b-2 border-secondary pb-1">
            <TrendingUp size={14} />
            Positive
          </div>
          <div className="flex flex-col gap-1">
            {themes.positive?.map((theme, i) => (
              <div key={i} className="flex justify-between items-center text-sm group">
                <span className="font-bold text-dark group-hover:text-secondary truncate">{theme.keyword}</span>
                <span className="px-1 bg-slate-100 border border-black text-[10px] font-black rounded-sm">{theme.frequency}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Negative Themes */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-negative font-black uppercase text-xs border-b-2 border-negative pb-1">
            <TrendingDown size={14} />
            Negative
          </div>
          <div className="flex flex-col gap-1">
            {themes.negative?.map((theme, i) => (
              <div key={i} className="flex justify-between items-center text-sm group">
                <span className="font-bold text-dark group-hover:text-negative truncate">{theme.keyword}</span>
                <span className="px-1 bg-slate-100 border border-black text-[10px] font-black rounded-sm">{theme.frequency}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ThemeList;
