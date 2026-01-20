"use client";
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import Header from './components/Header';
import Sidebar from './components/Sidebar';

const supabase = createClient(
  'https://psdyvshvpsatidpizfbe.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpicWFseGxseXJsZ3R3cWJvdXJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgzNTY2NzYsImV4cCI6MjA4MzkzMjY3Nn0.Z-FoLjelSimsWN4XW7qs8pbB_Dx0DjDkMwjNMG7udbY'
);

export default function Dashboard() {
  const [stats, setStats] = useState({ total: 0, aktif: 0, l: 0, p: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function ambilData() {
      setLoading(true);
      
      // Ambil data profil (Data Siswa)
      const { data: profil, error: errProfil } = await supabase
        .from('Data Siswa')
        .select('ID, JENIS KELAMIN');

      // Ambil data status (Aktivitas Belajar)
      const { data: aktivitas, error: errAktivitas } = await supabase
        .from('Aktivitas Belajar')
        .select('ID, STATUS BELAJAR');

      if (errProfil) console.error("Error Profil:", errProfil.message);
      if (errAktivitas) console.error("Error Aktivitas:", errAktivitas.message);

      if (profil && aktivitas) {
        setStats({
          total: profil.length,
          l: profil.filter(s => s['JENIS KELAMIN'] === 'L').length,
          p: profil.filter(s => s['JENIS KELAMIN'] === 'P').length,
          aktif: aktivitas.filter(a => a['STATUS BELAJAR'] === 'Aktif').length
        });
      }
      setLoading(false);
    }
    ambilData();
  }, []);

  return (
    <div className="flex flex-col h-screen bg-slate-50 text-slate-900 font-sans">
      <Header search="" setSearch={() => {}} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar aktif="dashboard" setAktif={() => {}} />
        <main className="flex-1 overflow-y-auto p-8">
          
          <div className="bg-[#065f46] text-white p-10 rounded-[2.5rem] mb-10 shadow-xl relative overflow-hidden">
             <div className="relative z-10">
                <h2 className="text-5xl font-black mb-3 italic tracking-tight">Ahlan wa Sahlan! 👋</h2>
                <p className="text-emerald-100 text-lg font-medium opacity-90 italic">Sistem Informasi Siswa Digital MIN 7 Ponorogo</p>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <Card title="Seluruh Siswa" val={stats.total} load={loading} col="text-emerald-600" />
            <Card title="Siswa Aktif" val={stats.aktif} load={loading} col="text-emerald-600" />
            <Card title="Laki-Laki" val={stats.l} load={loading} col="text-blue-600" icon="👦" />
            <Card title="Perempuan" val={stats.p} load={loading} col="text-pink-600" icon="👧" />
          </div>

        </main>
      </div>
    </div>
  );
}

function Card({ title, val, load, col, icon }: any) {
  return (
    <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">{title}</p>
      <div className="flex items-center justify-between">
        <p className={`text-5xl font-black ${col}`}>{load ? "..." : val}</p>
        {icon && <span className="text-3xl">{icon}</span>}
      </div>
    </div>
  );
}
