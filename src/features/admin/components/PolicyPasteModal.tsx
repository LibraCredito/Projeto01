import { useEffect, useState } from 'react'

type PolicyPasteModalProps = {
  open: boolean
  title: string
  initial?: string
  onClose: () => void
  onApply: (text: string) => void
}

export function PolicyPasteModal({
  open,
  title,
  initial = '',
  onClose,
  onApply,
}: PolicyPasteModalProps) {
  const [text, setText] = useState(initial)

  useEffect(() => {
    if (open) setText(initial)
  }, [open, initial])

  if (!open) return null

  return (
    <div className="polmodal" id="polmodal" role="dialog" aria-modal="true">
      <div className="polmodal-back" data-polmodal-close onClick={onClose} />
      <div className="polmodal-card">
        <button type="button" className="polmodal-x" aria-label="Fechar" onClick={onClose}>
          ✕
        </button>
        <h3 className="serif">{title}</h3>
        <p className="hint">
          Cole o texto puro. Títulos curtos viram seções, linhas com “-” viram listas, linhas com “ | ” viram tabela e **negrito** destaca uma palavra.
        </p>
        <textarea
          className="polta"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Cole ou escreva o texto da política aqui…"
        />
        <div className="polrow">
          <button type="button" className="btn btn-ghost-d" onClick={onClose}>
            Cancelar
          </button>
          <button
            type="button"
            className="btn btn-blue"
            onClick={() => {
              onApply(text)
              onClose()
            }}
          >
            Aplicar texto
          </button>
        </div>
      </div>
    </div>
  )
}
