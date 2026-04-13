'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Search, Trash2, Loader2, X, ChevronLeft, ChevronRight, MessageSquare } from 'lucide-react';

interface Komentar {
  id: number;
  nama: string | null;
  whatsapp: string | null;
  isi: string;
  suka: number;
  createdAt: string;
}

export default function AdminKomentar() {
  const { theme } = useTheme();
  const [komentarList, setKomentarList] = useState<Komentar[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedKomentar, setSelectedKomentar] = useState<Komentar | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    fetchKomentar();
  }, [currentPage]);

  const fetchKomentar = async () => {
    setLoading(true);
    try {
      const offset = (currentPage - 1) * itemsPerPage;
      const response = await fetch(`/api/komentar?limit=${itemsPerPage}&offset=${offset}`);
      const result = await response.json();
      if (response.ok) {
        setKomentarList(result.data || []);
        setTotalCount(result.pagination?.total || result.data?.length || 0);
      }
    } catch (error) {
      console.error('Error fetching komentar:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (komentar: Komentar) => {
    setSelectedKomentar(komentar);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedKomentar) return;

    try {
      const response = await fetch(`/api/admin/komentar/${selectedKomentar.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setShowDeleteModal(false);
        setSelectedKomentar(null);
        fetchKomentar();
      }
    } catch (error) {
      console.error('Error deleting komentar:', error);
    }
  };

  const filteredKomentar = komentarList.filter((komentar) =>
    komentar.nama?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    komentar.isi.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-green-100' : 'text-green-900'}`}>
          Kelola Komentar
        </h1>
        <p className={`mt-1 text-sm ${theme === 'dark' ? 'text-green-500' : 'text-green-600'}`}>
          Total {totalCount} komentar
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${theme === 'dark' ? 'text-green-500' : 'text-green-400'}`} />
        <input
          type="text"
          placeholder="Cari berdasarkan nama atau isi komentar..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm transition-all ${
            theme === 'dark'
              ? 'bg-green-900/30 border-green-700/30 text-green-100 placeholder-green-600 focus:border-green-500'
              : 'bg-white border-green-200 text-green-900 placeholder-green-400 focus:border-green-500'
          }`}
        />
      </div>

      {/* List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12">
            <Loader2 className="h-8 w-8 mx-auto mb-3 animate-spin text-green-500" />
            <p className={theme === 'dark' ? 'text-green-600' : 'text-green-500'}>Memuat data...</p>
          </div>
        ) : filteredKomentar.length === 0 ? (
          <div className="text-center py-12">
            <p className={`text-sm ${theme === 'dark' ? 'text-green-600' : 'text-green-500'}`}>
              {searchTerm ? 'Tidak ada hasil yang ditemukan' : 'Belum ada komentar'}
            </p>
          </div>
        ) : (
          filteredKomentar.map((komentar) => (
            <div
              key={komentar.id}
              className={`rounded-2xl p-5 transition-all ${
                theme === 'dark'
                  ? 'bg-gradient-to-br from-green-900/40 to-[#022c17]/60 border border-green-700/30'
                  : 'bg-white border border-green-200 shadow-sm'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    theme === 'dark' ? 'bg-green-700/30' : 'bg-green-100'
                  }`}>
                    <MessageSquare className={`w-5 h-5 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className={`font-semibold text-sm ${theme === 'dark' ? 'text-green-200' : 'text-green-900'}`}>
                        {komentar.nama || 'Anonim'}
                      </h3>
                      {komentar.whatsapp && (
                        <span className={`text-xs ${theme === 'dark' ? 'text-green-500' : 'text-green-600'}`}>
                          • {komentar.whatsapp}
                        </span>
                      )}
                      <span className={`text-xs ${theme === 'dark' ? 'text-green-500' : 'text-green-600'}`}>
                        • {new Date(komentar.createdAt).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>

                    <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-green-400' : 'text-green-700'}`}>
                      {komentar.isi}
                    </p>

                    <div className="flex items-center gap-4 mt-3">
                      <span className={`text-xs ${theme === 'dark' ? 'text-green-500' : 'text-green-600'}`}>
                        {komentar.suka} suka
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(komentar)}
                  className={`p-2 rounded-lg transition-colors ${theme === 'dark' ? 'hover:bg-red-900/20 text-red-400' : 'hover:bg-red-50 text-red-600'}`}
                  title="Hapus Komentar"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className={`flex items-center justify-center gap-2 pt-4 ${theme === 'dark' ? 'border-t border-green-800/20' : 'border-t border-green-200'}`}>
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className={`p-2 rounded-lg transition-all ${
              currentPage === 1
                ? 'opacity-50 cursor-not-allowed'
                : theme === 'dark'
                ? 'hover:bg-green-800/30 text-green-400'
                : 'hover:bg-green-100 text-green-600'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className={`text-sm font-medium px-3 py-2 rounded-lg ${theme === 'dark' ? 'bg-green-800/30 text-green-300' : 'bg-green-100 text-green-700'}`}>
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className={`p-2 rounded-lg transition-all ${
              currentPage === totalPages
                ? 'opacity-50 cursor-not-allowed'
                : theme === 'dark'
                ? 'hover:bg-green-800/30 text-green-400'
                : 'hover:bg-green-100 text-green-600'
            }`}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedKomentar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowDeleteModal(false)} />
          <div className={`relative w-full max-w-md rounded-2xl p-6 ${theme === 'dark' ? 'bg-gradient-to-br from-green-900/90 to-[#022c17] border border-green-700/30' : 'bg-white border border-green-200 shadow-xl'}`}>
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                <Trash2 className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
              <h2 className={`text-xl font-bold mb-2 ${theme === 'dark' ? 'text-green-100' : 'text-green-900'}`}>
                Hapus Komentar?
              </h2>
              <p className={`text-sm ${theme === 'dark' ? 'text-green-500' : 'text-green-600'}`}>
                Apakah Anda yakin ingin menghapus komentar ini? Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all ${
                  theme === 'dark'
                    ? 'bg-green-800/30 hover:bg-green-800/50 text-green-300'
                    : 'bg-green-100 hover:bg-green-200 text-green-700'
                }`}
              >
                Batal
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-3 rounded-xl font-medium transition-all bg-red-600 hover:bg-red-700 text-white"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
