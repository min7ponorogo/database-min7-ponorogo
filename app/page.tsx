import { createBrowserClient } from '@supabase/ssr'
import { Suspense } from 'react'

async function DaftarSiswa() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  // Mengambil data dengan nama kolom huruf kapital sesuai CSV
  const { data: siswa, error } = await supabase
    .from('Data Siswa') 
    .select('"NAMA LENGKAP", NISN, KELAS') // Menggunakan huruf kapital sesuai database
    .order('NAMA LENGKAP', { ascending: true })

  if (error) {
    return (
      <div className="p-10 text-red-500">
        <p>Gagal memuat data. Periksa nama kolom di Supabase.</p>
        <p className="text-xs mt-2">Pesan Error: {error.message}</p>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto font-sans">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900">DATABASE SISWA</h1>
        <p className="text-slate-500">MIN 7 PONOROGO</p>
      </div>

      <div className="border rounded-xl overflow-hidden shadow-lg bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-900 text-white text-xs uppercase tracking-wider">
              <tr>
                <th className="p-4">Nama Lengkap</th>
                <th className="p-4">NISN</th>
                <th className="p-4 text-center">Kelas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 uppercase text-[11px] md:text-xs">
              {siswa && siswa.length > 0 ? (
                siswa.map((s: any, i: number) => (
                  <tr key={i} className="hover:bg-blue-50 transition-colors">
                    <td className="p-4 font-bold text-slate-800">{s["NAMA LENGKAP"]}</td>
                    <td className="p-4 font-mono text-slate-600">{s.NISN}</td>
                    <td className="p-4 text-center">
                      <span className="bg-slate-100 px-2 py-1 rounded text-slate-700 font-semibold">
                        {s.KELAS || s.Kelas}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="p-10 text-center text-slate-400">Data tidak ditemukan.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Suspense fallback={<div className="p-20 text-center">Memproses Data...</div>}>
        <DaftarSiswa />
      </Suspense>
    </main>
  )
}
