import { useState } from 'react'
import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/Button'
import { PageHero } from '@/components/ui/PageHero'
import { Section } from '@/components/ui/Section'
import { Wrap } from '@/components/ui/Wrap'
import { useAdmin, formatPlainText, PolicyPasteModal } from '@/features/admin'
import { ROUTES } from '@/lib/constants/routes'

export function PoliticaPrivacidadePage() {
  const { content, setContent, session, editing } = useAdmin()
  const [modalOpen, setModalOpen] = useState(false)
  const texto = content.politicas.privacidadeTexto.trim()
  const html = texto ? formatPlainText(texto, 'Política de Privacidade') : ''

  return (
    <main>
      <PageHero eyebrow="Institucional" title="Política de Privacidade" wide>
        Como cuidamos dos seus dados — com a mesma transparência que colocamos no crédito.
      </PageHero>
      <Section variant="cream">
        <Wrap>
          <div className="artwrap">
            <Link className="artback" to={ROUTES.HOME}>
              ← Voltar para o início
            </Link>
            <div className="artbody">
              {html ? (
                <>
                  <div dangerouslySetInnerHTML={{ __html: html }} />
                  {session && editing ? (
                    <p className="doc-reedit">
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          setModalOpen(true)
                        }}
                      >
                        ✎ Substituir texto (visível no modo de edição)
                      </a>
                    </p>
                  ) : null}
                </>
              ) : (
                <div className="doc-pending">
                  <b>Documento em migração</b>
                  <p>
                    Estamos trazendo o texto oficial da nossa Política de Privacidade para cá, na
                    íntegra. Enquanto isso, você pode ler a versão vigente no nosso site:
                  </p>
                  <Button
                    href="https://www.libracredito.com.br/politica-privacidade"
                    variant="ghost-d"
                    arrow
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Ler a vigente
                  </Button>
                  {session ? (
                    <p style={{ marginTop: 16 }}>
                      <button
                        type="button"
                        className="btn btn-blue"
                        data-polpaste
                        onClick={() => setModalOpen(true)}
                      >
                        Colar texto (admin)
                      </button>
                    </p>
                  ) : null}
                </div>
              )}
            </div>
          </div>
        </Wrap>
      </Section>
      <PolicyPasteModal
        open={modalOpen}
        title="Política de Privacidade"
        initial={content.politicas.privacidadeTexto}
        onClose={() => setModalOpen(false)}
        onApply={(t) =>
          setContent({
            ...content,
            politicas: { ...content.politicas, privacidadeTexto: t },
          })
        }
      />
    </main>
  )
}
