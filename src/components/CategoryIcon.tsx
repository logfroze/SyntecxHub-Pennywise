import React from 'react';
import {
  Utensils,
  Bus,
  ShoppingBag,
  Receipt,
  HeartPulse,
  GraduationCap,
  Film,
  MoreHorizontal,
  Briefcase,
  Laptop,
  Building2,
  Gift,
  HelpCircle,
} from 'lucide-react';
import { ALL_CATEGORIES } from '../types/pennywise';

interface CategoryIconProps {
  category: string;
  className?: string;
  size?: number;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({ category, className = 'w-5 h-5', size = 20 }) => {
  const item = ALL_CATEGORIES.find((c) => c.name.toLowerCase() === category.toLowerCase()) || {
    icon: 'MoreHorizontal',
    color: '#64748B',
    bgColor: '#F1F5F9',
  };

  const getIcon = () => {
    switch (item.icon) {
      case 'Utensils':
        return <Utensils size={size} style={{ color: item.color }} />;
      case 'Bus':
        return <Bus size={size} style={{ color: item.color }} />;
      case 'ShoppingBag':
        return <ShoppingBag size={size} style={{ color: item.color }} />;
      case 'Receipt':
        return <Receipt size={size} style={{ color: item.color }} />;
      case 'HeartPulse':
        return <HeartPulse size={size} style={{ color: item.color }} />;
      case 'GraduationCap':
        return <GraduationCap size={size} style={{ color: item.color }} />;
      case 'Film':
        return <Film size={size} style={{ color: item.color }} />;
      case 'Briefcase':
        return <Briefcase size={size} style={{ color: item.color }} />;
      case 'Laptop':
        return <Laptop size={size} style={{ color: item.color }} />;
      case 'Building2':
        return <Building2 size={size} style={{ color: item.color }} />;
      case 'Gift':
        return <Gift size={size} style={{ color: item.color }} />;
      case 'MoreHorizontal':
        return <MoreHorizontal size={size} style={{ color: item.color }} />;
      default:
        return <HelpCircle size={size} style={{ color: item.color }} />;
    }
  };

  return (
    <div
      className={`inline-flex items-center justify-center rounded-xl p-2.5 transition-transform ${className}`}
      style={{ backgroundColor: item.bgColor }}
      title={category}
    >
      {getIcon()}
    </div>
  );
};
