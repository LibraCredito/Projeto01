import type { MouseEvent } from 'react'
import { Link, NavLink } from 'react-router-dom'

import { Button } from '@/components/ui/Button'
import { NAV_DEFAULTS } from '@/features/admin/defaults/siteContent'
import { useAdmin } from '@/features/admin/AdminProvider'
import { EditableText } from '@/features/admin/components/EditableText'
import type { NavLabels } from '@/features/admin/types'
import { AREA_CLIENTE_URL, ROUTES } from '@/lib/constants/routes'
import { cn } from '@/lib/utils'

const NAV_KEYS: Array<{ to: string; end?: boolean; key: keyof NavLabels }> = [
  { to: ROUTES.HOME, end: true, key: 'home' },
  { to: ROUTES.COMO_FUNCIONA, key: 'comoFunciona' },
  { to: ROUTES.POR_QUE_FAZ_SENTIDO, key: 'porQue' },
  { to: ROUTES.A_LIBRA, key: 'aLibra' },
  { to: ROUTES.PARCEIROS, key: 'parceiros' },
  { to: ROUTES.BLOG, key: 'blog' },
]

type MobileMenuProps = {
  open: boolean
  onClose: () => void
}

export function MobileMenu({ open, onClose }: MobileMenuProps) {
  const { content, setContent, editing } = useAdmin()
  const nav = { ...NAV_DEFAULTS, ...content.nav }

  function setNavLabel(key: keyof NavLabels, value: string) {
    setContent({
      ...content,
      nav: { ...nav, [key]: value },
    })
  }

  function linkClick(e: MouseEvent) {
    if (editing) {
      e.preventDefault()
      return
    }
    onClose()
  }

  return (
    <div className={cn('mmenu', open && 'open')} aria-label="Menu" aria-hidden={!open}>
      <div className="top">
        <Link to={ROUTES.HOME} onClick={onClose} aria-label="Libra Crédito">
          <span className="logo" role="img" aria-label="Libra Crédito" />
        </Link>
        <button type="button" className="mclose" aria-label="Fechar menu" onClick={onClose}>
          ✕
        </button>
      </div>

      <nav>
        {NAV_KEYS.map((item) => (
          <NavLink key={item.to} to={item.to} end={item.end} onClick={linkClick}>
            <EditableText value={nav[item.key]} onChange={(v) => setNavLabel(item.key, v)} />
          </NavLink>
        ))}
      </nav>

      <div className="mfoot">
        <Button to={ROUTES.SIMULACAO} variant="gold" arrow onClick={onClose}>
          Simular meu crédito
        </Button>
        <Button href={AREA_CLIENTE_URL} target="_blank" rel="noopener noreferrer" variant="ghost-l" onClick={onClose}>
          Área do cliente
        </Button>
      </div>
    </div>
  )
}
