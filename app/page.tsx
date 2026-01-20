"use client";
import { createBrowserClient } from '@supabase/ssr'
import { useEffect, useState } from 'react'

export default function Home() {
  const [siswa, setSiswa] = useState<any[]>([]);
  const [alamat, setAlamat] = useState<any[]>([]);
  const [orangTua, setOrangTua] = useState<any[]>([]);
  const [aktivitas, setAktivitas] = useState<any[]>([]);
  
  const [search, setSearch] = useState('');
  const [menuAktif, setMenuAktif] = useState<'dashboard' | 'siswa' | 'rombel' | 'alamat' | 'ortu' | 'aktivitas'>('dashboard');

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const fetchData = async () => {
      const { data: dSiswa } = await supabase.from('Data Siswa').select('*').order('DITERIMA DI KELAS', { ascending: false });
      const { data: dAlamat } = await supabase.from('Data Alamat').select('*');
      const { data: dOrangTua } = await supabase.from('Data Orang Tua').select('*');
      const { data: dAktivitas } = await supabase.from('Aktivitas Belajar').select('*');

      if (dSiswa) setSiswa(dSiswa);
      if (dAlamat) setAlamat(dAlamat);
      if (dOrangTua) setOrangTua(dOrangTua);
      if (dAktivitas) setAktivitas(dAktivitas);
    };
    fetchData();
  }, [supabase]);

  const filterData = (data: any[]) => data.filter(item => 
    Object.values(item).some(val => String(val).toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="flex flex-col h-screen bg-slate-50 font-sans text-slate-900">
      <header className="bg-emerald-900 text-white p-4 flex justify-between items-center shadow-lg border-b-4 border-emerald-500">
        <div className="flex items-center gap-4">
          <div className="bg-white p-1 rounded-full w-12 h-12 flex items-center justify-center shadow-inner">
             <img src="https://upload.wikimedia.org/wikipedia/commons/a/af/Logo_Kementerian_Agama.png" alt="Logo" className="w-10 h-auto" />
          </div>
          <div>
            <h1 className="text-xl font-bold leading-tight uppercase tracking-tight">MIN 7 PONOROGO</h1>
            <p className="text-[10px] text-emerald-200 uppercase font-semibold tracking-wider">Jl. Al-Huda, Winong, Jetis, Ponorogo</p>
          </div>
        </div>
        <div className="text-right hidden md:block border-l border-emerald-700 pl-4">
          <p className="text-sm font-medium italic text-emerald-100">"Ikhlas Beramal"</p>
          <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">Tahun Ajaran 2025/2026</p>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-64 bg-white border-r border-slate-200 p-6 flex flex-col shadow-xl z-20 overflow-y-auto">
          <nav className="space-y-1 flex-1">
            <p className="text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Menu Utama</p>
            <button onClick={() => setMenuAktif('dashboard')} className={`w-full text-left p-3 rounded-xl flex items-center gap-3 transition-all font-semibold ${menuAktif === 'dashboard' ? 'bg-emerald-700 text-white' : 'text-slate-500 hover:bg-emerald-50'}`}>
              📊 <span>Dashboard</span>
            </button>
            <button onClick={() => setMenuAktif('rombel')} className={`w-full text-left p-3 rounded-xl flex items-center gap-3 transition-all font-semibold ${menuAktif === 'rombel' ? 'bg-emerald-700 text-white' : 'text-slate-500 hover:bg-emerald-50'}`}>
              🏫 <span>Rombel</span>
            </button>
            <div className="my-4 border-t border-slate-100 pt-4">
              <p className="text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Data Terintegrasi</p>
              <button onClick={() => setMenuAktif('siswa')} className={`w-full text-left p-3 rounded-xl flex items-center gap-3 transition-all font-semibold ${menuAktif === 'siswa' ? 'bg-emerald-700 text-white' : 'text-slate-500 hover:bg-emerald-50'}`}>👥 <span>Data Siswa</span></button>
              <button onClick={() => setMenuAktif('ortu')} className={`w-full text-left p-3 rounded-xl flex items-center gap-3 transition-all font-semibold ${menuAktif === 'ortu' ? 'bg-emerald-700 text-white' : 'text-slate-500 hover:bg-emerald-50'}`}>👨‍👩‍👧 <span>Data Orang Tua</span></button>
              <button onClick={() => setMenuAktif('alamat')} className={`w-full text-left p-3 rounded-xl flex items-center gap-3 transition-all font-semibold ${menuAktif === 'alamat' ? 'bg-emerald-700 text-white' : 'text-slate-500 hover:bg-emerald-50'}`}>📍 <span>Data Alamat</span></button>
              <button onClick={() => setMenuAktif('aktivitas')} className={`w-full text-left p-3 rounded-xl flex items-center gap-3 transition-all font-semibold ${menuAktif === 'aktivitas' ? 'bg-emerald-700 text-white' : 'text-slate-500 hover:bg-emerald-50'}`}>📝 <span>Aktivitas</span></button>
            </div>
          </nav>
        </aside>

        <main className="flex-1 overflow-y-auto p-8 bg-slate-50/50">
          {menuAktif === 'dashboard' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-emerald-900 to-emerald-700 p-10 rounded-3xl text-white shadow-2xl relative overflow-hidden">
                <h2 className="text-3xl font-black mb-2 relative z-10">Selamat Datang di Sistem Informasi Digital MIN 7 Ponorogo</h2>
                <p className="opacity-80 text-sm relative z-10">Manajemen Data Madrasah Terpadu.</p>
                <div className="absolute right-10 top-1/2 -translate-y-1/2 text-9xl opacity-10">🕌</div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm"><p className="text-slate-400 text-[10px] font-black uppercase">Siswa</p><h3 className="text-3xl font-black text-emerald-700">{siswa.length}</h3></div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm"><p className="text-slate-400 text-[10px] font-black uppercase">Alamat</p><h3 className="text-3xl font-black text-blue-600">{alamat.length}</h3></div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm"><p className="text-slate-400 text-[10px] font-black uppercase">Orang Tua</p><h3 className="text-3xl font-black text-orange-600">{orangTua.length}</h3></div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm"><p className="text-slate-400 text-[10px] font-black uppercase">Log</p><h3 className="text-3xl font-black text-purple-600">{aktivitas.length}</h3></div>
              </div>
            </div>
          )}

          {['siswa', 'ortu', 'alamat', 'aktivitas'].includes(menuAktif) && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
              <div className="p-6 border-b flex justify-between items-center">
                <h3 className="font-black text-slate-800 uppercase">{menuAktif}</h3>
                <input type="text" placeholder="Cari..." className="px-4 py-2 bg-slate-100 rounded-lg text-sm outline-none" onChange={(e) => setSearch(e.target.value)} />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-400 font-black uppercase text-[10px]">
                    <tr>
                      {menuAktif === 'siswa' && <><th className="p-4">Nama</th><th className="p-4">NISN</th><th className="p-4">Kelas</th></>}
                      {menuAktif === 'ortu' && <><th className="p-4">Ayah</th><th className="p-4">Ibu</th><th className="p-4">Pekerjaan</th></>}
                      {menuAktif === 'alamat' && <><th className="p-4">ID</th><th className="p-4">Alamat</th><th className="p-4">Pos</th></>}
                      {menuAktif === 'aktivitas' && <><th className="p-4">Tahun</th><th className="p-4">Rombel</th><th className="p-4">Status</th></>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filterData(menuAktif === 'siswa' ? siswa : menuAktif === 'ortu' ? orangTua : menuAktif === 'alamat' ? alamat : aktivitas).map((row, idx) => (
                      <tr key={idx} className="hover:bg-emerald-50/30 transition-colors">
                        {menuAktif === 'siswa' && <><td className="p-4 font-bold">{row.NAMA}</td><td className="p-4">{row.NISN}</td><td className="p-4 font-black">KL {row["DITERIMA DI KELAS"]}</td></>}
                        {menuAktif === 'ortu' && <><td className="p-4 font-bold">{row["NAMA AYAH"]}</td><td className="p-4">{row["NAMA IBU"]}</td><td className="p-4">{row["PEKERJAAN UTAMA AYAH"]}</td></>}
                        {menuAktif === 'alamat' && <><td className="p-4">{row.ID}</td><td className="p-4 font-bold">{row.ALAMAT}</td><td className="p-4">{row["KODE POS"]}</td></>}
                        {menuAktif === 'aktivitas' && <><td className="p-4 font-bold">{row["TAHUN AJARAN"]}</td><td className="p-4">{row.ROMBEL}</td><td className="p-4">{row["STATUS BELAJAR"]}</td></>}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {menuAktif === 'rombel' && (
