import {
  ABOUT_IMAGE,
  HERO_IMAGE,
  HERO_VIDEO,
  SOBRE_IMAGE,
  TESTIMONIALS,
  USECASE_IMAGE,
} from '@/content/home'
import type { SiteContent } from '@/features/admin/types'

/** Textos padrão da Home — todos editáveis no admin. */
export const HOME_DEFAULTS: Record<string, string> = {
  heroEyebrow: 'Crédito com garantia de imóvel',
  heroTitleLine1: 'Equilíbrio que te',
  heroTitleLine2: 'leva',
  heroTitleEm: 'mais longe',
  heroLead:
    'Use o seu imóvel como garantia e pegue um crédito justo de verdade, a partir de 1,19% ao mês + IPCA, em até 180 meses.',
  ctaSimular: 'Simular meu crédito',
  ctaComo: 'Ver como funciona',
  trust1: '100% online',
  trust2: 'Resposta rápida',
  trust3: 'Sem pagar nada adiantado',
  chipTaxaLabel: 'Taxa a partir de',
  chipTaxaValue: '1,19% a.m. + IPCA',
  chipPrazoLabel: 'Prazo de até',
  chipPrazoValue: '180 meses',

  videoEyebrow: 'Assista',
  videoTitleBefore: 'A Libra,',
  videoTitleEm: 'em movimento',

  usecaseEyebrow: 'Para que serve',
  usecaseTitle1: 'Respiro',
  usecaseTitle2: 'para colocar',
  usecaseTitle3: 'a vida no lugar.',
  usecaseLead:
    'Home Equity é o crédito mais barato que existe e o que você faz com ele é só seu.',
  use1Title: 'Sair das dívidas caras',
  use1Text:
    'Troque o rotativo do cartão e o cheque especial por uma parcela só, que cabe no seu mês.',
  use2Title: 'Reformar ou construir',
  use2Text: 'Aquele projeto da casa que vive sendo adiado? Chegou a hora de tirar do papel.',
  use3Title: 'Investir no negócio',
  use3Text:
    'Capital de giro, expansão, equipamento novo. O empurrão que a sua empresa precisava.',
  use4Title: 'Realizar um plano',
  use4Text:
    'Estudo, saúde, uma virada de vida. Fôlego para investir no que importa de verdade.',

  howEyebrow: 'Como funciona',
  howTitle: 'Simples do começo ao fim.',
  how1Title: 'Faça uma simulação',
  how1Text: 'Alguns dados e, em minutos, você vê uma proposta com parcela que cabe no bolso.',
  how2Title: 'Atendimento do seu jeito',
  how2Text:
    'Prefere resolver no automático, rapidinho, ou falar com uma pessoa de verdade? Você escolhe e pode trocar quando quiser.',
  how3Title: 'A gente avalia o imóvel',
  how3Text: 'Analisamos a documentação e o valor do seu imóvel com cuidado e segurança.',
  how4Title: 'Dinheiro na conta',
  how4Text: 'Contrato assinado, crédito liberado. Aí é só respirar aliviado.',

  whyEyebrow: 'Por que faz sentido',
  whyTitle: 'A conta que muda tudo.',
  whyBadLabel: 'Rotativo do cartão',
  whyBadValue: '13,9%',
  whyBadUnit: 'ao mês, e não para de subir',
  whyGoodLabel: 'Aqui na Libra, a partir de',
  whyGoodValue: '1,19%',
  whyGoodUnit: 'ao mês + IPCA, com o imóvel como garantia',
  whyMeta1Value: '180',
  whyMeta1Label: 'meses para pagar',
  whyMeta2Value: '50%',
  whyMeta2Label: 'do valor do imóvel',
  whyNote:
    'Colocar o imóvel como garantia é o que permite juros lá embaixo. Menos peso todo mês, mais tempo para respirar.',

  manifestoEyebrow: 'O nosso jeito',
  manifestoTitle: 'Crédito não precisa ser um peso. Precisa ser justo.',
  manifestoLead:
    'Por isso a gente coloca tudo na balança: as suas necessidades de um lado, as melhores condições do outro. Equilíbrio, afinal, é o nosso nome.',

  storiesEyebrow: 'Histórias de verdade',
  storiesTitle: 'Quem já respirou aliviado.',
  depoEyebrow: 'Depoimento em vídeo',
  depoTitleBefore: 'Aperte o play: uma reforma',
  depoTitleEm: 'destravada',
  depoLead:
    'Uma cliente da Libra mostrando, cômodo por cômodo, o que o crédito com garantia de imóvel tornou possível — do jeito dela, sem roteiro.',
  depoChip1: '2 min de história',
  depoChip2: 'Com legendas',

  brEyebrow: 'De Ribeirão Preto para o país inteiro',
  brTitleBefore: 'A gente atende',
  brTitleEm: 'todo o Brasil',
  brLead:
    'Seu imóvel pode estar em qualquer canto do mapa: o processo é 100% online, da simulação à assinatura. E quando você precisar de gente, tem gente — nosso time acompanha cada etapa de perto, onde quer que você esteja.',
  brChip1Title: '26 estados + DF',
  brChip1Text: 'cobertura nacional',
  brChip2Title: '100% online',
  brChip2Text: 'da simulação à assinatura',
  brChip3Title: 'Gente de verdade',
  brChip3Text: 'te acompanhando sempre',
  brLegend:
    'em dourado, capitais em destaque — o pulso maior é a nossa casa: Ribeirão Preto',

  aboutEyebrow: 'A Libra',
  aboutTitle: 'Uma fintech que acredita em crédito consciente.',
  aboutLead:
    'Nascemos em Ribeirão Preto, dentro do Grupo Stéfani, que nasceu a mais de 40 anos construindo casas e histórias. A gente conhece o valor de um imóvel porque ajuda a levantar um. Nossa missão é simples: um crédito justo, equilibrado e consciente, que melhore de verdade a vida financeira dos brasileiros.',
  aboutStat1Value: '+40',
  aboutStat1Label: 'anos de história no Grupo Stéfani',
  aboutStat2Prefix: 'a partir de',
  aboutStat2Value: '1,19%',
  aboutStat2Label: 'ao mês + IPCA',
  aboutStat3Value: '180',
  aboutStat3Label: 'meses de prazo para pagar',
  aboutStat4Value: '100%',
  aboutStat4Label: 'online, com gente de verdade junto',

  finalEyebrow: 'Bora começar?',
  finalTitle: 'Vamos equilibrar as suas contas?',
  finalLead:
    'Faça uma simulação gratuita e sem compromisso. Em minutos você descobre quanto a sua casa pode te oferecer.',
  finalCta: 'Simular meu crédito',

  footTag:
    'Crédito com garantia de imóvel, feito com equilíbrio. Menos peso, mais fôlego para viver.',
  footColProduto: 'Produto',
  footColEmpresa: 'Empresa',
  footColContato: 'Contato',
  footLinkHome: 'Home Equity',
  footLinkSimular: 'Simular agora',
  footLinkComo: 'Como funciona',
  footLinkPorQue: 'Por que faz sentido',
  footLinkLibra: 'A Libra',
  footLinkBlog: 'Blog',
  footLinkParceiros: 'Trabalhe com a gente',
  footLinkHistorias: 'Histórias de clientes',
  footWhatsapp: 'WhatsApp',
  footEmail: 'contato@libracredito.com.br',
  footCidade: 'Ribeirão Preto/SP',
  footCopy: '© 2026 Libra Crédito · Todos os direitos reservados',
  footCnpj:
    'CNPJ 34.308.576/0001-32\nRua Eliseu Guilherme, 879, sala 01 · Jardim Sumaré · Ribeirão Preto/SP · CEP 14025-020',
  footNote:
    'A Libra Crédito é uma plataforma digital que descomplica o processo de contratação de empréstimos com garantia de imóvel. Essas operações são realizadas através de Instituições Financeiras parceiras, autorizadas pelo Banco Central do Brasil.',
}

export const NAV_DEFAULTS = {
  home: 'Home Equity',
  comoFunciona: 'Como funciona',
  porQue: 'Por que faz sentido',
  aLibra: 'A Libra',
  parceiros: 'Parceiros',
  blog: 'Blog',
}

export const COMO_DEFAULTS: Record<string, string> = {
  eyebrow: 'Como funciona',
  titleLine1: 'Do “será que dá?”',
  titleLine2: 'ao dinheiro na conta.',
  lead:
    'Um caminho simples, transparente e acompanhado por gente de verdade, sem letra miúda e sem surpresa no meio do caminho.',
  step1Title: 'Faça uma simulação',
  step1Text:
    'Você informa o valor que precisa e alguns dados do imóvel. Em minutos, mostramos uma proposta com a parcela que cabe no seu bolso, de graça e sem compromisso.',
  step2Title: 'Atendimento do seu jeito',
  step2Text:
    'Você decide como quer ser atendido: de forma automática e ágil, ou com um especialista de verdade que entende o seu momento e monta a melhor condição. Dá para alternar entre os dois a qualquer hora.',
  step3Title: 'Análise e avaliação do imóvel',
  step3Text:
    'Conferimos a documentação e avaliamos o imóvel com cuidado. É a etapa que garante segurança para você e as menores taxas do mercado.',
  step4Title: 'Assinatura e dinheiro na conta',
  step4Text:
    'Deu tudo certo, você assina o contrato digital e o crédito cai na conta. Aí é só respirar aliviado e colocar o plano em prática.',
  docsEyebrow: 'Documentos',
  docsTitle: 'O que ter em mãos para começar.',
  docsLead: 'Nada de burocracia infinita. O básico é:',
  doc1Title: 'Seus documentos',
  doc1Text: 'RG ou CNH, CPF e comprovante de renda. Simples assim para começar.',
  doc2Title: 'Do imóvel',
  doc2Text: 'Matrícula atualizada e IPTU. O imóvel precisa estar quitado ou quase.',
  doc3Title: 'Só isso',
  doc3Text: 'Nosso time te ajuda a reunir o resto, passo a passo, se faltar algo.',
  cta: 'Simular meu crédito',
}

export const PORQUE_DEFAULTS: Record<string, string> = {
  eyebrow: 'Por que faz sentido',
  titleLine1: 'O crédito mais barato',
  titleLine2: 'do mercado.',
  lead:
    'Quando o imóvel entra como garantia, o risco cai e a taxa cai junto. É por isso que o Home Equity vence qualquer outra linha de crédito.',
  cmpEyebrow: 'A conta que muda tudo',
  cmpTitle: 'Compare e veja a diferença.',
  badLabel: 'Rotativo do cartão',
  badValue: '13,9%',
  badUnit: 'ao mês e subindo',
  goodLabel: 'Aqui na Libra, a partir de',
  goodValue: '1,19%',
  goodUnit: 'ao mês + IPCA, com o imóvel como garantia',
  meta1Value: '180',
  meta1Label: 'meses para pagar',
  meta2Value: '50%',
  meta2Label: 'do valor do imóvel',
  vantEyebrow: 'Vantagens',
  vantTitle: 'Por que vale a pena?',
  v1Title: 'Juros lá embaixo',
  v1Text:
    'Taxas a partir de 1,19% ao mês + IPCA, muitas vezes menores que empréstimo pessoal, consignado ou cartão.',
  v2Title: 'Prazo que respira',
  v2Text: 'Até 180 meses para pagar. Parcelas menores, que cabem no orçamento sem sufoco.',
  v3Title: 'Use como quiser',
  v3Text:
    'Quitar dívidas, reformar, investir no negócio ou realizar um plano. O dinheiro é seu.',
  v4Title: 'Você continua na sua casa',
  v4Text:
    'O imóvel segue sendo seu e você continua morando nele normalmente durante todo o contrato.',
  cta: 'Fazer uma simulação',
}

export const ALIBRA_DEFAULTS: Record<string, string> = {
  eyebrow: 'A Libra',
  titleLine1: 'Crédito com',
  titleLine2: 'equilíbrio.',
  lead:
    'Somos uma fintech de crédito com garantia de imóvel nascida em Ribeirão Preto, com um jeito próprio de fazer as coisas: justo, transparente e do lado do cliente.',
  histEyebrow: 'Nossa história',
  histTitle: 'Gente que entende de imóvel.',
  histP1:
    'Nascemos dentro do Grupo Stéfani, que há mais de 40 anos constrói casas e histórias pelo interior de São Paulo. Essa origem faz toda a diferença: a gente conhece o valor de um imóvel porque ajuda a levantar um.',
  histP2:
    'Hoje usamos tecnologia para tornar o crédito com garantia mais simples, rápido e humano, sem abrir mão do cuidado com cada detalhe.',
  fotoFallback: 'Foto do time Libra',
  valEyebrow: 'No que a gente acredita',
  valTitle: 'Três valores que guiam tudo.',
  val1Title: 'Justiça',
  val1Text:
    'Condições honestas, sem pegadinha e sem cobrança escondida. O que a gente combina é o que você paga.',
  val2Title: 'Equilíbrio',
  val2Text:
    'Colocamos as suas necessidades e as melhores condições na balança para chegar no ponto certo para você.',
  val3Title: 'Consciência',
  val3Text:
    'Só oferecemos crédito que faz sentido e cabe no seu bolso. Seu bem-estar financeiro vem primeiro.',
  stat1Value: '+40',
  stat1Label: 'anos de história no Grupo Stéfani',
  stat2Prefix: 'a partir de',
  stat2Value: '1,19%',
  stat2Label: 'ao mês + IPCA (sujeito a análise)',
  stat3Value: '180',
  stat3Label: 'para pagar',
  stat4Value: '100%',
  stat4Label: 'online, com gente de verdade junto',
}

export const PARCEIROS_DEFAULTS: Record<string, string> = {
  eyebrow: 'Para parceiros',
  titleLine1: 'Cresça junto',
  titleLine2: 'com a Libra.',
  lead:
    'Correspondentes, imobiliárias, contadores e consultores: indique clientes de crédito com garantia de imóvel e seja remunerado por isso, com todo o suporte do nosso time.',
  heroCta: 'Quero ser parceiro',
  whyEyebrow: 'Por que ser parceiro',
  whyTitle: 'Um bom negócio para você.',
  why1Title: 'Comissão atrativa',
  why1Text:
    'Você é remunerado por cada operação fechada, com regras claras e pagamento em dia.',
  why2Title: 'Análise ágil',
  why2Text: 'Retorno rápido das propostas para você não deixar o seu cliente esperando.',
  why3Title: 'Suporte dedicado',
  why3Text: 'Um time só para te apoiar em cada etapa, do primeiro contato até a assinatura.',
  howEyebrow: 'Como funciona',
  howTitle: 'Simples para você, seguro para o cliente.',
  how1Title: 'Cadastre-se',
  how1Text: 'Preencha o formulário e nosso time entra em contato para ativar a sua parceria.',
  how2Title: 'Indique o cliente',
  how2Text: 'Envie o contato ou a documentação. A gente cuida da análise.',
  how3Title: 'Receba a comissão',
  how3Text: 'Operação fechada, você é remunerado. Acompanhe tudo com transparência.',
  formEyebrow: 'Bora começar',
  formTitle: 'Seja um parceiro Libra.',
  formLead: 'Preencha os dados e o nosso time entra em contato.',
  formCta: 'Quero ser parceiro',
  formError: 'Preencha os campos destacados para a gente conseguir falar com você.',
  modalTitle: 'Cadastro enviado!',
  modalText:
    'Recebemos os seus dados. Nossa equipe vai entrar em contato em breve para ativar a sua parceria.',
  modalCta: 'Combinado',
}

export function createDefaultSiteContent(): SiteContent {
  const now = new Date().toISOString()
  return {
    versao: 1,
    atualizadoEm: now,
    seo: {
      title: 'Libra Crédito | Crédito com garantia de imóvel',
      description:
        'Use o seu imóvel como garantia e pegue um crédito justo de verdade, a partir de 1,19% ao mês + IPCA, em até 180 meses.',
    },
    cta: {
      simular: '/simulacao',
      whatsapp: '#',
      contato: '#',
    },
    nav: { ...NAV_DEFAULTS },
    midias: {
      heroImageUrl: HERO_IMAGE,
      heroVideoUrl: HERO_VIDEO,
      usecaseImageUrl: USECASE_IMAGE,
      aboutImageUrl: ABOUT_IMAGE,
      sobreImageUrl: SOBRE_IMAGE,
      homeVideoUrl: '',
      depoimentoVideoUrl: '',
      testimonialImages: [
        TESTIMONIALS[0].image,
        TESTIMONIALS[1].image,
        TESTIMONIALS[2].image,
      ],
    },
    videos: {
      homeYoutubeOrUrl: '',
      depoimentoYoutubeOrUrl: '',
    },
    politicas: {
      privacidadeTexto: '',
      cookiesTexto: '',
    },
    paginas: {
      home: { ...HOME_DEFAULTS },
      comoFunciona: { ...COMO_DEFAULTS },
      porQue: { ...PORQUE_DEFAULTS },
      aLibra: { ...ALIBRA_DEFAULTS },
      parceiros: { ...PARCEIROS_DEFAULTS },
      blog: {
        eyebrow: 'Blog',
        titleLine1: 'Para decidir',
        titleLine2: 'com clareza.',
        lead: 'Guias diretos sobre crédito com garantia de imóvel, dívidas, patrimônio e como fazer o seu dinheiro trabalhar melhor.',
        emptyMsg: 'Nenhum post publicado ainda. Publique pelo painel Admin → Blog.',
      },
    },
    depoimentos: TESTIMONIALS.map((t) => ({
      name: t.name,
      location: t.location,
      quote: t.quote,
      image: t.image,
    })),
  }
}

/** Garante chaves novas do CMS mesmo quando a API devolve JSON antigo. */
export function mergeSiteContent(remote: SiteContent): SiteContent {
  const defaults = createDefaultSiteContent()
  const midias = { ...defaults.midias, ...remote.midias }
  /* strings vazias da API não apagam mídia padrão (ex.: hero do ciclista) */
  for (const key of Object.keys(defaults.midias) as Array<keyof typeof defaults.midias>) {
    const val = midias[key]
    if (typeof val === 'string' && !val.trim()) {
      ;(midias as Record<string, unknown>)[key] = defaults.midias[key]
    }
  }
  return {
    ...defaults,
    ...remote,
    seo: { ...defaults.seo, ...remote.seo },
    cta: { ...defaults.cta, ...remote.cta },
    nav: { ...defaults.nav, ...remote.nav },
    midias,
    videos: { ...defaults.videos, ...remote.videos },
    politicas: { ...defaults.politicas, ...remote.politicas },
    paginas: {
      home: { ...HOME_DEFAULTS, ...remote.paginas?.home },
      comoFunciona: { ...COMO_DEFAULTS, ...remote.paginas?.comoFunciona },
      porQue: { ...PORQUE_DEFAULTS, ...remote.paginas?.porQue },
      aLibra: { ...ALIBRA_DEFAULTS, ...remote.paginas?.aLibra },
      parceiros: { ...PARCEIROS_DEFAULTS, ...remote.paginas?.parceiros },
      blog: { ...defaults.paginas.blog, ...remote.paginas?.blog },
    },
    depoimentos:
      remote.depoimentos?.length > 0 ? remote.depoimentos : defaults.depoimentos,
  }
}
