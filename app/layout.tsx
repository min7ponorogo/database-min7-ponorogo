import './globals.css' // Baris ini WAJIB ada agar Tailwind aktif

export const metadata = {
  title: 'Database MIN 7 Ponorogo',
  description: 'Sistem Informasi Data Siswa',
}

export default function RootLayout({
  children,
}: {
  children: any
}) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  )
}
