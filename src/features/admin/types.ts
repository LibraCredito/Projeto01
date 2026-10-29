export type LeadTipo = 'simulacao' | 'parceiro'
export type LeadStatus = 'novo' | 'lido'

export type Lead = {
  id: string
  tipo: LeadTipo
  quando: string
  status: LeadStatus
  dados: Record<string, string | number | null>
  resultado?: Record<string, string | number | null>
  origem?: string
}

export type BlogCorpoFormato = 'texto' | 'html'

export type BlogPost = {
  id: string
  slug: string
  titulo: string
  categoria: string
  resumo: string
  subtitulo: string
  leitura: string
  /** Ausente na listagem pública (GET /blog). */
  corpoTexto: string
  /** 'html' = editor TinyMCE; 'texto' = posts antigos em texto puro. */
  corpoFormato?: BlogCorpoFormato
  capaUrl?: string
  publicado: boolean
  publicadoEm: string
}

export type SiteMedia = {
  heroImageUrl: string
  /** Vídeo de fundo do hero (ciclista). Ex.: /videos/hero-bike.mp4 */
  heroVideoUrl?: string
  usecaseImageUrl: string
  aboutImageUrl: string
  sobreImageUrl: string
  homeVideoUrl?: string
  depoimentoVideoUrl?: string
  testimonialImages: [string, string, string]
}

export type NavLabels = {
  home: string
  comoFunciona: string
  porQue: string
  aLibra: string
  parceiros: string
  blog: string
}

export type SiteContent = {
  versao: number
  atualizadoEm: string
  seo: { title: string; description: string }
  cta: { simular: string; whatsapp: string; contato: string }
  nav: NavLabels
  midias: SiteMedia
  videos: { homeYoutubeOrUrl: string; depoimentoYoutubeOrUrl: string }
  politicas: {
    privacidadeTexto: string
    cookiesTexto: string
  }
  paginas: {
    home: Record<string, string>
    comoFunciona: Record<string, string>
    porQue: Record<string, string>
    aLibra: Record<string, string>
    parceiros: Record<string, string>
    blog: Record<string, string>
  }
  depoimentos: Array<{ name: string; location: string; quote: string; image: string }>
}

export type AdminSession = {
  token: string
  nome: string
  email: string
  expiresAt?: string
} | null

export type AdminConfig = {
  /** future API base; empty = local only */
  apiBaseUrl: string
}
