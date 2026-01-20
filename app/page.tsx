"use client";
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import Header from './components/Header';
import Sidebar from './components/Sidebar';

// MASUKKAN DATA DARI FOTO ANDA DI SINI
const supabaseUrl = 'https://psdyvshvpsatidpizfbe.supabase.co'; 
const supabaseKey = 'MASUKKAN_ANON_PUBLIC_KEY_DARI_FOTO_ANDA';

const supabase = createClient(supabaseUrl, supabaseKey);

export default function Dashboard() {
  const [dataSiswa, setDataSiswa] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [menuAktif, setMenuAktif] = useState('dashboard');
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function fetchData() {
      // Mengambil data dari tabel 'Data Siswa' sesuai nama di CSV/Supabase Anda
      const { data, error } = await supabase
        .from('Data Siswa') 
        .select('*');
      
      if (!error && data) {
        setDataSiswa(data);
      } else {
        console.error("Error fetching:", error);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  // Filter pencarian berdasarkan nama
  const filteredSiswa = dataSiswa.filter(s => 
    s.NAMA?.toLowerCase().includes(search.toLowerCase())
  );

  // Statistik Otomatis
  const totalSiswa = dataSiswa.length;
  const lakiLaki = dataSiswa.filter(s => s['JENIS KELAMIN'] === 'L').length;
  const perempuan = dataSiswa.filter(s => s['JENIS KELAMIN'] === 'P').length;
  const aktif = dataSiswa.filter(s => s['STATUS SISWA'] === 'Masuk').length;

  return (
    <div className="flex flex-col h-screen bg-slate-50 text-slate-900 font-sans">
      <Header search={search} setSearch={setSearch} />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar aktif={menuAktif} setAktif={setMenuAktif} />

        <main className="flex-1 overflow-y-auto p-8">
          {/* KARTU STATISTIK */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm transition-transform hover:scale-[1.02]">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Seluruh Siswa</p>
              <p className="text-4xl font-black text-emerald-600">{totalSiswa}</p>
            </div>
            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm transition-transform hover:scale-[1.02]">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Siswa Aktif</p>
              <p className="text-4xl font-black text-emerald-600">{aktif}</p>
            </div>
            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm transition-transform hover:scale-[1.02]">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Laki-Laki</p>
              <p className="text-4xl font-black text-blue-600">{lakiLaki}</p>
            </div>
            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm transition-transform hover:scale-[1.02]">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Perempuan</p>
              <p className="text-4xl font-black text-pink-600">{perempuan}</p>
            </div>
          </div>

          {/* TABEL DATA */}
          <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-50 flex justify-between items-center">
              <h3 className="text-lg font-black text-slate-800">Daftar Siswa Digital</h3>
              {search && <span className="text-xs bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full font-bold">Hasil pencarian: {filteredSiswa.length}</span>}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                    <th className="p-4 pl-8 text-center">No</th>
                    <th className="p-4">Nama Lengkap</th>
                    <th className="p-4">NISN</th>
                    <th className="p-4">Tempat Lahir</th>
                    <th className="p-4 text-center">Kelas</th>
                    <th className="p-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {loading ? (
                    <tr><td colSpan={6} className="p-12 text-center text-slate-400 italic">Sedang menyinkronkan dengan Supabase...</td></tr>
                  ) : filteredSiswa.length === 0 ? (
                    <tr><td colSpan={6} className="p-12 text-center text-slate-400 font-bold">Data tidak ditemukan.</td></tr>
                  ) : filteredSiswa.map((s, i) => (
                    <tr key={s.ID || i} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                      <td className="p-4 pl-8 text-center text-slate-400 font-medium">{i + 1}</td>
                      <td className="p-4 font-bold text-slate-700">{s.NAMA}</td>
                      <td className="p-4 text-slate-500 font-mono text-xs">{s.NISN}</td>
                      <td className="p-4 text-slate-500">{s['TEMPAT LAHIR']}</td>
                      <td className="p-4 text-center font-bold text-slate-600">
                        <span className="bg-slate-100 px-3 py-1 rounded-lg text-[10px]">{s['DITERIMA DI KELAS']}</span>
                      </td>
                      <td className="p-4 text-center">
                        <span className="bg-emerald-100 text-emerald
