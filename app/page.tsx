import { createBrowserClient } from '@supabase/ssr'
import { Suspense } from 'react'

async function DaftarSiswa() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  // Mengambil data dengan nama kolom KAPITAL sesuai file CSV Anda
  const { data: siswa, error } = await supabase
    .from('Data Siswa') 
    .select('"NAMA LENGKAP", NISN, KELAS')
    .order('NAMA LENGKAP', { ascending: true })

  if (error) {
    return (
      <div className="p-10 text-red-500 bg-red-50 rounded-xl border border-red-200">
        <p className="font-bold">Gagal memuat data dari Supabase.</p>
        <p className="text-xs mt-2">Pesan Error: {error.message}</p>
        <p className="text-xs mt-1">Pastikan nama tabel "Data Siswa" dan kolom sudah benar.</p>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto font-sans">
      <div className="mb-8 text-center md:text-left border-b pb-6 border-slate-200">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">DATABASE SISWA</h1>
        <p className="text-emerald-600 font-bold tracking-widest uppercase text-sm">MIN 7 PONOROGO</p>
      </div>

      <div className="bg-white border rounded-2xl overflow-hidden shadow-xl border-slate-200">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-900 text-white text-[10px] md:text-xs uppercase tracking-[0.2em]">
              <tr>
                <th className="p-5 border-b border-slate-700">Nama Lengkap</th>
                <th className="p-5 border-b border-slate-700">NISN</th>
                <th className="p-5 border-b border-slate-700 text-center">Kelas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 uppercase text-[11px] md:text-sm">
              {siswa && siswa.length > 0 ? (
                siswa.map((s: any, i: number) => (
                  <tr key={i} className="hover:bg-emerald-50 transition-all duration-200">
                    <td className="p-5 font-bold text-slate-800 border-l-4 border-l-transparent hover:border-l-emerald-500">
                      {s["NAMA LENGKAP"]}
                    </td>
                    <td className="p-5 font-mono text-slate-500 tracking-tighter">
                      {s.NISN || "-"}
                    </td>
                    <td className="p-5 text-center">
                      <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-[10px] font-black border border-slate-200">
                        {s.KELAS || "-"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="p-20 text-center text-slate-400 normal-case italic">
                    Belum ada data siswa yang tersimpan di tabel "Data Siswa".
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="mt-8 p-4 bg-slate-100 rounded-xl text-[10px] text-slate-500 flex justify-between items-center">
        <span>© 2026 Operator EMIS MIN 7 Ponorogo</span>
        <span className="font-bold text-emerald-700 underline uppercase tracking-widest">Next.js 16.1 Secure Build</span>
      </div>
    </div>
  )
}

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f8fafc]">
      <Suspense fallback={
        <div className="flex flex-col items-center justify-center min-h-screen gap-4 text-center">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-bold text-sm animate-pulse tracking-widest">MENYINKRONKAN DATA EMIS...</p>
        </div>
      }>
        <DaftarSiswa />
      </Suspense>
    </main>
  )
}
