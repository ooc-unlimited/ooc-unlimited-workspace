import Link from 'next/link'
import { getCategories, getDocsByCategory, getCategoryLabel, getAllDocs } from '@/lib/docs'
import Sidebar from '@/components/Sidebar'
import SearchBar from '@/components/SearchBar'

export const dynamic = 'force-dynamic'

export default function Home() {
  const cats = getCategories()
  const sidebarData = cats.map(c => ({
    name: c,
    label: getCategoryLabel(c),
    docs: getDocsByCategory(c).map(d => ({ slug: d.slug, title: d.title })),
  }))
  const allDocs = getAllDocs()
  const totalDocs = allDocs.length
  const recentDocs = allDocs.slice(0, 5)

  return (
    <div className="flex min-h-screen">
      <Sidebar categories={sidebarData} />
      <main className="flex-1 p-8 max-w-4xl">
        <div className="mb-8">
          <SearchBar allDocs={allDocs} />
        </div>
        <h1 className="text-3xl font-bold text-text-primary mb-2">🧠 Second Brain</h1>
        <p className="text-text-secondary mb-8">
          {totalDocs} documents across {cats.length} categories
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
          {sidebarData.map(cat => (
            <div key={cat.name} className="bg-bg-secondary border border-border rounded-lg p-4 hover:border-accent-blue transition-colors">
              <div className="text-lg mb-1">{cat.label}</div>
              <div className="text-sm text-text-muted">{cat.docs.length} docs</div>
            </div>
          ))}
        </div>

        {recentDocs.length > 0 && (
          <>
            <h2 className="text-xl font-semibold text-text-primary mb-4">Recent</h2>
            <div className="space-y-2">
              {recentDocs.map(d => (
                <Link
                  key={`${d.category}/${d.slug}`}
                  href={`/docs/${d.category}/${d.slug}`}
                  className="block bg-bg-secondary border border-border-muted rounded-md p-3 hover:border-accent-blue transition-colors"
                >
                  <div className="text-sm font-medium text-text-primary">{d.title}</div>
                  <div className="text-xs text-text-muted mt-1">{getCategoryLabel(d.category)} {d.date ? `· ${d.date}` : ''}</div>
                </Link>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  )
}
