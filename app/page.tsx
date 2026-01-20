"use client";
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import Header from './components/Header';
import Sidebar from './components/Sidebar';

const supabase = createClient(
  'https://zbqalxllyrlgtwqbourc.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpicWFseGxseXJsZ3R3cWJvdXJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgzNTY2NzYsImV4cCI6MjA4MzkzMjY3Nn0.Z-FoLjelSimsWN4XW7qs8pbB_Dx0DjDkMwjNMG7udbY'
);

export default function Dashboard() {
  const [stats, setStats] = useState({ total: 0, aktif: 0, l: 0, p: 0 });
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    async function ambilData() {
      try {
        setLoading(true);
        
        // Coba ambil dari tabel data_siswa_rows (Huruf Kecil)
        const { data: profil, error: err1 } = await supabase
          .from('data_siswa_rows') 
          .select('*');

        const { data: aktivitas, error: err2 } = await supabase
          .from('aktivitas_belajar_rows')
          .select('*');

        if (err1 || err2) {
          console.error("Detail Error:", err1 || err2);
          setErrorMsg(err1?.message || err2?.message || "Gagal koneksi");
          return;
        }

        if (profil) {
          // Kita gunakan filter yang lebih fleksibel (cek L atau Laki-laki)
          const cowok = profil.filter(s => String(s['JENIS KELAMIN']).startsWith('L')).length;
          const cewek = profil.filter(s => String(s['JENIS KELAMIN']).startsWith('P')).length;
          
          setStats(prev => ({
            ...prev,
            total: profil.length,
            l: cowok,
            p: cewek
          }));
        }

        if (aktivitas) {
          const aktif = aktivitas.filter(a => String(a['STATUS BELAJAR']).toLowerCase() === 'aktif').length;
          setStats(prev => ({ ...prev, aktif: aktif }));
        }

      } catch (err: any) {
        setErrorMsg(err.message);
      } finally {
        setLoading(false);
      }
    }
    ambilData();
  }, []);

  return (
    <div className="flex flex-col h-screen bg-slate-50 text-slate-900">
      <Header search="" setSearch={() => {}} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar aktif="dashboard" setAktif={() => {}} />
        <main className="flex-1 p-8 overflow-y-auto">
          
          {/* Alert jika ada error */}
          {errorMsg && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              <strong>Error Database:</strong> {errorMsg} 
              <p className="text-xs">Pastikan nama tabel di Supabase adalah "data_siswa_rows" (huruf kecil semua)</p>
            </div>
          )}

          <div className="bg-[#065f46] text-white p-10 rounded-[2.5rem] mb-10 shadow-xl relative overflow-hidden">
             <h2 className="text-5xl font-black mb-3 italic">Ahlan wa Sahlan! 👋</h2>
             <p className="opacity-90">MIN 7 Ponorogo - Data Terkoneksi</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <StatCard title="Total Siswa" val={stats.total} load={loading} col="text-emerald-600" />
            <StatCard title="Siswa Aktif" val={stats.aktif} load={loading} col="text-emerald-500" />
            <StatCard title="Laki-Laki" val={stats.l} load={loading} col="text-blue-600" />
            <StatCard title="Perempuan" val={stats.p} load={loading} col="text-pink-600" />
          </div>

          <div className="mt-10 p-6 bg-white rounded-xl border border-dashed border-slate-300">
             <h4 className="font-bold mb-2">Tips Debugging:</h4>
             <p className="text-sm text-slate-500">1. Tekan <strong>F12</strong> di keyboard (Inspect Element).</p>
             <p className="text-sm text-slate-500">2. Klik tab <strong>Console</strong>.</p>
             <p className="text-sm text-slate-500">3. Jika ada tulisan merah "Table not found", berarti nama tabel di Supabase berbeda dengan di kode.</p>
          </div>
        </main>
      </div>
    </div>
  );
}

function StatCard({ title, val, load, col }: any) {
  return (
    <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm transition-all hover:scale-105">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">{title}</p>
      <p className={`text-6xl font-black ${col}`}>{load ? "..." : val}</p>
    </div>
  );
}
