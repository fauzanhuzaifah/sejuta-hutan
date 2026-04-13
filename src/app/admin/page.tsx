'use client';

import { useState, useEffect } from 'react';
import { TreePine, Users, MessageCircle, Trash2, RefreshCw, Shield, LogOut, BarChart3, TrendingUp, Search, ChevronLeft, ChevronRight, Download, Target } from 'lucide-react';
import { useTheme } from 'next-themes';

interface Peserta {
  id: number;
  nama: string;
  email: string | null;
  whatsapp: string | null;
  alamat: string | null;
  usia: number | null;
  pekerjaan: string | null;
  jumlah_pohon: number | null;
  motivasi: string | null;
  timestamp: string;
}

interface Komentar {
  id: number;
  nama: string | null;
  whatsapp: string | null;
  isi: string;
  suka: number;
  createdAt: string;
}

export default function AdminDashboard() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // Stats
  const [totalPeserta, setTotalPeserta] = useState(0);
  const [totalPohon, setTotalPohon] = useState(0);
  const [totalKomentar, setTotalKomentar] = useState(0);
  const [avgPohon, setAvgPohon] = useState(0);

  // Data
  const [pesertaList, setPesertaList] = useState<Peserta[]>([]);
  const [komentarList, setKomentarList] = useState<Komentar[]>([]);
  const [activeTab, setActiveTab] = useState<'stats' | 'peserta' | 'komentar'>('stats');

  // Pagination
  const [pesertaPage, setPesertaPage] = useState(1);
  const [komentarPage, setKomentarPage] = useState(1);
  const itemsPerPage = 10;

  // Search
  const [searchTerm, setSearchTerm] = useState('');

  // Loading
  const [loading, setLoading] = useState(false);

  useEffect(() => setMounted(true), []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/peserta?limit=1');
      const result = await response.json();
      if (response.ok) {
        setTotalPeserta(result.pagination?.total || 0);
        setTotalPohon(result.totalTrees || 0);
        setAvgPohon(result.totalTrees && result.pagination?.total ? Math.round(result.totalTrees / result.pagination.total) : 0);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchKomentarStats = async () => {
    try {
      const response = await fetch('/api/komentar?limit=1');
      const result = await response.json();
      if (response.ok) {
        setTotalKomentar(result.pagination?.total || 0);
      }
    } catch (error) {
      console.error('Error fetching komentar stats:', error);
    }
  };

  const fetchPeserta = async () => {
    setLoading(true);
    try {
      const offset = (pesertaPage - 1) * itemsPerPage;
      const response = await fetch(`/api/peserta?limit=${itemsPerPage}&offset=${offset}`);
      const result = await response.json();
      if (response.ok) {
        setPesertaList(result.data || []);
        if (result.pagination) {
          setTotalPeserta(result.pagination.total);
          setTotalPohon(result.totalTrees || 0);
          setAvgPohon(result.totalTrees && result.pagination.total ? Math.round(result.totalTrees / result.pagination.total) : 0);
        }
      }
    } catch (error) {
      console.error('Error fetching peserta:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchKomentar = async () => {
    setLoading(true);
    try {
      const offset = (komentarPage - 1) * itemsPerPage;
      const response = await fetch(`/api/komentar?limit=${itemsPerPage}&offset=${offset}`);
      const result = await response.json();
      if (response.ok) {
        setKomentarList(result.data || []);
        if (result.pagination) {
          setTotalKomentar(result.pagination.total);
        }
      }
    } catch (error) {
      console.error('Error fetching komentar:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchStats();
      fetchKomentarStats();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated && activeTab === 'peserta') {
      fetchPeserta();
    }
  }, [isAuthenticated, activeTab, pesertaPage]);

  useEffect(() => {
    if (isAuthenticated && activeTab === 'komentar') {
      fetchKomentar();
    }
  }, [isAuthenticated, activeTab, komentarPage]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Password salah');
    }
  };

  const handleDeletePeserta = async (id: number) => {
    if (!confirm('Yakin ingin menghapus peserta ini?')) return;

    try {
      const response = await fetch(`/api/peserta/${id}`, { method: 'DELETE' });
      if (response.ok) {
        fetchPeserta();
        fetchStats();
      }
    } catch (error) {
      console.error('Error deleting peserta:', error);
    }
  };

  const handleDeleteKomentar = async (id: number) => {
    if (!confirm('Yakin ingin menghapus komentar ini?')) return;

    try {
      const response = await fetch(`/api/komentar/${id}`, { method: 'DELETE' });
      if (response.ok) {
        fetchKomentar();
        fetchKomentarStats();
      }
    } catch (error) {
      console.error('Error deleting komentar:', error);
    }
  };

  const handleExportData = async () => {
    try {
      const response = await fetch('/api/peserta?limit=10000');
      const result = await response.json();
      if (response.ok && result.data) {
        const csv = [
          ['ID', 'Nama', 'Email', 'WhatsApp', 'Alamat', 'Usia', 'Pekerjaan', 'Jumlah Pohon', 'Motivasi', 'Timestamp'].join(','),
          ...result.data.map((p: Peserta) => [
            p.id,
            `"${p.nama}"`,
            p.email || '',
            p.whatsapp || '',
            `"${p.alamat || ''}"`,
            p.usia || '',
            `"${p.pekerjaan || ''}"`,
            p.jumlah_pohon || 0,
            `"${(p.motivasi || '').replace(/"/g, '""')}"`,
            p.timestamp
          ].join(','))
        ].join('\n');

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `peserta_export_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error exporting data:', error);
    }
  };

  if (!mounted) return null;

  if (!isAuthenticated) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-[#052e16] text-[#e8f5e9]' : 'bg-gradient-to-br from-[#f0fdf4] to-[#dcfce7] text-[#14532d]'}`}>
        <div className={`max-w-md w-full mx-6 rounded-3xl p-8 shadow-2xl ${theme === 'dark' ? 'bg-[#022c17] border border-green-800/30' : 'bg-white border border-green-200'}`}>
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className={`text-xl font-bold ${theme === 'dark' ? 'text-green-100' : 'text-green-900'}`}>Admin Dashboard</h1>
              <p className={`text-xs ${theme === 'dark' ? 'text-green-500' : 'text-green-600'}`}>Lhokseumawe Green Initiative</p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className={`block text-xs font-semibold mb-2 uppercase tracking-wider ${theme === 'dark' ? 'text-green-400' : 'text-green-700'}`}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-4 py-3 rounded-xl text-sm transition-all ${theme === 'dark' ? 'bg-green-800/30 border-green-700/30 text-green-100 focus:border-green-500 focus:bg-green-800/50' : 'bg-white border border-green-200 text-green-900 focus:border-green-400 focus:ring-2 focus:ring-green-200'}`}
                placeholder="Masukkan password"
              />
            </div>

            {authError && (
              <div className={`flex items-center gap-2 p-3 rounded-xl text-sm ${theme === 'dark' ? 'bg-red-900/20 border border-red-800/30 text-red-400' : 'bg-red-50 border border-red-200 text-red-600'}`}>
                {authError}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 px-6 rounded-xl font-bold text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 transition-all hover:shadow-lg hover:shadow-green-500/25 flex items-center justify-center gap-2"
            >
              <Shield className="w-4 h-4" />
              <span>Masuk Dashboard</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  const filteredPeserta = pesertaList.filter(p =>
    p.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.alamat?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pesertaTotalPages = Math.ceil(totalPeserta / itemsPerPage);
  const komentarTotalPages = Math.ceil(totalKomentar / itemsPerPage);

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#052e16] text-[#e8f5e9]' : 'bg-[#f0fdf4] text-[#14532d]'}`}>
      {/* Header */}
      <header className={`sticky top-0 z-50 backdrop-blur-xl border-b ${theme === 'dark' ? 'bg-slate-900/80 border-slate-800' : 'bg-white/80 border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center">
              <TreePine className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className={`font-bold text-sm tracking-wide ${theme === 'dark' ? 'text-green-100' : 'text-green-800'}`}>ADMIN DASHBOARD</span>
              <span className={`block text-[10px] tracking-widest uppercase ${theme === 'dark' ? 'text-green-500' : 'text-green-500'}`}>Lhokseumawe</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className={`p-2 rounded-lg border transition-colors ${theme === 'dark' ? 'bg-slate-800/50 border-slate-700/30 text-green-300' : 'bg-green-100 border-green-200 text-green-800'}`}
            >
              {theme === 'dark' ? <RefreshCw className="w-4 h-4" /> : <RefreshCw className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setIsAuthenticated(false)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${theme === 'dark' ? 'bg-red-900/30 text-red-400 hover:bg-red-900/50' : 'bg-red-100 text-red-600 hover:bg-red-200'}`}
            >
              <LogOut className="w-4 h-4" />
              <span>Keluar</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className={`flex gap-2 mb-8 p-1 rounded-xl ${theme === 'dark' ? 'bg-green-900/30' : 'bg-green-100'}`}>
          {[
            { id: 'stats', label: 'Statistik', icon: BarChart3 },
            { id: 'peserta', label: 'Peserta', icon: Users },
            { id: 'komentar', label: 'Komentar', icon: MessageCircle }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-green-700 shadow-sm'
                  : `${theme === 'dark' ? 'text-green-400 hover:bg-green-800/50' : 'text-green-600 hover:bg-white/50'}`
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {activeTab === 'stats' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: Users, value: totalPeserta, label: 'Total Peserta', color: 'blue' },
                { icon: TreePine, value: totalPohon, label: 'Total Pohon', color: 'green' },
                { icon: TrendingUp, value: avgPohon, label: 'Rata-rata Pohon/Peserta', color: 'purple' },
                { icon: MessageCircle, value: totalKomentar, label: 'Total Komentar', color: 'amber' }
              ].map((stat, idx) => (
                <div key={idx} className={`rounded-2xl p-6 ${theme === 'dark' ? 'bg-gradient-to-br from-green-900/60 to-[#022c17] border border-green-700/30' : 'bg-white border border-green-200 shadow-sm'}`}>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${theme === 'dark' ? 'bg-green-700/30' : 'bg-green-100'}`}>
                    <stat.icon className={`w-6 h-6 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`} />
                  </div>
                  <p className={`text-3xl md:text-4xl font-extrabold ${theme === 'dark' ? 'text-green-200' : 'text-green-800'}`}>
                    {stat.value.toLocaleString('id-ID')}
                  </p>
                  <p className={`text-xs mt-2 font-medium ${theme === 'dark' ? 'text-green-500' : 'text-green-600'}`}>{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Progress towards target */}
            <div className={`rounded-3xl p-8 ${theme === 'dark' ? 'bg-gradient-to-br from-green-900/60 to-[#022c17] border border-green-700/30' : 'bg-white border border-green-200 shadow-sm'}`}>
              <h3 className={`text-xl font-bold mb-6 flex items-center gap-2 ${theme === 'dark' ? 'text-green-200' : 'text-green-900'}`}>
                <Target className="w-5 h-5" />
                <span>Progress Menuju Target 1.000.000 Pohon</span>
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className={`text-sm ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>Progress</span>
                  <span className={`text-2xl font-bold ${theme === 'dark' ? 'text-green-200' : 'text-green-800'}`}>
                    {((totalPohon / 1000000) * 100).toFixed(4)}%
                  </span>
                </div>
                <div className="w-full h-4 rounded-full overflow-hidden bg-gray-200 dark:bg-green-900/30">
                  <div
                    className="h-full bg-gradient-to-r from-green-500 to-emerald-400 transition-all duration-500"
                    style={{ width: `${Math.min((totalPohon / 1000000) * 100, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-sm">
                  <span className={theme === 'dark' ? 'text-green-400' : 'text-green-600'}>
                    {totalPohon.toLocaleString('id-ID')} pohon
                  </span>
                  <span className={theme === 'dark' ? 'text-green-500' : 'text-green-700'}>
                    dari 1.000.000 target
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className={`rounded-3xl p-6 ${theme === 'dark' ? 'bg-gradient-to-br from-green-900/60 to-[#022c17] border border-green-700/30' : 'bg-white border border-green-200 shadow-sm'}`}>
              <h3 className={`text-lg font-bold mb-4 ${theme === 'dark' ? 'text-green-200' : 'text-green-900'}`}>
                Aksi Cepat
              </h3>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleExportData}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${theme === 'dark' ? 'bg-green-700/30 text-green-300 hover:bg-green-700/50' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}
                >
                  <Download className="w-4 h-4" />
                  <span>Export Data CSV</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'peserta' && (
          <div className="space-y-6">
            <div className={`rounded-3xl p-6 ${theme === 'dark' ? 'bg-gradient-to-br from-green-900/60 to-[#022c17] border border-green-700/30' : 'bg-white border border-green-200 shadow-sm'}`}>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <h3 className={`text-lg font-bold ${theme === 'dark' ? 'text-green-200' : 'text-green-900'}`}>
                  Daftar Peserta ({totalPeserta.toLocaleString('id-ID')})
                </h3>
                <div className="flex gap-3">
                  <div className="relative">
                    <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${theme === 'dark' ? 'text-green-500' : 'text-green-400'}`} />
                    <input
                      type="text"
                      placeholder="Cari peserta..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className={`pl-10 pr-4 py-2 rounded-lg text-sm w-full md:w-64 ${theme === 'dark' ? 'bg-green-800/30 border-green-700/30 text-green-100 focus:border-green-500' : 'bg-white border border-green-200 text-green-900 focus:border-green-400'}`}
                    />
                  </div>
                  <button
                    onClick={fetchPeserta}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold ${theme === 'dark' ? 'bg-green-700/30 text-green-300 hover:bg-green-700/50' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Refresh</span>
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className={`border-b ${theme === 'dark' ? 'border-green-800' : 'border-green-200'}`}>
                      {['Nama', 'Email', 'WhatsApp', 'Alamat', 'Usia', 'Pekerjaan', 'Jumlah Pohon', 'Tanggal', 'Aksi'].map(header => (
                        <th key={header} className={`text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider ${theme === 'dark' ? 'text-green-400' : 'text-green-700'}`}>
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPeserta.map((peserta) => (
                      <tr key={peserta.id} className={`border-b ${theme === 'dark' ? 'border-green-800/50 hover:bg-green-900/20' : 'border-green-100 hover:bg-green-50'}`}>
                        <td className={`py-3 px-4 text-sm font-medium ${theme === 'dark' ? 'text-green-200' : 'text-green-900'}`}>{peserta.nama}</td>
                        <td className={`py-3 px-4 text-sm ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>{peserta.email || '-'}</td>
                        <td className={`py-3 px-4 text-sm ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>{peserta.whatsapp || '-'}</td>
                        <td className={`py-3 px-4 text-sm ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>{peserta.alamat || '-'}</td>
                        <td className={`py-3 px-4 text-sm ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>{peserta.usia || '-'}</td>
                        <td className={`py-3 px-4 text-sm ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>{peserta.pekerjaan || '-'}</td>
                        <td className={`py-3 px-4 text-sm font-bold ${theme === 'dark' ? 'text-green-300' : 'text-green-800'}`}>{peserta.jumlah_pohon || 0}</td>
                        <td className={`py-3 px-4 text-sm ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>
                          {new Date(peserta.timestamp).toLocaleDateString('id-ID')}
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => handleDeletePeserta(peserta.id)}
                            className={`p-2 rounded-lg transition-colors ${theme === 'dark' ? 'bg-red-900/30 text-red-400 hover:bg-red-900/50' : 'bg-red-100 text-red-600 hover:bg-red-200'}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pesertaTotalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <p className={`text-sm ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>
                    Halaman {pesertaPage} dari {pesertaTotalPages}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPesertaPage(p => Math.max(1, p - 1))}
                      disabled={pesertaPage === 1}
                      className={`p-2 rounded-lg ${pesertaPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-800/30'} ${theme === 'dark' ? 'bg-green-900/30 text-green-300' : 'bg-green-100 text-green-700'}`}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setPesertaPage(p => Math.min(pesertaTotalPages, p + 1))}
                      disabled={pesertaPage === pesertaTotalPages}
                      className={`p-2 rounded-lg ${pesertaPage === pesertaTotalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-800/30'} ${theme === 'dark' ? 'bg-green-900/30 text-green-300' : 'bg-green-100 text-green-700'}`}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'komentar' && (
          <div className="space-y-6">
            <div className={`rounded-3xl p-6 ${theme === 'dark' ? 'bg-gradient-to-br from-green-900/60 to-[#022c17] border border-green-700/30' : 'bg-white border border-green-200 shadow-sm'}`}>
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-lg font-bold ${theme === 'dark' ? 'text-green-200' : 'text-green-900'}`}>
                  Daftar Komentar ({totalKomentar.toLocaleString('id-ID')})
                </h3>
                <button
                  onClick={fetchKomentar}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold ${theme === 'dark' ? 'bg-green-700/30 text-green-300 hover:bg-green-700/50' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Refresh</span>
                </button>
              </div>

              <div className="space-y-4">
                {komentarList.map((komentar) => (
                  <div key={komentar.id} className={`rounded-xl p-4 ${theme === 'dark' ? 'bg-green-900/30 border border-green-800/30' : 'bg-green-50 border border-green-200'}`}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`font-semibold text-sm ${theme === 'dark' ? 'text-green-200' : 'text-green-900'}`}>
                            {komentar.nama || 'Anonim'}
                          </span>
                          {komentar.whatsapp && (
                            <span className={`text-xs px-2 py-1 rounded-full ${theme === 'dark' ? 'bg-green-800/50 text-green-400' : 'bg-green-200 text-green-700'}`}>
                              {komentar.whatsapp}
                            </span>
                          )}
                        </div>
                        <p className={`text-sm mb-2 ${theme === 'dark' ? 'text-green-300' : 'text-green-700'}`}>{komentar.isi}</p>
                        <div className="flex items-center gap-4 text-xs">
                          <span className={theme === 'dark' ? 'text-green-500' : 'text-green-600'}>
                            {new Date(komentar.createdAt).toLocaleString('id-ID')}
                          </span>
                          <span className={`flex items-center gap-1 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>
                            <MessageCircle className="w-3 h-3" />
                            {komentar.suka} suka
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteKomentar(komentar.id)}
                        className={`p-2 rounded-lg transition-colors flex-shrink-0 ${theme === 'dark' ? 'bg-red-900/30 text-red-400 hover:bg-red-900/50' : 'bg-red-100 text-red-600 hover:bg-red-200'}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {komentarTotalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <p className={`text-sm ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>
                    Halaman {komentarPage} dari {komentarTotalPages}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setKomentarPage(p => Math.max(1, p - 1))}
                      disabled={komentarPage === 1}
                      className={`p-2 rounded-lg ${komentarPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-800/30'} ${theme === 'dark' ? 'bg-green-900/30 text-green-300' : 'bg-green-100 text-green-700'}`}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setKomentarPage(p => Math.min(komentarTotalPages, p + 1))}
                      disabled={komentarPage === komentarTotalPages}
                      className={`p-2 rounded-lg ${komentarPage === komentarTotalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-800/30'} ${theme === 'dark' ? 'bg-green-900/30 text-green-300' : 'bg-green-100 text-green-700'}`}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
