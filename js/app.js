/* Catálogo de Processos SET - interface */
(function () {
  const C = window.CONFIG;
  const $ = (sel, raiz = document) => raiz.querySelector(sel);
  const $$ = (sel, raiz = document) => [...raiz.querySelectorAll(sel)];
  const app = $("#app");

  const ICONES = {
    home: '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/>',
    search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
    layers: '<path d="m12 2 10 5-10 5L2 7z"/><path d="m2 17 10 5 10-5"/><path d="m2 12 10 5 10-5"/>',
    palette: '<circle cx="13.5" cy="6.5" r="1.5"/><circle cx="17.5" cy="10.5" r="1.5"/><circle cx="8.5" cy="7.5" r="1.5"/><circle cx="6.5" cy="12.5" r="1.5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.9 0 1.7-.8 1.7-1.7 0-.4-.2-.8-.4-1.1-.3-.3-.4-.7-.4-1.1 0-.9.8-1.7 1.7-1.7H16c3.1 0 5.6-2.5 5.6-5.6C22 6 17.5 2 12 2z"/>',
    plane: '<path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    cpu: '<rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3"/>',
    briefcase: '<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>',
    receipt: '<path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1z"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 17.5v-11"/>',
    handshake: '<path d="m11 17 2 2a1 1 0 1 0 3-3"/><path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4"/><path d="m21 3 1 11h-2"/><path d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3"/><path d="M3 4h8"/>',
    calculator: '<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M8 6h8M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01"/>',
    cart: '<circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>',
    sprout: '<path d="M7 20h10"/><path d="M10 20c5.5-2.5.8-6.4 3-10"/><path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z"/><path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z"/>',
    megaphone: '<path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/>',
    landmark: '<path d="M3 22h18M6 18v-7M10 18v-7M14 18v-7M18 18v-7M12 2l8 5H4z"/>',
    car: '<path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/>',
    pin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/>',
    flag: '<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><path d="M4 22v-7"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    x: '<path d="M18 6 6 18M6 6l12 12"/>',
    left: '<path d="m15 18-6-6 6-6"/>',
    right: '<path d="m9 18 6-6-6-6"/>',
    monitor: '<rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>',
    clipboard: '<rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="m9 14 2 2 4-4"/>',
    book: '<path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>',
    external: '<path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
    printer: '<path d="M6 9V2h12v7"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>',
    play: '<polygon points="6 3 20 12 6 21 6 3"/>',
    route: '<circle cx="6" cy="19" r="3"/><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15"/><circle cx="18" cy="5" r="3"/>',
    rows: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18"/>',
    list: '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
    refresh: '<path d="M21 12a9 9 0 1 1-3-6.7L21 8"/><path d="M21 3v5h-5"/>',
    reset: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>',
    globe: '<circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20"/>',
    trophy: '<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3"/>',
    steps: '<path d="M4 20h4v-4h4v-4h4V8h4"/>',
    logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/>',
  };
  const icone = (n, cls = "") => `<svg class="icon ${cls}" viewBox="0 0 24 24" aria-hidden="true">${ICONES[n] || ICONES.layers}</svg>`;

  function svgHero() {
    return `<svg class="hero-svg" viewBox="0 0 560 232" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <filter id="hero-sombra" x="-25%" y="-25%" width="150%" height="160%">
          <feDropShadow dx="0" dy="5" stdDeviation="5" flood-color="#4d4d4d" flood-opacity=".14"/>
        </filter>
        <marker id="hero-seta" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5.5" markerHeight="5.5" orient="auto">
          <path d="M1 1.5 8.4 5 1 8.5Z" fill="#F15A24"/>
        </marker>
      </defs>
      <path class="hero-linha" d="M70 72 H474 C516 72 530 86 530 118 C530 154 514 168 474 168 H92" stroke="#F15A24" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" marker-end="url(#hero-seta)"/>
      <g class="hero-card" filter="url(#hero-sombra)" style="--d:-0s">
        <rect x="92" y="32" width="96" height="80" rx="8" fill="#A3C3F4"/>
        <path d="M92 40a8 8 0 0 1 8-8h80a8 8 0 0 1 8 8v14H92V40Z" fill="#3166AC"/>
        <rect x="108" y="64" width="64" height="5" rx="2.5" fill="#3166AC" opacity=".25"/>
        <rect x="116" y="74" width="48" height="5" rx="2.5" fill="#3166AC" opacity=".16"/>
        <circle cx="108" cy="100" r="7" fill="#fff"/><text x="108" y="103.4" text-anchor="middle" font-size="8" font-weight="800" fill="#3166AC">1</text>
      </g>
      <g class="hero-card" filter="url(#hero-sombra)" style="--d:-.9s">
        <rect x="228" y="32" width="96" height="80" rx="8" fill="#A6E7D5"/>
        <path d="M228 40a8 8 0 0 1 8-8h80a8 8 0 0 1 8 8v14h-96V40Z" fill="#2DB39D"/>
        <rect x="244" y="64" width="64" height="5" rx="2.5" fill="#2DB39D" opacity=".25"/>
        <rect x="252" y="74" width="48" height="5" rx="2.5" fill="#2DB39D" opacity=".16"/>
        <circle cx="244" cy="100" r="7" fill="#fff"/><text x="244" y="103.4" text-anchor="middle" font-size="8" font-weight="800" fill="#2DB39D">2</text>
      </g>
      <g class="hero-card" filter="url(#hero-sombra)" style="--d:-1.8s">
        <rect x="364" y="32" width="96" height="80" rx="8" fill="#D58B8B"/>
        <path d="M364 40a8 8 0 0 1 8-8h80a8 8 0 0 1 8 8v14h-96V40Z" fill="#AB5B5B"/>
        <rect x="380" y="64" width="64" height="5" rx="2.5" fill="#AB5B5B" opacity=".25"/>
        <rect x="388" y="74" width="48" height="5" rx="2.5" fill="#AB5B5B" opacity=".16"/>
        <circle cx="380" cy="100" r="7" fill="#fff"/><text x="380" y="103.4" text-anchor="middle" font-size="8" font-weight="800" fill="#AB5B5B">3</text>
      </g>
      <g class="hero-card" filter="url(#hero-sombra)" style="--d:-2.7s">
        <rect x="296" y="128" width="96" height="80" rx="8" fill="#F1B08B"/>
        <path d="M296 136a8 8 0 0 1 8-8h80a8 8 0 0 1 8 8v14h-96v-14Z" fill="#FF863C"/>
        <rect x="312" y="160" width="64" height="5" rx="2.5" fill="#B06134" opacity=".25"/>
        <rect x="320" y="170" width="48" height="5" rx="2.5" fill="#B06134" opacity=".16"/>
        <circle cx="312" cy="196" r="7" fill="#fff"/><text x="312" y="199.4" text-anchor="middle" font-size="8" font-weight="800" fill="#FF863C">4</text>
      </g>
      <g class="hero-card" filter="url(#hero-sombra)" style="--d:-3.6s">
        <rect x="160" y="128" width="96" height="80" rx="8" fill="#C6C4C3"/>
        <path d="M160 136a8 8 0 0 1 8-8h80a8 8 0 0 1 8 8v14h-96v-14Z" fill="#7E7E7E"/>
        <rect x="176" y="160" width="64" height="5" rx="2.5" fill="#7E7E7E" opacity=".25"/>
        <rect x="184" y="170" width="48" height="5" rx="2.5" fill="#7E7E7E" opacity=".16"/>
        <circle cx="176" cy="196" r="7" fill="#fff"/><text x="176" y="199.4" text-anchor="middle" font-size="8" font-weight="800" fill="#7E7E7E">5</text>
      </g>
      <g class="hero-pin">
        <path d="M40 22c11.6 0 21 9.4 21 21 0 16-21 38-21 38S19 59 19 43c0-11.6 9.4-21 21-21z" fill="#405864"/>
        <circle cx="40" cy="42" r="7" fill="#fff"/>
        <text x="40" y="90" text-anchor="middle" font-size="9" font-weight="800" fill="#405864">Início</text>
      </g>
      <g class="hero-fim">
        <rect x="2" y="151" width="76" height="34" rx="8" fill="#E8322B"/>
        <text x="40" y="165" text-anchor="middle" font-size="8" font-weight="800" fill="#fff">FIM DO</text>
        <text x="40" y="176" text-anchor="middle" font-size="8" font-weight="800" fill="#fff">PROCESSO</text>
      </g>
    </svg>`;
  }

  const esc = (t) => String(t == null ? "" : t).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const UNID = Object.fromEntries(C.UNIDADES.map((u) => [u.id, u]));
  const CAT = Object.fromEntries(C.CATEGORIAS.map((c) => [c.id, c]));
  const corVars = (uid) => `--forte:${UNID[uid].forte};--clara:${UNID[uid].clara}`;
  const plural = (n, s, p) => `${n} ${n === 1 ? s : p}`;

  const estado = {
    processos: [],
    porId: new Map(),
    fonte: null,
    visao: localStorage.getItem("catalogo-set-visao") || "trilha",
    busca: "",
    filtros: { unidade: null, externo: false },
    proc: null,
    passoAberto: null,
    fluxos: [],
    fluxo: null,
    jogo: [],
    jogando: false,
    usuario: null,
  };

  /* ---------- Progresso (localStorage) ---------- */
  function lerProgresso() {
    try { return JSON.parse(localStorage.getItem(C.PROGRESSO_KEY) || "{}"); } catch (e) { return {}; }
  }
  function concluidos(procId) { return new Set(lerProgresso()[procId] || []); }
  function salvarConcluidos(procId, set) {
    const tudo = lerProgresso();
    if (set.size) tudo[procId] = [...set]; else delete tudo[procId];
    localStorage.setItem(C.PROGRESSO_KEY, JSON.stringify(tudo));
  }

  /* ---------- Navegação ---------- */
  function renderNav(rota) {
    const itens = [
      ["#/", "home", "Início", rota === "home"],
      ["#/estantes", "layers", "Estantes", rota === "estantes" || rota === "estante" || rota === "processo"],
      ["#/esteira", "route", "Esteira", rota === "esteira"],
      ["#/legenda", "palette", "Legenda", rota === "legenda"],
    ];
    const perfil = estado.usuario && estado.usuario.profile;
    const nome = perfil && (perfil.name || perfil.email || "");
    $("#nav").innerHTML = itens
      .map(([h, i, t, a]) => `<a href="${h}" class="${a ? "ativo" : ""}">${icone(i)}<span>${t}</span></a>`)
      .join("") +
      (nome ? `<span class="nav-user" title="${esc(perfil.email || nome)}">${esc(nome.split(" ")[0])}</span>` : "") +
      `<button type="button" class="nav-sair" id="nav-sair">${icone("logout")}<span>Sair</span></button>`;
    const sair = $("#nav-sair");
    if (sair) sair.addEventListener("click", () => SSO.sair());
  }

  function rotear() {
    fecharGaveta(true);
    const partes = location.hash.replace(/^#\/?/, "").split("?")[0].split("/").filter(Boolean).map(decodeURIComponent);
    const [rota, arg] = partes;
    if (rota === "processo" && estado.porId.has(arg)) return telaProcesso(estado.porId.get(arg));
    if (rota === "estante" && CAT[arg]) return telaEstante(CAT[arg]);
    if (rota === "estantes") return telaEstantes();
    if (rota === "esteira") return arg ? telaEsteira(arg) : telaListaEsteiras();
    if (rota === "legenda") return telaLegenda(UNID[arg] ? arg : null);
    return telaInicio();
  }

  function montarTela(rota, html, titulo, manterScroll) {
    renderNav(rota);
    app.onclick = null;
    app.innerHTML = html;
    document.title = `${titulo ? titulo + " · " : ""}Catálogo de Processos · SET / IDT`;
    if (!manterScroll) window.scrollTo(0, 0);
  }

  /* ---------- Componentes ---------- */
  function processosDaCategoria(cid) { return estado.processos.filter((p) => p.categoria === cid); }

  function cartaoProcesso(p, i = 0) {
    const cat = CAT[p.categoria];
    const faixa = p.unidades.length
      ? p.unidades.map((u) => `<span style="background:${UNID[u].forte}" title="${esc(UNID[u].nome)}"></span>`).join("")
      : `<span style="background:var(--line)"></span>`;
    const meta = p.passos.length
      ? [
          `<span class="chip chip-green">${icone("steps")}${plural(p.passos.length, "passo", "passos")}</span>`,
          `<span class="chip chip-blue">${icone("users")}${plural(p.unidades.length, "setor", "setores")}</span>`,
          p.externos ? `<span class="chip chip-orange">${icone("globe")}${p.externos} externo${p.externos > 1 ? "s" : ""}</span>` : "",
          p.checklists + p.pops ? `<span class="chip chip-teal">${icone("clipboard")}${p.checklists + p.pops} doc.</span>` : "",
        ].join("")
      : `<span class="chip">Passos em levantamento</span>`;
    return `
      <a class="processo-card" href="#/processo/${encodeURIComponent(p.id)}" style="animation-delay:${Math.min(i, 20) * 30}ms">
        ${p.passos.length ? "" : `<span class="selo-mapeando">Em mapeamento</span>`}
        <span class="codigo" style="color:${cat.cor}">${icone(cat.icone)} ${esc(p.id.toUpperCase())} · ${esc(cat.nome)}</span>
        <h3>${esc(p.nome)}</h3>
        <div class="faixa-setores">${faixa}</div>
        <div class="meta">${meta}</div>
      </a>`;
  }

  function gradeProcessos(lista) {
    if (!lista.length) {
      return `<div class="painel vazio">${icone("search")}<p>Nenhum processo encontrado com esses filtros.</p></div>`;
    }
    return `<div class="processos">${lista.map(cartaoProcesso).join("")}</div>`;
  }

  function cartaoEstante(c) {
    const lista = processosDaCategoria(c.id);
    const contagem = new Map();
    lista.forEach((p) => p.passos.forEach((s) => contagem.set(s.unidade, (contagem.get(s.unidade) || 0) + 1)));
    const top = [...contagem.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8);
    const passos = lista.reduce((t, p) => t + p.passos.length, 0);
    return `
      <a class="estante" href="#/estante/${c.id}" style="--cor:${c.cor}">
        <span class="estante-ic">${icone(c.icone)}</span>
        <div class="estante-capa">
          <span class="estante-contador">${lista.length}<small>${lista.length === 1 ? "processo" : "processos"}</small></span>
        </div>
        <div class="estante-corpo">
          <h3>${esc(c.nome)}</h3>
          <p>${esc(c.desc)}</p>
          <div class="apoio">${plural(passos, "passo mapeado", "passos mapeados")}</div>
          <div class="estante-lombadas">${top.map(([u]) => `<span style="background:${UNID[u].forte}"></span>`).join("") || '<span style="background:var(--line)"></span>'}</div>
        </div>
      </a>`;
  }

  function estantesVisiveis() {
    return C.CATEGORIAS.filter((c) => processosDaCategoria(c.id).length);
  }

  /* ---------- Tela: Início ---------- */
  function telaInicio() {
    const P = estado.processos;
    const passos = P.reduce((t, p) => t + p.passos.length, 0);
    const mapeados = P.filter((p) => p.passos.length).length;
    const unidades = new Set(P.flatMap((p) => p.unidades));
    const responsaveis = new Set(P.flatMap((p) => p.passos.map((s) => s.responsavel.toUpperCase())));
    const docs = P.reduce((t, p) => t + p.checklists + p.pops, 0);
    const pops = P.reduce((t, p) => t + p.pops, 0);
    const sistemas = new Set(P.flatMap((p) => p.sistemas.map((s) => s.nome)));
    const html = `
      <section class="hero">
        <div class="hero-texto">
          <span class="eyebrow">SET / IDT · Secretaria do Trabalho</span>
          <h2>Catálogo de <span>Processos</span></h2>
          <p>Descubra, passo a passo, como cada macrofluxo da Secretaria acontece: quem faz, em qual sistema e com quais documentos de apoio.</p>
          <label class="busca" for="busca">
            ${icone("search")}
            <input id="busca" type="search" placeholder="Busque por processo, setor, sistema ou atividade..." autocomplete="off" value="${esc(estado.busca)}" />
          </label>
          <div class="busca-dica"><span class="apoio">Experimente:</span>
            ${["diárias", "SIAFE", "pregão", "ASJUR", "crédito", "LGPD"].map((t) => `<button type="button" data-busca="${t}">${t}</button>`).join("")}
          </div>
          <div class="resultados" id="resultados" aria-live="polite"></div>
        </div>
        <div class="hero-arte" aria-hidden="true">${svgHero()}</div>
      </section>

      <section class="kpis">
        <div class="kpi tom-green"><div class="kpi-top">${icone("layers")} Processos</div><div class="kpi-body"><div class="kpi-valor">${P.length}</div><div class="kpi-apoio">${mapeados} com passo a passo e ${P.length - mapeados} em mapeamento</div></div><div class="kpi-foot">${estantesVisiveis().length} estantes temáticas</div></div>
        <div class="kpi tom-blue"><div class="kpi-top">${icone("steps")} Passos</div><div class="kpi-body"><div class="kpi-valor">${passos}</div><div class="kpi-apoio">Média de ${(passos / Math.max(mapeados, 1)).toFixed(1).replace(".", ",")} passos por processo</div></div><div class="kpi-foot">${sistemas.size} sistemas e plataformas</div></div>
        <div class="kpi tom-orange"><div class="kpi-top">${icone("users")} Setores</div><div class="kpi-body"><div class="kpi-valor">${unidades.size}</div><div class="kpi-apoio">Unidades da legenda, com ${responsaveis.size} responsáveis distintos</div></div><div class="kpi-foot"><a class="link-acao" href="#/legenda">Ver legenda ${icone("right")}</a></div></div>
        <div class="kpi tom-teal"><div class="kpi-top">${icone("clipboard")} Documentos</div><div class="kpi-body"><div class="kpi-valor">${docs}</div><div class="kpi-apoio">${docs - pops} checklists e ${pops} POPs vinculados aos passos</div></div><div class="kpi-foot">Abertos direto do passo</div></div>
      </section>

      <section class="secao">
        <div class="secao-head">
          <div><span class="eyebrow">Escolha uma estante</span><h2>Navegue por tema</h2></div>
          <a class="link-acao" href="#/estantes">Ver todas ${icone("right")}</a>
        </div>
        <div class="estantes">${estantesVisiveis().map(cartaoEstante).join("")}</div>
      </section>
      ${estado.fluxos.length ? `<section class="secao">
        <div class="secao-head">
          <div><span class="eyebrow">Caminho do cidadão</span><h2>${plural(estado.fluxos.length, "esteira", "esteiras")}</h2></div>
          <a class="link-acao" href="#/esteira">Ver todas ${icone("right")}</a>
        </div>
        <div class="processos">${estado.fluxos.slice(0, 6).map(cartaoFluxo).join("")}</div>
      </section>` : ""}`;

    montarTela("home", html, "");
    const input = $("#busca");
    let t;
    input.addEventListener("input", () => { clearTimeout(t); t = setTimeout(() => buscar(input.value), 140); });
    $$(".busca-dica button").forEach((b) => b.addEventListener("click", () => { input.value = b.dataset.busca; buscar(b.dataset.busca); input.focus(); }));
    if (estado.busca) buscar(estado.busca);
  }

  function marcar(texto, termos) {
    let h = esc(texto);
    termos.forEach((t) => {
      if (t.length < 2) return;
      const re = new RegExp(`(${t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").split("").map((ch) => {
        const mapa = { a: "[aáàâã]", e: "[eéê]", i: "[ií]", o: "[oóôõ]", u: "[uú]", c: "[cç]" };
        return mapa[ch] || ch;
      }).join("")})`, "gi");
      h = h.replace(re, "<mark>$1</mark>");
    });
    return h;
  }

  function buscar(q) {
    estado.busca = q;
    const alvo = $("#resultados");
    const termos = DADOS.normalizarBusca(q).split(/\s+/).filter(Boolean);
    if (!termos.length) { alvo.innerHTML = ""; return; }
    const achados = estado.processos.filter((p) => termos.every((t) => p.busca.includes(t)));
    if (!achados.length) {
      alvo.innerHTML = `<div class="apoio">Nada encontrado para "<strong>${esc(q)}</strong>". Tente outra palavra.</div>`;
      return;
    }
    alvo.innerHTML =
      `<div class="apoio">${plural(achados.length, "processo encontrado", "processos encontrados")}</div>` +
      achados.slice(0, 10).map((p) => {
        const cat = CAT[p.categoria];
        const norm = (s) => DADOS.normalizarBusca(s);
        const passo = DADOS.normalizarBusca(p.nome).includes(termos[0])
          ? null
          : p.passos.find((s) => norm(`${s.responsavel} ${s.descricao} ${s.sistemas.map((x) => x.nome).join(" ")}`).includes(termos[0]));
        const detalhe = passo
          ? `Passo ${passo.ordem} · ${marcar(passo.responsavel, termos)}: ${marcar(passo.descricao.slice(0, 110), termos)}${passo.descricao.length > 110 ? "..." : ""}`
          : `${esc(cat.nome)} · ${plural(p.passos.length, "passo", "passos")}`;
        return `<a class="resultado" href="#/processo/${encodeURIComponent(p.id)}${passo ? "?passo=" + passo.ordem : ""}">
          <span class="ic" style="background:${cat.cor}">${icone(cat.icone)}</span>
          <span><strong>${marcar(p.nome, termos)}</strong><small>${detalhe}</small></span>
        </a>`;
      }).join("") +
      (achados.length > 10 ? `<div class="apoio">e mais ${achados.length - 10}. Refine a busca para ver outros.</div>` : "");
  }

  /* ---------- Tela: Estantes ---------- */
  function telaEstantes() {
    const html = `
      <div class="migalhas"><a href="#/">Início</a> › <span>Estantes</span></div>
      <div class="secao-head">
        <div><span class="eyebrow">Biblioteca de processos</span><h2>Todas as estantes</h2></div>
        <span class="apoio">${plural(estado.processos.length, "processo", "processos")} organizados por tema</span>
      </div>
      <div class="estantes">${estantesVisiveis().map(cartaoEstante).join("")}</div>
      <section class="secao">
        <div class="secao-head"><div><span class="eyebrow">De A a Z</span><h2>Todos os processos</h2></div></div>
        ${gradeProcessos([...estado.processos].sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR")))}
      </section>`;
    montarTela("estantes", html, "Estantes");
  }

  /* ---------- Tela: Estante ---------- */
  function telaEstante(cat) {
    estado.filtros = { unidade: null, externo: false };
    const lista = processosDaCategoria(cat.id);
    const unidades = C.UNIDADES.filter((u) => lista.some((p) => p.unidades.includes(u.id)));
    const outras = estantesVisiveis().filter((c) => c.id !== cat.id);
    const html = `
      <div class="migalhas"><a href="#/">Início</a> › <a href="#/estantes">Estantes</a> › <span>${esc(cat.nome)}</span></div>
      <div class="painel">
        <div class="cabecalho-pagina">
          <span class="ic-grande" style="background:${cat.cor}">${icone(cat.icone)}</span>
          <div style="flex:1;min-width:220px">
            <span class="eyebrow">Estante</span>
            <h2>${esc(cat.nome)}</h2>
            <div class="apoio">${esc(cat.desc)} · ${plural(lista.length, "processo", "processos")}</div>
          </div>
        </div>
        <div style="margin-top:16px">
          <div class="eyebrow" style="margin-bottom:8px">Filtrar por setor envolvido</div>
          <div class="filtros" id="filtros">
            <button class="filtro ativo" data-unidade="">Todos</button>
            ${unidades.map((u) => `<button class="filtro" data-unidade="${u.id}" title="${esc(u.nome)}"><span class="dot" style="background:${u.forte}"></span>${esc(u.sigla)}</button>`).join("")}
            <button class="filtro" data-externo="1">${icone("globe")} Com etapa externa</button>
          </div>
        </div>
      </div>
      <section class="secao" id="lista-estante">${gradeProcessos(lista)}</section>
      <section class="secao">
        <div class="secao-head"><div><span class="eyebrow">Continue explorando</span><h2>Outras estantes</h2></div></div>
        <div class="filtros">${outras.map((c) => `<a class="filtro" href="#/estante/${c.id}" style="text-decoration:none"><span class="dot" style="background:${c.cor}"></span>${esc(c.nome)}</a>`).join("")}</div>
      </section>`;
    montarTela("estante", html, cat.nome);

    $("#filtros").addEventListener("click", (ev) => {
      const b = ev.target.closest(".filtro");
      if (!b) return;
      if (b.dataset.externo) {
        estado.filtros.externo = !estado.filtros.externo;
        b.classList.toggle("ativo", estado.filtros.externo);
      } else {
        estado.filtros.unidade = b.dataset.unidade || null;
        $$("#filtros [data-unidade]").forEach((x) => x.classList.toggle("ativo", x === b));
      }
      const f = estado.filtros;
      const filtrada = lista.filter((p) => (!f.unidade || p.unidades.includes(f.unidade)) && (!f.externo || p.externos > 0));
      $("#lista-estante").innerHTML = gradeProcessos(filtrada);
    });
  }

  /* ---------- Tela: Processo ---------- */
  function telaProcesso(p) {
    estado.proc = p;
    const cat = CAT[p.categoria];
    const irmaos = processosDaCategoria(p.categoria);
    const pos = irmaos.indexOf(p);
    const ant = irmaos[pos - 1];
    const prox = irmaos[pos + 1];
    const temPassos = p.passos.length > 0;

    const contagemUnid = C.UNIDADES.map((u) => [u, p.passos.filter((s) => s.unidade === u.id).length]).filter(([, n]) => n);
    const docs = p.passos.filter((s) => s.checklist || s.pop);

    const html = `
      <div class="migalhas"><a href="#/">Início</a> › <a href="#/estante/${cat.id}">${esc(cat.nome)}</a> › <span>${esc(p.id.toUpperCase())}</span></div>
      <section class="painel">
        <div class="proc-topo">
          <div>
            <span class="eyebrow" style="color:${cat.cor}">${icone(cat.icone)} ${esc(cat.nome)} · ${esc(p.id.toUpperCase())}</span>
            <h2>${esc(p.nome)}</h2>
            <div class="proc-meta">
              <span class="chip chip-green">${icone("steps")}${plural(p.passos.length, "passo", "passos")}</span>
              <span class="chip chip-blue">${icone("users")}${plural(p.unidades.length, "setor", "setores")}</span>
              ${p.externos ? `<span class="chip chip-orange">${icone("globe")}${plural(p.externos, "etapa externa", "etapas externas")}</span>` : ""}
              ${p.sistemas.length ? `<span class="chip">${icone("monitor")}${plural(p.sistemas.length, "sistema", "sistemas")}</span>` : ""}
            </div>
          </div>
          ${temPassos ? `<div class="proc-acoes">
            <button class="btn btn-run" id="btn-jornada">${icone("play")} Percorrer passo a passo</button>
            <button class="btn btn-ghost btn-sm" id="btn-imprimir">${icone("printer")} Imprimir / PDF</button>
            <button class="btn btn-ghost btn-sm" id="btn-zerar">${icone("reset")} Reiniciar progresso</button>
          </div>` : ""}
        </div>
        ${temPassos ? `<div class="progresso">
          <div class="progresso-barra"><span id="barra"></span></div>
          <div class="progresso-legenda"><span id="progresso-txt"></span><span id="progresso-pct"></span></div>
        </div>` : ""}
      </section>

      ${temPassos ? `<div class="barra-visoes">
        <div class="segmentado" role="tablist" aria-label="Modo de visualização">
          <button data-visao="trilha" role="tab">${icone("route")} Trilha lúdica</button>
          <button data-visao="raias" role="tab">${icone("rows")} Raias por setor</button>
          <button data-visao="lista" role="tab">${icone("list")} Lista</button>
        </div>
        <span class="apoio">${icone("check")} Clique em um cartão para ver os detalhes do passo.</span>
      </div>` : ""}

      <section class="palco" id="palco">
        <div class="palco-titulo"><strong>${esc(p.nomeOriginal)}</strong><span>Fluxo lúdico do processo</span></div>
        <div id="visao">${temPassos ? "" : `<div class="vazio">${icone("route")}<p><strong>Processo em mapeamento.</strong><br/>Os passos ainda não foram cadastrados na planilha.</p></div>`}</div>
      </section>

      ${temPassos ? `<section class="resumo">
        <div class="painel">
          <h2 class="painel-titulo">Setores envolvidos</h2>
          <div class="lista-chips">${contagemUnid.map(([u, n]) => `<a class="chip" href="#/legenda/${u.id}" style="background:${u.clara};color:#333" title="${esc(u.nome)}"><span class="dot" style="background:${u.forte}"></span>${esc(u.sigla)} · ${n}</a>`).join("")}</div>
        </div>
        <div class="painel">
          <h2 class="painel-titulo">Sistemas e plataformas</h2>
          <div class="lista-chips">${p.sistemas.map(chipSistema).join("") || '<span class="apoio">Nenhum sistema informado.</span>'}</div>
        </div>
        <div class="painel">
          <h2 class="painel-titulo">Documentos de apoio</h2>
          ${docs.length ? `<div class="lista-chips">${docs.map((s) => [
            s.checklist ? `<a class="chip chip-green" href="${esc(s.checklist)}" target="_blank" rel="noopener">${icone("clipboard")}Checklist · passo ${s.ordem}</a>` : "",
            s.pop ? `<a class="chip chip-orange" href="${esc(s.pop)}" target="_blank" rel="noopener">${icone("book")}POP · passo ${s.ordem}</a>` : "",
          ].join("")).join("")}</div>` : '<span class="apoio">Ainda não há checklist ou POP vinculados.</span>'}
        </div>
      </section>` : ""}

      <section class="secao" style="display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap">
        ${ant ? `<a class="btn btn-ghost btn-sm" href="#/processo/${encodeURIComponent(ant.id)}">${icone("left")} ${esc(ant.nome)}</a>` : "<span></span>"}
        ${prox ? `<a class="btn btn-ghost btn-sm" href="#/processo/${encodeURIComponent(prox.id)}">${esc(prox.nome)} ${icone("right")}</a>` : ""}
      </section>`;

    montarTela("processo", html, p.nome);
    if (!temPassos) return;

    $$(".segmentado button").forEach((b) => b.addEventListener("click", () => trocarVisao(b.dataset.visao)));
    $("#btn-jornada").addEventListener("click", () => {
      const feitos = concluidos(p.id);
      const proximo = p.passos.find((s) => !feitos.has(s.id)) || p.passos[0];
      abrirPasso(proximo.ordem);
    });
    $("#btn-imprimir").addEventListener("click", () => window.print());
    $("#btn-zerar").addEventListener("click", () => {
      salvarConcluidos(p.id, new Set());
      atualizarProgresso();
      aviso(`${icone("reset")} Progresso reiniciado.`);
    });
    $("#visao").addEventListener("click", (ev) => {
      const alvo = ev.target.closest("[data-ordem]");
      if (alvo && !ev.target.closest("a")) abrirPasso(Number(alvo.dataset.ordem));
    });

    trocarVisao(estado.visao, true);
    const m = location.hash.match(/\?passo=(\d+)/);
    if (m) setTimeout(() => abrirPasso(Number(m[1])), 250);
  }

  function chipSistema(s) {
    return s.url
      ? `<a class="chip-sistema" href="${esc(s.url)}" target="_blank" rel="noopener" title="${esc(s.url)}">${icone("monitor")}${esc(s.nome)}${icone("external")}</a>`
      : `<span class="chip-sistema">${icone("monitor")}${esc(s.nome)}</span>`;
  }

  function trocarVisao(v, semSalvar) {
    estado.visao = v;
    if (!semSalvar) localStorage.setItem("catalogo-set-visao", v);
    $$(".segmentado button").forEach((b) => {
      b.classList.toggle("ativo", b.dataset.visao === v);
      b.setAttribute("aria-selected", b.dataset.visao === v);
    });
    const alvo = $("#visao");
    const p = estado.proc;
    if (v === "raias") alvo.innerHTML = htmlRaias(p);
    else if (v === "lista") alvo.innerHTML = htmlLista(p);
    else alvo.innerHTML = htmlTrilha(p);
    atualizarProgresso();
    marcarAtual();
  }

  function cartaoPasso(s, i) {
    const tags = [
      s.sistemas.length ? `<span title="Sistema: ${esc(s.sistemas.map((x) => x.nome).join(", "))}">${icone("monitor")}</span>` : "",
      s.checklist ? `<span title="Possui checklist">${icone("clipboard")}</span>` : "",
      s.pop ? `<span title="Possui POP">${icone("book")}</span>` : "",
    ].join("");
    return `
      <button type="button" class="passo" data-ordem="${s.ordem}" style="${corVars(s.unidade)};animation-delay:${Math.min(i, 24) * 45}ms"
        aria-label="Passo ${s.ordem}: ${esc(s.responsavel)} - ${esc(s.descricao)}">
        <div class="passo-head">${esc(s.responsavel)}</div>
        ${s.tipo === "externa" ? '<span class="passo-externo">Externo</span>' : ""}
        <span class="passo-feito">${icone("check")}</span>
        <div class="passo-body"><span>${esc(s.descricao)}</span></div>
        <div class="passo-foot"><span class="passo-num">${s.ordem}</span><span class="passo-tags">${tags}</span></div>
      </button>`;
  }

  /* Trilha em zigue-zague, como as páginas do PDF */
  function colunasTrilha() {
    if (document.body.classList.contains("imprimindo")) {
      document.documentElement.style.setProperty("--card-w", "150px");
      return 5;
    }
    const palco = $("#palco");
    const largura = (palco ? palco.clientWidth : 1100) - 44;
    const card = window.innerWidth < 420 ? 170 : 196;
    document.documentElement.style.setProperty("--card-w", card + "px");
    return Math.max(1, Math.min(6, Math.floor((largura + 36) / (card + 36))));
  }

  const SETA = '<svg viewBox="0 0 30 18"><path class="corpo" d="M2 9h22"/><path d="M18 3l7 6-7 6"/></svg>';
  const CURVA = '<svg viewBox="0 0 70 54"><path class="corpo" d="M20 2c34 4 40 30 18 46"/><path d="M30 42l7 8 9-4"/></svg>';
  const CURVA_MEIO = '<svg viewBox="0 0 70 54"><path class="corpo" d="M35 2v44"/><path d="M27 38l8 10 8-10"/></svg>';

  function htmlTrilha(p) {
    const cols = colunasTrilha();
    estado.colsTrilha = cols;
    const itens = [
      `<div class="no-inicio">${icone("pin")}<strong>Início do<br/>processo</strong></div>`,
      ...p.passos.map(cartaoPasso),
      `<div class="no-fim">${icone("flag")}<span>Fim do<br/>processo</span></div>`,
    ];
    const linhas = [];
    for (let i = 0; i < itens.length; i += cols) linhas.push(itens.slice(i, i + cols));
    const zigue = cols > 1;
    return `<div class="trilha" style="width:max-content;max-width:100%;margin:0 auto">${linhas.map((linha, li) => {
      const reversa = zigue && li % 2 === 1;
      const conteudo = linha.map((item, ii) => `<div class="trilha-item">${item}${ii < linha.length - 1 ? `<span class="seta">${SETA}</span>` : ""}</div>`).join("");
      const ultima = li === linhas.length - 1;
      const lado = !zigue ? "meio" : reversa ? "esq" : "dir";
      const pad = `calc(var(--card-w) / 2 - 35px)`;
      const curva = ultima ? "" : `<div class="curva ${lado}" style="${lado === "dir" ? `padding-right:${pad}` : lado === "esq" ? `padding-left:${pad}` : "justify-content:center"}">${lado === "meio" ? CURVA_MEIO : CURVA}</div>`;
      return `<div class="trilha-linha ${reversa ? "reversa" : ""}" style="${!zigue ? "justify-content:center" : ""}">${conteudo}</div>${curva}`;
    }).join("")}</div>`;
  }

  function htmlRaias(p) {
    const raias = [];
    p.passos.forEach((s) => {
      const chave = s.responsavel.toUpperCase();
      if (!raias.some((r) => r.chave === chave)) raias.push({ chave, rotulo: s.responsavel, unidade: s.unidade });
    });
    const n = p.passos.length;
    const celulas = raias.map((r) => {
      const linha = p.passos.map((s, i) => {
        const aqui = s.responsavel.toUpperCase() === r.chave;
        return `<div class="raia-celula" style="${corVars(r.unidade)}"><span class="raia-trilho"></span>${aqui ? cartaoPasso(s, i) : ""}</div>`;
      }).join("");
      return `<div class="raia-rotulo" style="${corVars(r.unidade)}">${esc(r.rotulo)}</div>${linha}`;
    }).join("");
    return `<div class="raias-scroll"><div class="raias" style="grid-template-columns:170px repeat(${n}, 166px)">${celulas}</div></div>`;
  }

  function htmlLista(p) {
    return `<div class="lista">
      <div class="lista-marco"><span class="bolinha">${icone("pin")}</span><span>Início do processo</span></div>
      ${p.passos.map((s, i) => {
        const u = UNID[s.unidade];
        return `<div class="lista-item" data-ordem="${s.ordem}" style="${corVars(s.unidade)};animation-delay:${Math.min(i, 24) * 35}ms">
          <span class="bolinha">${s.ordem}</span>
          <div class="lista-cartao">
            <header>
              <span class="chip" style="background:${u.clara};color:#333"><span class="dot" style="background:${u.forte}"></span>${esc(s.responsavel)}</span>
              <span class="chip ${s.tipo === "externa" ? "chip-orange" : ""}">${s.tipo === "externa" ? "Atividade externa" : "Atividade interna"}</span>
            </header>
            <p>${esc(s.descricao)}</p>
            ${s.sistemas.length || s.checklist || s.pop ? `<div class="sistemas">${s.sistemas.map(chipSistema).join("")}
              ${s.checklist ? `<a class="chip chip-green" href="${esc(s.checklist)}" target="_blank" rel="noopener">${icone("clipboard")}Checklist</a>` : ""}
              ${s.pop ? `<a class="chip chip-orange" href="${esc(s.pop)}" target="_blank" rel="noopener">${icone("book")}POP</a>` : ""}</div>` : ""}
          </div>
        </div>`;
      }).join("")}
      <div class="lista-marco fim"><span class="bolinha">${icone("flag")}</span><span>Fim do processo</span></div>
    </div>`;
  }

  function atualizarProgresso() {
    const p = estado.proc;
    if (!p || !p.passos.length) return;
    const feitos = concluidos(p.id);
    const n = p.passos.filter((s) => feitos.has(s.id)).length;
    const pct = Math.round((n / p.passos.length) * 100);
    const barra = $("#barra");
    if (barra) barra.style.width = pct + "%";
    const txt = $("#progresso-txt");
    if (txt) txt.textContent = n ? `${n} de ${p.passos.length} passos percorridos` : "Nenhum passo percorrido ainda";
    const pc = $("#progresso-pct");
    if (pc) pc.textContent = pct + "%";
    p.passos.forEach((s) => {
      $$(`[data-ordem="${s.ordem}"]`, $("#visao")).forEach((el) => el.classList.toggle("concluido", feitos.has(s.id)));
    });
  }

  function marcarAtual() {
    $$("#visao .atual").forEach((el) => el.classList.remove("atual"));
    if (estado.passoAberto != null) $$(`#visao [data-ordem="${estado.passoAberto}"]`).forEach((el) => el.classList.add("atual"));
  }

  /* ---------- Gaveta do passo ---------- */
  const gaveta = $("#gaveta");
  const veu = $("#veu");

  function abrirPasso(ordem) {
    const p = estado.proc;
    const s = p && p.passos[ordem - 1];
    if (!s) return;
    estado.passoAberto = ordem;
    const u = UNID[s.unidade];
    const feitos = concluidos(p.id);
    const total = p.passos.length;
    const ultimo = ordem === total;
    const doc = (url, tipo, rotulo, ic) => url
      ? `<a class="doc ${tipo} ok" href="${esc(url)}" target="_blank" rel="noopener">${icone(ic)}<span>${rotulo}<small>Abrir documento</small></span></a>`
      : `<span class="doc ${tipo} indisponivel">${icone(ic)}<span>${rotulo}<small>Não vinculado</small></span></span>`;

    gaveta.innerHTML = `
      <div class="gaveta-topo" style="${corVars(s.unidade)}">
        <span class="eyebrow">Passo ${ordem} de ${total}${String(s.numero) !== String(ordem) ? ` · nº ${s.numero} na planilha` : ""}</span>
        <h3 id="gaveta-titulo">${esc(s.responsavel)}</h3>
        <span class="grande">${ordem}</span>
        <button class="fechar" id="fechar" aria-label="Fechar">${icone("x")}</button>
      </div>
      <div class="gaveta-corpo">
        <div class="proc-meta">
          <a class="chip" href="#/legenda/${u.id}" style="background:${u.clara};color:#333"><span class="dot" style="background:${u.forte}"></span>${esc(u.nome)}</a>
          <span class="chip ${s.tipo === "externa" ? "chip-orange" : "chip-green"}">${icone(s.tipo === "externa" ? "globe" : "home")}Atividade ${s.tipo}</span>
        </div>
        <p class="descricao">${esc(s.descricao)}</p>
        <div>
          <h4>Onde fazer</h4>
          <div class="sistemas">${s.sistemas.map(chipSistema).join("") || '<span class="apoio">Sistema não informado na planilha.</span>'}</div>
        </div>
        <div>
          <h4>Documentos de apoio</h4>
          <div class="docs">${doc(s.checklist, "checklist", "Checklist", "clipboard")}${doc(s.pop, "pop", "POP", "book")}</div>
        </div>
        <label class="concluir"><input type="checkbox" id="chk-feito" ${feitos.has(s.id) ? "checked" : ""}/> Já percorri este passo</label>
      </div>
      <div class="gaveta-rodape">
        <button class="btn btn-ghost btn-sm" id="g-ant" ${ordem === 1 ? "disabled" : ""}>${icone("left")} Anterior</button>
        <button class="btn btn-run btn-sm" id="g-ok">${icone("check")} ${ultimo ? "Concluir processo" : "Feito, próximo"}</button>
        <button class="btn btn-ghost btn-sm" id="g-prox" ${ultimo ? "disabled" : ""} aria-label="Próximo">${icone("right")}</button>
      </div>`;

    gaveta.classList.add("aberta");
    gaveta.setAttribute("aria-hidden", "false");
    veu.classList.add("aberto");
    marcarAtual();
    const cartao = $(`#visao [data-ordem="${ordem}"]`);
    if (cartao) cartao.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });

    $("#fechar").addEventListener("click", () => fecharGaveta());
    $("#g-ant").addEventListener("click", () => abrirPasso(ordem - 1));
    $("#g-prox").addEventListener("click", () => abrirPasso(ordem + 1));
    $("#chk-feito").addEventListener("change", (ev) => definirFeito(s, ev.target.checked));
    $("#g-ok").addEventListener("click", () => {
      definirFeito(s, true);
      if (!ultimo) abrirPasso(ordem + 1);
      else fecharGaveta();
    });
    $("#g-ok").focus({ preventScroll: true });
  }

  function definirFeito(s, valor) {
    const p = estado.proc;
    const feitos = concluidos(p.id);
    const antes = p.passos.every((x) => feitos.has(x.id));
    if (valor) feitos.add(s.id); else feitos.delete(s.id);
    salvarConcluidos(p.id, feitos);
    atualizarProgresso();
    const agora = p.passos.every((x) => feitos.has(x.id));
    if (agora && !antes) {
      confete();
      aviso(`${icone("trophy")} Parabéns! Você percorreu todo o processo.`);
    }
  }

  function fecharGaveta(silencioso) {
    if (!gaveta.classList.contains("aberta")) { estado.passoAberto = null; return; }
    gaveta.classList.remove("aberta");
    gaveta.setAttribute("aria-hidden", "true");
    veu.classList.remove("aberto");
    estado.passoAberto = null;
    if (!silencioso) marcarAtual();
  }
  veu.addEventListener("click", () => fecharGaveta());
  document.addEventListener("keydown", (ev) => {
    if (!gaveta.classList.contains("aberta")) return;
    if (ev.key === "Escape") fecharGaveta();
    const o = estado.passoAberto;
    if (ev.key === "ArrowRight" && o < estado.proc.passos.length) abrirPasso(o + 1);
    if (ev.key === "ArrowLeft" && o > 1) abrirPasso(o - 1);
  });

  /* ---------- Tela: Legenda ---------- */
  function corAtor(nome) {
    const conhecido = C.ESTEIRA_ATORES.find((a) => a.id === nome);
    if (conhecido) return conhecido;
    const paleta = C.ESTEIRA_PALETA || C.ESTEIRA_ATORES;
    let h = 0;
    for (let i = 0; i < (nome || "").length; i++) h = (h * 31 + nome.charCodeAt(i)) >>> 0;
    const p = paleta[h % paleta.length] || { forte: "#7e7e7e", clara: "#ececec" };
    return { id: nome, forte: p.forte, clara: p.clara };
  }

  function cartaoFluxo(f, i = 0) {
    const etapas = f.nos.filter((n) => n.tipo === "atividade").length;
    return `<a class="processo-card" href="#/esteira/${encodeURIComponent(f.id)}" style="animation-delay:${Math.min(i, 20) * 30}ms">
      <span class="codigo" style="color:var(--orange)">${icone("route")} ESTEIRA</span>
      <h3>${esc(f.nome)}</h3>
      <div class="meta">
        <span class="chip chip-orange">${icone("rows")}${plural(f.atores.length, "raia", "raias")}</span>
        <span class="chip chip-green">${icone("steps")}${plural(etapas, "etapa", "etapas")}</span>
      </div>
    </a>`;
  }

  function telaListaEsteiras() {
    const html = `
      <div class="migalhas"><a href="#/">Início</a> › <span>Esteira</span></div>
      <section class="painel">
        <span class="eyebrow">${icone("route")} Caminho do cidadão</span>
        <h2>Esteiras</h2>
        <p class="apoio">Escolha um fluxo. As raias mostram quem faz cada passo. Extraído dos mapeamentos em Word — conferir a coluna observações na planilha quando o texto original era incompleto.</p>
      </section>
      <div class="processos" style="margin-top:18px">${estado.fluxos.map(cartaoFluxo).join("")}</div>`;
    montarTela("esteira", html, "Esteiras");
  }

  function lerJogo(id) {
    try { return JSON.parse(localStorage.getItem(C.ESTEIRA_JOGO_KEY) || "{}")[id] || []; } catch (e) { return []; }
  }
  function salvarJogo(id, caminho) {
    const tudo = (() => { try { return JSON.parse(localStorage.getItem(C.ESTEIRA_JOGO_KEY) || "{}"); } catch (e) { return {}; } })();
    tudo[id] = caminho;
    localStorage.setItem(C.ESTEIRA_JOGO_KEY, JSON.stringify(tudo));
  }

  function proximoPadrao(n) {
    if (!n) return null;
    if (n.destino) return n.destino;
    if (/d[uú]vida|ajuste/i.test(n.rotulo)) return n.destinoNao;
    return n.destinoSim || n.destinoNao || null;
  }

  function caminhoFeliz(fluxo) {
    const visto = new Set();
    const lista = [];
    let id = fluxo.inicio && fluxo.inicio.id;
    while (id && !visto.has(id)) {
      visto.add(id);
      const n = fluxo.porId.get(id);
      if (!n) break;
      lista.push(n);
      if (n.tipo === "fim") break;
      id = proximoPadrao(n);
    }
    return lista;
  }

  function cartaoEsteira(n, opts = {}) {
    const cor = corAtor(n.ator);
    const classes = ["esteira-no", n.tipo, opts.atual ? "atual" : "", opts.feito ? "caminho" : "", opts.apagado ? "apagado" : ""].filter(Boolean);
    const estilo = `--forte:${cor.forte};--clara:${cor.clara}`;
    if (n.tipo === "inicio") {
      return `<button type="button" class="${classes.join(" ")}" data-no="${n.id}" style="${estilo}">${icone("pin")}<div class="esteira-no-body">Início</div></button>`;
    }
    if (n.tipo === "fim") {
      return `<button type="button" class="${classes.join(" ")}" data-no="${n.id}"><div class="esteira-no-body">Fim do processo</div></button>`;
    }
    return `<button type="button" class="${classes.join(" ")}" data-no="${n.id}" style="${estilo}">
      <div class="esteira-no-head">${esc(n.tipo === "decisao" || n.tipo === "escolha" ? "Decisão" : (n.ator || n.fase))}</div>
      <div class="esteira-no-body">${esc(n.rotulo)}</div>
    </button>`;
  }

  function trilhaEsteira(nos, atualId, feitos) {
    const cols = window.innerWidth < 720 ? 1 : window.innerWidth < 1100 ? 3 : 4;
    const itens = nos.map((n, i) => cartaoEsteira(n, { atual: n.id === atualId, feito: feitos.has(n.id), apagado: atualId && n.id !== atualId && !feitos.has(n.id) }));
    const linhas = [];
    for (let i = 0; i < itens.length; i += cols) linhas.push(itens.slice(i, i + cols));
    const zigue = cols > 1;
    return `<div class="trilha esteira-trilha">${linhas.map((linha, li) => {
      const reversa = zigue && li % 2 === 1;
      const conteudo = linha.map((item, ii) => `<div class="trilha-item">${item}${ii < linha.length - 1 ? `<span class="seta">${SETA}</span>` : ""}</div>`).join("");
      const ultima = li === linhas.length - 1;
      const lado = !zigue ? "meio" : reversa ? "esq" : "dir";
      const curva = ultima ? "" : `<div class="curva ${lado}">${lado === "meio" ? CURVA_MEIO : CURVA}</div>`;
      return `<div class="trilha-linha ${reversa ? "reversa" : ""}">${conteudo}</div>${curva}`;
    }).join("")}</div>`;
  }

  function telaEsteira(idFluxo) {
    const fluxo = estado.fluxos.find((f) => f.id === idFluxo) || estado.fluxos[0];
    if (!fluxo) {
      montarTela("esteira", `<div class="painel vazio">${icone("route")}<p>A esteira ainda não foi carregada.</p></div>`, "Esteira");
      return;
    }
    estado.fluxo = fluxo;
    estado.jogo = lerJogo(fluxo.id);
    if (estado.jogando && !estado.jogo.length && fluxo.inicio) {
      estado.jogo = [fluxo.inicio.id];
      salvarJogo(fluxo.id, estado.jogo);
    }
    const atual = estado.jogando ? fluxo.porId.get(estado.jogo[estado.jogo.length - 1]) : null;
    const feitos = new Set(estado.jogo);
    const ehDecisao = atual && (atual.tipo === "decisao" || atual.tipo === "escolha");
    const terminou = atual && atual.tipo === "fim";
    const etapa = estado.jogo.length;
    const totalFeliz = Math.max(caminhoFeliz(fluxo).length, 1);
    const pct = estado.jogando ? Math.round((etapa / totalFeliz) * 100) : 0;
    const atores = fluxo.atores.length ? fluxo.atores : [{ id: "—", forte: "#7e7e7e", clara: "#ececec" }];
    const atorPadrao = atores[0].id;

    const celulas = [`<div class="esteira-fase"></div>`];
    fluxo.fases.forEach((fase) => celulas.push(`<div class="esteira-fase">${esc(fase)}</div>`));
    atores.forEach((ator) => {
      celulas.push(`<div class="esteira-ator" style="background:${ator.forte}">${esc(ator.id)}</div>`);
      fluxo.fases.forEach((fase) => {
        const nos = fluxo.nos.filter((n) => (n.ator || atorPadrao) === ator.id && n.fase === fase);
        celulas.push(`<div class="esteira-celula" style="--clara:${ator.clara}">${nos.map((n) => cartaoEsteira(n, {
          atual: atual && atual.id === n.id,
          feito: estado.jogando && feitos.has(n.id) && (!atual || atual.id !== n.id),
          apagado: estado.jogando && atual && atual.id !== n.id && !feitos.has(n.id),
        })).join("")}</div>`);
      });
    });

    const controles = !estado.jogando
      ? `<button class="btn btn-run" id="esteira-jogar">${icone("play")} Percorrer a esteira</button>`
      : terminou
        ? `<span class="chip chip-green">${icone("trophy")} Você chegou ao fim desta rota</span>
           <button class="btn btn-ghost" id="esteira-voltar">${icone("left")} Voltar</button>`
        : ehDecisao
          ? `<button class="btn btn-ghost" id="esteira-voltar" ${etapa <= 1 ? "disabled" : ""}>${icone("left")} Voltar</button>
             <button class="btn btn-run" data-ir="${atual.destinoSim}">${esc(atual.rotuloSim)} ${icone("right")}</button>
             <button class="btn btn-ghost" data-ir="${atual.destinoNao}">${esc(atual.rotuloNao)}</button>`
          : `<button class="btn btn-ghost" id="esteira-voltar" ${etapa <= 1 ? "disabled" : ""}>${icone("left")} Voltar</button>
             <button class="btn btn-run" id="esteira-avancar" data-ir="${atual ? (proximoPadrao(atual) || "") : ""}">${icone("right")} Avançar etapa</button>`;

    const html = `
      <div class="migalhas"><a href="#/">Início</a> › <a href="#/esteira">Esteira</a> › <span>${esc(fluxo.nome)}</span></div>
      <section class="painel">
        <label class="esteira-escolhe">
          <span>Trocar esteira</span>
          <select id="esteira-sel">${estado.fluxos.map((f) => `<option value="${esc(f.id)}" ${f.id === fluxo.id ? "selected" : ""}>${esc(f.nome)}</option>`).join("")}</select>
        </label>
        <div class="proc-topo">
          <div>
            <span class="eyebrow">${icone("route")} Caminho do cidadão</span>
            <h2>${esc(fluxo.nome)}</h2>
            <div class="proc-meta">
              <span class="chip chip-orange">${icone("rows")}${plural(atores.length, "raia", "raias")}</span>
              <span class="chip chip-green">${icone("steps")}${plural(fluxo.nos.filter((n) => n.tipo === "atividade").length, "etapa", "etapas")}</span>
            </div>
          </div>
          <div class="proc-acoes esteira-jogo">
            <button class="btn btn-ghost btn-sm" id="esteira-zerar">${icone("reset")} Reiniciar</button>
            <button class="btn btn-ghost btn-sm" id="esteira-print">${icone("printer")} Imprimir / PDF</button>
          </div>
        </div>
        ${estado.jogando ? `
          <div class="progresso" style="margin-top:16px">
            <div class="progresso-barra"><span style="width:${Math.min(pct, 100)}%"></span></div>
            <div class="progresso-legenda"><span>Etapa ${etapa} · ${esc(atual ? (atual.fase || atual.rotulo) : "")}</span><span>${esc(atual ? atual.rotulo : "")}</span></div>
          </div>` : `<p class="apoio" style="margin:12px 0 0">As raias mostram quem faz cada passo. As linhas ligam a sequência. Clique em <strong>Percorrer a esteira</strong> e use <strong>Avançar etapa</strong>.</p>`}
        <div class="esteira-controle">${controles}</div>
      </section>
      <section class="esteira-board" id="esteira-board" style="margin-top:16px">
        <div class="esteira-wrap" id="esteira-wrap">
          <svg class="esteira-liga" id="esteira-liga"></svg>
          <div class="esteira-grade" id="esteira-grade" style="grid-template-columns:150px repeat(${fluxo.fases.length}, 188px)">${celulas.join("")}</div>
        </div>
      </section>
      ${fluxo.notas.length ? `<section class="esteira-notas">${fluxo.notas.map((n) => `<div class="painel"><h2 class="painel-titulo">${esc(n.rotulo)}</h2><p class="apoio" style="font-size:.9rem;color:var(--ink)">${esc(n.descricao)}</p></div>`).join("")}</section>` : ""}`;

    montarTela("esteira", html, fluxo.nome);
    app.onclick = (ev) => {
      if (!$("#esteira-board") && !ev.target.closest("[data-ir]")) return;
      const ir = ev.target.closest("[data-ir]");
      if (ir && ir.dataset.ir) { avancarEsteira(ir.dataset.ir); return; }
      const btn = ev.target.closest("[data-no]");
      if (btn) abrirNoEsteira(btn.dataset.no);
    };
    const jogar = $("#esteira-jogar");
    if (jogar) jogar.addEventListener("click", () => {
      estado.jogando = true;
      estado.jogo = fluxo.inicio ? [fluxo.inicio.id] : [];
      salvarJogo(fluxo.id, estado.jogo);
      telaEsteira(fluxo.id);
    });
    const voltar = $("#esteira-voltar");
    if (voltar) voltar.addEventListener("click", () => {
      if (estado.jogo.length > 1) {
        estado.jogo = estado.jogo.slice(0, -1);
        salvarJogo(fluxo.id, estado.jogo);
        telaEsteira(fluxo.id);
      }
    });
    $("#esteira-zerar").addEventListener("click", () => {
      estado.jogando = false;
      estado.jogo = [];
      salvarJogo(fluxo.id, []);
      telaEsteira(fluxo.id);
    });
    $("#esteira-print").addEventListener("click", () => window.print());
    const sel = $("#esteira-sel");
    if (sel) sel.addEventListener("change", () => {
      estado.jogando = false;
      location.hash = `#/esteira/${encodeURIComponent(sel.value)}`;
    });
    requestAnimationFrame(() => {
      desenharArestas(fluxo, estado.jogo);
      const board = $("#esteira-board");
      const alvo = atual && $(`[data-no="${atual.id}"]`);
      if (alvo && board) {
        const br = board.getBoundingClientRect();
        const ar = alvo.getBoundingClientRect();
        board.scrollTo({
          left: board.scrollLeft + (ar.left + ar.right) / 2 - (br.left + br.right) / 2,
          top: board.scrollTop + (ar.top + ar.bottom) / 2 - (br.top + br.bottom) / 2,
          behavior: "smooth",
        });
      }
    });
  }

  function avancarEsteira(id) {
    const fluxo = estado.fluxo;
    if (!fluxo || !fluxo.porId.has(id)) return;
    estado.jogando = true;
    estado.jogo = [...estado.jogo, id];
    salvarJogo(fluxo.id, estado.jogo);
    const no = fluxo.porId.get(id);
    if (no.tipo === "fim") {
      aviso(`${icone("trophy")} ${esc(no.descricao || no.rotulo)}`);
      if (/conclu/i.test(no.descricao)) confete();
    }
    telaEsteira(fluxo.id);
  }

  function abrirNoEsteira(id) {
    const fluxo = estado.fluxo;
    const n = fluxo && fluxo.porId.get(id);
    if (!n) return;
    const cor = corAtor(n.ator);
    gaveta.innerHTML = `
      <div class="gaveta-topo" style="--forte:${cor.forte};--clara:${cor.clara}">
        <span class="eyebrow">${esc(n.fase || "Esteira")} · ${esc(n.tipo)}</span>
        <h3 id="gaveta-titulo">${esc(n.rotulo)}</h3>
        <button class="fechar" id="fechar" aria-label="Fechar">${icone("x")}</button>
      </div>
      <div class="gaveta-corpo">
        ${n.ator ? `<span class="chip" style="background:${cor.clara};color:#333"><span class="dot" style="background:${cor.forte}"></span>${esc(n.ator)}</span>` : ""}
        <p class="descricao">${esc(n.descricao)}</p>
        ${n.prazo ? `<div><h4>Prazo</h4><span class="chip chip-orange">${esc(n.prazo)}</span></div>` : ""}
        ${n.observacoes ? `<div><h4>Observações para ajuste</h4><p class="descricao">${esc(n.observacoes)}</p></div>` : ""}
        ${n.sistema ? `<div><h4>Onde fazer</h4><div class="sistemas">${/^https?:/i.test(n.sistema) ? `<a class="chip-sistema" href="${esc(n.sistema)}" target="_blank" rel="noopener">${icone("monitor")}${esc(n.sistema.includes("tamo") ? "Tamo Junto" : n.sistema.includes("ceara") ? "Ceará Credi" : n.sistema)}${icone("external")}</a>` : `<span class="chip-sistema">${icone("monitor")}${esc(n.sistema)}</span>`}</div></div>` : ""}
        ${estado.jogando && (n.destino || n.destinoSim) ? `<div class="filtros">
          ${n.destinoSim ? `<button class="btn btn-run btn-sm" id="e-sim">${esc(n.rotuloSim)}</button>` : ""}
          ${n.destinoNao ? `<button class="btn btn-ghost btn-sm" id="e-nao">${esc(n.rotuloNao)}</button>` : ""}
          ${n.destino ? `<button class="btn btn-run btn-sm" id="e-next">Seguir ${icone("right")}</button>` : ""}
        </div>` : ""}
      </div>`;
    gaveta.classList.add("aberta");
    gaveta.setAttribute("aria-hidden", "false");
    veu.classList.add("aberto");
    $("#fechar").addEventListener("click", () => fecharGaveta());
    const ir = (dest) => { fecharGaveta(); avancarEsteira(dest); };
    if ($("#e-sim")) $("#e-sim").addEventListener("click", () => ir(n.destinoSim));
    if ($("#e-nao")) $("#e-nao").addEventListener("click", () => ir(n.destinoNao));
    if ($("#e-next")) $("#e-next").addEventListener("click", () => ir(n.destino));
  }

  function desenharArestas(fluxo, caminho) {
    const wrap = $("#esteira-wrap");
    const grade = $("#esteira-grade");
    const svg = $("#esteira-liga");
    if (!wrap || !grade || !svg) return;
    const origem = wrap.getBoundingClientRect();
    const w = wrap.offsetWidth;
    const h = wrap.offsetHeight;
    svg.setAttribute("width", w);
    svg.setAttribute("height", h);
    svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
    const pares = new Set();
    (caminho || []).forEach((id, i, arr) => { if (i) pares.add(arr[i - 1] + ">" + id); });
    const box = (id) => {
      const el = grade.querySelector(`[data-no="${id}"]`);
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return {
        l: r.left - origem.left,
        r: r.right - origem.left,
        t: r.top - origem.top,
        b: r.bottom - origem.top,
        cx: r.left - origem.left + r.width / 2,
        cy: r.top - origem.top + r.height / 2,
      };
    };
    const liga = (a0, a1, desvio) => {
      const dx = a1.cx - a0.cx;
      const dy = a1.cy - a0.cy;
      if (Math.abs(dx) < 36) {
        const y0 = dy >= 0 ? a0.b : a0.t;
        const y1 = dy >= 0 ? a1.t : a1.b;
        const x = a0.cx + desvio;
        return `M${a0.cx},${y0} L${x},${y0} L${x},${y1} L${a1.cx},${y1}`;
      }
      const x0 = dx >= 0 ? a0.r : a0.l;
      const x1 = dx >= 0 ? a1.l : a1.r;
      const mid = (x0 + x1) / 2 + desvio;
      return `M${x0},${a0.cy} H${mid} V${a1.cy} H${x1}`;
    };
    const paths = fluxo.arestas.map((a, i) => {
      const a0 = box(a.de);
      const a1 = box(a.para);
      if (!a0 || !a1) return "";
      const ativo = pares.has(a.de + ">" + a.para);
      const frouxo = caminho && caminho.length && !ativo ? " frouxo" : "";
      const desvio = ((i % 5) - 2) * 3;
      return `<path class="${a.tipo}${ativo ? " ativo" : ""}${frouxo}" d="${liga(a0, a1, desvio)}" marker-end="url(#seta-${a.tipo}${ativo ? "-on" : ""})"/>`;
    }).join("");
    svg.innerHTML = `<defs>
      <marker id="seta-seq" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0.8 7.2 4 0 7.2Z" fill="#c9a08a"/></marker>
      <marker id="seta-seq-on" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0.8 7.2 4 0 7.2Z" fill="#39b54a"/></marker>
      <marker id="seta-sim" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0.8 7.2 4 0 7.2Z" fill="#7ecb8a"/></marker>
      <marker id="seta-sim-on" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0.8 7.2 4 0 7.2Z" fill="#39b54a"/></marker>
      <marker id="seta-nao" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0.8 7.2 4 0 7.2Z" fill="#e09a95"/></marker>
      <marker id="seta-nao-on" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0.8 7.2 4 0 7.2Z" fill="#c44d47"/></marker>
    </defs>${paths}`;
  }

  function telaLegenda(ativa) {
    const P = estado.processos;
    const html = `
      <div class="migalhas"><a href="#/">Início</a> › <span>Legenda de cores</span></div>
      <section class="legenda-folha">
        <h2>Legenda - CORES</h2>
        <p class="apoio" style="text-align:center;position:relative;z-index:1;margin:-12px 0 20px">Cada setor tem uma cor forte (cabeçalho do cartão) e uma clara (corpo). Clique em um setor para ver onde ele atua.</p>
        <div class="legenda-lista">
          ${C.UNIDADES.map((u) => {
            const procs = P.filter((p) => p.unidades.includes(u.id));
            const passos = procs.reduce((t, p) => t + p.passos.filter((s) => s.unidade === u.id).length, 0);
            const aberto = ativa === u.id;
            return `<button class="legenda-item ${aberto ? "ativo" : ""}" data-unidade="${u.id}" id="leg-${u.id}" aria-expanded="${aberto}">
                <span><strong>${esc(u.nome)}</strong><small>${plural(passos, "passo", "passos")} em ${plural(procs.length, "processo", "processos")}</small></span>
                <span class="legenda-cores"><span style="background:${u.forte}"></span><span style="background:${u.clara}"></span></span>
              </button>
              ${aberto ? `<div class="legenda-processos">${gradeProcessos(procs)}</div>` : ""}`;
          }).join("")}
        </div>
      </section>`;
    montarTela("legenda", html, "Legenda", !!ativa);
    $$(".legenda-item").forEach((b) => b.addEventListener("click", () => {
      location.hash = ativa === b.dataset.unidade ? "#/legenda" : `#/legenda/${b.dataset.unidade}`;
    }));
    if (ativa) $(`#leg-${ativa}`).scrollIntoView({ behavior: "smooth", block: "start" });
  }

  /* ---------- Avisos ---------- */
  let tAviso;
  function aviso(html) {
    const t = $("#toast");
    t.innerHTML = html;
    t.classList.add("visivel");
    clearTimeout(tAviso);
    tAviso = setTimeout(() => t.classList.remove("visivel"), 3200);
  }

  function confete() {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const cores = ["#39b54a", "#0071bc", "#f15a24", "#d3a61f", "#2db39d", "#ab5b5b"];
    const box = document.createElement("div");
    box.className = "confete";
    box.innerHTML = Array.from({ length: 90 }, () => {
      const c = cores[Math.floor(Math.random() * cores.length)];
      return `<i style="left:${Math.random() * 100}%;background:${c};animation-delay:${Math.random() * 0.6}s;animation-duration:${2 + Math.random() * 1.6}s;transform:rotate(${Math.random() * 360}deg)"></i>`;
    }).join("");
    document.body.appendChild(box);
    setTimeout(() => box.remove(), 4500);
  }

  /* ---------- Rodapé: fonte dos dados ---------- */
  function renderFonte() {
    const el = $("#fonte-dados");
    const quando = estado.atualizadoEm ? estado.atualizadoEm.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" }) : "";
    const textos = {
      "ao-vivo": `Dados ao vivo da planilha · ${quando}`,
      cache: `Sem conexão: usando cópia salva de ${quando}`,
      offline: `Sem conexão: usando cópia local de ${quando}`,
    };
    el.className = `fonte-dados ${estado.fonte}`;
    el.innerHTML = `<span class="dot"></span><span>${textos[estado.fonte] || ""}</span><button type="button" id="recarregar">${icone("refresh")} Atualizar</button>`;
    $("#recarregar").addEventListener("click", iniciar);
  }

  /* ---------- Inicialização ---------- */
  async function iniciar() {
    try {
      const r = await DADOS.carregar();
      estado.processos = r.processos;
      estado.porId = new Map(r.processos.map((p) => [p.id, p]));
      estado.fonte = r.fonte;
      estado.atualizadoEm = r.atualizadoEm;
      try {
        const e = await DADOS.carregarEsteira();
        estado.fluxos = e.fluxos;
      } catch (err) {
        console.warn("Esteira indisponível:", err);
        estado.fluxos = [];
      }
      renderFonte();
      rotear();
    } catch (e) {
      console.error(e);
      app.innerHTML = `<div class="painel vazio">${icone("x")}<p><strong>Não foi possível carregar o catálogo.</strong><br/>Verifique a conexão e tente novamente.</p><button class="btn btn-run" onclick="location.reload()">Tentar de novo</button></div>`;
    }
  }

  function prepararImpressao() {
    document.body.classList.add("imprimindo");
    if (estado.proc && $("#visao")) {
      if (estado.visao !== "trilha") estado._visaoAntesPrint = estado.visao;
      trocarVisao("trilha", true);
    }
    const wrap = $("#esteira-wrap");
    const board = $("#esteira-board");
    const grade = $("#esteira-grade");
    if (wrap && board && grade && estado.fluxo) {
      document.body.classList.add("imprimindo-esteira");
      const pageW = 412 * 3.779527559;
      const pageH = 289 * 3.779527559;
      const chrome = 78;
      const availW = pageW;
      const availH = pageH - chrome;
      const fases = estado.fluxo.fases.length;
      const labelW = 132;
      const h0 = wrap.scrollHeight || wrap.offsetHeight;
      const alvoW = availW * h0 / availH;
      const colW = Math.max(188, (alvoW - labelW) / fases);
      const cardW = Math.min(colW - 20, Math.max(146, colW * 0.78));
      wrap.style.zoom = "1";
      grade.style.gridTemplateColumns = `${labelW}px repeat(${fases}, ${colW}px)`;
      grade.style.setProperty("--print-card", cardW + "px");
      desenharArestas(estado.fluxo, estado.jogo);
      const w = wrap.scrollWidth || wrap.offsetWidth;
      const h = wrap.scrollHeight || wrap.offsetHeight;
      const scale = Math.min(availW / w, availH / h);
      wrap.style.zoom = String(scale);
      board.style.setProperty("--print-scale", String(scale));
    }
  }
  function restaurarImpressao() {
    document.body.classList.remove("imprimindo", "imprimindo-esteira");
    const board = $("#esteira-board");
    const wrap = $("#esteira-wrap");
    const grade = $("#esteira-grade");
    if (wrap) wrap.style.zoom = "";
    if (board) board.style.removeProperty("--print-scale");
    if (grade && estado.fluxo) {
      grade.style.gridTemplateColumns = `150px repeat(${estado.fluxo.fases.length}, 188px)`;
      grade.style.removeProperty("--print-card");
      desenharArestas(estado.fluxo, estado.jogo);
    }
    if (estado._visaoAntesPrint && estado.proc && $("#visao")) {
      trocarVisao(estado._visaoAntesPrint, true);
    }
    estado._visaoAntesPrint = null;
  }
  window.addEventListener("beforeprint", prepararImpressao);
  window.addEventListener("afterprint", restaurarImpressao);

  window.addEventListener("hashchange", () => {
    const procHash = location.hash.match(/^#\/processo\/([^?]+)\?passo=(\d+)/);
    if (procHash && estado.proc && estado.proc.id === decodeURIComponent(procHash[1]) && $("#visao")) {
      abrirPasso(Number(procHash[2]));
      return;
    }
    rotear();
  });

  let tResize;
  window.addEventListener("resize", () => {
    clearTimeout(tResize);
    tResize = setTimeout(() => {
      if (estado.fluxo && $("#esteira-liga")) desenharArestas(estado.fluxo, estado.jogo);
      if (estado.visao === "trilha" && estado.proc && $("#visao .trilha") && colunasTrilha() !== estado.colsTrilha) {
        $("#visao").innerHTML = htmlTrilha(estado.proc);
        atualizarProgresso();
        marcarAtual();
      }
    }, 160);
  });

  (async function () {
    const usuario = await SSO.exigirLogin();
    if (!usuario) return;
    estado.usuario = usuario;
    iniciar();
  })();
})();
