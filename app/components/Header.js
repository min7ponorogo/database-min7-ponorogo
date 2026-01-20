"use client";

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import DataTable from './components/DataTable';

export default function Home() {
  const [db, setDb] = useState({ siswa: [], alamat: [], ortu: [], aktivitas: [] });
  const [menuAktif, setMenuAktif] = useState('dashboard');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
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
    const currentData = db[menuAktif] || [];
    return currentData.filter((item) => 
      JSON.stringify(item).toLowerCase().includes(search.toLowerCase())
    );
  };

  return (
    <div className="flex flex-col h-screen bg-[#F8FAFC]">
      <Header search={search} setSearch={setSearch} />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar aktif={menuAktif} setAktif={setMenuAktif} />
        
        <main className="flex-1 overflow-y-auto p-6 relative">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-emerald-700"></div>
            </div>
          ) : menuAktif === 'dashboard' ? (
            <div className="space-y-6">
              {/* Hero Section yang sudah diperbaiki tanda petiknya */}
              <div className="bg-emerald-900 p-10 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden">
                <div className="relative z-10">
                  <h2 className="text-3xl font-black italic">Ahlan wa Sahlan! 👋</h2>
                  <p className="opacity-70 mt-2">Sistem Database Terpadu MIN 7 Ponorogo</p>
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatCard label="Total Siswa" val={db.siswa.length} color="text-emerald-600" />
                <StatCard label="Data Alamat" val={db.alamat.length} color="text-blue-600" />
                <StatCard label="Wali Murid" val={db.ortu.length} color="text-orange-600" />
                <StatCard label="Log Belajar" val={db.aktivitas.length} color="text-purple-600" />
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-[2rem] shadow-xl border border-slate-200 overflow-hidden">
              <div className="p-6 border-b flex justify-between items-center bg-slate-50/50">
                <h3 className="font-black uppercase text-slate-700">Database {menuAktif}</h3>
                <span className="text-[10px] font-black bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full uppercase">
                  {getFilteredData().length} Total
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

function StatCard({ label, val, color }) {
  return (
    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
      <h3 className={`text-4xl font-black mt-2 ${color}`}>{val}</h3>
    </div>
  );
}
