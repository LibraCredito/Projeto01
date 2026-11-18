import { useEffect, useState } from 'react'

import { Eyebrow } from '@/components/ui/Eyebrow'
import { useAdmin } from '@/features/admin/AdminProvider'
import { usePageField } from '@/features/admin/hooks/usePageField'
import { ytId } from '@/features/admin/utils/ytId'

const MAX_SHORTS = 10

export function ShortsCarousel() {
  const { content, setContent, editing, setFlash } = useAdmin()
  const { Field: F } = usePageField('blog')
  const shorts = content.shorts ?? []
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState<number | null>(null)

  useEffect(() => {
    setIndex((current) => Math.min(current, Math.max(shorts.length - 1, 0)))
    setPlaying(null)
  }, [shorts.length])

  function save(next: string[], message: string) {
    setContent({ ...content, shorts: next.slice(0, MAX_SHORTS) })
    setFlash({ type: 'ok', text: message })
  }

  function askUrl(current = '') {
    const next = window.prompt(
      'Cole a URL do YouTube do short (watch, youtu.be ou /shorts/).',
      current,
    )
    if (next === null) return null
    const trimmed = next.trim()
    if (!trimmed || !ytId(trimmed)) {
      setFlash({
        type: 'err',
        text: 'URL inválida. Cole um link do YouTube.',
      })
      return null
    }
    return trimmed
  }

  function addShort() {
    if (shorts.length >= MAX_SHORTS) return
    const url = askUrl()
    if (!url) return
    const next = [...shorts, url]
    setIndex(next.length - 1)
    save(next, 'Short adicionado. Clique em Salvar na barra para gravar no servidor.')
  }

  function replaceShort() {
    const url = askUrl(shorts[index] || '')
    if (!url) return
    save(
      shorts.map((item, i) => (i === index ? url : item)),
      'Link atualizado. Clique em Salvar na barra para gravar no servidor.',
    )
  }

  function removeShort() {
    if (shorts.length === 0) return
    const next = shorts.filter((_, i) => i !== index)
    setIndex(Math.max(0, index - 1))
    save(next, 'Short removido. Clique em Salvar na barra para gravar no servidor.')
  }

  function go(direction: 1 | -1) {
    setPlaying(null)
    setIndex((current) => Math.min(shorts.length - 1, Math.max(0, current + direction)))
  }

  const current = shorts[index]

  return (
    <div className="shgrid">
      <div className="sh-left">
        <div className="sec-head" style={{ marginBottom: 0 }}>
          <Eyebrow>
            <F k="shortsEyebrow" />
          </Eyebrow>
          <h2 className="serif">
            <F k="shortsTitle" /> <F k="shortsTitleEm" as="span" className="em" />.
          </h2>
          <F k="shortsLead" as="p" multiline />
        </div>
        <div className="shnav">
          <button className="shbtn" type="button" aria-label="Short anterior" onClick={() => go(-1)}>
            ‹
          </button>
          <button className="shbtn" type="button" aria-label="Próximo short" onClick={() => go(1)}>
            ›
          </button>
        </div>
        {editing ? (
          <div className="depo-edit sh-edit">
            <button
              type="button"
              className="btn btn-blue btn-sm"
              onClick={addShort}
              disabled={shorts.length >= MAX_SHORTS}
            >
              Adicionar short
            </button>
            <button
              type="button"
              className="btn btn-ghost-d btn-sm"
              onClick={replaceShort}
              disabled={!current}
            >
              Trocar o link
            </button>
            <button
              type="button"
              className="btn btn-ghost-d btn-sm"
              onClick={removeShort}
              disabled={shorts.length === 0}
            >
              Remover este short
            </button>
            <span className="count">
              {shorts.length === 0
                ? `0 de ${MAX_SHORTS}`
                : `${index + 1} · ${shorts.length} de ${MAX_SHORTS}`}
            </span>
          </div>
        ) : null}
      </div>
      <div className="shwrap">
        <div className="shtrack" style={{ transform: `translateX(-${index * 100}%)` }}>
          {shorts.length === 0 ? (
            <div className="sh sh-empty">Nenhum short publicado.</div>
          ) : (
            shorts.map((url, i) => {
              const id = ytId(url)
              if (!id) return null
              return (
                <div className="sh" key={`${id}-${i}`}>
                  {playing === i && !editing ? (
                    <iframe
                      title="Short da Libra no YouTube"
                      src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <button
                      className="sh-th"
                      type="button"
                      aria-label="Assistir short da Libra no YouTube"
                      onClick={() => {
                        if (!editing) setPlaying(i)
                      }}
                    >
                      <img
                        src={`https://i.ytimg.com/vi/${id}/oar2.jpg`}
                        alt=""
                        loading="lazy"
                        onError={(event) => {
                          const img = event.currentTarget
                          if (img.dataset.fallback === '1') return
                          img.dataset.fallback = '1'
                          img.src = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`
                        }}
                      />
                      <span className="sh-play" aria-hidden>
                        ▶
                      </span>
                    </button>
                  )}
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
