import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: "Gary's Second Brain",
  description: 'Knowledge base & operating system',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
