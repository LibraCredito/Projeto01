import type { ReactNode } from 'react'

import { Eyebrow } from '@/components/ui/Eyebrow'
import { Wrap } from '@/components/ui/Wrap'

type PageHeroProps = {
  eyebrow: ReactNode
  title: ReactNode
  children?: ReactNode
  /** Narrower article-style hero */
  wide?: boolean
}

export function PageHero({ eyebrow, title, children, wide }: PageHeroProps) {
  const inner = (
    <>
      <Eyebrow light>{eyebrow}</Eyebrow>
      <h1 className="serif" style={wide ? { fontSize: 'clamp(32px, 4.6vw, 56px)' } : undefined}>
        {title}
      </h1>
      {children ? <p>{children}</p> : null}
    </>
  )

  return (
    <section className="phero">
      <Wrap>
        {wide ? <div className="artwrap" style={{ maxWidth: '52rem' }}>{inner}</div> : inner}
      </Wrap>
    </section>
  )
}
