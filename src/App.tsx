/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { InvoiceList } from './components/InvoiceList';
import { MonthlyControl } from './components/MonthlyControl';
import { Reports } from './components/Reports';
import { Settings } from './components/Settings';
import { AppState, Invoice, MonthlyConfig } from './types.ts';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check } from 'lucide-react';
import { CATEGORIES } from './constants.ts';

const STORAGE_KEY = 'poupafacil_data';

const INITIAL_DATA: AppState = {
  invoices: [
    {
      id: '1',
      companyName: 'Aluguel',
      category: 'moradia',
      description: 'Mensalidade apartamento',
      value: 1500,
      dueDate: '2026-05-10',
      recurrence: 'mensal',
      status: 'pago',
      paidValue: 1500,
      month: '2026-05'
    },
    {
      id: '2',
      companyName: 'Energia Elétrica',
      category: 'servicos',
      description: 'Conta de luz',
      value: 250,
      dueDate: '2026-05-15',
      recurrence: 'mensal',
      status: 'atrasado',
      paidValue: 0,
      month: '2026-05'
    },
    {
      id: '3',
      companyName: 'Supermercado',
      category: 'alimentacao',
      description: 'Compras do mês',
      value: 800,
      dueDate: '2026-05-20',
      recurrence: 'mensal',
      status: 'pendente',
      paidValue: 0,
      month: '2026-05'
    }
  ],
  configs: [
    {
      month: '2026-05',
      income: 5000,
      extraEntries: 500,
      extraExpenses: 200
    }
  ]
};

export default function App() {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : INITIAL_DATA;
  });

  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAddModal, setShowAddModal] = useState(false);
  const currentMonth = new Date().toISOString().slice(0, 7);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const handleUpdateConfig = (config: MonthlyConfig) => {
    setState(prev => ({
      ...prev,
      configs: prev.configs.some(c => c.month === config.month)
        ? prev.configs.map(c => c.month === config.month ? config : c)
        : [...prev.configs, config]
    }));
  };

  const handleAddInvoice = (invoice: Omit<Invoice, 'id' | 'month'>) => {
    const newInvoice: Invoice = {
      ...invoice,
      id: Math.random().toString(36).substr(2, 9),
      month: currentMonth
    };
    setState(prev => ({
      ...prev,
      invoices: [...prev.invoices, newInvoice]
    }));
    setShowAddModal(false);
  };

  const clearData = () => {
    setState({ invoices: [], configs: [] });
    setActiveTab('dashboard');
  };

  return (
    <div className="max-w-md mx-auto h-screen bg-white shadow-2xl relative overflow-hidden border-[12px] border-slate-900 rounded-[3rem] my-4">
      <Layout activeTab={activeTab} onTabChange={setActiveTab}>
        {activeTab === 'dashboard' && <Dashboard state={state} currentMonth={currentMonth} />}
        {activeTab === 'invoices' && (
          <InvoiceList 
            state={state} 
            currentMonth={currentMonth} 
            onAddInvoice={() => setShowAddModal(true)}
            onUpdateStatus={(id, status, paid) => {
              setState(prev => ({
                ...prev,
                invoices: prev.invoices.map(i => i.id === id ? { ...i, status, paidValue: paid } : i)
              }));
            }}
          />
        )}
        {activeTab === 'monthly' && (
          <MonthlyControl 
            state={state} 
            currentMonth={currentMonth} 
            onUpdateConfig={handleUpdateConfig} 
          />
        )}
        {activeTab === 'reports' && <Reports state={state} currentMonth={currentMonth} />}
        {activeTab === 'settings' && <Settings onClearData={clearData} />}
      </Layout>

      {/* Basic Add Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-[100] flex items-end sm:items-center justify-center p-4"
          >
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="bg-white w-full max-w-sm rounded-t-[40px] sm:rounded-[40px] p-8 overflow-y-auto max-h-[90vh]"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Nova Fatura</h2>
                <button onClick={() => setShowAddModal(false)} className="bg-gray-100 p-2 rounded-full">
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
              
              <AddInvoiceForm onSubmit={handleAddInvoice} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function AddInvoiceForm({ onSubmit }: { onSubmit: (data: any) => void }) {
  const [formData, setFormData] = useState({
    companyName: '',
    category: 'outros',
    value: '',
    dueDate: new Date().toISOString().split('T')[0],
    recurrence: 'mensal',
    status: 'pendente',
    paidValue: 0,
    description: ''
  });

  return (
    <div className="space-y-4">
      <div>
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1 mb-1 block">Nome da Conta / Empresa</label>
        <input 
          autoFocus
          className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 font-medium"
          placeholder="Ex: Netflix, Internet..."
          value={formData.companyName}
          onChange={e => setFormData({ ...formData, companyName: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1 mb-1 block">Valor Previsto</label>
          <input 
            type="number"
            className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 font-bold"
            placeholder="0,00"
            value={formData.value}
            onChange={e => setFormData({ ...formData, value: e.target.value })}
          />
        </div>
        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1 mb-1 block">Data Vencimento</label>
          <input 
            type="date"
            className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            value={formData.dueDate}
            onChange={e => setFormData({ ...formData, dueDate: e.target.value })}
          />
        </div>
      </div>

      <div>
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1 mb-1 block">Categoria</label>
        <select 
          className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 text-sm appearance-none"
          value={formData.category}
          onChange={e => setFormData({ ...formData, category: e.target.value })}
        >
          {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      <button 
        disabled={!formData.companyName || !formData.value}
        onClick={() => onSubmit({ ...formData, value: Number(formData.value) })}
        className="w-full bg-blue-600 text-white rounded-2xl py-4 font-bold shadow-xl shadow-blue-100 disabled:opacity-50 disabled:shadow-none mt-4 flex items-center justify-center gap-2"
      >
        <Check className="w-5 h-5" />
        Cadastrar Fatura
      </button>
    </div>
  );
}
