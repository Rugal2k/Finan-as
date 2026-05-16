/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Wallet, TrendingUp, TrendingDown, Plus, PencilLine, Check } from 'lucide-react';
import { AppState, MonthlyConfig } from '../types';
import { formatCurrency } from '../lib/utils';
import { motion } from 'motion/react';

interface MonthlyControlProps {
  state: AppState;
  currentMonth: string;
  onUpdateConfig: (config: MonthlyConfig) => void;
}

export const MonthlyControl = ({ state, currentMonth, onUpdateConfig }: MonthlyControlProps) => {
  const config = state.configs.find(c => c.month === currentMonth) || { 
    income: 0, 
    extraEntries: 0, 
    month: currentMonth 
  };

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(config);

  const totalRevenue = config.income + config.extraEntries;
  const monthInvoices = state.invoices.filter(i => i.month === currentMonth);
  const totalBills = monthInvoices.reduce((acc, i) => acc + i.value, 0);
  const fixedExpenses = totalBills;

  const handleSave = () => {
    onUpdateConfig(formData);
    setIsEditing(false);
  };

  return (
    <div className="px-6 pt-12 pb-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orçamento Mensal</h1>
          <p className="text-gray-500 text-sm">Configure seus ganhos para este mês</p>
        </div>
        <button 
          onClick={() => {
            setFormData(config); // Reset to actual config when toggling
            setIsEditing(!isEditing);
          }}
          className="bg-white text-slate-600 p-3 rounded-2xl border border-slate-100 shadow-sm"
        >
          {isEditing ? <Check className="w-6 h-6 text-emerald-600" /> : <PencilLine className="w-6 h-6" />}
        </button>
      </div>

      {isEditing ? (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xl space-y-6"
        >
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Salário Mensal</label>
            <input 
              type="number"
              value={formData.income}
              onChange={(e) => setFormData({ ...formData, income: Number(e.target.value) })}
              className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 font-bold text-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="R$ 0,00"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Outras Receitas</label>
            <input 
              type="number"
              value={formData.extraEntries}
              onChange={(e) => setFormData({ ...formData, extraEntries: Number(e.target.value) })}
              className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 font-bold text-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="R$ 0,00"
            />
          </div>
          <button 
            onClick={handleSave}
            className="w-full bg-emerald-500 text-white rounded-2xl py-4 font-bold shadow-lg shadow-emerald-100"
          >
            Confirmar Valores de {new Date(currentMonth + '-02').toLocaleDateString('pt-BR', { month: 'long' })}
          </button>
        </motion.div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center">
                <TrendingUp className="text-emerald-600 w-6 h-6" />
              </div>
              <div className="flex-1">
                <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Ganhos Previstos</p>
                <h3 className="text-2xl font-bold text-gray-900">{formatCurrency(totalRevenue)}</h3>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-100">
              <div>
                <p className="text-gray-400 text-[10px] uppercase font-bold">Salário Base</p>
                <p className="font-bold text-gray-700">{formatCurrency(config.income)}</p>
              </div>
              <div>
                <p className="text-gray-400 text-[10px] uppercase font-bold">Outros Ganhos</p>
                <p className="font-bold text-gray-700">{formatCurrency(config.extraEntries)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center">
                <TrendingDown className="text-slate-600 w-6 h-6" />
              </div>
              <div className="flex-1">
                <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Contas Vinculadas</p>
                <h3 className="text-2xl font-bold text-gray-900">{formatCurrency(totalBills)}</h3>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-100">
               <p className="text-slate-500 text-xs leading-relaxed italic">
                 Este valor é a soma de todas as faturas cadastradas para o mês de {new Date(currentMonth + '-02').toLocaleDateString('pt-BR', { month: 'long' })}.
               </p>
            </div>
          </div>

          <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100">
            <h4 className="text-blue-900 font-bold mb-1 text-sm">Resumo da Saúde</h4>
            <p className="text-blue-700 text-xs mb-4">
              Suas despesas representam {Math.round((fixedExpenses / (totalRevenue || 1)) * 100)}% da sua renda total.
            </p>
            <div className="w-full bg-blue-200 h-2 rounded-full overflow-hidden">
               <div 
                className="bg-blue-600 h-full rounded-full transition-all duration-1000"
                style={{ width: `${Math.min((fixedExpenses / (totalRevenue || 1)) * 100, 100)}%` }}
               />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
