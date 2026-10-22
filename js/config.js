/* Configuração do Catálogo de Processos SET */
window.CONFIG = (function () {
  const CSV_URL =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vQGWY6b7L5fAJ6NXwuapNmwXASWzXcJIhLqB4O8I0buqUf7MyF9Hoyy-QTab0p4TBd5L0TaBPSWbJ9X/pub?gid=2040784170&single=true&output=csv";

  /* Cole o CSV publicado da aba Esteira (gid numérico). Vazio = usa o arquivo local. */
  const ESTEIRA_CSV_URL = "";
  const ESTEIRA_CSV_LOCAL = "data/esteira-credito.csv";

  const ESTEIRA_ATORES = [
    { id: "Cliente", forte: "#39b54a", clara: "#e8f7ea" },
    { id: "Agente de Crédito", forte: "#0071bc", clara: "#e6f3fb" },
    { id: "Conformidade", forte: "#4fb3bf", clara: "#d4f3ef" },
    { id: "Comissão Técnica", forte: "#2db39d", clara: "#a6e7d5" },
    { id: "Comitê de Crédito", forte: "#ab5b5b", clara: "#d58b8b" },
    { id: "Caixa Econômica", forte: "#d3a61f", clara: "#ffca75" },
  ];

  const ESTEIRA_FASES = ["Cadastro", "Perfil", "Entrevista", "Documentos", "Análise", "Contrato", "Liberação", "Acompanhamento"];

  const ESTEIRA_PALETA = [
    { forte: "#39b54a", clara: "#e8f7ea" },
    { forte: "#0071bc", clara: "#e6f3fb" },
    { forte: "#4fb3bf", clara: "#d4f3ef" },
    { forte: "#2db39d", clara: "#a6e7d5" },
    { forte: "#ab5b5b", clara: "#d58b8b" },
    { forte: "#d3a61f", clara: "#ffca75" },
    { forte: "#405864", clara: "#9fd0d8" },
    { forte: "#f15a24", clara: "#fff0ea" },
    { forte: "#7fa8e6", clara: "#cae2ff" },
    { forte: "#0d9488", clara: "#e6f7f5" },
    { forte: "#8b5cf6", clara: "#ede9fe" },
    { forte: "#db2777", clara: "#fce7f3" },
  ];

  /* Legenda de cores (PDF modelo, página 1). A ordem de `match` importa. */
  const UNIDADES = [
    {
      id: "sec", sigla: "SECRETÁRIO", nome: "Secretário do Trabalho - SET",
      forte: "#ab5b5b", clara: "#d58b8b",
      match: [/SECRET[AÁ]RIO DO TRABALHO/, /^GAB/, /GABINETE/],
    },
    {
      id: "sexec_temp", sigla: "SEXEC-TEMP", nome: "Secretário Executivo de Trabalho e Empreendedorismo",
      forte: "#5aa9b4", clara: "#d3dbbe",
      match: [/SEXEC-TEMP/],
    },
    {
      id: "sexec_pgi", sigla: "SEXEC-PGI", nome: "Secretária Executiva de Planejamento e Gestão Interna",
      forte: "#d3a61f", clara: "#ffca75",
      match: [/SEXEC-PGI/, /COGERF/],
    },
    {
      id: "ascoi", sigla: "ASCOI", nome: "Assessoria de Controle Interno e Ouvidoria",
      forte: "#4fb3bf", clara: "#86d8d0",
      match: [/ASCOI/, /CONTROLE INTERNO/, /OUVIDORIA/, /CONFORMIDADE/, /COMIT[EÊ] SIC/, /LGPD/],
    },
    {
      id: "casacivil", sigla: "CASA CIVIL", nome: "Casa Civil do Governo do Estado do Ceará",
      forte: "#7fa8e6", clara: "#cae2ff",
      match: [/CASA CIVIL/],
    },
    {
      id: "ascom", sigla: "ASCOM", nome: "Assessoria de Comunicação e Marketing Digital",
      forte: "#405864", clara: "#9fd0d8",
      match: [/ASCOM/],
    },
    {
      id: "asjur", sigla: "ASJUR", nome: "Assessoria Jurídica",
      forte: "#2db39d", clara: "#a6e7d5",
      match: [/ASJUR/],
    },
    {
      id: "coafi", sigla: "COAFI", nome: "Coordenadoria Administrativo-Financeira",
      forte: "#3166ac", clara: "#a3c3f4",
      match: [/COAFI/, /CONTABILIDADE/, /ADM SETORIAL/, /SUPORTE ADM/, /^SETORIAL/],
    },
    {
      id: "codip", sigla: "CODIP", nome: "Coordenadoria de Desenvolvimento Institucional e Planejamento",
      forte: "#7e7e7e", clara: "#c6c4c3",
      match: [/CODIP/],
    },
    {
      id: "coemp", sigla: "COEMP", nome: "Coordenadoria de Empreendedorismo e Educação Profissional",
      forte: "#ff863c", clara: "#f1b08b",
      match: [/COEMP/],
    },
    {
      id: "cotra", sigla: "COTRA", nome: "Coordenadoria de Trabalho e Renda",
      forte: "#bc9964", clara: "#f4d9b4",
      match: [/COTRA/],
    },
    {
      id: "seplag", sigla: "SEPLAG", nome: "Secretaria do Planejamento e Gestão",
      forte: "#abab5c", clara: "#dfe5cb",
      match: [/SEPLAG/],
    },
    {
      id: "idt", sigla: "IDT", nome: "Instituto de Desenvolvimento do Trabalho",
      forte: "#977d7d", clara: "#cdb9b9",
      match: [/\bIDT\b/],
    },
    {
      id: "etice", sigla: "ETICE", nome: "Empresa de Tecnologia da Informação do Ceará",
      forte: "#b06134", clara: "#dba26a",
      match: [/ETICE/],
    },
    {
      id: "areas", sigla: "ÁREAS SET", nome: "Áreas demandantes e finalísticas da SET",
      forte: "#39b54a", clara: "#c9ecce",
      match: [/[-\s]SET$/, /^[ÁA]REA/, /DEMANDANTE/, /GESTOR/, /CADASTRADOR/, /VALIDADOR/, /COMIT[EÊ] QSP/, /COMISS[ÃA]O/],
    },
    {
      id: "externo", sigla: "EXTERNOS", nome: "Parceiros e atores externos",
      forte: "#a7a9ac", clara: "#ececec",
      match: [],
    },
  ];

  /* Estantes do catálogo. Primeira regra que casar com o nome do processo vence. */
  const CATEGORIAS = [
    { id: "diarias", nome: "Diárias e Passagens", icone: "plane", cor: "#0071bc",
      desc: "Viagens a serviço: diárias e passagens aéreas.",
      match: [/DI[AÁ]RIAS/, /PASSAGENS/] },
    { id: "folha", nome: "Folha e Pessoal", icone: "users", cor: "#39b54a",
      desc: "Folha de comissionados, terceirizados e encargos.",
      match: [/FOLHA/] },
    { id: "ti", nome: "Tecnologia da Informação", icone: "cpu", cor: "#405864",
      desc: "Contratações de TI com e sem o programa HTIC.",
      match: [/T\.I\b/, /HTIC/] },
    { id: "terceirizacao", nome: "Terceirização", icone: "briefcase", cor: "#bc9964",
      desc: "Licitação, prorrogação e ajustes de serviços terceirizados.",
      match: [/TERCEIRIZA/] },
    { id: "pagamentos", nome: "Pagamentos e Prestação de Contas", icone: "receipt", cor: "#3166ac",
      desc: "Pagamentos de contratos e prestação de contas de convênios.",
      match: [/PRESTA[ÇC][ÃA]O DE CONTAS/, /PAGAMENTOS/] },
    { id: "gestao", nome: "Contratos de Gestão e Convênios", icone: "handshake", cor: "#2db39d",
      desc: "Contratos de gestão, convênios, congêneres e aditivos.",
      match: [/CONTRATO DE GEST[ÃA]O/, /CONV[EÊ]NIO/, /CONG[EÊ]NERE/] },
    { id: "orcamento", nome: "Orçamento e Planejamento", icone: "calculator", cor: "#d3a61f",
      desc: "PLOA, MAPP, POA e transferências fundo a fundo.",
      match: [/PLOA/, /MAPP/, /\bPOA\b/, /FUNDO A FUNDO/, /OR[ÇC]AMENT/] },
    { id: "compras", nome: "Compras e Licitações", icone: "cart", cor: "#f15a24",
      desc: "Pregão, cotação, dispensa, inexigibilidade, atas e aditivos.",
      match: [/PREG[ÃA]O/, /COTA[ÇC][ÃA]O/, /INEXIGIBILIDADE/, /DISPENSA/, /ADES[ÃA]O/, /ADITIVO/, /APOSTILAMENTO/, /AQUISI/] },
    { id: "programas", nome: "Programas e Empreendedorismo", icone: "sprout", cor: "#ff863c",
      desc: "Ceará Sem Fome, QSP, crédito, Dinheiro na Mão e mais.",
      match: [/SEM FOME/, /QUALIFICA/, /VAI VEM/, /CR[EÉ]DITO/, /DINHEIRO NA M[ÃA]O/, /CADSOL/, /CDFIMCE/, /F[OÓ]RUM/, /EMPREEND/] },
    { id: "transparencia", nome: "Transparência e Cidadão", icone: "megaphone", cor: "#4fb3bf",
      desc: "Ouvidoria, Lei de Acesso à Informação e LGPD.",
      match: [/OUVIDORIA/, /ACESSO [ÀA] INFORMA/, /LGPD/] },
    { id: "governanca", nome: "Governança Institucional", icone: "landmark", cor: "#977d7d",
      desc: "Comitê executivo, documentos institucionais e carta de serviços.",
      match: [/COMIT[EÊ]/, /INSTITUCIONA/, /CARTA DE SERVI/] },
    { id: "transporte", nome: "Transporte", icone: "car", cor: "#7e7e7e",
      desc: "Solicitações de veículos da frota.",
      match: [/TRANSPORTE/, /FROTA/] },
    { id: "outros", nome: "Outros Processos", icone: "layers", cor: "#6d6e71",
      desc: "Processos ainda sem estante definida.",
      match: [] },
  ];

  /* Nomes amigáveis para os sistemas, por trecho da URL ou do texto */
  const SISTEMAS = [
    [/suite\.ce\.gov\.br/i, "SUÍTE"],
    [/guardiao/i, "Guardião"],
    [/diario-oficial/i, "Diário Oficial"],
    [/cearasemfome/i, "Ceará Sem Fome"],
    [/cearacredi/i, "Ceará Credi"],
    [/siafe/i, "SIAFE"],
    [/licita-web/i, "Licitaweb"],
    [/s2gpr/i, "S2GPR"],
    [/cearatransparente/i, "Ceará Transparente"],
    [/dinheironamao/i, "Dinheiro na Mão"],
    [/pncp/i, "PNCP"],
    [/sqp\.sps/i, "SQP"],
    [/spg\/parcela/i, "SPG Parcela"],
    [/sister/i, "SISTER"],
    [/spg\/siap/i, "SIAP"],
    [/limitefinanceiro/i, "Limite Financeiro"],
    [/servicos\.ce\.gov\.br/i, "Ceará Digital"],
    [/transferegov/i, "TransfereGov"],
    [/e-parcerias/i, "e-Parcerias"],
    [/idt\.org\.br\/saa/i, "IDT SAA"],
    [/idt\.org\.br/i, "IDT PSI"],
    [/siofconsulta/i, "SIOF Consulta"],
    [/planilha\.seplag/i, "Planilha SEPLAG"],
    [/folha\/pages/i, "Folha PROD"],
    [/esocial/i, "eSocial"],
    [/trabalho-e-emprego/i, "MTE"],
    [/trabalho\.ce\.gov\.br/i, "Portal SET"],
    [/sda\.ce\.gov\.br/i, "SDA Contratos"],
    [/aliancaempreendedora/i, "Tamo Junto"],
    [/172\.17\./, "Intranet"],
    [/gmail/i, "Gmail"],
  ];

  /* Siglas preservadas em maiúsculas ao formatar nomes */
  const SIGLAS = [
    "INSS", "PLOA", "MAPP", "POA", "T.I", "HTIC", "QSP", "LGPD", "CADSOL", "CDFIMCE",
    "SET", "IDT", "PAS", "CET", "DOE", "SUÍTE", "SIAFE", "MEI",
  ];

  return {
    CSV_URL, ESTEIRA_CSV_URL, ESTEIRA_CSV_LOCAL, ESTEIRA_ATORES, ESTEIRA_FASES, ESTEIRA_PALETA,
    UNIDADES, CATEGORIAS, SISTEMAS, SIGLAS,
    CACHE_KEY: "catalogo-set-cache-v1",
    ESTEIRA_CACHE_KEY: "catalogo-set-esteira-v2",
    PROGRESSO_KEY: "catalogo-set-progresso-v1",
    ESTEIRA_JOGO_KEY: "catalogo-set-esteira-jogo-v1",
  };
})();
