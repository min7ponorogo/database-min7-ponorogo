"use client";
import { createBrowserClient } from '@supabase/ssr'
import { useEffect, useState } from 'react'

export default function Home() {
  const [siswa, setSiswa] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [menuAktif, setMenuAktif] = useState<'dashboard' | 'siswa' | 'rombel'>('dashboard');

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase
        .from('Data Siswa')
        .select('NAMA, NISN, "DITERIMA DI KELAS", "STATUS SISWA", "JENIS KELAMIN"');
      if (data) setSiswa(data);
      setLoading(false);
    };
    fetchData();
  }, [supabase]);

  // Statistik Logika
  const totalSiswa = siswa.length;
  const siswaAktif = siswa.filter(s => s["STATUS SISWA"]?.toLowerCase() === 'masuk').length;
  const siswaTidakAktif = totalSiswa - siswaAktif;
  const rombels = Array.from(new Set(siswa.map(s => s["DITERIMA DI KELAS"]))).sort((a, b) => Number(a) - Number(b));

  return (
    <div className="min-h-screen bg-[#F1F5F9] flex font-sans">
      
      {/* 1. SIDEBAR NAVIGATION */}
      <aside className="w-72 bg-[#064E3B] text-white hidden lg:flex flex-col shadow-2xl">
        <div className="p-8 border-b border-emerald-800/50 text-center">
          <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg transform rotate-3">
             <span className="text-[#064E3B] font-black text-3xl">M7</span>
          </div>
          <h1 className="font-black text-lg tracking-tighter leading-none uppercase">Digital Madrasah</h1>
          <p className="text-[10px] text-emerald-400 font-bold mt-2 tracking-[0.2em]">MIN 7 PONOROGO</p>
        </div>
        
        <nav className="flex-1 p-6 space-y-2">
          <MenuBtn aktif={menuAktif === 'dashboard'} onClick={() => setMenuAktif('dashboard')} icon="🏠" label="Dashboard" />
          <MenuBtn aktif={menuAktif === 'siswa'} onClick={() => setMenuAktif('siswa')} icon="👥" label="Data Siswa" />
          <MenuBtn aktif={menuAktif === 'rombel'} onClick={() => setMenuAktif('rombel')} icon="🏫" label="Rombongan Belajar" />
        </nav>
        
        <div className="p-6 border-t border-emerald-800/50">
          <div className="bg-emerald-800/50 p-4 rounded-2xl text-[10px] font-bold text-emerald-300">
             Sistem Sinkronisasi EMIS v4.1
          </div>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* TOPBAR */}
        <header className="bg-white h-20 border-b px-8 flex items-center justify-between flex-shrink-0">
          <div>
            <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Status Data</h2>
            <p className="text-xs font-bold text-emerald-700">NSM: 111135020001 • Terakreditasi A</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] font-black text-slate-400 uppercase leading-none mb-1">Tahun Ajaran</p>
              <p className="text-xs font-bold text-slate-800 tracking-tighter">2025/2026 GANJIL</p>
            </div>
            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center font-black text-emerald-700">OP</div>
          </div>
        </header>

        {/* VIEWPORT */}
        <main className="flex-1 overflow-y-auto p-8">
          
          {menuAktif === 'dashboard' && (
            <div className="max-w-6xl mx-auto space-y-8">
              {/* WELCOME CARD */}
              <div className="bg-gradient-to-br from-[#064E3B] to-[#059669] p-10 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
                <div className="relative z-10">
                  <h3 className="text-4xl font-black tracking-tighter mb-2">Selamat Datang,</h3>
                  <p className="text-emerald-100 max-w-lg text-sm font-medium leading-relaxed opacity-80 uppercase tracking-widest">
                    Pusat Monitoring Data Siswa Digital MIN 7 Ponorogo.
                  </p>
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
              </div>

              {/* STATS ROW */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                <CardStat label="Semua Siswa" value={totalSiswa} color="slate" />
                <CardStat label="Siswa Aktif" value={siswaAktif} color="emerald" />
                <CardStat label="Belum Aktif" value={siswaTidakAktif} color="rose" />
                <CardStat label="Total Rombel" value={rombels.length} color="amber" />
              </div>

              {/* ANNOUNCEMENT BOX */}
              <div className="bg-white border-2 border-amber-100 p-6 rounded-3xl flex items-start gap-4 shadow-sm">
                <span className="text-2xl">📢</span>
                <div>
                  <h4 className="text-[10px] font-black text-amber-600 uppercase mb-1 tracking-widest">Pengumuman Penting</h4>
                  <p className="text-xs text-slate-600 font-bold leading-relaxed italic">
                    Segera verifikasi data siswa yang belum aktif untuk persiapan pelaporan Emis semester ini.
                  </p>
                </div>
              </div>
            </div>
          )}

          {menuAktif === 'siswa' && (
            <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 bg-slate-50 border-b flex justify-between items-center">
                <h3 className="font-black text-xs uppercase tracking-[0.2em] text-slate-500">Daftar Induk Siswa</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-white text-slate-400 font-black uppercase border-b">
                    <tr>
                      <th className="p-5">Nama Lengkap</th>
                      <th className="p-5">NISN</th>
                      <th className="p-5">Kelas</th>
                      <th className="p-5 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {siswa.map((s, i) => (
                      <tr key={i} className="hover:bg-emerald-50 transition-colors group">
                        <td className="p-5 font-black text-slate-800 uppercase group-hover:text-emerald-700">{s.NAMA}</td>
                        <td className="p-5 font-mono text-slate-400">{s.NISN || '---'}</td>
                        <td className="p-5 font-bold text-slate-500 tracking-tighter">KLS {s["DITERIMA DI KELAS"]}</td>
                        <td className="p-5 text-center">
                          <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${s["STATUS SISWA"]?.toLowerCase() === 'masuk' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-600'}`}>
                            {s["STATUS SISWA"] || 'OFFLINE'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {menuAktif === 'rombel' && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {rombels.map((kelas, i) => (
                <div key={i} className="bg-white p-8 rounded-[2.5rem] shadow-sm border-2 border-slate-100 hover:border-emerald-500 transition-all group">
                  <p className="text-[10px] font-black text-slate-300 uppercase mb-1">Rombongan Belajar</p>
                  <h4 className="text-3xl font-black text-slate-800 mb-6 group-hover:text-emerald-700">KELAS {kelas}</h4>
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-[9px] font-bold text-slate-400 uppercase leading-none">Total Siswa</p>
                      <p className="text-5xl font-black text-slate-900 mt-1">{siswa.filter(s => s["DITERIMA DI KELAS"] === kelas).length}</p>
                    </div>
                    <div className="bg-emerald-50 px-4 py-2 rounded-2xl">
                       <span className="text-[10px] font-black text-emerald-700 uppercase">Detail</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </main>
      </div>
    </div>
  )
}

function MenuBtn({ aktif, onClick, icon, label }: any) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-bold transition-all ${aktif ? 'bg-emerald-600 shadow-xl' : 'text-emerald-300 hover:bg-emerald-800'}`}>
      <span className="text-lg leading-none">{icon}</span> {label}
    </button>
  )
}

function CardStat({ label, value, color }: any) {
  const styles: any = {
    slate: "border-slate-300 text-slate-800",
    emerald: "border-emerald-500 text-emerald-600",
    rose: "border-rose-400 text-rose-600",
    amber: "border-amber-400 text-amber-600"
  };
  return (
    <div className={`bg-white p-7 rounded-[2rem] shadow-sm border-b-8 ${styles[color]}`}>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-4xl font-black tracking-tighter">{value}</p>
    </div>
  )
}
