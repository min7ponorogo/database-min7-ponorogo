"use client";
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import Header from './components/Header';
import Sidebar from './components/Sidebar';

const supabase = createClient(
  'https://psdyvshvpsatidpizfbe.supabase.co',
  'KEY_ANON_ANDA'
);

export default function Dashboard() {
  const [dataSiswa, setDataSiswa] = useState<any[]>([]);
  const [dataAktivitas, setDataAktivitas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSemuaData() {
      // Mengambil data dari kedua tabel secara paralel
      const [resSiswa, resAktivitas] = await Promise.all([
        supabase.from('Data Siswa').select('*'),
        supabase.from('Aktivitas Belajar').select('*')
      ]);

      if (resSiswa.data) setDataSiswa(resSiswa.data);
      if (resAktivitas.data) setDataAktivitas(resAktivitas.data);
      
      setLoading(false);
    }
    fetchSemuaData();
  }, []);

  // HITUNG BERDASARKAN ID
  const totalSiswa = dataSiswa.length;
  
  // Menghitung aktif dari tabel Aktivitas Belajar
  const jumlahAktif = dataAktivitas.filter(a => a['STATUS BELAJAR'] === 'Aktif').length;
  
  const lakiLaki = dataSiswa.filter(s => s['JENIS KELAMIN'] === 'L').length;
  const perempuan = dataSiswa.filter(s => s['JENIS KELAMIN'] === 'P').length;

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      <Header search="" setSearch={() => {}} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar aktif="dashboard" setAktif={() => {}} />
        
        <main className="flex-1 p-8 overflow-y-auto">
          {/* Banner Ahlan wa Sahlan */}
          <div className="bg-[#065f46] text-white p-10 rounded-[2.5rem] mb-10 shadow-lg relative overflow-hidden">
             <div className="relative z-10">
                <h2 className="text-5xl font-black mb-2 italic">Ahlan wa Sahlan! 👋</h2>
                <p className="opacity-90">Sistem Informasi Siswa Digital MIN 7 Ponorogo</p>
             </div>
          </div>

          {/* Statistik dari Supabase */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatCard title="Seluruh Siswa" value={totalSiswa} color="text-emerald-600" loading={loading} />
            <StatCard title="Siswa Aktif" value={jumlahAktif} color="text-emerald-600" loading={loading} />
            <StatCard title="Laki-Laki" value={lakiLaki} color="text-blue-600" icon="👦" loading={loading} />
            <StatCard title="Perempuan" value={perempuan} color="text-pink-600" icon="👧" loading={loading} />
          </div>
        </main>
      </div>
    </div>
  );
}

// Komponen Kecil untuk Kartu agar kode bersih
function StatCard({ title, value, color, icon, loading }: any) {
  return (
    <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{title}</p>
      <div className="flex items-center justify-between">
        <p className={`text-5xl font-black ${color}`}>{loading ? '...' : value}</p>
        {icon && <span className="text-3xl">{icon}</span>}
      </div>
    </div>
  );
}
