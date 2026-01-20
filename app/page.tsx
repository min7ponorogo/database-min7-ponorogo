"use client";
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import Header from './components/Header';
import Sidebar from './components/Sidebar';

// Konfigurasi Supabase Anda
const supabase = createClient(
  'https://zbqalxllyrlgtwqbourc.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpicWFseGxseXJsZ3R3cWJvdXJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgzNTY2NzYsImV4cCI6MjA4MzkzMjY3Nn0.Z-FoLjelSimsWN4XW7qs8pbB_Dx0DjDkMwjNMG7udbY'
);

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, aktif: 0, l: 0, p: 0 });
  const [daftarSiswa, setDaftarSiswa] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        // 1. Ambil data dari tabel utama (Gunakan nama tabel kecil sesuai dashboard Supabase)
        const { data: siswa, error: errSiswa } = await supabase
          .from('data_siswa_rows')
          .select('ID, NAMA, NISN, JENIS KELAMIN');

        const { data: aktivitas, error: errAktif } = await supabase
          .from('aktivitas_belajar_rows')
          .select('ID, STATUS BELAJAR');

        if (siswa) {
          setDaftarSiswa(siswa);
          setStats(prev => ({
            ...prev,
            total: siswa.length,
            l: siswa.filter(s => s['JENIS KELAMIN'] === 'L').length,
            p: siswa.filter(s => s['JENIS KELAMIN'] === 'P').length,
          }));
        }

        if (aktivitas) {
          const countAktif = aktivitas.filter(a => a['STATUS BELAJAR']?.trim() === 'Aktif').length;
          setStats(prev => ({ ...prev, aktif: countAktif }));
        }

      } catch (error) {
        console.error("Error mengambil data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="flex flex-col h-screen bg-slate-50 text-slate-900 font-sans">
      <Header search="" setSearch={() => {}} />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar aktif="dashboard" setAktif={() => {}} />

        <main className="flex-1 overflow-y-auto p-8">
          
          {/* Banner Utama */}
          <div className="bg-[#065f46] text-white p-10 rounded-[2.5rem] mb-10 shadow-xl relative overflow-hidden">
             <div className="relative z-10">
                <h2 className="text-5xl font-black mb-3 italic tracking-tight">Ahlan wa Sahlan! 👋</h2>
                <p className="text-emerald-100 text-lg font-medium opacity-90">
                  Sistem Informasi Siswa Digital MIN 7 Ponorogo
                </p>
             </div>
             <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
          </div>

          {/* Grid Statistik */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <StatCard title="Seluruh Siswa" value={stats.total} loading={loading} color="text-emerald-600" />
            <StatCard title="Siswa Aktif" value={stats.aktif} loading={loading} color="text-emerald-600" />
            <StatCard title="Laki-Laki" value={stats.l} loading={loading} color="text-blue-600" icon="👦" />
            <StatCard title="Perempuan" value={stats.p} loading={loading} color="text-pink-600" icon="👧" />
          </div>

          {/* Tabel Daftar Siswa Terkini */}
          <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-50 flex justify-between items-center">
              <h3 className="font-bold text-slate-800">Daftar Siswa Terkini</h3>
              <span className="text-xs bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full font-bold">Live Data</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 text-slate-400 text-[10px] uppercase tracking-widest">
                    <th className="p-4 pl-8">ID</th>
                    <th className="p-4">Nama Lengkap</th>
                    <th className="p-4">NISN</th>
                    <th className="p-4">Gender</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {loading ? (
                    <tr><td colSpan={4} className="p-10 text-center text-slate-400">Memuat data...</td></tr>
                  ) : daftarSiswa.slice(0, 10).map((s) => (
                    <tr key={s.ID} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                      <td className="p-4 pl-8 font-medium text-slate-400">{s.ID}</td>
                      <td className="p-4 font-bold text-slate-700">{s.NAMA}</td>
                      <td className="p-4 text-slate-500">{s.NISN}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${s['JENIS KELAMIN'] === 'L' ? 'bg-blue-50 text-blue-600' : 'bg-pink-50 text-pink-600'}`}>
                          {s['JENIS KELAMIN'] === 'L' ? 'LAKI-LAKI' : 'PEREMPUAN'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}

function StatCard({ title, value, loading, color, icon }: any) {
  return (
    <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">{title}</p>
      <div className="flex items-center justify-between">
        <p className={`text-5xl font-black ${color}`}>{loading ? "..." : value}</p>
        {icon && <span className="text-3xl">{icon}</span>}
      </div>
    </div>
  );
}
