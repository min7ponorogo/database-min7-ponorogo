"use client";
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Tambahkan inisialisasi supabase untuk handle login
const supabase = createClient(
  'https://zbqalxllyrlgtwqbourc.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpicWFseGxseXJsZ3R3cWJvdXJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgzNTY2NzYsImV4cCI6MjA4MzkzMjY3Nn0.Z-FoLjelSimsWN4XW7qs8pbB_Dx0DjDkMwjNMG7udbY'
);

export default function Sidebar({ aktif, setAktif }) {
  const [isMinimal, setIsMinimal] = useState(false);

  // --- TAMBAHAN LOGIKA AUTH ---
  const [user, setUser] = useState(null);
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user ?? null));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleAuth = async () => {
    if (user) {
      if (confirm("Keluar dari Mode Admin?")) await supabase.auth.signOut();
    } else {
      const email = prompt("Email Admin:");
      const password = prompt("Password:");
      if (email && password) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) alert("Gagal: " + error.message);
      }
    }
  };
  // ----------------------------

  const menus = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'siswa', label: 'Data Siswa', icon: '👥' },
    { id: 'rombel', label: 'Data Rombel', icon: '🏫' },
  ];

  return (
    <aside className={`bg-white border-r border-slate-100 transition-all duration-500 flex flex-col relative ${isMinimal ? 'w-20' : 'w-72'} hidden lg:flex h-full`}>
      <button 
        onClick={() => setIsMinimal(!isMinimal)}
        className="absolute -right-3 top-10 bg-emerald-600 text-white w-7 h-7 rounded-full flex items-center justify-center shadow-md z-50 border-2 border-white"
      >
        <span className={`text-[12px] font-bold transition-transform ${isMinimal ? 'rotate-180' : ''}`}>
          {"<"}
        </span>
      </button>

      <div className="p-6 flex flex-col h-full overflow-hidden">
        
        {/* --- TAMBAHAN TOMBOL LOGIN DI ATAS --- */}
        <div className="mt-4 mb-2">
          <button
            onClick={handleAuth}
            className={`w-full flex items-center gap-4 p-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${
              user ? 'bg-red-50 text-red-600' : 'bg-slate-50 text-slate-400 hover:bg-emerald-50 hover:text-emerald-600'
            } ${isMinimal ? 'justify-center' : ''}`}
          >
            <span>{user ? '🔓' : '🔐'}</span>
            {!isMinimal && <span>{user ? 'Admin Aktif' : 'Login Admin'}</span>}
          </button>
        </div>
        {/* ------------------------------------ */}

        <nav className="space-y-3 flex-1">
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
