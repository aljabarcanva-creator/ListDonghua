import React from 'react';
import { FilmStatus } from '../types';

interface StatusBadgeProps {
  status: FilmStatus | string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStyles = () => {
    switch (status) {
      case 'In Progress':
        return 'bg-[#0ea5e9] text-white'; // Sky blue
      case 'Ongoing': // Legacy support for existing data
        return 'bg-[#0ea5e9] text-white';
      case 'Complete':
        return 'bg-[#22c55e] text-white'; // Green
      case 'Belum di Tonton':
        return 'bg-slate-500 text-white dark:bg-slate-600'; // Gray
      default:
        return 'bg-gray-200 text-gray-800 dark:bg-slate-700 dark:text-gray-200';
    }
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold shadow-sm whitespace-nowrap ${getStyles()}`}>
      {status}
    </span>
  );
};