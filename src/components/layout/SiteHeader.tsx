import { useEffect, useState, type MouseEvent } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'

import { MobileMenu } from '@/components/layout/MobileMenu'
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

/** Páginas com hero escuro: header transparente no topo. */
const TRANSPARENT_TOP_ROUTES = new Set<string>([
  ROUTES.HOME,
  ROUTES.COMO_FUNCIONA,
  ROUTES.POR_QUE_FAZ_SENTIDO,
  ROUTES.A_LIBRA,
  ROUTES.PARCEIROS,
  ROUTES.BLOG,
])

function pathAllowsTransparentTop(pathname: string) {
  if (TRANSPARENT_TOP_ROUTES.has(pathname)) return true
  /* artigos do blog também começam com hero navy */
  if (pathname.startsWith('/blog/')) return true
  return false
}

export function SiteHeader() {
  const location = useLocation()
  const canBeTransparent = pathAllowsTransparentTop(location.pathname)
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { content, setContent, editing } = useAdmin()
  const nav = { ...NAV_DEFAULTS, ...content.nav }

  /** Transparente no topo das abas de marketing; branca ao scrollar (e em páginas fora da lista). */
  const solid = !canBeTransparent || scrolled

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (!canBeTransparent) {
      setScrolled(true)
      return
    }

    setScrolled(false)
    const onScroll = () => setScrolled(window.scrollY > 40)
    const id = window.requestAnimationFrame(onScroll)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.cancelAnimationFrame(id)
      window.removeEventListener('scroll', onScroll)
    }
  }, [canBeTransparent, location.pathname])

  function setNavLabel(key: keyof NavLabels, value: string) {
    setContent({
      ...content,
      nav: { ...nav, [key]: value },
    })
  }

  function linkClick(e: MouseEvent) {
    if (editing) e.preventDefault()
  }

  return (
    <>
      <header className={cn('site-header', solid && 'is-solid')}>
        <div className="wrap">
          <Link to={ROUTES.HOME} className="brand" aria-label="Libra Crédito" onClick={linkClick}>
            <span className="logo" role="img" aria-label="Libra Crédito" />
          </Link>

          <nav className="navlinks" aria-label="Principal">
            {NAV_KEYS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={linkClick}
                className={({ isActive }) => (isActive ? 'active' : undefined)}
              >
                <EditableText
                  value={nav[item.key]}
                  onChange={(v) => setNavLabel(item.key, v)}
                />
              </NavLink>
            ))}
          </nav>

          <div className="navr">
            <a className="login" href={AREA_CLIENTE_URL} target="_blank" rel="noopener noreferrer">
              Área do cliente
            </a>
            <Button to={ROUTES.SIMULACAO} variant="blue" size="sm" arrow>
              Simular
            </Button>
            <button
              type="button"
              className="mburger"
              aria-label="Abrir menu"
              onClick={() => setMenuOpen(true)}
            >
              <i />
              <i />
              <i />
            </button>
          </div>
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  )
}
