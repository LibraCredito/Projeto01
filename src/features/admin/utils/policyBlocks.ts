const NUM = /^\d+(\.\d+)*[.)]\s+/
const BUL = /^(?:[-\u2013\u2014\u2022\u00b7]|\*(?!\*))\s+/

export type PolicyBlock =
  | { type: 'update'; text: string }
  | { type: 'heading'; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'list'; ordered: boolean; items: string[] }
  | { type: 'table'; rows: string[][] }

function capsish(line: string): boolean {
  return line === line.toUpperCase() && /[A-ZÁÉÍÓÚÂÊÔÃÕÇ]/.test(line)
}

function tituloSolto(line: string): boolean {
  return line.length <= 70 && line.split(/\s+/).length <= 6 && !/[.,;]$/.test(line)
}

function splitCells(line: string): string[] {
  return line.split('|').map((cell) => cell.trim())
}

function groupsOf(txt: string): string[][] {
  const lines = txt.replace(/\r/g, '').split('\n')
  const groups: string[][] = []
  let current: string[] = []
  for (const raw of lines) {
    const line = raw.trim()
    if (line === '') {
      if (current.length) {
        groups.push(current)
        current = []
      }
    } else {
      current.push(line)
    }
  }
  if (current.length) groups.push(current)
  return groups
}

function pushRest(lines: string[], out: PolicyBlock[]) {
  let paragraph: string[] = []
  const flush = () => {
    if (!paragraph.length) return
    out.push({ type: 'paragraph', text: paragraph.join(' ') })
    paragraph = []
  }
  for (let i = 0; i < lines.length; i++) {
    if (!BUL.test(lines[i])) {
      paragraph.push(lines[i])
      continue
    }
    flush()
    const items: string[] = []
    while (i < lines.length && BUL.test(lines[i])) {
      items.push(lines[i].replace(BUL, ''))
      i++
    }
    i--
    out.push({ type: 'list', ordered: false, items })
  }
  flush()
}

export function parsePolicy(txt: string): PolicyBlock[] {
  const out: PolicyBlock[] = []
  const groups = groupsOf(txt)
  groups.forEach((group, index) => {
    if (
      index === 0 &&
      group.length === 1 &&
      group[0].toLowerCase().includes('política de privacidade')
    ) {
      return
    }
    if (group.length === 1 && /^última atualização:/i.test(group[0])) {
      out.push({ type: 'update', text: group[0] })
      return
    }
    if (group.length > 1 && group.every((line) => line.includes('|'))) {
      const rows = group.map(splitCells)
      const width = Math.max(...rows.map((row) => row.length))
      out.push({
        type: 'table',
        rows: rows.map((row) => Array.from({ length: width }, (_, cell) => row[cell] ?? '')),
      })
      return
    }
    if (group.every((line) => BUL.test(line))) {
      out.push({
        type: 'list',
        ordered: false,
        items: group.map((line) => line.replace(BUL, '')),
      })
      return
    }
    if (group.length > 1 && group.every((line) => NUM.test(line))) {
      out.push({
        type: 'list',
        ordered: true,
        items: group.map((line) => line.replace(NUM, '')),
      })
      return
    }
    let lines = group
    const first = lines[0]
    const heading =
      (NUM.test(first) && first.length <= 90) ||
      (capsish(first) && first.length <= 90) ||
      (lines.length === 1 && (tituloSolto(first) || capsish(first)))
    if (heading) {
      out.push({ type: 'heading', text: first })
      lines = lines.slice(1)
    }
    pushRest(lines, out)
  })
  return out
}

export function serializePolicy(blocks: PolicyBlock[]): string {
  const parts: string[] = []
  for (const block of blocks) {
    if (block.type === 'update' || block.type === 'heading' || block.type === 'paragraph') {
      const text = block.text.trim()
      if (text) parts.push(text)
      continue
    }
    if (block.type === 'list') {
      const items = block.items.map((item) => item.trim()).filter(Boolean)
      if (!items.length) continue
      parts.push(
        items
          .map((item, index) => (block.ordered ? `${index + 1}. ${item}` : `- ${item}`))
          .join('\n'),
      )
      continue
    }
    const width = Math.max(...block.rows.map((row) => row.length), 0)
    if (width < 1) continue
    const rows = block.rows.map((row) =>
      Array.from({ length: width }, (_, index) => (row[index] ?? '').trim()),
    )
    if (rows.length < 2) continue
    const lines = rows.map((row) => (width === 1 ? `${row[0]} |` : row.join(' | ')))
    parts.push(lines.join('\n'))
  }
  return parts.join('\n\n').trim()
}
