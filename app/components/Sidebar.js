"use client";
import { useState } from 'react';

export default function Sidebar({ aktif, setAktif }) {
  const [isMinimal, setIsMinimal] = useState(false);

  // Menu yang sudah dikurangi (Domisili & Aktivitas dihapus)
  const menus = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'siswa', label: 'Data Siswa', icon: '👥' },
    { id: 'ortu', label: 'Orang Tua', icon: '👨‍👩‍👧' },
  ];

  return (
    <aside 
      className={`bg-white border-r border-slate-200 transition-all duration-300 flex flex-col shadow-sm relative ${
        isMinimal ? 'w-20' : 'w-64'
      } hidden lg:flex h-full`}
    >
      {/* Tombol Toggle Collapse */}
      <button 
        onClick={() => setIsMinimal(!isMinimal)}
        className="absolute -right-3 top-10 bg-emerald-600 text-white w-6 h-6 rounded-full flex items-center justify-center shadow-lg hover:bg-emerald-700 transition-colors z-50 border-2 border-white"
      >
        {isMinimal ? '→' : '←'}
      </button>

      <div className="p-4 flex flex-col h-full">
        {/* Label Navigasi */}
        <p className={`text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 px-2 transition-opacity ${
          isMinimal ? 'opacity-0' : 'opacity-100'
        }`}>
          {!isMinimal && "Navigasi"}
        </p>

        {/* List Menu */}
        <nav className="space-y-2 flex-1">
          {menus.map((m) => (
            <button
              key={m.id}
              onClick={() => setAktif(m.id)}
              title={m.label}
              className={`w-full flex items-center gap-3 p-3 rounded-2xl font-bold transition-all duration-200 ${
                aktif === m.id 
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-100' 
                : 'text-slate-500 hover:bg-slate-50'
              } ${isMinimal ? 'justify-center' : 'px-4'}`}
            >
              <span className="text-xl">{m.icon}</span>
              {!isMinimal && <span className="text-sm whitespace-nowrap">{m.label}</span>}
            </button>
          ))}
        </nav>

        {/* Bagian Contact Us */}
        <div className={`bg-slate-100 p-4 rounded-2xl transition-all ${isMinimal ? 'opacity-0 invisible' : 'opacity-100'}`}>
          <p className="text-[9px] font-bold text-slate-500 uppercase italic text-center">Contact Us</p>
          <p className="text-[9px] font-bold text-slate-800 uppercase text-center break-all">min7ponorogo@gmail.com</p>
        </div>
      </div>
    </aside>
  );
}
