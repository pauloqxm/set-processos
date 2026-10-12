"""Baixa a planilha publicada e grava data/processos-fallback.js (cópia offline do catálogo).

Uso:
    python scripts/gerar_fallback.py
"""

import json
import re
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
CONFIG = RAIZ / "js" / "config.js"
DESTINO = RAIZ / "data" / "processos-fallback.js"


def url_csv() -> str:
    texto = CONFIG.read_text(encoding="utf-8")
    achado = re.search(r'CSV_URL\s*=\s*"([^"]+)"', texto)
    if not achado:
        raise SystemExit("CSV_URL não encontrada em js/config.js")
    return achado.group(1)


def main() -> None:
    url = url_csv()
    print(f"Baixando {url[:80]}...")
    with urllib.request.urlopen(url, timeout=60) as resp:
        csv = resp.read().decode("utf-8")
    if "id_processo" not in csv[:200]:
        raise SystemExit("O conteúdo baixado não parece ser a planilha de processos.")

    payload = {"geradoEm": datetime.now(timezone.utc).isoformat(), "csv": csv}
    DESTINO.parent.mkdir(parents=True, exist_ok=True)
    DESTINO.write_text(
        "/* Gerado por scripts/gerar_fallback.py - não editar à mão */\n"
        f"window.CATALOGO_FALLBACK = {json.dumps(payload, ensure_ascii=False)};\n",
        encoding="utf-8",
    )
    linhas = csv.count("\n")
    print(f"OK: {DESTINO.relative_to(RAIZ)} ({linhas} linhas)")


if __name__ == "__main__":
    main()
