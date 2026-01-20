"use client";
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import Header from './components/Header';
import Sidebar from './components/Sidebar';

// Menggunakan URL dan Anon Key terbaru yang Anda berikan
const supabase = createClient(
  'https://zbqalxllyrlgtwqbourc.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpicWFseGxseXJsZ3R3cWJvdXJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgzNTY2NzYsImV4cCI6MjA4MzkzMjY3Nn0.Z-FoLjelSimsWN4XW7qs8pbB_Dx0DjDkMwjNMG7udbY'
);

export default function Dashboard() {
  const [stats, setStats] = useState({ total: 0, aktif: 0, l: 0, p: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function ambilData() {
      setLoading(true);
      try {
        // MENGGUNAKAN NAMA TABEL SESUAI FILE CSV ANDA (_rows)
        const [resSiswa, resAktivitas] = await Promise.all([
          supabase.from('Data Siswa_rows').select('ID, JENIS KELAMIN'),
          supabase.from('Aktivitas Belajar_rows').select('ID, STATUS BELAJAR')
        ]);

        if (resSiswa.data) {
          const profil = resSiswa.data;
          setStats(prev => ({
            ...prev,
            total: profil.length,
            // Cek 'L' atau 'P' sesuai isi kolom JENIS KELAMIN di CSV Anda
            l: profil.filter(s => s['JENIS KELAMIN'] === 'L').length,
            p: profil.filter(s => s['JENIS KELAMIN'] === 'P').length,
          }));
        }

        if (resAktivitas.data) {
          const aktivitas = resAktivitas.data;
          // Menghitung status 'Aktif' dari kolom STATUS BELAJAR
          const countAktif = aktivitas.filter(a => a['STATUS BELAJAR']?.trim() === 'Aktif').length;
          setStats(prev => ({ ...prev, aktif: countAktif }));
        }

      } catch (err) {
        console.error("System Error:", err);
      } finally {
        setLoading(false);
      }
    }
    ambilData();
  }, []);

  return (
    <div className="flex flex-col h-screen bg-slate-50 text-slate-900 font-sans">
      <Header search="" setSearch={() => {}} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar aktif="dashboard" setAktif={() => {}} />
        <main className="flex-1 overflow-y-auto p-8">
          
          <div className="bg-[#065f46] text-white p-10 rounded-[2.5rem] mb-10 shadow-xl relative overflow-hidden transition-all hover:scale-[1.01]">
             <div className="relative z-10">
                <h2 className="text-5xl font-black mb-3 italic tracking-tight">Ahlan wa Sahlan! 👋</h2>
                <p className="text-emerald-100 text-lg font-medium opacity-90 italic">Sistem Informasi Siswa Digital MIN 7 Ponorogo</p>
             </div>
             <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <StatCard title="Seluruh Siswa" val={stats.total} load={loading} col="text-emerald-600" />
            <StatCard title="Siswa Aktif" val={stats.aktif} load={loading} col="text-emerald-600" />
            <StatCard title="Laki-Laki" val={stats.l} load={loading} col="text-blue-600" icon="👦" />
            <StatCard title="Perempuan" val={stats.p} load={loading} col="text-pink-600" icon="👧" />
          </div>

          <div className="mt-12 text-center text-slate-300 text-[10px] font-bold tracking-[0.3em] uppercase">
            Terhubung ke Database: zbqalxllyrlgtwqbourc
          </div>
        </main>
      </div>
    </div>
  );
}

function StatCard({ title, val, load, col, icon }: any) {
  return (
    <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm transition-all hover:shadow-md">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">{title}</p>
      <div className="flex items-center justify-between">
        <p className={`text-5xl font-black ${col}`}>{load ? "..." : val}</p>
        {icon && <span className="text-3xl">{icon}</span>}
      </div>
    </div>
  );
}
