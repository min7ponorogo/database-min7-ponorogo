"use client";
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import Header from './components/Header';
import Sidebar from './components/Sidebar';

// Pastikan URL dan Key ini sudah benar dari dashboard Supabase Anda
const supabaseUrl = 'https://psdyvshvpsatidpizfbe.supabase.co';
const supabaseKey = 'MASUKKAN_ANON_KEY_ANDA_DISINI';
const supabase = createClient(supabaseUrl, supabaseKey);

export default function Dashboard() {
  const [dataSiswa, setDataSiswa] = useState<any[]>([]);
  const [dataAktivitas, setDataAktivitas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSemuaData() {
      setLoading(true);
      try {
        // PERHATIKAN: Nama tabel harus persis sama dengan di Supabase
        const { data: profil, error: err1 } = await supabase.from('Data Siswa').select('*');
        const { data: aktivitas, error: err2 } = await supabase.from('Aktivitas Belajar').select('*');

        if (err1) console.error("Gagal ambil Data Siswa:", err1.message);
        if (err2) console.error("Gagal ambil Aktivitas Belajar:", err2.message);

        if (profil) setDataSiswa(profil);
        if (aktivitas) setDataAktivitas(aktivitas);
      } catch (error) {
        console.error("Terjadi kesalahan koneksi:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchSemuaData();
  }, []);

  // --- LOGIKA PERHITUNGAN BERDASARKAN ID ---
  
  // Seluruh Siswa: Berdasarkan jumlah baris di tabel 'Data Siswa'
  const totalSiswa = dataSiswa.length;

  // Siswa Aktif: Mencari status 'Aktif' di tabel 'Aktivitas Belajar'
  const jumlahAktif = dataAktivitas.filter(a => 
    a['STATUS BELAJAR']?.toString().trim() === 'Aktif'
  ).length;

  // Gender: Dari tabel 'Data Siswa'
  const lakiLaki = dataSiswa.filter(s => s['JENIS KELAMIN'] === 'L').length;
  const perempuan = dataSiswa.filter(s => s['JENIS KELAMIN'] === 'P').length;

  return (
    <div className="flex flex-col h-screen bg-slate-50 text-slate-900 font-sans">
      <Header search="" setSearch={() => {}} />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar aktif="dashboard" setAktif={() => {}} />

        <main className="flex-1 overflow-y-auto p-8">
          
          {/* Banner Ahlan wa Sahlan */}
          <div className="bg-[#065f46] text-white p-10 rounded-[2.5rem] mb-10 shadow-xl relative overflow-hidden">
             <div className="relative z-10">
                <h2 className="text-5xl font-black mb-3 italic tracking-tight">Ahlan wa Sahlan! 👋</h2>
                <p className="text-emerald-100 text-lg font-medium opacity-90">
                  Selamat datang di Sistem Informasi Siswa Digital MIN 7 Ponorogo.
                </p>
             </div>
             <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -mr-20 -mt-20 blur-2xl"></div>
          </div>

          {/* Grid Statistik */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <StatCard title="Seluruh Siswa" value={totalSiswa} color="text-emerald-600" loading={loading} />
            <StatCard title="Siswa Aktif" value={jumlahAktif} color="text-emerald-600" loading={loading} />
            <StatCard title="Laki-Laki" value={lakiLaki} color="text-blue-600" icon="👦" loading={loading} />
            <StatCard title="Perempuan" value={perempuan} color="text-pink-600" icon="👧" loading={loading} />
          </div>

          <div className="mt-12 text-center text-slate-300 text-xs font-medium tracking-widest uppercase">
            Data tersinkronisasi via ID Supabase
          </div>
        </main>
      </div>
    </div>
  );
}

// Komponen Card
function StatCard({ title, value, color, icon, loading }: any) {
  return (
    <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm transition-all hover:shadow-md">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">{title}</p>
      <div className="flex items-center justify-between">
        <p className={`text-5xl font-black ${color}`}>
          {loading ? "..." : value}
        </p>
        {icon && <span className="text-3xl">{icon}</span>}
      </div>
    </div>
  );
}
