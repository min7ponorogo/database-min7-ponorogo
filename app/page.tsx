"use client";

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import Header from './components/Header';
import Sidebar from './components/Sidebar';

export default function Home() {
  // State utama untuk menyimpan semua data dari database
  const [db, setDb] = useState<any>({ 
    siswa: [], 
    alamat: [], 
    ortu: [], 
    aktivitas: [] 
  });
  
  const [menuAktif, setMenuAktif] = useState('dashboard');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Mengambil semua data secara paralel agar cepat
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [s, a, o, ak] = await Promise.all([
          supabase.from('Data Siswa').select('*'),
          supabase.from('Data Alamat').select('*'),
          supabase.from('Data Orang Tua').select('*'),
          supabase.from('Aktivitas Belajar').select('*')
        ]);

        setDb({ 
          siswa: s.data || [], 
          alamat: a.data || [], 
          ortu: o.data || [], 
          aktivitas: ak.data || [] 
        });
      } catch (error) {
        console.error("Gagal mengambil data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [supabase]);

  // Fungsi pencarian otomatis
  const getFilteredData = () => {
    const currentData = db[menuAktif as keyof typeof db] || [];
    if (!search) return currentData;
    return currentData.filter((item: any) => 
      JSON.stringify(item).toLowerCase().includes(search.toLowerCase())
    );
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 font-sans text-slate-900">
      {/* 1. Komponen Header */}
      <Header search={search} setSearch={setSearch} />
      
      <div className="flex flex-1 overflow-hidden">
        {/* 2. Komponen Sidebar */}
        <Sidebar aktif={menuAktif} setAktif={setMenuAktif} />
        
        {/* 3. Area Konten Utama */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-10 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px]">
          
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-700"></div>
            </div>
          ) : menuAktif === 'dashboard' ? (
            /* TAMPILAN DASHBOARD */
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-emerald-900/5 border border-white flex flex-col md:flex-row justify-between items-center gap-6">
                <div>
                  <h2 className="text-4xl font-black text-slate-900 tracking-tight">Selamat Datang! 👋</h2>
                  <p className="text-slate-500 mt-2 font-medium italic">Sistem Informasi Digital Terpadu MIN 7 Ponorogo</p>
                </div>
                <div className="hidden md:flex -space-x-4">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center text-2xl shadow-inner">🕌</div>
                  <div className="w-16 h-16 rounded-2xl bg-orange-100 flex items-center justify-center text-2xl shadow-inner">📚</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard label="Total Siswa" val={db.siswa.length} color="emerald" />
                <StatCard label="Data Alamat" val={db.alamat.length} color="blue" />
                <StatCard label="Data Wali" val={db.ortu.length} color="orange" />
                <StatCard label="Log Aktivitas" val={db.aktivitas.length} color="purple" />
              </div>
            </div>
          ) : (
            /* TAMPILAN TABEL DATA */
            <div className="bg-white rounded-[2rem] border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500">
               <div className="p-8 border-b border-slate-50 flex justify-between items-center">
                  <h3 className="text-xl font-black uppercase tracking-tight text-slate-800">Data {menuAktif}</h3>
                  <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full">
                    {getFilteredData().length} Baris ditemukan
                  </span>
               </div>
               
               <div className="p-4">
                  {/* Di sini nanti kita panggil <DataTable /> */}
                  <p className="text-center text-slate-400 p-20 italic">
                    Gunakan file DataTable.tsx untuk menampilkan isi tabel ini agar lebih rapi.
                  </p>
               </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

// Komponen Kecil untuk Kartu Statistik agar tidak mengulang kode
function StatCard({ label, val, color }: { label: string, val: number, color: string }) {
  const colors: any = {
    emerald: "text-emerald-600 bg-emerald-50",
    blue: "text-blue-600 bg-blue-50",
    orange: "text-orange-600 bg-orange-50",
    purple: "text-purple-600 bg-purple-50",
  };
  
  return (
    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
      <h3 className={`text-4xl font-black mt-2 ${colors[color].split(' ')[0]}`}>{val}</h3>
    </div>
  );
}
