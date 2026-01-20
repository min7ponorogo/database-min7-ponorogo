"use client";
import { createBrowserClient } from '@supabase/ssr'
import { useEffect, useState } from 'react'

export default function Home() {
  // State untuk 4 Tabel
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
      // Mengambil data dari 4 tabel sekaligus
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

  // Fungsi Filter Search (Universal)
  const filterData = (data: any[]) => data.filter(item => 
    Object.values(item).some(val => String(val).toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="flex flex-col h-screen bg-slate-50 font-sans text-slate-900">
      {/* HEADER */}
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
          <p className="text-sm font-medium italic text-emerald-100 italic">"Ikhlas Beramal"</p>
          <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">Tahun Ajaran 2025/2026</p>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* SIDEBAR */}
        <aside className="w-64 bg-white border-r border-slate-200 p-6 flex flex-col shadow-xl z-20 overflow-y-auto">
          <nav className="space-y-1 flex-1">
            <p className="text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Menu Utama</p>
            <button onClick={() => setMenuAktif('dashboard')} className={`w-full text-left p-3 rounded-xl flex items-center gap-3 transition-all font-semibold ${menuAktif === 'dashboard' ? 'bg-emerald-700 text-white shadow-lg' : 'text-slate-500 hover:bg-emerald-50'}`}>
              📊 <span>Dashboard</span>
            </button>
            <button onClick={() => setMenuAktif('rombel')} className={`w-full text-left p-3 rounded-xl flex items-center gap-3 transition-all font-semibold ${menuAktif === 'rombel' ? 'bg-emerald-700 text-white shadow-lg' : 'text-slate-500 hover:bg-emerald-50'}`}>
              🏫 <span>Rombongan Belajar</span>
            </button>

            <div className="my-4 border-t border-slate-100 pt-4">
              <p className="text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Data Terintegrasi</p>
              <button onClick={() => setMenuAktif('siswa')} className={`w-full text-left p-3 rounded-xl flex items-center gap-3 transition-all font-semibold ${menuAktif === 'siswa' ? 'bg-emerald-700 text-white shadow-md' : 'text-slate-500 hover:bg-emerald-50'}`}>
                👥 <span>Data Siswa</span>
              </button>
              <button onClick={() => setMenuAktif('ortu')} className={`w-full text-left p-3 rounded-xl flex items-center gap-3 transition-all font-semibold ${menuAktif === 'ortu' ? 'bg-emerald-700 text-white shadow-md' : 'text-slate-500 hover:bg-emerald-50'}`}>
                👨‍👩‍👧 <span>Data Orang Tua</span>
              </button>
              <button onClick={() => setMenuAktif('alamat')} className={`w-full text-left p-3 rounded-xl flex items-center gap-3 transition-all font-semibold ${menuAktif === 'alamat' ? 'bg-emerald-700 text-white shadow-md' : 'text-slate-500 hover:bg-emerald-50'}`}>
                📍 <span>Data Alamat</span>
              </button>
              <button onClick={() => setMenuAktif('aktivitas')} className={`w-full text-left p-3 rounded-xl flex items-center gap-3 transition-all font-semibold ${menuAktif === 'aktivitas' ? 'bg-emerald-700 text-white shadow-md' : 'text-slate-500 hover:bg-emerald-50'}`}>
                📝 <span>Aktivitas Belajar</span>
              </button>
            </div>
          </nav>

          <div className="mt-auto pt-6 border-t border-slate-100">
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
              <p className="text-[11px] text-emerald-800 font-bold break-all">min7ponorogo@gmail.com</p>
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 overflow-y-auto p-8 bg-slate-50/50">
          
          {/* Dashboard */}
          {menuAktif === 'dashboard' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-700 p-10 rounded-3xl text-white shadow-2xl relative overflow-hidden">
                <div className="relative z-10">
                  <h2 className="text-3xl font-black mb-2">Selamat Datang di Sistem Informasi Digital MIN 7 Ponorogo</h2>
                <div className="absolute right-10 top-1/2 -translate-y-1/2 text-9xl opacity-10">🕌</div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  { label: "Total Siswa", val: siswa.length, color: "text-emerald-700", bg: "bg-white" },
                  { label: "Data Alamat", val: alamat.length, color: "text-blue-600", bg: "bg-white" },
                  { label: "Data Orang Tua", val: orangTua.length, color: "text-orange-600", bg: "bg-white" },
                  { label: "Log Aktivitas", val: aktivitas.length, color: "text-purple-600", bg: "bg-white" }
                ].map((stat, i) => (
                  <div key={i} className={`${stat.bg} p-6 rounded-2xl border border-slate-200 shadow-sm`}>
                    <p className="text-slate-400 text-[10px] font-black uppercase mb-1">{stat.label}</p>
                    <h3 className={`text-3xl font-black ${stat.color}`}>{stat.val}</h3>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tabel Data (Universal View) */}
          {['siswa', 'ortu', 'alamat', 'aktivitas'].includes(menuAktif) && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden animate-in fade-in duration-500">
              <div className="p-6 border-b flex flex-col md:flex-row justify-between items-center gap-4">
                <h3 className="font-black text-slate-800 text-lg uppercase tracking-tight">
                  {menuAktif === 'siswa' && "Daftar Peserta Didik"}
                  {menuAktif === 'ortu' && "Database Orang Tua / Wali"}
                  {menuAktif === 'alamat' && "Data Alamat Domisili"}
                  {menuAktif === 'aktivitas' && "Catatan Aktivitas Belajar"}
                </h3>
                <input 
                  type="text" 
                  placeholder="Cari data..." 
                  className="px-5 py-2 bg-slate-100 rounded-xl text-sm outline-emerald-500 w-full md:w-80"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-400 font-black uppercase text-[10px] border-b">
                    <tr>
                      {menuAktif === 'siswa' && <><th className="p-4">Nama Lengkap</th><th className="p-4">NISN</th><th className="p-4 text-center">Kelas</th><th className="p-4 text-center">Status</th></>}
                      {menuAktif === 'ortu' && <><th className="p-4">Nama Ayah</th><th className="p-4">Nama Ibu</th><th className="p-4">Pekerjaan Ayah</th><th className="p-4">Pendidikan Ibu</th></>}
                      {menuAktif === 'alamat' && <><th className="p-4">ID</th><th className="p-4">Alamat Lengkap</th><th className="p-4 text-center">Kode Pos</th></>}
                      {menuAktif === 'aktivitas' && <><th className="p-4">Tahun Ajaran</th><th className="p-4">Kelas</th><th className="p-4">Rombel</th><th className="p-4 text-center">Status</th></>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {filterData(
                      menuAktif === 'siswa' ? siswa : 
                      menuAktif === 'ortu' ? orangTua : 
                      menuAktif === 'alamat' ? alamat : aktivitas
                    ).map((row, idx) => (
                      <tr key={idx} className="hover:bg-emerald-50/30 transition-colors">
                        {menuAktif === 'siswa' && (
                          <>
                            <td className="p-4 font-bold text-slate-800">{row.NAMA}</td>
                            <td className="p-4 text-slate-500 font-mono">{row.NISN}</td>
                            <td className="p-4 text-center"><span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-lg font-black text-[11px]">KELAS {row["DITERIMA DI KELAS"]}</span></td>
                            <td className="p-4 text-center"><span className="text-[10px] font-black uppercase">{row["STATUS SISWA"]}</span></td>
                          </>
                        )}
                        {menuAktif === 'ortu' && (
                          <>
                            <td className="p-4 font-bold">{row["NAMA AYAH"] || '-'}</td>
                            <td className="p-4">{row["NAMA IBU"] || '-'}</td>
                            <td className="p-4">{row["PEKERJAAN UTAMA AYAH"] || '-'}</td>
                            <td className="p-4 text-slate-500">{row["PENDIDIKAN TERAKHIR IBU"] || '-'}</td>
                          </>
                        )}
                        {menuAktif === 'alamat' && (
                          <>
                            <td className="p-4 font-mono text-slate-400">{row.ID}</td>
                            <td className="p-4 font-bold text-slate-700">{row.ALAMAT}</td>
                            <td className="p-4 text-center text-slate-500">{row["KODE POS"]}</td>
                          </>
                        )}
                        {menuAktif === 'aktivitas' && (
                          <>
                            <td className="p-4 font-bold">{row["TAHUN AJARAN"]}</td>
                            <td className="p-4">Kelas {row.KELAS}</td>
                            <td className="p-4">{row.ROMBEL}</td>
                            <td className="p-4 text-center"><span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-[10px] font-black uppercase">{row["STATUS BELAJAR"]}</span></td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Rombel */}
          {menuAktif === 'rombel' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in zoom-in duration-300">
              {[6, 5, 4, 3, 2, 1].map((kls) => (
                <div key={kls} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
                  <div className="bg-emerald-700 text-white w-12 h-12 rounded-xl flex items-center justify-center text-xl font-black mb-4 group-hover:scale-110 transition-transform">{kls}</div>
                  <h4 className="font-bold text-slate-500">Kelas {kls}</h4>
                  <p className="text-4xl font-black text-slate-800">{siswa.filter(s => String(s["DITERIMA DI KELAS"]) === String(kls)).length} <span className="text-sm font-bold text-slate-400">SISWA</span></p>
                  <div className="absolute -right-2 -bottom-2 text-5xl opacity-[0.05] font-black italic uppercase">MIN 7</div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
