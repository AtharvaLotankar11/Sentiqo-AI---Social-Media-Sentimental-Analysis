'use client';

import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import Card from '../ui/Card';

const TrendLineChart = ({ data }) => {
  // Expected data: [{ date: '2024-01-01', positive: 45, negative: 32, neutral: 12 }, ...]

  return (
    <Card title="Sentiment Trends Over Time" className="h-[350px]">
      <ResponsiveContainer width="100%" height="85%">
        <LineChart data={data} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
          <XAxis 
            dataKey="date" 
            axisLine={{ stroke: '#000', strokeWidth: 2 }}
            tick={{ fontSize: 10, fontWeight: 'bold' }}
            tickLine={{ stroke: '#000', strokeWidth: 2 }}
          />
          <YAxis 
            axisLine={{ stroke: '#000', strokeWidth: 2 }}
            tick={{ fontSize: 10, fontWeight: 'bold' }}
            tickLine={{ stroke: '#000', strokeWidth: 2 }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#fff', 
              border: '2px solid #000', 
              borderRadius: '8px',
              fontFamily: 'Inter, sans-serif'
            }} 
          />
          <Legend 
            verticalAlign="top" 
            align="right"
            height={36} 
            formatter={(value) => <span className="text-xs font-bold uppercase text-black">{value}</span>}
          />
          <Line 
            type="monotone" 
            dataKey="positive" 
            stroke="#22C55E" 
            strokeWidth={4} 
            dot={{ r: 4, fill: '#22C55E', stroke: '#000', strokeWidth: 2 }}
            activeDot={{ r: 6, strokeWidth: 0 }}
          />
          <Line 
            type="monotone" 
            dataKey="negative" 
            stroke="#EF4444" 
            strokeWidth={4} 
            dot={{ r: 4, fill: '#EF4444', stroke: '#000', strokeWidth: 2 }}
            activeDot={{ r: 6, strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default TrendLineChart;
