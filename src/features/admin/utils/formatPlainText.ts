const NUM = /^\d+(\.\d+)*[.)]\s+/
const BUL = /^(?:[-\u2013\u2014\u2022\u00b7]|\*(?!\*))\s+/

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

export function richText(s: string): string {
  return esc(s)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(
      /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g,
      '<a href="mailto:$1">$1</a>',
    )
}

function capsish(l: string): boolean {
  return (
    l === l.toUpperCase() &&
    /[A-ZÁÉÍÓÚÂÊÔÃÕÇ]/.test(l)
  )
}

function tituloSolto(l: string): boolean {
  return l.length <= 70 && l.split(/\s+/).length <= 6 && !/[.,;]$/.test(l)
}

/**
 * Texto puro → HTML semântico (h2, p, ul, ol), mesma lógica do `formata()` do exemplo HTML.
 */
export function formatPlainText(txt: string, tituloPagina = ''): string {
  const lines = txt.replace(/\r/g, '').split('\n')
  const blocks: string[][] = []
  let cur: string[] = []
  for (const raw of lines) {
    const l = raw.trim()
    if (l === '') {
      if (cur.length) {
        blocks.push(cur)
        cur = []
      }
    } else {
      cur.push(l)
    }
  }
  if (cur.length) blocks.push(cur)

  let html = ''
  for (let b = 0; b < blocks.length; b++) {
    const blk = blocks[b]
    if (
      b === 0 &&
      blk.length === 1 &&
      tituloPagina &&
      blk[0].toLowerCase().includes(tituloPagina.toLowerCase())
    ) {
      continue
    }
    if (blk.length === 1 && /^última atualização:/i.test(blk[0])) {
      html += `<p class="doc-upd">${richText(blk[0])}</p>`
      continue
    }
    const allTable = blk.length > 1 && blk.every((l) => l.includes(' | '))
    if (allTable) {
      const rows = blk.map((l) => l.split(/\s+\|\s+/).map((cell) => richText(cell.trim())))
      const head = rows[0]
      const body = rows.slice(1)
      html += `<div class="tablewrap"><table class="doc-table"><thead><tr>${head.map((cell) => `<th>${cell}</th>`).join('')}</tr></thead><tbody>${body.map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`
      continue
    }
    const allBul = blk.every((l) => BUL.test(l))
    const allNum = blk.length > 1 && blk.every((l) => NUM.test(l))
    if (allBul) {
      html += `<ul>${blk.map((l) => `<li>${richText(l.replace(BUL, ''))}</li>`).join('')}</ul>`
      continue
    }
    if (allNum) {
      html += `<ol>${blk.map((l) => `<li>${richText(l.replace(NUM, ''))}</li>`).join('')}</ol>`
      continue
    }
    let head: string | null = null
    let resto = blk
    const first = blk[0]
    if ((NUM.test(first) && first.length <= 90) || (capsish(first) && first.length <= 90)) {
      head = first
      resto = blk.slice(1)
    } else if (blk.length === 1 && (tituloSolto(first) || capsish(first))) {
      head = first
      resto = []
    }
    if (head) html += `<h2>${richText(head)}</h2>`
    if (resto.length) {
      const parts: string[] = []
      let pc: string[] = []
      for (let r = 0; r < resto.length; r++) {
        if (BUL.test(resto[r])) {
          if (pc.length) {
            parts.push(`<p>${richText(pc.join(' '))}</p>`)
            pc = []
          }
          const lis: string[] = []
          while (r < resto.length && BUL.test(resto[r])) {
            lis.push(`<li>${richText(resto[r].replace(BUL, ''))}</li>`)
            r++
          }
          r--
          parts.push(`<ul>${lis.join('')}</ul>`)
        } else {
          pc.push(resto[r])
        }
      }
      if (pc.length) parts.push(`<p>${richText(pc.join(' '))}</p>`)
      html += parts.join('')
    }
  }
  return html
}
