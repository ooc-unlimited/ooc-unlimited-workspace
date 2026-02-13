import { notFound } from 'next/navigation'
import { getDoc, getCategories, getDocsByCategory, getCategoryLabel } from '@/lib/docs'
import Sidebar from '@/components/Sidebar'
import SearchBar from '@/components/SearchBar'
import MarkdownRenderer from '@/components/MarkdownRenderer'
import { getAllDocs } from '@/lib/docs'

export const dynamic = 'force-dynamic'

interface Props {
  params: { category: string; slug: string }
}

export default function DocPage({ params }: Props) {
  const doc = getDoc(params.category, params.slug)
  if (!doc) notFound()

  const cats = getCategories()
  const sidebarData = cats.map(c => ({
    name: c,
    label: getCategoryLabel(c),
    docs: getDocsByCategory(c).map(d => ({ slug: d.slug, title: d.title })),
  }))

  return (
    <div className="flex min-h-screen">
      <Sidebar categories={sidebarData} />
      <main className="flex-1 p-8 max-w-4xl">
        <div className="mb-6">
          <SearchBar allDocs={getAllDocs()} />
        </div>
        <div className="mb-4">
          <span className="text-xs text-text-muted uppercase tracking-wider">
            {getCategoryLabel(doc.category)}
          </span>
          {doc.date && (
            <span className="text-xs text-text-muted ml-3">{doc.date}</span>
          )}
        </div>
        {doc.tags && doc.tags.length > 0 && (
          <div className="flex gap-2 mb-4">
            {doc.tags.map(tag => (
              <span key={tag} className="text-xs bg-bg-tertiary text-accent-blue px-2 py-0.5 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        )}
        <article>
          <MarkdownRenderer content={doc.content} />
        </article>
      </main>
    </div>
  )
}
