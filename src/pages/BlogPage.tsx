import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import { Section } from '@/components/ui/Section'
import { Wrap } from '@/components/ui/Wrap'
import { BLOG_CATEGORIES } from '@/content/blog'
import { useAdmin, useBlogPosts } from '@/features/admin'
import { resolveMediaUrl } from '@/features/admin/api/client'
import { usePageField } from '@/features/admin/hooks/usePageField'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { blogArticlePath } from '@/lib/constants/routes'
import { cn } from '@/lib/utils'

export function BlogPage() {
  const [filter, setFilter] = useState('Todos')
  const { posts: cmsPosts } = useBlogPosts()
  const { bootstrapping } = useAdmin()
  const { Field: F, content } = usePageField('blog')
  const blog = content.paginas.blog

  const published = useMemo(
    () => cmsPosts.filter((p) => p.publicado),
    [cmsPosts],
  )

  const categories = useMemo(() => {
    const fromPosts = Array.from(new Set(published.map((p) => p.categoria).filter(Boolean)))
    const known = BLOG_CATEGORIES.filter((c) => c === 'Todos' || fromPosts.includes(c))
    const extra = fromPosts.filter((c) => !(known as string[]).includes(c))
    return [...known, ...extra] as string[]
  }, [published])

  const posts = useMemo(() => {
    if (filter === 'Todos') return published
    return published.filter((p) => p.categoria === filter)
  }, [published, filter])

  return (
    <main>
      <section className="phero">
        <Wrap>
          <Eyebrow light>
            <F k="eyebrow" />
          </Eyebrow>
          <h1 className="serif">
            <F k="titleLine1" />
            <br />
            <F k="titleLine2" />
          </h1>
          <F k="lead" as="p" multiline />
        </Wrap>
      </section>

      <Section variant="cream">
        <Wrap>
          <div className="blogfilters">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                className={cn('bchip', filter === cat && 'on')}
                onClick={() => setFilter(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {bootstrapping ? (
            <p className="blog-empty">Carregando posts…</p>
          ) : posts.length === 0 ? (
            <p className="blog-empty">
              {blog.emptyMsg ||
                'Nenhum post publicado ainda. Publique pelo painel Admin → Blog.'}
            </p>
          ) : (
            <div className="pgrid">
              {posts.map((post) => {
                const capa = resolveMediaUrl(post.capaUrl)
                return (
                  <Link key={post.id || post.slug} className="blogcard" to={blogArticlePath(post.slug)}>
                    <div className="bimg">
                      {capa ? <img src={capa} alt="" loading="lazy" decoding="async" /> : null}
                      <span className="cat">{post.categoria}</span>
                    </div>
                    <div className="bbody">
                      <h3>{post.titulo}</h3>
                      <p>{post.resumo}</p>
                      <span className="rd">Ler artigo →</span>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </Wrap>
      </Section>
    </main>
  )
}
