import { useAdmin } from '@/features/admin/AdminProvider'

function fmtWhen(iso: string) {
  try {
    return new Date(iso).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return iso
  }
}

function str(v: string | number | null | undefined) {
  if (v === null || v === undefined) return '—'
  return String(v)
}

export function LeadsPanel() {
  const { leads, clearLeads, exportLeadsCsv, refreshLeads, markLeadRead, setFlash } = useAdmin()

  const sims = leads.filter((l) => l.tipo === 'simulacao')
  const pars = leads.filter((l) => l.tipo === 'parceiro')
  const today = new Date().toDateString()
  const hoje = leads.filter((l) => new Date(l.quando).toDateString() === today).length

  function downloadCsv() {
    const csv = exportLeadsCsv()
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `libra-leads-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
    setFlash({ type: 'ok', text: 'CSV baixado.' })
  }

  return (
    <>
      <div className="adm-kpis">
        <div className="adm-kpi">
          <b>{sims.length}</b>
          <span>Simulações</span>
        </div>
        <div className="adm-kpi">
          <b>{pars.length}</b>
          <span>Parceiros</span>
        </div>
        <div className="adm-kpi">
          <b>{hoje}</b>
          <span>Hoje</span>
        </div>
      </div>

      <div className="adm-card">
        <h3>Últimas simulações</h3>
        <p className="hint">Capturadas quando alguém conclui o passo final do simulador.</p>
        {sims.length === 0 ? (
          <div className="adm-empty">Nenhuma simulação por aqui ainda.</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Quando</th>
                  <th>Nome</th>
                  <th>Contato</th>
                  <th>Imóvel</th>
                  <th>Crédito</th>
                  <th>Prazo</th>
                  <th>Parcela</th>
                  <th>Cidade</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {sims.map((l) => (
                  <tr key={l.id} style={{ opacity: l.status === 'lido' ? 0.65 : 1 }}>
                    <td>{fmtWhen(l.quando)}</td>
                    <td>{str(l.dados.nome)}</td>
                    <td>
                      {str(l.dados.tel)}
                      <br />
                      <small>{str(l.dados.email)}</small>
                    </td>
                    <td>{str(l.dados.imovel ?? l.resultado?.imovel)}</td>
                    <td>{str(l.dados.credito ?? l.resultado?.credito)}</td>
                    <td>{str(l.dados.prazo ?? l.resultado?.prazo)}</td>
                    <td>{str(l.resultado?.parcela)}</td>
                    <td>{str(l.dados.cidade)}</td>
                    <td>
                      {l.status === 'novo' ? (
                        <button type="button" onClick={() => void markLeadRead(l.id)}>
                          Lido
                        </button>
                      ) : (
                        'lido'
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="adm-card">
        <h3>Últimos cadastros de parceiros</h3>
        {pars.length === 0 ? (
          <div className="adm-empty">Nenhum cadastro por aqui ainda.</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Quando</th>
                  <th>Nome</th>
                  <th>Contato</th>
                  <th>Tipo</th>
                  <th>Cidade</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {pars.map((l) => (
                  <tr key={l.id} style={{ opacity: l.status === 'lido' ? 0.65 : 1 }}>
                    <td>{fmtWhen(l.quando)}</td>
                    <td>{str(l.dados.nome)}</td>
                    <td>
                      {str(l.dados.tel)}
                      <br />
                      <small>{str(l.dados.email)}</small>
                    </td>
                    <td>{str(l.dados.tipoParceiro ?? l.dados.tipo)}</td>
                    <td>{str(l.dados.cidade)}</td>
                    <td>
                      {l.status === 'novo' ? (
                        <button type="button" onClick={() => void markLeadRead(l.id)}>
                          Lido
                        </button>
                      ) : (
                        'lido'
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="adm-actions">
        <button type="button" className="btn btn-blue" onClick={() => void refreshLeads()}>
          Buscar do servidor <span className="ar">→</span>
        </button>
        <button type="button" className="btn btn-ghost-d" onClick={downloadCsv}>
          Baixar CSV
        </button>
        <button
          type="button"
          className="btn btn-ghost-d"
          onClick={() => {
            if (window.confirm('Limpar o espelho local dos leads? (servidor permanece)')) {
              clearLeads()
            }
          }}
        >
          Limpar espelho local
        </button>
      </div>
      <p className="adm-note">
        <b>Como funciona:</b> simulações vão para <code>POST /leads</code>. Cadastros de
        parceiros vão para <code>POST /parceiros</code>. O painel lista via{' '}
        <code>GET /admin/leads</code>. Use “Buscar do servidor” para atualizar.
      </p>
    </>
  )
}
