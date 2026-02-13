'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface SidebarProps {
  categories: { name: string; label: string; docs: { slug: string; title: string }[] }[]
}

export default function Sidebar({ categories }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside className="w-64 min-h-screen bg-bg-secondary border-r border-border flex flex-col shrink-0">
      <div className="p-4 border-b border-border">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl">🧠</span>
          <span className="font-bold text-text-primary text-lg">Second Brain</span>
        </Link>
      </div>
      <nav className="flex-1 overflow-y-auto py-2">
        {categories.map(cat => (
          <div key={cat.name} className="mb-1">
            <div className="px-4 py-2 text-xs font-semibold text-text-muted uppercase tracking-wider">
              {cat.label}
            </div>
            {cat.docs.map(doc => {
              const href = `/docs/${cat.name}/${doc.slug}`
              const active = pathname === href
              return (
                <Link
                  key={doc.slug}
                  href={href}
                  className={`block px-4 py-1.5 text-sm truncate transition-colors ${
                    active
                      ? 'sidebar-active text-text-primary font-medium'
                      : 'text-text-secondary hover:text-text-primary hover:bg-bg-tertiary'
                  }`}
                >
                  {doc.title}
                </Link>
              )
            })}
          </div>
        ))}
      </nav>
      <div className="p-3 border-t border-border text-xs text-text-muted">
        Gary Cosby · GFI
      </div>
    </aside>
  )
}
