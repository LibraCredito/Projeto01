import { useEffect, useState } from 'react'

import { useAdmin } from '@/features/admin/AdminProvider'
import { ytId } from '@/features/admin/utils/ytId'
import { cn } from '@/lib/utils'

type VideoSlotProps = {
  url: string
  onChange: (url: string) => void
  className?: string
  label?: string
  hint?: string
}

export function VideoSlot({
  url,
  onChange,
  className,
  label = 'Adicionar vídeo',
  hint,
}: VideoSlotProps) {
  const { editing, setFlash } = useAdmin()
  const id = ytId(url)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    setPlaying(false)
  }, [id])

  const defaultHint = editing
    ? 'Clique aqui e cole a URL do YouTube. Depois Salvar na barra.'
    : 'Em breve: vídeo da Libra.'

  function promptUrl() {
    if (!editing) return
    const next = window.prompt(
      'Cole a URL do YouTube (watch, youtu.be ou embed).\n\nDigite "remover" para tirar o vídeo.',
      url || '',
    )
    if (next === null) return
    const trimmed = next.trim()
    if (trimmed.toLowerCase() === 'remover') {
      onChange('')
      setFlash({ type: 'ok', text: 'Vídeo removido. Clique em Salvar.' })
      return
    }
    if (!trimmed) return
    if (!ytId(trimmed)) {
      setFlash({
        type: 'err',
        text: 'URL inválida. Cole um link do YouTube (ex.: https://www.youtube.com/watch?v=...).',
      })
      return
    }
    onChange(trimmed)
    setFlash({ type: 'ok', text: 'URL do YouTube atualizada. Clique em Salvar.' })
  }

  return (
    <div className={cn('vshell', className, editing && 'is-editing')} data-vslot="">
      <div
        className="vshell-hit"
        onClick={promptUrl}
        role={editing ? 'button' : undefined}
        tabIndex={editing ? 0 : undefined}
        onKeyDown={(e) => {
          if (editing && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault()
            promptUrl()
          }
        }}
        title={editing ? 'Clique para colar a URL do YouTube' : undefined}
      >
        {id && playing && !editing ? (
          <iframe
            title="Vídeo"
            src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : id ? (
          <button
            type="button"
            className="vposter"
            aria-label="Assistir ao vídeo"
            tabIndex={editing ? -1 : undefined}
            onClick={() => {
              if (!editing) setPlaying(true)
            }}
          >
            <img
              src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
              alt=""
              loading="lazy"
              decoding="async"
            />
            <span className="vplay" aria-hidden>
              <svg width="68" height="48" viewBox="0 0 68 48">
                <path
                  d="M66.5 7.7c-.8-2.9-3-5.2-5.9-6C55.3.3 34 .3 34 .3s-21.3 0-26.6 1.4c-2.9.8-5.1 3.1-5.9 6C.1 13 .1 24 .1 24s0 11 1.4 16.3c.8 2.9 3 5.2 5.9 6C12.7 47.7 34 47.7 34 47.7s21.3 0 26.6-1.4c2.9-.8 5.1-3.1 5.9-6C67.9 35 67.9 24 67.9 24s0-11-1.4-16.3z"
                  fill="#f00"
                />
                <path d="M45 24 27 14v20z" fill="#fff" />
              </svg>
            </span>
          </button>
        ) : (
          <div className="vempty">
            <div className="vico">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            <b>{label}</b>
            <p>{hint || defaultHint}</p>
          </div>
        )}
      </div>

      {editing ? (
        <button type="button" className="vswap" onClick={promptUrl}>
          🎬  Colar URL do YouTube
        </button>
      ) : null}
    </div>
  )
}
