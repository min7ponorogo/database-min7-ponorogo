"use client";
import { useState } from 'react';

export default function Sidebar({ aktif, setAktif }) {
  const [isMinimal, setIsMinimal] = useState(false);

  const menus = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'siswa', label: 'Data Siswa', icon: '👥' },
    { id: 'rombel', label: 'Data Rombel', icon: '🏫' }, // Sudah diganti dari Orang Tua
  ];

  return (
    <aside className={`bg-white border-r border-slate-100 transition-all duration-500 flex flex-col relative ${isMinimal ? 'w-20' : 'w-72'} hidden lg:flex h-full`}>
      {/* Tombol Panah Toggle */}
      <button 
        onClick={() => setIsMinimal(!isMinimal)}
        className="absolute -right-3 top-10 bg-emerald-600 text-white w-7 h-7 rounded-full flex items-center justify-center shadow-md z-50 border-2 border-white"
      >
        <span className={`text-[12px] font-bold transition-transform ${isMinimal ? 'rotate-180' : ''}`}>
          {"<"}
        </span>
      </button>

      <div className="p-6 flex flex-col h-full overflow-hidden">
        <nav className="space-y-3 flex-1 mt-10">
          {menus.map((m) => (
            <button
              key={m.id}
              onClick={() => setAktif(m.id)}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl font-bold transition-all ${
                aktif === m.id ? 'bg-emerald-600 text-white' : 'text-slate-500 hover:bg-emerald-50'
              } ${isMinimal ? 'justify-center' : ''}`}
            >
              <span className="text-xl">{m.icon}</span>
              {!isMinimal && <span className="text-sm tracking-tight">{m.label}</span>}
            </button>
          ))}
        </nav>
      </div>
    </aside>
  );
}
