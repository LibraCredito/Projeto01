import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { useAdmin } from '@/features/admin/AdminProvider'
import type { SiteContent } from '@/features/admin/types'
import { ytId } from '@/features/admin/utils/ytId'
import { ROUTES } from '@/lib/constants/routes'

function applyVideo(prev: SiteContent, url: string): SiteContent {
  return {
    ...prev,
    videos: { ...prev.videos, depoimentoYoutubeOrUrl: url },
    midias: { ...prev.midias, depoimentoVideoUrl: url },
  }
}

export function EditBar() {
  const {
    session,
    editing,
    setEditing,
    saveContent,
    setContent,
    setFlash,
    logout,
  } = useAdmin()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [saving, setSaving] = useState(false)

  if (!session) return null
  if (pathname.startsWith(ROUTES.ADMIN)) return null

  function onVideo() {
    const next = window.prompt('Cole a URL do YouTube do depoimento:', '')
    if (next === null) return
    const url = next.trim()
    if (!url) return
    if (!ytId(url)) {
      setFlash({
        type: 'err',
        text: 'URL inválida. Cole um link do YouTube (ex.: https://www.youtube.com/watch?v=...).',
      })
      return
    }
    setContent((prev) => applyVideo(prev, url))
    setFlash({ type: 'ok', text: 'URL do YouTube atualizada. Clique em Salvar.' })
  }

  async function onSave() {
    if (saving) return
    setSaving(true)
    try {
      await saveContent()
    } catch {
      /* flash já setado no provider */
    } finally {
      setSaving(false)
    }
  }

  function onExitEdit() {
    setEditing(false)
    setFlash({ type: 'ok', text: 'Você saiu do modo de edição.' })
  }

  return (
    <div id="editbar" data-admin="">
      <span className="lbl">
        {editing ? 'Editando — clique nos textos e fotos' : 'Modo admin'}
      </span>
      <button type="button" className="b-adm" onClick={() => navigate(ROUTES.ADMIN)}>
        Painel
      </button>
      {!editing ? (
        <button type="button" className="b-edit" onClick={() => setEditing(true)}>
          Editar página
        </button>
      ) : (
        <button type="button" className="b-done" onClick={onExitEdit}>
          Sair da edição
        </button>
      )}
      <button type="button" className="b-vid" onClick={onVideo} disabled={!editing}>
        Vídeo
      </button>
      <button type="button" className="b-exp" onClick={() => void onSave()} disabled={saving}>
        {saving ? 'Salvando…' : 'Salvar'}
      </button>
      <button
        type="button"
        className="b-sair"
        onClick={() => {
          setEditing(false)
          logout()
        }}
        title="Encerrar sessão do admin"
      >
        Sair
      </button>
    </div>
  )
}
