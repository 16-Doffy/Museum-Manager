"use client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "Th1", tickets: 400 },
  { name: "Th2", tickets: 800 },
  { name: "Th3", tickets: 1200 },
  { name: "Th4", tickets: 600 },
];

export default function TicketChart() {
  return (
    <div className="bg-white rounded-xl shadow p-4 h-72">
      <h3 className="text-lg font-bold mb-4 text-emerald-600">Doanh thu vé</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis 
            dataKey="name" 
            tick={{ fill: '#374151', fontSize: 12 }}
            axisLine={{ stroke: '#d1d5db' }}
          />
          <YAxis 
            tick={{ fill: '#374151', fontSize: 12 }}
            axisLine={{ stroke: '#d1d5db' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#f9fafb', 
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              color: '#374151'
            }}
          />
          <Bar dataKey="tickets" fill="#10b981" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
