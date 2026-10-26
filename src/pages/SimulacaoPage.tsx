import { useEffect, useMemo, useState, type FormEvent } from 'react'

import { Button } from '@/components/ui/Button'
import { Wrap } from '@/components/ui/Wrap'
import { useLeads } from '@/features/admin'
import { cn } from '@/lib/utils'

const MIN_IMOVEL = 200_000
const MIN_CRED = 100_000
const LTV = 0.5
const TAXA = 0.0119

type Urgency = 'imediata' | 'semanas' | 'meses' | 'pesquisando' | null
type Amort = 'price' | 'sac'

function onlyDigits(v: string) {
  return v.replace(/\D/g, '')
}

function formatMoney(n: number) {
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })
}

function formatMoneyDec(n: number) {
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function parseMoney(v: string) {
  const d = onlyDigits(v)
  return d ? Number(d) : 0
}

function maskMoneyInput(v: string) {
  const n = parseMoney(v)
  if (!n) return ''
  return formatMoney(n)
}

function maskPhone(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  if (digits.length <= 2) return digits.length ? `(${digits}` : ''
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
}

function maskCep(value: string) {
  const d = onlyDigits(value).slice(0, 8)
  if (d.length <= 5) return d
  return `${d.slice(0, 5)}-${d.slice(5)}`
}

/** Price formula: PMT = (C * i) / (1 - (1+i)^-n) + 40 */
function priceParcela(credito: number, n: number) {
  if (credito <= 0 || n <= 0) return 0
  const i = TAXA
  const pmt = (credito * i) / (1 - Math.pow(1 + i, -n))
  return pmt + 40
}

function sacParcelas(credito: number, n: number) {
  if (credito <= 0 || n <= 0) return { first: 0, mid: 0, last: 0 }
  const amort = credito / n
  const first = amort + credito * TAXA + 40
  const midMonth = Math.floor(n / 2)
  const midBalance = credito - amort * midMonth
  const mid = amort + midBalance * TAXA + 40
  const last = amort + amort * TAXA + 40
  return { first, mid, last }
}

function BikeBadge() {
  return (
    <svg
      width="34"
      height="22"
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
      <path d="M9 19h8l6-10h6" />
      <path d="M23 19l-4-7h-5" />
      <circle cx="29" cy="9" r="2" />
    </svg>
  )
}

const URGENCY_OPTS: { id: NonNullable<Urgency>; label: string; hint: string }[] = [
  { id: 'imediata', label: 'Para ontem', hint: 'É urgente, quanto antes melhor' },
  { id: 'semanas', label: 'Nas próximas semanas', hint: 'Tenho um plano em andamento' },
  { id: 'meses', label: 'Nos próximos meses', hint: 'Estou me organizando com calma' },
  { id: 'pesquisando', label: 'Ainda estou só pesquisando', hint: 'Quero entender se faz sentido' },
]

export function SimulacaoPage() {
  const { addLead } = useLeads()
  const [step, setStep] = useState(1)
  const [urgency, setUrgency] = useState<Urgency>(null)

  const [imovelStr, setImovelStr] = useState('')
  const [cep, setCep] = useState('')
  const [cepStatus, setCepStatus] = useState('')
  const [rua, setRua] = useState('')
  const [bairro, setBairro] = useState('')
  const [cidade, setCidade] = useState('')
  const [numero, setNumero] = useState('')
  const [complemento, setComplemento] = useState('')
  const [financiado, setFinanciado] = useState('nao')
  const [saldoStr, setSaldoStr] = useState('')

  const [amountStr, setAmountStr] = useState('')
  const [prazo, setPrazo] = useState(120)
  const [amort, setAmort] = useState<Amort>('price')

  const [nome, setNome] = useState('')
  const [tel, setTel] = useState('')
  const [email, setEmail] = useState('')
  const [formWarn, setFormWarn] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)

  const imovel = parseMoney(imovelStr)
  const saldo = parseMoney(saldoStr)
  const amount = parseMoney(amountStr)

  const limite = imovel * LTV
  const liquido = Math.max(0, limite - (financiado === 'sim' ? saldo : 0))
  const creditoFinal = Math.min(amount || 0, liquido)
  const belowMinImovel = imovel > 0 && imovel < MIN_IMOVEL
  const saldoBloqueia =
    financiado === 'sim' && imovel >= MIN_IMOVEL && saldo > 0 && saldo > liquido * 0.6 + 0.01

  const estimate = useMemo(() => {
    const cred = creditoFinal
    if (cred < MIN_CRED || belowMinImovel || saldoBloqueia) {
      return { parcela: 0, renda: 0, sac: { first: 0, mid: 0, last: 0 }, custas: 0 }
    }
    const parcela = priceParcela(cred, prazo)
    const sac = sacParcelas(cred, prazo)
    const renda = parcela / 0.3
    const custas = cred * 0.03
    return { parcela, renda, sac, custas }
  }, [creditoFinal, prazo, belowMinImovel, saldoBloqueia])

  useEffect(() => {
    const digits = onlyDigits(cep)
    if (digits.length !== 8) {
      setCepStatus('')
      return
    }
    let cancelled = false
    setCepStatus('Buscando endereço…')
    fetch(`https://viacep.com.br/ws/${digits}/json/`)
      .then((r) => r.json())
      .then((data: { erro?: boolean; logradouro?: string; bairro?: string; localidade?: string; uf?: string }) => {
        if (cancelled) return
        if (data.erro) {
          setCepStatus('CEP não encontrado. Preencha o endereço manualmente.')
          return
        }
        setRua(data.logradouro ?? '')
        setBairro(data.bairro ?? '')
        setCidade(data.localidade && data.uf ? `${data.localidade} / ${data.uf}` : '')
        setCepStatus('Endereço preenchido pelo CEP.')
      })
      .catch(() => {
        if (!cancelled) setCepStatus('Não foi possível consultar o CEP agora.')
      })
    return () => {
      cancelled = true
    }
  }, [cep])

  const step2Ok =
    imovel >= MIN_IMOVEL &&
    onlyDigits(cep).length === 8 &&
    numero.trim().length > 0 &&
    !saldoBloqueia

  const step3Ok = creditoFinal >= MIN_CRED && !belowMinImovel && !saldoBloqueia

  function go(n: number) {
    setStep(n)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function submitLead(e: FormEvent) {
    e.preventDefault()
    const ok =
      nome.trim().length > 2 &&
      tel.replace(/\D/g, '').length >= 10 &&
      email.includes('@')
    setFormWarn(!ok)
    if (!ok) return
    const parcela =
      amort === 'price'
        ? estimate.parcela
        : estimate.sac.first
    try {
      await addLead({
        tipo: 'simulacao',
        dados: {
          nome: nome.trim(),
          tel,
          email: email.trim(),
          imovel,
          credito: creditoFinal,
          prazo,
          amort,
          cidade,
          cep,
          urgencia: urgency,
          financiado,
          saldo: financiado === 'sim' ? saldo : null,
        },
        resultado: {
          parcela: Math.round(parcela),
          renda: Math.round(estimate.renda),
          custas: Math.round(estimate.custas),
          imovel,
          credito: creditoFinal,
          prazo,
        },
        origem: '/simulacao',
      })
      setModalOpen(true)
    } catch {
      setFormWarn(true)
    }
  }

  const leftCopy = [
    {
      title: (
        <>
          Simule um <span className="em">crédito</span> com seu imóvel em garantia.
        </>
      ),
      lead: 'Sua casa abre portas para um crédito de verdade justo. Leva 2 minutos, é grátis e não afeta o seu score.',
    },
    {
      title: (
        <>
          Agora, sobre o seu <span className="em">imóvel</span>.
        </>
      ),
      lead: 'É ele que garante as menores taxas do mercado. Digite o CEP que a gente encontra o endereço para você.',
    },
    {
      title: (
        <>
          Vamos falar de <span className="em">valores</span>.
        </>
      ),
      lead: 'Crédito de até 50% do valor do imóvel, em até 180 meses, com taxa a partir de 1,19% ao mês + IPCA.',
    },
    {
      title: (
        <>
          Última etapa, <span className="em">prometemos</span>.
        </>
      ),
      lead: 'Seus dados para enviarmos a proposta — e você escolhe se quer atendimento automático ou humano.',
    },
  ][step - 1]

  return (
    <main>
      <section className="sec sec--cream" style={{ paddingTop: 150 }}>
        <Wrap>
          <div className="wiz">
            <div className="wleft">
              <div className="wbadge">
                <BikeBadge />
              </div>
              <div className="wpane on">
                <div className="wstepn">Passo {step}/4</div>
                <h1>{leftCopy.title}</h1>
                <p>{leftCopy.lead}</p>
              </div>
              <div className="wprog">
                {[1, 2, 3, 4].map((i) => (
                  <i key={i} className={cn(i <= step && 'on')} />
                ))}
              </div>
            </div>

            <div className="wright">
              {step === 1 ? (
                <div className="wpane on">
                  <div className="wq">Para quando você precisa do dinheiro?</div>
                  <div className="wqd">Isso ajuda a gente a te atender no ritmo certo.</div>
                  <div className="opts">
                    {URGENCY_OPTS.map((o) => (
                      <button
                        key={o.id}
                        type="button"
                        className={cn('opt', urgency === o.id && 'sel')}
                        onClick={() => setUrgency(o.id)}
                      >
                        <span>
                          {o.label}
                          <small>{o.hint}</small>
                        </span>
                        <span className="rad" />
                      </button>
                    ))}
                  </div>
                  <div className="wnav">
                    <Button
                      variant="blue"
                      arrow
                      disabled={!urgency}
                      onClick={() => go(2)}
                    >
                      Continuar
                    </Button>
                  </div>
                </div>
              ) : null}

              {step === 2 ? (
                <div className="wpane on">
                  <div className="wq">Onde fica e quanto vale o imóvel?</div>
                  <div className="wqd">Digite o CEP e complete só o número.</div>
                  <div className="fgrid">
                    <div className="fcard">
                      <label>Valor do seu imóvel</label>
                      <input
                        inputMode="numeric"
                        placeholder="R$ 400.000"
                        value={imovelStr}
                        onChange={(e) => setImovelStr(maskMoneyInput(e.target.value))}
                      />
                    </div>
                    <div className="fcard">
                      <label>CEP do imóvel</label>
                      <input
                        inputMode="numeric"
                        maxLength={9}
                        placeholder="14000-000"
                        value={cep}
                        onChange={(e) => setCep(maskCep(e.target.value))}
                      />
                    </div>
                    <div className="full whint" style={{ margin: '-4px 0 0' }}>
                      {cepStatus}
                    </div>
                    <div className="fcard full">
                      <label>Endereço</label>
                      <input
                        value={rua}
                        onChange={(e) => setRua(e.target.value)}
                        placeholder="Preenchido pelo CEP"
                      />
                    </div>
                    <div className="fcard">
                      <label>Bairro</label>
                      <input value={bairro} onChange={(e) => setBairro(e.target.value)} placeholder="—" />
                    </div>
                    <div className="fcard">
                      <label>Cidade / UF</label>
                      <input
                        value={cidade}
                        onChange={(e) => setCidade(e.target.value)}
                        placeholder="—"
                      />
                    </div>
                    <div className="fcard">
                      <label>Número</label>
                      <input
                        inputMode="numeric"
                        placeholder="123"
                        value={numero}
                        onChange={(e) => setNumero(e.target.value)}
                      />
                    </div>
                    <div className="fcard">
                      <label>Complemento (opcional)</label>
                      <input
                        placeholder="Apto, bloco…"
                        value={complemento}
                        onChange={(e) => setComplemento(e.target.value)}
                      />
                    </div>
                    <div className="fcard">
                      <label>O imóvel tem financiamento em aberto?</label>
                      <select value={financiado} onChange={(e) => setFinanciado(e.target.value)}>
                        <option value="nao">Não, está quitado</option>
                        <option value="sim">Sim, ainda pago financiamento</option>
                      </select>
                    </div>
                    {financiado === 'sim' ? (
                      <div className="fcard">
                        <label>Saldo devedor aproximado</label>
                        <input
                          inputMode="numeric"
                          placeholder="R$ 80.000"
                          value={saldoStr}
                          onChange={(e) => setSaldoStr(maskMoneyInput(e.target.value))}
                        />
                      </div>
                    ) : null}
                  </div>

                  <div className={cn('simneg', saldoBloqueia && 'show')}>
                    <b>Poxa, por enquanto não conseguimos seguir.</b>
                    Pelo valor informado, o saldo do financiamento fica grande demais para essa
                    operação: a quitação pode representar no máximo 60% do crédito, e o crédito vai
                    até 50% do valor do imóvel. Quando o saldo devedor diminuir, vai ser um prazer
                    refazer a simulação com você.
                  </div>
                  <div className={cn('simneg', belowMinImovel && 'show')}>
                    <b>Poxa, com esse valor ainda não dá.</b>
                    Trabalhamos com imóveis a partir de R$ 200 mil. Se o seu imóvel vale mais do que
                    o valor digitado, é só ajustar ali em cima que a gente segue com a sua
                    simulação.
                  </div>

                  <div className="wnav">
                    <Button variant="ghost-d" onClick={() => go(1)}>
                      ← Voltar
                    </Button>
                    <Button variant="blue" arrow disabled={!step2Ok} onClick={() => go(3)}>
                      Continuar
                    </Button>
                  </div>
                </div>
              ) : null}

              {step === 3 ? (
                <div className="wpane on">
                  <div className="wq">De quanto você precisa?</div>
                  <div className="wqd">A gente já ajusta ao limite do seu imóvel, se precisar.</div>
                  <div className="fgrid">
                    <div className="fcard">
                      <label>Quanto você precisa?</label>
                      <input
                        inputMode="numeric"
                        placeholder="R$ 100.000"
                        value={amountStr}
                        onChange={(e) => setAmountStr(maskMoneyInput(e.target.value))}
                      />
                    </div>
                    <div className="fcard">
                      <label>Em quantos meses?</label>
                      <select
                        value={prazo}
                        onChange={(e) => setPrazo(Number(e.target.value))}
                      >
                        <option value={60}>60 meses</option>
                        <option value={120}>120 meses</option>
                        <option value={180}>180 meses</option>
                      </select>
                    </div>
                    <div className="fcard full">
                      <label>Valor final do crédito (ajustado ao limite)</label>
                      <input
                        readOnly
                        value={creditoFinal > 0 ? formatMoney(creditoFinal) : '—'}
                      />
                    </div>
                    <div className="full whint" style={{ margin: '-4px 0 0' }}>
                      {amount > liquido && liquido > 0
                        ? `Ajustamos para o limite de ${formatMoney(liquido)} (50% do imóvel${financiado === 'sim' ? ' menos o saldo' : ''}).`
                        : creditoFinal > 0 && creditoFinal < MIN_CRED
                          ? `O crédito mínimo é ${formatMoney(MIN_CRED)}.`
                          : null}
                    </div>
                  </div>

                  <div className="west">
                    <div className="systog" role="tablist" aria-label="Sistema de amortização">
                      <button
                        type="button"
                        className={cn('sysopt', amort === 'price' && 'on')}
                        onClick={() => setAmort('price')}
                      >
                        Parcelas fixas
                        <small>Price</small>
                      </button>
                      <button
                        type="button"
                        className={cn('sysopt', amort === 'sac' && 'on')}
                        onClick={() => setAmort('sac')}
                      >
                        Parcelas que caem
                        <small>SAC</small>
                      </button>
                    </div>
                    <div className="simr-label">
                      {amort === 'price' ? 'Parcela a partir de' : '1ª parcela a partir de'}
                    </div>
                    <div className="simr-value">
                      {estimate.parcela > 0
                        ? formatMoneyDec(amort === 'price' ? estimate.parcela : estimate.sac.first)
                        : '—'}
                    </div>
                    {amort === 'sac' && estimate.sac.first > 0 ? (
                      <div className="sac-evo">
                        <div className="sev">
                          <span>1ª parcela</span>
                          <b>{formatMoneyDec(estimate.sac.first)}</b>
                        </div>
                        <div className="sev">
                          <span>na metade</span>
                          <b>{formatMoneyDec(estimate.sac.mid)}</b>
                        </div>
                        <div className="sev gd">
                          <span>última</span>
                          <b>{formatMoneyDec(estimate.sac.last)}</b>
                        </div>
                      </div>
                    ) : null}
                    <div className="simr-label" style={{ marginTop: 16 }}>
                      Renda necessária
                    </div>
                    <div className="simr-value" style={{ fontSize: 30 }}>
                      {estimate.renda > 0 ? formatMoneyDec(estimate.renda) : '—'}
                    </div>
                    <div className="simrows">
                      <div className="simr-row">
                        <span>Limite pelo imóvel (50%)</span>
                        <b>{limite > 0 ? formatMoney(limite) : '—'}</b>
                      </div>
                      {financiado === 'sim' ? (
                        <div className="simr-row">
                          <span>(−) Quitação do financiamento</span>
                          <b>{saldo > 0 ? formatMoney(saldo) : '—'}</b>
                        </div>
                      ) : null}
                      <div className="simr-row">
                        <span>Líquido para você</span>
                        <b>{liquido > 0 ? formatMoney(Math.min(creditoFinal, liquido)) : '—'}</b>
                      </div>
                      <div className="simr-row">
                        <span>(+) Custas, impostos, seguros e avaliação</span>
                        <b>{estimate.custas > 0 ? formatMoney(estimate.custas) : '—'}</b>
                      </div>
                    </div>
                    <div className="simr-note" style={{ marginTop: 14 }}>
                      Parcelas calculadas pelo sistema{' '}
                      {amort === 'price' ? 'Price (parcelas fixas)' : 'SAC (parcelas decrescentes)'},
                      com taxa a partir de 1,19% ao mês + IPCA. Estimativa visual — valores finais
                      sujeitos a análise.
                    </div>
                  </div>

                  <div className="wnav">
                    <Button variant="ghost-d" onClick={() => go(2)}>
                      ← Voltar
                    </Button>
                    <Button variant="blue" arrow disabled={!step3Ok} onClick={() => go(4)}>
                      Continuar
                    </Button>
                  </div>
                </div>
              ) : null}

              {step === 4 ? (
                <form className="wpane on" onSubmit={submitLead}>
                  <div className="wq">Para quem enviamos a proposta?</div>
                  <div className="wqd">Só a sua proposta e o contato do jeito que você preferir.</div>
                  <div className="fgrid">
                    <div className={cn('fcard', 'full', formWarn && !nome.trim() && 'err')}>
                      <label>Nome completo</label>
                      <input
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        placeholder="Seu nome"
                      />
                    </div>
                    <div className={cn('fcard', formWarn && tel.replace(/\D/g, '').length < 10 && 'err')}>
                      <label>Telefone / WhatsApp</label>
                      <input
                        type="tel"
                        inputMode="numeric"
                        maxLength={15}
                        value={tel}
                        onChange={(e) => setTel(maskPhone(e.target.value))}
                        placeholder="(16) 90000-0000"
                      />
                    </div>
                    <div className={cn('fcard', formWarn && !email.includes('@') && 'err')}>
                      <label>E-mail</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="voce@email.com"
                      />
                    </div>
                    {formWarn ? (
                      <div className="full whint warn" style={{ margin: '-4px 0 0' }}>
                        Confere os campos destacados? Assim a proposta chega certinha para você. 🙂
                      </div>
                    ) : null}
                  </div>
                  <ul
                    className="simr-list"
                    style={{ border: 'none', paddingTop: 8, marginTop: 14 }}
                  >
                    <li style={{ color: 'var(--ink)' }}>Sem custo para simular</li>
                    <li style={{ color: 'var(--ink)' }}>Não afeta o seu score</li>
                    <li style={{ color: 'var(--ink)' }}>
                      Atendimento do seu jeito, humano ou automático
                    </li>
                  </ul>
                  <div className="wnav">
                    <Button type="button" variant="ghost-d" onClick={() => go(3)}>
                      ← Voltar
                    </Button>
                    <Button type="submit" variant="gold" arrow>
                      Ver minha proposta
                    </Button>
                  </div>
                </form>
              ) : null}
            </div>
          </div>
        </Wrap>
      </section>

      {modalOpen ? (
        <div className="pmodal">
          <div className="pmodal-back" onClick={() => setModalOpen(false)} />
          <div className="pmodal-card" role="dialog" aria-modal aria-labelledby="smodal-title">
            <button
              type="button"
              className="pmodal-x"
              aria-label="Fechar"
              onClick={() => setModalOpen(false)}
            >
              ✕
            </button>
            <div className="pmodal-check">
              <svg
                width="30"
                height="30"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </div>
            <h3 className="serif" id="smodal-title">
              Simulação enviada!
            </h3>
            <p>
              Recebemos a sua simulação. Nossa equipe vai te chamar em breve para apresentar a
              proposta do seu jeito. 💙
            </p>
            <Button variant="blue" arrow onClick={() => setModalOpen(false)}>
              Combinado
            </Button>
          </div>
        </div>
      ) : null}
    </main>
  )
}
