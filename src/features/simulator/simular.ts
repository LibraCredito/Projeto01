/**
 * Simulador de crédito com garantia.
 * A ordem dos laços e os arredondamentos seguem a especificação da API.
 * Não simplificar os passos: eles fecham o centavo.
 */

export type Amortizacao = 'PRICE' | 'SAC'

export type EntradaSimulacao = {
  vlrImovel: number
  valorSolicitado: number
  /** Taxa mensal em percentual. 1.19 significa 0.0119. */
  jurosPercentual: number
  numeroParcelas: number
  /** 0, 1, 2 ou 3. */
  carencia: number
  amortizacao: Amortizacao
  /** YYYY-MM-DD. O IOF muda com o dia. */
  dataContrato: string
  tarifaAdministracao?: number
  taxaPrestamista?: number
  taxaIofAdicional?: number
  taxaIofDiario?: number
  taxaEstruturacao?: number
  taxaSeguroDfi?: number
  tarifaEngenharia?: number
  tarifaAnaliseJuridica?: number
  valorFixoCartorio?: number
  fatorCartorio?: number
  qtdCertificados?: number
  valorUnitCertificados?: number
  qtdAntifraude?: number
  valorUnitAntifraude?: number
  qtdAssinaturas?: number
  valorUnitAssinaturas?: number
  custoCarenciaFixo?: number
}

export type Custas = {
  iof: number
  mip: number
  cartorio: number
  estruturacao: number
  engenharia: number
  juridica: number
  certificados: number
  antifraude: number
  assinaturas: number
  dfi: number
  carencia: number
  diferencaFaixa: number
}

export type LinhaSimulacao = {
  parcela: number
  saldoDevedor: number
  juros: number
  amortizacao: number
  parcelaNormal: number
  taxas: number
  parcelaFinal: number
}

export type ResultadoSimulacao = {
  saldoInicial: number
  iofFinanciado: number
  custas: Custas
  custasOperacao: number
  primeiraParcela: number
  ultimaParcela: number
  cetMensal: string
  cetAnual: string
  taxaMensal: number
  taxaAnual: number
  linhas: LinhaSimulacao[]
}

type Config = {
  tarifaAdministracao: number
  taxaPrestamista: number
  taxaIofAdicional: number
  taxaIofDiario: number
  taxaEstruturacao: number
  taxaSeguroDfi: number
  tarifaEngenharia: number
  tarifaAnaliseJuridica: number
  valorFixoCartorio: number
  fatorCartorio: number
  qtdCertificados: number
  valorUnitCertificados: number
  qtdAntifraude: number
  valorUnitAntifraude: number
  qtdAssinaturas: number
  valorUnitAssinaturas: number
  custoCarenciaFixo: number
}

const FAIXAS_CARTORIO: ReadonlyArray<readonly [number, number, number]> = [
  [0.01, 2306, 260.39],
  [2306.01, 5761, 417.83],
  [5761.01, 9603, 749.59],
  [9603.01, 19210, 1112.17],
  [19210.01, 38420, 1352.14],
  [38420.01, 115260, 1507.9],
  [115260.01, 192100, 1924.63],
  [192100.01, 230520, 2340.51],
  [230520.01, 268940, 2548.04],
  [268940.01, 307360, 2756.74],
  [307360.01, 345780, 2906.16],
  [345780.01, 384200, 2981.91],
  [384200.01, 768400, 3324.85],
  [768400.01, 1152600, 3893.73],
  [1152600.01, 1536800, 4482.62],
  [1536800.01, 1921000, 5071.57],
  [1921000.01, 2305200, 5376.06],
  [2305200.01, 3842000, 6898.44],
  [3842000.01, 5763000, 9638.72],
  [5763000.01, 7684000, 12683.48],
  [7684000.01, 9605000, 15728.24],
  [9605000.01, 11526000, 18773],
  [11526000.01, 13447000, 21817.76],
  [13447000.01, 15368000, 24862.51],
  [15368000.01, 17289000, 27907.28],
  [17289000.01, 19210000, 30952.04],
  [19210000.01, 23052000, 35519.18],
  [23052000.01, 26894000, 41608.7],
  [26894000.01, 30736000, 47698.24],
  [30736000.01, 34578000, 53787.77],
  [34578000.01, 38420000, 59877.3],
  [38420000.01, 42262000, 65966.81],
  [42262000.01, 46104000, 72056.34],
  [46104000.01, 49946000, 78145.85],
  [49946000.01, 53788000, 84235.38],
  [53788000.01, 57630000, 90324.9],
  [57630000.01, 65314000, 99459.19],
  [65314000.01, 72998000, 111638.23],
  [72998000.01, 80682000, 123817.29],
  [80682000.01, 88366000, 135996.33],
  [88366000.01, 96050000, 148175.38],
  [96050000.01, 103734000, 160354.41],
  [103734000.01, 111418000, 172533.47],
  [111418000.01, 119102000, 184712.51],
  [119102000.01, 126786000, 196891.55],
  [126786000.01, 134470000, 209070.61],
  [134470000.01, 142154000, 221249.65],
  [142154000.01, 999999999, 234138.12],
]

/** round do Python 3: half-to-even. */
export function roundHalfEven(value: number, digits: number): number {
  if (!Number.isFinite(value)) return value
  const sign = value < 0 ? -1 : 1
  const factor = 10 ** digits
  const scaled = Math.abs(value) * factor
  const base = Math.floor(scaled)
  const frac = scaled - base
  let whole: number
  if (Math.abs(frac - 0.5) <= 1e-8) {
    whole = base % 2 === 0 ? base : base + 1
  } else {
    whole = frac > 0.5 ? base + 1 : base
  }
  return (sign * whole) / factor
}

export function round4(value: number): number {
  return roundHalfEven(value, 4)
}

export function round2(value: number): number {
  return roundHalfEven(value, 2)
}

/** ARRED do Excel: half away from zero. */
export function excelRound2(value: number): number {
  const sign = value < 0 ? -1 : 1
  const scaled = Math.abs(value) * 100
  const base = Math.floor(scaled + 1e-8)
  const frac = scaled - base
  const whole = frac >= 0.5 - 1e-8 ? base + 1 : base
  return (sign * whole) / 100
}

/** Corta para 2 casas em direção a zero. */
export function trunc2(value: number): number {
  const sign = value < 0 ? -1 : 1
  return (sign * Math.floor(Math.abs(value) * 100 + 1e-8)) / 100
}

function configDe(entrada: EntradaSimulacao): Config {
  return {
    tarifaAdministracao: entrada.tarifaAdministracao ?? 40,
    taxaPrestamista: entrada.taxaPrestamista ?? 0.00035,
    taxaIofAdicional: entrada.taxaIofAdicional ?? 0.0038,
    taxaIofDiario: entrada.taxaIofDiario ?? 0.000082,
    taxaEstruturacao: entrada.taxaEstruturacao ?? 0.06,
    taxaSeguroDfi: entrada.taxaSeguroDfi ?? 0.00014,
    tarifaEngenharia: entrada.tarifaEngenharia ?? 480,
    tarifaAnaliseJuridica: entrada.tarifaAnaliseJuridica ?? 100,
    valorFixoCartorio: entrada.valorFixoCartorio ?? 295.9,
    fatorCartorio: entrada.fatorCartorio ?? 1.11,
    qtdCertificados: entrada.qtdCertificados ?? 1,
    valorUnitCertificados: entrada.valorUnitCertificados ?? 82.3,
    qtdAntifraude: entrada.qtdAntifraude ?? 1,
    valorUnitAntifraude: entrada.valorUnitAntifraude ?? 90,
    qtdAssinaturas: entrada.qtdAssinaturas ?? 1,
    valorUnitAssinaturas: entrada.valorUnitAssinaturas ?? 3.9,
    custoCarenciaFixo: entrada.custoCarenciaFixo ?? 0,
  }
}

function custasDaFaixa(valor: number): number {
  for (const [minimo, maximo, custas] of FAIXAS_CARTORIO) {
    if (valor > minimo && valor < maximo) return custas
  }
  return 0
}

function parseData(iso: string): Date {
  const [ano, mes, dia] = iso.split('-').map(Number)
  return new Date(Date.UTC(ano, mes - 1, dia))
}

function addMeses(data: Date, meses: number): Date {
  const ano = data.getUTCFullYear()
  const mes = data.getUTCMonth()
  const dia = data.getUTCDate()
  const alvo = new Date(Date.UTC(ano, mes + meses, 1))
  const ultimo = new Date(Date.UTC(alvo.getUTCFullYear(), alvo.getUTCMonth() + 1, 0)).getUTCDate()
  alvo.setUTCDate(Math.min(dia, ultimo))
  return alvo
}

function diasIof(dataContrato: string, parcela: number): number {
  const inicio = parseData(dataContrato)
  const vencimento = addMeses(inicio, parcela)
  const dias = Math.round((vencimento.getTime() - inicio.getTime()) / 86400000)
  return dias > 365 ? 365 : dias
}

function pgtoPrice(valor: number, taxa: number, n: number): number {
  return round4((valor * taxa) / (1 - (1 + taxa) ** -n))
}

function linhaZero(parcela: number, saldo: number): LinhaSimulacao {
  return {
    parcela,
    saldoDevedor: saldo,
    juros: 0,
    amortizacao: 0,
    parcelaNormal: 0,
    taxas: 0,
    parcelaFinal: 0,
  }
}

type Fechamento = {
  valor: number
  custasOperacao: number
  cartorio: number
  diferencaFaixa: number
  carencia: number
  dfi: number
  estruturacao: number
}

function somarBase(
  imovel: number,
  solicitado: number,
  iof: number,
  mip: number,
  cfg: Config,
): number {
  return (
    iof +
    cfg.tarifaEngenharia +
    cfg.tarifaAnaliseJuridica +
    cfg.taxaEstruturacao * solicitado +
    cfg.qtdCertificados * cfg.valorUnitCertificados +
    cfg.qtdAntifraude * cfg.valorUnitAntifraude +
    cfg.qtdAssinaturas * cfg.valorUnitAssinaturas +
    cfg.custoCarenciaFixo +
    solicitado +
    imovel * cfg.taxaSeguroDfi +
    mip
  )
}

function financiar(
  imovel: number,
  solicitado: number,
  iof: number,
  mip: number,
  cfg: Config,
): Fechamento {
  const antes = somarBase(imovel, solicitado, iof, mip, cfg)
  const faixaAntes = custasDaFaixa(antes)
  const cartorio = cfg.valorFixoCartorio + cfg.fatorCartorio * faixaAntes
  let total = antes + cartorio
  const faixaDepois = custasDaFaixa(total)
  const diferencaFaixa = faixaDepois === faixaAntes ? 0 : faixaDepois - faixaAntes
  total += diferencaFaixa
  const valor = round4(total)
  return {
    valor,
    custasOperacao: round4(valor - solicitado - iof),
    cartorio,
    diferencaFaixa,
    carencia: 0,
    dfi: imovel * cfg.taxaSeguroDfi,
    estruturacao: cfg.taxaEstruturacao * solicitado,
  }
}

function iofPrice(
  valor: number,
  n: number,
  taxa: number,
  dataContrato: string,
  cfg: Config,
): number {
  const pgto = pgtoPrice(valor, taxa, n)
  let saldo = valor
  let diario = 0
  for (let k = 1; k <= n; k++) {
    const juros = round4(saldo * taxa)
    const amort = pgto - juros
    saldo = round4(saldo - amort)
    diario += trunc2(diasIof(dataContrato, k) * amort * cfg.taxaIofDiario)
  }
  return diario + cfg.taxaIofAdicional * valor
}

function iofSac(
  valor: number,
  carencia: number,
  n: number,
  taxa: number,
  dataContrato: string,
  cfg: Config,
): number {
  const saldoPosCarencia = valor * (1 + taxa) ** carencia
  const amortFixa = saldoPosCarencia / n
  let saldo = valor
  let diario = 0
  const meses = n + carencia
  for (let mes = 1; mes <= meses; mes++) {
    let amort = 0
    if (mes <= carencia) {
      const j = round4(saldo * taxa)
      saldo = saldo + j
    } else {
      amort = amortFixa
      saldo = saldo - amortFixa
    }
    diario += diasIof(dataContrato, mes) * amort * cfg.taxaIofDiario
  }
  const adicional = cfg.taxaIofAdicional * valor
  const coef = (diario + adicional) / valor
  const iof = (valor / (1 - coef)) * coef
  return trunc2(excelRound2(iof))
}

function iofPriceCarencia(
  valor: number,
  carencia: number,
  n: number,
  taxa: number,
  dataContrato: string,
  cfg: Config,
): number {
  const pgtoBase = valor * (1 + taxa) ** carencia
  const pgto = pgtoPrice(pgtoBase, taxa, n)
  let saldo = valor
  let diario = 0
  const meses = n + carencia
  for (let mes = 1; mes <= meses; mes++) {
    let amort = 0
    if (mes <= carencia) {
      const j = round4(saldo * taxa)
      saldo += j
    } else {
      const j = round4(saldo * taxa)
      amort = pgto - j
      saldo = saldo - amort
    }
    diario += trunc2(diasIof(dataContrato, mes) * amort * cfg.taxaIofDiario)
  }
  const adicional = cfg.taxaIofAdicional * valor
  const coef = (diario + adicional) / valor
  return (valor / (1 - coef)) * coef
}

function dfiDe(imovel: number, cfg: Config): number {
  return imovel * cfg.taxaSeguroDfi
}

function custasCarencia(meses: number, valor: number, taxa: number, imovel: number, cfg: Config): number {
  const dfi = dfiDe(imovel, cfg)
  if (meses === 1) {
    const prest = excelRound2(round4(valor * cfg.taxaPrestamista))
    return prest + cfg.tarifaAdministracao + dfi
  }
  let custas = 0
  let variado = valor
  let atual = valor
  for (let volta = 0; volta < meses; volta++) {
    const prest = excelRound2(round4(variado * cfg.taxaPrestamista))
    variado = atual * (1 + taxa)
    custas += prest + cfg.tarifaAdministracao + dfi
    atual = atual + prest + dfi + cfg.tarifaAdministracao
  }
  return custas
}

function financiarCarencia(
  imovel: number,
  solicitado: number,
  iof: number,
  mip: number,
  carencia: number,
  taxa: number,
  incluirCustasCarencia: boolean,
  cfg: Config,
): Fechamento {
  const antes = somarBase(imovel, solicitado, iof, mip, cfg)
  const faixaAntes = custasDaFaixa(antes)
  const cartorio = cfg.valorFixoCartorio + cfg.fatorCartorio * faixaAntes
  const baseComCartorio = antes + cartorio
  let custasDeCarencia = 0
  if (incluirCustasCarencia) {
    for (let volta = 0; volta < 4; volta++) {
      const valorIteracao = baseComCartorio + custasDeCarencia
      custasDeCarencia = custasCarencia(carencia, valorIteracao, taxa, imovel, cfg)
    }
  }
  let saldo = baseComCartorio + custasDeCarencia
  const faixaDepois = custasDaFaixa(antes)
  const diferencaFaixa = faixaDepois === faixaAntes ? 0 : faixaDepois - faixaAntes
  saldo += diferencaFaixa
  saldo = round4(saldo)
  return {
    valor: saldo,
    custasOperacao: saldo - solicitado - iof,
    cartorio,
    diferencaFaixa,
    carencia: custasDeCarencia,
    dfi: imovel * cfg.taxaSeguroDfi,
    estruturacao: cfg.taxaEstruturacao * solicitado,
  }
}

function taxasDaLinha(saldo: number, imovel: number, cfg: Config): number {
  const prestamista = round4(saldo * cfg.taxaPrestamista)
  return prestamista + cfg.tarifaAdministracao + dfiDe(imovel, cfg)
}

function tabelaPrice(
  saldoInicial: number,
  n: number,
  taxa: number,
  imovel: number,
  cfg: Config,
): LinhaSimulacao[] {
  const linhas: LinhaSimulacao[] = [linhaZero(0, saldoInicial)]
  const pgto = pgtoPrice(saldoInicial, taxa, n)
  let saldo = saldoInicial
  for (let k = 1; k <= n; k++) {
    const juros = round4(saldo * taxa)
    const amort = pgto - juros
    const taxas = taxasDaLinha(saldo, imovel, cfg)
    saldo = round4(saldo - amort)
    linhas.push({
      parcela: k,
      saldoDevedor: saldo,
      juros,
      amortizacao: amort,
      parcelaNormal: pgto,
      taxas,
      parcelaFinal: pgto + taxas,
    })
  }
  return linhas
}

function tabelaSac(
  saldoInicial: number,
  n: number,
  taxa: number,
  imovel: number,
  cfg: Config,
): LinhaSimulacao[] {
  const amortFixa = saldoInicial / n
  const linhas: LinhaSimulacao[] = [linhaZero(0, saldoInicial)]
  let saldo = saldoInicial
  for (let k = 1; k <= n; k++) {
    const juros = round4(saldo * taxa)
    const taxas = taxasDaLinha(saldo, imovel, cfg)
    const parcelaNormal = juros + amortFixa
    saldo = round4(saldo - amortFixa)
    linhas.push({
      parcela: k,
      saldoDevedor: saldo,
      juros,
      amortizacao: amortFixa,
      parcelaNormal,
      taxas,
      parcelaFinal: parcelaNormal + taxas,
    })
  }
  return linhas
}

function capitalizarSemRound(saldo: number, vezes: number, taxa: number): number {
  let atual = saldo
  for (let i = 0; i < vezes; i++) atual = atual + atual * taxa
  return atual
}

function tabelaPriceCarencia(
  saldoInicial: number,
  carencia: number,
  n: number,
  taxa: number,
  imovel: number,
  cfg: Config,
): LinhaSimulacao[] {
  const saldoPmt = capitalizarSemRound(saldoInicial, carencia, taxa)
  const pgto = pgtoPrice(saldoPmt, taxa, n)
  let saldo = saldoInicial
  let juroAnterior = 0
  const linhas: LinhaSimulacao[] = []
  const fim = n + carencia + 1
  for (let idx = 0; idx < fim; idx++) {
    if (idx <= carencia) {
      linhas.push(idx === 0 ? linhaZero(0, saldo) : {
        parcela: idx,
        saldoDevedor: saldo,
        juros: juroAnterior,
        amortizacao: 0,
        parcelaNormal: 0,
        taxas: 0,
        parcelaFinal: 0,
      })
      juroAnterior = round4(saldo * taxa)
      saldo += juroAnterior
    } else {
      if (idx === carencia + 1) saldo -= juroAnterior
      const juros = round4(saldo * taxa)
      const amort = pgto - juros
      const taxas = taxasDaLinha(saldo, imovel, cfg)
      saldo = round4(saldo - amort)
      linhas.push({
        parcela: idx,
        saldoDevedor: saldo,
        juros,
        amortizacao: amort,
        parcelaNormal: pgto,
        taxas,
        parcelaFinal: pgto + taxas,
      })
    }
  }
  return linhas
}

function tabelaSacCarencia(
  saldoInicial: number,
  carencia: number,
  n: number,
  taxa: number,
  imovel: number,
  cfg: Config,
): LinhaSimulacao[] {
  const amortFixa = capitalizarSemRound(saldoInicial, carencia, taxa) / n
  let saldo = saldoInicial
  let juroAnterior = 0
  const linhas: LinhaSimulacao[] = []
  const fim = n + carencia
  for (let idx = 0; idx < fim; idx++) {
    if (idx < carencia) {
      linhas.push(idx === 0 ? linhaZero(0, saldo) : {
        parcela: idx,
        saldoDevedor: saldo,
        juros: juroAnterior,
        amortizacao: 0,
        parcelaNormal: 0,
        taxas: 0,
        parcelaFinal: 0,
      })
      juroAnterior = round4(saldo * taxa)
      saldo = round4(saldo + juroAnterior)
    } else {
      const juros = round4(saldo * taxa)
      const taxas = taxasDaLinha(saldo, imovel, cfg)
      const parcelaNormal = juros + amortFixa
      saldo = round4(saldo - amortFixa)
      linhas.push({
        parcela: idx,
        saldoDevedor: saldo,
        juros,
        amortizacao: amortFixa,
        parcelaNormal,
        taxas,
        parcelaFinal: parcelaNormal + taxas,
      })
    }
  }
  return linhas
}

function cetDe(saldoInicial: number, carencia: number, linhas: LinhaSimulacao[]): { cetMensal: string; cetAnual: string } {
  const cobradas = linhas.filter((linha) => linha.parcela > 0 && linha.parcelaFinal !== 0).map((linha) => linha.parcelaFinal)
  const zeros = Array.from({ length: carencia }, () => 0)
  const fluxo = [-saldoInicial, ...zeros, ...cobradas]
  let tir = 0.1
  for (let volta = 0; volta < 1000; volta++) {
    let vpl = 0
    let derivada = 0
    for (let j = 0; j < fluxo.length; j++) {
      vpl += fluxo[j] / (1 + tir) ** j
      derivada += (-j * fluxo[j]) / (1 + tir) ** (j + 1)
    }
    const delta = vpl / derivada
    tir -= delta
    if (Math.abs(delta) < 0.00001) break
  }
  const cetAnual = (1 + tir) ** 12 - 1
  return {
    cetMensal: (tir * 100).toFixed(2),
    cetAnual: (cetAnual * 100).toFixed(2),
  }
}

function parcelasCobradas(linhas: LinhaSimulacao[]): LinhaSimulacao[] {
  return linhas.filter((linha) => linha.parcelaFinal !== 0)
}

function montarCustas(iof: number, mip: number, fechamento: Fechamento, cfg: Config): Custas {
  return {
    iof,
    mip,
    cartorio: fechamento.cartorio,
    estruturacao: fechamento.estruturacao,
    engenharia: cfg.tarifaEngenharia,
    juridica: cfg.tarifaAnaliseJuridica,
    certificados: cfg.qtdCertificados * cfg.valorUnitCertificados,
    antifraude: cfg.qtdAntifraude * cfg.valorUnitAntifraude,
    assinaturas: cfg.qtdAssinaturas * cfg.valorUnitAssinaturas,
    dfi: fechamento.dfi,
    carencia: fechamento.carencia,
    diferencaFaixa: fechamento.diferencaFaixa,
  }
}

function resultado(
  saldo: number,
  iof: number,
  mip: number,
  fechamento: Fechamento,
  linhas: LinhaSimulacao[],
  carencia: number,
  taxa: number,
  jurosPercentual: number,
  cfg: Config,
): ResultadoSimulacao {
  const cobradas = parcelasCobradas(linhas)
  const cet = cetDe(round2(saldo), carencia, linhas)
  return {
    saldoInicial: round2(saldo),
    iofFinanciado: iof,
    custas: montarCustas(iof, mip, fechamento, cfg),
    custasOperacao: fechamento.custasOperacao,
    primeiraParcela: round2(cobradas[0]?.parcelaFinal ?? 0),
    ultimaParcela: round2(cobradas[cobradas.length - 1]?.parcelaFinal ?? 0),
    cetMensal: cet.cetMensal,
    cetAnual: cet.cetAnual,
    taxaMensal: jurosPercentual,
    taxaAnual: round2(((1 + taxa) ** 12 - 1) * 100),
    linhas: linhas.map((linha) => ({
      ...linha,
      saldoDevedor: round2(linha.saldoDevedor),
      juros: round2(linha.juros),
      amortizacao: round2(linha.amortizacao),
      parcelaNormal: round2(linha.parcelaNormal),
      taxas: round2(linha.taxas),
      parcelaFinal: round2(linha.parcelaFinal),
    })),
  }
}

function simularPrice(entrada: EntradaSimulacao, cfg: Config, taxa: number): ResultadoSimulacao {
  const { vlrImovel, valorSolicitado, numeroParcelas, dataContrato } = entrada
  const base = financiar(vlrImovel, valorSolicitado, 0, 0, cfg).valor
  const x1 = iofPrice(base, numeroParcelas, taxa, dataContrato, cfg)
  const x2 = iofPrice(x1, numeroParcelas, taxa, dataContrato, cfg)
  const x3 = iofPrice(x2, numeroParcelas, taxa, dataContrato, cfg)
  const x4 = iofPrice(x3, numeroParcelas, taxa, dataContrato, cfg)
  const x5 = iofPrice(x4, numeroParcelas, taxa, dataContrato, cfg)
  const iofEstimado = iofPrice(base + x1 + x2 + x3 + x4 + x5, numeroParcelas, taxa, dataContrato, cfg)
  let mip = 0
  for (let volta = 0; volta < 4; volta++) {
    const valor = financiar(vlrImovel, valorSolicitado, iofEstimado, mip, cfg).valor
    mip = excelRound2(valor * cfg.taxaPrestamista)
  }
  const valorComMip = financiar(vlrImovel, valorSolicitado, iofEstimado, mip, cfg).valor
  const iofFinanciado = iofPrice(valorComMip, numeroParcelas, taxa, dataContrato, cfg)
  const fechamento = financiar(vlrImovel, valorSolicitado, iofFinanciado, mip, cfg)
  const linhas = tabelaPrice(fechamento.valor, numeroParcelas, taxa, vlrImovel, cfg)
  return resultado(fechamento.valor, iofFinanciado, mip, fechamento, linhas, 0, taxa, entrada.jurosPercentual, cfg)
}

function simularSac(entrada: EntradaSimulacao, cfg: Config, taxa: number): ResultadoSimulacao {
  const { vlrImovel, valorSolicitado, numeroParcelas, dataContrato } = entrada
  const base = financiar(vlrImovel, valorSolicitado, 0, 0, cfg).valor
  let iof = iofSac(base, 0, numeroParcelas, taxa, dataContrato, cfg)
  let mip = 0
  for (let volta = 0; volta < 4; volta++) {
    const valor = financiar(vlrImovel, valorSolicitado, iof, mip, cfg).valor
    mip = excelRound2(valor * cfg.taxaPrestamista)
  }
  const baseSemIof = financiar(vlrImovel, valorSolicitado, 0, mip, cfg).valor
  iof = iofSac(baseSemIof, 0, numeroParcelas, taxa, dataContrato, cfg)
  const fechamento = financiar(vlrImovel, valorSolicitado, iof, mip, cfg)
  const linhas = tabelaSac(fechamento.valor, numeroParcelas, taxa, vlrImovel, cfg)
  return resultado(fechamento.valor, iof, mip, fechamento, linhas, 0, taxa, entrada.jurosPercentual, cfg)
}

function simularPriceCarencia(entrada: EntradaSimulacao, cfg: Config, taxa: number): ResultadoSimulacao {
  const { vlrImovel, valorSolicitado, numeroParcelas, carencia, dataContrato } = entrada
  let saldoInicial = financiarCarencia(vlrImovel, valorSolicitado, 0, 0, carencia, taxa, false, cfg).valor
  let baseIof = saldoInicial
  let iof = 0
  for (let volta = 0; volta < 4; volta++) {
    iof = iofPriceCarencia(baseIof, carencia, numeroParcelas, taxa, dataContrato, cfg)
    baseIof = saldoInicial + iof
  }
  let mip = 0
  for (let volta = 0; volta < 4; volta++) {
    const valor = financiarCarencia(vlrImovel, valorSolicitado, iof, mip, carencia, taxa, false, cfg).valor
    let saldoMip = valor
    for (let mes = 0; mes < carencia; mes++) saldoMip = saldoMip + saldoMip * taxa
    mip = excelRound2(saldoMip * cfg.taxaPrestamista)
  }
  saldoInicial = financiarCarencia(vlrImovel, valorSolicitado, 0, mip, carencia, taxa, false, cfg).valor
  baseIof = saldoInicial
  for (let volta = 0; volta < 4; volta++) {
    iof = iofPriceCarencia(baseIof, carencia, numeroParcelas, taxa, dataContrato, cfg)
    baseIof = saldoInicial + iof
  }
  let fechamento = financiarCarencia(vlrImovel, valorSolicitado, iof, mip, carencia, taxa, true, cfg)
  iof = iofPriceCarencia(saldoInicial + fechamento.carencia, carencia, numeroParcelas, taxa, dataContrato, cfg)
  fechamento = financiarCarencia(vlrImovel, valorSolicitado, iof, mip, carencia, taxa, true, cfg)
  const linhas = tabelaPriceCarencia(fechamento.valor, carencia, numeroParcelas, taxa, vlrImovel, cfg)
  return resultado(fechamento.valor, iof, mip, fechamento, linhas, carencia, taxa, entrada.jurosPercentual, cfg)
}

function simularSacCarencia(entrada: EntradaSimulacao, cfg: Config, taxa: number): ResultadoSimulacao {
  const { vlrImovel, valorSolicitado, numeroParcelas, carencia, dataContrato } = entrada
  let saldoInicial = financiarCarencia(vlrImovel, valorSolicitado, 0, 0, carencia, taxa, false, cfg).valor
  let iof = iofSac(saldoInicial, carencia, numeroParcelas, taxa, dataContrato, cfg)
  let mip = 0
  for (let volta = 0; volta < 4; volta++) {
    const valor = financiarCarencia(vlrImovel, valorSolicitado, iof, mip, carencia, taxa, false, cfg).valor
    let saldoMip = valor
    for (let mes = 0; mes < carencia; mes++) saldoMip = saldoMip + saldoMip * taxa
    mip = excelRound2(saldoMip * cfg.taxaPrestamista)
  }
  const base = financiarCarencia(vlrImovel, valorSolicitado, 0, mip, carencia, taxa, true, cfg).valor
  iof = iofSac(base, carencia, numeroParcelas, taxa, dataContrato, cfg)
  const fechamento = financiarCarencia(vlrImovel, valorSolicitado, iof, mip, carencia, taxa, true, cfg)
  const linhas = tabelaSacCarencia(fechamento.valor, carencia, numeroParcelas, taxa, vlrImovel, cfg)
  return resultado(fechamento.valor, iof, mip, fechamento, linhas, carencia, taxa, entrada.jurosPercentual, cfg)
}

export function simular(entrada: EntradaSimulacao): ResultadoSimulacao {
  if (entrada.carencia < 0 || entrada.carencia > 3) {
    throw new Error('Carência fora do escopo. Use 0, 1, 2 ou 3.')
  }
  const cfg = configDe(entrada)
  const taxa = entrada.jurosPercentual / 100
  if (entrada.amortizacao === 'PRICE' && entrada.carencia === 0) return simularPrice(entrada, cfg, taxa)
  if (entrada.amortizacao === 'SAC' && entrada.carencia === 0) return simularSac(entrada, cfg, taxa)
  if (entrada.amortizacao === 'PRICE') return simularPriceCarencia(entrada, cfg, taxa)
  return simularSacCarencia(entrada, cfg, taxa)
}
