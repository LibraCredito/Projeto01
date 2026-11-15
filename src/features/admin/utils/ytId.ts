/** Extrai o ID de 11 caracteres de URLs YouTube (watch, embed, shorts, youtu.be) ou de um ID puro. */
export function ytId(url: string | null | undefined): string | null {
  const raw = (url || '').trim()
  if (/^[\w-]{11}$/.test(raw)) return raw
  const m = raw.match(
    /(?:youtube(?:-nocookie)?\.com\/(?:watch\?[^#]*v=|embed\/|shorts\/|live\/)|youtu\.be\/)([\w-]{11})/,
  )
  return m ? m[1] : null
}
