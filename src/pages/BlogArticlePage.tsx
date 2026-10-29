import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { Button } from '@/components/ui/Button'
import { PageHero } from '@/components/ui/PageHero'
import { Section } from '@/components/ui/Section'
import { Wrap } from '@/components/ui/Wrap'
import type { BlogBlock } from '@/content/blog'
import { formatBlogBody, getPostBySlug, resolveMediaUrl, type BlogPost } from '@/features/admin'
import { isHtmlPost, resolveBlogHtmlImages } from '@/features/admin/utils/blogHtml'
import { ROUTES } from '@/lib/constants/routes'

/** HTML já sanitizado pela API; aqui só resolve imagens e aplica carregamento tardio. */
function prepareArticleHtml(html: string): string {
  return resolveBlogHtmlImages(html)
    .replace(/<img\b(?![^>]*\bloading=)/gi, '<img loading="lazy" decoding="async"')
    .replace(/<iframe\b(?![^>]*\bloading=)/gi, '<iframe loading="lazy"')
}

function Block({ block }: { block: BlogBlock }) {
  if (block.type === 'h2') return <h2>{block.text}</h2>
  if (block.type === 'ul') {
    return (
      <ul>
        {block.items.map((item) => (
          <li key={item} dangerouslySetInnerHTML={{ __html: item }} />
        ))}
      </ul>
    )
  }
  if (block.html) {
    return <p dangerouslySetInnerHTML={{ __html: block.text }} />
  }
  return <p>{block.text}</p>
}

export function BlogArticlePage() {
  const { slug = '' } = useParams()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    ;(async () => {
      const remote = await getPostBySlug(slug)
      if (!cancelled) {
        setPost(remote)
        setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [slug])

  if (loading) {
    return (
      <main>
        <PageHero eyebrow="Blog" title="Carregando…" wide>
          Aguarde um instante.
        </PageHero>
      </main>
    )
  }

  if (!post || !post.publicado) {
    return (
      <main>
        <PageHero eyebrow="Blog" title="Artigo não encontrado" wide>
          Esse conteúdo não existe, está oculto ou foi movido.
        </PageHero>
        <Section variant="cream">
          <Wrap>
            <div className="artwrap">
              <Link className="artback" to={ROUTES.BLOG}>
                ← Voltar ao blog
              </Link>
            </div>
          </Wrap>
        </Section>
      </main>
    )
  }

  const html = isHtmlPost(post) ? prepareArticleHtml(post.corpoTexto || '') : null
  const body = html === null ? formatBlogBody(post.corpoTexto || '') : []
  const capa = resolveMediaUrl(post.capaUrl)

  return (
    <main>
      <PageHero eyebrow="Blog" title={post.titulo} wide>
        {post.subtitulo}
      </PageHero>

      <Section variant="cream">
        <Wrap>
          <div className="artwrap">
            <Link className="artback" to={ROUTES.BLOG}>
              ← Voltar ao blog
            </Link>
            <div className="artmeta">
              <span className="cat">{post.categoria}</span>
              <span>{post.leitura}</span>
            </div>
            {capa ? (
              <div className="artcapa">
                <img src={capa} alt="" />
              </div>
            ) : null}
            {html !== null ? (
              <div className="artbody artbody-html" dangerouslySetInnerHTML={{ __html: html }} />
            ) : (
              <div className="artbody">
                {body.map((block, i) => (
                  <Block key={i} block={block} />
                ))}
              </div>
            )}
            <div className="artcta">
              <h3>Que tal ver isso na prática?</h3>
              <p>
                Faça uma simulação gratuita e descubra em minutos quanto o seu imóvel pode oferecer.
              </p>
              <Button to={ROUTES.SIMULACAO} variant="gold" arrow>
                Simular meu crédito
              </Button>
            </div>
          </div>
        </Wrap>
      </Section>
    </main>
  )
}
