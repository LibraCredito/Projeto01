import { lazy, Suspense, useEffect, useRef, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'

import { BLOG_CATEGORIES } from '@/content/blog'
import { useAdmin } from '@/features/admin/AdminProvider'
import { resolveMediaUrl, uploadImage } from '@/features/admin/api/client'
import type { BlogPost } from '@/features/admin/types'
import {
  isBlogHtmlEmpty,
  isHtmlPost,
  plainTextToHtml,
  resolveBlogHtmlImages,
  toStoredBlogHtml,
} from '@/features/admin/utils/blogHtml'
import { slugify } from '@/features/admin/utils/slugify'
import { ROUTES, blogArticlePath } from '@/lib/constants/routes'

const BlogEditor = lazy(() =>
  import('@/features/admin/components/BlogEditor').then((m) => ({ default: m.BlogEditor })),
)

type FormState = {
  titulo: string
  slug: string
  categoria: string
  resumo: string
  subtitulo: string
  leitura: string
  corpoTexto: string
  capaUrl: string | undefined
  publicado: boolean
}

const emptyForm = (): FormState => ({
  titulo: '',
  slug: '',
  categoria: 'Guia',
  resumo: '',
  subtitulo: '',
  leitura: 'Leitura de 4 min',
  corpoTexto: '',
  capaUrl: undefined,
  publicado: true,
})

function fromPost(p: BlogPost): FormState {
  return {
    titulo: p.titulo,
    slug: p.slug,
    categoria: p.categoria,
    resumo: p.resumo,
    subtitulo: p.subtitulo,
    leitura: p.leitura,
    corpoTexto: isHtmlPost(p)
      ? resolveBlogHtmlImages(p.corpoTexto || '')
      : plainTextToHtml(p.corpoTexto || ''),
    capaUrl: p.capaUrl,
    publicado: p.publicado,
  }
}

export function BlogPanel() {
  const { posts, createPost, updatePost, deletePost, setFlash, refreshPosts } = useAdmin()
  const [form, setForm] = useState<FormState>(emptyForm)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [msg, setMsg] = useState('')
  const [busy, setBusy] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    void refreshPosts()
  }, [refreshPosts])

  function patchForm(partial: Partial<FormState>) {
    setForm((prev) => ({ ...prev, ...partial }))
  }

  function resetForm() {
    setEditingId(null)
    setForm(emptyForm())
    setMsg('')
    if (fileRef.current) fileRef.current.value = ''
  }

  function startEdit(p: BlogPost) {
    setEditingId(p.id)
    setForm(fromPost(p))
    setMsg(
      isHtmlPost(p)
        ? `Editando: ${p.titulo}`
        : `Editando: ${p.titulo} — este post estava em texto simples e foi convertido para o editor. Confira a formatação antes de salvar.`,
    )
    if (fileRef.current) fileRef.current.value = ''
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function onImg(file: File | undefined) {
    if (!file) return
    try {
      setBusy(true)
      const url = await uploadImage(file)
      patchForm({ capaUrl: url })
      setFlash({ type: 'ok', text: 'Capa enviada. Salve o post para gravar.' })
    } catch (err) {
      const text = err instanceof Error ? err.message : 'Falha no upload da capa.'
      setMsg(text)
      setFlash({ type: 'err', text })
    } finally {
      setBusy(false)
    }
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (!form.titulo.trim() || isBlogHtmlEmpty(form.corpoTexto)) {
      setMsg('Preencha título e conteúdo.')
      return
    }

    const slug = (form.slug.trim() || slugify(form.titulo)).toLowerCase()
    const payload = {
      titulo: form.titulo.trim(),
      slug,
      categoria: form.categoria.trim() || 'Guia',
      resumo: form.resumo.trim(),
      subtitulo: form.subtitulo.trim(),
      leitura: form.leitura.trim() || 'Leitura de 4 min',
      corpoTexto: toStoredBlogHtml(form.corpoTexto),
      corpoFormato: 'html' as const,
      capaUrl: form.capaUrl,
      publicado: form.publicado,
    }

    setBusy(true)
    try {
      if (editingId) {
        await updatePost(editingId, payload)
        setMsg('Post atualizado no servidor.')
        setFlash({ type: 'ok', text: 'Post atualizado.' })
      } else {
        await createPost(payload)
        setMsg(form.publicado ? 'Post criado e publicado.' : 'Rascunho criado.')
        setFlash({ type: 'ok', text: 'Post criado.' })
        resetForm()
      }
    } catch (err) {
      const text = err instanceof Error ? err.message : 'Erro ao salvar post.'
      setMsg(text)
      setFlash({ type: 'err', text })
    } finally {
      setBusy(false)
    }
  }

  async function onTogglePublish(p: BlogPost) {
    try {
      await updatePost(p.id, { publicado: !p.publicado })
      setFlash({
        type: 'ok',
        text: p.publicado ? 'Post ocultado.' : 'Post publicado.',
      })
      if (editingId === p.id) patchForm({ publicado: !p.publicado })
    } catch (err) {
      setFlash({
        type: 'err',
        text: err instanceof Error ? err.message : 'Erro ao alterar status.',
      })
    }
  }

  async function onDelete(p: BlogPost) {
    if (!window.confirm(`Excluir “${p.titulo}”? Essa ação não tem volta.`)) return
    try {
      await deletePost(p.id)
      setFlash({ type: 'ok', text: 'Post excluído.' })
      if (editingId === p.id) resetForm()
    } catch (err) {
      setFlash({
        type: 'err',
        text: err instanceof Error ? err.message : 'Erro ao excluir.',
      })
    }
  }

  const capaPreview = resolveMediaUrl(form.capaUrl)

  return (
    <>
      <div className="adm-card">
        <h3>{editingId ? 'Editar post' : 'Novo post'}</h3>
        <p className="hint">
          O conteúdo usa o editor: títulos, negrito, listas, links, imagens (enviadas para o
          servidor) e vídeos do YouTube. Imagens aceitas: JPG, PNG ou WEBP de até 5 MB.
        </p>
        <form className="adm-grid" onSubmit={(e) => void onSubmit(e)}>
          <div className="adm-field">
            <label>Título</label>
            <input
              value={form.titulo}
              onChange={(e) => {
                const titulo = e.target.value
                patchForm({
                  titulo,
                  slug: editingId ? form.slug : slugify(titulo),
                })
              }}
              placeholder="Ex.: Consórcio ou home equity?"
            />
          </div>
          <div className="adm-field">
            <label>Slug (URL)</label>
            <input
              value={form.slug}
              onChange={(e) => patchForm({ slug: slugify(e.target.value) || e.target.value })}
              placeholder="ex.: consorcio-ou-home-equity"
            />
          </div>
          <div className="adm-field">
            <label>Categoria</label>
            <input
              value={form.categoria}
              onChange={(e) => patchForm({ categoria: e.target.value })}
              placeholder="Ex.: Guia"
              list="bp-cats"
            />
            <datalist id="bp-cats">
              {BLOG_CATEGORIES.filter((c) => c !== 'Todos').map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </div>
          <div className="adm-field">
            <label>Tempo de leitura</label>
            <input
              value={form.leitura}
              onChange={(e) => patchForm({ leitura: e.target.value })}
              placeholder="Ex.: Leitura de 4 min"
            />
          </div>
          <div className="adm-field full">
            <label>Resumo (card do blog)</label>
            <input
              value={form.resumo}
              onChange={(e) => patchForm({ resumo: e.target.value })}
              placeholder="Uma frase que convida a ler."
            />
          </div>
          <div className="adm-field full">
            <label>Subtítulo (abertura do artigo)</label>
            <input
              value={form.subtitulo}
              onChange={(e) => patchForm({ subtitulo: e.target.value })}
              placeholder="Uma linha de contexto logo abaixo do título."
            />
          </div>
          <div className="adm-field">
            <label>Imagem de capa</label>
            <input
              ref={fileRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp"
              disabled={busy}
              onChange={(e) => {
                void onImg(e.target.files?.[0])
                e.target.value = ''
              }}
            />
            {capaPreview ? (
              <div className="adm-capa-preview">
                <img src={capaPreview} alt="Capa" />
                <button type="button" className="danger" onClick={() => patchForm({ capaUrl: undefined })}>
                  Remover capa
                </button>
              </div>
            ) : null}
          </div>
          <div className="adm-field">
            <label>Status</label>
            <label className="adm-check">
              <input
                type="checkbox"
                checked={form.publicado}
                onChange={(e) => patchForm({ publicado: e.target.checked })}
              />
              Publicado (visível em /blog)
            </label>
          </div>
          <div className="adm-field full">
            <label>Conteúdo</label>
            <Suspense fallback={<div className="adm-editor-loading">Carregando editor…</div>}>
              <BlogEditor
                key={editingId ?? 'novo'}
                value={form.corpoTexto}
                onChange={(html) => patchForm({ corpoTexto: html })}
                disabled={busy}
              />
            </Suspense>
          </div>
          <div className="adm-actions full">
            <button type="submit" className="btn btn-blue" disabled={busy}>
              {busy
                ? 'Salvando…'
                : editingId
                  ? 'Salvar alterações'
                  : form.publicado
                    ? 'Criar e publicar'
                    : 'Criar rascunho'}
              <span className="ar">→</span>
            </button>
            {editingId ? (
              <button type="button" className="btn btn-ghost-d" onClick={resetForm} disabled={busy}>
                Cancelar edição
              </button>
            ) : null}
            <Link className="btn btn-ghost-d" to={ROUTES.BLOG}>
              Ver o blog
            </Link>
          </div>
          {msg ? <p className="adm-msg full">{msg}</p> : null}
        </form>
      </div>

      <div className="adm-card">
        <h3>Posts ({posts.length})</h3>
        <p className="hint">
          Lista de <code>GET /admin/blog</code>. Editar preenche o formulário acima. Publicar/ocultar
          e excluir chamam a API na hora (não depende do “Salvar” da barra preta).
        </p>
        <div className="adm-list">
          {posts.length === 0 ? (
            <div className="adm-empty">Nenhum post no servidor ainda.</div>
          ) : (
            posts.map((p) => (
              <div key={p.id} className="adm-item">
                <span className="cat-pill">{p.categoria}</span>
                <Link className="ttl" to={blogArticlePath(p.slug)}>
                  {p.titulo}
                </Link>
                <span className="st">{p.publicado ? 'Público' : 'Rascunho'}</span>
                <button type="button" onClick={() => startEdit(p)}>
                  Editar
                </button>
                <button type="button" onClick={() => void onTogglePublish(p)}>
                  {p.publicado ? 'Ocultar' : 'Publicar'}
                </button>
                <button type="button" className="danger" onClick={() => void onDelete(p)}>
                  Excluir
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  )
}
