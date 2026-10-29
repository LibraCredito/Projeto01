import { resolveMediaUrl } from '@/features/admin/api/client'
import type { BlogPost } from '@/features/admin/types'
import { formatBlogBody } from '@/features/admin/utils/formatBlogBody'

/**
 * No banco, imagens do corpo ficam como `/images/arquivo` (a API só aceita esse formato).
 * Na tela, precisam do endereço da API (`http://localhost:3018/images/...` ou `/api/images/...`).
 */
function uploadedImagesPrefix(): string {
  return resolveMediaUrl('/images/__x').replace('__x', '')
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/** HTML salvo → HTML exibível (editor ou artigo). */
export function resolveBlogHtmlImages(html: string): string {
  const prefix = uploadedImagesPrefix()
  if (prefix === '/images/') return html
  return html.replace(/(<img\b[^>]*?\ssrc=")\/images\//gi, `$1${prefix}`)
}

/** HTML do editor → HTML para salvar (caminhos de imagem relativos). */
export function toStoredBlogHtml(html: string): string {
  const prefix = uploadedImagesPrefix()
  if (prefix === '/images/') return html
  const variants = [prefix]
  if (prefix.startsWith('/') && typeof window !== 'undefined') {
    variants.push(`${window.location.origin}${prefix}`)
  }
  let out = html
  for (const v of variants) {
    out = out.replace(new RegExp(`(<img\\b[^>]*?\\ssrc=")${escapeRegExp(v)}`, 'gi'), '$1/images/')
  }
  return out
}

/** Texto puro dos posts antigos → HTML, para abrir no editor. */
export function plainTextToHtml(txt: string): string {
  return formatBlogBody(txt)
    .map((b) => {
      if (b.type === 'h2') return `<h2>${escapeHtml(b.text)}</h2>`
      if (b.type === 'ul') return `<ul>${b.items.map((i) => `<li>${i}</li>`).join('')}</ul>`
      return `<p>${b.html ? b.text : escapeHtml(b.text)}</p>`
    })
    .join('\n')
}

export function isHtmlPost(post: Pick<BlogPost, 'corpoFormato'>): boolean {
  return post.corpoFormato === 'html'
}

/** True se o HTML do editor não tem texto nem imagem. */
export function isBlogHtmlEmpty(html: string): boolean {
  if (/<(img|iframe|table)\b/i.test(html)) return false
  return html.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').trim() === ''
}
