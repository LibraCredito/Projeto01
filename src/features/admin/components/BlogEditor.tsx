import { Editor } from '@tinymce/tinymce-react'
import 'tinymce/tinymce'
import 'tinymce/models/dom/model'
import 'tinymce/themes/silver'
import 'tinymce/icons/default'
import 'tinymce/skins/ui/oxide/skin'
import 'tinymce/skins/ui/oxide/content'
import 'tinymce/skins/content/default/content'
import 'tinymce/plugins/advlist'
import 'tinymce/plugins/autolink'
import 'tinymce/plugins/autoresize'
import 'tinymce/plugins/code'
import 'tinymce/plugins/image'
import 'tinymce/plugins/link'
import 'tinymce/plugins/lists'
import 'tinymce/plugins/media'
import 'tinymce/plugins/table'
import 'tinymce/plugins/wordcount'
import 'tinymce-i18n/langs8/pt-BR'

import { resolveMediaUrl, uploadImage } from '@/features/admin/api/client'

type BlogEditorProps = {
  value: string
  onChange: (html: string) => void
  disabled?: boolean
}

const CONTENT_STYLE = `
  @font-face { font-family: Comfortaa; font-weight: 300 700; font-display: swap; src: url('/fonts/comfortaa-latin.woff2') format('woff2'); }
  @font-face { font-family: "Instrument Serif"; font-style: normal; font-weight: 400; font-display: swap; src: url('/fonts/instrument-serif-latin.woff2') format('woff2'); }
  @font-face { font-family: "Instrument Serif"; font-style: italic; font-weight: 400; font-display: swap; src: url('/fonts/instrument-serif-latin-italic.woff2') format('woff2'); }
  body { font-family: Comfortaa, system-ui, sans-serif; font-size: 16px; line-height: 1.7; color: #0b1f3f; margin: 16px; }
  h2, h3, h4 { font-family: "Instrument Serif", Georgia, serif; font-weight: 400; line-height: 1.15; }
  h2 { font-size: 28px; } h3 { font-size: 23px; } h4 { font-size: 19px; }
  img { max-width: 100%; height: auto; border-radius: 12px; }
  blockquote { border-left: 3px solid #e6a83c; margin: 0; padding: 4px 0 4px 16px; color: #34548c; font-style: italic; }
  a { color: #34548c; }
`

export function BlogEditor({ value, onChange, disabled }: BlogEditorProps) {
  return (
    <Editor
      licenseKey="gpl"
      value={value}
      disabled={disabled}
      onEditorChange={(html) => onChange(html)}
      init={{
        language: 'pt-BR',
        skin_url: 'default',
        content_css: 'default',
        content_style: CONTENT_STYLE,
        menubar: false,
        branding: false,
        promotion: false,
        min_height: 420,
        max_height: 900,
        autoresize_bottom_margin: 24,
        plugins: 'advlist autolink autoresize code image link lists media table wordcount',
        toolbar:
          'undo redo | blocks | bold italic underline strikethrough | bullist numlist blockquote | link image media table | removeformat | code',
        block_formats: 'Parágrafo=p; Título=h2; Subtítulo=h3; Tópico=h4',
        /* Mantém os endereços como estão; a conversão para /images/ é feita ao salvar. */
        convert_urls: false,
        relative_urls: false,
        link_default_target: '_blank',
        link_assume_external_targets: 'https',
        image_caption: true,
        image_dimensions: false,
        image_advtab: false,
        object_resizing: 'img',
        paste_data_images: true,
        automatic_uploads: true,
        images_file_types: 'jpg,jpeg,png,webp',
        images_upload_handler: async (blobInfo) => {
          const blob = blobInfo.blob()
          const file = new File([blob], blobInfo.filename(), { type: blob.type })
          const url = await uploadImage(file)
          return resolveMediaUrl(url)
        },
        media_alt_source: false,
        media_poster: false,
        invalid_elements: 'script,style,form,input,button,object,embed',
      }}
    />
  )
}
