import { createBrowserRouter } from 'react-router-dom'

import { RootLayout } from '@/components/layout/RootLayout'
import { ROUTES } from '@/lib/constants/routes'
import { HomePage } from '@/pages/HomePage'

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: ROUTES.HOME, element: <HomePage /> },
      {
        path: ROUTES.COMO_FUNCIONA,
        lazy: () => import('@/pages/ComoFuncionaPage').then((m) => ({ Component: m.ComoFuncionaPage })),
      },
      {
        path: ROUTES.POR_QUE_FAZ_SENTIDO,
        lazy: () =>
          import('@/pages/PorQueFazSentidoPage').then((m) => ({ Component: m.PorQueFazSentidoPage })),
      },
      {
        path: ROUTES.A_LIBRA,
        lazy: () => import('@/pages/ALibraPage').then((m) => ({ Component: m.ALibraPage })),
      },
      {
        path: ROUTES.PARCEIROS,
        lazy: () => import('@/pages/ParceirosPage').then((m) => ({ Component: m.ParceirosPage })),
      },
      {
        path: ROUTES.BLOG,
        lazy: () => import('@/pages/BlogPage').then((m) => ({ Component: m.BlogPage })),
      },
      {
        path: '/blog/:slug',
        lazy: () => import('@/pages/BlogArticlePage').then((m) => ({ Component: m.BlogArticlePage })),
      },
      {
        path: ROUTES.SIMULACAO,
        lazy: () => import('@/pages/SimulacaoPage').then((m) => ({ Component: m.SimulacaoPage })),
      },
      {
        path: ROUTES.POLITICA_PRIVACIDADE,
        lazy: () =>
          import('@/pages/PoliticaPrivacidadePage').then((m) => ({ Component: m.PoliticaPrivacidadePage })),
      },
      {
        path: ROUTES.POLITICA_COOKIES,
        lazy: () =>
          import('@/pages/PoliticaCookiesPage').then((m) => ({ Component: m.PoliticaCookiesPage })),
      },
      {
        path: ROUTES.ADMIN,
        lazy: () => import('@/pages/AdminPage').then((m) => ({ Component: m.AdminPage })),
      },
    ],
  },
])
