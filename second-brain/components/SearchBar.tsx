'use client'

import { useState } from 'react'
import Link from 'next/link'

interface SearchResult {
  slug: string
  title: string
  category: string
  description?: string
}

export default function SearchBar({ allDocs }: { allDocs: SearchResult[] }) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)

  const results = query.length > 1
    ? allDocs.filter(d =>
        d.title.toLowerCase().includes(query.toLowerCase()) ||
        d.category.toLowerCase().includes(query.toLowerCase()) ||
        (d.description || '').toLowerCase().includes(query.toLowerCase())
      ).slice(0, 8)
    : []

  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Search docs…"
        value={query}
        onChange={e => { setQuery(e.target.value); setOpen(true) }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 200)}
        className="w-full bg-bg-tertiary border border-border rounded-md px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-blue"
      />
      {open && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-bg-secondary border border-border rounded-md shadow-lg z-50 max-h-64 overflow-y-auto">
          {results.map(r => (
            <Link
              key={`${r.category}/${r.slug}`}
              href={`/docs/${r.category}/${r.slug}`}
              className="block px-3 py-2 hover:bg-bg-tertiary"
              onClick={() => { setQuery(''); setOpen(false) }}
            >
              <div className="text-sm text-text-primary">{r.title}</div>
              <div className="text-xs text-text-muted">{r.category}</div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
