import { useEffect, useRef, useState } from 'react'

const RATES = [
  { label: 'Rotativo do cartão', value: 14.8, digits: 1, width: '100%' },
  { label: 'Crédito pessoal', value: 7.2, digits: 1, width: '48.6%' },
  { label: 'Cheque especial', value: 7.1, digits: 1, width: '48%' },
  { label: 'Consignado', value: 1.8, digits: 1, width: '12.2%' },
] as const

function formatRate(value: number, digits: number) {
  return value.toFixed(digits).replace('.', ',')
}

function RateNumber({
  active,
  value,
  digits,
}: {
  active: boolean
  value: number
  digits: number
}) {
  const [text, setText] = useState(() => formatRate(0, digits))

  useEffect(() => {
    if (!active) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      setText(formatRate(value, digits))
      return
    }
    let frame = 0
    let start: number | null = null
    const step = (now: number) => {
      if (start === null) start = now
      const progress = Math.min((now - start) / 1100, 1)
      const eased = 1 - (1 - progress) ** 3
      setText(formatRate(value * eased, digits))
      if (progress < 1) frame = requestAnimationFrame(step)
      else setText(formatRate(value, digits))
    }
    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [active, value, digits])

  return <span className="rnum">{text}</span>
}

const CONTA_VIDEO = 'hqMRJreGSew'

export function RateCompare() {
  const chartRef = useRef<HTMLDivElement>(null)
  const [go, setGo] = useState(false)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    const node = chartRef.current
    if (!node) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setGo(true)
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setGo(true)
          observer.disconnect()
        }
      },
      { threshold: 0.35 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <div className="cmpgrid">
      <div className="cmpgrid-chart">
        <div
          ref={chartRef}
          className={go ? 'rchart go' : 'rchart'}
          data-anim=""
          role="img"
          aria-label="Comparação de taxas de juros ao mês: rotativo do cartão 14,8%, crédito pessoal 7,2%, cheque especial 7,1%, consignado 1,8% e crédito com garantia de imóvel na Libra, a partir de 1,19% ao mês mais IPCA"
        >
          {RATES.map((rate) => (
            <div className="rrow" key={rate.label}>
              <div className="rlab">{rate.label}</div>
              <div className="rtrack">
                <div className="rbar" style={{ width: rate.width }} />
                <b className="rval">
                  <RateNumber active={go} value={rate.value} digits={rate.digits} />%
                </b>
              </div>
            </div>
          ))}
          <div className="rrow rlibra">
            <div className="rlab">
              Garantia de imóvel
              <span>Aqui na Libra</span>
            </div>
            <div className="rtrack">
              <div className="rbar" style={{ width: '8%' }} />
              <b className="rval">
                <small>a partir de</small> <RateNumber active={go} value={1.19} digits={2} />%{' '}
                <small>ao mês + IPCA</small>
              </b>
            </div>
          </div>
        </div>
        <p className="rchart-src">
          Taxas médias de mercado ao mês nas demais modalidades (Banco Central, ago/2026).
          Condições da Libra: a partir de 1,19% ao mês + IPCA, em até 180 meses, com crédito de
          até 50% do valor do imóvel.
        </p>
      </div>
      <div className="cmpvideo">
        <div className="cv-call">
          <span className="eyebrow light">Dá o play</span>
          <p>
            A Libra separou um conteúdo para te explicar por que essa conta muda tudo. Em poucos
            minutos, você entende.
          </p>
        </div>
        <div className="cv-stage">
          {playing ? (
            <iframe
              title="Por que essa conta muda tudo"
              src={`https://www.youtube-nocookie.com/embed/${CONTA_VIDEO}?autoplay=1`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <button
              className="cv-th"
              type="button"
              aria-label="Assistir ao vídeo que explica a conta, no YouTube"
              onClick={() => setPlaying(true)}
            >
              <img
                src={`https://i.ytimg.com/vi/${CONTA_VIDEO}/maxresdefault.jpg`}
                alt=""
                loading="lazy"
                onError={(event) => {
                  event.currentTarget.onerror = null
                  event.currentTarget.src = `https://i.ytimg.com/vi/${CONTA_VIDEO}/hqdefault.jpg`
                }}
              />
              <span className="sh-play" aria-hidden>
                ▶
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
