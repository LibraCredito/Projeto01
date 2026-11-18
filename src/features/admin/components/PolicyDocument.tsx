import { useLayoutEffect, useMemo, useRef, type MouseEvent } from 'react'

import { useAdmin } from '@/features/admin/AdminProvider'
import { richText } from '@/features/admin/utils/formatPlainText'
import {
  parsePolicy,
  serializePolicy,
  type PolicyBlock,
} from '@/features/admin/utils/policyBlocks'

type PolicyDocumentProps = {
  text: string
  onChange: (update: (current: string) => string) => void
}

function plainFrom(el: HTMLElement): string {
  let out = ''
  el.childNodes.forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      out += node.textContent || ''
      return
    }
    if (!(node instanceof HTMLElement)) return
    const inner = node.textContent || ''
    if (node.tagName === 'STRONG' || node.tagName === 'B') out += `**${inner}**`
    else if (node.tagName === 'BR') out += '\n'
    else out += inner
  })
  return out.replace(/\u00a0/g, ' ').replace(/[ \t]+\n/g, '\n').trim()
}

function RichText({
  value,
  editing,
  className,
  as: Tag,
  onCommit,
}: {
  value: string
  editing: boolean
  className?: string
  as: 'p' | 'h2' | 'li' | 'td' | 'th'
  onCommit: (value: string) => void
}) {
  const ref = useRef<HTMLElement>(null)
  const html = richText(value)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el || document.activeElement === el) return
    if (el.childNodes.length > 0 && plainFrom(el) === value) return
    el.innerHTML = html
  }, [html, value])

  return (
    <Tag
      ref={ref as never}
      className={className}
      contentEditable={editing || undefined}
      suppressContentEditableWarning
      spellCheck={editing ? false : undefined}
      onMouseDown={(event) => {
        if (editing) event.stopPropagation()
      }}
      onBlur={() => {
        const el = ref.current
        if (!editing || !el || !el.isConnected) return
        const selection = window.getSelection()
        if (selection && el.contains(selection.anchorNode)) selection.removeAllRanges()
        const next = plainFrom(el).replace(/\s*\n\s*/g, ' ').trim()
        if (next !== value) onCommit(next)
        else if (el.innerHTML !== html) el.innerHTML = html
      }}
    />
  )
}

export function PolicyDocument({ text, onChange }: PolicyDocumentProps) {
  const { editing } = useAdmin()
  const blocks = useMemo(() => parsePolicy(text), [text])

  function changeBlock(index: number, recipe: (block: PolicyBlock) => PolicyBlock | null) {
    onChange((current) => {
      const next = parsePolicy(current)
      const block = next[index]
      if (!block) return current
      const updated = recipe(block)
      if (!updated) next.splice(index, 1)
      else next[index] = updated
      return serializePolicy(next)
    })
  }

  function onToolMouseDown(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault()
  }

  return (
    <>
      {blocks.map((block, index) => {
        if (block.type === 'update') {
          return (
            <RichText
              key={`update-${index}`}
              as="p"
              className="doc-upd"
              value={block.text}
              editing={editing}
              onCommit={(value) =>
                changeBlock(index, (current) =>
                  current.type === 'update' ? { ...current, text: value } : current,
                )
              }
            />
          )
        }
        if (block.type === 'heading') {
          return (
            <RichText
              key={`heading-${index}`}
              as="h2"
              value={block.text}
              editing={editing}
              onCommit={(value) =>
                changeBlock(index, (current) =>
                  current.type === 'heading' ? { ...current, text: value } : current,
                )
              }
            />
          )
        }
        if (block.type === 'paragraph') {
          return (
            <RichText
              key={`paragraph-${index}`}
              as="p"
              value={block.text}
              editing={editing}
              onCommit={(value) =>
                changeBlock(index, (current) =>
                  current.type === 'paragraph' ? { ...current, text: value } : current,
                )
              }
            />
          )
        }
        if (block.type === 'list') {
          const List = block.ordered ? 'ol' : 'ul'
          return (
            <List key={`list-${index}`}>
              {block.items.map((item, itemIndex) => (
                <RichText
                  key={`${index}-${itemIndex}`}
                  as="li"
                  value={item}
                  editing={editing}
                  onCommit={(value) =>
                    changeBlock(index, (current) => {
                      if (current.type !== 'list' || itemIndex >= current.items.length) return current
                      const items = current.items.slice()
                      items[itemIndex] = value
                      return { ...current, items }
                    })
                  }
                />
              ))}
            </List>
          )
        }
        const width = Math.max(...block.rows.map((row) => row.length), 0)
        return (
          <div className="tablewrap" key={`table-${index}`}>
            {editing ? (
              <div className="doc-tools">
                <button
                  type="button"
                  onMouseDown={onToolMouseDown}
                  onClick={() =>
                    changeBlock(index, (current) => {
                      if (current.type !== 'table') return current
                      const rows = current.rows.map((row, rowIndex) => [
                        ...row,
                        rowIndex === 0 ? 'Nova coluna' : '',
                      ])
                      return { ...current, rows }
                    })
                  }
                >
                  + coluna
                </button>
                <button
                  type="button"
                  disabled={width < 3}
                  onMouseDown={onToolMouseDown}
                  onClick={() =>
                    changeBlock(index, (current) => {
                      if (current.type !== 'table') return current
                      const span = Math.max(...current.rows.map((row) => row.length), 0)
                      if (span < 3) return current
                      const rows = current.rows.map((row) =>
                        Array.from({ length: span }, (_, cell) => row[cell] ?? '').slice(0, -1),
                      )
                      return { ...current, rows }
                    })
                  }
                >
                  − coluna
                </button>
                <button
                  type="button"
                  onMouseDown={onToolMouseDown}
                  onClick={() =>
                    changeBlock(index, (current) => {
                      if (current.type !== 'table') return current
                      const span = Math.max(...current.rows.map((row) => row.length), 0)
                      return {
                        ...current,
                        rows: [...current.rows, Array.from({ length: span }, () => '')],
                      }
                    })
                  }
                >
                  + linha
                </button>
                <button
                  type="button"
                  disabled={block.rows.length < 3}
                  onMouseDown={onToolMouseDown}
                  onClick={() =>
                    changeBlock(index, (current) => {
                      if (current.type !== 'table' || current.rows.length < 3) return current
                      return { ...current, rows: current.rows.slice(0, -1) }
                    })
                  }
                >
                  − linha
                </button>
                <button
                  type="button"
                  className="danger"
                  onMouseDown={onToolMouseDown}
                  onClick={() => {
                    if (window.confirm('Tirar esta tabela da página?')) {
                      changeBlock(index, (current) => (current.type === 'table' ? null : current))
                    }
                  }}
                >
                  Tirar tabela
                </button>
              </div>
            ) : null}
            <table className="doc-table">
              <thead>
                <tr>
                  {block.rows[0]?.map((cell, cellIndex) => (
                    <RichText
                      key={`h-${cellIndex}`}
                      as="th"
                      value={cell}
                      editing={editing}
                      onCommit={(value) =>
                        changeBlock(index, (current) => {
                          if (current.type !== 'table' || !current.rows[0]) return current
                          if (cellIndex >= current.rows[0].length) return current
                          const rows = current.rows.map((row) => row.slice())
                          rows[0][cellIndex] = value
                          return { ...current, rows }
                        })
                      }
                    />
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.rows.slice(1).map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {Array.from({ length: width }, (_, cellIndex) => (
                      <RichText
                        key={`${rowIndex}-${cellIndex}`}
                        as="td"
                        value={row[cellIndex] ?? ''}
                        editing={editing}
                        onCommit={(value) =>
                          changeBlock(index, (current) => {
                            if (current.type !== 'table') return current
                            const line = current.rows[rowIndex + 1]
                            if (!line || cellIndex >= line.length) return current
                            const rows = current.rows.map((item) => item.slice())
                            rows[rowIndex + 1][cellIndex] = value
                            return { ...current, rows }
                          })
                        }
                      />
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      })}
    </>
  )
}
