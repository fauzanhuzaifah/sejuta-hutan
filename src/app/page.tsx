'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Leaf, TreePine, Flame, Heart, Users, Sprout, Globe, Shield, Sun, Wind, Droplets, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function LandingPage() {
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    telepon: '',
    alamat: '',
    jumlah_pohon: 1,
    pesan: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/peserta', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({
          nama: '',
          email: '',
          telepon: '',
          alamat: '',
          jumlah_pohon: 1,
          pesan: ''
        });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-emerald-100 flex flex-col">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-green-200 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TreePine className="h-8 w-8 text-green-600" />
              <span className="text-xl font-bold text-green-800">Satu Juta Pohon</span>
            </div>
            <Button variant="outline" className="border-green-600 text-green-700 hover:bg-green-50" asChild>
              <a href="#daftar">Daftar Sekarang</a>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-600/90 to-emerald-600/80" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920')] bg-cover bg-center opacity-30" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white">
            <div className="flex justify-center mb-6">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 animate-bounce">
                <Sprout className="h-12 w-12" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Program Menanam Sejuta Pohon
              <br />
              <span className="text-green-200">Kota Lhokseumawe</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-green-50 font-light">
              "Satu Tumbuhan, Sejuta Harapan untuk Masa Depan Bumi"
            </p>
            <p className="text-lg mb-8 text-green-100 max-w-2xl mx-auto">
              Bersama kita wujudkan Kota Lhokseumawe yang hijau, asri, dan berkelanjutan. Setiap pohon yang kita tanam adalah investasi untuk kehidupan anak cucu kita.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-green-700 hover:bg-green-50 text-lg px-8" asChild>
                <a href="#daftar">
                  Ikut Berpartisipasi
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 text-lg px-8" asChild>
                <a href="#tentang">
                  Pelajari Lebih Lanjut
                </a>
              </Button>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-green-50 to-transparent" />
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { icon: TreePine, label: 'Target Pohon', value: '1.000.000', color: 'text-green-600' },
              { icon: Users, label: 'Peserta', value: '500+', color: 'text-emerald-600' },
              { icon: Globe, label: 'Lokasi Penanaman', value: '20+', color: 'text-teal-600' },
              { icon: Heart, label: 'Dukungan', value: '100%', color: 'text-rose-600' },
            ].map((stat, idx) => (
              <Card key={idx} className="border-2 border-green-100 hover:border-green-300 transition-all hover:shadow-lg">
                <CardContent className="pt-6 text-center">
                  <stat.icon className={`h-8 w-8 mx-auto mb-2 ${stat.color}`} />
                  <div className="text-2xl md:text-3xl font-bold text-gray-800">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Tentang Program */}
      <section id="tentang" className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <Leaf className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Mengapa Program Menanam Pohon?
            </h2>
            <p className="text-lg text-gray-600">
              Sebuah gerakan nyata untuk menyelamatkan bumi dari krisis iklim yang mengancam keberlangsungan hidup umat manusia.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <Card className="border-2 border-orange-200 hover:shadow-xl transition-all">
              <CardHeader>
                <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                  <Flame className="h-8 w-8 text-orange-600" />
                </div>
                <CardTitle className="text-2xl text-orange-700">Dampak Perubahan Iklim</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">
                  Bumi sedang mengalami krisis iklim yang tidak pernah terjadi sebelumnya. Suhu global terus meningkat, es kutub mencair, dan cuaca ekstrem semakin sering terjadi.
                </p>
                <ul className="space-y-3">
                  {[
                    'Suhu bumi meningkat 1.1°C sejak era industri',
                    'Kenaikan permukaan air laut mengancam pesisir',
                    'Bencana alam: banjir, kekeringan, badai semakin sering',
                    'Kehilangan keanekaragaman hayati',
                    'Krisis pangan dan air bersih',
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <div className="bg-orange-100 rounded-full p-1 mt-0.5">
                        <Flame className="h-3 w-3 text-orange-600" />
                      </div>
                      <span className="text-gray-600">{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-orange-700 font-semibold mt-4">
                  Tanpa tindakan serius sekarang, dampaknya akan mengerikan bagi kehidupan umat manusia dan seluruh makhluk hidup di bumi.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-200 hover:shadow-xl transition-all">
              <CardHeader>
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                  <TreePine className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-2xl text-green-700">Solusi: Menanam Pohon</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">
                  Menanam pohon adalah salah satu solusi paling efektif dan terjangkau untuk melawan perubahan iklim. Setiap pohon yang kita tanam adalah pejuang lingkungan yang bekerja 24 jam sehari.
                </p>
                <ul className="space-y-3">
                  {[
                    'Menyerap CO2 dan menghasilkan oksigen',
                    'Mendinginkan suhu lingkungan',
                    'Mencegah erosi tanah',
                    'Menyimpan air dan menjaga siklus air',
                    'Menjadi habitat bagi satwa liar',
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <div className="bg-green-100 rounded-full p-1 mt-0.5">
                        <CheckCircle2 className="h-3 w-3 text-green-600" />
                      </div>
                      <span className="text-gray-600">{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-green-700 font-semibold mt-4">
                  Satu pohon dewasa dapat menyerap hingga 22 kg CO2 per tahun. Bayangkan dampaknya jika kita menanam sejuta pohon!
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Manfaat Jangka Panjang */}
      <section className="py-20 bg-gradient-to-b from-emerald-600 to-green-700 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <Globe className="h-16 w-16 text-green-200 mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Manfaat Jangka Panjang untuk Umat Manusia
            </h2>
            <p className="text-lg text-green-100">
              Investasi hari ini untuk warisan besok
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              {
                icon: Sun,
                title: 'Udara Bersih',
                description: 'Pohon menghasilkan oksigen yang kita hirup setiap detik. Kota yang banyak pohonnya memiliki kualitas udara yang jauh lebih baik.'
              },
              {
                icon: Shield,
                title: 'Perlindungan Bencana',
                description: 'Hutan dan pepohonan berfungsi sebagai benteng alami melawan banjir, tanah longsor, dan badai.'
              },
              {
                icon: Droplets,
                title: 'Ketersediaan Air',
                description: 'Pohon membantu menjaga siklus air, memastikan pasokan air bersih untuk generasi mendatang.'
              },
              {
                icon: Wind,
                title: 'Cuaca Nyaman',
                description: 'Kanopi pohon menurunkan suhu kota hingga 5-8°C, menciptakan lingkungan yang nyaman untuk ditinggali.'
              },
              {
                icon: Users,
                title: 'Kesehatan Masyarakat',
                description: 'Lingkungan hijau meningkatkan kesehatan fisik dan mental, mengurangi stres, dan mendorong aktivitas luar ruang.'
              },
              {
                icon: Heart,
                title: 'Warisan Anak Cucu',
                description: 'Setiap pohon yang kita tanam hari ini adalah hadiah berharga untuk generasi yang akan datang.'
              },
            ].map((benefit, idx) => (
              <Card key={idx} className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all">
                <CardHeader>
                  <div className="bg-white/20 w-14 h-14 rounded-full flex items-center justify-center mb-3">
                    <benefit.icon className="h-7 w-7 text-white" />
                  </div>
                  <CardTitle className="text-xl text-white">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-green-100">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Semboyan & Motivasi */}
      <section className="py-20 bg-gradient-to-b from-green-50 to-emerald-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-white rounded-3xl shadow-2xl p-12 border-4 border-green-200">
              <Sprout className="h-20 w-20 text-green-600 mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                Langkah Kecil, Dampak Besar
              </h2>
              <div className="space-y-6">
                <blockquote className="text-2xl md:text-3xl font-light text-green-700 italic">
                  "Satu pohon mungkin tampak kecil, tapi bersama sejuta pohon, kita bisa mengubah dunia."
                </blockquote>
                <div className="bg-green-50 rounded-2xl p-8">
                  <h3 className="text-2xl font-bold text-green-800 mb-4">Semboyan Kami</h3>
                  <p className="text-xl md:text-2xl font-semibold text-green-700">
                    "TANAM HARI INI, HIJAIKAN BESOK, SELAMATKAN MASA DEPAN"
                  </p>
                </div>
                <p className="text-lg text-gray-600">
                  Jangan menunggu tindakan besar. Mulai dari langkah kecil. Tanam satu pohon hari ini, dan jadilah bagian dari solusi untuk bumi yang lebih baik.
                  <br /><br />
                  <strong className="text-green-700">Bersama kita bisa, bersama kita kuat!</strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Form Pendaftaran */}
      <section id="daftar" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <TreePine className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                Bergabunglah Bersama Kami!
              </h2>
              <p className="text-lg text-gray-600">
                Isi formulir di bawah ini untuk mendaftar sebagai peserta program Menanam Sejuta Pohon Kota Lhokseumawe.
              </p>
            </div>

            <Card className="border-2 border-green-200 shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl text-green-800">Formulir Pendaftaran Peserta</CardTitle>
                <CardDescription>Data Anda akan disimpan dan digunakan untuk koordinasi kegiatan penanaman pohon.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="nama" className="text-green-700">Nama Lengkap *</Label>
                    <Input
                      id="nama"
                      placeholder="Masukkan nama lengkap Anda"
                      value={formData.nama}
                      onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                      required
                      className="border-green-200 focus:border-green-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-green-700">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="contoh@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="border-green-200 focus:border-green-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="telepon" className="text-green-700">Nomor Telepon/WA *</Label>
                    <Input
                      id="telepon"
                      type="tel"
                      placeholder="08xxxxxxxxxx"
                      value={formData.telepon}
                      onChange={(e) => setFormData({ ...formData, telepon: e.target.value })}
                      required
                      className="border-green-200 focus:border-green-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="alamat" className="text-green-700">Alamat Domisili *</Label>
                    <Textarea
                      id="alamat"
                      placeholder="Masukkan alamat lengkap domisili Anda"
                      value={formData.alamat}
                      onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                      required
                      className="border-green-200 focus:border-green-500 min-h-[100px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="jumlah_pohon" className="text-green-700">
                      Jumlah Pohon yang Ingin Ditanam: {formData.jumlah_pohon}
                    </Label>
                    <Input
                      id="jumlah_pohon"
                      type="range"
                      min="1"
                      max="100"
                      value={formData.jumlah_pohon}
                      onChange={(e) => setFormData({ ...formData, jumlah_pohon: parseInt(e.target.value) })}
                      className="accent-green-600"
                    />
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>1</span>
                      <span>100</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pesan" className="text-green-700">Pesan Tambahan (Opsional)</Label>
                    <Textarea
                      id="pesan"
                      placeholder="Berikan pesan atau motivasi Anda untuk berpartisipasi..."
                      value={formData.pesan}
                      onChange={(e) => setFormData({ ...formData, pesan: e.target.value })}
                      className="border-green-200 focus:border-green-500 min-h-[80px]"
                    />
                  </div>

                  {submitStatus === 'success' && (
                    <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 text-center">
                      <CheckCircle2 className="h-8 w-8 text-green-600 mx-auto mb-2" />
                      <p className="text-green-800 font-semibold">Terima kasih! Pendaftaran Anda berhasil.</p>
                      <p className="text-green-600 text-sm">Kami akan menghubungi Anda segera untuk informasi selanjutnya.</p>
                    </div>
                  )}

                  {submitStatus === 'error' && (
                    <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 text-center">
                      <p className="text-red-800 font-semibold">Maaf, terjadi kesalahan.</p>
                      <p className="text-red-600 text-sm">Silakan coba lagi atau hubungi admin.</p>
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-green-600 hover:bg-green-700 text-white text-lg py-6"
                  >
                    {isSubmitting ? 'Mengirim...' : 'Daftar Sekarang'}
                    {!isSubmitting && <ArrowRight className="ml-2 h-5 w-5" />}
                  </Button>

                  <p className="text-sm text-gray-500 text-center">
                    * Data Anda aman dan hanya akan digunakan untuk keperluan program ini.
                  </p>
                </form>
              </CardContent>
            </Card>

            <div className="mt-8 bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
              <h3 className="font-bold text-blue-800 mb-3 flex items-center gap-2">
                <Users className="h-5 w-5" />
                Bagaimana Data Peserta Diterima Admin?
              </h3>
              <ul className="space-y-2 text-blue-700 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>Data disimpan secara aman di database sistem</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>Admin dapat melihat semua data peserta melalui dashboard admin</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>Admin akan menghubungi peserta via WhatsApp/Email untuk jadwal penanaman</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>Peserta akan menerima konfirmasi dan update kegiatan secara berkala</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-auto">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <TreePine className="h-8 w-8 text-green-400" />
                <span className="text-xl font-bold">Satu Juta Pohon</span>
              </div>
              <p className="text-gray-400">
                Program menanam sejuta pohon untuk Kota Lhokseumawe yang lebih hijau dan berkelanjutan.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-green-400">Kontak</h4>
              <p className="text-gray-400 mb-2">📍 Kota Lhokseumawe, Aceh</p>
              <p className="text-gray-400 mb-2">📧 info@satujutapohon.id</p>
              <p className="text-gray-400">📞 +62 XXX XXXX XXXX</p>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-green-400">Semboyan</h4>
              <p className="text-lg italic text-green-300">
                "TANAM HARI INI, HIJAIKAN BESOK, SELAMATKAN MASA DEPAN"
              </p>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-500">
            <p>© 2025 Program Menanam Sejuta Pohon Kota Lhokseumawe. Bersama Wujudkan Bumi yang Lebih Hijau.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
