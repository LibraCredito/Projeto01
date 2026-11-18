import { Link } from 'react-router-dom'

import { PageHero } from '@/components/ui/PageHero'
import { Section } from '@/components/ui/Section'
import { Wrap } from '@/components/ui/Wrap'
import { EditableText, PolicyDocument, useAdmin } from '@/features/admin'
import { ROUTES } from '@/lib/constants/routes'
import type { SiteContent } from '@/features/admin/types'

export function PoliticaPrivacidadePage() {
  const { content, setContent } = useAdmin()

  function setPolitica(
    key: keyof SiteContent['politicas'],
    value: string | ((current: string) => string),
  ) {
    setContent((prev) => {
      const current = prev.politicas[key]
      const next = typeof value === 'function' ? value(current) : value
      if (next === current) return prev
      return {
        ...prev,
        politicas: { ...prev.politicas, [key]: next },
      }
    })
  }

  return (
    <main>
      <PageHero
        wide
        eyebrow={
          <EditableText
            value={content.politicas.privacidadeEyebrow}
            onChange={(value) => setPolitica('privacidadeEyebrow', value)}
          />
        }
        title={
          <EditableText
            value={content.politicas.privacidadeTitulo}
            onChange={(value) => setPolitica('privacidadeTitulo', value)}
          />
        }
      >
        <EditableText
          value={content.politicas.privacidadeLead}
          onChange={(value) => setPolitica('privacidadeLead', value)}
          multiline
        />
      </PageHero>
      <Section variant="cream">
        <Wrap>
          <div className="artwrap">
            <Link className="artback" to={ROUTES.HOME}>
              ← Voltar para o início
            </Link>
            <div className="artbody">
              <PolicyDocument
                text={content.politicas.privacidadeTexto}
                onChange={(update) => setPolitica('privacidadeTexto', update)}
              />
            </div>
          </div>
        </Wrap>
      </Section>
    </main>
  )
}
