import { useState, type FocusEvent, type MouseEvent } from 'react'

import mapSvg from '../assets/brazil-map.svg?raw'

type Tip = {
  name: string
  x: number
  y: number
}

function cityGroup(target: EventTarget | null) {
  const el = target as Element | null
  return el?.closest?.('g.br-city, g.br-hq') ?? null
}

export function BrazilMap() {
  const [tip, setTip] = useState<Tip | null>(null)

  function show(group: Element, wrap: HTMLElement) {
    const name = group.querySelector('title')?.textContent?.trim()
    if (!name) return
    const dot = group.querySelector('circle:not(.br-ring):not(.br-hit)') ?? group
    const box = dot.getBoundingClientRect()
    const rect = wrap.getBoundingClientRect()
    setTip({
      name,
      x: box.left + box.width / 2 - rect.left,
      y: box.top - rect.top,
    })
  }

  function onMouseOver(event: MouseEvent<HTMLDivElement>) {
    const group = cityGroup(event.target)
    if (!group) return
    show(group, event.currentTarget)
  }

  function onMouseOut(event: MouseEvent<HTMLDivElement>) {
    const next = event.relatedTarget
    if (next instanceof Node && event.currentTarget.contains(next) && cityGroup(next)) return
    setTip(null)
  }

  function onFocus(event: FocusEvent<HTMLDivElement>) {
    const group = cityGroup(event.target)
    if (!group) return
    show(group, event.currentTarget)
  }

  function onBlur(event: FocusEvent<HTMLDivElement>) {
    const next = event.relatedTarget
    if (next instanceof Node && event.currentTarget.contains(next)) return
    setTip(null)
  }

  return (
    <div
      className="br-map-wrap"
      onMouseOver={onMouseOver}
      onMouseOut={onMouseOut}
      onFocus={onFocus}
      onBlur={onBlur}
    >
      <div dangerouslySetInnerHTML={{ __html: mapSvg }} />
      {tip ? (
        <span className="br-tip" style={{ left: tip.x, top: tip.y }} role="status">
          {tip.name}
        </span>
      ) : null}
    </div>
  )
}
