import './globals.css'

export const metadata = {
  title: 'OOC Unlimited Mission Control',
  description: 'Autonomous AI Business Management System for Gary Cosby',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}