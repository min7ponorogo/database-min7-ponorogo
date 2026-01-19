export const metadata = {
  title: 'Database EMIS MIN 7',
  description: 'Sistem Informasi Data Siswa',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  )
}
