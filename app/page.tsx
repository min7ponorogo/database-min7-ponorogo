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
  const [rombelList, setRombelList] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    async function ambilData() {
      try {
        setLoading(true);
        
        // 1. Ambil data profil siswa
        const { data: profil, error: err1 } = await supabase
          .from('data_siswa') 
          .select('*');

        // 2. Ambil data aktivitas belajar
        const { data: aktivitas, error: err2 } = await supabase
          .from('aktivitas_belajar')
          .select('*');

        if (err1 || err2) {
          setErrorMsg(err1?.message || err2?.message || "Gagal koneksi");
          return;
        }

        if (profil) {
          // Filter Jenis Kelamin (Cek huruf L/P atau angka 1/2 sesuai database)
          const cowok = profil.filter(s => String(s['JENIS KELAMIN']).startsWith('L') || String(s['JENIS KELAMIN']) === '1').length;
          const cewek = profil.filter(s => String(s['JENIS KELAMIN']).startsWith('P') || String(s['JENIS KELAMIN']) === '2').length;
          
          setStats(prev => ({
            ...prev,
            total: profil.length,
            l: cowok,
            p: cewek
          }));
        }

        if (aktivitas) {
          // Hitung siswa aktif
          const aktif = aktivitas.filter(a => String(a['STATUS BELAJAR']).toLowerCase() === 'aktif').length;
          setStats(prev => ({ ...prev, aktif: aktif }));

          // Ambil daftar ROMBEL unik (Menghilangkan duplikat)
          const daftarRombel = Array.from(new Set(aktivitas.map(a => a.ROMBEL).filter(Boolean)));
          setRombelList(daftarRombel as string[]);
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
          
          {errorMsg && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              <strong>Error Database:</strong> {errorMsg} 
            </div>
          )}

          <div className="bg-[#065f46] text-white p-10 rounded-[2.5rem] mb-10 shadow-xl relative overflow-hidden">
             <h2 className="text-5xl font-black mb-3 italic">Ahlan wa Sahlan! 👋</h2>
             <p className="opacity-90 font-medium">MIN 7 Ponorogo - Sistem Informasi Digital</p>
          </div>

          {/* Statistik Utama */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
            <StatCard title="Total Siswa" val={stats.total} load={loading} col="text-emerald-600" />
            <StatCard title="Siswa Aktif" val={stats.aktif} load={loading} col="text-emerald-500" />
            
            {/* Kartu dengan Gambar Laki-Laki */}
            <StatCard title="Laki-Laki" val={stats.l} load={loading} col="text-blue-600" img="👦" />
            
            {/* Kartu dengan Gambar Perempuan */}
            <StatCard title="Perempuan" val={stats.p} load={loading} col="text-pink-600" img="👧" />
          </div>

          {/* Daftar Rombel dari tabel aktivitas_belajar */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span className="bg-emerald-100 p-2 rounded-lg">🏫</span> Daftar Rombel Tersedia
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {loading ? (
                <p className="text-slate-400 italic">Memuat rombel...</p>
              ) : rombelList.length > 0 ? (
                rombelList.sort().map((rombel, index) => (
                  <div key={index} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center hover:bg-emerald-50 hover:border-emerald-200 transition-all cursor-default">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Rombel</p>
                    <p className="font-black text-slate-700">{rombel}</p>
                  </div>
                ))
              ) : (
                <p className="text-slate-400 italic">Data rombel tidak ditemukan.</p>
              )}
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}

// Komponen StatCard yang sudah mendukung Gambar/Emoji
function StatCard({ title, val, load, col, img }: any) {
  return (
    <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm transition-all hover:shadow-md relative overflow-hidden group">
      <div className="relative z-10">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">{title}</p>
        <p className={`text-6xl font-black ${col}`}>{load ? "..." : val}</p>
      </div>
      
      {/* Gambar/Emoji di pojok kartu */}
      {img && (
        <div className="absolute -right-2 -bottom-2 text-7xl opacity-20 group-hover:opacity-40 transition-opacity grayscale group-hover:grayscale-0">
          {img}
        </div>
      )}
    </div>
  );
}
