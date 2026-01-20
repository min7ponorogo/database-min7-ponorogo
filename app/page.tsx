import { createBrowserClient } from '@supabase/ssr'
import { Suspense } from 'react'

async function DaftarSiswa() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  // Mengambil data sesuai nama kolom di SQL Anda: NAMA, NISN, DITERIMA DI KELAS
  const { data: siswa, error } = await supabase
    .from('Data Siswa') 
    .select('NAMA, NISN, "DITERIMA DI KELAS"')
    .order('NAMA', { ascending: true })

  if (error) {
    return (
      <div className="p-10 text-red-500 bg-red-50 rounded-xl border border-red-200">
        <p className="font-bold">Gagal memuat data dari Supabase.</p>
        <p className="text-xs mt-2">Pesan Error: {error.message}</p>
        <p className="text-xs mt-1">Pastikan RLS sudah Disabled dan kolom sesuai.</p>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto font-sans">
      <div className="mb-8 border-b-4 border-emerald-500 pb-4">
        <h1 className="text-4xl font-black text-slate-900 tracking-tighter">DATABASE EMIS</h1>
        <p className="text-slate-500 font-bold tracking-[0.3em] uppercase text-xs">MIN 7 PONOROGO</p>
      </div>

      <div className="bg-white border-2 border-slate-200 rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-900 text-white text-[10px] md:text-xs uppercase tracking-widest">
              <tr>
                <th className="p-6 border-b border-slate-700">Nama Lengkap Siswa</th>
                <th className="p-6 border-b border-slate-700">NISN</th>
                <th className="p-6 border-b border-slate-700 text-center">Kelas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 uppercase text-[11px] md:text-sm font-medium">
              {siswa && siswa.length > 0 ? (
                siswa.map((s: any, i: number) => (
                  <tr key={i} className="hover:bg-emerald-50 transition-colors">
                    <td className="p-5 text-slate-900 font-extrabold">{s.NAMA}</td>
                    <td className="p-5 font-mono text-slate-500 letter tracking-tight">{s.NISN || "---"}</td>
                    <td className="p-5 text-center">
                      <span className="bg-emerald-100 text-emerald-800 px-4 py-1 rounded-full text-[10px] font-black border border-emerald-200">
                        {s["DITERIMA DI KELAS"]}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="p-20 text-center text-slate-400 normal-case italic">
                    Data tidak ditemukan. Pastikan tabel "Data Siswa" sudah terisi.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <footer className="mt-10 text-center text-slate-400 text-[10px] uppercase tracking-widest">
        Sistem Informasi Digital MIN 7 Ponorogo © 2026
      </footer>
    </div>
  )
}

export default function Home() {
  return (
    <main className="min-h-screen bg-[#fcfdfd]">
      <Suspense fallback={
        <div className="flex flex-col items-center justify-center min-h-screen gap-4">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 font-bold text-[10px] tracking-[0.2em] animate-pulse">MENYINKRONKAN DATA EMIS...</p>
        </div>
      }>
        <DaftarSiswa />
      </Suspense>
    </main>
  )
}
