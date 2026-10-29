/**
 * Cliente HTTP — Express API (VITE_API_URL / Config).
 *
 * Rotas:
 *   POST   /token
 *   GET    /admin/me
 *   GET/PUT /conteudo
 *   GET    /blog  |  GET /blog/:slug
 *   GET/POST/PUT/DELETE /admin/blog
 *   POST   /leads  |  GET/PATCH /admin/leads
 *   GET    /parceiros/ramos  |  POST /parceiros   (sem token)
 *   POST   /upload/imagem  |  POST /upload/video
 */

import { loadJson, saveJson, STORAGE_KEYS } from '@/features/admin/storage'
import type { AdminConfig, AdminSession } from '@/features/admin/types'

const DEFAULT_CONFIG: AdminConfig = { apiBaseUrl: '' }

export class ApiError extends Error {
  status: number
  body: unknown

  constructor(message: string, status: number, body?: unknown) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.body = body
  }
}

export function getConfig(): AdminConfig {
  return loadJson<AdminConfig>(STORAGE_KEYS.config) ?? { ...DEFAULT_CONFIG }
}

export function setConfig(cfg: AdminConfig): void {
  saveJson(STORAGE_KEYS.config, cfg)
}

/** Prioridade: config do painel > VITE_API_URL */
export function getApiBase(): string {
  const fromConfig = (getConfig().apiBaseUrl || '').trim()
  const fromEnv = (import.meta.env.VITE_API_URL as string | undefined)?.trim() || ''
  return (fromConfig || fromEnv).replace(/\/$/, '')
}

export function isApiEnabled(): boolean {
  return Boolean(getApiBase())
}

export function getToken(): string | null {
  const session = loadJson<AdminSession>(STORAGE_KEYS.session)
  return session?.token ?? null
}

export function setToken(session: NonNullable<AdminSession>): void {
  saveJson(STORAGE_KEYS.session, session)
}

export function clearToken(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.session)
  } catch {
    /* ignore */
  }
}

/** Resolve URLs relativas da API (/images/...) para absolutas.
 * Assets estáticos do Vite (`/videos/`, `/brazil-map.svg`, etc.) ficam na origem do front.
 */
export function resolveMediaUrl(url: string | undefined | null): string {
  if (!url) return ''
  if (/^(https?:|data:|blob:)/i.test(url)) return url

  const path = url.startsWith('/') ? url : `/${url}`
  if (/^\/images\/img-\d+\.jpg$/.test(path)) {
    return path.replace(/\.jpg$/, '.webp')
  }
  if (
    path.startsWith('/videos/') ||
    path.startsWith('/brazil-map') ||
    path === '/logo.png' ||
    path.startsWith('/images/img-')
  ) {
    return path
  }

  const base = getApiBase()
  if (!base) return path
  return `${base}${path}`
}

async function parseBody(res: Response): Promise<unknown> {
  const text = await res.text()
  if (!text) return null
  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}

function messageFromBody(body: unknown, fallback: string): string {
  if (!body) return fallback
  if (typeof body === 'string') return body || fallback
  if (typeof body === 'object') {
    const o = body as Record<string, unknown>
    if (typeof o.message === 'string') return o.message
    if (typeof o.error === 'string') return o.error
    if (typeof o.erro === 'string') return o.erro
    if (Array.isArray(o.errors) && o.errors.length) {
      return o.errors.map(String).join(' · ')
    }
  }
  return fallback
}

async function request<T>(
  path: string,
  init: RequestInit = {},
  opts?: { auth?: boolean; allowEmptyBase?: boolean },
): Promise<T> {
  const base = getApiBase()
  if (!base) {
    if (opts?.allowEmptyBase) return null as T
    throw new ApiError('API não configurada (VITE_API_URL).', 0)
  }

  const headers = new Headers(init.headers || {})
  if (opts?.auth !== false) {
    const token = getToken()
    if (token) headers.set('Authorization', `Bearer ${token}`)
  }
  if (init.body && !(init.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  const res = await fetch(`${base}${path}`, { ...init, headers })
  const body = await parseBody(res)

  if (!res.ok) {
    throw new ApiError(
      messageFromBody(body, `Erro ${res.status} em ${path}`),
      res.status,
      body,
    )
  }

  return body as T
}

export async function apiGet<T>(path: string, opts?: { auth?: boolean }): Promise<T> {
  return request<T>(path, { method: 'GET' }, opts)
}

export async function apiPost<T>(
  path: string,
  body?: unknown,
  opts?: { auth?: boolean },
): Promise<T> {
  return request<T>(
    path,
    {
      method: 'POST',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    },
    opts,
  )
}

export async function apiPut<T>(path: string, body: unknown): Promise<T> {
  return request<T>(path, { method: 'PUT', body: JSON.stringify(body) })
}

export async function apiPatch<T>(path: string, body: unknown): Promise<T> {
  return request<T>(path, { method: 'PATCH', body: JSON.stringify(body) })
}

export async function apiDelete(path: string): Promise<void> {
  await request<unknown>(path, { method: 'DELETE' })
}

export async function uploadImage(file: File): Promise<string> {
  if (!isApiEnabled()) {
    return readAsDataUrl(file)
  }
  const fd = new FormData()
  fd.append('file', file)
  const data = await request<{ url: string }>(
    '/upload/imagem',
    { method: 'POST', body: fd },
  )
  return data.url
}

export async function uploadVideo(file: File): Promise<string> {
  if (!isApiEnabled()) {
    return readAsDataUrl(file)
  }
  const fd = new FormData()
  fd.append('file', file)
  const data = await request<{ url: string }>(
    '/upload/video',
    { method: 'POST', body: fd },
  )
  return data.url
}

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader()
    r.onload = () => resolve(String(r.result))
    r.onerror = () => reject(r.error)
    r.readAsDataURL(file)
  })
}
