import { ApiError, apiPost } from '@/features/admin/api/client'

export type SimulacaoInput = {
  nome: string
  email: string
  tel: string
  credito: number
  prazo: number
  imovel: number
  cidade: string
  parcela?: number
  amort?: 'price' | 'sac'
  urgencia?: string
  financiado?: 'sim' | 'nao'
  origem?: string
}

export type SimulacaoEnviada = {
  ok: true
  aguardar?: false
  dealId?: number
  contactId?: number
  contatoNovo?: boolean
}

export type SimulacaoMotivo = 'email' | 'telefone' | 'email_telefone'

export type SimulacaoRecente = {
  ok: false
  recente: true
  mensagem: string
  motivo?: SimulacaoMotivo
  diasRestantes?: number
  criadoEm?: string
  liberadoEm?: string
}

export type EnviarSimulacaoResult = { ok: true; data: SimulacaoEnviada } | SimulacaoRecente

const MSG_RECENTE =
  'Já existe uma simulação realizada nos últimos 7 dias com este e-mail ou telefone.'

const MSG_INDISPONIVEL =
  'Não conseguimos enviar a simulação agora. Tente de novo em alguns minutos.'

export class SimulacaoFormError extends Error {
  kind: 'validacao' | 'indisponivel'
  errors: string[]

  constructor(kind: 'validacao' | 'indisponivel', errors: string[]) {
    super(errors[0] || MSG_INDISPONIVEL)
    this.name = 'SimulacaoFormError'
    this.kind = kind
    this.errors = errors
  }
}

function asRecord(body: unknown): Record<string, unknown> | null {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return null
  return body as Record<string, unknown>
}

function readMotivo(value: unknown): SimulacaoMotivo | undefined {
  if (value === 'email' || value === 'telefone' || value === 'email_telefone') return value
  return undefined
}

function readRecente(body: unknown): SimulacaoRecente | null {
  const record = asRecord(body)
  if (!record) return null
  if (record.aguardar !== true && record.code !== 'SIMULACAO_RECENTE') return null

  const dias = record.diasRestantes
  return {
    ok: false,
    recente: true,
    mensagem:
      typeof record.mensagem === 'string' && record.mensagem.trim()
        ? record.mensagem.trim()
        : MSG_RECENTE,
    motivo: readMotivo(record.motivo),
    diasRestantes: typeof dias === 'number' && Number.isFinite(dias) ? dias : undefined,
    criadoEm: typeof record.criadoEm === 'string' ? record.criadoEm : undefined,
    liberadoEm: typeof record.liberadoEm === 'string' ? record.liberadoEm : undefined,
  }
}

export function textoMotivo(motivo: SimulacaoRecente['motivo']): string | null {
  if (motivo === 'email') return 'A simulação recente está ligada a este e-mail.'
  if (motivo === 'telefone') return 'A simulação recente está ligada a este telefone.'
  if (motivo === 'email_telefone') return 'A simulação recente está ligada a este e-mail e a este telefone.'
  return null
}

export function textoEspera(recente: SimulacaoRecente): string | null {
  const partes: string[] = []
  const dias = recente.diasRestantes
  if (typeof dias === 'number' && dias > 0) {
    partes.push(
      dias === 1
        ? 'Você poderá simular novamente em 1 dia.'
        : `Você poderá simular novamente em ${dias} dias.`,
    )
  }

  if (recente.liberadoEm) {
    const data = new Date(recente.liberadoEm)
    if (!Number.isNaN(data.getTime())) {
      const quando = new Intl.DateTimeFormat('pt-BR', {
        dateStyle: 'long',
        timeZone: 'America/Sao_Paulo',
      }).format(data)
      partes.push(`A partir de ${quando}.`)
    }
  }

  return partes.length ? partes.join(' ') : null
}

function readErrors(body: unknown, fallback: string): string[] {
  const record = asRecord(body)
  if (record && Array.isArray(record.errors) && record.errors.length) {
    return record.errors.map((item) => String(item)).filter(Boolean)
  }
  return [fallback]
}

export async function enviarSimulacao(input: SimulacaoInput): Promise<EnviarSimulacaoResult> {
  try {
    const data = await apiPost<SimulacaoEnviada>('/simulacao', input, { auth: false })
    return { ok: true, data }
  } catch (err) {
    if (err instanceof ApiError && err.status === 409) {
      const recente = readRecente(err.body)
      if (recente) return recente
    }

    if (err instanceof ApiError && err.status === 400) {
      throw new SimulacaoFormError('validacao', readErrors(err.body, err.message))
    }

    throw new SimulacaoFormError('indisponivel', [MSG_INDISPONIVEL])
  }
}
