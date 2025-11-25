import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Film, FilmFormData, FilmStatus } from '../types';

interface FilmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FilmFormData) => void;
  initialData?: Film | null;
}

const DEFAULT_FORM: FilmFormData = {
  title: '',
  status: 'Belum di Tonton',
  episodes: 0,
  date: new Date().toISOString().split('T')[0],
};

export const FilmModal: React.FC<FilmModalProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState<FilmFormData>(DEFAULT_FORM);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        status: initialData.status,
        episodes: initialData.episodes,
        date: initialData.date,
      });
    } else {
      setFormData({
        ...DEFAULT_FORM,
        date: new Date().toISOString().split('T')[0],
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden transform transition-all scale-100 border border-gray-200 dark:border-slate-700">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 pb-2">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white transition-colors">
            {initialData ? 'Edit Data Film' : 'Tambah Film Baru'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 pt-4 space-y-5">
          
          {/* Date Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block transition-colors">Tanggal</label>
            <div className="relative">
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-2.5 border border-yellow-400 bg-white dark:bg-slate-900 text-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-yellow-200 dark:focus:ring-yellow-900 focus:border-yellow-500 outline-none transition-all text-sm"
              />
            </div>
          </div>

          {/* Title Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block transition-colors">Judul</label>
            <input
              type="text"
              required
              placeholder="Masukkan judul film..."
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 focus:border-blue-400 outline-none transition-all text-sm"
            />
          </div>

          {/* Status Select */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block transition-colors">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as FilmStatus })}
              className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 focus:border-blue-400 outline-none transition-all text-sm"
            >
              <option value="Belum di Tonton">Belum di Tonton</option>
              <option value="In Progress">In Progress</option>
              <option value="Complete">Complete</option>
            </select>
          </div>

          {/* Episode Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block transition-colors">Episode</label>
            <input
              type="number"
              min="0"
              required
              value={formData.episodes}
              onChange={(e) => setFormData({ ...formData, episodes: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 focus:border-blue-400 outline-none transition-all text-sm"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-gray-900 bg-[#fbbd23] rounded-lg hover:bg-[#eab308] transition-colors shadow-sm"
            >
              {initialData ? 'Simpan Perubahan' : 'Tambah Film'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};