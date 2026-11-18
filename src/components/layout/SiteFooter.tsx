import { Link, useLocation } from 'react-router-dom'
import type { MouseEvent } from 'react'

import { HOME_DEFAULTS } from '@/features/admin/defaults/siteContent'
import { useAdmin } from '@/features/admin/AdminProvider'
import { EditableText } from '@/features/admin/components/EditableText'
import type { SiteContent } from '@/features/admin/types'
import { ROUTES } from '@/lib/constants/routes'

function setHomeField(
  content: SiteContent,
  setContent: (c: SiteContent | ((p: SiteContent) => SiteContent)) => void,
  key: string,
  value: string,
) {
  setContent({
    ...content,
    paginas: {
      ...content.paginas,
      home: { ...content.paginas.home, [key]: value },
    },
  })
}

function FootText({
  k,
  as = 'span',
  className,
  multiline,
}: {
  k: string
  as?: 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'div' | 'b'
  className?: string
  multiline?: boolean
}) {
  const { content, setContent } = useAdmin()
  const value = content.paginas.home[k] ?? HOME_DEFAULTS[k] ?? ''
  return (
    <EditableText
      as={as}
      className={className}
      multiline={multiline}
      value={value}
      onChange={(v) => setHomeField(content, setContent, k, v)}
    />
  )
}

export function SiteFooter() {
  const { content, editing } = useAdmin()
  const { pathname } = useLocation()
  const onHome = pathname === '/'
  const current = (path: string) => {
    if (path === ROUTES.BLOG) return pathname === ROUTES.BLOG || pathname.startsWith('/blog/')
    return pathname === path
  }
  const home = content.paginas.home
  const whatsappHref = content.cta.whatsapp || '#'

  const linkClick = (e: MouseEvent) => {
    if (editing) e.preventDefault()
  }

  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="foot-top">
          <div>
            <div className="brand" style={{ fontSize: 24, color: 'var(--cream)' }}>
              <span className="logo" role="img" aria-label="Libra Crédito" />
            </div>
            <FootText k="footTag" as="p" className="foot-tag" multiline />
          </div>

          <div>
            <h2>
              <FootText k="footColProduto" />
            </h2>
            <Link className={onHome ? 'active' : undefined} to={ROUTES.HOME} onClick={linkClick}>
              <FootText k="footLinkHome" />
            </Link>
            <Link
              className={current(ROUTES.SIMULACAO) ? 'active' : undefined}
              to={ROUTES.SIMULACAO}
              onClick={linkClick}
            >
              <FootText k="footLinkSimular" />
            </Link>
            <Link
              className={current(ROUTES.COMO_FUNCIONA) ? 'active' : undefined}
              to={ROUTES.COMO_FUNCIONA}
              onClick={linkClick}
            >
              <FootText k="footLinkComo" />
            </Link>
            <Link
              className={current(ROUTES.POR_QUE_FAZ_SENTIDO) ? 'active' : undefined}
              to={ROUTES.POR_QUE_FAZ_SENTIDO}
              onClick={linkClick}
            >
              <FootText k="footLinkPorQue" />
            </Link>
          </div>

          <div>
            <h2>
              <FootText k="footColEmpresa" />
            </h2>
            <Link
              className={current(ROUTES.A_LIBRA) ? 'active' : undefined}
              to={ROUTES.A_LIBRA}
              onClick={linkClick}
            >
              <FootText k="footLinkLibra" />
            </Link>
            <Link
              className={current(ROUTES.BLOG) ? 'active' : undefined}
              to={ROUTES.BLOG}
              onClick={linkClick}
            >
              <FootText k="footLinkBlog" />
            </Link>
            <Link
              className={current(ROUTES.PARCEIROS) ? 'active' : undefined}
              to={ROUTES.PARCEIROS}
              onClick={linkClick}
            >
              Seja parceiro
            </Link>
            <Link
              className={onHome ? 'active' : undefined}
              to={`${ROUTES.HOME}#depoimento`}
              onClick={linkClick}
            >
              <FootText k="footLinkHistorias" />
            </Link>
          </div>

          <div>
            <h2>
              <FootText k="footColContato" />
            </h2>
            <a href={whatsappHref} onClick={linkClick}>
              <FootText k="footWhatsapp" />
            </a>
            <a
              href={`mailto:${home.footEmail || HOME_DEFAULTS.footEmail}?subject=Contato%20pelo%20site%20da%20Libra`}
              onClick={linkClick}
            >
              <FootText k="footEmail" />
            </a>
            <a href="#" onClick={linkClick}>
              <FootText k="footCidade" />
            </a>
          </div>
        </div>

        <div className="legal">
          <div className="legal-col">
            <FootText k="footCopy" as="p" />
            <FootText k="footCnpj" as="p" multiline />
            <p className="legal-links">
              <Link to={ROUTES.POLITICA_PRIVACIDADE} onClick={linkClick}>
                Política de Privacidade
              </Link>
            </p>
          </div>
          <FootText k="footNote" as="p" className="legal-note" multiline />
        </div>

        {editing ? (
          <p style={{ marginTop: 18, fontSize: 13, color: 'var(--muted-light)' }}>
            Footer editável — altere os textos e clique em <b>Salvar</b> na barra.
          </p>
        ) : null}
      </div>
    </footer>
  )
}
