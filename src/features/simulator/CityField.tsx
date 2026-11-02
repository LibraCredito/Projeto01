import { useMemo, useState } from 'react'

import { buscarCidades, formatarCidade, type Municipio } from '@/features/simulator/cidades'

type CityFieldProps = {
  value: string
  onChange: (value: string) => void
}

export function CityField({ value, onChange }: CityFieldProps) {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const opcoes = useMemo(() => (open ? buscarCidades(value) : []), [open, value])

  function escolher(cidade: Municipio) {
    onChange(formatarCidade(cidade.nome, cidade.uf))
    setOpen(false)
  }

  return (
    <div className="city-field">
      <input
        value={value}
        placeholder="Digite a cidade"
        autoComplete="off"
        role="combobox"
        aria-expanded={open && opcoes.length > 0}
        aria-autocomplete="list"
        aria-controls="cidade-opcoes"
        onChange={(e) => {
          onChange(e.target.value)
          setActive(0)
          setOpen(true)
        }}
        onFocus={() => {
          if (value.trim().length >= 2) setOpen(true)
        }}
        onBlur={() => {
          window.setTimeout(() => setOpen(false), 120)
        }}
        onKeyDown={(e) => {
          if (!open || opcoes.length === 0) return
          if (e.key === 'ArrowDown') {
            e.preventDefault()
            setActive((i) => Math.min(i + 1, opcoes.length - 1))
          } else if (e.key === 'ArrowUp') {
            e.preventDefault()
            setActive((i) => Math.max(i - 1, 0))
          } else if (e.key === 'Enter') {
            e.preventDefault()
            const cidade = opcoes[active]
            if (cidade) escolher(cidade)
          } else if (e.key === 'Escape') {
            setOpen(false)
          }
        }}
      />
      {open && opcoes.length > 0 ? (
        <ul className="city-list" id="cidade-opcoes" role="listbox">
          {opcoes.map((cidade, i) => {
            const rotulo = formatarCidade(cidade.nome, cidade.uf)
            return (
              <li key={rotulo}>
                <button
                  type="button"
                  role="option"
                  aria-selected={i === active}
                  className={i === active ? 'on' : undefined}
                  onMouseDown={(e) => {
                    e.preventDefault()
                    escolher(cidade)
                  }}
                  onMouseEnter={() => setActive(i)}
                >
                  {rotulo}
                </button>
              </li>
            )
          })}
        </ul>
      ) : null}
    </div>
  )
}
