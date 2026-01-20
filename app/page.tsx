"use client";
import { createBrowserClient } from '@supabase/ssr'
import { useEffect, useState } from 'react'

export default function Home() {
  const [siswa, setSiswa] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tabAktif, setTabAktif] = useState<'semua' | 'rombel'>('semua');

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase
        .from('Data Siswa')
        .select('NAMA, NISN, "DITERIMA DI KELAS", "STATUS SISWA", "JENIS KELAMIN"');
      if (data) setSiswa(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  // Logika Statistik
  const totalSiswa = siswa.length;
  const siswaAktif = siswa.filter(s => s["STATUS SISWA"]?.toLowerCase() === 'masuk').length;
  const siswaTidakAktif = totalSiswa - siswaAktif;
  
  // Logika Rombongan Belajar (Rombel)
  const daftarKelas = Array.from(new Set(siswa.map(s => s["DITERIMA DI KELAS"]))).sort();
  const dataRombel = daftarKelas.map(kelas => ({
    namaKelas: kelas,
    jumlah: siswa.filter(s => s["DITERIMA DI KELAS"] === kelas).length,
    lk: siswa.filter(s => s["DITERIMA DI KELAS"] === kelas && s["JENIS KELAMIN"] === 'L').length,
    pr: siswa.filter(s => s["DITERIMA DI KELAS"] === kelas && s["JENIS KELAMIN"] === 'P').length,
  }));

  return (
    <div className="min-h-screen bg-[#f4f7f6] font-sans text-slate-800 pb-20">
      {/* HEADER EMIS */}
      <div className="bg-emerald-800 text-white shadow-lg border-b-4 border-yellow-500">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center font-black text-emerald-800 shadow-sm text-xl">
              MIN
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight">MIN 7 PONOROGO</h1>
              <p className="text-[10px] font-bold opacity-80 uppercase tracking-widest">NSM: 111135020001</p>
            </div>
          </div>
          <div className="bg-emerald-900/50 px-4 py-2 rounded-lg border border-emerald-700 mt-4 md:mt-0">
            <p className="text-[9px] uppercase font-bold text-emerald-300">Tahun Ajaran</p>
            <p className="text-xs font-black">2025/2026 SEMESTER GANJIL</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-8">
        {/* WELCOME & ANNOUNCEMENT */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-2 bg-emerald-700 p-8 rounded-3xl shadow-emerald-200 shadow-2xl text-white relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-3xl font-black mb-2">Selamat Datang!</h2>
              <p className="text-emerald-100 text-sm max-w-md">Panel ini menyajikan rekapitulasi data siswa secara otomatis. Pantau ketersediaan rombel dan status keaktifan di bawah ini.</p>
            </div>
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
            <span className="bg-rose-100 text-rose-600 text-[9px] font-black px-2 py-1 rounded uppercase tracking-widest">Pengumuman</span>
