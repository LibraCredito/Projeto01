import { MUNICIPIOS } from '@/features/simulator/municipios'

export type Municipio = {
  nome: string
  uf: string
}

const LISTA: Municipio[] = MUNICIPIOS.map(([nome, uf]) => ({ nome, uf }))

function semAcento(value: string) {
  return value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
}

export function formatarCidade(nome: string, uf: string) {
  return `${nome} - ${uf}`
}

/** Até 8 municípios cujo nome começa pelo texto, e depois os que só contêm o texto. */
export function buscarCidades(texto: string, limite = 8): Municipio[] {
  const bruto = texto.trim().replace(/\s+-\s*[A-Za-z]{0,2}$/u, '')
  const q = semAcento(bruto)
  if (q.length < 2) return []

  const comeca: Municipio[] = []
  const contem: Municipio[] = []
  for (const cidade of LISTA) {
    const nome = semAcento(cidade.nome)
    if (nome.startsWith(q)) comeca.push(cidade)
    else if (nome.includes(q)) contem.push(cidade)
    if (comeca.length >= limite) break
  }
  return [...comeca, ...contem].slice(0, limite)
}
