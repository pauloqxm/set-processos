"""Extrai os Word de word_esteira para o CSV da Esteira.

Uso:
    python scripts/extrair_esteiras_word.py
"""

from __future__ import annotations

import csv
import re
import unicodedata
import xml.etree.ElementTree as ET
import zipfile
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
PASTA = RAIZ / "word_esteira"
CSV_DEST = RAIZ / "data" / "esteira-credito.csv"
FALLBACK = RAIZ / "data" / "esteira-fallback.js"
W = "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}"

CAMPOS = [
    "id_fluxo", "nome_fluxo", "id_no", "tipo", "fase", "ator", "rotulo", "descricao",
    "sistema", "prazo", "destino", "destino_se_sim", "destino_se_nao",
    "rotulo_sim", "rotulo_nao", "observacoes",
]

RE_RESP = re.compile(r"Responsável:\s*")
RE_OBS = re.compile(r"\s*Obs\.?:\s*", re.I)
RE_SIM = re.compile(r"^Sim:\s*(.+)$", re.I)
RE_NAO = re.compile(r"^N[aã]o:\s*(.+)$", re.I)
RE_INICIO = re.compile(r"^In[ií]cio\s*[–\-]\s*", re.I)
RE_PRAZO = re.compile(r"(prazo[^.]{0,80}|at[eé]\s+\d+\s*dias?[^.]{0,40}|at[eé]\s+\d+h[^.]{0,40})", re.I)
RE_URL = re.compile(r"(https?://[^\s]+|[\w.-]+\.(?:gov|org|com)\.br[^\s]*)", re.I)
RE_VOLTAR = re.compile(r"voltar para\s+[«\"“']?(.+?)[»\"”']?$", re.I)
RE_SEGUIR = re.compile(r"seguir para\s+[«\"“']?(.+?)[»\"”']?$", re.I)
RE_FIM = re.compile(r"fim do processo|\(fim\)|^fim$", re.I)


def norm(t: str) -> str:
    t = unicodedata.normalize("NFKD", t or "")
    t = "".join(c for c in t if not unicodedata.combining(c))
    t = t.lower()
    t = re.sub(r"[«»\"“”'`]", "", t)
    t = re.sub(r"[^a-z0-9]+", " ", t)
    return re.sub(r"\s+", " ", t).strip()


def slug(nome: str) -> str:
    t = unicodedata.normalize("NFKD", nome)
    t = "".join(c for c in t if not unicodedata.combining(c))
    t = re.sub(r"[^a-zA-Z0-9]+", "_", t).strip("_").lower()
    return t[:70] or "fluxo"


def paragrafos(path: Path) -> list[str]:
    with zipfile.ZipFile(path) as z:
        xml = z.read("word/document.xml")
    root = ET.fromstring(xml)
    out = []
    for p in root.iter(W + "p"):
        t = "".join(n.text or "" for n in p.iter(W + "t"))
        t = re.sub(r"\s+", " ", t).strip()
        if t:
            out.append(t)
    return out


def limpar_ator(a: str) -> tuple[str, str]:
    obs = ""
    a = a.strip().rstrip(".")
    m = RE_OBS.search(a)
    extra = ""
    if m:
        extra = a[m.end():].strip()
        a = a[:m.start()].strip()
        if extra:
            obs = f"Obs. do Word: {extra}"
    if re.search(r"prazo", a, re.I):
        obs = (obs + " | " if obs else "") + "ator possivelmente colado a prazo; conferir"
        a = re.split(r"prazo", a, maxsplit=1, flags=re.I)[0].strip(" -–")
    return a, obs


def eh_decisao(rotulo: str) -> bool:
    return "?" in rotulo


class No:
    def __init__(self, nid, tipo, rotulo, ator="", **kw):
        self.id = nid
        self.tipo = tipo
        self.fase = kw.get("fase", "Fluxo")
        self.ator = ator
        self.rotulo = rotulo
        self.descricao = kw.get("descricao", "")
        self.sistema = kw.get("sistema", "")
        self.prazo = kw.get("prazo", "")
        self.destino = kw.get("destino", "")
        self.destino_sim = kw.get("destino_sim", "")
        self.destino_nao = kw.get("destino_nao", "")
        self.rotulo_sim = kw.get("rotulo_sim", "Sim" if tipo in ("decisao", "escolha") else "")
        self.rotulo_nao = kw.get("rotulo_nao", "Não" if tipo in ("decisao", "escolha") else "")
        self.obs: list[str] = list(kw.get("obs") or [])

    def linha(self, id_fluxo, nome):
        return {
            "id_fluxo": id_fluxo,
            "nome_fluxo": nome,
            "id_no": self.id,
            "tipo": self.tipo,
            "fase": self.fase,
            "ator": self.ator,
            "rotulo": self.rotulo,
            "descricao": self.descricao,
            "sistema": self.sistema,
            "prazo": self.prazo,
            "destino": self.destino,
            "destino_se_sim": self.destino_sim,
            "destino_se_nao": self.destino_nao,
            "rotulo_sim": self.rotulo_sim,
            "rotulo_nao": self.rotulo_nao,
            "observacoes": " | ".join(dict.fromkeys(self.obs)),
        }


def aplicar_extra(no: No, texto: str):
    if no.tipo in ("inicio", "fim"):
        no.obs.append(f"texto extra junto ao {no.tipo}: {texto}")
        if not no.descricao:
            no.descricao = texto
        return
    url = RE_URL.search(texto)
    prazo = RE_PRAZO.search(texto)
    if url and not no.sistema:
        s = url.group(1).rstrip(".,;)")
        if not s.lower().startswith("http"):
            s = "https://" + s
        no.sistema = s
        resto = (texto[:url.start()] + texto[url.end():]).strip(" -–")
        if resto:
            no.obs.append(f"trecho não classificado após sistema: {resto}")
        return
    if prazo and not no.prazo:
        no.prazo = prazo.group(1).strip()
        resto = (texto[:prazo.start()] + texto[prazo.end():]).strip(" -–")
        if resto and len(resto) > 3:
            no.descricao = (no.descricao + " " + resto).strip() if no.descricao else resto
        return
    if no.descricao:
        no.descricao = (no.descricao + " " + texto).strip()
    else:
        no.descricao = texto
    no.obs.append("texto extra do Word anexado à descrição; conferir se é passo, prazo ou sistema")


def extrair_fluxo(path: Path) -> tuple[str, str, list[No]]:
    ps = paragrafos(path)
    if not ps:
        return slug(path.stem), path.stem, []
    nome = ps[0]
    fid = slug(path.stem)
    if fid == "esteira_mei":
        fid = "esteira_cooperativas"

    nos: list[No] = []
    nseq = 0

    def novo(tipo, rotulo, ator="", **kw) -> No:
        nonlocal nseq
        nid = f"n{nseq:02d}"
        nseq += 1
        no = No(nid, tipo, rotulo, ator, **kw)
        nos.append(no)
        return no

    inicio = novo("inicio", "Início do processo", obs=["fase não informada no Word; preenchida como Fluxo"])
    atual: No | None = inicio
    pendente_decisao: No | None = None

    i = 1
    while i < len(ps):
        t = ps[i]
        msim = RE_SIM.match(t)
        mnao = RE_NAO.match(t)
        if msim or mnao:
            if not pendente_decisao:
                if atual and atual.tipo == "decisao":
                    pendente_decisao = atual
                else:
                    pendente_decisao = novo(
                        "decisao", "Decisão não rotulada no Word",
                        atual.ator if atual else "",
                        obs=["ramo Sim/Não sem pergunta própria; decisão criada na extração"],
                    )
            ramo = (msim or mnao).group(1).strip()
            chave = "sim" if msim else "nao"
            setattr(pendente_decisao, f"_ramo_{chave}", ramo)
            i += 1
            continue

        if RE_RESP.search(t):
            rotulo, ator_bruto = RE_RESP.split(t, 1)
            rotulo = RE_INICIO.sub("", rotulo).strip(" -–")
            ator, obs_ator = limpar_ator(ator_bruto)
            obs = ["fase não informada no Word; preenchida como Fluxo"]
            if obs_ator:
                obs.append(obs_ator)
            if not re.search(r"\sResponsável:", t):
                obs.append("faltava espaço antes de Responsável")
            tipo = "decisao" if eh_decisao(rotulo) else "atividade"
            if tipo == "decisao":
                obs.append("pergunta e passo no mesmo parágrafo; conferir se a atividade anterior deveria ser separada")
            if RE_FIM.search(rotulo) and not eh_decisao(rotulo):
                tipo = "fim"
            no = novo(tipo, rotulo or "Passo sem rótulo", ator, obs=obs)
            if not rotulo:
                no.obs.append("rótulo vazio no Word")
            if not ator:
                no.obs.append("ator não informado no Word")
            atual = no
            pendente_decisao = no if tipo == "decisao" else None
            i += 1
            continue

        if RE_FIM.search(t) and not RE_RESP.search(t):
            novo("fim", "Fim do processo", atual.ator if atual else "", descricao=t,
                 obs=["fim citado em linha solta; conferir responsável"])
            atual = nos[-1]
            pendente_decisao = None
            i += 1
            continue

        if atual:
            aplicar_extra(atual, t)
        else:
            inicio.descricao = t
            inicio.obs.append("texto antes do primeiro passo anexado ao início")
        i += 1

    if not any(n.tipo == "fim" for n in nos):
        novo("fim", "Fim do processo", nos[-1].ator if nos else "",
             obs=["fim não explícito no Word; nó criado na extração"])

    ligar(nos)
    return fid, nome, nos


def achar(nos: list[No], texto: str) -> No | None:
    alvo = norm(texto)
    if not alvo:
        return None
    for n in nos:
        if n.tipo == "inicio":
            continue
        r = norm(n.rotulo)
        if r == alvo or r.startswith(alvo) or alvo.startswith(r):
            return n
    for n in nos:
        if n.tipo == "inicio":
            continue
        r = norm(n.rotulo)
        if alvo in r or r in alvo:
            return n
    return None


def primeiro_fim(nos: list[No], depois: No | None = None) -> No:
    fins = [n for n in nos if n.tipo == "fim"]
    if depois:
        idx = nos.index(depois)
        for n in nos[idx + 1:]:
            if n.tipo == "fim":
                return n
    return fins[-1]


def resolver_ramo(nos: list[No], origem: No, texto: str, lado: str) -> str:
    t = texto.strip().strip("«»\"“”'")
    if RE_FIM.search(t) and "voltar" not in t.lower() and "seguir" not in t.lower():
        dest = primeiro_fim(nos, origem)
        origem.obs.append(f"{lado}: destino Fim inferido do texto")
        return dest.id

    m_voltar = RE_VOLTAR.search(t)
    m_seguir = RE_SEGUIR.search(t)
    acao = t
    alvo = None
    if m_voltar:
        alvo = m_voltar.group(1).strip(" «»\"“”'")
        acao = t[:m_voltar.start()].strip(" eE")
        origem.obs.append(f"{lado}: laço 'voltar para' resolvido por aproximação de rótulo; conferir")
    elif m_seguir:
        alvo = m_seguir.group(1).strip(" «»\"“”'")
        acao = t[:m_seguir.start()].strip(" eE")
        origem.obs.append(f"{lado}: 'seguir para' resolvido por aproximação de rótulo; conferir")

    acao = re.sub(r"\([^)]*\)\s*$", "", acao).strip(" .,;")
    no_acao = achar(nos, acao) if acao and len(norm(acao)) > 8 else None
    no_alvo = achar(nos, alvo) if alvo else None

    if no_acao and no_alvo:
        if not no_acao.destino:
            no_acao.destino = no_alvo.id
        return no_acao.id
    if no_alvo:
        return no_alvo.id
    if no_acao:
        return no_acao.id

    origem.obs.append(f"{lado}: destino não encontrado com segurança ({t[:120]}); preencher na planilha")
    return ""


def ligar(nos: list[No]):
    for i, n in enumerate(nos):
        if n.tipo == "fim":
            continue
        if n.tipo == "decisao":
            sim = getattr(n, "_ramo_sim", "")
            nao = getattr(n, "_ramo_nao", "")
            if sim:
                n.destino_sim = resolver_ramo(nos, n, sim, "Sim")
            else:
                n.obs.append("ramo Sim ausente no Word")
            if nao:
                n.destino_nao = resolver_ramo(nos, n, nao, "Não")
            else:
                n.obs.append("ramo Não ausente no Word")
            if not n.destino_sim and i + 1 < len(nos):
                n.destino_sim = nos[i + 1].id
                n.obs.append("Sim sem destino; usado o próximo passo")
            continue
        if n.destino:
            continue
        j = i + 1
        while j < len(nos) and nos[j].tipo == "inicio":
            j += 1
        if j < len(nos):
            n.destino = nos[j].id
        else:
            n.obs.append("sem próximo passo; conferir se deveria encerrar")


def ler_mei() -> list[dict]:
    if not CSV_DEST.exists():
        return []
    with CSV_DEST.open(encoding="utf-8", newline="") as f:
        rows = list(csv.DictReader(f))
    out = []
    for r in rows:
        if r.get("id_fluxo") != "esteira_mei":
            continue
        linha = {c: r.get(c, "") or "" for c in CAMPOS}
        if "observacoes" not in r:
            linha["observacoes"] = ""
        out.append(linha)
    return out


def main():
    mei = ler_mei()
    linhas = list(mei)
    for path in sorted(PASTA.glob("*.docx")):
        fid, nome, nos = extrair_fluxo(path)
        for n in nos:
            if n.tipo != "inicio" and not n.fase:
                n.fase = "Fluxo"
            linhas.append(n.linha(fid, nome))
        print(f"OK {path.name}: {len(nos)} nós ({fid})")

    CSV_DEST.parent.mkdir(parents=True, exist_ok=True)
    with CSV_DEST.open("w", encoding="utf-8", newline="") as f:
        w = csv.DictWriter(f, fieldnames=CAMPOS)
        w.writeheader()
        w.writerows(linhas)

    from datetime import datetime, timezone
    import json
    csv_txt = CSV_DEST.read_text(encoding="utf-8")
    payload = {"geradoEm": datetime.now(timezone.utc).isoformat(), "csv": csv_txt}
    FALLBACK.write_text(
        "/* Gerado por scripts/extrair_esteiras_word.py */\n"
        f"window.ESTEIRA_FALLBACK = {json.dumps(payload, ensure_ascii=False)};\n",
        encoding="utf-8",
    )
    fluxos = len({r["id_fluxo"] for r in linhas})
    print(f"CSV {CSV_DEST.relative_to(RAIZ)}: {len(linhas)} linhas, {fluxos} fluxos")


if __name__ == "__main__":
    main()
