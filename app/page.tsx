"use client";
import { createBrowserClient } from '@supabase/ssr'
import { useEffect, useState } from 'react'

export default function Home() {
  const [data, setData] = useState({ siswa: [], alamat: [], ortu: [], aktivitas: [] });
  const [search, setSearch] = useState('');
  const [menuAktif, setMenuAktif] = useState('dashboard');

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const fetchAll = async () => {
      const [s, a, o, ak] = await Promise.all([
        supabase.from('Data Siswa').select('*'),
        supabase.from('Data Alamat').select('*'),
        supabase.from('Data Orang Tua').select('*'),
        supabase.from('Aktivitas Belajar').select('*')
      ]);
      setData({ 
        siswa: s.data || [], 
        alamat: a.data || [], 
        ortu: o.data || [], 
        aktivitas: ak.data || [] 
      });
    };
    fetchAll();
  }, [supabase]);

  const filtered = (arr: any[]) => arr.filter(item => 
    JSON.stringify(item).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col h-screen bg-slate-50 text-slate-900 font-sans">
      <header className="bg-emerald-900 text-white p-4 flex justify-between items-center border-b-4 border-emerald-500">
        <div className="flex items-center gap-3">
          <div className="bg-white p-1 rounded-full w-10 h-10 flex items-center justify-center">
            <img src="https://upload.wikimedia.org/wikipedia/commons/a/af/Logo_Kementerian_Agama.png" className="w-8" alt="Logo" />
          </div>
          <h1 className="font-bold uppercase tracking-tight">MIN 7 Ponorogo</h1>
        </div>
        <p className="text-xs text-emerald-300 hidden md:block italic">"Ikhlas Beramal"</p>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-64 bg-white border-r p-6 space-y-2 hidden md:block">
          {['dashboard', 'siswa', 'ortu', 'alamat', 'aktivitas', 'rombel'].map((m) => (
            <button 
              key={m}
              onClick={() => setMenuAktif(m)}
              className={`w-full text-left p-3 rounded-xl capitalize font-semibold ${menuAktif === m ? 'bg-emerald-700 text-white' : 'text-slate-500 hover:bg-emerald-50'}`}
            >
              {m === 'ortu' ? 'Data Orang Tua' : m}
            </button>
          ))}
        </aside>

        <main className="flex-1 overflow-y-auto p-6">
          {menuAktif === 'dashboard' && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white p-6 rounded-2xl shadow-sm border">
                <p className="text-xs font-bold text-slate-400 uppercase">Total Siswa</p>
                <h3 className="text-3xl font-black text-emerald-700">{data.siswa.length}</h3>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border">
                <p className="text-xs font-bold text-slate-400 uppercase">Data Alamat</p>
                <h3 className="text-3xl font-black text-blue-600">{data.alamat.length}</h3>
              </div>
            </div>
          )}

          {['siswa', 'ortu', 'alamat', 'aktivitas'].includes(menuAktif) && (
            <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
              <div className="p-4 border-b flex justify-between items-center">
                <h3 className="font-bold uppercase text-sm">Tabel {menuAktif}</h3>
                <input 
                  type="text" 
                  placeholder="Cari..." 
                  className="bg-slate-100 px-3 py-1 rounded-md text-sm outline-none"
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-500">
                    <tr>
                      {menuAktif === 'siswa' && <><th className="p-3">Nama</th><th className="p-3">NISN</th><th className="p-3">Kelas</th></>}
                      {menuAktif === 'ortu' && <><th className="p-3">Ayah</th><th className="p-3">Ibu</th><th className="p-3">Pekerjaan</th></>}
                      {menuAktif === 'alamat' && <><th className="p-3">ID</th><th className="p-3">Alamat Lengkap</th></>}
                      {menuAktif === 'aktivitas' && <><th className="p-3">Tahun</th><th className="p-3">Rombel</th><th className="p-3">Status</th></>}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered(data[menuAktif as keyof typeof data]).map((item: any, i: number) => (
                      <tr key={i} className="border-t hover:bg-slate-50">
                        {menuAktif === 'siswa' && <><td className="p-3 font-semibold">{item.NAMA}</td><td className="p-3">{item.NISN}</td><td className="p-3">KL {item["DITERIMA DI KELAS"]}</td></>}
                        {menuAktif === 'ortu' && <><td className="p-3 font-semibold">{item["NAMA AYAH"]}</td><td className="p-3">{item["NAMA IBU"]}</td><td className="p-3">{item["PEKERJAAN UTAMA AYAH"]}</td></>}
                        {menuAktif === 'alamat' && <><td className="p-3">{item.ID}</td><td className="p-3">{item.ALAMAT}</td></>}
                        {menuAktif === 'aktivitas' && <><td className="p-3">{item["TAHUN AJARAN"]}</td><td className="p-3">{item.ROMBEL}</td><td className="p-3">{item["STATUS BELAJAR"]}</td></>}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
