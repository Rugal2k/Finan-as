/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, Legend } from 'recharts';
import { AppState } from '../types';
import { formatCurrency } from '../lib/utils';
import { CATEGORIES } from '../constants';
import { PieChart, Pie } from 'recharts';

interface ReportsProps {
  state: AppState;
  currentMonth: string;
}

export const Reports = ({ state, currentMonth }: ReportsProps) => {
  const monthInvoices = state.invoices.filter(i => i.month === currentMonth);
  
  // Data for Categories Pie Chart
  const categoryData = CATEGORIES.map(cat => {
    const total = monthInvoices
      .filter(i => i.category === cat.id)
      .reduce((acc, curr) => acc + curr.value, 0);
    return { name: cat.name, value: total, color: cat.color };
  }).filter(c => c.value > 0);

  // Data for Monthly Evolution (last 6 months)
  const last6Months = Array.from({ length: 6 }).map((_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (5 - i));
    const mStr = d.toISOString().slice(0, 7);
    const invoices = state.invoices.filter(inv => inv.month === mStr);
    const config = state.configs.find(c => c.month === mStr) || { income: 0, extraEntries: 0 };
    return {
      month: d.toLocaleDateString('pt-BR', { month: 'short' }),
      Gastos: invoices.reduce((acc, curr) => acc + curr.value, 0),
      Renda: config.income + config.extraEntries
    };
  });

  return (
    <div className="px-6 pt-12 pb-6">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Relatórios</h1>
        <p className="text-gray-500 text-sm">Análise visual da sua vida financeira</p>
      </header>

      <div className="space-y-8">
        {/* Category Breakdown */}
        <section className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <h3 className="text-sm font-bold text-gray-900 mb-6 uppercase tracking-wider">Gastos por Categoria</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-y-2 mt-4">
             {categoryData.map((cat, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                  <span className="text-[10px] text-gray-500">{cat.name}: <span className="font-bold">{formatCurrency(cat.value)}</span></span>
                </div>
             ))}
          </div>
        </section>

        {/* Monthly Evolution */}
        <section className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <h3 className="text-sm font-bold text-gray-900 mb-6 uppercase tracking-wider">Evolução Mensal</h3>
          <div className="h-64 w-full">
             <ResponsiveContainer width="100%" height="100%">
                <BarChart data={last6Months}>
                  <XAxis dataKey="month" fontSize={10} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip 
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend verticalAlign="top" iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 'bold' }} />
                  <Bar dataKey="Gastos" fill="#EF4444" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Renda" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </BarChart>
             </ResponsiveContainer>
          </div>
        </section>

        {/* Quick Insights */}
        <section className="bg-blue-600 rounded-3xl p-6 text-white text-center">
           <h4 className="text-blue-100 text-xs font-bold uppercase tracking-widest mb-2">Insight Inteligente</h4>
           <p className="text-lg font-medium">
             "Você economizou 12% a mais do que no mês passado. Continue assim!"
           </p>
        </section>
      </div>
    </div>
  );
};
