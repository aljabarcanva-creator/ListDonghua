import React, { useState, useEffect } from 'react';
import { Film as FilmIcon, Plus, Pencil, Trash2, Search, Sun, Moon, Loader2, RefreshCw } from 'lucide-react';
import { Film, FilmFormData } from './types';
import { StatusBadge } from './components/StatusBadge';
import { FilmModal } from './components/FilmModal';
import { Toast } from './components/Toast';
import * as api from './services/api';

const App: React.FC = () => {
  const [films, setFilms] = useState<Film[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('film-list-theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFilm, setEditingFilm] = useState<Film | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Initial load
  useEffect(() => {
    loadFilms();
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('film-list-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('film-list-theme', 'light');
    }
  }, [isDarkMode]);

  const loadFilms = async () => {
    setIsLoading(true);
    const data = await api.fetchFilms();
    // Sort by ID descending (newest first based on rowIndex roughly) or reverse
    setFilms(data.reverse()); 
    setIsLoading(false);
  };

  const handleAdd = async (data: FilmFormData) => {
    setIsLoading(true);
    const success = await api.addFilmToSheet(data);
    if (success) {
      await loadFilms();
      showToast('Film berhasil ditambahkan ke database!');
    } else {
      showToast('Gagal menambahkan film.');
      setIsLoading(false);
    }
  };

  const handleEdit = async (data: FilmFormData) => {
    if (!editingFilm) return;
    setIsLoading(true);
    const success = await api.updateFilmInSheet(editingFilm.id, data);
    if (success) {
      await loadFilms();
      showToast('Film berhasil diperbarui!');
    } else {
      showToast('Gagal memperbarui film.');
      setIsLoading(false);
    }
    setEditingFilm(null);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus film ini?')) {
      setIsLoading(true);
      const success = await api.deleteFilmFromSheet(id);
      if (success) {
        await loadFilms();
        showToast('Film telah dihapus.');
      } else {
        showToast('Gagal menghapus film.');
        setIsLoading(false);
      }
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  const openAddModal = () => {
    setEditingFilm(null);
    setIsModalOpen(true);
  };

  const openEditModal = (film: Film) => {
    setEditingFilm(film);
    setIsModalOpen(true);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }).format(date);
    } catch (e) {
      return dateString;
    }
  };

  const filteredFilms = films.filter(f => 
    f.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-slate-900 transition-colors duration-200 flex flex-col items-center py-12 px-4 sm:px-6 relative">
      
      {/* Theme Toggle Button */}
      <button
        onClick={() => setIsDarkMode(!isDarkMode)}
        className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 rounded-full bg-white dark:bg-slate-800 text-slate-600 dark:text-yellow-400 shadow-md hover:shadow-lg transition-all border border-gray-100 dark:border-slate-700 z-10"
        aria-label="Toggle theme"
      >
        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      {/* Main Header */}
      <div className="text-center mb-10 space-y-3">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-800 dark:bg-slate-700 mb-4 shadow-lg transition-colors">
          <FilmIcon className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight transition-colors">Film List Manager</h1>
        <p className="text-slate-500 dark:text-slate-400 text-lg font-light transition-colors">
          Kelola daftar film yang sedang ditonton (Terhubung ke Google Sheets)
        </p>
      </div>

      {/* Control Bar */}
      <div className="w-full max-w-5xl mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="text-slate-500 dark:text-slate-400 font-medium self-start sm:self-center transition-colors">
          Total: <span className="font-bold text-slate-900 dark:text-white transition-colors">{filteredFilms.length}</span> film
        </div>

        <div className="flex gap-3 w-full sm:w-auto">
          {/* Refresh Button */}
          <button
            onClick={loadFilms}
            disabled={isLoading}
            className="p-2.5 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-all shadow-sm disabled:opacity-50"
            title="Muat ulang data"
          >
            <RefreshCw size={18} className={isLoading ? "animate-spin" : ""} />
          </button>

          {/* Search Input */}
          <div className="relative flex-grow sm:flex-grow-0">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4 transition-colors" />
             <input 
                type="text" 
                placeholder="Cari film..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-64 pl-9 pr-4 py-2.5 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all shadow-sm"
             />
          </div>

          <button
            onClick={openAddModal}
            disabled={isLoading}
            className="flex items-center gap-2 bg-[#fbbd23] hover:bg-[#eab308] text-gray-900 font-semibold px-5 py-2.5 rounded-lg transition-all shadow-sm hover:shadow active:scale-95 whitespace-nowrap disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
            Tambah Film
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="w-full max-w-5xl bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden transition-all relative">
        
        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 z-10 bg-white/50 dark:bg-slate-900/50 backdrop-blur-[1px] flex items-center justify-center">
            <div className="bg-white dark:bg-slate-800 p-3 rounded-full shadow-lg border border-gray-100 dark:border-slate-700">
              <Loader2 className="w-8 h-8 text-[#fbbd23] animate-spin" />
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-slate-700/50 border-b border-gray-200 dark:border-slate-700 transition-colors">
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider transition-colors">Tanggal</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider transition-colors">Judul</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider transition-colors">Status</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider transition-colors">Episode</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider transition-colors">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
              {filteredFilms.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400 dark:text-slate-500 transition-colors">
                    {isLoading ? 'Sedang memuat data...' : 'Tidak ada film yang ditemukan.'}
                  </td>
                </tr>
              ) : (
                filteredFilms.map((film) => (
                  <tr key={film.id} className="hover:bg-gray-50/80 dark:hover:bg-slate-700/30 transition-colors group">
                    <td className="px-6 py-4 text-sm font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap transition-colors">
                      {formatDate(film.date)}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-slate-900 dark:text-white transition-colors">
                      {film.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={film.status} />
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400 transition-colors">
                      {film.episodes} episode
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openEditModal(film)}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:text-blue-400 dark:hover:bg-blue-900/30 rounded-lg transition-colors border border-gray-200 dark:border-slate-700 hover:border-blue-200 dark:hover:border-blue-800"
                          title="Edit"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(film.id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:text-red-400 dark:hover:bg-red-900/30 rounded-lg transition-colors border border-gray-200 dark:border-slate-700 hover:border-red-200 dark:hover:border-red-800"
                          title="Hapus"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Footer info */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-slate-700/50 border-t border-gray-200 dark:border-slate-700 flex justify-end transition-colors">
           <span className="text-xs text-gray-400 dark:text-slate-500">
             {isLoading ? 'Menyinkronkan...' : `Menampilkan ${filteredFilms.length} item dari Google Sheets`}
           </span>
        </div>
      </div>

      <FilmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={editingFilm ? handleEdit : handleAdd}
        initialData={editingFilm}
      />

      <Toast
        message={toastMessage || ''}
        isVisible={!!toastMessage}
        onClose={() => setToastMessage(null)}
      />
    </div>
  );
};

export default App;
