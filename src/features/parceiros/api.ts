import { ApiError, apiGet, apiPost } from '@/features/admin/api/client'

export type RamoParceiro = {
  id: number
  nome: string
}

export type ParceiroInput = {
  nome: string
  email: string
  telefone: string
  cidade: string
  ramoId: number
}

export type ParceiroEnviado = {
  ok: true
  aguardar: false
  dealId?: number
  contactId?: number
  ramo?: string
}

export type ParceiroRecente = {
  ok: false
  recente: true
  mensagem: string
  diasRestantes?: number
  liberadoEm?: string
}

export type EnviarParceiroResult = { ok: true; data: ParceiroEnviado } | ParceiroRecente

const MSG_RECENTE =
  'Já recebemos o seu cadastro. Aguarde alguns dias para enviar novamente.'

const MSG_INDISPONIVEL =
  'Não conseguimos enviar o cadastro agora. Tente de novo em alguns minutos.'

export class ParceiroFormError extends Error {
  kind: 'validacao' | 'indisponivel'
  errors: string[]

  constructor(kind: 'validacao' | 'indisponivel', errors: string[]) {
    super(errors[0] || MSG_INDISPONIVEL)
    this.name = 'ParceiroFormError'
    this.kind = kind
    this.errors = errors
  }
}

function asRecord(body: unknown): Record<string, unknown> | null {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return null
  return body as Record<string, unknown>
}

function readErrors(body: unknown, fallback: string): string[] {
  const record = asRecord(body)
  if (record && Array.isArray(record.errors) && record.errors.length) {
    return record.errors.map((item) => String(item)).filter(Boolean)
  }
  return [fallback]
}

function readRecente(body: unknown): ParceiroRecente | null {
  const record = asRecord(body)
  if (!record) return null
  if (record.aguardar !== true && record.code !== 'PARCEIRO_RECENTE') return null

  const dias = record.diasRestantes
  return {
    ok: false,
    recente: true,
    mensagem: typeof record.mensagem === 'string' && record.mensagem.trim()
      ? record.mensagem.trim()
      : MSG_RECENTE,
    diasRestantes: typeof dias === 'number' && Number.isFinite(dias) ? dias : undefined,
    liberadoEm: typeof record.liberadoEm === 'string' ? record.liberadoEm : undefined,
  }
}

export function textoEspera(recente: ParceiroRecente): string | null {
  const partes: string[] = []
  const dias = recente.diasRestantes
  if (typeof dias === 'number' && dias > 0) {
    partes.push(dias === 1 ? 'Aguarde 1 dia.' : `Aguarde ${dias} dias.`)
  }

  if (recente.liberadoEm) {
    const data = new Date(recente.liberadoEm)
    if (!Number.isNaN(data.getTime())) {
      const quando = new Intl.DateTimeFormat('pt-BR', {
        dateStyle: 'long',
        timeZone: 'America/Sao_Paulo',
      }).format(data)
      partes.push(`Você poderá enviar novamente a partir de ${quando}.`)
    }
  }

  return partes.length ? partes.join(' ') : null
}

export async function listarRamos(): Promise<RamoParceiro[]> {
  const data = await apiGet<unknown>('/parceiros/ramos', { auth: false })
  if (!Array.isArray(data)) return []
  return data.flatMap((item) => {
    const record = asRecord(item)
    if (!record) return []
    const id = Number(record.id)
    const nome = typeof record.nome === 'string' ? record.nome.trim() : ''
    if (!Number.isFinite(id) || !nome) return []
    return [{ id, nome }]
  })
}

export async function enviarParceiro(input: ParceiroInput): Promise<EnviarParceiroResult> {
  try {
    const data = await apiPost<ParceiroEnviado>('/parceiros', input, { auth: false })
    return { ok: true, data }
  } catch (err) {
    if (err instanceof ApiError && err.status === 409) {
      const recente = readRecente(err.body)
      if (recente) return recente
    }

    if (err instanceof ApiError && err.status === 400) {
      throw new ParceiroFormError('validacao', readErrors(err.body, err.message))
    }

    if (err instanceof ApiError && (err.status === 500 || err.status === 502 || err.status === 0)) {
      throw new ParceiroFormError('indisponivel', [MSG_INDISPONIVEL])
    }

    throw new ParceiroFormError('indisponivel', [MSG_INDISPONIVEL])
  }
}
