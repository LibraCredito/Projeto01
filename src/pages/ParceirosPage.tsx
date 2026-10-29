import { useEffect, useRef, useState, type FormEvent } from 'react'

import { Button } from '@/components/ui/Button'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { Section } from '@/components/ui/Section'
import { Wrap } from '@/components/ui/Wrap'
import { useAdmin } from '@/features/admin'
import { usePageField } from '@/features/admin/hooks/usePageField'
import {
  enviarParceiro,
  listarRamos,
  textoEspera,
  ParceiroFormError,
  type ParceiroRecente,
  type RamoParceiro,
} from '@/features/parceiros/api'
import { cn } from '@/lib/utils'

function maskPhone(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  if (digits.length <= 2) return digits.length ? `(${digits}` : ''
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
}

type FieldErrors = {
  nome: boolean
  email: boolean
  tel: boolean
  cidade: boolean
  ramo: boolean
}

const EMPTY_ERRORS: FieldErrors = {
  nome: false,
  email: false,
  tel: false,
  cidade: false,
  ramo: false,
}

export function ParceirosPage() {
  const { Field: F } = usePageField('parceiros')
  const { editing } = useAdmin()
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [tel, setTel] = useState('')
  const [ramoId, setRamoId] = useState('')
  const [cidade, setCidade] = useState('')
  const [ramos, setRamos] = useState<RamoParceiro[]>([])
  const [ramosStatus, setRamosStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [ramosTick, setRamosTick] = useState(0)
  const [errors, setErrors] = useState<FieldErrors>(EMPTY_ERRORS)
  const [showMsg, setShowMsg] = useState(false)
  const [serverMsg, setServerMsg] = useState<string | null>(null)
  const [sending, setSending] = useState(false)
  const [modal, setModal] = useState<'sucesso' | 'recente' | null>(null)
  const [recente, setRecente] = useState<ParceiroRecente | null>(null)
  const sendingRef = useRef(false)

  useEffect(() => {
    let active = true
    setRamosStatus('loading')
    listarRamos()
      .then((list) => {
        if (!active) return
        setRamos(list)
        setRamosStatus(list.length ? 'ready' : 'error')
      })
      .catch(() => {
        if (!active) return
        setRamos([])
        setRamosStatus('error')
      })
    return () => {
      active = false
    }
  }, [ramosTick])

  function validate() {
    const next: FieldErrors = {
      nome: !nome.trim(),
      email: !email.trim() || !email.includes('@'),
      tel: tel.replace(/\D/g, '').length < 10,
      cidade: !cidade.trim(),
      ramo: !ramoId,
    }
    setErrors(next)
    const ok = !Object.values(next).some(Boolean)
    setShowMsg(!ok)
    if (!ok) setServerMsg(null)
    return ok
  }

  function marcarErrosServidor(messages: string[]) {
    const blob = messages.join(' ').toLowerCase()
    setErrors({
      nome: blob.includes('nome'),
      email: blob.includes('email') || blob.includes('e-mail'),
      tel: blob.includes('telefone'),
      cidade: blob.includes('cidade'),
      ramo: blob.includes('ramo'),
    })
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (editing || sendingRef.current) return
    if (!validate()) return

    sendingRef.current = true
    setSending(true)
    setServerMsg(null)
    setShowMsg(false)

    try {
      const result = await enviarParceiro({
        nome: nome.trim(),
        email: email.trim(),
        telefone: tel,
        cidade: cidade.trim(),
        ramoId: Number(ramoId),
      })

      if (!result.ok) {
        setRecente(result)
        setModal('recente')
        return
      }

      setModal('sucesso')
      setRecente(null)
      setNome('')
      setEmail('')
      setTel('')
      setCidade('')
      setRamoId('')
      setErrors(EMPTY_ERRORS)
    } catch (err) {
      if (err instanceof ParceiroFormError && err.kind === 'validacao') {
        setServerMsg(err.errors.join(' · '))
        marcarErrosServidor(err.errors)
        return
      }
      setServerMsg('Não conseguimos enviar o cadastro agora. Tente de novo em alguns minutos.')
    } finally {
      sendingRef.current = false
      setSending(false)
    }
  }

  const espera = recente ? textoEspera(recente) : null

  return (
    <main>
      <section className="phero">
        <div className="wrap">
          <Eyebrow light>
            <F k="eyebrow" />
          </Eyebrow>
          <h1 className="serif">
            <F k="titleLine1" />
            <br />
            <F k="titleLine2" />
          </h1>
          <F k="lead" as="p" multiline />
          <div style={{ marginTop: 30 }}>
            <Button href="#parceiros-form" variant="gold" arrow>
              <F k="heroCta" />
            </Button>
          </div>
        </div>
      </section>

      <Section variant="cream">
        <Wrap>
          <div className="sec-head">
            <Eyebrow>
              <F k="whyEyebrow" />
            </Eyebrow>
            <F k="whyTitle" as="h2" className="serif" />
          </div>
          <div className="pgrid">
            <div className="pcard">
              <div className="pi">$</div>
              <F k="why1Title" as="h3" />
              <F k="why1Text" as="p" multiline />
            </div>
            <div className="pcard">
              <div className="pi">⚡</div>
              <F k="why2Title" as="h3" />
              <F k="why2Text" as="p" multiline />
            </div>
            <div className="pcard">
              <div className="pi">☎</div>
              <F k="why3Title" as="h3" />
              <F k="why3Text" as="p" multiline />
            </div>
          </div>
        </Wrap>
      </Section>

      <Section variant="navy">
        <Wrap>
          <div className="sec-head" style={{ maxWidth: '34rem' }}>
            <Eyebrow light>
              <F k="howEyebrow" />
            </Eyebrow>
            <F k="howTitle" as="h2" className="serif" />
          </div>
          <div className="uselist">
            <div className="use" style={{ borderColor: 'var(--line-light)' }}>
              <div className="ui" style={{ background: 'rgba(52,84,140,.2)', color: 'var(--gold)' }}>
                1
              </div>
              <div>
                <F k="how1Title" as="h3" className="parceiros-step-title" />
                <F k="how1Text" as="p" multiline className="parceiros-step-text" />
              </div>
            </div>
            <div className="use" style={{ borderColor: 'var(--line-light)' }}>
              <div className="ui" style={{ background: 'rgba(52,84,140,.2)', color: 'var(--gold)' }}>
                2
              </div>
              <div>
                <F k="how2Title" as="h3" className="parceiros-step-title" />
                <F k="how2Text" as="p" multiline className="parceiros-step-text" />
              </div>
            </div>
            <div className="use" style={{ borderColor: 'var(--line-light)' }}>
              <div className="ui" style={{ background: 'rgba(52,84,140,.2)', color: 'var(--gold)' }}>
                3
              </div>
              <div>
                <F k="how3Title" as="h3" className="parceiros-step-title" />
                <F k="how3Text" as="p" multiline className="parceiros-step-text" />
              </div>
            </div>
          </div>
        </Wrap>
      </Section>

      <Section variant="cream" id="parceiros-form">
        <Wrap>
          <div className="sec-head" style={{ maxWidth: '34rem' }}>
            <Eyebrow>
              <F k="formEyebrow" />
            </Eyebrow>
            <F k="formTitle" as="h2" className="serif" />
            <F k="formLead" as="p" multiline />
          </div>

          <form className="pform" onSubmit={onSubmit} noValidate>
            <div className="pfield">
              <label htmlFor="p-nome">Nome completo</label>
              <input
                id="p-nome"
                className={cn(errors.nome && 'err')}
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Seu nome"
              />
            </div>
            <div className="pfield">
              <label htmlFor="p-email">E-mail</label>
              <input
                id="p-email"
                type="email"
                className={cn(errors.email && 'err')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="voce@email.com"
              />
            </div>
            <div className="pfield">
              <label htmlFor="p-tel">Telefone / WhatsApp</label>
              <input
                id="p-tel"
                type="tel"
                inputMode="numeric"
                maxLength={15}
                className={cn(errors.tel && 'err')}
                value={tel}
                onChange={(e) => setTel(maskPhone(e.target.value))}
                placeholder="(16) 90000-0000"
              />
            </div>
            <div className="pfield">
              <label htmlFor="p-tipo">Tipo de parceiro</label>
              <select
                id="p-tipo"
                className={cn(errors.ramo && 'err')}
                value={ramoId}
                disabled={ramosStatus !== 'ready' || sending}
                onChange={(e) => setRamoId(e.target.value)}
              >
                {ramosStatus === 'loading' ? <option value="">Carregando…</option> : null}
                {ramosStatus === 'error' ? (
                  <option value="">Não foi possível carregar</option>
                ) : null}
                {ramosStatus === 'ready' ? <option value="">Selecione o ramo</option> : null}
                {ramos.map((ramo) => (
                  <option key={ramo.id} value={String(ramo.id)}>
                    {ramo.nome}
                  </option>
                ))}
              </select>
              {ramosStatus === 'error' ? (
                <button
                  type="button"
                  className="pform-retry"
                  onClick={() => setRamosTick((n) => n + 1)}
                >
                  Tentar carregar de novo
                </button>
              ) : null}
            </div>
            <div className="pfield full">
              <label htmlFor="p-cidade">Cidade / UF</label>
              <input
                id="p-cidade"
                className={cn(errors.cidade && 'err')}
                value={cidade}
                onChange={(e) => setCidade(e.target.value)}
                placeholder="Sua cidade"
              />
            </div>
            {showMsg ? <F k="formError" as="p" className="pform-msg" /> : null}
            {serverMsg ? (
              <p className="pform-msg" role="alert">
                {serverMsg}
              </p>
            ) : null}
            <div className="full">
              <Button
                type="submit"
                variant="blue"
                arrow
                className="w-full justify-center"
                disabled={sending || ramosStatus !== 'ready'}
              >
                {sending ? 'Enviando…' : <F k="formCta" />}
              </Button>
            </div>
          </form>
        </Wrap>
      </Section>

      {modal === 'sucesso' ? (
        <div className="pmodal">
          <div className="pmodal-back" onClick={() => setModal(null)} />
          <div className="pmodal-card" role="dialog" aria-modal="true" aria-label="Cadastro enviado">
            <button type="button" className="pmodal-x" aria-label="Fechar" onClick={() => setModal(null)}>
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
            <F k="modalTitle" as="h3" className="serif" />
            <F k="modalText" as="p" multiline />
            <Button variant="blue" arrow onClick={() => setModal(null)}>
              <F k="modalCta" />
            </Button>
          </div>
        </div>
      ) : null}

      {modal === 'recente' && recente ? (
        <div className="pmodal">
          <div className="pmodal-back" onClick={() => setModal(null)} />
          <div className="pmodal-card" role="dialog" aria-modal="true" aria-labelledby="pmodal-recente-title">
            <button type="button" className="pmodal-x" aria-label="Fechar" onClick={() => setModal(null)}>
              ✕
            </button>
            <div className="pmodal-check wait">
              <svg
                width="30"
                height="30"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 2" />
              </svg>
            </div>
            <h3 id="pmodal-recente-title" className="serif">
              Cadastro já recebido
            </h3>
            <p>
              {recente.mensagem}
              {espera ? (
                <>
                  <br />
                  <strong>{espera}</strong>
                </>
              ) : null}
            </p>
            <Button variant="blue" arrow onClick={() => setModal(null)}>
              Entendi
            </Button>
          </div>
        </div>
      ) : null}
    </main>
  )
}
