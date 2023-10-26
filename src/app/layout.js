import '../css/index.css'

export const metadata = {
  title: 'Familiada HALLOWEEN',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
