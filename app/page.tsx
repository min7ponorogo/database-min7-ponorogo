"use client";
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import Header from './components/Header';
import Sidebar from './components/Sidebar';

// Masukkan kredensial Supabase Anda di sini
const supabaseUrl = 'https://psdyvshvpsatidpizfbe.supabase.co'; 
const supabaseKey = 'MASUKKAN_ANON_PUBLIC_KEY_ANDA'; 

const supabase = createClient(supabaseUrl, supabaseKey);

export default function Dashboard() {
  const [dataSiswa, setDataSiswa] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [menuAktif, setMenuAktif] = useState('dashboard');
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase
        .from('Data Siswa')
        .select('*');
      
      if (!error && data) {
        setDataSiswa(data);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  // Logika Perhitungan Statistik Otomatis
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
          
          {/* BANNER AHLAN WA SAHLAN - SUDAH KEMBALI */}
          <div className="bg-[#065f46] text-white p-10 rounded-[2.5rem] mb-10 shadow-xl relative overflow-hidden transition-all hover:shadow-emerald-900/20">
             <div className="relative z-10">
                <h2 className="text-5xl font-black mb-3 italic tracking-tight">Ahlan wa Sahlan! 👋</h2>
                <p className="text-emerald-100 text-lg font-medium opacity-90">
                  Selamat datang di Sistem Informasi Siswa Digital MIN 7 Ponorogo.
                </p>
             </div>
             {/* Dekorisasi Lingkaran di Background */}
             <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -mr-20 -mt-20 blur-2xl"></div>
             <div className="absolute bottom-0 left-0 w-40 h-40 bg-emerald-400/10 rounded-full -ml-10 -mb-10 blur-xl"></div>
          </div>

          {/* KARTU STATISTIK (TANPA DAFTAR SISWA DI BAWAHNYA) */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2 group-hover:text-emerald-600 transition-colors">Seluruh Siswa</p>
              <p className="text-5xl font-black text-emerald-600">{loading ? '...' : totalSiswa}</p>
            </div>

            <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2 group-hover:text-emerald-600 transition-colors">Siswa Aktif</p>
              <p className="text-5xl font-black text-emerald-600">{loading ? '...' : aktif}</p>
            </div>

            <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2 group-hover:text-blue-600 transition-colors">Laki-Laki</p>
              <div className="flex items-center justify-between">
                <p className="text-5xl font-black text-blue-600">{loading ? '...' : lakiLaki}</p>
                <span className="text-3xl">👦</span>
              </div>
            </div>

            <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2 group-hover:text-pink-600 transition-colors">Perempuan</p>
              <div className="flex items-center justify-between">
                <p className="text-5xl font-black text-pink-600">{loading ? '...' : perempuan}</p>
                <span className="text-3xl">👧</span>
              </div>
            </div>
          </div>

          {/* Bagian bawah Dashboard sekarang bersih tanpa tabel */}
          <div className="mt-12 text-center text-slate-300 text-xs font-medium tracking-widest uppercase">
            Data tersinkronisasi otomatis dengan Database Supabase
          </div>

        </main>
      </div>
    </div>
  );
}
