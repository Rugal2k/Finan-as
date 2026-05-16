/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Category } from './types.ts';

export const CATEGORIES: Category[] = [
  { id: 'moradia', name: 'Moradia', icon: 'Home', color: '#3B82F6' },
  { id: 'alimentacao', name: 'Alimentação', icon: 'Utensils', color: '#10B981' },
  { id: 'transporte', name: 'Transporte', icon: 'Bus', color: '#F59E0B' },
  { id: 'saude', name: 'Saúde', icon: 'HeartPulse', color: '#EF4444' },
  { id: 'educacao', name: 'Educação', icon: 'GraduationCap', color: '#8B5CF6' },
  { id: 'lazer', name: 'Lazer', icon: 'Gamepad2', color: '#EC4899' },
  { id: 'servicos', name: 'Serviços', icon: 'Zap', color: '#6366F1' },
  { id: 'outros', name: 'Outros', icon: 'MoreHorizontal', color: '#6B7280' },
];

export const COLORS = {
  primary: '#2563EB', // Blue 600
  success: '#10B981', // Emerald 500
  warning: '#F59E0B', // Amber 500
  danger: '#EF4444', // Rose 500
  background: '#F1F5F9', // Slate 100
  card: '#FFFFFF',
  text: '#0F172A', // Slate 900
  textSecondary: '#64748B', // Slate 500
};
