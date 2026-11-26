/* Carregamento e normalização dos dados da planilha */
window.DADOS = (function () {
  const C = window.CONFIG;
  const MINUSCULAS = new Set(["de", "da", "do", "das", "dos", "e", "a", "o", "as", "os", "para", "com", "por", "na", "no", "nas", "nos", "em", "à", "ao", "aos", "às", "e/ou"]);
  const SIGLAS = new Set(C.SIGLAS);

  function limpar(v) {
    return String(v == null ? "" : v).replace(/\s+/g, " ").trim();
  }

  function formatarNome(bruto) {
    const semPrefixo = limpar(bruto).replace(/^MACROFLUXO\s+((PARA|DE|DO|DA)\s+)?/i, "");
    return semPrefixo
      .split(" ")
      .map((p, i) => {
        const up = p.toUpperCase();
        const nucleo = up.replace(/[():,–-]/g, "");
        if (SIGLAS.has(nucleo)) return up;
        const low = p.toLocaleLowerCase("pt-BR");
        if (i > 0 && MINUSCULAS.has(low)) return low;
        return low.replace(/(^|[\/(\-])(\p{L})/gu, (m, a, b) => a + b.toLocaleUpperCase("pt-BR"));
      })
      .join(" ");
  }

  function unidadeDe(responsavel) {
    const r = limpar(responsavel).toUpperCase();
    for (const u of C.UNIDADES) {
      if (u.match.some((re) => re.test(r))) return u.id;
    }
    return "externo";
  }

  function categoriaDe(nome) {
    const n = limpar(nome).toUpperCase();
    for (const c of C.CATEGORIAS) {
      if (c.match.some((re) => re.test(n))) return c.id;
    }
    return "outros";
  }

  function nomeSistema(txt) {
    for (const [re, nome] of C.SISTEMAS) if (re.test(txt)) return nome;
    try {
      return new URL(txt).hostname.replace(/^www\./, "");
    } catch (e) {
      return txt;
    }
  }

  function parseSistemas(campo) {
    const txt = limpar(campo);
    if (!txt) return [];
    const vistos = new Set();
    const lista = [];
    const urls = txt.match(/https?:\/\/[^\s,;]+/gi) || [];
    urls.forEach((u) => {
      const nome = nomeSistema(u);
      if (!vistos.has(nome)) { vistos.add(nome); lista.push({ nome, url: u }); }
    });
    const resto = txt.replace(/https?:\/\/[^\s,;]+/gi, " ").split(/\s*(?:,|;|\s+e\s+)\s*/);
    resto.map(limpar).filter((t) => t && t.length > 1).forEach((t) => {
      const nome = nomeSistema(t);
      const ehGmail = /gmail/i.test(t);
      if (!vistos.has(nome)) {
        vistos.add(nome);
        lista.push({ nome, url: ehGmail ? "https://mail.google.com/" : null });
      }
    });
    return lista;
  }

  function link(v) {
    const t = limpar(v);
    return /^https?:\/\//i.test(t) ? t : null;
  }

  function montar(linhas) {
    const processos = [];
    const porNome = new Map();
    let atual = null;
    linhas.slice(1).forEach((l) => {
      const id = limpar(l[0]);
      const nomeBruto = limpar(l[1]);
      const numero = limpar(l[2]);
      if (!id && !nomeBruto) return;
      if (!numero) {
        atual = {
          id, nomeOriginal: nomeBruto, nome: formatarNome(nomeBruto),
          categoria: categoriaDe(nomeBruto), passos: [],
        };
        processos.push(atual);
        porNome.set(nomeBruto.toUpperCase(), atual);
        return;
      }
      let proc = porNome.get(nomeBruto.toUpperCase()) || atual;
      if (!proc) return;
      const responsavel = limpar(l[4]);
      proc.passos.push({
        id,
        numero: Number(numero.replace(",", ".")) || numero,
        tipo: /extern/i.test(l[3]) ? "externa" : "interna",
        responsavel: responsavel.replace(/\s*-\s*/g, " - ").replace(/\s*\/\s*/g, "/"),
        unidade: unidadeDe(responsavel),
        descricao: limpar(l[5]),
        sistemas: parseSistemas(l[6]),
        checklist: link(l[7]),
        pop: link(l[8]),
      });
    });

    processos.forEach((p) => {
      p.passos.forEach((s, i) => (s.ordem = i + 1));
      p.unidades = [...new Set(p.passos.map((s) => s.unidade))];
      const sist = new Map();
      p.passos.forEach((s) => s.sistemas.forEach((x) => { if (!sist.has(x.nome)) sist.set(x.nome, x); }));
      p.sistemas = [...sist.values()];
      p.externos = p.passos.filter((s) => s.tipo === "externa").length;
      p.checklists = p.passos.filter((s) => s.checklist).length;
      p.pops = p.passos.filter((s) => s.pop).length;
      p.busca = [p.nome, p.nomeOriginal, ...p.passos.map((s) => `${s.responsavel} ${s.descricao} ${s.sistemas.map((x) => x.nome).join(" ")}`)]
        .join(" ").toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");
    });
    return processos;
  }

  function parseCsv(csv) {
    return Papa.parse(csv, { skipEmptyLines: true }).data;
  }

  async function buscarCsv() {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 12000);
    try {
      const resp = await fetch(C.CSV_URL + "&t=" + Date.now(), { signal: ctrl.signal, cache: "no-store" });
      if (!resp.ok) throw new Error("HTTP " + resp.status);
      const csv = await resp.text();
      if (!/id_processo/i.test(csv.slice(0, 200))) throw new Error("CSV inesperado");
      return csv;
    } finally {
      clearTimeout(t);
    }
  }

  async function carregar() {
    try {
      const csv = await buscarCsv();
      try { localStorage.setItem(C.CACHE_KEY, JSON.stringify({ ts: Date.now(), csv })); } catch (e) {}
      return { processos: montar(parseCsv(csv)), fonte: "ao-vivo", atualizadoEm: new Date() };
    } catch (erro) {
      console.warn("Planilha indisponível, usando cópia local:", erro);
      try {
        const cache = JSON.parse(localStorage.getItem(C.CACHE_KEY) || "null");
        if (cache && cache.csv) return { processos: montar(parseCsv(cache.csv)), fonte: "cache", atualizadoEm: new Date(cache.ts) };
      } catch (e) {}
      if (window.CATALOGO_FALLBACK) {
        const fb = window.CATALOGO_FALLBACK;
        return { processos: montar(parseCsv(fb.csv)), fonte: "offline", atualizadoEm: new Date(fb.geradoEm) };
      }
      throw erro;
    }
  }

  function montarEsteira(linhas) {
    const fluxos = new Map();
    linhas.slice(1).forEach((l) => {
      const idFluxo = limpar(l[0]);
      if (!idFluxo) return;
      if (!fluxos.has(idFluxo)) {
        fluxos.set(idFluxo, { id: idFluxo, nome: limpar(l[1]), nos: [], notas: [] });
      }
      const tipo = limpar(l[3]).toLowerCase();
      const no = {
        id: limpar(l[2]),
        tipo,
        fase: limpar(l[4]),
        ator: limpar(l[5]),
        rotulo: limpar(l[6]),
        descricao: limpar(l[7]),
        sistema: limpar(l[8]),
        prazo: limpar(l[9]),
        destino: limpar(l[10]),
        destinoSim: limpar(l[11]),
        destinoNao: limpar(l[12]),
        rotuloSim: limpar(l[13]) || "Sim",
        rotuloNao: limpar(l[14]) || "Não",
        observacoes: limpar(l[15]),
      };
      const f = fluxos.get(idFluxo);
      if (tipo === "nota") f.notas.push(no);
      else f.nos.push(no);
    });
    const lista = [...fluxos.values()];
    lista.forEach((f) => {
      f.porId = new Map(f.nos.map((n) => [n.id, n]));
      f.inicio = f.nos.find((n) => n.tipo === "inicio") || f.nos[0];
      const paletaDe = (nome) => {
        const conhecido = C.ESTEIRA_ATORES.find((a) => a.id === nome);
        if (conhecido) return conhecido;
        let h = 0;
        for (let i = 0; i < (nome || "").length; i++) h = (h * 31 + nome.charCodeAt(i)) >>> 0;
        const p = (C.ESTEIRA_PALETA || C.ESTEIRA_ATORES)[h % (C.ESTEIRA_PALETA || C.ESTEIRA_ATORES).length];
        return { id: nome, forte: p.forte, clara: p.clara };
      };
      const ordem = [];
      f.nos.forEach((n) => { if (n.ator && !ordem.includes(n.ator)) ordem.push(n.ator); });
      f.atores = ordem.map(paletaDe);
      const vistas = [...new Set(f.nos.map((n) => n.fase).filter(Boolean))];
      const conhecidas = (C.ESTEIRA_FASES || []).filter((fase) => vistas.includes(fase));
      f.fases = conhecidas.concat(vistas.filter((fase) => !conhecidas.includes(fase)));
      if (!f.fases.length) f.fases = ["Fluxo"];
      f.nos.forEach((n) => { if (!n.fase) n.fase = f.fases[0]; });
      f.arestas = [];
      f.nos.forEach((n) => {
        if (n.destino) f.arestas.push({ de: n.id, para: n.destino, rotulo: "", tipo: "seq" });
        if (n.destinoSim) f.arestas.push({ de: n.id, para: n.destinoSim, rotulo: n.rotuloSim, tipo: "sim" });
        if (n.destinoNao) f.arestas.push({ de: n.id, para: n.destinoNao, rotulo: n.rotuloNao, tipo: "nao" });
      });
    });
    return lista;
  }

  async function buscarTexto(url) {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 12000);
    try {
      const resp = await fetch(url + (url.includes("?") ? "&" : "?") + "t=" + Date.now(), { signal: ctrl.signal, cache: "no-store" });
      if (!resp.ok) throw new Error("HTTP " + resp.status);
      return await resp.text();
    } finally {
      clearTimeout(t);
    }
  }

  async function carregarEsteira() {
    const tentativas = [];
    if (C.ESTEIRA_CSV_URL && /gid=\d+/.test(C.ESTEIRA_CSV_URL)) tentativas.push(["ao-vivo", C.ESTEIRA_CSV_URL]);
    tentativas.push(["local", C.ESTEIRA_CSV_LOCAL]);
    for (const [fonte, url] of tentativas) {
      try {
        const csv = await buscarTexto(url);
        if (!/id_fluxo/i.test(csv.slice(0, 200))) continue;
        try { localStorage.setItem(C.ESTEIRA_CACHE_KEY, JSON.stringify({ ts: Date.now(), csv })); } catch (e) {}
        return { fluxos: montarEsteira(parseCsv(csv)), fonte, atualizadoEm: new Date() };
      } catch (e) { /* próxima fonte */ }
    }
    try {
      const cache = JSON.parse(localStorage.getItem(C.ESTEIRA_CACHE_KEY) || "null");
      if (cache && cache.csv) return { fluxos: montarEsteira(parseCsv(cache.csv)), fonte: "cache", atualizadoEm: new Date(cache.ts) };
    } catch (e) {}
    if (window.ESTEIRA_FALLBACK) {
      const fb = window.ESTEIRA_FALLBACK;
      return { fluxos: montarEsteira(parseCsv(fb.csv)), fonte: "offline", atualizadoEm: new Date(fb.geradoEm) };
    }
    throw new Error("Esteira indisponível");
  }

  function semAcento(t) {
    return limpar(t).normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
  }

  function nivelDe(txt) {
    const n = semAcento(txt);
    if (n.startsWith("alt")) return { id: "alto", rotulo: "Alto", peso: 3 };
    if (n.startsWith("med")) return { id: "medio", rotulo: "Médio", peso: 2 };
    if (n.startsWith("baix")) return { id: "baixo", rotulo: "Baixo", peso: 1 };
    return { id: "medio", rotulo: limpar(txt) || "—", peso: 2 };
  }

  function estrategiaDe(txt) {
    const n = semAcento(txt);
    if (n.startsWith("evit")) return { id: "evitar", rotulo: "Evitar" };
    if (n.startsWith("mitig")) return { id: "mitigar", rotulo: "Mitigar" };
    const rotulo = limpar(txt);
    return { id: n || "outra", rotulo: rotulo || "—" };
  }

  function montarRiscos(linhas) {
    const header = (linhas[0] || []).map((h) => semAcento(h));
    const col = (...nomes) => header.findIndex((h) => nomes.some((n) => h.includes(n)));
    const iDono = col("dono");
    const iProc = header.findIndex((h) => h.includes("processo") && !h.includes("dono"));
    const iRisco = header.findIndex((h) => h === "risco");
    const iDesc = col("descricao");
    const iCons = col("consequencia");
    const iProb = col("probabilidade");
    const iImp = col("impacto");
    const iPlano = col("contingencia", "plano");
    const iEst = col("estrategia");
    if (iDono < 0 || iRisco < 0) return [];
    const lista = [];
    linhas.slice(1).forEach((l, i) => {
      const dono = limpar(l[iDono]).toUpperCase();
      const risco = limpar(l[iRisco]);
      if (!dono || !risco) return;
      const probabilidade = nivelDe(l[iProb]);
      const impacto = nivelDe(l[iImp]);
      const estrategia = estrategiaDe(l[iEst]);
      lista.push({
        id: "r" + (i + 1),
        dono,
        processo: limpar(l[iProc]),
        risco,
        descricao: limpar(l[iDesc]),
        consequencia: limpar(l[iCons]),
        probabilidade,
        impacto,
        nivel: probabilidade.peso * impacto.peso,
        plano: limpar(l[iPlano]),
        estrategia,
        busca: semAcento([dono, l[iProc], risco, l[iDesc], l[iCons], l[iPlano], estrategia.rotulo].join(" ")),
      });
    });
    return lista;
  }

  async function carregarRiscos() {
    const tentativas = [];
    if (C.RISCOS_CSV_URL && /gid=\d+/.test(C.RISCOS_CSV_URL)) tentativas.push(["ao-vivo", C.RISCOS_CSV_URL]);
    if (C.RISCOS_CSV_LOCAL) tentativas.push(["local", C.RISCOS_CSV_LOCAL]);
    for (const [fonte, url] of tentativas) {
      try {
        const csv = await buscarTexto(url);
        if (!/dono do processo/i.test(csv.slice(0, 400))) continue;
        try { localStorage.setItem(C.RISCOS_CACHE_KEY, JSON.stringify({ ts: Date.now(), csv })); } catch (e) {}
        return { riscos: montarRiscos(parseCsv(csv)), fonte, atualizadoEm: new Date() };
      } catch (e) { /* próxima fonte */ }
    }
    try {
      const cache = JSON.parse(localStorage.getItem(C.RISCOS_CACHE_KEY) || "null");
      if (cache && cache.csv) return { riscos: montarRiscos(parseCsv(cache.csv)), fonte: "cache", atualizadoEm: new Date(cache.ts) };
    } catch (e) {}
    throw new Error("Riscos indisponíveis");
  }

  function situacaoDe(txt) {
    const rotulo = limpar(txt).replace(/\.+$/, "");
    const n = semAcento(rotulo);
    if (n.startsWith("em andamento")) return { id: "andamento", rotulo: rotulo || "Em andamento" };
    if (n.startsWith("planejad")) return { id: "planejado", rotulo: rotulo || "Planejado" };
    if (n.startsWith("nao inici")) return { id: "nao", rotulo: rotulo || "Não iniciado" };
    if (n.includes("permanente")) return { id: "permanente", rotulo: rotulo || "Acompanhamento permanente" };
    if (n.includes("pactu")) return { id: "pactuacao", rotulo: rotulo || "Em fase de pactuação" };
    return { id: (n || "outra").slice(0, 24), rotulo: rotulo || "—" };
  }

  function montarTratamento(linhas) {
    const header = (linhas[0] || []).map((h) => semAcento(h));
    const achar = (pred) => header.findIndex(pred);
    const iResp = achar((h) => h === "responsavel");
    const iProc = achar((h) => h === "processo");
    const iEvento = achar((h) => h.startsWith("evento"));
    const iProjeto = achar((h) => h.startsWith("projeto"));
    const iMedida = achar((h) => h.startsWith("medida"));
    const iBeneficio = achar((h) => h.includes("beneficio") || h.startsWith("objeto"));
    const iArea = achar((h) => h.includes("organizacional"));
    const iCorresp = achar((h) => h.includes("correspons"));
    const iServidor = achar((h) => h.startsWith("servidor"));
    const iComo = achar((h) => h.startsWith("descricao"));
    const iCusto = achar((h) => h.startsWith("custo"));
    const iInicio = achar((h) => h.startsWith("inicio"));
    const iFim = achar((h) => h.startsWith("termino"));
    const iSituacao = achar((h) => h.startsWith("situacao"));
    if (iResp < 0 || iEvento < 0) return [];
    const lista = [];
    linhas.slice(1).forEach((l, i) => {
      const pegar = (idx) => (idx < 0 ? "" : limpar(l[idx]));
      const responsavel = pegar(iResp).toUpperCase();
      const evento = pegar(iEvento);
      if (!responsavel || !evento) return;
      const situacao = situacaoDe(pegar(iSituacao));
      const processo = pegar(iProc);
      const medida = pegar(iMedida);
      lista.push({
        id: "t" + (i + 1),
        responsavel,
        processo,
        evento,
        projeto: pegar(iProjeto),
        medida,
        beneficio: pegar(iBeneficio),
        area: pegar(iArea),
        corresponsavel: pegar(iCorresp),
        servidor: pegar(iServidor),
        como: pegar(iComo),
        custo: pegar(iCusto),
        inicio: pegar(iInicio),
        fim: pegar(iFim),
        situacao,
        busca: semAcento([responsavel, processo, evento, medida, pegar(iProjeto), pegar(iComo), situacao.rotulo].join(" ")),
      });
    });
    return lista;
  }

  async function carregarTratamento() {
    const tentativas = [];
    if (C.TRATAMENTO_CSV_URL && /gid=\d+/.test(C.TRATAMENTO_CSV_URL)) tentativas.push(["ao-vivo", C.TRATAMENTO_CSV_URL]);
    if (C.TRATAMENTO_CSV_LOCAL) tentativas.push(["local", C.TRATAMENTO_CSV_LOCAL]);
    for (const [fonte, url] of tentativas) {
      try {
        const csv = await buscarTexto(url);
        if (!/evento de risco/i.test(csv.slice(0, 800))) continue;
        try { localStorage.setItem(C.TRATAMENTO_CACHE_KEY, JSON.stringify({ ts: Date.now(), csv })); } catch (e) {}
        return { medidas: montarTratamento(parseCsv(csv)), fonte, atualizadoEm: new Date() };
      } catch (e) { /* próxima fonte */ }
    }
    try {
      const cache = JSON.parse(localStorage.getItem(C.TRATAMENTO_CACHE_KEY) || "null");
      if (cache && cache.csv) return { medidas: montarTratamento(parseCsv(cache.csv)), fonte: "cache", atualizadoEm: new Date(cache.ts) };
    } catch (e) {}
    throw new Error("Tratamento indisponível");
  }

  function normalizarBusca(t) {
    return String(t).toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "").trim();
  }

  return { carregar, carregarEsteira, carregarRiscos, carregarTratamento, normalizarBusca, formatarNome };
})();
