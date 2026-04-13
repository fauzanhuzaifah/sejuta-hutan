'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import {
  Search,
  Edit,
  Trash2,
  Eye,
  Download,
  Loader2,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface Peserta {
  id: number;
  nama: string;
  whatsapp: string | null;
  email: string | null;
  usia: number | null;
  alamat: string | null;
  pekerjaan: string | null;
  jumlah_pohon: number | null;
  motivasi: string | null;
  komentar: string | null;
  timestamp: string;
}

export default function AdminPeserta() {
  const { theme } = useTheme();
  const [pesertaList, setPesertaList] = useState<Peserta[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedPeserta, setSelectedPeserta] = useState<Peserta | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [modalMode, setModalMode] = useState<'view' | 'edit'>('view');

  const [formData, setFormData] = useState({
    nama: '',
    whatsapp: '',
    email: '',
    usia: '',
    alamat: '',
    pekerjaan: '',
    jumlah_pohon: '',
    motivasi: '',
    komentar: ''
  });

  useEffect(() => {
    fetchPeserta();
  }, [currentPage]);

  const fetchPeserta = async () => {
    setLoading(true);
    try {
      const offset = (currentPage - 1) * itemsPerPage;
      const response = await fetch(`/api/peserta?limit=${itemsPerPage}&offset=${offset}`);
      const result = await response.json();
      if (response.ok) {
        setPesertaList(result.data || []);
        setTotalCount(result.pagination?.total || result.data?.length || 0);
      }
    } catch (error) {
      console.error('Error fetching peserta:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleView = (peserta: Peserta) => {
    setSelectedPeserta(peserta);
    setFormData({
      nama: peserta.nama,
      whatsapp: peserta.whatsapp || '',
      email: peserta.email || '',
      usia: peserta.usia?.toString() || '',
      alamat: peserta.alamat || '',
      pekerjaan: peserta.pekerjaan || '',
      jumlah_pohon: peserta.jumlah_pohon?.toString() || '',
      motivasi: peserta.motivasi || '',
      komentar: peserta.komentar || ''
    });
    setModalMode('view');
    setShowModal(true);
  };

  const handleEdit = (peserta: Peserta) => {
    setSelectedPeserta(peserta);
    setFormData({
      nama: peserta.nama,
      whatsapp: peserta.whatsapp || '',
      email: peserta.email || '',
      usia: peserta.usia?.toString() || '',
      alamat: peserta.alamat || '',
      pekerjaan: peserta.pekerjaan || '',
      jumlah_pohon: peserta.jumlah_pohon?.toString() || '',
      motivasi: peserta.motivasi || '',
      komentar: peserta.komentar || ''
    });
    setModalMode('edit');
    setShowModal(true);
  };

  const handleDelete = (peserta: Peserta) => {
    setSelectedPeserta(peserta);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedPeserta) return;

    try {
      const response = await fetch(`/api/admin/peserta/${selectedPeserta.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setShowDeleteModal(false);
        setSelectedPeserta(null);
        fetchPeserta();
      }
    } catch (error) {
      console.error('Error deleting peserta:', error);
    }
  };

  const handleSave = async () => {
    if (!selectedPeserta || modalMode !== 'edit') return;

    try {
      const response = await fetch(`/api/admin/peserta/${selectedPeserta.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          usia: formData.usia ? parseInt(formData.usia) : null,
          jumlah_pohon: formData.jumlah_pohon ? parseInt(formData.jumlah_pohon) : null,
        }),
      });

      if (response.ok) {
        setShowModal(false);
        setSelectedPeserta(null);
        fetchPeserta();
      }
    } catch (error) {
      console.error('Error saving peserta:', error);
    }
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Nama', 'WhatsApp', 'Email', 'Usia', 'Alamat', 'Pekerjaan', 'Jumlah Pohon', 'Motivasi', 'Tgl Daftar'];
    const csvContent = [
      headers.join(','),
      ...pesertaList.map((p) => [
        p.id,
        `"${p.nama}"`,
        `"${p.whatsapp || ''}"`,
        `"${p.email || ''}"`,
        p.usia || '',
        `"${p.alamat || ''}"`,
        `"${p.pekerjaan || ''}"`,
        p.jumlah_pohon || 0,
        `"${p.motivasi || ''}"`,
        new Date(p.timestamp).toLocaleString('id-ID')
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `peserta_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredPeserta = pesertaList.filter((peserta) =>
    peserta.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    peserta.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    peserta.whatsapp?.includes(searchTerm)
  );

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-green-100' : 'text-green-900'}`}>
            Kelola Peserta
          </h1>
          <p className={`mt-1 text-sm ${theme === 'dark' ? 'text-green-500' : 'text-green-600'}`}>
            Total {totalCount} peserta terdaftar
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            theme === 'dark'
              ? 'bg-green-600 hover:bg-green-500 text-white'
              : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${theme === 'dark' ? 'text-green-500' : 'text-green-400'}`} />
        <input
          type="text"
          placeholder="Cari berdasarkan nama, email, atau WhatsApp..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm transition-all ${
            theme === 'dark'
              ? 'bg-green-900/30 border-green-700/30 text-green-100 placeholder-green-600 focus:border-green-500'
              : 'bg-white border-green-200 text-green-900 placeholder-green-400 focus:border-green-500'
          }`}
        />
      </div>

      {/* Table */}
      <div className={`rounded-2xl border overflow-hidden ${theme === 'dark' ? 'bg-green-900/20 border-green-700/30' : 'bg-white border border-green-200'}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className={theme === 'dark' ? 'bg-green-900/40' : 'bg-green-50'}>
                <th className={`text-left px-5 py-3 text-xs font-bold tracking-wider uppercase ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>ID</th>
                <th className={`text-left px-5 py-3 text-xs font-bold tracking-wider uppercase ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>Nama</th>
                <th className={`text-left px-5 py-3 text-xs font-bold tracking-wider uppercase ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>Email</th>
                <th className={`text-left px-5 py-3 text-xs font-bold tracking-wider uppercase ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>WhatsApp</th>
                <th className={`text-left px-5 py-3 text-xs font-bold tracking-wider uppercase ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>Pekerjaan</th>
                <th className={`text-left px-5 py-3 text-xs font-bold tracking-wider uppercase ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>Pohon</th>
                <th className={`text-left px-5 py-3 text-xs font-bold tracking-wider uppercase ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>Tgl Daftar</th>
                <th className={`text-left px-5 py-3 text-xs font-bold tracking-wider uppercase ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center">
                    <Loader2 className="h-8 w-8 mx-auto mb-3 animate-spin text-green-500" />
                    <p className={theme === 'dark' ? 'text-green-600' : 'text-green-500'}>Memuat data...</p>
                  </td>
                </tr>
              ) : filteredPeserta.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center">
                    <p className={`text-sm ${theme === 'dark' ? 'text-green-600' : 'text-green-500'}`}>
                      {searchTerm ? 'Tidak ada hasil yang ditemukan' : 'Belum ada data peserta'}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredPeserta.map((peserta) => (
                  <tr
                    key={peserta.id}
                    className={`border-t ${theme === 'dark' ? 'border-green-800/20 hover:bg-green-900/20' : 'border-green-100 hover:bg-green-50'} transition-colors`}
                  >
                    <td className={`px-5 py-3 text-xs ${theme === 'dark' ? 'text-green-500' : 'text-green-500'}`}>#{peserta.id}</td>
                    <td className={`px-5 py-3 font-medium ${theme === 'dark' ? 'text-green-200' : 'text-green-900'}`}>{peserta.nama}</td>
                    <td className={`px-5 py-3 text-xs ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>{peserta.email || '-'}</td>
                    <td className={`px-5 py-3 text-xs ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>{peserta.whatsapp || '-'}</td>
                    <td className={`px-5 py-3 text-xs ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>{peserta.pekerjaan || '-'}</td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold ${theme === 'dark' ? 'bg-green-700/20 text-green-300' : 'bg-green-100 text-green-700'}`}>
                        {peserta.jumlah_pohon || 0}
                      </span>
                    </td>
                    <td className={`px-5 py-3 text-xs ${theme === 'dark' ? 'text-green-500' : 'text-green-500'}`}>
                      {new Date(peserta.timestamp).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleView(peserta)}
                          className={`p-2 rounded-lg transition-colors ${theme === 'dark' ? 'hover:bg-green-800/30 text-green-400' : 'hover:bg-green-100 text-green-600'}`}
                          title="Lihat Detail"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(peserta)}
                          className={`p-2 rounded-lg transition-colors ${theme === 'dark' ? 'hover:bg-green-800/30 text-green-400' : 'hover:bg-green-100 text-green-600'}`}
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(peserta)}
                          className={`p-2 rounded-lg transition-colors ${theme === 'dark' ? 'hover:bg-red-900/20 text-red-400' : 'hover:bg-red-50 text-red-600'}`}
                          title="Hapus"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className={`flex items-center justify-between px-5 py-4 border-t ${theme === 'dark' ? 'border-green-800/20' : 'border-green-200'}`}>
            <p className={`text-sm ${theme === 'dark' ? 'text-green-500' : 'text-green-600'}`}>
              Halaman {currentPage} dari {totalPages}
            </p>
            <div className="flex items-center gap-2">
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
                {currentPage}
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
          </div>
        )}
      </div>

      {/* View/Edit Modal */}
      {showModal && selectedPeserta && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowModal(false)} />
          <div className={`relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl p-6 ${theme === 'dark' ? 'bg-gradient-to-br from-green-900/90 to-[#022c17] border border-green-700/30' : 'bg-white border border-green-200 shadow-xl'}`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-green-100' : 'text-green-900'}`}>
                {modalMode === 'view' ? 'Detail Peserta' : 'Edit Peserta'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className={`p-2 rounded-lg transition-colors ${theme === 'dark' ? 'hover:bg-green-800/30 text-green-400' : 'hover:bg-green-100 text-green-600'}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-xs font-semibold mb-2 tracking-wider uppercase ${theme === 'dark' ? 'text-green-400' : 'text-green-700'}`}>Nama</label>
                  <input
                    type="text"
                    value={formData.nama}
                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                    disabled={modalMode === 'view'}
                    className={`w-full px-4 py-3 rounded-xl text-sm transition-all ${
                      theme === 'dark'
                        ? 'bg-green-800/30 border-green-700/30 text-green-100 focus:border-green-500 disabled:opacity-50'
                        : 'bg-white border-green-200 text-green-900 focus:border-green-500 disabled:opacity-50'
                    }`}
                  />
                </div>
                <div>
                  <label className={`block text-xs font-semibold mb-2 tracking-wider uppercase ${theme === 'dark' ? 'text-green-400' : 'text-green-700'}`}>Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled={modalMode === 'view'}
                    className={`w-full px-4 py-3 rounded-xl text-sm transition-all ${
                      theme === 'dark'
                        ? 'bg-green-800/30 border-green-700/30 text-green-100 focus:border-green-500 disabled:opacity-50'
                        : 'bg-white border-green-200 text-green-900 focus:border-green-500 disabled:opacity-50'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-xs font-semibold mb-2 tracking-wider uppercase ${theme === 'dark' ? 'text-green-400' : 'text-green-700'}`}>WhatsApp</label>
                  <input
                    type="text"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                    disabled={modalMode === 'view'}
                    className={`w-full px-4 py-3 rounded-xl text-sm transition-all ${
                      theme === 'dark'
                        ? 'bg-green-800/30 border-green-700/30 text-green-100 focus:border-green-500 disabled:opacity-50'
                        : 'bg-white border-green-200 text-green-900 focus:border-green-500 disabled:opacity-50'
                    }`}
                  />
                </div>
                <div>
                  <label className={`block text-xs font-semibold mb-2 tracking-wider uppercase ${theme === 'dark' ? 'text-green-400' : 'text-green-700'}`}>Usia</label>
                  <input
                    type="number"
                    value={formData.usia}
                    onChange={(e) => setFormData({ ...formData, usia: e.target.value })}
                    disabled={modalMode === 'view'}
                    className={`w-full px-4 py-3 rounded-xl text-sm transition-all ${
                      theme === 'dark'
                        ? 'bg-green-800/30 border-green-700/30 text-green-100 focus:border-green-500 disabled:opacity-50'
                        : 'bg-white border-green-200 text-green-900 focus:border-green-500 disabled:opacity-50'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-xs font-semibold mb-2 tracking-wider uppercase ${theme === 'dark' ? 'text-green-400' : 'text-green-700'}`}>Pekerjaan</label>
                  <select
                    value={formData.pekerjaan}
                    onChange={(e) => setFormData({ ...formData, pekerjaan: e.target.value })}
                    disabled={modalMode === 'view'}
                    className={`w-full px-4 py-3 rounded-xl text-sm transition-all ${
                      theme === 'dark'
                        ? 'bg-green-800/30 border-green-700/30 text-green-100 focus:border-green-500 disabled:opacity-50'
                        : 'bg-white border-green-200 text-green-900 focus:border-green-500 disabled:opacity-50'
                    }`}
                  >
                    <option value="">Pilih pekerjaan</option>
                    <option value="Pelajar / Mahasiswa">Pelajar / Mahasiswa</option>
                    <option value="PNS / ASN">PNS / ASN</option>
                    <option value="Swasta">Swasta</option>
                    <option value="Wiraswasta">Wiraswasta</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>
                <div>
                  <label className={`block text-xs font-semibold mb-2 tracking-wider uppercase ${theme === 'dark' ? 'text-green-400' : 'text-green-700'}`}>Jumlah Pohon</label>
                  <input
                    type="number"
                    value={formData.jumlah_pohon}
                    onChange={(e) => setFormData({ ...formData, jumlah_pohon: e.target.value })}
                    disabled={modalMode === 'view'}
                    className={`w-full px-4 py-3 rounded-xl text-sm transition-all ${
                      theme === 'dark'
                        ? 'bg-green-800/30 border-green-700/30 text-green-100 focus:border-green-500 disabled:opacity-50'
                        : 'bg-white border-green-200 text-green-900 focus:border-green-500 disabled:opacity-50'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-xs font-semibold mb-2 tracking-wider uppercase ${theme === 'dark' ? 'text-green-400' : 'text-green-700'}`}>Alamat</label>
                <input
                  type="text"
                  value={formData.alamat}
                  onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                  disabled={modalMode === 'view'}
                  className={`w-full px-4 py-3 rounded-xl text-sm transition-all ${
                    theme === 'dark'
                      ? 'bg-green-800/30 border-green-700/30 text-green-100 focus:border-green-500 disabled:opacity-50'
                      : 'bg-white border-green-200 text-green-900 focus:border-green-500 disabled:opacity-50'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-xs font-semibold mb-2 tracking-wider uppercase ${theme === 'dark' ? 'text-green-400' : 'text-green-700'}`}>Motivasi</label>
                <textarea
                  rows={3}
                  value={formData.motivasi}
                  onChange={(e) => setFormData({ ...formData, motivasi: e.target.value })}
                  disabled={modalMode === 'view'}
                  className={`w-full px-4 py-3 rounded-xl text-sm transition-all resize-none ${
                    theme === 'dark'
                      ? 'bg-green-800/30 border-green-700/30 text-green-100 focus:border-green-500 disabled:opacity-50'
                      : 'bg-white border-green-200 text-green-900 focus:border-green-500 disabled:opacity-50'
                  }`}
                />
              </div>

              {modalMode === 'edit' && (
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowModal(false)}
                    className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all ${
                      theme === 'dark'
                        ? 'bg-green-800/30 hover:bg-green-800/50 text-green-300'
                        : 'bg-green-100 hover:bg-green-200 text-green-700'
                    }`}
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleSave}
                    className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white`}
                  >
                    Simpan
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedPeserta && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowDeleteModal(false)} />
          <div className={`relative w-full max-w-md rounded-2xl p-6 ${theme === 'dark' ? 'bg-gradient-to-br from-green-900/90 to-[#022c17] border border-green-700/30' : 'bg-white border border-green-200 shadow-xl'}`}>
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                <Trash2 className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
              <h2 className={`text-xl font-bold mb-2 ${theme === 'dark' ? 'text-green-100' : 'text-green-900'}`}>
                Hapus Peserta?
              </h2>
              <p className={`text-sm ${theme === 'dark' ? 'text-green-500' : 'text-green-600'}`}>
                Apakah Anda yakin ingin menghapus data peserta <strong>{selectedPeserta.nama}</strong>? Tindakan ini tidak dapat dibatalkan.
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
