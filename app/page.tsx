"use client";
import { createBrowserClient } from '@supabase/ssr'
import { useEffect, useState } from 'react'

export default function Home() {
  const [siswa, setSiswa] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [menuAktif, setMenuAktif] = useState<'dashboard' | 'siswa' | 'rombel'>('dashboard');

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
  }, [supabase]);

  const totalSiswa = siswa.length;
  const siswaAktif = siswa.filter(s => s["STATUS SISWA"]?.toLowerCase() === 'masuk').length;
  const siswaTidakAktif = totalSiswa - siswaAktif;
  const daftarKelas = Array.from(new Set(siswa.map(s => s["DITERIMA DI KELAS"]))).sort();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      
      {/* HEADER */}
      <header className="bg-emerald-900 text-white p-6 shadow-lg flex-shrink-0">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-inner">
              <span className="text-emerald-900 font-black text-xl">M7</span>
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tighter leading-none">MIN 7 PONOROGO</h1>
              <p className="text-[10px] font-bold text-emerald-400 mt-1 uppercase tracking-[0.2em]">NSM: 111135020001</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <h2 className="text-lg font-medium tracking-widest opacity-70 uppercase">Selamat Datang</h2>
            <div className="w-12 h-12 bg-emerald-800 rounded-full flex items-center justify-center border border-emerald-700">
              <span className="text-2xl">🏛️</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* SIDEBAR */}
        <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col shadow-sm">
          <nav className="p-6 space-y-3 font-bold">
            <button onClick={() => setMenuAktif('dashboard')} className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-sm transition-all ${menuAktif ===
