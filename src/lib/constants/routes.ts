export const AREA_CLIENTE_URL = 'https://clientes.libracredito.com.br'

export const ROUTES = {
  HOME: '/',
  COMO_FUNCIONA: '/como-funciona',
  POR_QUE_FAZ_SENTIDO: '/por-que-faz-sentido',
  A_LIBRA: '/a-libra',
  PARCEIROS: '/parceiros',
  BLOG: '/blog',
  BLOG_ARTICLE: '/blog/:slug',
  SIMULACAO: '/simulacao',
  POLITICA_PRIVACIDADE: '/politica-de-privacidade',
  POLITICA_COOKIES: '/politica-de-cookies',
  ADMIN: '/admin',
} as const

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES]

export function blogArticlePath(slug: string) {
  return `/blog/${slug}`
}
