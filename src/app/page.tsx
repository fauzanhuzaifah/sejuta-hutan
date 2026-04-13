'use client';

import { useState, useEffect } from 'react';
import { TreePine, Users, Map, Wind, BarChart3, Award, UsersRound, BookOpen, Smile, ThermometerSun, Droplets, CloudHail, Fish, Waves, HeartCrack, Menu, X, Send, CheckCircle, AlertCircle, Loader2, Globe, Shield, Sun as SunIcon, Moon, Info, HeartHandshake, Search, ChevronLeft, ChevronRight, Filter, FileText, CheckCircle2, Sprout, ShieldCheck, Award as AwardIcon, Calendar, MapPin, MessageCircle, Heart, Clock } from 'lucide-react';
import { useTheme } from 'next-themes';
import { use } from 'react';

interface FormData {
  nama: string;
  whatsapp: string;
  usia: string;
  pekerjaan: string;
  alamat: string;
  jumlah_pohon: string;
  motivasi: string;
}

interface Peserta {
  id: number;
  nama: string;
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
  isi: string;
  suka: number;
  createdAt: string;
}

export default function LandingPage() {
  type Locale = 'id' | 'en';
  const [locale, setLocale] = useState<Locale>('id');

  const dict = {
    id: {
      nav: { about: 'Tentang', impact: 'Dampak', benefits: 'Manfaat', flow: 'Alur', joinNow: 'Daftar Sekarang' },
      hero: {
        activeProgram: 'Program Aktif 2026',
        title1: 'Menanam',
        title2: 'Sejuta Pohon',
        title3: 'Kota Lhokseumawe',
        desc: 'Gerakan bersama menyelamatkan bumi dari krisis iklim, satu pohon pada satu waktu. Mari wujudkan Lhokseumawe yang hijau dan berkelanjutan.',
        volunteer: 'Daftar Sebagai Relawan',
        learnMore: 'Pelajari Lebih Lanjut',
      },
      status: { success: 'Berhasil!', saved: 'Data berhasil disimpan.' },
      formErrors: {
        requiredName: 'Nama lengkap harus diisi',
        requiredWhatsapp: 'No. WhatsApp harus diisi',
        invalidWhatsapp: 'Format nomor WhatsApp tidak valid',
        requiredAge: 'Usia harus diisi',
        invalidAge: 'Usia harus antara 10-100 tahun',
        requiredJob: 'Pekerjaan harus dipilih',
        requiredAddress: 'Alamat harus diisi',
        requiredMotivation: 'Motivasi harus diisi',
        generalError: 'Terjadi kesalahan',
        connectionError: 'Terjadi kesalahan koneksi',
        submitSuccess: 'Pendaftaran berhasil!',
      },
      comments: {
        nameRequired: 'Nama harus diisi sesuai data pendaftaran',
        nameMin: 'Nama minimal 2 karakter',
        waRequired: 'Nomor WhatsApp harus diisi sesuai data pendaftaran',
        waInvalid: 'Format nomor WhatsApp tidak valid. Gunakan format: 08xxxxxxxxxx',
        contentRequired: 'Isi komentar harus diisi',
        contentMin: 'Isi komentar minimal 20 karakter',
        contentMax: 'Isi komentar maksimal 500 karakter',
        sent: 'Komentar berhasil dikirim!',
        genericError: 'Terjadi kesalahan',
        connectionError: 'Terjadi kesalahan koneksi',
        justNow: 'Baru saja',
        minAgo: 'menit lalu',
        hourAgo: 'jam lalu',
        dayAgo: 'hari lalu',
      },
      labels: {
        fullName: 'Nama Lengkap *',
        whatsapp: 'No. WhatsApp *',
        age: 'Usia *',
        job: 'Pekerjaan *',
        address: 'Alamat di Lhokseumawe *',
        targetTrees: 'Jumlah Pohon Target *',
        motivation: 'Motivasi Bergabung *',
        loadingData: 'Memuat data...',
        loadingComments: 'Memuat komentar...',
        noData: 'Belum ada data peserta',
        noSearch: 'Tidak ada hasil yang ditemukan',
        searchPlaceholder: 'Cari berdasarkan nama, pekerjaan, atau motivasi...',
        fullNamePlaceholder: 'Masukkan nama lengkap',
        agePlaceholder: 'Masukkan usia',
        addressPlaceholder: 'Masukkan alamat lengkap',
        motivationPlaceholder: 'Apa alasan Anda ingin menanam pohon?',
        sending: 'Mengirim...',
        registeredVolunteers: 'relawan terdaftar',
        totalTrees: 'Total Pohon',
        treesRegistered: 'pohon telah didaftarkan',
        participantDataTitle: 'Data',
        participantDataHighlight: 'Peserta',
        participantDataDesc: 'Daftar relawan yang telah bergabung dalam program menanam sejuta pohon.',
        noCol: 'No',
        nameCol: 'Nama',
        jobCol: 'Pekerjaan',
        treesCol: 'Pohon',
        motivationCol: 'Motivasi',
        dateCol: 'Tgl Daftar',
        participantDetail: 'Detail Peserta',
        treeUnit: 'Pohon',
        showingResults: 'Menampilkan',
        of: 'dari',
        participants: 'peserta',
        commentsTitle: '💬 Komentar & Dukungan',
        commentsDesc: 'Bagikan dukungan dan motivasi Anda untuk program ini',
        commentsCount: 'komentar',
        registeredOnlyTitle: 'Hanya untuk Peserta Terdaftar',
        registeredOnlyDesc: 'Masukkan nama dan nomor WhatsApp yang sesuai dengan data pendaftaran Anda untuk memverifikasi identitas.',
        commentNamePlaceholder: 'Sesuai data pendaftaran',
        commentWhatsapp: 'Nomor WhatsApp *',
        commentWhatsappPlaceholder: '08xxxxxxxxxx (sesuai data pendaftaran)',
        writeComment: 'Tulis Komentar *',
        writeCommentPlaceholder: 'Tulis komentar atau dukungan Anda (min. 20 karakter, max. 500 karakter)...',
        characters: 'karakter',
        sendComment: 'Kirim Komentar',
        noCommentYet: 'Belum ada komentar. Jadilah yang pertama berkomentar!',
        anonymous: 'Anonim',
        likes: 'suka',
        showingLatest10: 'Menampilkan 10 dari',
        latestComments: 'komentar terbaru',
        aboutProgramTag: 'Tentang Program',
        aboutTitlePrefix: 'Apa Itu Gerakan',
        aboutTitleHighlight: 'Sejuta Pohon',
        aboutP1: 'Gerakan Menanam Sejuta Pohon adalah program lingkungan yang diinisiasi untuk menghijaukan kembali Kota Lhokseumawe, Aceh. Melalui kolaborasi pemerintah, masyarakat, komunitas, dan sektor swasta, program ini bertujuan menanam satu juta pohon dalam beberapa tahun ke depan.',
        aboutP2: 'Program ini tidak hanya tentang menanam — tetapi tentang membangun kesadaran lingkungan generasi muda dan berkontribusi nyata dalam mengurangi emisi karbon.',
        aboutP3: 'Setiap pohon yang ditanam adalah investasi untuk masa depan anak-anak kita. Dari pohon bayangan jalan hingga hutan kota, setiap kontribusi yang Anda buat sangat berarti.',
        whyImportant: 'Mengapa Ini Penting',
        climateImpactPrefix: 'Dampak Perubahan',
        climateImpactHighlight: 'Iklim',
        climateImpactDesc: 'Lhokseumawe menghadapi tantangan iklim yang nyata. Tanpa aksi, dampaknya akan semakin parah bagi kehidupan masyarakat.',
        tangibleBenefits: 'Manfaat Nyata',
        whatYouGetPrefix: 'Apa yang Anda',
        whatYouGetHighlight: 'Dapatkan',
        benefitsDesc: 'Bergabung sebagai relawan bukan hanya memberi — Anda juga mendapatkan manfaat nyata untuk diri sendiri dan lingkungan.',
        easySteps: 'Langkah Mudah',
        joinFlowPrefix: 'Alur',
        joinFlowHighlight: 'Bergabung',
        joinFlowDesc: 'Ikuti langkah-langkah sederhana berikut untuk menjadi bagian dari gerakan menanam sejuta pohon.',
        guidedTitle: 'Dibimbing Tim Profesional',
        guidedDesc: 'Setiap tahap akan didampingi oleh tim ahli',
        joinTag: 'Bergabunglah',
        bePartPrefix: 'Jadilah Bagian dari',
        bePartHighlight: 'Perubahan',
        registrationProgress: 'Progress Pendaftaran',
        contact: 'Kontak',
        motto: 'Semboyan',
        mottoText: '"TANAM HARI INI, HIJAIKAN BESOK, SELAMATKAN MASA DEPAN"',
        footerDesc: 'Program penanaman satu juta pohon untuk menyelamatkan iklim dan masa depan Kota Lhokseumawe, Aceh.',
        footerCopyright: '© 2025 Program Menanam Sejuta Pohon Kota Lhokseumawe. Bersama Wujudkan Bumi yang Lebih Hijau.',
      },
    },
    en: {
      nav: { about: 'About', impact: 'Impact', benefits: 'Benefits', flow: 'Flow', joinNow: 'Join Now' },
      hero: {
        activeProgram: 'Active Program 2026',
        title1: 'Planting',
        title2: 'One Million Trees',
        title3: 'Lhokseumawe City',
        desc: 'A collective movement to save the planet from the climate crisis, one tree at a time. Let us build a greener and more sustainable Lhokseumawe.',
        volunteer: 'Register as Volunteer',
        learnMore: 'Learn More',
      },
      status: { success: 'Success!', saved: 'Data saved successfully.' },
      formErrors: {
        requiredName: 'Full name is required',
        requiredWhatsapp: 'WhatsApp number is required',
        invalidWhatsapp: 'Invalid WhatsApp number format',
        requiredAge: 'Age is required',
        invalidAge: 'Age must be between 10-100 years',
        requiredJob: 'Occupation is required',
        requiredAddress: 'Address is required',
        requiredMotivation: 'Motivation is required',
        generalError: 'Something went wrong',
        connectionError: 'Connection error occurred',
        submitSuccess: 'Registration successful!',
      },
      comments: {
        nameRequired: 'Name must match registration data',
        nameMin: 'Name must be at least 2 characters',
        waRequired: 'WhatsApp number must match registration data',
        waInvalid: 'Invalid WhatsApp format. Use: 08xxxxxxxxxx',
        contentRequired: 'Comment content is required',
        contentMin: 'Comment must be at least 20 characters',
        contentMax: 'Comment must be at most 500 characters',
        sent: 'Comment sent successfully!',
        genericError: 'Something went wrong',
        connectionError: 'Connection error occurred',
        justNow: 'Just now',
        minAgo: 'minutes ago',
        hourAgo: 'hours ago',
        dayAgo: 'days ago',
      },
      labels: {
        fullName: 'Full Name *',
        whatsapp: 'WhatsApp Number *',
        age: 'Age *',
        job: 'Occupation *',
        address: 'Address in Lhokseumawe *',
        targetTrees: 'Target Number of Trees *',
        motivation: 'Motivation *',
        loadingData: 'Loading data...',
        loadingComments: 'Loading comments...',
        noData: 'No participant data yet',
        noSearch: 'No matching results found',
        searchPlaceholder: 'Search by name, occupation, or motivation...',
        fullNamePlaceholder: 'Enter full name',
        agePlaceholder: 'Enter age',
        addressPlaceholder: 'Enter full address',
        motivationPlaceholder: 'Why do you want to plant trees?',
        sending: 'Sending...',
        registeredVolunteers: 'registered volunteers',
        totalTrees: 'Total Trees',
        treesRegistered: 'trees registered',
        participantDataTitle: 'Participant',
        participantDataHighlight: 'Data',
        participantDataDesc: 'List of volunteers who have joined the one million tree planting program.',
        noCol: 'No',
        nameCol: 'Name',
        jobCol: 'Occupation',
        treesCol: 'Trees',
        motivationCol: 'Motivation',
        dateCol: 'Registered Date',
        participantDetail: 'Participant Detail',
        treeUnit: 'Trees',
        showingResults: 'Showing',
        of: 'of',
        participants: 'participants',
        commentsTitle: '💬 Comments & Support',
        commentsDesc: 'Share your support and motivation for this program',
        commentsCount: 'comments',
        registeredOnlyTitle: 'For Registered Participants Only',
        registeredOnlyDesc: 'Enter your name and WhatsApp number that match your registration data to verify your identity.',
        commentNamePlaceholder: 'Must match registration data',
        commentWhatsapp: 'WhatsApp Number *',
        commentWhatsappPlaceholder: '08xxxxxxxxxx (must match registration data)',
        writeComment: 'Write a Comment *',
        writeCommentPlaceholder: 'Write your comment or support (min. 20 characters, max. 500 characters)...',
        characters: 'characters',
        sendComment: 'Send Comment',
        noCommentYet: 'No comments yet. Be the first to comment!',
        anonymous: 'Anonymous',
        likes: 'likes',
        showingLatest10: 'Showing 10 of',
        latestComments: 'latest comments',
        aboutProgramTag: 'About Program',
        aboutTitlePrefix: 'What Is the',
        aboutTitleHighlight: 'One Million Trees',
        aboutP1: 'The One Million Trees movement is an environmental program initiated to re-green Lhokseumawe City, Aceh. Through collaboration among government, communities, and private sectors, this program aims to plant one million trees in the coming years.',
        aboutP2: 'This program is not only about planting trees, but also about building environmental awareness among younger generations and making real contributions to reducing carbon emissions.',
        aboutP3: 'Every tree planted is an investment for our children future. From roadside shade trees to urban forests, every contribution you make is meaningful.',
        whyImportant: 'Why This Matters',
        climateImpactPrefix: 'Climate Change',
        climateImpactHighlight: 'Impact',
        climateImpactDesc: 'Lhokseumawe faces real climate challenges. Without action, the impacts will worsen for community life.',
        tangibleBenefits: 'Real Benefits',
        whatYouGetPrefix: 'What You',
        whatYouGetHighlight: 'Get',
        benefitsDesc: 'Joining as a volunteer is not only about giving — you also gain real benefits for yourself and the environment.',
        easySteps: 'Easy Steps',
        joinFlowPrefix: 'Joining',
        joinFlowHighlight: 'Flow',
        joinFlowDesc: 'Follow these simple steps to become part of the one million trees movement.',
        guidedTitle: 'Guided by Professionals',
        guidedDesc: 'Each stage will be assisted by an expert team',
        joinTag: 'Join Us',
        bePartPrefix: 'Be Part of',
        bePartHighlight: 'Change',
        registrationProgress: 'Registration Progress',
        contact: 'Contact',
        motto: 'Motto',
        mottoText: '"PLANT TODAY, GREEN TOMORROW, SAVE THE FUTURE"',
        footerDesc: 'A one million tree planting program to protect climate and the future of Lhokseumawe City, Aceh.',
        footerCopyright: '© 2025 One Million Trees Program of Lhokseumawe City. Together for a Greener Earth.',
      },
    },
  } as const;
  const t = dict[locale];

  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    nama: '',
    whatsapp: '',
    usia: '',
    pekerjaan: '',
    alamat: '',
    jumlah_pohon: '1',
    motivasi: ''
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [successMessage, setSuccessMessage] = useState('');
  const [pesertaList, setPesertaList] = useState<Peserta[]>([]);
  const [isLoadingPeserta, setIsLoadingPeserta] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [totalTreesCount, setTotalTreesCount] = useState(0);
  const [hoveredPeserta, setHoveredPeserta] = useState<Peserta | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  // State untuk komentar
  const [komentarList, setKomentarList] = useState<Komentar[]>([]);
  const [isLoadingKomentar, setIsLoadingKomentar] = useState(false);
  const [komentarForm, setKomentarForm] = useState({ nama: '', whatsapp: '', isi: '' });
  const [isSubmittingKomentar, setIsSubmittingKomentar] = useState(false);
  const [komentarError, setKomentarError] = useState('');
  const [komentarSuccess, setKomentarSuccess] = useState('');
  const [komentarTotalCount, setKomentarTotalCount] = useState(0);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    fetchPeserta();
    fetchKomentar();
  }, []);

  const fetchPeserta = async () => {
    setIsLoadingPeserta(true);
    try {
      const response = await fetch('/api/peserta?limit=100');
      const result = await response.json();
      if (response.ok) {
        const data = result.data || [];
        setPesertaList(data);
        // Update total count dari pagination
        if (result.pagination && result.pagination.total !== undefined) {
          setTotalCount(result.pagination.total);
        } else {
          // Fallback jika pagination tidak tersedia
          setTotalCount(data.length);
        }
        // Gunakan totalTrees dari API response (hitung dari semua peserta di database)
        if (result.totalTrees !== undefined) {
          setTotalTreesCount(result.totalTrees);
        } else {
          // Fallback: hitung dari data yang diambil
          const treesSum = data.reduce((sum: number, p: Peserta) => sum + (p.jumlah_pohon || 0), 0);
          setTotalTreesCount(treesSum);
        }
      }
    } catch (error) {
      console.error('Error fetching peserta:', error);
    } finally {
      setIsLoadingPeserta(false);
    }
  };

  const fetchKomentar = async () => {
    setIsLoadingKomentar(true);
    try {
      const response = await fetch('/api/komentar?limit=10');
      const result = await response.json();
      if (response.ok) {
        const data = result.data || [];
        setKomentarList(data);
        if (result.pagination && result.pagination.total !== undefined) {
          setKomentarTotalCount(result.pagination.total);
        } else {
          setKomentarTotalCount(data.length);
        }
      }
    } catch (error) {
      console.error('Error fetching komentar:', error);
    } finally {
      setIsLoadingKomentar(false);
    }
  };

  const handleKomentarSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setKomentarError('');
    setKomentarSuccess('');

    // Validasi nama
    if (!komentarForm.nama.trim()) {
      setKomentarError(t.comments.nameRequired);
      return;
    }

    if (komentarForm.nama.trim().length < 2) {
      setKomentarError(t.comments.nameMin);
      return;
    }

    // Validasi whatsapp
    const whatsappRegex = /^(\+62|62|0)8[1-9][0-9]{6,11}$/;
    if (!komentarForm.whatsapp.trim()) {
      setKomentarError(t.comments.waRequired);
      return;
    }

    if (!whatsappRegex.test(komentarForm.whatsapp.trim())) {
      setKomentarError(t.comments.waInvalid);
      return;
    }

    // Validasi isi komentar
    if (!komentarForm.isi.trim()) {
      setKomentarError(t.comments.contentRequired);
      return;
    }

    if (komentarForm.isi.trim().length < 20) {
      setKomentarError(t.comments.contentMin);
      return;
    }

    if (komentarForm.isi.trim().length > 500) {
      setKomentarError(t.comments.contentMax);
      return;
    }

    setIsSubmittingKomentar(true);

    try {
      const response = await fetch('/api/komentar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nama: komentarForm.nama.trim(),
          whatsapp: komentarForm.whatsapp.trim(),
          isi: komentarForm.isi.trim()
        })
      });

      const result = await response.json();

      if (response.ok) {
        setKomentarSuccess(t.comments.sent);
        setKomentarForm({ nama: '', whatsapp: '', isi: '' });
        fetchKomentar();
        setTimeout(() => setKomentarSuccess(''), 3000);
      } else {
        setKomentarError(result.message || t.comments.genericError);
      }
    } catch (error) {
      setKomentarError(t.comments.connectionError);
    } finally {
      setIsSubmittingKomentar(false);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return t.comments.justNow;
    if (diffMins < 60) return `${diffMins} ${t.comments.minAgo}`;
    if (diffHours < 24) return `${diffHours} ${t.comments.hourAgo}`;
    if (diffDays < 7) return `${diffDays} ${t.comments.dayAgo}`;
    return date.toLocaleDateString(locale === 'id' ? 'id-ID' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  // Filter dan pagination logic
  const filteredPeserta = pesertaList.filter(peserta =>
    peserta.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    peserta.pekerjaan?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    peserta.motivasi?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredPeserta.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedPeserta = filteredPeserta.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset ke halaman 1 saat search berubah
  };

  const handleMouseEnter = (peserta: Peserta, e: React.MouseEvent) => {
    setHoveredPeserta(peserta);
    setTooltipPosition({
      x: e.clientX + 15,
      y: e.clientY + 15
    });
  };

  const handleMouseLeave = () => {
    setHoveredPeserta(null);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    setTooltipPosition({
      x: e.clientX + 15,
      y: e.clientY + 15
    });
  };



  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!formData.nama.trim()) {
      newErrors.nama = t.formErrors.requiredName;
    }

    if (!formData.whatsapp.trim()) {
      newErrors.whatsapp = t.formErrors.requiredWhatsapp;
    } else if (!/^(\+62|62|0)8[1-9][0-9]{6,11}$/.test(formData.whatsapp.replace(/[\s-]/g, ''))) {
      newErrors.whatsapp = t.formErrors.invalidWhatsapp;
    }

    if (!formData.usia) {
      newErrors.usia = t.formErrors.requiredAge;
    } else if (parseInt(formData.usia) < 10 || parseInt(formData.usia) > 100) {
      newErrors.usia = t.formErrors.invalidAge;
    }

    if (!formData.pekerjaan) {
      newErrors.pekerjaan = t.formErrors.requiredJob;
    }

    if (!formData.alamat.trim()) {
      newErrors.alamat = t.formErrors.requiredAddress;
    }

    if (!formData.motivasi.trim()) {
      newErrors.motivasi = t.formErrors.requiredMotivation;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/peserta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nama: formData.nama,
          email: `${formData.nama.toLowerCase().replace(/\s/g, '')}@temp.temp`, // Temporary email for validation
          telepon: formData.whatsapp,
          usia: parseInt(formData.usia),
          pekerjaan: formData.pekerjaan,
          alamat: formData.alamat,
          jumlah_pohon: parseInt(formData.jumlah_pohon),
          pesan: formData.motivasi
        })
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitStatus('success');
        setSuccessMessage(result.message || t.formErrors.submitSuccess);
        setFormData({
          nama: '',
          whatsapp: '',
          usia: '',
          pekerjaan: '',
          alamat: '',
          jumlah_pohon: '1',
          motivasi: ''
        });
        setErrors({});
        setShowToast(true);
        setTimeout(() => setShowToast(false), 5000);
        fetchPeserta();
      } else {
        setSubmitStatus('error');
        setErrors({ general: result.message || t.formErrors.generalError });
      }
    } catch (error) {
      setSubmitStatus('error');
      setErrors({ general: t.formErrors.connectionError });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  if (!mounted) return null;

  // Gunakan state untuk total trees yang sudah dihitung
  const totalTrees = totalTreesCount;
  // Gunakan totalCount untuk progress, fallback ke pesertaList.length
  const displayCount = totalCount > 0 ? totalCount : pesertaList.length;
  const progressPercent = Math.min((displayCount / 10000) * 100, 100);

  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-[#052e16] text-[#e8f5e9]' : 'bg-[#f0fdf4] text-[#14532d]'}`}>
      {/* Leaves Container (particles) */}
      <div id="leaves-container" className="fixed inset-0 pointer-events-none overflow-hidden z-0" />

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-6 right-6 z-50 animate-in slide-in-from-right">
          <div className={`flex items-center gap-3 rounded-xl px-5 py-4 shadow-2xl max-w-sm ${theme === 'dark' ? 'bg-[#022c17] border border-[#166534]' : 'bg-white border border-green-200'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${theme === 'dark' ? 'bg-[#166534]/30' : 'bg-green-100'}`}>
              <CheckCircle className={`w-5 h-5 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`} />
            </div>
            <div className="min-w-0">
              <p className={`font-semibold text-sm ${theme === 'dark' ? 'text-green-200' : 'text-green-800'}`}>{t.status.success}</p>
              <p className={`text-xs truncate ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>{t.status.saved}</p>
            </div>
            <button onClick={() => setShowToast(false)} className={`flex-shrink-0 ${theme === 'dark' ? 'text-green-500' : 'text-green-400'}`}>
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-xl transition-all duration-300 ${theme === 'dark' ? 'bg-slate-900/80 border-b border-slate-800' : 'bg-white/80 border-b border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center group-hover:scale-105 transition-transform">
              <TreePine className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className={`font-bold text-sm tracking-wide ${theme === 'dark' ? 'text-green-100' : 'text-green-800'}`}>SEJUTA POHON</span>
              <span className={`block text-[10px] tracking-widest uppercase ${theme === 'dark' ? 'text-green-500' : 'text-green-500'}`}>Lhokseumawe</span>
            </div>
          </a>

          <div className="hidden md:flex items-center gap-5">
            <a href="#tentang" className={`text-sm hover:transition-colors ${theme === 'dark' ? 'text-green-400 hover:text-green-200' : 'text-green-600 hover:text-green-800'}`}>{t.nav.about}</a>
            <a href="#dampak" className={`text-sm hover:transition-colors ${theme === 'dark' ? 'text-green-400 hover:text-green-200' : 'text-green-600 hover:text-green-800'}`}>{t.nav.impact}</a>
            <a href="#manfaat" className={`text-sm hover:transition-colors ${theme === 'dark' ? 'text-green-400 hover:text-green-200' : 'text-green-600 hover:text-green-800'}`}>{t.nav.benefits}</a>
            <a href="#alur" className={`text-sm hover:transition-colors ${theme === 'dark' ? 'text-green-400 hover:text-green-200' : 'text-green-600 hover:text-green-800'}`}>{t.nav.flow}</a>
            <a href="#data" className={`px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 transition-all`}>{t.nav.joinNow}</a>
            <button
              onClick={() => setLocale(locale === 'id' ? 'en' : 'id')}
              className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-colors ${theme === 'dark' ? 'bg-slate-800/50 hover:bg-slate-700/50 border-slate-700/30 text-green-300' : 'bg-green-100 hover:bg-green-200 border-green-200 text-green-800'}`}
            >
              {locale === 'id' ? 'EN' : 'ID'}
            </button>
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border transition-colors ${theme === 'dark' ? 'bg-slate-800/50 hover:bg-slate-700/50 border-slate-700/30 text-green-300' : 'bg-green-100 hover:bg-green-200 border-green-200 text-green-800'}`}
            >
              {theme === 'dark' ? <SunIcon className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>

          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className={`md:hidden ${theme === 'dark' ? 'text-green-300' : 'text-green-700'}`}>
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className={`md:hidden px-6 pb-4 border-t ${theme === 'dark' ? 'border-slate-800' : 'border-gray-200'}`}>
            <div className="flex flex-col gap-3 pt-4">
              <a href="#tentang" onClick={() => setMobileMenuOpen(false)} className={`text-sm py-2 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>{t.nav.about}</a>
              <a href="#dampak" onClick={() => setMobileMenuOpen(false)} className={`text-sm py-2 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>{t.nav.impact}</a>
              <a href="#manfaat" onClick={() => setMobileMenuOpen(false)} className={`text-sm py-2 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>{t.nav.benefits}</a>
              <a href="#alur" onClick={() => setMobileMenuOpen(false)} className={`text-sm py-2 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>{t.nav.flow}</a>
              <a href="#data" onClick={() => setMobileMenuOpen(false)} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-green-600 to-green-700 text-center">{t.nav.joinNow}</a>
              <button
                onClick={() => setLocale(locale === 'id' ? 'en' : 'id')}
                className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-colors ${theme === 'dark' ? 'bg-slate-800/50 hover:bg-slate-700/50 border-slate-700/30 text-green-300' : 'bg-green-100 hover:bg-green-200 border-green-200 text-green-800'}`}
              >
                {locale === 'id' ? 'Switch to English' : 'Ganti ke Indonesia'}
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className={`relative min-h-screen flex items-center justify-center overflow-hidden ${theme === 'dark' ? 'bg-gradient-to-br from-[#052e16] via-[#14532d] to-[#064e3b]' : 'bg-gradient-to-br from-[#f0fdf4] via-[#dcfce7] to-[#bbf7d0]'}`}>
        <div className="absolute inset-0 opacity-30" style={{
          background: 'radial-gradient(ellipse 80% 60% at 30% 40%, rgba(34, 197, 94, 0.15) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 70% 60%, rgba(16, 185, 129, 0.1) 0%, transparent 50%)'
        }} />

        <div className="max-w-5xl mx-auto px-6 text-center relative z-10 pt-28 pb-32">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 backdrop-blur-sm ${theme === 'dark' ? 'bg-green-800/40 border border-green-600/20' : 'bg-green-200/40 border border-green-400/20'}`}>
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className={`text-xs font-semibold tracking-wider uppercase ${theme === 'dark' ? 'text-green-300' : 'text-green-800'}`}>{t.hero.activeProgram}</span>
          </div>

          <h1 className={`text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-[0.9] mb-6 ${theme === 'dark' ? 'text-green-100' : 'text-green-900'}`}>
            <span className="block">{t.hero.title1}</span>
            <span className={`block italic text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-emerald-300 to-green-400 ${theme === 'dark' ? 'drop-shadow-[0_0_40px_rgba(34,197,94,0.5)]' : ''}`}>{t.hero.title2}</span>
            <span className={`block text-3xl md:text-4xl lg:text-5xl font-light mt-2 tracking-wide ${theme === 'dark' ? 'text-green-300' : 'text-green-700'}`}>{t.hero.title3}</span>
          </h1>

          <p className={`text-base md:text-lg max-w-2xl mx-auto mb-10 leading-relaxed ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>
            {t.hero.desc}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="#data" className="px-8 py-4 rounded-2xl font-bold text-white text-base flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-green-500/25">
              <HeartHandshake className="w-5 h-5" />
              <span>{t.hero.volunteer}</span>
            </a>
            <a href="#tentang" className={`px-8 py-4 rounded-2xl font-semibold text-base flex items-center gap-2 border transition-all hover:-translate-y-0.5 ${theme === 'dark' ? 'border-green-600/30 text-green-300 hover:bg-green-800/30' : 'border-green-300 text-green-700 hover:bg-green-50'}`}>
              <Info className="w-5 h-5" />
              <span>{t.hero.learnMore}</span>
            </a>
          </div>
        </div>

        <div className={`absolute bottom-0 left-0 right-0 h-32 ${theme === 'dark' ? 'bg-gradient-to-t from-[#052e16] to-transparent' : 'bg-gradient-to-t from-[#f0fdf4] to-transparent'}`} />
      </section>

      {/* Stats Section */}
      <section className={`relative py-16 ${theme === 'dark' ? 'bg-[#022c17]' : 'bg-green-50/50'}`}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              { icon: TreePine, target: '1000000', label: locale === 'id' ? 'Target Pohon' : 'Tree Target' },
              { icon: Users, target: '10000', label: locale === 'id' ? 'Target Relawan' : 'Volunteer Target' },
              { icon: Map, target: '9', label: locale === 'id' ? 'Kecamatan' : 'Districts' },
              { icon: Wind, target: '2500t', label: locale === 'id' ? 'CO₂ Diserap/Tahun' : 'CO₂ Absorbed/Year' }
            ].map((stat, idx) => (
              <div key={idx} className={`rounded-2xl p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:border-opacity-50 ${theme === 'dark' ? 'bg-gradient-to-br from-green-900/50 to-[#022c17]/80 border border-green-700/20 hover:border-green-500/30' : 'bg-white border border-green-200 hover:border-green-300 shadow-sm'}`}>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 ${theme === 'dark' ? 'bg-green-700/30' : 'bg-green-100'}`}>
                  <stat.icon className={`w-6 h-6 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`} />
                </div>
                <p className={`text-3xl md:text-4xl font-extrabold ${theme === 'dark' ? 'text-green-200' : 'text-green-800'}`}>{stat.target}</p>
                <p className={`text-xs mt-1 font-medium ${theme === 'dark' ? 'text-green-500' : 'text-green-600'}`}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tentang Section */}
      <section id="tentang" className={`py-24 relative overflow-hidden ${theme === 'dark' ? 'bg-[#052e16]' : 'bg-white'}`}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className={`text-xs font-bold tracking-[0.2em] uppercase mb-4 block ${theme === 'dark' ? 'text-green-500' : 'text-green-600'}`}>{t.labels.aboutProgramTag}</span>
              <h2 className={`text-3xl md:text-4xl font-extrabold tracking-tight mb-6 leading-tight ${theme === 'dark' ? 'text-green-100' : 'text-green-900'}`}>
                {t.labels.aboutTitlePrefix} <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300">{t.labels.aboutTitleHighlight}</span>?
              </h2>
              <div className={`space-y-4 text-sm leading-relaxed ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>
                <p>{t.labels.aboutP1}</p>
                <p>{t.labels.aboutP2}</p>
                <p>{t.labels.aboutP3}</p>
              </div>
            </div>
            <div className="relative">
              <div className={`rounded-3xl overflow-hidden border shadow-2xl ${theme === 'dark' ? 'border-green-700/20' : 'border-green-200'}`}>
                <img src="https://picsum.photos/seed/greenforest2026/700/500.jpg" alt={locale === 'id' ? 'Hutan' : 'Forest'} className="w-full h-80 md:h-96 object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dampak Section */}
      <section id="dampak" className={`py-24 relative ${theme === 'dark' ? 'bg-[#052e16]' : 'bg-white'}`}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className={`text-xs font-bold tracking-[0.2em] uppercase mb-4 block ${theme === 'dark' ? 'text-red-400/80' : 'text-red-600'}`}>{t.labels.whyImportant}</span>
            <h2 className={`text-3xl md:text-5xl font-extrabold tracking-tight mb-4 ${theme === 'dark' ? 'text-green-100' : 'text-green-900'}`}>
              {t.labels.climateImpactPrefix} <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-amber-400">{t.labels.climateImpactHighlight}</span>
            </h2>
            <p className={`max-w-2xl mx-auto ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>
              {t.labels.climateImpactDesc}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: ThermometerSun, title: locale === 'id' ? 'Suhu Meningkat' : 'Rising Temperature', desc: locale === 'id' ? 'Suhu rata-rata di Lhokseumawe naik 0.5°C per dekade. Hutan kota dapat menurunkan suhu lokal hingga 8°C.' : 'Average temperature in Lhokseumawe rises by 0.5°C per decade. Urban forests can reduce local temperatures by up to 8°C.', color: 'red' },
              { icon: Droplets, title: locale === 'id' ? 'Banjir & Erosi' : 'Flood & Erosion', desc: locale === 'id' ? 'Deforestasi meningkatkan aliran permukaan dan erosi tanah. Akar pohon menyerap air hujan hingga 70% lebih banyak.' : 'Deforestation increases surface runoff and soil erosion. Tree roots absorb up to 70% more rainwater.', color: 'blue' },
              { icon: CloudHail, title: locale === 'id' ? 'Kualitas Udara' : 'Air Quality', desc: locale === 'id' ? 'Polutan udara di kota meningkat seiring urbanisasi. Satu pohon dewasa mampu menyaring 22 kg polutan per tahun.' : 'Urban air pollutants keep increasing. A single mature tree can filter 22 kg of pollutants per year.', color: 'amber' },
              { icon: Fish, title: locale === 'id' ? 'Kerusakan Ekosistem' : 'Ecosystem Damage', desc: locale === 'id' ? 'Hilangnya habitat mengancam keanekaragaman hayati lokal. Pohon menjadi rumah bagi ratusan spesies.' : 'Habitat loss threatens local biodiversity. Trees are home to hundreds of species.', color: 'purple' },
              { icon: Waves, title: locale === 'id' ? 'Kenaikan Muka Laut' : 'Rising Sea Level', desc: locale === 'id' ? 'Sebagai kota pesisir, Lhokseumawe rentan terhadap naiknya permukaan laut. Mangrove menjadi benteng alami.' : 'As a coastal city, Lhokseumawe is vulnerable to sea level rise. Mangroves are natural protection.', color: 'teal' },
              { icon: HeartCrack, title: locale === 'id' ? 'Dampak Sosial' : 'Social Impact', desc: locale === 'id' ? 'Perubahan iklim berdampak pada kesehatan, ekonomi, dan kualitas hidup masyarakat terutama kelompok rentan.' : 'Climate change affects health, economy, and quality of life, especially for vulnerable groups.', color: 'orange' }
            ].map((item, idx) => {
              const colorClasses = {
                red: { lightBg: 'bg-red-50/50 light:border-red-200', darkIconBg: 'bg-red-950/50 dark:border-red-800/20', lightIconBg: 'bg-red-100', icon: 'text-red-400' },
                blue: { lightBg: 'bg-blue-50/50 light:border-blue-200', darkIconBg: 'bg-blue-950/50 dark:border-blue-800/20', lightIconBg: 'bg-blue-100', icon: 'text-blue-400' },
                amber: { lightBg: 'bg-amber-50/50 light:border-amber-200', darkIconBg: 'bg-amber-950/50 dark:border-amber-800/20', lightIconBg: 'bg-amber-100', icon: 'text-amber-400' },
                purple: { lightBg: 'bg-purple-50/50 light:border-purple-200', darkIconBg: 'bg-purple-950/50 dark:border-purple-800/20', lightIconBg: 'bg-purple-100', icon: 'text-purple-400' },
                teal: { lightBg: 'bg-teal-50/50 light:border-teal-200', darkIconBg: 'bg-teal-950/50 dark:border-teal-800/20', lightIconBg: 'bg-teal-100', icon: 'text-teal-400' },
                orange: { lightBg: 'bg-orange-50/50 light:border-orange-200', darkIconBg: 'bg-orange-950/50 dark:border-orange-800/20', lightIconBg: 'bg-orange-100', icon: 'text-orange-400' }
              };
              const c = colorClasses[item.color as keyof typeof colorClasses] || colorClasses.red;

              const cardClass = theme === 'dark'
                ? 'bg-gradient-to-br from-green-900/60 to-[#022c17] border border-green-700/30'
                : c.lightBg;

              const iconBgClass = theme === 'dark' ? c.darkIconBg : c.lightIconBg;

              return (
                <div key={idx} className={`rounded-2xl p-7 transition-all hover:-translate-y-1 ${cardClass}`}>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${iconBgClass}`}>
                    <item.icon className={`w-6 h-6 ${c.icon}`} />
                  </div>
                  <h3 className={`font-bold text-base mb-2 ${theme === 'dark' ? 'text-green-100' : 'text-green-800'}`}>{item.title}</h3>
                  <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-green-500' : 'text-green-600'}`}>{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Manfaat Section */}
      <section id="manfaat" className={`py-24 relative overflow-hidden ${theme === 'dark' ? 'bg-[#052e16]' : 'bg-white'}`}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className={`text-xs font-bold tracking-[0.2em] uppercase mb-4 block ${theme === 'dark' ? 'text-green-500' : 'text-green-600'}`}>{t.labels.tangibleBenefits}</span>
            <h2 className={`text-3xl md:text-5xl font-extrabold tracking-tight mb-4 ${theme === 'dark' ? 'text-green-100' : 'text-green-900'}`}>
              {t.labels.whatYouGetPrefix} <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300">{t.labels.whatYouGetHighlight}</span>?
            </h2>
            <p className={`max-w-xl mx-auto ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>
              {t.labels.benefitsDesc}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: Award, title: locale === 'id' ? 'Sertifikat Relawan' : 'Volunteer Certificate', desc: locale === 'id' ? 'Dapatkan sertifikat resmi yang bisa digunakan untuk portofolio dan CV Anda.' : 'Get an official certificate that can strengthen your portfolio and CV.' },
              { icon: UsersRound, title: locale === 'id' ? 'Jaringan Komunitas' : 'Community Network', desc: locale === 'id' ? 'Bertemu dan berkolaborasi dengan relawan dari berbagai latar belakang profesi.' : 'Meet and collaborate with volunteers from diverse professional backgrounds.' },
              { icon: BookOpen, title: locale === 'id' ? 'Edukasi Lingkungan' : 'Environmental Education', desc: locale === 'id' ? 'Pelajari teknik menanam yang benar, pemilihan jenis pohon, dan perawatan tanaman.' : 'Learn proper planting techniques, species selection, and plant care.' },
              { icon: Smile, title: locale === 'id' ? 'Kebanggaan & Warisan' : 'Pride & Legacy', desc: locale === 'id' ? 'Tinggalkan warisan hijau yang bisa dinikmati generasi mendatang. Ini warisan terbaik.' : 'Leave a green legacy that future generations can enjoy. This is the best legacy.' }
            ].map((benefit, idx) => (
              <div key={idx} className={`rounded-2xl p-6 text-center transition-all hover:-translate-y-1 ${theme === 'dark' ? 'bg-gradient-to-br from-green-900/60 to-[#022c17] border border-green-700/30 hover:border-green-500/30' : 'bg-green-50/50 border border-green-200 hover:border-green-400 shadow-sm'}`}>
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 ${theme === 'dark' ? 'bg-green-700/20' : 'bg-white'}`}>
                  <benefit.icon className={`w-7 h-7 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`} />
                </div>
                <h4 className={`font-bold text-sm mb-2 ${theme === 'dark' ? 'text-green-200' : 'text-green-800'}`}>{benefit.title}</h4>
                <p className={`text-xs leading-relaxed ${theme === 'dark' ? 'text-green-500' : 'text-green-600'}`}>{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Alur Bergabung Section */}
      <section id="alur" className={`py-24 relative overflow-hidden ${theme === 'dark' ? 'bg-[#052e16]' : 'bg-white'}`}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className={`text-xs font-bold tracking-[0.2em] uppercase mb-4 block ${theme === 'dark' ? 'text-green-500' : 'text-green-600'}`}>{t.labels.easySteps}</span>
            <h2 className={`text-3xl md:text-5xl font-extrabold tracking-tight mb-4 ${theme === 'dark' ? 'text-green-100' : 'text-green-900'}`}>
              {t.labels.joinFlowPrefix} <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300">{t.labels.joinFlowHighlight}</span>
            </h2>
            <p className={`max-w-2xl mx-auto ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>
              {t.labels.joinFlowDesc}
            </p>
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Connecting Line - Desktop */}
            <div className={`hidden md:block absolute top-1/2 left-0 right-0 h-1 -translate-y-1/2 ${theme === 'dark' ? 'bg-green-900/30' : 'bg-green-200'}`}>
              <div className={`h-full bg-gradient-to-r from-green-500 to-emerald-400 transition-all duration-1000 ease-out`} style={{ width: '100%' }} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-8 relative">
              {[
                {
                  step: '01',
                  icon: FileText,
                  title: locale === 'id' ? 'Daftar Online' : 'Register Online',
                  desc: locale === 'id' ? 'Isi formulir pendaftaran dengan data diri dan jumlah pohon yang akan ditanam.' : 'Fill out the registration form with your details and target number of trees.'
                },
                {
                  step: '02',
                  icon: CheckCircle2,
                  title: locale === 'id' ? 'Konfirmasi' : 'Confirmation',
                  desc: locale === 'id' ? 'Tim kami akan mengkonfirmasi pendaftaran Anda melalui WhatsApp.' : 'Our team will confirm your registration via WhatsApp.'
                },
                {
                  step: '03',
                  icon: Sprout,
                  title: locale === 'id' ? 'Terima Benih' : 'Receive Seedlings',
                  desc: locale === 'id' ? 'Ambil benih pohon di lokasi distribusi yang telah ditentukan.' : 'Collect tree seedlings at the designated distribution point.'
                },
                {
                  step: '04',
                  icon: TreePine,
                  title: locale === 'id' ? 'Tanam Pohon' : 'Plant Trees',
                  desc: locale === 'id' ? 'Lakukan penanaman pohon di lokasi yang telah disepakati.' : 'Plant trees in the agreed location.'
                },
                {
                  step: '05',
                  icon: AwardIcon,
                  title: locale === 'id' ? 'Dapatkan Sertifikat' : 'Get Certificate',
                  desc: locale === 'id' ? 'Terima sertifikat kontribusi sebagai bentuk apresiasi.' : 'Receive a contribution certificate as appreciation.'
                }
              ].map((item, idx) => (
                <div key={idx} className="relative group">
                  {/* Step Number Circle - Desktop */}
                  <div className="hidden md:flex absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full items-center justify-center font-bold text-xs bg-gradient-to-br from-green-500 to-emerald-400 text-white shadow-lg shadow-green-500/30 z-10">
                    {item.step}
                  </div>

                  {/* Card */}
                  <div className={`relative pt-12 pb-8 px-4 rounded-2xl text-center transition-all duration-300 hover:-translate-y-2 ${
                    theme === 'dark'
                      ? 'bg-gradient-to-br from-green-900/60 to-[#022c17] border border-green-700/30 hover:border-green-500/50 hover:shadow-xl hover:shadow-green-500/10'
                      : 'bg-green-50/50 border border-green-200 hover:border-green-400 hover:shadow-lg hover:shadow-green-500/10'
                  }`}>
                    {/* Icon Container */}
                    <div className={`relative w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 ${
                      theme === 'dark'
                        ? 'bg-gradient-to-br from-green-700/40 to-green-800/40 border-2 border-green-600/30 group-hover:border-green-500/50'
                        : 'bg-white border-2 border-green-200 group-hover:border-green-400 shadow-md'
                    }`}>
                      <item.icon className={`w-10 h-10 transition-all duration-300 ${
                        theme === 'dark' ? 'text-green-400' : 'text-green-600'
                      }`} />
                      {/* Glow Effect */}
                      <div className={`absolute inset-0 rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-300 ${
                        theme === 'dark' ? 'bg-green-500' : 'bg-green-400'
                      }`} />
                    </div>

                    {/* Title */}
                    <h3 className={`font-bold text-base mb-2 ${theme === 'dark' ? 'text-green-200' : 'text-green-800'}`}>
                      {item.title}
                    </h3>

                    {/* Description */}
                    <p className={`text-xs leading-relaxed ${theme === 'dark' ? 'text-green-500' : 'text-green-600'}`}>
                      {item.desc}
                    </p>

                    {/* Mobile Step Number */}
                    <div className="md:hidden absolute top-3 left-3 w-6 h-6 rounded-full bg-gradient-to-br from-green-500 to-emerald-400 text-white flex items-center justify-center font-bold text-xs">
                      {item.step}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Info */}
          <div className={`mt-16 p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 ${
            theme === 'dark'
              ? 'bg-gradient-to-r from-green-900/40 to-[#022c17]/40 border border-green-700/30'
              : 'bg-gradient-to-r from-green-50 to-emerald-50/50 border border-green-200'
          }`}>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                theme === 'dark' ? 'bg-green-700/30' : 'bg-green-100'
              }`}>
                <ShieldCheck className={`w-5 h-5 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`} />
              </div>
              <div>
                <p className={`text-sm font-semibold ${theme === 'dark' ? 'text-green-200' : 'text-green-800'}`}>
                  {t.labels.guidedTitle}
                </p>
                <p className={`text-xs ${theme === 'dark' ? 'text-green-500' : 'text-green-600'}`}>
                  {t.labels.guidedDesc}
                </p>
              </div>
            </div>
            <a
              href="#data"
              className={`px-6 py-3 rounded-xl font-semibold text-sm flex items-center gap-2 transition-all hover:-translate-y-0.5 ${
                theme === 'dark'
                  ? 'bg-green-600 hover:bg-green-500 text-white'
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {t.nav.joinNow}
              <Send className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section id="data" className={`relative py-24 overflow-hidden ${theme === 'dark' ? 'bg-[#052e16]' : 'bg-green-50/30'}`}>
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="text-center mb-14">
            <span className={`text-xs font-bold tracking-[0.2em] uppercase mb-4 block ${theme === 'dark' ? 'text-green-500' : 'text-green-600'}`}>{t.labels.joinTag}</span>
            <h2 className={`text-3xl md:text-5xl font-extrabold tracking-tight mb-4 ${theme === 'dark' ? 'text-green-100' : 'text-green-900'}`}>
              {t.labels.bePartPrefix} <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300">{t.labels.bePartHighlight}</span>
            </h2>
          </div>

          <div className="grid lg:grid-cols-5 gap-8">
            {/* Form */}
            <div className="lg:col-span-3">
              <form onSubmit={handleSubmit} className={`rounded-3xl p-8 md:p-10 space-y-5 ${theme === 'dark' ? 'bg-gradient-to-br from-green-900/80 to-[#022c17] border border-green-700/30' : 'bg-white border border-green-200 shadow-xl'}`}>
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className={`block text-xs font-semibold mb-2 tracking-wider uppercase ${theme === 'dark' ? 'text-green-400' : 'text-green-700'}`}>{t.labels.fullName}</label>
                    <input
                      type="text"
                      value={formData.nama}
                      onChange={(e) => handleInputChange('nama', e.target.value)}
                      className={`w-full px-4 py-3 rounded-xl text-sm transition-all ${theme === 'dark' ? 'bg-green-800/30 border-green-700/30 text-green-100 focus:border-green-500 focus:bg-green-800/50' : 'bg-white border-green-200 text-green-900 focus:border-green-500'} ${errors.nama ? 'border-red-500' : ''}`}
                      placeholder={t.labels.fullNamePlaceholder}
                    />
                    {errors.nama && <p className="text-red-500 text-xs mt-1">{errors.nama}</p>}
                  </div>

                  <div>
                    <label className={`block text-xs font-semibold mb-2 tracking-wider uppercase ${theme === 'dark' ? 'text-green-400' : 'text-green-700'}`}>{t.labels.whatsapp}</label>
                    <input
                      type="tel"
                      value={formData.whatsapp}
                      onChange={(e) => handleInputChange('whatsapp', e.target.value)}
                      className={`w-full px-4 py-3 rounded-xl text-sm transition-all ${theme === 'dark' ? 'bg-green-800/30 border-green-700/30 text-green-100 focus:border-green-500 focus:bg-green-800/50' : 'bg-white border-green-200 text-green-900 focus:border-green-500'} ${errors.whatsapp ? 'border-red-500' : ''}`}
                      placeholder="08xxxxxxxxxx"
                    />
                    {errors.whatsapp && <p className="text-red-500 text-xs mt-1">{errors.whatsapp}</p>}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className={`block text-xs font-semibold mb-2 tracking-wider uppercase ${theme === 'dark' ? 'text-green-400' : 'text-green-700'}`}>{t.labels.age}</label>
                    <input
                      type="number"
                      min="10"
                      max="100"
                      value={formData.usia}
                      onChange={(e) => handleInputChange('usia', e.target.value)}
                      className={`w-full px-4 py-3 rounded-xl text-sm transition-all ${theme === 'dark' ? 'bg-green-800/30 border-green-700/30 text-green-100 focus:border-green-500 focus:bg-green-800/50' : 'bg-white border-green-200 text-green-900 focus:border-green-500'} ${errors.usia ? 'border-red-500' : ''}`}
                      placeholder={t.labels.agePlaceholder}
                    />
                    {errors.usia && <p className="text-red-500 text-xs mt-1">{errors.usia}</p>}
                  </div>

                  <div>
                    <label className={`block text-xs font-semibold mb-2 tracking-wider uppercase ${theme === 'dark' ? 'text-green-400' : 'text-green-700'}`}>{t.labels.job}</label>
                    <select
                      value={formData.pekerjaan}
                      onChange={(e) => handleInputChange('pekerjaan', e.target.value)}
                      className={`w-full px-4 py-3 rounded-xl text-sm transition-all ${theme === 'dark' ? 'bg-green-800/30 border-green-700/30 text-green-100 focus:border-green-500 focus:bg-green-800/50' : 'bg-white border-green-200 text-green-900 focus:border-green-500'} ${errors.pekerjaan ? 'border-red-500' : ''}`}
                    >
                      <option value="">{locale === 'id' ? 'Pilih pekerjaan' : 'Select occupation'}</option>
                      <option value="Pelajar / Mahasiswa">{locale === 'id' ? 'Pelajar / Mahasiswa' : 'Student'}</option>
                      <option value="PNS / ASN">{locale === 'id' ? 'PNS / ASN' : 'Civil Servant'}</option>
                      <option value="Swasta">{locale === 'id' ? 'Swasta' : 'Private Employee'}</option>
                      <option value="Wiraswasta">{locale === 'id' ? 'Wiraswasta' : 'Entrepreneur'}</option>
                      <option value="Lainnya">{locale === 'id' ? 'Lainnya' : 'Others'}</option>
                    </select>
                    {errors.pekerjaan && <p className="text-red-500 text-xs mt-1">{errors.pekerjaan}</p>}
                  </div>
                </div>

                <div>
                  <label className={`block text-xs font-semibold mb-2 tracking-wider uppercase ${theme === 'dark' ? 'text-green-400' : 'text-green-700'}`}>{t.labels.address}</label>
                  <input
                    type="text"
                    value={formData.alamat}
                    onChange={(e) => handleInputChange('alamat', e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl text-sm transition-all ${theme === 'dark' ? 'bg-green-800/30 border-green-700/30 text-green-100 focus:border-green-500 focus:bg-green-800/50' : 'bg-white border-green-200 text-green-900 focus:border-green-500'} ${errors.alamat ? 'border-red-500' : ''}`}
                    placeholder={t.labels.addressPlaceholder}
                  />
                  {errors.alamat && <p className="text-red-500 text-xs mt-1">{errors.alamat}</p>}
                </div>

                <div>
                  <label className={`block text-xs font-semibold mb-2 tracking-wider uppercase ${theme === 'dark' ? 'text-green-400' : 'text-green-700'}`}>{t.labels.targetTrees}</label>
                  <select
                    value={formData.jumlah_pohon}
                    onChange={(e) => handleInputChange('jumlah_pohon', e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl text-sm transition-all ${theme === 'dark' ? 'bg-green-800/30 border-green-700/30 text-green-100 focus:border-green-500 focus:bg-green-800/50' : 'bg-white border-green-200 text-green-900 focus:border-green-500'}`}
                  >
                    <option value="">{locale === 'id' ? 'Pilih jumlah' : 'Select amount'}</option>
                    <option value="1">{locale === 'id' ? '1 Pohon' : '1 Tree'}</option>
                    <option value="5">{locale === 'id' ? '5 Pohon' : '5 Trees'}</option>
                    <option value="10">{locale === 'id' ? '10 Pohon' : '10 Trees'}</option>
                    <option value="25">{locale === 'id' ? '25 Pohon' : '25 Trees'}</option>
                    <option value="50">{locale === 'id' ? '50 Pohon' : '50 Trees'}</option>
                    <option value="100">{locale === 'id' ? '100 Pohon' : '100 Trees'}</option>
                    <option value="500">{locale === 'id' ? '500 Pohon (Komunitas)' : '500 Trees (Community)'}</option>
                    <option value="1000">{locale === 'id' ? '1.000 Pohon (Institusi)' : '1,000 Trees (Institution)'}</option>
                  </select>
                </div>

                <div>
                  <label className={`block text-xs font-semibold mb-2 tracking-wider uppercase ${theme === 'dark' ? 'text-green-400' : 'text-green-700'}`}>{t.labels.motivation}</label>
                  <textarea
                    rows={3}
                    value={formData.motivasi}
                    onChange={(e) => handleInputChange('motivasi', e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl text-sm resize-none transition-all ${theme === 'dark' ? 'bg-green-800/30 border-green-700/30 text-green-100 focus:border-green-500 focus:bg-green-800/50' : 'bg-white border-green-200 text-green-900 focus:border-green-500'} ${errors.motivasi ? 'border-red-500' : ''}`}
                    placeholder={t.labels.motivationPlaceholder}
                  />
                  {errors.motivasi && <p className="text-red-500 text-xs mt-1">{errors.motivasi}</p>}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-8 py-4 rounded-2xl font-bold text-white text-base flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-green-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>{t.labels.sending}</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>{t.hero.volunteer}</span>
                    </>
                  )}
                </button>

                {errors.general && (
                  <div className={`flex items-center gap-2 p-4 rounded-xl ${theme === 'dark' ? 'bg-red-900/20 border border-red-800/30' : 'bg-red-50 border border-red-200'}`}>
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                    <p className="text-red-500 text-sm">{errors.general}</p>
                  </div>
                )}
              </form>
            </div>

            {/* Sidebar Stats */}
            <div className="lg:col-span-2 space-y-6">
              <div className={`rounded-3xl p-6 ${theme === 'dark' ? 'bg-gradient-to-br from-green-900/80 to-[#022c17] border border-green-700/30' : 'bg-white border border-green-200 shadow-lg'}`}>
                <h4 className={`font-bold text-sm mb-4 flex items-center gap-2 ${theme === 'dark' ? 'text-green-200' : 'text-green-800'}`}>
                  <BarChart3 className={`w-4 h-4 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`} />
                  <span>{t.labels.registrationProgress}</span>
                </h4>
                <div className="text-center">
                  <p className={`text-5xl font-extrabold ${theme === 'dark' ? 'text-green-200' : 'text-green-800'}`}>{progressPercent.toFixed(1)}%</p>
                  <p className={`text-lg font-semibold mt-2 ${theme === 'dark' ? 'text-green-300' : 'text-green-700'}`}>
                    {displayCount.toLocaleString(locale === 'id' ? 'id-ID' : 'en-US')} <span className={`text-sm font-normal ${theme === 'dark' ? 'text-green-500' : 'text-green-600'}`}>/ 10,000 {t.labels.registeredVolunteers}</span>
                  </p>
                </div>
              </div>

              <div className={`rounded-3xl p-6 ${theme === 'dark' ? 'bg-gradient-to-br from-green-900/80 to-[#022c17] border border-green-700/30' : 'bg-white border border-green-200 shadow-lg'}`}>
                <h4 className={`font-bold text-sm mb-4 flex items-center gap-2 ${theme === 'dark' ? 'text-green-200' : 'text-green-800'}`}>
                  <TreePine className={`w-4 h-4 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`} />
                  <span>{t.labels.totalTrees}</span>
                </h4>
                <p className={`text-4xl font-extrabold ${theme === 'dark' ? 'text-green-200' : 'text-green-800'}`}>{totalTrees.toLocaleString(locale === 'id' ? 'id-ID' : 'en-US')}</p>
                <p className={`text-xs mt-2 ${theme === 'dark' ? 'text-green-500' : 'text-green-600'}`}>{t.labels.treesRegistered}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Data Table Section */}
      <section className={`py-16 ${theme === 'dark' ? 'bg-[#052e16]' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-8">
            <h2 className={`text-3xl font-extrabold mb-3 ${theme === 'dark' ? 'text-green-100' : 'text-green-900'}`}>
              {t.labels.participantDataTitle} <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300">{t.labels.participantDataHighlight}</span>
            </h2>
            <p className={`${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>
              {t.labels.participantDataDesc}
            </p>
          </div>

          {/* Search and Actions Bar */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${theme === 'dark' ? 'text-green-500' : 'text-green-400'}`} />
              <input
                type="text"
                placeholder={t.labels.searchPlaceholder}
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm transition-all ${
                  theme === 'dark'
                    ? 'bg-green-900/30 border-green-700/30 text-green-100 placeholder-green-600 focus:border-green-500 focus:ring-2 focus:ring-green-500/20'
                    : 'bg-white border-green-200 text-green-900 placeholder-green-400 focus:border-green-500 focus:ring-2 focus:ring-green-500/20'
                }`}
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-2xl border">
            <table className="w-full text-sm">
              <thead>
                <tr className={theme === 'dark' ? 'bg-green-900/40' : 'bg-green-50'}>
                  <th className={`text-left px-5 py-3 text-xs font-bold tracking-wider uppercase rounded-tl-2xl ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>{t.labels.noCol}</th>
                  <th className={`text-left px-5 py-3 text-xs font-bold tracking-wider uppercase ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>{t.labels.nameCol}</th>
                  <th className={`text-left px-5 py-3 text-xs font-bold tracking-wider uppercase ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>{t.labels.jobCol}</th>
                  <th className={`text-left px-5 py-3 text-xs font-bold tracking-wider uppercase ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>{t.labels.treesCol}</th>
                  <th className={`text-left px-5 py-3 text-xs font-bold tracking-wider uppercase ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>{t.labels.motivationCol}</th>
                  <th className={`text-left px-5 py-3 text-xs font-bold tracking-wider uppercase rounded-tr-2xl ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>{t.labels.dateCol}</th>
                </tr>
              </thead>
              <tbody>
                {isLoadingPeserta ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-12 text-center">
                      <Loader2 className={`h-8 w-8 mx-auto mb-3 animate-spin ${theme === 'dark' ? 'text-green-500' : 'text-green-600'}`} />
                      <p className={theme === 'dark' ? 'text-green-600' : 'text-green-500'}>{t.labels.loadingData}</p>
                    </td>
                  </tr>
                ) : paginatedPeserta.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-12 text-center">
                      <div className={`inline-flex items-center justify-center w-10 h-10 mb-3 rounded-full ${theme === 'dark' ? 'bg-green-900' : 'bg-green-50'}`}>
                        <Users className={`w-5 h-5 opacity-30 ${theme === 'dark' ? 'text-green-600' : 'text-green-400'}`} />
                      </div>
                      <p className={`text-sm ${theme === 'dark' ? 'text-green-600' : 'text-green-500'}`}>
                        {searchTerm ? t.labels.noSearch : t.labels.noData}
                      </p>
                    </td>
                  </tr>
                ) : (
                  paginatedPeserta.map((peserta, idx) => (
                    <tr
                      key={peserta.id}
                      className={`border-t ${theme === 'dark' ? 'border-green-800/20 hover:bg-green-900/20' : 'border-green-100 hover:bg-green-50'} transition-colors cursor-pointer`}
                      onMouseEnter={(e) => handleMouseEnter(peserta, e)}
                      onMouseLeave={handleMouseLeave}
                      onMouseMove={handleMouseMove}
                    >
                      <td className={`px-5 py-3 text-xs ${theme === 'dark' ? 'text-green-500' : 'text-green-500'}`}>{startIndex + idx + 1}</td>
                      <td className={`px-5 py-3 font-medium ${theme === 'dark' ? 'text-green-200' : 'text-green-800'}`}>{peserta.nama}</td>
                      <td className={`px-5 py-3 text-xs ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>{peserta.pekerjaan || '-'}</td>
                      <td className="px-5 py-3">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold ${theme === 'dark' ? 'bg-green-700/20 text-green-300' : 'bg-green-100 text-green-700'}`}>
                          {peserta.jumlah_pohon || 0}
                        </span>
                      </td>
                      <td className={`px-5 py-3 text-xs max-w-[150px] truncate ${theme === 'dark' ? 'text-green-500' : 'text-green-500'}`}>
                        {peserta.motivasi || '-'}
                      </td>
                      <td className={`px-5 py-3 text-xs ${theme === 'dark' ? 'text-green-500' : 'text-green-500'}`}>
                        {new Date(peserta.timestamp).toLocaleString(locale === 'id' ? 'id-ID' : 'en-US', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Hover Tooltip */}
          {hoveredPeserta && (
            <div
              className={`fixed z-50 rounded-2xl p-5 shadow-2xl max-w-sm pointer-events-none transition-opacity duration-200 ${
                theme === 'dark' ? 'bg-green-900/95 backdrop-blur-sm border border-green-600/30' : 'bg-white border border-green-200'
              }`}
              style={{
                left: `${tooltipPosition.x}px`,
                top: `${tooltipPosition.y}px`,
                transform: 'translateY(-100%)'
              }}
            >
              <div className={`text-xs font-bold tracking-wider uppercase mb-3 ${theme === 'dark' ? 'text-green-500' : 'text-green-600'}`}>
                {t.labels.participantDetail}
              </div>
              <div className="space-y-3">
                <div>
                  <div className={`text-xs font-semibold mb-1 ${theme === 'dark' ? 'text-green-400' : 'text-green-700'}`}>{t.labels.nameCol}</div>
                  <div className={`text-sm font-medium ${theme === 'dark' ? 'text-green-100' : 'text-green-900'}`}>
                    {hoveredPeserta.nama}
                  </div>
                </div>
                <div>
                  <div className={`text-xs font-semibold mb-1 ${theme === 'dark' ? 'text-green-400' : 'text-green-700'}`}>{t.labels.motivationCol}</div>
                  <div className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-green-300' : 'text-green-800'}`}>
                    {hoveredPeserta.motivasi || '-'}
                  </div>
                </div>
              </div>
              <div className={`mt-3 pt-3 border-t ${theme === 'dark' ? 'border-green-700/30' : 'border-green-200'}`}>
                <div className={`text-xs ${theme === 'dark' ? 'text-green-500' : 'text-green-600'}`}>
                  <span className="font-semibold">{hoveredPeserta.jumlah_pohon || 0}</span> {t.labels.treeUnit} &bull; {hoveredPeserta.pekerjaan || '-'}
                </div>
              </div>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
              <p className={`text-sm ${theme === 'dark' ? 'text-green-500' : 'text-green-600'}`}>
                {t.labels.showingResults} {startIndex + 1}-{Math.min(endIndex, filteredPeserta.length)} {t.labels.of} {filteredPeserta.length} {t.labels.participants}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-lg transition-all ${
                    currentPage === 1
                      ? 'opacity-50 cursor-not-allowed bg-green-100 text-green-400'
                      : theme === 'dark'
                        ? 'bg-green-900/30 hover:bg-green-800/30 text-green-400'
                        : 'bg-green-50 hover:bg-green-100 text-green-600'
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                        currentPage === pageNum
                          ? theme === 'dark'
                            ? 'bg-green-600 text-white'
                            : 'bg-green-600 text-white'
                          : theme === 'dark'
                            ? 'bg-green-900/30 hover:bg-green-800/30 text-green-400'
                            : 'bg-green-50 hover:bg-green-100 text-green-600'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-lg transition-all ${
                    currentPage === totalPages
                      ? 'opacity-50 cursor-not-allowed bg-green-100 text-green-400'
                      : theme === 'dark'
                        ? 'bg-green-900/30 hover:bg-green-800/30 text-green-400'
                        : 'bg-green-50 hover:bg-green-100 text-green-600'
                  }`}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Komentar Section */}
      <section className={`py-16 ${theme === 'dark' ? 'bg-[#052e16]' : 'bg-green-50/30'}`}>
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className={`text-3xl font-extrabold mb-3 ${theme === 'dark' ? 'text-green-100' : 'text-green-900'}`}>
              {t.labels.commentsTitle}
            </h2>
            <p className={`${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>
              {t.labels.commentsDesc} ({komentarTotalCount} {t.labels.commentsCount})
            </p>
          </div>

          {/* Form Komentar */}
          <form onSubmit={handleKomentarSubmit} className={`rounded-2xl p-6 mb-10 ${theme === 'dark' ? 'bg-gradient-to-br from-green-900/60 to-[#022c17] border border-green-700/30' : 'bg-white border border-green-200 shadow-lg'}`}>
            {/* Info Box */}
            <div className={`mb-6 p-4 rounded-xl flex items-start gap-3 ${
              theme === 'dark' ? 'bg-blue-900/20 border border-blue-800/30' : 'bg-blue-50 border border-blue-200'
            }`}>
              <ShieldCheck className={`w-5 h-5 flex-shrink-0 mt-0.5 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
              <div>
                <p className={`text-sm font-semibold ${theme === 'dark' ? 'text-blue-300' : 'text-blue-800'}`}>
                  {t.labels.registeredOnlyTitle}
                </p>
                <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
                  {t.labels.registeredOnlyDesc}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className={`block text-xs font-semibold mb-2 tracking-wider uppercase ${theme === 'dark' ? 'text-green-400' : 'text-green-700'}`}>
                  {t.labels.fullName}
                </label>
                <input
                  type="text"
                  value={komentarForm.nama}
                  onChange={(e) => setKomentarForm({ ...komentarForm, nama: e.target.value })}
                  placeholder={t.labels.commentNamePlaceholder}
                  maxLength={100}
                  className={`w-full px-4 py-3 rounded-xl text-sm transition-all ${
                    theme === 'dark'
                      ? 'bg-green-800/30 border-green-700/30 text-green-100 focus:border-green-500 focus:ring-2 focus:ring-green-500/20'
                      : 'bg-white border-green-200 text-green-900 focus:border-green-500 focus:ring-2 focus:ring-green-500/20'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-xs font-semibold mb-2 tracking-wider uppercase ${theme === 'dark' ? 'text-green-400' : 'text-green-700'}`}>
                  {t.labels.commentWhatsapp}
                </label>
                <input
                  type="tel"
                  value={komentarForm.whatsapp}
                  onChange={(e) => setKomentarForm({ ...komentarForm, whatsapp: e.target.value })}
                  placeholder={t.labels.commentWhatsappPlaceholder}
                  maxLength={15}
                  className={`w-full px-4 py-3 rounded-xl text-sm transition-all ${
                    theme === 'dark'
                      ? 'bg-green-800/30 border-green-700/30 text-green-100 focus:border-green-500 focus:ring-2 focus:ring-green-500/20'
                      : 'bg-white border-green-200 text-green-900 focus:border-green-500 focus:ring-2 focus:ring-green-500/20'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-xs font-semibold mb-2 tracking-wider uppercase ${theme === 'dark' ? 'text-green-400' : 'text-green-700'}`}>
                  {t.labels.writeComment}
                </label>
                <textarea
                  value={komentarForm.isi}
                  onChange={(e) => setKomentarForm({ ...komentarForm, isi: e.target.value })}
                  placeholder={t.labels.writeCommentPlaceholder}
                  rows={4}
                  maxLength={500}
                  className={`w-full px-4 py-3 rounded-xl text-sm transition-all resize-none ${
                    theme === 'dark'
                      ? 'bg-green-800/30 border-green-700/30 text-green-100 focus:border-green-500 focus:ring-2 focus:ring-green-500/20'
                      : 'bg-white border-green-200 text-green-900 focus:border-green-500 focus:ring-2 focus:ring-green-500/20'
                  }`}
                />
                <div className="flex justify-between items-center mt-2">
                  <p className={`text-xs ${theme === 'dark' ? 'text-green-600' : 'text-green-500'}`}>
                    {komentarForm.isi.length} / 500 {t.labels.characters}
                  </p>
                </div>
              </div>

              {komentarError && (
                <div className={`flex items-center gap-2 px-4 py-3 rounded-xl ${theme === 'dark' ? 'bg-red-900/20 border border-red-800/30 text-red-400' : 'bg-red-50 border border-red-200 text-red-600'}`}>
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm">{komentarError}</span>
                </div>
              )}

              {komentarSuccess && (
                <div className={`flex items-center gap-2 px-4 py-3 rounded-xl ${theme === 'dark' ? 'bg-green-900/20 border border-green-800/30 text-green-400' : 'bg-green-50 border border-green-200 text-green-600'}`}>
                  <CheckCircle className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm">{komentarSuccess}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmittingKomentar}
                className={`w-full py-3 px-6 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
                  isSubmittingKomentar
                    ? 'opacity-70 cursor-not-allowed bg-green-600 text-white'
                    : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white hover:-translate-y-0.5 hover:shadow-lg hover:shadow-green-500/25'
                }`}
              >
                {isSubmittingKomentar ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{t.labels.sending}</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>{t.labels.sendComment}</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* List Komentar */}
          <div className="space-y-4">
            {isLoadingKomentar ? (
              <div className="text-center py-12">
                <Loader2 className={`h-8 w-8 mx-auto mb-3 animate-spin ${theme === 'dark' ? 'text-green-500' : 'text-green-600'}`} />
                <p className={`text-sm ${theme === 'dark' ? 'text-green-600' : 'text-green-500'}`}>{t.labels.loadingComments}</p>
              </div>
            ) : komentarList.length === 0 ? (
              <div className="text-center py-12">
                <div className={`inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full ${theme === 'dark' ? 'bg-green-900' : 'bg-green-50'}`}>
                  <MessageCircle className={`w-8 h-8 opacity-30 ${theme === 'dark' ? 'text-green-600' : 'text-green-400'}`} />
                </div>
                <p className={`text-sm ${theme === 'dark' ? 'text-green-600' : 'text-green-500'}`}>
                  {t.labels.noCommentYet}
                </p>
              </div>
            ) : (
              <>
                {komentarList.map((komentar) => (
                  <div
                    key={komentar.id}
                    className={`rounded-2xl p-5 transition-all ${
                      theme === 'dark'
                        ? 'bg-gradient-to-br from-green-900/40 to-[#022c17]/60 border border-green-700/20 hover:border-green-600/30'
                        : 'bg-white border border-green-200 hover:border-green-300 shadow-sm'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Avatar */}
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        theme === 'dark' ? 'bg-green-700/30' : 'bg-green-100'
                      }`}>
                        <span className={`font-bold text-sm ${theme === 'dark' ? 'text-green-300' : 'text-green-700'}`}>
                          {komentar.nama ? komentar.nama.charAt(0).toUpperCase() : 'A'}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className={`font-semibold text-sm ${theme === 'dark' ? 'text-green-200' : 'text-green-800'}`}>
                            {komentar.nama || t.labels.anonymous}
                          </h4>
                          <div className={`flex items-center gap-1 text-xs ${theme === 'dark' ? 'text-green-500' : 'text-green-600'}`}>
                            <Clock className="w-3 h-3" />
                            <span>{formatTimeAgo(komentar.createdAt)}</span>
                          </div>
                        </div>

                        <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-green-400' : 'text-green-700'}`}>
                          {komentar.isi}
                        </p>

                        <div className="flex items-center gap-4 mt-3">
                          <button className={`flex items-center gap-1.5 text-xs transition-colors ${
                            theme === 'dark' ? 'text-green-500 hover:text-green-400' : 'text-green-600 hover:text-green-700'
                          }`}>
                            <Heart className="w-4 h-4" />
                            <span>{komentar.suka} {t.labels.likes}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Show More Info */}
                {komentarTotalCount > 10 && (
                  <div className="text-center pt-4">
                    <p className={`text-xs ${theme === 'dark' ? 'text-green-600' : 'text-green-500'}`}>
                      {t.labels.showingLatest10} {komentarTotalCount} {t.labels.latestComments}
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`border-t py-16 mt-auto ${theme === 'dark' ? 'bg-[#022c17] border-green-800/30' : 'bg-white border-green-200'}`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center">
                  <TreePine className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span className={`font-bold text-sm ${theme === 'dark' ? 'text-green-200' : 'text-green-800'}`}>Sejuta Pohon</span>
                  <span className={`block text-[10px] tracking-widest uppercase ${theme === 'dark' ? 'text-green-600' : 'text-green-500'}`}>Lhokseumawe 2026</span>
                </div>
              </div>
              <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-green-600' : 'text-green-500'}`}>
                {t.labels.footerDesc}
              </p>
            </div>

            <div>
              <h4 className={`font-bold text-sm mb-4 ${theme === 'dark' ? 'text-green-300' : 'text-green-800'}`}>{t.labels.contact}</h4>
              <div className={`space-y-3 text-sm ${theme === 'dark' ? 'text-green-500' : 'text-green-600'}`}>
                <div className="flex items-center gap-2">
                  <Map className="w-4 h-4" />
                  <span>{locale === 'id' ? 'Kota Lhokseumawe, Aceh' : 'Lhokseumawe City, Aceh'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  <span>sejutapohon.lhokseumawe.id</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className={`font-bold text-sm mb-4 ${theme === 'dark' ? 'text-green-300' : 'text-green-800'}`}>{t.labels.motto}</h4>
              <p className={`text-lg italic ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>
                {t.labels.mottoText}
              </p>
            </div>
          </div>

          <div className={`border-t pt-8 text-center text-sm ${theme === 'dark' ? 'border-green-800 text-green-600' : 'border-green-200 text-green-500'}`}>
            <p>{t.labels.footerCopyright}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
