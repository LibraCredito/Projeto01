import { useAdmin } from '@/features/admin/AdminProvider'
import { EditableText } from '@/features/admin/components/EditableText'
import {
  ALIBRA_DEFAULTS,
  BLOG_DEFAULTS,
  COMO_DEFAULTS,
  HOME_DEFAULTS,
  PARCEIROS_DEFAULTS,
  PORQUE_DEFAULTS,
} from '@/features/admin/defaults/siteContent'
import type { SiteContent } from '@/features/admin/types'

export type PageKey = keyof SiteContent['paginas']

const PAGE_DEFAULTS: Record<PageKey, Record<string, string>> = {
  home: HOME_DEFAULTS,
  comoFunciona: COMO_DEFAULTS,
  porQue: PORQUE_DEFAULTS,
  aLibra: ALIBRA_DEFAULTS,
  parceiros: PARCEIROS_DEFAULTS,
  blog: BLOG_DEFAULTS,
}

export function setPageField(
  content: SiteContent,
  setContent: (c: SiteContent | ((p: SiteContent) => SiteContent)) => void,
  page: PageKey,
  key: string,
  value: string,
) {
  setContent({
    ...content,
    paginas: {
      ...content.paginas,
      [page]: { ...content.paginas[page], [key]: value },
    },
  })
}

export function usePageField(page: PageKey) {
  const { content, setContent } = useAdmin()
  const defaults = PAGE_DEFAULTS[page]

  function Field({
    k,
    as = 'span',
    className,
    multiline,
  }: {
    k: string
    as?: 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'div' | 'b' | 'i' | 'small'
    className?: string
    multiline?: boolean
  }) {
    const value = content.paginas[page][k] ?? defaults[k] ?? ''
    return (
      <EditableText
        as={as}
        className={className}
        multiline={multiline}
        value={value}
        onChange={(v) => setPageField(content, setContent, page, k, v)}
      />
    )
  }

  return { Field, content, setContent }
}
