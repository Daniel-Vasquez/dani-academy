# Archivo: scripts/validar-tanda.py
# Compara las lecciones editadas con su versión en Git y comprueba las reglas del plan.
# Uso: python3 scripts/validar-tanda.py <ref-git> <carpeta-del-curso>...
#   p. ej.: python3 scripts/validar-tanda.py HEAD src/content/sections/typescript-desde-cero
import re
import subprocess
import sys
from pathlib import Path

W = re.compile(r"\w+")
FENCE = re.compile(r"^```[\s\S]*?^```", re.M)


def partes(texto):
    _, fm, cuerpo = texto.split("---", 2)
    return fm, cuerpo


def prosa(cuerpo):
    return len(W.findall(FENCE.sub("", cuerpo)))


def revisar(ruta, ref):
    errores, avisos = [], []
    nuevo = Path(ruta).read_text(encoding="utf-8")
    viejo = subprocess.run(["git", "show", f"{ref}:{ruta}"], capture_output=True, text=True).stdout
    fm, cuerpo = partes(nuevo)

    # 1. Frontmatter: idéntico salvo minutes
    if viejo:
        fm_viejo, cuerpo_viejo = partes(viejo)
        quitar = lambda f: re.sub(r"^minutes:.*$", "", f, flags=re.M)
        if quitar(fm) != quitar(fm_viejo):
            errores.append("el frontmatter ha cambiado (solo se permite minutes)")

        # 2. Código: los bloques que desaparecen se listan para revisarlos a mano
        bloques = lambda c: {b.strip() for b in FENCE.findall(c)}
        for b in bloques(cuerpo_viejo) - bloques(cuerpo):
            avisos.append(f"bloque de código eliminado o cambiado: {b.splitlines()[0]} {b.splitlines()[1][:60] if len(b.splitlines()) > 1 else ''}")
        antes, despues = prosa(cuerpo_viejo), prosa(cuerpo)
        avisos.append(f"prosa {antes} → {despues} palabras ({round(100 * (despues - antes) / antes)} %)")

    # 3. Estructura: Paso 1..N, Ejercicio práctico y Resumen, en orden
    h2 = re.findall(r"^## (.*)$", FENCE.sub("", cuerpo), re.M)
    pasos = [h for h in h2 if h.startswith("Paso ")]
    numeros = [int(re.match(r"Paso (\d+):", p).group(1)) for p in pasos if re.match(r"Paso (\d+):", p)]
    if numeros != list(range(1, len(numeros) + 1)) or len(numeros) != len(pasos):
        errores.append(f"pasos mal numerados: {numeros}")
    if h2[-2:] != ["Ejercicio práctico", "Resumen"]:
        errores.append("los dos últimos ## deben ser Ejercicio práctico y Resumen")
    if re.search(r"^#\s", FENCE.sub("", cuerpo), re.M):
        errores.append("hay un # (h1) en el cuerpo")

    # 4. Callouts: balanceados, con línea en blanco, y los tipos que tocan
    aperturas = re.findall(r'<Callout type="(\w+)"[^>]*>', cuerpo)
    sin_codigo = FENCE.sub("", cuerpo)
    if len(re.findall(r"<Callout ", sin_codigo)) != sin_codigo.count("</Callout>"):
        errores.append("Callout sin cerrar")
    if re.search(r'<Callout type="\w+"[^>]*>\n(?!\n)|[^\n]\n</Callout>', cuerpo):
        errores.append("Callout sin línea en blanco tras la apertura o antes del cierre")
    if aperturas.count("exercise") != 1 or aperturas.count("mastery") != 1:
        errores.append("debe haber un exercise y un mastery")
    for bloque in re.split(r"^## ", cuerpo, flags=re.M)[1:]:
        titulo = bloque.splitlines()[0]
        if titulo.startswith("Paso") and FENCE.search(bloque) and 'type="risk"' not in bloque:
            errores.append(f"«{titulo[:40]}» tiene código y no tiene risk")
    for risk in re.findall(r'<Callout type="risk">([\s\S]*?)</Callout>', cuerpo):
        vinetas = re.findall(r"^- ", risk, re.M)
        if len(vinetas) > 3:
            avisos.append(f"risk con {len(vinetas)} viñetas (máximo 3)")

    # 5. Contenido prohibido
    if re.search(r"^\s*(//|#)\s*\.\.\.|/\* resto|completa tú", cuerpo, re.M):
        errores.append("código incompleto (// ... o similar)")
    if re.search(r"^(import|export)\s", FENCE.sub("", cuerpo), re.M):
        errores.append("import/export fuera de un bloque de código")
    if re.search(r"\bclass(Name)?=", re.sub(r"`[^`\n]*`", "", FENCE.sub("", cuerpo))):
        errores.append("clases o HTML en la lección")
    if re.search(r"[Uu]na analogía", cuerpo):
        avisos.append("queda una analogía")
    intro = cuerpo[: cuerpo.find("\n## ")]
    if prosa(intro) > 70:
        avisos.append(f"la entrada tiene {prosa(intro)} palabras (objetivo: 60 o menos)")
    return errores, avisos


def main():
    ref, carpetas = sys.argv[1], sys.argv[2:]
    total = 0
    for carpeta in carpetas:
        for ruta in sorted(Path(carpeta).glob("*.mdx")):
            errores, avisos = revisar(str(ruta), ref)
            total += len(errores)
            print(f"{'✗' if errores else '✓'} {ruta.name}")
            for e in errores:
                print(f"    ERROR  {e}")
            for a in avisos:
                print(f"    aviso  {a}")
    sys.exit(1 if total else 0)


main()
