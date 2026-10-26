import { useEffect, useMemo, useState } from 'react'

import { Button } from '@/components/ui/Button'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { Section } from '@/components/ui/Section'
import { Wrap } from '@/components/ui/Wrap'
import { HERO_IMAGE, HERO_VIDEO, HERO_VIDEO_POSTER } from '@/content/home'
import { HOME_DEFAULTS } from '@/features/admin/defaults/siteContent'
import { useAdmin } from '@/features/admin/AdminProvider'
import { resolveMediaUrl, uploadImage } from '@/features/admin/api/client'
import { EditableImage } from '@/features/admin/components/EditableImage'
import { EditableText } from '@/features/admin/components/EditableText'
import { VideoSlot } from '@/features/admin/components/VideoSlot'
import type { SiteContent } from '@/features/admin/types'
import { ROUTES } from '@/lib/constants/routes'
import { cn } from '@/lib/utils'

function BikeIcon() {
  return (
    <svg
      viewBox="0 0 46 28"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="9" cy="19" r="7" />
      <circle cx="37" cy="19" r="7" />
      <path d="M9 19 L20 19 L16 7" />
      <path d="M20 19 L30 8 L37 19" />
      <path d="M16 7 L30 8" />
      <path d="M13 7 h6" />
      <path d="M27 8 h6" />
      <circle cx="20" cy="19" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  )
}

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

function H({
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

export function HomePage() {
  const { content, setContent, editing, setFlash } = useAdmin()
  const depoimentos = content.depoimentos
  const [slide, setSlide] = useState(0)
  const total = Math.max(depoimentos.length, 1)

  const heroSrc = useMemo(() => {
    return resolveMediaUrl(content.midias.heroImageUrl) || HERO_IMAGE
  }, [content.midias.heroImageUrl])

  const heroVideoSrc = useMemo(() => {
    const raw = (content.midias.heroVideoUrl || '').trim() || HERO_VIDEO
    /* vídeo do hero é asset do front — nunca apontar para a API */
    if (raw.startsWith('/videos/') || raw === HERO_VIDEO) return raw.startsWith('/') ? raw : `/${raw}`
    return resolveMediaUrl(raw) || HERO_VIDEO
  }, [content.midias.heroVideoUrl])

  /** loading = só navy; video = vídeo pronto; fallback = imagem após erro ou 5s */
  const [heroMedia, setHeroMedia] = useState<'loading' | 'video' | 'fallback'>('loading')
  /** O vídeo só começa a baixar após o load, para não competir com fontes/JS críticos. */
  const [pageLoaded, setPageLoaded] = useState(() => document.readyState === 'complete')

  useEffect(() => {
    if (pageLoaded) return
    const onLoad = () => setPageLoaded(true)
    window.addEventListener('load', onLoad, { once: true })
    return () => window.removeEventListener('load', onLoad)
  }, [pageLoaded])

  useEffect(() => {
    if (!pageLoaded) return
    setHeroMedia('loading')
    const t = window.setTimeout(() => {
      setHeroMedia((prev) => (prev === 'loading' ? 'fallback' : prev))
    }, 5000)
    return () => window.clearTimeout(t)
  }, [heroVideoSrc, pageLoaded])

  function onHeroVideoReady() {
    setHeroMedia((prev) => (prev === 'fallback' ? prev : 'video'))
  }

  const homeVideoUrl =
    content.videos.homeYoutubeOrUrl || content.midias.homeVideoUrl || ''
  const depoimentoVideoUrl =
    content.videos.depoimentoYoutubeOrUrl || content.midias.depoimentoVideoUrl || ''

  const prev = () => setSlide((s) => (s - 1 + total) % total)
  const next = () => setSlide((s) => (s + 1) % total)

  return (
    <main>
      <section className="hero hero-full">
        {heroVideoSrc === HERO_VIDEO && heroMedia !== 'fallback' ? (
          <img
            className="hero-poster"
            src={HERO_VIDEO_POSTER}
            alt=""
            aria-hidden
            fetchPriority="high"
            decoding="async"
          />
        ) : null}
        {pageLoaded && heroMedia !== 'fallback' ? (
          <video
            key={heroVideoSrc}
            className={cn('hero-video', heroMedia === 'video' && 'is-ready')}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            src={heroVideoSrc}
            onLoadedData={onHeroVideoReady}
            onCanPlay={onHeroVideoReady}
            onPlaying={onHeroVideoReady}
            onError={() => setHeroMedia('fallback')}
            aria-hidden
          />
        ) : null}
        {heroMedia === 'fallback' ? (
          <div className="hero-fallback">
            <img
              src={heroSrc}
              alt=""
              decoding="async"
              aria-hidden
              onError={(e) => {
                e.currentTarget.src = HERO_IMAGE
              }}
            />
          </div>
        ) : null}
        <div className="hero-shade" />
        <div className="wrap hero-inner">
          <Eyebrow light>
            <H k="heroEyebrow" />
          </Eyebrow>
          <h1 className="serif">
            <H k="heroTitleLine1" />
            <br />
            <H k="heroTitleLine2" /> <H k="heroTitleEm" className="em" />.
          </h1>
          <H k="heroLead" as="p" className="lead" multiline />
          <div className="hero-cta">
            <Button to={ROUTES.SIMULACAO} variant="blue" arrow>
              <H k="ctaSimular" />
            </Button>
            <Button to={ROUTES.COMO_FUNCIONA} variant="ghost-l">
              <H k="ctaComo" />
            </Button>
          </div>
          <div className="microtrust">
            <span>
              <i className="dot" />
              <H k="trust1" />
            </span>
            <span>
              <i className="dot" />
              <H k="trust2" />
            </span>
            <span>
              <i className="dot" />
              <H k="trust3" />
            </span>
          </div>
          <div className="hero-chiprow">
            <div className="chip">
              <small>
                <H k="chipTaxaLabel" />
              </small>
              <H k="chipTaxaValue" as="b" />
            </div>
            <div className="chip">
              <small>
                <H k="chipPrazoLabel" />
              </small>
              <H k="chipPrazoValue" as="b" />
            </div>
          </div>
          {editing ? (
            <p className="edit-hint" style={{ marginTop: 18, fontSize: 13, color: 'var(--muted-light)' }}>
              Dica: clique nos textos tracejados para editar. Em fotos, clique para trocar o arquivo.
              No vídeo, cole a URL do YouTube. Depois <b>Salvar</b>.
            </p>
          ) : null}
        </div>
        <div className="hero-fade" aria-hidden />
        <div className="hero-scroll" aria-hidden>
          <span />
        </div>
        {editing ? (
          <label className="hero-swap">
            Trocar imagem
            <input
              className="sr-file"
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp"
              onChange={(e) => {
                const file = e.target.files?.[0]
                e.target.value = ''
                if (!file) return
                void (async () => {
                  try {
                    const url = await uploadImage(file)
                    setContent((prev) => ({
                      ...prev,
                      midias: { ...prev.midias, heroImageUrl: url },
                    }))
                    setFlash({
                      type: 'ok',
                      text: 'Imagem do hero enviada. Clique em Salvar na barra.',
                    })
                  } catch (err) {
                    setFlash({
                      type: 'err',
                      text: err instanceof Error ? err.message : 'Falha no upload da imagem.',
                    })
                  }
                })()
              }}
            />
          </label>
        ) : null}
      </section>

      {(editing || Boolean(homeVideoUrl)) && (
        <Section variant="cream2" className="vsec">
          <Wrap>
            <div className="sec-head vsec-head">
              <Eyebrow>
                <H k="videoEyebrow" />
              </Eyebrow>
              <h2 className="serif">
                <H k="videoTitleBefore" /> <H k="videoTitleEm" className="em" />.
              </h2>
            </div>
            <VideoSlot
              url={homeVideoUrl}
              label="Adicionar vídeo da Libra"
              hint="Vídeo institucional (Assista). Clique e cole a URL do YouTube. Não é o depoimento de baixo."
              onChange={(url) =>
                setContent((prev) => ({
                  ...prev,
                  videos: { ...prev.videos, homeYoutubeOrUrl: url },
                  midias: { ...prev.midias, homeVideoUrl: url },
                }))
              }
            />
          </Wrap>
        </Section>
      )}

      <Section id="usecases" variant="cream">
        <Wrap>
          <div className="split">
            <div>
              <EditableImage
                src={resolveMediaUrl(content.midias.usecaseImageUrl)}
                fallback="Foto de cliente real"
                aspect="4/5"
                alt="Cliente Libra"
                onChange={(url) =>
                  setContent({
                    ...content,
                    midias: { ...content.midias, usecaseImageUrl: url },
                  })
                }
              />
            </div>
            <div>
              <div className="sec-head" style={{ marginBottom: 32 }}>
                <Eyebrow>
                  <H k="usecaseEyebrow" />
                </Eyebrow>
                <h2 className="serif">
                  <H k="usecaseTitle1" />
                  <span style={{ fontSize: 'clamp(33px, 4.4vw, 54px)', letterSpacing: '-0.015em' }}>
                    {' '}
                    <H k="usecaseTitle2" />
                  </span>
                  <div>
                    <H k="usecaseTitle3" />
                  </div>
                </h2>
                <H k="usecaseLead" as="p" multiline />
              </div>
              <div className="uselist">
                {(
                  [
                    ['use1Title', 'use1Text', '↺'],
                    ['use2Title', 'use2Text', '⌂'],
                    ['use3Title', 'use3Text', '↗'],
                    ['use4Title', 'use4Text', '✦'],
                  ] as const
                ).map(([tk, pk, icon]) => (
                  <div className="use" key={tk}>
                    <div className="ui">{icon}</div>
                    <div>
                      <h3>
                        <H k={tk} />
                      </h3>
                      <H k={pk} as="p" multiline />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Wrap>
      </Section>

      <Section id="how" variant="navy">
        <Wrap>
          <div className="sec-head">
            <Eyebrow light>
              <H k="howEyebrow" />
            </Eyebrow>
            <h2 className="serif">
              <H k="howTitle" />
            </h2>
          </div>
          <div className="steps">
            {(
              [
                ['01', 'how1Title', 'how1Text'],
                ['02', 'how2Title', 'how2Text'],
                ['03', 'how3Title', 'how3Text'],
                ['04', 'how4Title', 'how4Text'],
              ] as const
            ).map(([num, tk, pk]) => (
              <div className="step" key={num}>
                <div className="num">{num}</div>
                <div className="bar" />
                <h3>
                  <H k={tk} />
                </h3>
                <H k={pk} as="p" multiline />
              </div>
            ))}
          </div>
        </Wrap>
      </Section>

      <Section id="por-que" variant="blue">
        <Wrap>
          <div className="cmp-head">
            <Eyebrow>
              <H k="whyEyebrow" />
            </Eyebrow>
            <h2 className="serif">
              <H k="whyTitle" />
            </h2>
          </div>
          <div className="cmp-grid">
            <div className="cmp cmp-bad">
              <small>
                <H k="whyBadLabel" />
              </small>
              <div className="big">
                <H k="whyBadValue" />
              </div>
              <div className="u">
                <H k="whyBadUnit" multiline />
              </div>
            </div>
            <div className="cmp cmp-good">
              <small>
                <H k="whyGoodLabel" />
              </small>
              <div className="big">
                <H k="whyGoodValue" />
              </div>
              <div className="u">
                <H k="whyGoodUnit" multiline />
              </div>
              <div className="cmp-meta">
                <div>
                  <div className="mk">
                    <H k="whyMeta1Value" />
                  </div>
                  <div className="ml">
                    <H k="whyMeta1Label" />
                  </div>
                </div>
                <div>
                  <div className="mk">
                    <H k="whyMeta2Value" />
                  </div>
                  <div className="ml">
                    <H k="whyMeta2Label" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <H k="whyNote" as="p" className="cmp-note" multiline />
        </Wrap>
      </Section>

      <Section variant="navy" className="manifesto">
        <Wrap>
          <Eyebrow light>
            <H k="manifestoEyebrow" />
          </Eyebrow>
          <h2>
            <H k="manifestoTitle" />
          </h2>
          <H k="manifestoLead" as="p" multiline />
          <div className="bikepath" aria-hidden>
            <div className="bikepath-line" />
            <div className="bike-rider">
              <BikeIcon />
            </div>
          </div>
        </Wrap>
      </Section>

      <Section id="depoimento" variant="cream2">
        <Wrap>
          <div className="sec-head" style={{ marginBottom: 44 }}>
            <Eyebrow>
              <H k="storiesEyebrow" />
            </Eyebrow>
            <h2 className="serif">
              <H k="storiesTitle" />
            </h2>
          </div>

          <div className="vdepo-wrap">
            <div className="vstage">
              <VideoSlot
                url={depoimentoVideoUrl}
                label="Depoimento em vídeo"
                hint="Vídeo de depoimento (histórias). Clique e cole a URL do YouTube."
                onChange={(url) =>
                  setContent((prev) => ({
                    ...prev,
                    videos: { ...prev.videos, depoimentoYoutubeOrUrl: url },
                    midias: { ...prev.midias, depoimentoVideoUrl: url },
                  }))
                }
              />
            </div>
            <div className="vdepo-side">
              <Eyebrow>
                <H k="depoEyebrow" />
              </Eyebrow>
              <h3 className="serif">
                <H k="depoTitleBefore" /> <H k="depoTitleEm" className="em" />.
              </h3>
              <H k="depoLead" as="p" multiline />
              <div className="vchips">
                <span className="vchip">
                  <span className="pl">▶</span> <H k="depoChip1" />
                </span>
                <span className="vchip">
                  <H k="depoChip2" />
                </span>
              </div>
              {editing ? (
                <p style={{ marginTop: 14, fontSize: 13.5, color: 'var(--muted)' }}>
                  Este quadro é só o depoimento. O vídeo <b>Assista</b> fica na seção de cima.
                </p>
              ) : null}
            </div>
          </div>

          <div className="carousel">
            <div className="track" style={{ transform: `translateX(-${slide * 100}%)` }}>
              {depoimentos.map((t, idx) => (
                <div className="slide" key={`${t.name}-${idx}`}>
                  <div className="tgrid">
                    <div>
                      <EditableImage
                        src={resolveMediaUrl(t.image)}
                        fallback="Foto de cliente real"
                        aspect="1/1.1"
                        alt={t.name}
                        onChange={(url) => {
                          const next = depoimentos.map((d, i) =>
                            i === idx ? { ...d, image: url } : d,
                          )
                          const imgs = [...content.midias.testimonialImages] as [
                            string,
                            string,
                            string,
                          ]
                          if (idx < 3) imgs[idx] = url
                          setContent({
                            ...content,
                            depoimentos: next,
                            midias: { ...content.midias, testimonialImages: imgs },
                          })
                        }}
                      />
                    </div>
                    <div className="quote">
                      <span className="mark">&ldquo;</span>
                      <EditableText
                        as="div"
                        className="serif"
                        multiline
                        value={t.quote}
                        onChange={(v) => {
                          const next = depoimentos.map((d, i) =>
                            i === idx ? { ...d, quote: v } : d,
                          )
                          setContent({ ...content, depoimentos: next })
                        }}
                      />
                      <div className="who">
                        <EditableText
                          as="b"
                          value={t.name}
                          onChange={(v) => {
                            const next = depoimentos.map((d, i) =>
                              i === idx ? { ...d, name: v } : d,
                            )
                            setContent({ ...content, depoimentos: next })
                          }}
                        />
                        <EditableText
                          as="span"
                          value={t.location}
                          onChange={(v) => {
                            const next = depoimentos.map((d, i) =>
                              i === idx ? { ...d, location: v } : d,
                            )
                            setContent({ ...content, depoimentos: next })
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="cnav">
            <button type="button" className="cbtn" aria-label="Depoimento anterior" onClick={prev}>
              ‹
            </button>
            <div className="cdots">
              {depoimentos.map((t, i) => (
                <button
                  key={`${t.name}-dot-${i}`}
                  type="button"
                  className={cn('cdot', i === slide && 'active')}
                  aria-label={`Ir para depoimento ${i + 1}`}
                  onClick={() => setSlide(i)}
                />
              ))}
            </div>
            <button type="button" className="cbtn" aria-label="Próximo depoimento" onClick={next}>
              ›
            </button>
          </div>
        </Wrap>
      </Section>

      <Section variant="navy" className="br-sec">
        <Wrap>
          <div className="br-grid">
            <div>
              <Eyebrow light>
                <H k="brEyebrow" />
              </Eyebrow>
              <h2 className="serif">
                <H k="brTitleBefore" /> <H k="brTitleEm" className="em" />.
              </h2>
              <H k="brLead" as="p" className="br-lead" multiline />
              <div className="br-chips">
                <div className="br-chip">
                  <H k="brChip1Title" as="b" />
                  <span>
                    <H k="brChip1Text" />
                  </span>
                </div>
                <div className="br-chip">
                  <H k="brChip2Title" as="b" />
                  <span>
                    <H k="brChip2Text" />
                  </span>
                </div>
                <div className="br-chip">
                  <H k="brChip3Title" as="b" />
                  <span>
                    <H k="brChip3Text" />
                  </span>
                </div>
              </div>
            </div>
            <div>
              <img
                className="br-map"
                src="/brazil-map.svg"
                width={552}
                height={567}
                loading="lazy"
                decoding="async"
                alt="Mapa do Brasil: a Libra atende o país inteiro"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                  const sibling = e.currentTarget.nextElementSibling as HTMLElement | null
                  if (sibling) sibling.style.display = 'block'
                }}
              />
              <div className="br-dots" style={{ display: 'none' }} aria-hidden />
              <div className="br-legend">
                <i /> <H k="brLegend" />
              </div>
            </div>
          </div>
        </Wrap>
      </Section>

      <Section id="about" variant="navy">
        <Wrap className="about-grid about">
          <div>
            <Eyebrow light>
              <H k="aboutEyebrow" />
            </Eyebrow>
            <h2>
              <H k="aboutTitle" />
            </h2>
            <H k="aboutLead" as="p" multiline />
            <div className="about-stats">
              <div className="s">
                <H k="aboutStat1Value" as="b" />
                <span>
                  <H k="aboutStat1Label" />
                </span>
              </div>
              <div className="s">
                <i className="apde">
                  <H k="aboutStat2Prefix" />
                </i>
                <H k="aboutStat2Value" as="b" />
                <span>
                  <H k="aboutStat2Label" />
                </span>
              </div>
              <div className="s">
                <H k="aboutStat3Value" as="b" />
                <span>
                  <H k="aboutStat3Label" />
                </span>
              </div>
              <div className="s">
                <H k="aboutStat4Value" as="b" />
                <span>
                  <H k="aboutStat4Label" />
                </span>
              </div>
            </div>
          </div>
          <div className="about-photo">
            <EditableImage
              src={resolveMediaUrl(content.midias.aboutImageUrl)}
              fallback="Foto do time Libra"
              aspect="5/4"
              alt="Time Libra"
              onChange={(url) =>
                setContent({
                  ...content,
                  midias: { ...content.midias, aboutImageUrl: url },
                })
              }
            />
          </div>
        </Wrap>
      </Section>

      <Section id="final" variant="blue" className="final">
        <Wrap>
          <Eyebrow>
            <H k="finalEyebrow" />
          </Eyebrow>
          <h2 className="serif">
            <H k="finalTitle" />
          </h2>
          <H k="finalLead" as="p" multiline />
          <Button to={ROUTES.SIMULACAO} variant="gold" arrow className="btn-final-cta">
            <H k="finalCta" />
          </Button>
        </Wrap>
      </Section>
    </main>
  )
}
