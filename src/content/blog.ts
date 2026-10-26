import type { ReactNode } from 'react'

export type BlogBlock =
  | { type: 'p'; text: string; html?: boolean }
  | { type: 'h2'; text: string }
  | { type: 'ul'; items: string[] }

export type BlogArticle = {
  slug: string
  title: string
  category: string
  summary: string
  subtitle: string
  readTime: string
  visible: boolean
  body: BlogBlock[]
}

export const BLOG_CATEGORIES = [
  'Todos',
  'Guia',
  'Dívidas',
  'Segurança',
  'Negócios',
  'Casa',
  'Educação',
] as const

export const BLOG_ARTICLES: BlogArticle[] = [
  {
    slug: 'home-equity-ou-emprestimo-pessoal',
    title: 'Home equity ou empréstimo pessoal: qual escolher?',
    category: 'Guia',
    summary:
      'Comparamos prazos, juros e garantias para você decidir com segurança.',
    subtitle:
      'Os dois colocam dinheiro na sua conta. A diferença está em quanto isso vai te custar — e por quanto tempo.',
    readTime: 'Leitura de 4 min',
    visible: true,
    body: [
      {
        type: 'p',
        text: 'Na hora do aperto ou de um plano grande, o empréstimo pessoal costuma ser a primeira lembrança: é rápido e não pede garantia. Só que essa praticidade tem preço — juros que facilmente passam de 5%, 6% ao mês, prazos curtos e valores limitados.',
      },
      {
        type: 'p',
        text: 'O home equity (crédito com garantia de imóvel) funciona ao contrário: você oferece um imóvel quitado como garantia e, por isso, o banco corre menos risco. Menos risco significa juros muito menores — na Libra, a partir de 1,19% ao mês + IPCA —, prazos de até 180 meses e valores bem maiores.',
      },
      { type: 'h2', text: 'Quando o pessoal faz sentido' },
      {
        type: 'p',
        text: 'Para valores pequenos e urgentes — alguns milhares de reais que você consegue quitar em poucos meses — o empréstimo pessoal pode resolver sem burocracia. A conta fecha porque o prazo é curto.',
      },
      { type: 'h2', text: 'Quando o home equity ganha de lavada' },
      {
        type: 'p',
        text: 'Para valores maiores — quitar várias dívidas, reformar, investir num negócio — a diferença de juros muda tudo. Em um empréstimo de R$ 100 mil, alguns pontos percentuais ao mês representam dezenas de milhares de reais ao longo do contrato.',
      },
      {
        type: 'p',
        text: 'A regra de bolso: <strong>valor pequeno e prazo curto, pessoal; valor grande e fôlego longo, home equity.</strong> E lembre: você continua morando no seu imóvel normalmente durante todo o contrato.',
        html: true,
      },
    ],
  },
  {
    slug: 'usar-imovel-pra-quitar-dividas',
    title: 'Como usar o imóvel para quitar dívidas caras',
    category: 'Dívidas',
    summary:
      'O passo a passo para trocar cartão e cheque especial por uma parcela só.',
    subtitle:
      'Cartão, cheque especial, parcelados… Dá para trocar tudo isso por uma parcela só — e muito menor.',
    readTime: 'Leitura de 4 min',
    visible: true,
    body: [
      {
        type: 'p',
        text: 'O rotativo do cartão pode passar de 13% ao mês. O cheque especial não fica muito atrás. Quando várias dívidas dessas se acumulam, o salário entra e já sai — e a sensação é de enxugar gelo.',
      },
      {
        type: 'p',
        text: 'A estratégia tem nome: <strong>consolidação de dívidas</strong>. Você pega um crédito único, com juro lá embaixo, e quita todas as dívidas caras de uma vez. No lugar de cinco boletos impossíveis, fica uma parcela só, que cabe no seu mês.',
        html: true,
      },
      { type: 'h2', text: 'O passo a passo' },
      {
        type: 'ul',
        items: [
          '<strong>Liste tudo:</strong> saldo devedor, juros e parcela de cada dívida. Sem esse raio-x, não dá para decidir.',
          '<strong>Simule o home equity:</strong> veja quanto ficaria a parcela única usando seu imóvel como garantia.',
          '<strong>Compare o total:</strong> quase sempre a economia é de dezenas de milhares de reais.',
          '<strong>Quite e respire:</strong> com o crédito liberado, elimine as dívidas caras imediatamente — e não volte para o rotativo.',
        ],
      },
      { type: 'h2', text: 'O cuidado essencial' },
      {
        type: 'p',
        text: 'Consolidar só funciona se vier junto com organização: a parcela nova precisa caber com folga no orçamento. É exatamente por isso que na Libra a gente só aprova o que faz sentido para o seu bolso — crédito consciente é isso.',
      },
    ],
  },
  {
    slug: '5-perguntas-antes-de-dar-imovel-em-garantia',
    title: '5 perguntas antes de dar seu imóvel em garantia',
    category: 'Segurança',
    summary:
      'O que checar para tomar crédito com tranquilidade e sem arrependimento.',
    subtitle:
      'É uma decisão grande — e tomada com informação, é uma das mais inteligentes que existem.',
    readTime: 'Leitura de 4 min',
    visible: true,
    body: [
      {
        type: 'p',
        text: 'Colocar o imóvel como garantia assusta muita gente. Mas o medo costuma vir da falta de informação, não do risco em si. Antes de assinar, faça estas cinco perguntas:',
      },
      { type: 'h2', text: '1. A parcela cabe no meu orçamento com folga?' },
      {
        type: 'p',
        text: 'Essa é a única pergunta capaz de gerar problema lá na frente. Se a resposta for “sim, com folga”, o resto é tranquilidade.',
      },
      { type: 'h2', text: '2. Eu continuo morando no imóvel?' },
      {
        type: 'p',
        text: 'Sim. A garantia (alienação fiduciária) não muda nada no seu dia a dia. A casa segue sua, seu endereço segue o mesmo.',
      },
      { type: 'h2', text: '3. A instituição é séria?' },
      {
        type: 'p',
        text: 'Verifique se as operações são feitas com instituições autorizadas pelo Banco Central e desconfie de qualquer pedido de pagamento adiantado — instituição séria não cobra para aprovar crédito.',
      },
      { type: 'h2', text: '4. Quais são todos os custos?' },
      {
        type: 'p',
        text: 'Além da taxa de juros, existem custos de avaliação e cartório. Peça o CET (Custo Efetivo Total) — ele mostra o valor real da operação, sem surpresa.',
      },
      { type: 'h2', text: '5. Para que exatamente vou usar o dinheiro?' },
      {
        type: 'p',
        text: 'Crédito barato com propósito claro constrói patrimônio. Sem propósito, vira dívida como outra qualquer. Defina o destino antes de contratar.',
      },
    ],
  },
  {
    slug: 'capital-de-giro-combustivel-do-negocio',
    title: 'Capital de giro: o combustível do seu negócio',
    category: 'Negócios',
    summary:
      'Quando faz sentido usar o imóvel para destravar o crescimento da empresa.',
    subtitle:
      'Quando faz sentido usar o imóvel para destravar o crescimento da empresa — e quando não faz.',
    readTime: 'Leitura de 4 min',
    visible: true,
    body: [
      {
        type: 'p',
        text: 'Todo negócio conhece a cena: as vendas vão bem, mas o caixa aperta. Fornecedor para pagar hoje, cliente que só paga em 60 dias. Capital de giro é exatamente essa ponte — e a forma de financiá-la define a saúde da empresa.',
      },
      { type: 'h2', text: 'O problema das linhas tradicionais' },
      {
        type: 'p',
        text: 'Crédito PJ sem garantia é caro e curto. Antecipação de recebíveis come a margem. Cheque especial empresarial, nem se fala. O empresário acaba pagando juros altos justamente no momento em que mais precisa de fôlego.',
      },
      { type: 'h2', text: 'A alternativa do home equity' },
      {
        type: 'p',
        text: 'Usando um imóvel (seu ou da empresa) como garantia, você acessa valores maiores, prazos de até 180 meses e juros a partir de 1,19% ao mês + IPCA. Na prática: parcela pequena, previsível, que não sufoca o caixa.',
      },
      { type: 'h2', text: 'Quando faz sentido' },
      {
        type: 'ul',
        items: [
          'Expandir: novo ponto, equipamento, estoque para alta temporada.',
          'Reorganizar: trocar dívidas caras do negócio por uma só, mais barata.',
          'Investir com retorno claro: quando o ganho esperado supera com folga o custo do crédito.',
        ],
      },
      {
        type: 'p',
        text: 'E quando não faz? Para cobrir prejuízo recorrente sem plano de ajuste. Crédito é combustível — não conserta o motor.',
      },
    ],
  },
  {
    slug: 'reforma-planeje-o-credito',
    title: 'Reforma: planeje o crédito antes de pegar o martelo',
    category: 'Casa',
    summary:
      'Como orçar a obra e escolher o valor certo, sem faltar nem sobrar.',
    subtitle:
      'Como orçar a obra e escolher o valor certo, sem faltar no meio nem sobrar pagando juros à toa.',
    readTime: 'Leitura de 4 min',
    visible: true,
    body: [
      {
        type: 'p',
        text: 'Toda reforma começa com um sonho e uma planilha otimista. Aí a obra começa, aparece uma infiltração, o material sobe de preço… e o orçamento estoura. Planejar o crédito antes evita os dois erros clássicos: faltar dinheiro no meio ou pegar demais e pagar juros sobre o que nem usou.',
      },
      { type: 'h2', text: 'Passo 1: orçamento realista' },
      {
        type: 'p',
        text: 'Detalhe a obra com quem entende (mão de obra + material + acabamento) e adicione uma margem de segurança de 15% a 20%. Obra sem margem é obra parada.',
      },
      { type: 'h2', text: 'Passo 2: escolha a linha certa' },
      {
        type: 'p',
        text: 'Para reformas pequenas, recursos próprios ou linhas simples resolvem. Para reformas grandes — que transformam a casa e valorizam o imóvel — o home equity costuma ser imbatível: valores altos, prazo longo e a menor taxa do mercado.',
      },
      { type: 'h2', text: 'Passo 3: cronograma financeiro' },
      {
        type: 'p',
        text: 'Case o desembolso com as etapas da obra. Dinheiro parado é juro pago à toa; dinheiro faltando é obra parada. O equilíbrio é o segredo — e a gente entende de equilíbrio.',
      },
      {
        type: 'p',
        text: 'Detalhe bonito: uma boa reforma valoriza o imóvel. Ou seja, você usa o patrimônio para aumentar o próprio patrimônio.',
      },
    ],
  },
  {
    slug: 'o-que-e-ltv',
    title: 'O que é LTV e por que ele importa',
    category: 'Educação',
    summary:
      'Entenda o indicador que define quanto crédito o seu imóvel pode liberar.',
    subtitle:
      'Três letrinhas que definem quanto crédito o seu imóvel pode liberar. Entenda de uma vez.',
    readTime: 'Leitura de 4 min',
    visible: true,
    body: [
      {
        type: 'p',
        text: 'LTV vem de <em>Loan-to-Value</em> — em bom português, a relação entre o valor do empréstimo e o valor do imóvel. Se o seu imóvel vale R$ 400 mil e você pega R$ 200 mil, o LTV é de 50%.',
        html: true,
      },
      { type: 'h2', text: 'Por que existe um limite' },
      {
        type: 'p',
        text: 'No crédito com garantia de imóvel, as instituições trabalham com LTV máximo em torno de 50% a 60%. Essa folga protege os dois lados: o banco tem segurança na garantia e você nunca fica devendo mais do que o bem vale.',
      },
      { type: 'h2', text: 'O que isso significa na prática' },
      {
        type: 'ul',
        items: [
          'Imóvel de R$ 300 mil → crédito de até ~R$ 150 mil',
          'Imóvel de R$ 500 mil → crédito de até ~R$ 250 mil',
          'Imóvel de R$ 1 milhão → crédito de até ~R$ 500 mil',
        ],
      },
      {
        type: 'p',
        text: 'O valor considerado não é o que você acha que o imóvel vale, e sim o da <strong>avaliação técnica</strong> feita durante a análise — por isso ela é uma etapa tão importante do processo.',
        html: true,
      },
      { type: 'h2', text: 'LTV baixo é bom sinal' },
      {
        type: 'p',
        text: 'Quanto menor o LTV, menor o risco da operação — e melhores tendem a ser as condições. É a lógica do equilíbrio: uma operação saudável para os dois lados.',
      },
    ],
  },
]

export function getArticleBySlug(slug: string) {
  return BLOG_ARTICLES.find((a) => a.slug === slug)
}

/** Render helper type for pages that map blocks to React nodes. */
export type BlogBodyRenderer = (blocks: BlogBlock[]) => ReactNode
