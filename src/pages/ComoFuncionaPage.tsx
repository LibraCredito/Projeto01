import { Button } from '@/components/ui/Button'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { Section } from '@/components/ui/Section'
import { Wrap } from '@/components/ui/Wrap'
import { usePageField } from '@/features/admin/hooks/usePageField'
import { ROUTES } from '@/lib/constants/routes'

export function ComoFuncionaPage() {
  const { Field: F } = usePageField('comoFunciona')

  return (
    <main>
      <section className="phero">
        <Wrap>
          <Eyebrow light>
            <F k="eyebrow" />
          </Eyebrow>
          <h1 className="serif">
            <F k="titleLine1" />
            <br />
            <F k="titleLine2" />
          </h1>
          <F k="lead" as="p" multiline />
        </Wrap>
      </section>

      <Section variant="cream">
        <Wrap>
          <div className="uselist">
            <div className="use">
              <div className="ui">1</div>
              <div>
                <F k="step1Title" as="h3" />
                <F k="step1Text" as="p" multiline />
              </div>
            </div>
            <div className="use">
              <div className="ui">2</div>
              <div>
                <F k="step2Title" as="h3" />
                <F k="step2Text" as="p" multiline />
              </div>
            </div>
            <div className="use">
              <div className="ui">3</div>
              <div>
                <F k="step3Title" as="h3" />
                <F k="step3Text" as="p" multiline />
              </div>
            </div>
            <div className="use">
              <div className="ui">4</div>
              <div>
                <F k="step4Title" as="h3" />
                <F k="step4Text" as="p" multiline />
              </div>
            </div>
          </div>
        </Wrap>
      </Section>

      <Section variant="navy">
        <Wrap>
          <div className="sec-head" style={{ maxWidth: '36rem' }}>
            <Eyebrow light>
              <F k="docsEyebrow" />
            </Eyebrow>
            <F k="docsTitle" as="h2" className="serif" />
            <F k="docsLead" as="p" multiline />
          </div>
          <div className="pgrid">
            <div className="pcard">
              <div className="pi" aria-hidden>
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14 3 H7 a2 2 0 0 0 -2 2 v14 a2 2 0 0 0 2 2 h10 a2 2 0 0 0 2 -2 V8 Z" />
                  <path d="M14 3 v5 h5" />
                  <line x1="9" y1="13" x2="15" y2="13" />
                  <line x1="9" y1="17" x2="13" y2="17" />
                </svg>
              </div>
              <F k="doc1Title" as="h3" />
              <F k="doc1Text" as="p" multiline />
            </div>
            <div className="pcard">
              <div className="pi">⌂</div>
              <F k="doc2Title" as="h3" />
              <F k="doc2Text" as="p" multiline />
            </div>
            <div className="pcard">
              <div className="pi">✓</div>
              <F k="doc3Title" as="h3" />
              <F k="doc3Text" as="p" multiline />
            </div>
          </div>
          <div style={{ marginTop: 42 }}>
            <Button to={ROUTES.SIMULACAO} variant="gold" arrow>
              <F k="cta" />
            </Button>
          </div>
        </Wrap>
      </Section>
    </main>
  )
}
