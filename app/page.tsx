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

  const totalSiswa = siswa.length;
  const siswaAktif = siswa.filter(s => s["STATUS SISWA"]?.toLowerCase() === 'masuk').length;
  const siswaTidakAktif = totalSiswa - siswaAktif;
  
  const daftarKelas = Array.from(new Set(siswa.map(s => s["DITERIMA DI KELAS"]))).sort();
  const dataRombel = daftarKelas.map(kelas => ({
    namaKelas: kelas,
    jumlah: siswa.filter(s => s["DITERIMA DI KELAS"] === kelas).length,
    lk: siswa.filter(s => s["DITERIMA DI KELAS"] === kelas && s["JENIS KELAMIN"] === 'L').length,
    pr: siswa.filter(s => s["DITERIMA DI KELAS"] === kelas && s["JENIS KELAMIN"] === 'P').length,
  }));

  return (
    <div className="min-h-screen bg-[#f4f7f6] font-sans text-slate-800 pb-20">
      <div className="bg-emerald-800 text-white shadow-lg border-b-4 border-yellow-500">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center font-black text-emerald-800 text-xl">MIN</div>
            <div>
              <h1 className="text-xl font-black tracking-tight">MIN 7 PONOROGO</h1>
              <p className="text-[10px] font-bold opacity-80 uppercase tracking-widest">NSM: 111135020001</p>
            </div>
          </div>
          <div className="bg-emerald-900 px-4 py-2 rounded-lg border border-emerald-700 mt-4 md:mt-0">
            <p className="text-[9px] uppercase font-bold text-emerald-300">Tahun Ajaran</p>
            <p className="text-xs font-black">2025/2026 SEMESTER GANJIL</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-2 bg-emerald-700 p-8 rounded-3xl shadow-2xl text-white">
            <h2 className="text-3xl font-black mb-2">Selamat Datang!</h2>
            <p className="text-emerald-100 text-sm max-w-md">Panel ini menyajikan rekapitulasi data siswa secara otomatis. Pantau ketersediaan rombel dan status keaktifan di bawah ini.</p>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
            <span className="bg-rose-100 text-rose-600 text-[9px] font-black px-2 py-1 rounded uppercase tracking-widest">Pengumuman</span>
            <p className="mt-4 text-xs font-bold leading-relaxed text-slate-600 border-l-2 border-rose-500 pl-3">
              Segera lakukan sinkronisasi status bagi siswa yang belum memiliki keterangan Masuk untuk validasi Emis Pusat.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <StatCard title="Total Siswa" value={totalSiswa} color="slate" loading={loading} />
          <StatCard title="Siswa Aktif" value={siswaAktif} color="emerald" loading={loading} />
          <StatCard title="Belum Aktif" value={siswaTidakAktif} color="rose" loading={loading} />
          <StatCard title="Jumlah Rombel" value={dataRombel.length} color="blue" loading={loading} />
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="flex border-b">
            <button onClick={() => setTabAktif('semua')} className={`flex-1 p-4 text-xs font-black uppercase tracking-widest ${tabAktif === 'semua' ? 'bg-white text-emerald-700 border-b-4 border-emerald-700' : 'bg-slate-50 text-slate-400'}`}>Daftar Siswa</button>
            <button onClick={() => setTabAktif('rombel')} className={`flex-1 p-4 text-xs font-black uppercase tracking-widest ${tabAktif === 'rombel' ? 'bg-white text-emerald-700 border-b-4 border-emerald-700' : 'bg-slate-50 text-slate-400'}`}>Rombongan Belajar</button>
          </div>

          <div className="p-2">
            {tabAktif === 'semua' ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="text-[10px] uppercase text-slate-400 font-bold bg-slate-50">
                    <tr><th className="p-4">Nama Lengkap</th><th className="p-4">NISN</th><th className="p-4">Kelas</th><th className="p-4">Status Keaktifan</th></tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {siswa.map((s, i) => (
                      <tr key={i} className="hover:bg-slate-50">
                        <td className="p-4 font-black text-slate-8
