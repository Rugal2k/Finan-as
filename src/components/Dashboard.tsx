/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { ArrowUpRight, ArrowDownRight, Wallet, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { formatCurrency, cn } from '../lib/utils';
import { AppState, Invoice } from '../types';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface DashboardProps {
  state: AppState;
  currentMonth: string;
}

export const Dashboard = ({ state, currentMonth }: DashboardProps) => {
  const monthData = state.invoices.filter(i => i.month === currentMonth);
  const config = state.configs.find(c => c.month === currentMonth) || { income: 0, extraEntries: 0, month: currentMonth };

  const today = new Date().toISOString().split('T')[0];
  const processedMonthData = monthData.map(i => {
    if (i.status !== 'pago' && i.dueDate < today) {
      return { ...i, status: 'atrasado' as const };
    }
    return i;
  });

  // Find most critical invoice
  const overdueInvoice = processedMonthData.find(i => i.status === 'atrasado');
  const upcomingInvoice = processedMonthData
    .filter(i => i.status !== 'pago' && i.dueDate >= today)
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))[0];

  const criticalInvoice = overdueInvoice || upcomingInvoice;

  const totalIncome = config.income + config.extraEntries;
  const totalInvoices = processedMonthData.reduce((acc, curr) => acc + curr.value, 0);
  const totalPaid = processedMonthData.reduce((acc, curr) => acc + curr.paidValue, 0);
  const totalPending = totalInvoices - totalPaid;
  
  const balance = totalIncome - totalPaid;

  const chartData = [
    { name: 'Pago', value: totalPaid, color: '#10B981' },
    { name: 'Pendente', value: totalPending, color: '#F59E0B' },
  ];

  return (
    <div className="px-6 pt-12 pb-8">
      <header className="mb-6">
        <p className="text-slate-500 text-sm">Olá, Rafael 👋</p>
        <h1 className="text-2xl font-bold text-slate-900">Minhas Finanças</h1>
      </header>

      <div className="grid grid-cols-2 gap-3">
        {/* Main Balance Card */}
        <motion.div 
          whileHover={{ scale: 1.01 }}
          className="col-span-2 bg-blue-600 rounded-3xl p-6 text-white shadow-lg shadow-blue-100 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
          <p className="text-blue-100 text-xs font-medium uppercase tracking-wider mb-1">Saldo Disponível</p>
          <div className="flex justify-between items-end mb-4">
            <h2 className="text-3xl font-bold">{formatCurrency(balance)}</h2>
            <span className="bg-white/20 px-2 py-1 rounded text-[10px]">
              {balance > 0 ? '+ Positivo' : '- Atenção'}
            </span>
          </div>
          <div className="w-full bg-blue-400/30 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-emerald-400 h-full rounded-full transition-all duration-1000" 
              style={{ width: `${Math.min((totalPaid / (totalInvoices || 1)) * 100, 100)}%` }}
            />
          </div>
          <p className="text-[10px] mt-2 text-blue-100">
            {Math.round((totalPaid / (totalInvoices || 1)) * 100)}% do orçamento comprometido
          </p>
        </motion.div>

        {/* Status Bento Items */}
        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex flex-col justify-between">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg mb-3 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-white" />
          </div>
          <p className="text-emerald-800 font-bold text-lg leading-tight">{formatCurrency(totalPaid)}</p>
          <p className="text-emerald-600 text-[10px] font-semibold uppercase">Já Pago</p>
        </div>

        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex flex-col justify-between">
          <div className="w-8 h-8 bg-amber-500 rounded-lg mb-3 flex items-center justify-center">
            <Clock className="w-5 h-5 text-white" />
          </div>
          <p className="text-amber-800 font-bold text-lg leading-tight">{formatCurrency(totalPending)}</p>
          <p className="text-amber-600 text-[10px] font-semibold uppercase">Pendente</p>
        </div>

        {/* Warning Alert Bento */}
        {criticalInvoice && (
          <div className={cn(
            "col-span-2 rounded-2xl p-4 flex items-center gap-4 transition-all border",
            criticalInvoice.status === 'atrasado' ? "bg-rose-50 border-rose-100" : "bg-amber-50 border-amber-100"
          )}>
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
              criticalInvoice.status === 'atrasado' ? "bg-rose-500" : "bg-amber-500"
            )}>
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <p className={cn(
                "font-bold text-sm",
                criticalInvoice.status === 'atrasado' ? "text-rose-900" : "text-amber-900"
              )}>
                {criticalInvoice.status === 'atrasado' ? "CONTA ATRASADA!" : "Próximo Vencimento"}
              </p>
              <p className={cn(
                "text-xs",
                criticalInvoice.status === 'atrasado' ? "text-rose-600" : "text-amber-600"
              )}>
                {criticalInvoice.companyName} • {formatCurrency(criticalInvoice.value)} • Vence {new Date(criticalInvoice.dueDate).toLocaleDateString('pt-BR')}
              </p>
            </div>
          </div>
        )}

        {/* Usage Bento Grid (Bar chart-like visual) */}
        <div className="col-span-2 bg-slate-50 border border-slate-200 rounded-2xl p-4">
          <div className="flex justify-between items-center mb-4">
            <p className="text-slate-700 font-bold text-xs uppercase">Histórico de Gastos</p>
            <span className="text-slate-400 text-[10px]">6 Meses</span>
          </div>
          <div className="h-40 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <text 
                  x="50%" 
                  y="50%" 
                  textAnchor="middle" 
                  dominantBaseline="middle" 
                  className="fill-slate-900 font-bold text-sm"
                >
                  {Math.round((totalPaid / (totalInvoices || 1)) * 100)}%
                </text>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-2">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-[10px] font-medium text-slate-500">Pago</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span className="text-[10px] font-medium text-slate-500">Pendente</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
