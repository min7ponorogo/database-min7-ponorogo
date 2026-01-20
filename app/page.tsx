"use client";
import { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';

export default function Dashboard() {
  const [menuAktif, setMenuAktif] = useState('dashboard');
  const [search, setSearch] = useState('');

  return (
    <div className="flex flex-col h-screen bg-slate-50 text-slate-900">
      {/* Header dengan Search terintegrasi */}
      <Header search={search} setSearch={setSearch} />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar dengan menu baru yang kita bahas sebelumnya */}
        <Sidebar aktif={menuAktif} setAktif={setMenuAktif} />

        {/* Konten Utama */}
        <main className="flex-1 overflow-y-auto p-8">
          
          {/* Banner Ahlan wa Sahlan */}
          <div className="bg-[#065f46] text-white p-8 rounded-[2rem] mb-8 shadow-lg relative overflow-hidden">
             <div className="relative z-10">
                <h2 className="text-4xl font-black mb-2 italic">Ahlan wa Sahlan! 👋</h2>
                <p className="text-emerald-100 font-medium">Selamat datang di Sistem Informasi Siswa Digital MIN 7 Ponorogo.</p>
             </div>
             {/* Hiasan abstrak di background banner */}
             <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20"></div>
          </div>

          {/* Grid Statistik Kesiswaan (Menggantikan Alamat, Wali, Log) */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            
            {/* Seluruh Siswa */}
            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">Seluruh Siswa</p>
              <div className="flex items-end justify-between">
                <p className="text-4xl font-black text-emerald-600">137</p>
                <span className="text-xs font-bold text-slate-300 mb-1">TOTAL</span>
              </div>
            </div>

            {/* Siswa Aktif */}
            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">Siswa Aktif</p>
              <div className="flex items-end justify-between">
                <p className="text-4xl font-black text-emerald-600">135</p>
                <span className="text-xs font-bold text-emerald-500 mb-1">ONLINE</span>
              </div>
            </div>

            {/* Siswa Laki-Laki */}
            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">Laki-Laki</p>
              <div className="flex items-end justify-between">
                <p className="text-4xl font-black text-blue-600">70</p>
                <span className="text-xl">👦</span>
              </div>
            </div>

            {/* Siswa Perempuan */}
            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">Perempuan</p>
              <div className="flex items-end justify-between">
                <p className="text-4xl font-black text-pink-600">67</p>
                <span className="text-xl">👧</span>
              </div>
            </div>

          </div>

          {/* Bagian bawah bisa diisi Tabel Daftar Siswa jika menuAktif === 'daftar-siswa' */}
          {menuAktif === 'daftar-siswa' && (
            <div className="mt-8 bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100">
              <h3 className="text-lg font-black text-slate-800 mb-4 px-2">Daftar Siswa Terbaru</h3>
              {/* Tempat Tabel Anda */}
              <p className="text-slate-400 text-sm px-2 italic">Menampilkan data kesiswaan...</p>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
