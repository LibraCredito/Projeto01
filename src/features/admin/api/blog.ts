import { createDefaultBlogPosts } from '@/features/admin/defaults/blogPosts'
import {
  apiDelete,
  apiGet,
  apiPost,
  apiPut,
  isApiEnabled,
} from '@/features/admin/api/client'
import { loadJson, saveJson, STORAGE_KEYS } from '@/features/admin/storage'
import type { BlogPost } from '@/features/admin/types'
import { createId } from '@/features/admin/utils/id'
import { slugify } from '@/features/admin/utils/slugify'

export function listPostsLocal(): BlogPost[] {
  const stored = loadJson<BlogPost[]>(STORAGE_KEYS.posts)
  if (stored && Array.isArray(stored)) return stored
  const defaults = createDefaultBlogPosts()
  saveJson(STORAGE_KEYS.posts, defaults)
  return defaults
}

function persist(posts: BlogPost[]): BlogPost[] {
  saveJson(STORAGE_KEYS.posts, posts)
  return posts
}

export function createPostLocal(
  input: Omit<BlogPost, 'id' | 'slug' | 'publicadoEm'> & { slug?: string },
): BlogPost {
  const posts = listPostsLocal()
  const post: BlogPost = {
    id: createId(),
    slug: input.slug || slugify(input.titulo),
    titulo: input.titulo,
    categoria: input.categoria,
    resumo: input.resumo,
    subtitulo: input.subtitulo,
    leitura: input.leitura,
    corpoTexto: input.corpoTexto,
    corpoFormato: input.corpoFormato ?? 'texto',
    capaUrl: input.capaUrl,
    publicado: input.publicado,
    publicadoEm: new Date().toISOString(),
  }
  persist([post, ...posts])
  return post
}

export function updatePostLocal(id: string, patch: Partial<BlogPost>): BlogPost | null {
  const posts = listPostsLocal()
  const i = posts.findIndex((p) => p.id === id)
  if (i < 0) return null
  const next = { ...posts[i], ...patch, id: posts[i].id }
  posts[i] = next
  persist(posts)
  return next
}

export function deletePostLocal(id: string): boolean {
  const posts = listPostsLocal()
  const next = posts.filter((p) => p.id !== id)
  if (next.length === posts.length) return false
  persist(next)
  return true
}

export function getPostBySlugLocal(slug: string): BlogPost | undefined {
  return listPostsLocal().find((p) => p.slug === slug)
}

/** Público: só publicados */
export async function listPostsPublic(): Promise<BlogPost[]> {
  if (isApiEnabled()) {
    const remote = await apiGet<BlogPost[]>('/blog', { auth: false })
    return Array.isArray(remote) ? remote : []
  }
  return listPostsLocal().filter((p) => p.publicado)
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  if (isApiEnabled()) {
    try {
      return await apiGet<BlogPost>(`/blog/${encodeURIComponent(slug)}`, { auth: false })
    } catch {
      return null
    }
  }
  return getPostBySlugLocal(slug) ?? null
}

/** Admin: todos os posts */
export async function listPostsAdmin(): Promise<BlogPost[]> {
  if (isApiEnabled()) {
    const remote = await apiGet<BlogPost[]>('/admin/blog')
    const list = Array.isArray(remote) ? remote : []
    persist(list)
    return list
  }
  return listPostsLocal()
}

export async function createPost(
  input: Omit<BlogPost, 'id' | 'slug' | 'publicadoEm'> & { slug?: string },
): Promise<BlogPost> {
  if (isApiEnabled()) {
    const body = {
      ...input,
      slug: input.slug || slugify(input.titulo),
    }
    const created = await apiPost<BlogPost>('/admin/blog', body)
    const all = await listPostsAdmin()
    persist(all)
    return created
  }
  return createPostLocal(input)
}

export async function updatePost(id: string, patch: Partial<BlogPost>): Promise<BlogPost | null> {
  if (isApiEnabled()) {
    const updated = await apiPut<BlogPost>(`/admin/blog/${id}`, patch)
    await listPostsAdmin()
    return updated
  }
  return updatePostLocal(id, patch)
}

export async function deletePost(id: string): Promise<boolean> {
  if (isApiEnabled()) {
    await apiDelete(`/admin/blog/${id}`)
    await listPostsAdmin()
    return true
  }
  return deletePostLocal(id)
}
