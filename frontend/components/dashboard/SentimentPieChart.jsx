'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import Card from '../ui/Card';

const SentimentPieChart = ({ data }) => {
  // Expected data: [{ name: 'Positive', value: 400 }, { name: 'Negative', value: 300 }, ...]
  
  const COLORS = {
    'Positive': '#22C55E',
    'Negative': '#EF4444',
    'Neutral': '#94A3B8',
  };

  return (
    <Card title="Sentiment Distribution" className="h-[350px]">
      <ResponsiveContainer width="100%" height="85%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
            stroke="#000"
            strokeWidth={2}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[entry.name] || '#4F46E5'} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#fff', 
              border: '2px solid #000', 
              borderRadius: '8px',
              fontWeight: 'bold' 
            }} 
          />
          <Legend 
            verticalAlign="bottom" 
            height={36} 
            formatter={(value) => <span className="text-xs font-bold uppercase text-black">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default SentimentPieChart;
