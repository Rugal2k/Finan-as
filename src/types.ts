/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Recurrence = 'mensal' | 'anual' | 'unica';
export type Status = 'pago' | 'pendente' | 'atrasado';

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface Invoice {
  id: string;
  companyName: string;
  category: string;
  description: string;
  value: number;
  dueDate: string;
  recurrence: Recurrence;
  status: Status;
  paidValue: number;
  month: string; // ISO format for month/year (e.g., 2023-10)
}

export interface MonthlyConfig {
  month: string;
  income: number;
  extraEntries: number;
  extraExpenses: number;
}

export interface AppState {
  invoices: Invoice[];
  configs: MonthlyConfig[];
}
