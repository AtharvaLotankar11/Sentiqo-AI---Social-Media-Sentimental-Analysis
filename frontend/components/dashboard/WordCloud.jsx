import React from 'react';
import Card from '../ui/Card';

const WordCloud = ({ words }) => {
  // Expected words: [{ text: 'love', score: 98, type: 'positive' }, { text: 'bad', score: 85, type: 'negative' }]
  
  return (
    <Card title="Key Emerging Themes" className="h-[350px]">
      <div className="flex flex-wrap items-center justify-center gap-1 p-2 h-full overflow-hidden content-center">
        {words.length > 0 ? (
          words.slice(0, 10).map((word, idx) => {
            // Tighter scaling: 28px down to 12px
            const fontSize = Math.max(28 - (idx * 2), 11);
            
            const colorClass = 
              word.type === 'positive' ? 'text-secondary' : 
              word.type === 'negative' ? 'text-negative' : 'text-slate-500';

            return (
              <span 
                key={`${word.text}-${idx}`} 
                className={`font-black uppercase italic transition-all hover:scale-110 cursor-default ${colorClass} hover:text-dark px-1.5`}
                style={{ fontSize: `${fontSize}px`, lineHeight: 1 }}
              >
                {word.text}
              </span>
            );
          })
        ) : (
          <p className="font-bold text-slate-400 uppercase text-[10px]">No themes detected yet</p>
        )}
      </div>
    </Card>
  );
};

export default WordCloud;
