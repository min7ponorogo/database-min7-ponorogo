"use client";
import { createBrowserClient } from '@supabase/ssr'
import { useEffect, useState } from 'react'

export default function Home() {
  const [siswa, setSiswa] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [menuAktif, setMenuAktif] = useState<'dashboard' | 'siswa'>('dashboard');

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase
        .from('Data Siswa')
        .select('NAMA, NISN, "DITERIMA DI KELAS", "STATUS SISWA"');
      if (data) setSiswa(data);
    };
    fetchData();
  }, [supabase]);

  // Filter pencarian
  const filteredSiswa = siswa.filter(s => 
    s.NAMA?.toLowerCase().includes(search.toLowerCase()) || 
    s.NISN?.toString().includes(search)
  );

  return (
    <div className="flex flex-col h-screen bg-slate-50 font-sans">
      {/* HEADER DENGAN LOGO */}
      <header className="bg-emerald-900 text-white p-4 flex justify-between items-center shadow-lg">
        <div className="flex items-center gap-4">
          <div className="bg-white p-1 rounded-full w-12 h-12 flex items-center justify-center overflow-hidden">
             {/* Logo Kemenag / Madrasah */}
             <img src="https://upload.wikimedia.org/wikipedia/commons/a/af/Logo_Kementerian_Agama.png" alt="Logo" className="w-10" />
          </div>
          <div>
            <h1 className="text-xl font-bold leading-tight">MIN 7 PONOROGO</h1>
            <p className="text-xs text-emerald-200">Kec. Sampung, Kab. Ponorogo</p>
          </div>
        </div>
        <div className="text-right hidden md:block">
          <p className="text-sm font-medium">Sistem Informasi Digital</p>
          <p className="text-xs text-emerald-300">Tahun Ajaran 2026/2027</p>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* SIDEBAR DENGAN EMAIL */}
        <aside className="w-64 bg-white border-r border-slate-200 p-6 flex flex-col justify-between">
          <div>
            <nav className="space-y-2">
              <button onClick={() => setMenuAktif('dashboard')} className={`w-full text-left p-3 rounded-lg flex items-center gap-3 ${menuAktif === 'dashboard' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-600 hover:bg-emerald-50'}`}>
                📊 <span>Dashboard</span>
              </button>
              <button onClick={() => setMenuAktif('siswa')} className={`w-full text-left p-3 rounded-lg flex items-center gap-3 ${menuAktif === 'siswa' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-600 hover:bg-emerald-50'}`}>
                👥 <span>Daftar Siswa</span>
              </button>
            </nav>
          </div>

          {/* Bagian Email di Bawah Sidebar */}
          <div className="mt-auto pt-6 border-t border-slate-100">
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Kontak Admin</p>
            <div className="mt-2 p-3 bg-slate-50 rounded-lg">
              <p className="text-xs text-slate-600 font-medium truncate">min7ponorogo@gmail.com</p>
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 overflow-y-auto p-8">
          {menuAktif === 'dashboard' ? (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-emerald-800 to-emerald-600 p-8 rounded-2xl text-white shadow-xl">
                <h2 className="text-2xl font-bold mb-2">Selamat Datang di Portal Data</h2>
                <p className="opacity-90">Monitor status EMIS dan data peserta didik MIN 7 Ponorogo secara real-time.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm text-center">
                  <p className="text-slate-500 text-sm mb-1">Total Peserta Didik</p>
                  <h3 className="text-3xl font-bold text-emerald-700">{siswa.length}</h3>
                </div>
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm text-center">
                  <p className="text-slate-500 text-sm mb-1">Status Aktif</p>
                  <h3 className="text-3xl font-bold text-blue-600">{siswa.filter(s => s["STATUS SISWA"] === 'Masuk').length}</h3>
                </div>
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm text-center">
                  <p className="text-slate-500 text-sm mb-1">Update Terakhir</p>
                  <h3 className="text-lg font-bold text-slate-700">Januari 2026</h3>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b bg-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h3 className="font-bold text-slate-700">Data Seluruh Siswa</h3>
                <input 
                  type="text" 
                  placeholder="Cari Nama atau NISN..." 
                  className="px-4 py-2 border rounded-lg text-sm w-full md:w-64 focus:ring-2 focus:ring-emerald-500 outline-none"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-600 border-b">
                  <tr>
                    <th className="p-4">Nama Lengkap</th>
                    <th className="p-4">NISN</th>
                    <th className="p-4">Kelas</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredSiswa.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 font-medium text-slate-800">{item.NAMA}</td>
                      <td className="p-4 text-slate-600">{item.NISN}</td>
                      <td className="p-4 text-slate-600">{item["DITERIMA DI KELAS"]}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${item["STATUS SISWA"] === 'Masuk' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                          {item["STATUS SISWA"]}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
