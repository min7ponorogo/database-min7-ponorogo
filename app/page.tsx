"use client";

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import Header from './components/Header';
import Sidebar from './components/Sidebar';

export default function Home() {
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
    const currentData = db[menuAktif as keyof typeof db] || [];
    return currentData.filter((item: any) => 
      JSON.stringify(item).toLowerCase().includes(search.toLowerCase())
    );
  };

  return (
    <div className="flex flex-col h-screen bg-[#F8FAFC] font-sans text-slate-900">
      <Header search={search} setSearch={setSearch} />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar aktif={menuAktif} setAktif={setMenuAktif} />
        
        <main className="flex-1 overflow-y-auto p-6 lg:p-10 relative">
          {/* Background Pattern */}
          <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

          <div className="relative z-10">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-[60vh]">
                <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-700 rounded-full animate-spin"></div>
                <p className="mt-4 text-emerald-800 font-bold animate-pulse">Menghubungkan ke Database...</p>
              </div>
            ) : menuAktif === 'dashboard' ? (
              <DashboardView db={db} />
            ) : (
              <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-2xl shadow-slate-200/50 overflow-hidden animate-in fade-in zoom-in-95 duration-500">
                <div className="p-8 border-b border-slate-50 bg-gradient-to-r from-white to-slate-50/50 flex justify-between items-center">
                  <div>
                    <h3 className="text-2xl font-black uppercase tracking-tight text-slate-800">{menuAktif}</h3>
                    <p className="text-xs text-slate-400 font-bold mt-1 tracking-widest uppercase">Database Terintegrasi</p>
                  </div>
                  <div className="bg-emerald-500 text-white text-[10px] font-black px-4 py-2 rounded-2xl shadow-lg shadow-emerald-200">
                    {getFilteredData().length} TOTAL DATA
                  </div>
                </div>
                
                <div className="p-12 text-center">
                  <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center mx-auto mb-4 text-3xl">📁</div>
                  <h4 className="text-lg font-bold text-slate-800">Tampilan Data {menuAktif}</h4>
                  <p className="text-slate-500 text-sm max-w-xs mx-auto mt-2">Gunakan komponen DataTable untuk merender data ini ke dalam tabel yang interaktif.</p>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

function DashboardView({ db }: { db: any }) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      {/* Hero Welcome */}
      <div className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 p-10 rounded-[3rem] text-white shadow-2xl shadow-emerald-900/20 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-6
