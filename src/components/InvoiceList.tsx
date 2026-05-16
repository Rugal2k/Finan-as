/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Plus, Search, Filter, MoreVertical, CreditCard, Calendar } from 'lucide-react';
import { Invoice, AppState } from '../types';
import { formatCurrency, formatDate, cn } from '../lib/utils';
import { CATEGORIES } from '../constants';
import { motion } from 'motion/react';

interface InvoiceListProps {
  state: AppState;
  currentMonth: string;
  onAddInvoice: () => void;
  onUpdateStatus: (id: string, status: 'pago' | 'pendente' | 'atrasado', paidValue: number) => void;
}

export const InvoiceList = ({ state, currentMonth, onAddInvoice, onUpdateStatus }: InvoiceListProps) => {
  const monthInvoices = state.invoices.filter(i => i.month === currentMonth);
  const [filter, setFilter] = useState<'todos' | 'pago' | 'pendente' | 'atrasado'>('todos');

  const today = new Date().toISOString().split('T')[0];
  const processedInvoices = monthInvoices.map(i => {
    if (i.status !== 'pago' && i.dueDate < today) {
      return { ...i, status: 'atrasado' as const };
    }
    return i;
  });

  const filteredInvoices = processedInvoices.filter(i => 
    filter === 'todos' ? true : i.status === filter
  );

  const toggleStatus = (invoice: Invoice) => {
    const newStatus = invoice.status === 'pago' ? 'pendente' : 'pago';
    const paidValue = newStatus === 'pago' ? invoice.value : 0;
    onUpdateStatus(invoice.id, newStatus, paidValue);
  };

  return (
    <div className="px-6 pt-12 pb-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Minhas Contas</h1>
          <p className="text-gray-500 text-sm">{monthInvoices.length} compromissos cadastrados</p>
        </div>
        <button 
          onClick={onAddInvoice}
          className="bg-blue-600 text-white p-3 rounded-2xl shadow-lg shadow-blue-100 hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      {/* Filters Hub */}
      <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
        {['todos', 'pendente', 'atrasado', 'pago'].map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t as any)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              filter === t 
                ? "bg-blue-600 text-white shadow-md shadow-blue-50" 
                : "bg-white text-gray-500 border border-gray-100"
            }`}
          >
            {t.charAt(0) ? t.charAt(0).toUpperCase() + t.slice(1) : t}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-4 mt-4">
        {filteredInvoices.length === 0 ? (
          <div className="py-20 text-center">
            <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 italic">Nenhuma fatura encontrada aqui.</p>
          </div>
        ) : (
          filteredInvoices.map((invoice) => {
            const category = CATEGORIES.find(c => c.id === invoice.category) || CATEGORIES[CATEGORIES.length - 1];
            const isPaid = invoice.status === 'pago';
            
            return (
              <motion.div
                layout
                key={invoice.id}
                className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 active:scale-[0.98] transition-all"
              >
                {/* Status Toggle Button */}
                <button 
                  onClick={() => toggleStatus(invoice)}
                  className={cn(
                    "w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 flex-shrink-0",
                    isPaid ? "bg-emerald-500 border-emerald-500" : "bg-white border-slate-200"
                  )}
                >
                  <div className={cn(
                    "w-3 h-3 rounded-full transition-all duration-300",
                    isPaid ? "bg-white scale-110" : "bg-slate-100"
                  )} />
                </button>
                
                <div className="flex-1 min-w-0" onClick={() => toggleStatus(invoice)}>
                  <h3 className={cn("font-bold text-slate-900 truncate", isPaid && "text-slate-400 line-through")}>{invoice.companyName}</h3>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Calendar className="w-3 h-3" />
                    <span className={cn(invoice.status === 'atrasado' && "text-rose-500 font-bold")}>
                      {invoice.status === 'atrasado' ? "ATRASADO: " : "Vence em "}
                      {formatDate(invoice.dueDate)}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <p className={cn("font-bold text-slate-900", isPaid && "text-slate-400")}>{formatCurrency(invoice.value)}</p>
                  <span className={`text-[9px] font-black uppercase tracking-widest ${
                    isPaid ? "text-emerald-500" : 
                    invoice.status === 'atrasado' ? "text-rose-500" : "text-amber-500"
                  }`}>
                    {invoice.status}
                  </span>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
};
