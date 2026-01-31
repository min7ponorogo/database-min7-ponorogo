"use client";
import { useState, useEffect, useMemo, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import Header from './components/Header';
import Sidebar from './components/Sidebar';

const supabase = createClient(
  'https://zbqalxllyrlgtwqbourc.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpicWFseGxseXJsZ3R3cWJvdXJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgzNTY2NzYsImV4cCI6MjA4MzkzMjY3Nn0.Z-FoLjelSimsWN4XW7qs8pbB_Dx0DjDkMwjNMG7udbY'
);

export default function Dashboard() {
  const [allSiswa, setAllSiswa] = useState<any[]>([]);
  const [allAktivitas, setAllAktivitas] = useState<any[]>([]);
  const [allAlamat, setAllAlamat] = useState<any[]>([]);
  const [allOrtu, setAllOrtu] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [menuAktif, setMenuAktif] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState("");
  const [viewDetailRombel, setViewDetailRombel] = useState<any>(null);
  const [viewDetailSiswa, setViewDetailSiswa] = useState<any>(null);
  
  const [filterSiswa, setFilterSiswa] = useState<string | null>(null);
  const [filterRombel, setFilterRombel] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50); 

  // --- TAMBAHAN LOGIKA AUTH UNTUK ISADMIN ---
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Cek session saat awal
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Pantau perubahan login/logout
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Variabel isAdmin agar error hilang
  const isAdmin = user?.email === 'min7ponorogo141197@gmail.com';
  // ------------------------------------------
  
  useEffect(() => {
    async function ambilData() {
      try {
        const { data: profil } = await supabase.from('data_siswa').select('*');
        const { data: aktivitas } = await supabase.from('aktivitas_belajar').select('*');
        const { data: alamat } = await supabase.from('data_alamat').select('*');
        const { data: ortu } = await supabase.from('data_orang_tua').select('*');
        
        if (profil) setAllSiswa(profil);
        if (aktivitas) setAllAktivitas(aktivitas);
        if (alamat) setAllAlamat(alamat);
        if (ortu) setAllOrtu(ortu);
      } finally {
        setLoading(false);
      }
    }
    ambilData();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterSiswa, itemsPerPage]);

  const hitungUmur = (tglLahir: string) => {
    if (!tglLahir) return "-";
    const lahir = new Date(tglLahir);
    const sekarang = new Date();
    let tahun = sekarang.getFullYear() - lahir.getFullYear();
    let bulan = sekarang.getMonth() - lahir.getMonth();
    if (bulan < 0) {
      tahun--;
      bulan += 12;
    }
    return `${tahun}th ${bulan}bln`;
  };

  const stats = useMemo(() => {
    const cowok = allSiswa.filter(s => s['JENIS KELAMIN'] === 'L').length;
    const aktif = allAktivitas.filter(a => a['STATUS BELAJAR'] === 'Aktif').length;
    return {
      total: allSiswa.length,
      siswaAktif: aktif,
      l: cowok,
      p: allSiswa.length - cowok
    };
  }, [allSiswa, allAktivitas]);

  const rombelList = useMemo(() => {
    const rombelMap = new Map();
    allAktivitas.forEach(a => {
      if (a.ROMBEL && a.ROMBEL !== "null") {
        if (!rombelMap.has(a.ROMBEL)) {
          rombelMap.set(a.ROMBEL, { nama: a.ROMBEL, kelas: a.KELAS, total: 0, l: 0, p: 0 });
        }
        const r = rombelMap.get(a.ROMBEL);
        r.total++;
        const s = allSiswa.find(x => x.ID === a.ID);
        if (s?.['JENIS KELAMIN'] === 'L') r.l++;
        else if (s?.['JENIS KELAMIN'] === 'P') r.p++;
      }
    });
    return Array.from(rombelMap.values()).sort((a, b) => a.kelas - b.kelas);
  }, [allSiswa, allAktivitas]);

  const filteredSiswa = useMemo(() => {
    return allSiswa.filter(s => {
      const matchSearch = s.NAMA?.toLowerCase().includes(searchTerm.toLowerCase());
      let matchFilter = true;
      if (filterSiswa === 'L' || filterSiswa === 'P') {
        matchFilter = s['JENIS KELAMIN'] === filterSiswa;
      } else if (filterSiswa === 'Aktif') {
        const aktivitas = allAktivitas.find(a => a.ID === s.ID);
        matchFilter = aktivitas?.['STATUS BELAJAR'] === 'Aktif';
      }
      return matchSearch && matchFilter;
    });
  }, [allSiswa, allAktivitas, searchTerm, filterSiswa]);

  const paginatedSiswa = useMemo(() => {
    if (itemsPerPage === -1) return filteredSiswa;
    const start = (currentPage - 1) * itemsPerPage;
    return filteredSiswa.slice(start, start + itemsPerPage);
  }, [filteredSiswa, currentPage, itemsPerPage]);

  const totalPages = itemsPerPage === -1 ? 1 : Math.ceil(filteredSiswa.length / itemsPerPage);

  const handlePrint = () => {
    window.print();
  };

  if (loading) return <div className="h-screen flex items-center justify-center font-black text-[#065f46]">MEMUAT...</div>;

  return (
    <div className="flex flex-col h-screen bg-[#f8fafc] text-slate-900 overflow-hidden">
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #print-area, #print-area * { visibility: visible; }
          #print-area { position: absolute; left: 0; top: 0; width: 100%; padding: 20px; }
          .no-print { display: none !important; }
        }
      `}</style>

      <Header search={searchTerm} setSearch={setSearchTerm} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar aktif={menuAktif} setAktif={(m: string) => { setMenuAktif(m); setViewDetailRombel(null); setViewDetailSiswa(null); setFilterSiswa(null); setFilterRombel(null); setCurrentPage(1); }} />
        
        <main className="flex-1 p-8 overflow-y-auto">
          
          {/* ===[ MODAL DETAIL SISWA - UI REFRESH ]=== */}
{viewDetailSiswa && (
  <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 sm:p-8">
    <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-emerald-100">
      
      {/* Header Modal (Tetap) */}
      <div className="p-8 border-b-2 border-slate-50 flex justify-between items-center no-print bg-white">
        <div>
          <h2 className="text-2xl font-black uppercase text-[#065f46] italic">Biodata Lengkap</h2>
          <p className="text-[9px] font-bold text-slate-400 tracking-widest uppercase">Profil Mandiri Siswa MIN 7 Ponorogo</p>
        </div>
        <button onClick={() => setViewDetailSiswa(null)} className="p-2 hover:bg-red-50 rounded-full text-slate-300 hover:text-red-500 transition-all">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>

      {/* Area Konten */}
      <div id="print-area" className="flex-1 overflow-y-auto p-8 sm:p-10 space-y-6 bg-white">
        
        {/* Header Cetak (Hanya muncul saat diprint) */}
        <div className="hidden print:block border-b-4 border-[#065f46] pb-4 mb-6">
          <h1 className="text-2xl font-black uppercase text-[#065f46]">Biodata Siswa</h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">MIN 7 Ponorogo • Data Induk Pendidikan</p>
        </div>

        {/* SECTION: DATA SISWA */}
        <div className="space-y-3">
          <h3 className="text-[10px] font-black text-emerald-600 uppercase tracking-widest border-l-4 border-emerald-500 pl-3">Data Siswa</h3>
          <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 grid grid-cols-1 gap-5">
            <DetailRow label="Nama Lengkap Siswa" val={viewDetailSiswa.NAMA} />
            
            {/* INI BARIS NIK YANG DITAMBAHKAN */}
            <DetailRow 
              label="NIK" 
              val={isAdmin ? (viewDetailSiswa.NIK || "-") : "****************"} 
            />

            <div className="grid grid-cols-2 gap-6">
              <DetailRow label="NISN" val={viewDetailSiswa.NISN} />
              <DetailRow label="NIS Lokal" val={viewDetailSiswa['NIS LOKAL']} />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <DetailRow label="Tempat Lahir" val={viewDetailSiswa['TEMPAT LAHIR']} />
              <DetailRow label="Tanggal Lahir" val={viewDetailSiswa['TANGGAL LAHIR']} />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <DetailRow label="Jenis Kelamin" val={viewDetailSiswa['JENIS KELAMIN'] === 'L' ? 'LAKI-LAKI' : 'PEREMPUAN'} />
              <DetailRow label="Agama" val={viewDetailSiswa.AGAMA} />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <DetailRow label="Anak Ke" val={viewDetailSiswa['ANAK KE']} />
              <DetailRow label="Jumlah Saudara" val={viewDetailSiswa['JUMLAH SAUDARA']} />
            </div>
            <DetailRow label="Asal Sekolah (TK/RA)" val={viewDetailSiswa['ASAL SEKOLAH']} />
            <DetailRow label="Alamat Tempat Tinggal" val={allAlamat.find(a => a.ID === viewDetailSiswa.ID)?.ALAMAT} />
          </div>
        </div>

        {/* SECTION: DATA ORANG TUA */}
        <div className="space-y-3">
          <h3 className="text-[10px] font-black text-emerald-600 uppercase tracking-widest border-l-4 border-emerald-500 pl-3">Data Orang Tua / Wali</h3>
          <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 grid grid-cols-1 gap-5">
            <div className="grid grid-cols-2 gap-6">
              <DetailRow label="Nama Ayah" val={allOrtu.find(o => o.ID === viewDetailSiswa.ID)?.['NAMA AYAH']} />
              <DetailRow label="Pekerjaan Ayah" val={allOrtu.find(o => o.ID === viewDetailSiswa.ID)?.['PEKERJAAN UTAMA AYAH']} />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <DetailRow label="Nama Ibu" val={allOrtu.find(o => o.ID === viewDetailSiswa.ID)?.['NAMA IBU']} />
              <DetailRow label="Pekerjaan Ibu" val={allOrtu.find(o => o.ID === viewDetailSiswa.ID)?.['PEKERJAAN UTAMA IBU']} />
            </div>
            <DetailRow 
              label="Nomor Telepon Orang Tua" 
              val={
               isAdmin 
                 ? (allOrtu.find(o => o.ID === viewDetailSiswa.ID)?.['NO. TELEPON AYAH'] || 
                    allOrtu.find(o => o.ID === viewDetailSiswa.ID)?.['NO. TELEPON IBU'] || 
                    allOrtu.find(o => o.ID === viewDetailSiswa.ID)?.['NO. TELEPON WALI'] || "-")
                 : "****************"
             } 
           />
          </div>
        </div>
      </div>

      {/* Footer Modal (Tetap) */}
      <div className="p-8 bg-slate-50 border-t border-slate-100 flex gap-4 no-print">
        <button 
          onClick={() => window.print()} 
          className="flex-1 bg-[#065f46] text-white py-4 rounded-2xl font-black uppercase text-xs shadow-lg shadow-emerald-900/20 hover:bg-[#044d38] transition-all flex items-center justify-center gap-3"
        >
          <span>🖨️ Cetak ke A4</span>
        </button>
      </div>
    </div>
  </div>
)}

          {/* ===[ KELOMPOK 1: DASHBOARD ]=== */}
          <div className={menuAktif === 'dashboard' ? 'block' : 'hidden'}>
            <div className="bg-[#065f46] text-white p-12 rounded-[3rem] shadow-xl relative overflow-hidden mb-8">
              <h2 className="text-6xl font-black italic uppercase relative z-10">MIN 7 Ponorogo</h2>
              <p className="opacity-60 text-xs font-bold tracking-[0.5em] relative z-10 uppercase">Sistem Informasi Data Siswa</p>
              <span className="absolute right-[-20px] top-[-20px] text-[15rem] opacity-10 select-none">🏫</span>
            </div>

            {searchTerm && (
              <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-300">
                <h3 className="text-xl font-black italic uppercase text-emerald-700 mb-4 pl-2">Hasil Pencarian Cepat: "{searchTerm}"</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {allSiswa.filter(s => s.NAMA?.toLowerCase().includes(searchTerm.toLowerCase())).slice(0, 6).map((s, idx) => (
                    <div key={idx} onClick={() => setViewDetailSiswa(s)} className="bg-white p-4 rounded-2xl shadow-sm border border-emerald-100 flex justify-between items-center group hover:bg-emerald-50 transition-all cursor-pointer">
                      <div>
                        <p className="text-xs font-black text-slate-700 uppercase group-hover:text-emerald-700">{s.NAMA}</p>
                        <p className="text-[9px] font-bold text-slate-400">ID: {s.ID}</p>
                      </div>
                      <span className={`text-[8px] font-black px-2 py-1 rounded-full ${s['JENIS KELAMIN'] === 'L' ? 'bg-blue-100 text-blue-600' : 'bg-pink-100 text-pink-600'}`}>
                        {s['JENIS KELAMIN']}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
               <StatCard title="Total Siswa" val={stats.total} icon="📚" col="text-emerald-600" onClick={() => { setMenuAktif('siswa'); setFilterSiswa(null); }} />
               <StatCard title="Siswa Aktif" val={stats.siswaAktif} icon="✅" col="text-blue-500" onClick={() => { setMenuAktif('siswa'); setFilterSiswa('Aktif'); }} />
               <StatCard title="Laki-Laki" val={stats.l} icon="👦" col="text-indigo-600" onClick={() => { setMenuAktif('siswa'); setFilterSiswa('L'); }} />
               <StatCard title="Perempuan" val={stats.p} icon="👧" col="text-pink-600" onClick={() => { setMenuAktif('siswa'); setFilterSiswa('P'); }} />
            </div>

            <h3 className="text-2xl font-black italic uppercase text-slate-800 mb-6 border-l-8 border-[#065f46] pl-6">Statistik Rombel</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {rombelList.map((r, i) => (
                <div key={i} onClick={() => { setMenuAktif('rombel'); setViewDetailRombel(r); setFilterRombel(null); }} 
                     className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100 hover:shadow-2xl hover:-translate-y-1 transition-all cursor-pointer group relative overflow-hidden">
                  <div className="relative z-10">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Kelas {r.kelas}</p>
                    <h4 className="text-3xl font-black text-slate-800 uppercase group-hover:text-[#065f46] mb-6">{r.nama}</h4>
                    <div className="flex justify-between items-end">
                        <div className="text-[10px] font-black uppercase space-y-1">
                          <p className="text-blue-500">👦 {r.l} Laki-laki</p>
                          <p className="text-pink-500">👧 {r.p} Perempuan</p>
                        </div>
                        <div className="text-right">
                          <p className="text-4xl font-black text-slate-200 group-hover:text-emerald-100 transition-colors">{r.total}</p>
                          <p className="text-[8px] font-black text-slate-400 uppercase">Total Siswa</p>
                        </div>
                    </div>
                  </div>
                  <span className="absolute right-[-15px] bottom-[-15px] text-9xl opacity-5 group-hover:opacity-10 group-hover:rotate-12 transition-all select-none">🏫</span>
                </div>
              ))}
            </div>
          </div>

          {/* ===[ KELOMPOK 2: DATA SISWA ]=== */}
          <div className={menuAktif === 'siswa' ? 'block' : 'hidden'}>
            <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
              <h3 className="text-4xl font-black italic uppercase text-slate-800 mb-6 border-l-8 border-[#065f46] pl-6">
                Data Induk Siswa
              </h3>
              
              <div className="flex flex-wrap gap-3 mb-10 pl-6">
                <button onClick={() => setFilterSiswa(null)} className={`px-6 py-3 rounded-full border-2 transition-all font-black text-[11px] uppercase ${!filterSiswa ? 'bg-emerald-50 border-emerald-500 text-emerald-600 ring-4 ring-emerald-500/10' : 'bg-white border-slate-100 text-slate-400 hover:border-emerald-200'}`}>
                  TOTAL: {stats.total}
                </button>
                <button onClick={() => setFilterSiswa('Aktif')} className={`px-6 py-3 rounded-full border-2 transition-all font-black text-[11px] uppercase ${filterSiswa === 'Aktif' ? 'bg-blue-50 border-blue-500 text-blue-600 ring-4 ring-blue-500/10' : 'bg-white border-slate-100 text-slate-400 hover:border-blue-200'}`}>
                  AKTIF: {stats.siswaAktif}
                </button>
                <button onClick={() => setFilterSiswa('L')} className={`px-6 py-3 rounded-full border-2 transition-all font-black text-[11px] uppercase ${filterSiswa === 'L' ? 'bg-indigo-50 border-indigo-500 text-indigo-600 ring-4 ring-indigo-500/10' : 'bg-white border-slate-100 text-slate-400 hover:border-indigo-200'}`}>
                  👦 L: {stats.l}
                </button>
                <button onClick={() => setFilterSiswa('P')} className={`px-6 py-3 rounded-full border-2 transition-all font-black text-[11px] uppercase ${filterSiswa === 'P' ? 'bg-pink-50 border-pink-500 text-pink-600 ring-4 ring-pink-500/10' : 'bg-white border-slate-100 text-slate-400 hover:border-pink-200'}`}>
                  👧 P: {stats.p}
                </button>
              </div>

              <table className="w-full text-left">
                <thead>
                  <tr className="text-slate-400 text-[10px] font-black uppercase tracking-widest border-b-2 border-slate-50">
                    <th className="py-4 px-4">NO</th>
                    <th className="py-4">NAMA</th>
                    <th className="py-4">TEMPAT LAHIR</th>
                    <th className="py-4">TGL LAHIR</th>
                    <th className="py-4">UMUR</th>
                    <th className="py-4 text-center">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {paginatedSiswa.map((s, i) => {
                    const aktivitas = allAktivitas.find(a => a.ID === s.ID);
                    return (
                      <tr key={i} onClick={() => setViewDetailSiswa(s)} className="hover:bg-slate-50 group cursor-pointer transition-all">
                        <td className="py-4 px-4 text-xs font-black text-slate-300">
                          {itemsPerPage === -1 ? i + 1 : ((currentPage - 1) * itemsPerPage) + i + 1}
                        </td>
                        <td className="py-4 text-xs font-black text-slate-700 uppercase group-hover:text-[#065f46] group-hover:translate-x-2 transition-transform">{s.NAMA}</td>
                        <td className="py-4 text-[10px] font-bold text-slate-500 uppercase">{s['TEMPAT LAHIR'] || '-'}</td>
                        <td className="py-4 text-[10px] font-bold text-slate-500">{s['TANGGAL LAHIR'] || '-'}</td>
                        <td className="py-4 text-[10px] font-black text-emerald-600 italic">{hitungUmur(s['TANGGAL LAHIR'])}</td>
                        <td className="py-4 text-center">
                          <span className={`text-[9px] font-black px-3 py-1 rounded-full ${aktivitas?.['STATUS BELAJAR'] === 'Aktif' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-100 text-slate-400'}`}>
                            {aktivitas?.['STATUS BELAJAR'] || 'Tidak Aktif'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              <div className="flex flex-col md:flex-row items-center justify-between mt-10 px-4 gap-4">
                <div className="flex items-center gap-4">
                  <p className="text-[10px] font-black text-slate-400 uppercase">
                    Menampilkan {paginatedSiswa.length} dari {filteredSiswa.length} Siswa
                  </p>
                  <div className="flex items-center gap-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase">Tampilkan:</label>
                    <select 
                      value={itemsPerPage} 
                      onChange={(e) => setItemsPerPage(Number(e.target.value))}
                      className="bg-slate-100 text-[10px] font-black uppercase px-2 py-1 rounded-lg border-none focus:ring-2 focus:ring-[#065f46] cursor-pointer"
                    >
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                      <option value={-1}>Semua</option>
                    </select>
                  </div>
                </div>

                {itemsPerPage !== -1 && (
                  <div className="flex gap-2">
                    <button 
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(prev => prev - 1)}
                      className="px-4 py-2 text-[10px] font-black bg-slate-100 rounded-xl hover:bg-[#065f46] hover:text-white disabled:opacity-30 transition-all uppercase"
                    >Prev</button>
                    {[...Array(totalPages)].map((_, i) => (
                      <button 
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`w-8 h-8 text-[10px] font-black rounded-xl transition-all ${currentPage === i + 1 ? 'bg-[#065f46] text-white' : 'bg-slate-50 text-slate-400'}`}
                      >{i + 1}</button>
                    ))}
                    <button 
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(prev => prev + 1)}
                      className="px-4 py-2 text-[10px] font-black bg-slate-100 rounded-xl hover:bg-[#065f46] hover:text-white disabled:opacity-30 transition-all uppercase"
                    >Next</button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ===[ KELOMPOK 3: ROMBEL ]=== */}
          <div className={menuAktif === 'rombel' && !viewDetailRombel ? 'block' : 'hidden'}>
            <h3 className="text-4xl font-black italic uppercase text-slate-800 mb-8 border-l-8 border-[#065f46] pl-6">Daftar Rombel</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {rombelList.map((r, i) => (
                <div key={i} onClick={() => { setViewDetailRombel(r); setFilterRombel(null); }} 
                     className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100 hover:shadow-2xl hover:-translate-y-1 transition-all cursor-pointer group relative overflow-hidden">
                  <div className="relative z-10">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Kelas {r.kelas}</p>
                    <h4 className="text-3xl font-black text-slate-800 uppercase group-hover:text-[#065f46] mb-6">{r.nama}</h4>
                    <div className="flex justify-between items-end">
                        <div className="text-[10px] font-black uppercase space-y-1">
                          <p className="text-blue-500">👦 {r.l} Laki-laki</p>
                          <p className="text-pink-500">👧 {r.p} Perempuan</p>
                        </div>
                        <div className="text-right">
                          <p className="text-4xl font-black text-slate-200 group-hover:text-emerald-100 transition-colors">{r.total}</p>
                          <p className="text-[8px] font-black text-slate-400 uppercase">Total Siswa</p>
                        </div>
                    </div>
                  </div>
                  <span className="absolute right-[-15px] bottom-[-15px] text-9xl opacity-5 group-hover:opacity-10 group-hover:rotate-12 transition-all select-none">🏫</span>
                </div>
              ))}
            </div>
          </div>

          {menuAktif === 'rombel' && viewDetailRombel && (
  <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100">
    <button onClick={() => { setViewDetailRombel(null); setFilterRombel(null); }} className="mb-6 text-[#065f46] font-black text-xs uppercase hover:underline">← Kembali ke Daftar</button>
    
    <div className="flex justify-between items-end mb-6">
      <div>
        <h3 className="text-7xl font-black italic uppercase text-slate-800 leading-tight">{viewDetailRombel.nama}</h3>
        <p className="text-2xl font-black italic text-[#065f46]">KELAS {viewDetailRombel.kelas}</p>
      </div>

      {/* --- TOMBOL CETAK MASSAL BIODATA (DATA SISWA & DATA ORTU HIJAU) --- */}
      <button 
        onClick={() => {
          const printWindow = window.open('', '_blank');
          const listSiswa = allSiswa.filter(s => {
            const aktiv = allAktivitas.find(a => a.ID === s.ID);
            return aktiv?.ROMBEL === viewDetailRombel.nama;
          });

          printWindow.document.write(`
            <html>
              <head>
                <title>CETAK BIODATA - ${viewDetailRombel.nama}</title>
                <style>
                  @page { size: A4; margin: 0; }
                  body { font-family: 'Inter', sans-serif; margin: 0; padding: 0; background: #fff; color: #1e293b; }
                  
                  .page-sheet { 
                    page-break-after: always; 
                    width: 210mm; 
                    height: 297mm; 
                    padding: 15mm 20mm; 
                    box-sizing: border-box; 
                    position: relative;
                    overflow: hidden;
                  }
                  .page-sheet:last-child { page-break-after: auto; }

                  .header-print { border-bottom: 4px solid #065f46; padding-bottom: 10px; margin-bottom: 25px; }
                  .header-print h1 { font-size: 24px; font-weight: 900; text-transform: uppercase; color: #065f46; margin: 0; }
                  .header-print p { font-size: 9px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 2px; margin: 4px 0 0 0; }

                  .section-label { font-size: 10px; font-weight: 900; color: #059669; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 15px; border-left: 4px solid #10b981; padding-left: 10px; }
                  
                  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px 25px; margin-bottom: 10px; }
                  .col-span-2 { grid-column: span 2; }
                  
                  .detail-item { margin-bottom: 2px; }
                  .label { font-size: 8px; font-weight: 800; color: #64748b; text-transform: uppercase; margin-bottom: 2px; display: block; }
                  .value { font-size: 12px; font-weight: 700; color: #000; text-transform: uppercase; padding-bottom: 4px; border-bottom: 1px solid #f1f5f9; display: block; min-height: 18px; }

                  /* --- PERBAIKAN JARAK DISINI --- */
                  .footer-area { 
                    margin-top: 40px; /* Jarak dari data terakhir */
                    width: 100%; 
                  }
                  .footer-grid { display: grid; grid-template-columns: 35mm 1fr; gap: 40px; align-items: flex-end; }
                  
                  .photo-frame { 
                    width: 30mm; 
                    height: 40mm; 
                    border: 1px dashed #cbd5e1; 
                    display: flex; 
                    align-items: center; 
                    justify-content: center; 
                    text-align: center;
                    font-size: 9px;
                    font-weight: bold;
                    color: #94a3b8;
                    background: #f8fafc;
                  }

                  .sign-box { text-align: center; font-size: 12px; max-width: 250px; margin-left: auto; margin-right: 0; }
                  .date-line { margin-bottom: 5px; display: block; }
                  .line { margin-top: 60px; width: 100%; border-bottom: 1.5px solid #000; font-weight: bold; padding-bottom: 3px; }
                </style>
              </head>
              <body>
                ${listSiswa.map((s) => {
                  const alamat = allAlamat.find(a => a.ID === s.ID)?.ALAMAT || '-';
                  const ortu = allOrtu.find(o => o.ID === s.ID);
                  const telp = ortu?.['NO. TELEPON AYAH'] || ortu?.['NO. TELEPON IBU'] || ortu?.['NO. TELEPON WALI'] || "-";
                  const tglSekarang = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
                  
                  return `
                    <div class="page-sheet">
                      <div class="header-print">
                        <h1>Biodata Siswa</h1>
                        <p>MIN 7 Ponorogo • Profil Data Induk Rombel ${viewDetailRombel.nama}</p>
                      </div>

                      <div class="section-label">Data Siswa</div>

                      <div class="grid">
                        <div class="detail-item col-span-2">
                          <span class="label">Nama Lengkap Siswa</span>
                          <span class="value">${s.NAMA}</span>
                        </div>
                        <div class="detail-item col-span-2">
                          <span class="label">NIK</span>
                          <span class="value">
                            ${isAdmin ? (s.NIK || '-') : '****************'}
                          </span>
                        </div>
                        <div class="detail-item">
                          <span class="label">NISN</span>
                          <span class="value">${s.NISN}</span>
                        </div>
                        <div class="detail-item">
                          <span class="label">NIS Lokal</span>
                          <span class="value">${s['NIS LOKAL']}</span>
                        </div>
                        <div class="detail-item">
                          <span class="label">Tempat Lahir</span>
                          <span class="value">${s['TEMPAT LAHIR']}</span>
                        </div>
                        <div class="detail-item">
                          <span class="label">Tanggal Lahir</span>
                          <span class="value">${s['TANGGAL LAHIR']}</span>
                        </div>
                        <div class="detail-item">
                          <span class="label">Jenis Kelamin</span>
                          <span class="value">${s['JENIS KELAMIN'] === 'L' ? 'LAKI-LAKI' : 'PEREMPUAN'}</span>
                        </div>
                        <div class="detail-item">
                          <span class="label">Agama</span>
                          <span class="value">${s.AGAMA}</span>
                        </div>
                        <div class="detail-item">
                          <span class="label">Anak Ke</span>
                          <span class="value">${s['ANAK KE']}</span>
                        </div>
                        <div class="detail-item">
                          <span class="label">Jumlah Saudara</span>
                          <span class="value">${s['JUMLAH SAUDARA']}</span>
                        </div>
                        <div class="detail-item col-span-2">
                          <span class="label">Asal Sekolah (TK/RA)</span>
                          <span class="value">${s['ASAL SEKOLAH']}</span>
                        </div>
                        <div class="detail-item col-span-2">
                          <span class="label">Alamat Tempat Tinggal</span>
                          <span class="value">${alamat}</span>
                        </div>
                      </div>

                      <div style="margin-top: 25px;"></div>
                      <div class="section-label">Data Orang Tua / Wali</div>

                      <div class="grid">
                        <div class="detail-item">
                          <span class="label">Nama Ayah</span>
                          <span class="value">${ortu?.['NAMA AYAH'] || '-'}</span>
                        </div>
                        <div class="detail-item">
                          <span class="label">Pekerjaan Ayah</span>
                          <span class="value">${ortu?.['PEKERJAAN UTAMA AYAH'] || '-'}</span>
                        </div>
                        <div class="detail-item">
                          <span class="label">Nama Ibu</span>
                          <span class="value">${ortu?.['NAMA IBU'] || '-'}</span>
                        </div>
                        <div class="detail-item">
                          <span class="label">Pekerjaan Ibu</span>
                          <span class="value">${ortu?.['PEKERJAAN UTAMA IBU'] || '-'}</span>
                        </div>
                        <div class="detail-item col-span-2">
                          <span class="label">Nomor Telepon Orang Tua</span>
                          <span class="value">${telp}</span>
                        </div>
                      </div>

                      <div class="footer-area">
                        <div class="footer-grid">
                          <div class="photo-frame">PAS FOTO<br>3 X 4</div>
                          <div class="sign-box">
                            <span class="date-line">Ponorogo, ${tglSekarang}</span>
                            <span>Wali Murid,</span>
                            <div class="line"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  `;
                }).join('')}
              </body>
            </html>
          `);
          printWindow.document.close();
          printWindow.print();
        }}
        className="bg-[#065f46] text-white px-8 py-4 rounded-2xl font-black text-xs uppercase shadow-lg hover:bg-[#044d38] transition-all flex items-center gap-3 mb-2"
      >
        <span>🖨️ Cetak</span>
      </button>
    </div>

    <div className="flex flex-wrap gap-3 mb-10">
      <button onClick={() => setFilterRombel(null)} className={`px-6 py-3 rounded-full border-2 transition-all font-black text-[11px] uppercase ${!filterRombel ? 'bg-emerald-50 border-emerald-500 text-emerald-600 ring-4 ring-emerald-500/10' : 'bg-white border-slate-100 text-slate-400 hover:border-emerald-200'}`}>
        TOTAL: {viewDetailRombel.total} SISWA
      </button>
      <button onClick={() => setFilterRombel('L')} className={`px-6 py-3 rounded-full border-2 transition-all font-black text-[11px] uppercase ${filterRombel === 'L' ? 'bg-indigo-50 border-indigo-500 text-indigo-600 ring-4 ring-indigo-500/10' : 'bg-white border-slate-100 text-slate-400 hover:border-indigo-200'}`}>
      👦 L: {stats.l}
      </button>
      <button onClick={() => setFilterRombel('P')} className={`px-6 py-3 rounded-full border-2 transition-all font-black text-[11px] uppercase ${filterRombel === 'P' ? 'bg-pink-50 border-pink-500 text-pink-600 ring-4 ring-pink-500/10' : 'bg-white border-slate-100 text-slate-400 hover:border-pink-200'}`}>
      👧 P: {stats.p}
      </button>
    </div>
    
    {/* Tabel detail rombel di bawahnya tetap sama */}

    {/* Filter Buttons ... tetap sama */}
    <div className="flex flex-wrap gap-3 mb-10">
      {/* ... kode filter L/P Anda ... */}
    </div>

                <div className="bg-emerald-50/30 p-8 rounded-[2.5rem] border border-emerald-100">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-[#065f46] text-[10px] font-black uppercase tracking-widest opacity-60">
                        <th className="pb-6 px-4">NO</th>
                        <th className="pb-6">NAMA</th>
                        <th className="pb-6">TEMPAT LAHIR</th>
                        <th className="pb-6 text-center">UMUR</th>
                        <th className="pb-6 text-right">STATUS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allAktivitas
                        .filter(a => a.ROMBEL === viewDetailRombel.nama)
                        .filter(item => {
                          const s = allSiswa.find(x => x.ID === item.ID);
                          const matchGender = filterRombel ? s?.['JENIS KELAMIN'] === filterRombel : true;
                          const matchSearch = s?.NAMA?.toLowerCase().includes(searchTerm.toLowerCase());
                          return matchGender && matchSearch;
                        })
                        .map((item, idx) => {
                          const s = allSiswa.find(x => x.ID === item.ID);
                          return (
                            <tr key={idx} 
  onClick={() => setViewDetailSiswa(s)} 
  className="border-b border-white/50 group hover:bg-white/40 transition-all cursor-pointer"
>
  <td className="py-4 px-4 text-xs font-black text-emerald-600/40">
    {idx + 1}
  </td>
  <td className="py-4 text-xs font-black text-slate-700 uppercase group-hover:text-emerald-700 group-hover:translate-x-2 transition-transform duration-300">
    {s?.NAMA}
  </td>
  <td className="py-4 text-[10px] font-bold text-slate-500 uppercase">
    {s?.['TEMPAT LAHIR'] || '-'}
  </td>
  <td className="py-4 text-[10px] font-black text-emerald-600 italic text-center">
    {hitungUmur(s?.['TANGGAL LAHIR'])}
  </td>
  <td className="py-4 text-right">
    <span className={`text-[9px] font-black px-4 py-1.5 rounded-full shadow-sm border ${item['STATUS BELAJAR'] === 'Aktif' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-400'}`}>
      {item['STATUS BELAJAR']}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
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

function StatCard({ title, val, icon, col, onClick }: any) {
  return (
    <div onClick={onClick} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group cursor-pointer hover:shadow-lg transition-all active:scale-95">
      <div className="relative z-10">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{title}</p>
        <p className={`text-6xl font-black ${col} tracking-tighter`}>{val}</p>
      </div>
      <span className="absolute right-[-10px] bottom-[-10px] text-8xl opacity-5 group-hover:opacity-10 transition-all select-none">{icon}</span>
    </div>
  );
}

function DetailRow({ label, val }: { label: string, val: any }) {
  return (
    <div>
      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-sm font-bold text-slate-700 uppercase">{val || '-'}</p>
    </div>
  );
}
