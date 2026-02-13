import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const DOCS_DIR = path.join(process.cwd(), 'docs')

export interface DocMeta {
  slug: string
  title: string
  category: string
  date?: string
  tags?: string[]
  description?: string
}

export interface Doc extends DocMeta {
  content: string
}

const CATEGORY_LABELS: Record<string, string> = {
  journal: '📓 Journal',
  playbooks: '📋 Playbooks',
  scripts: '🎯 Scripts',
  analysis: '🔍 Analysis',
  concepts: '💡 Concepts',
  systems: '⚙️ Systems',
}

export function getCategories(): string[] {
  if (!fs.existsSync(DOCS_DIR)) return []
  return fs.readdirSync(DOCS_DIR).filter(f =>
    fs.statSync(path.join(DOCS_DIR, f)).isDirectory()
  )
}

export function getCategoryLabel(cat: string): string {
  return CATEGORY_LABELS[cat] || cat
}

export function getDocsByCategory(category: string): DocMeta[] {
  const dir = path.join(DOCS_DIR, category)
  if (!fs.existsSync(dir)) return []

  return fs.readdirSync(dir)
    .filter(f => f.endsWith('.md'))
    .map(f => {
      const raw = fs.readFileSync(path.join(dir, f), 'utf-8')
      const { data } = matter(raw)
      const slug = f.replace(/\.md$/, '')
      return {
        slug,
        title: data.title || slug.replace(/-/g, ' ').replace(/^\d{4}-\d{2}-\d{2}$/, slug),
        category,
        date: data.date || (slug.match(/^\d{4}-\d{2}-\d{2}$/) ? slug : undefined),
        tags: data.tags || [],
        description: data.description || '',
      }
    })
    .sort((a, b) => {
      if (a.date && b.date) return b.date.localeCompare(a.date)
      return a.title.localeCompare(b.title)
    })
}

export function getAllDocs(): DocMeta[] {
  return getCategories().flatMap(getDocsByCategory)
}

export function getDoc(category: string, slug: string): Doc | null {
  const filePath = path.join(DOCS_DIR, category, `${slug}.md`)
  if (!fs.existsSync(filePath)) return null

  const raw = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(raw)
  return {
    slug,
    title: data.title || slug.replace(/-/g, ' '),
    category,
    date: data.date || (slug.match(/^\d{4}-\d{2}-\d{2}$/) ? slug : undefined),
    tags: data.tags || [],
    description: data.description || '',
    content,
  }
}

export function searchDocs(query: string): DocMeta[] {
  const q = query.toLowerCase()
  return getAllDocs().filter(d =>
    d.title.toLowerCase().includes(q) ||
    d.description?.toLowerCase().includes(q) ||
    d.tags?.some(t => t.toLowerCase().includes(q)) ||
    d.category.toLowerCase().includes(q)
  )
}
