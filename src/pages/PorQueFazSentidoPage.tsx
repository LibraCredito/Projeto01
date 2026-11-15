import { RateCompare } from '@/components/RateCompare'
import { Button } from '@/components/ui/Button'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { Section } from '@/components/ui/Section'
import { Wrap } from '@/components/ui/Wrap'
import { usePageField } from '@/features/admin/hooks/usePageField'
import { ROUTES } from '@/lib/constants/routes'

export function PorQueFazSentidoPage() {
  const { Field: F } = usePageField('porQue')

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

      <Section variant="blue">
        <Wrap>
          <div className="cmp-head">
            <Eyebrow>
              <F k="cmpEyebrow" />
            </Eyebrow>
            <F k="cmpTitle" as="h2" className="serif" />
          </div>
          <RateCompare />
        </Wrap>
      </Section>

      <Section variant="cream">
        <Wrap>
          <div className="sec-head">
            <Eyebrow>
              <F k="vantEyebrow" />
            </Eyebrow>
            <F k="vantTitle" as="h2" className="serif" />
          </div>
          <div className="pgrid two">
            <div className="pcard">
              <div className="pi">%</div>
              <F k="v1Title" as="h3" />
              <F k="v1Text" as="p" multiline />
            </div>
            <div className="pcard">
              <div className="pi">↧</div>
              <F k="v2Title" as="h3" />
              <F k="v2Text" as="p" multiline />
            </div>
            <div className="pcard">
              <div className="pi">✦</div>
              <F k="v3Title" as="h3" />
              <F k="v3Text" as="p" multiline />
            </div>
            <div className="pcard">
              <div className="pi">⌂</div>
              <F k="v4Title" as="h3" />
              <F k="v4Text" as="p" multiline />
            </div>
          </div>
          <div style={{ marginTop: 42 }}>
            <Button to={ROUTES.SIMULACAO} variant="blue" arrow>
              <F k="cta" />
            </Button>
          </div>
        </Wrap>
      </Section>
    </main>
  )
}
