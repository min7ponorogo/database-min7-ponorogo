"use client";
import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';

// Perhatikan penulisan './components/...'
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import DataTable from './components/DataTable';

export default function Home() {
  const [db, setDb] = useState({ siswa: [], alamat: [], ortu: [], aktivitas: [] });
  const [menuAktif, setMenuAktif] = useState('dashboard');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

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
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [supabase]);

  const getFilteredData = () => {
    const currentData = (db as any)[menuAktif] || [];
    return currentData.filter((item: any) => 
      JSON.stringify(item).toLowerCase().includes(search.toLowerCase())
    );
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 text-slate-900">
      <Header search={search} setSearch={setSearch} />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar aktif={menuAktif} setAktif={setMenuAktif} />
        
        <main className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center h-full font-bold animate-pulse text-emerald-700">
              Memuat Data Madrasah...
            </div>
          ) : menuAktif === 'dashboard' ? (
            <div className="space-y-6">
              <div className="bg-emerald-800 p-10 rounded-[2rem] text-white shadow-xl">
                <h2 className="text-3xl font-black">Ahlan wa Sahlan! 👋</h2>
                <p className="opacity-80 mt-2">Selamat datang di Panel Admin MIN 7 Ponorogo.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded-3xl border shadow-sm">
                  <p className="text-xs font-bold text-slate-400 uppercase">Total Siswa</p>
                  <p className="text-3xl font-black text-emerald-600">{db.siswa.length}</p>
                </div>
                <div className="bg-white p-6 rounded-3xl border shadow-sm">
                  <p className="text-xs font-bold text-slate-400 uppercase">Data Alamat</p>
                  <p className="text-3xl font-black text-blue-600">{db.alamat.length}</p>
                </div>
                <div className="bg-white p-6 rounded-3xl border shadow-sm">
                  <p className="text-xs font-bold text-slate-400 uppercase">Wali Murid</p>
                  <p className="text-3xl font-black text-orange-600">{db.ortu.length}</p>
                </div>
                <div className="bg-white p-6 rounded-3xl border shadow-sm">
                  <p className="text-xs font-bold text-slate-400 uppercase">Log Belajar</p>
                  <p className="text-3xl font-black text-purple-600">{db.aktivitas.length}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-[2rem] shadow-xl border overflow-hidden">
              <div className="p-6 bg-slate-50 border-b flex justify-between items-center">
                <h3 className="font-black uppercase">Data {menuAktif}</h3>
                <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold">
                  {getFilteredData().length} Baris
                </span>
              </div>
              <DataTable data={getFilteredData()} />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
