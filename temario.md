# Temario · Dani Academy

> Documento generado en la **Fase 2** a partir de `respuestas.md`.
> Es la fuente de contenido de la plataforma que se planificará en la Fase 3 (`planificacion.md`).

---

## 0. Cómo está organizado

### 0.1 Jerarquía

| Nivel de la jerarquía | Qué es | Ejemplo |
|---|---|---|
| **Nivel** | Básico, Intermedio o Avanzado | Básico |
| **Curso** (módulo) | Un tema completo. Termina con una **evaluación de 5 preguntas** | `B1 · TypeScript desde cero` |
| **Sección** | Una sesión de estudio de **~1 hora**. Tiene su botón *Marcar como leído* | `B1.3 · Arrays, tuplas y objetos` |

### 0.2 Formato de cada sección

Todas las secciones siguen la misma estructura, pensada para tu forma de aprender (código + práctica):

- **Contenido:** qué se enseña (teoría breve).
- **Ejemplo:** código para leer y ejecutar.
- **Ejercicio:** lo que debes construir o resolver tú.
- **Lo dominas si…:** criterio concreto para saber que puedes pasar a la siguiente sección.

Cada curso cierra con:

- **Proyecto del curso:** integra todas sus secciones en algo real.
- **Evaluación final:** los 5 temas sobre los que tratarán las 5 preguntas.
- **Referencias:** documentación oficial para profundizar.

### 0.3 Identificadores (útiles para la plataforma)

- Cada curso tiene un **ID** (`B1`, `I3`, `A2`…) y un **slug** (`typescript-desde-cero`).
- Cada sección tiene un ID compuesto (`B1.3`). Ese ID será la clave para guardar el progreso en MongoDB.

### 0.4 Ritmo estimado

Con **4 sesiones de 1 hora por semana**:

| Nivel | Cursos | Secciones | Semanas aprox. |
|---|---|---|---|
| Básico | 7 | 40 | ~10 |
| Intermedio | 8 | 46 | ~12 |
| Avanzado | 8 | 40 | ~10 |
| Proyecto final | 1 | 8 | ~2 |
| **Total** | **24** | **134** | **~34 semanas (~8 meses)** |

> Las semanas incluyen el tiempo de las secciones. Reserva sesiones extra para los proyectos de curso cuando lo necesites: no hay prisa, cada nivel entrega valor por sí solo.

### 0.5 Orden recomendado y dependencias

```
BÁSICO
  B1 TypeScript ──┬──> B5 MongoDB esencial ──> I4 Modelado de datos ──> A2 MongoDB avanzado
                  ├──> B6 React esencial ────> I2 React intermedio ───> A8 Arquitectura Astro + React
                  └──> I1 TypeScript intermedio ──> A1 TypeScript avanzado
  B2 Git ───────────────────────────────────────────────────────────> A7 CI/CD
  B3 Cómo funciona la web ──> I3 Backend con Astro ──> I5 Auth a fondo ──> A5 Seguridad
                          └─> I6 Servidores Linux ──> A4 Despliegue en VPS
  B4 Fundamentos de BD ──> B5 ──> ... ──> A3 SQL y PostgreSQL
  B7 Tailwind esencial ──> I7 Sistema de diseño
INTERMEDIO
  I8 Testing ──> A7 CI/CD
AVANZADO
  A6 Rendimiento y observabilidad
PROYECTO FINAL (requiere todo lo anterior)
```

Orden lineal sugerido (el que mostrará el índice de la plataforma):

1. **Básico:** B1 → B2 → B3 → B4 → B5 → B6 → B7
2. **Intermedio:** I1 → I2 → I3 → I4 → I5 → I6 → I7 → I8
3. **Avanzado:** A1 → A2 → A3 → A4 → A5 → A6 → A7 → A8
4. **Proyecto final:** P1

### 0.6 Primer curso

Se empieza por **B1 · TypeScript desde cero**, tal como se propuso en `respuestas.md`: está en todos tus proyectos, hoy es una caja negra y mejora todo lo demás (React, APIs y MongoDB). Es también el curso que se maquetará primero en la plataforma.

---

## Índice

### Nivel Básico
- [B1 · TypeScript desde cero](#b1--typescript-desde-cero) (8 secciones)
- [B2 · Git y flujo de trabajo](#b2--git-y-flujo-de-trabajo) (4 secciones)
- [B3 · Cómo funciona la web](#b3--cómo-funciona-la-web) (5 secciones)
- [B4 · Fundamentos de bases de datos](#b4--fundamentos-de-bases-de-datos) (5 secciones)
- [B5 · MongoDB esencial](#b5--mongodb-esencial) (6 secciones)
- [B6 · React esencial](#b6--react-esencial) (7 secciones)
- [B7 · Tailwind CSS v4 esencial](#b7--tailwind-css-v4-esencial) (5 secciones)

### Nivel Intermedio
- [I1 · TypeScript intermedio](#i1--typescript-intermedio) (6 secciones)
- [I2 · React intermedio](#i2--react-intermedio) (6 secciones)
- [I3 · Backend con Astro](#i3--backend-con-astro) (6 secciones)
- [I4 · Modelado de datos con MongoDB](#i4--modelado-de-datos-con-mongodb) (6 secciones)
- [I5 · Autenticación y autorización a fondo](#i5--autenticación-y-autorización-a-fondo) (5 secciones)
- [I6 · Servidores Linux](#i6--servidores-linux) (6 secciones)
- [I7 · Sistema de diseño con Tailwind v4](#i7--sistema-de-diseño-con-tailwind-v4) (5 secciones)
- [I8 · Testing](#i8--testing) (6 secciones)

### Nivel Avanzado
- [A1 · TypeScript avanzado](#a1--typescript-avanzado) (5 secciones)
- [A2 · MongoDB avanzado](#a2--mongodb-avanzado) (5 secciones)
- [A3 · SQL y PostgreSQL](#a3--sql-y-postgresql) (6 secciones)
- [A4 · Despliegue en servidores propios](#a4--despliegue-en-servidores-propios) (6 secciones)
- [A5 · Seguridad web](#a5--seguridad-web) (5 secciones)
- [A6 · Rendimiento y observabilidad](#a6--rendimiento-y-observabilidad) (4 secciones)
- [A7 · CI/CD con GitHub Actions](#a7--cicd-con-github-actions) (4 secciones)
- [A8 · Arquitectura con Astro y React](#a8--arquitectura-con-astro-y-react) (5 secciones)

### Proyecto final
- [P1 · Proyecto integrador](#p1--proyecto-integrador) (8 secciones)

---

# NIVEL BÁSICO

> **Meta del nivel:** entender las piezas que ya usas (TypeScript, Git, HTTP, MongoDB, React, Tailwind) en lugar de copiarlas. Al terminar, ningún archivo de tus proyectos actuales debería ser una caja negra.

---

## B1 · TypeScript desde cero

| Dato | Valor |
|---|---|
| ID / slug | `B1` / `typescript-desde-cero` |
| Secciones | 8 (~8 h) |
| Prerrequisitos | JavaScript (ya lo dominas) |
| Objetivo | Escribir y leer TypeScript con soltura en proyectos Astro y entender su configuración |

**Al terminar podrás:** tipar funciones, objetos y respuestas de APIs; leer los errores del compilador; configurar `tsconfig.json` en un proyecto Astro y dejar de usar `any` por miedo.

### B1.1 · Qué es TypeScript y por qué existe

**Contenido**
- TypeScript = JavaScript + un sistema de tipos que se comprueba **antes** de ejecutar.
- Los tipos desaparecen al compilar: el navegador y Node solo ven JavaScript.
- Tipado estático vs dinámico. Errores en tiempo de compilación vs en tiempo de ejecución.
- Instalación y uso de `tsc` y `tsx` (ejecutar `.ts` directamente).
- El editor como herramienta: *hover*, autocompletado, *Go to Definition* en VS Code.

**Ejemplo**
```ts
// suma.ts
function sumar(a: number, b: number): number {
  return a + b;
}

sumar(2, 3);     // ✅ 5
sumar("2", 3);   // ❌ Argument of type 'string' is not assignable to parameter of type 'number'.
```
```bash
npm init -y
npm i -D typescript tsx
npx tsc --init
npx tsx suma.ts
```

**Ejercicio**
- Crea una carpeta `ts-playground`, instala `typescript` y `tsx`.
- Copia una función tuya de JavaScript (del Planificador o de la app de entrenamiento), conviértela a `.ts` y corrige todos los errores que aparezcan.
- Compila con `npx tsc` y abre el `.js` generado: comprueba que los tipos han desaparecido.

**Lo dominas si…** puedes explicar con tus palabras por qué TypeScript no hace tu código más lento en producción.

### B1.2 · Tipos primitivos e inferencia

**Contenido**
- `string`, `number`, `boolean`, `null`, `undefined`, `bigint`, `symbol`.
- **Inferencia:** cuándo NO hace falta escribir el tipo.
- Anotaciones explícitas: cuándo SÍ conviene (parámetros, retornos públicos).
- `any` vs `unknown` vs `never`: por qué `any` apaga el compilador.
- Tipos literales (`"light" | "dark"`) y `const` vs `let`.

**Ejemplo**
```ts
let nombre = "Dani";           // inferido: string
const tema = "dark";           // inferido: "dark" (literal)
let edad: number;              // anotado porque aún no tiene valor

function parsear(valor: unknown) {
  if (typeof valor === "string") return valor.toUpperCase(); // aquí es string
  return null;
}
```

**Ejercicio**
- Escribe 10 declaraciones sin anotar tipos y, con *hover* en VS Code, anota al lado en un comentario el tipo inferido. Predice antes de mirar.
- Reescribe una función que reciba `any` para que reciba `unknown` y compruebe el tipo antes de usarlo.

**Lo dominas si…** sabes cuándo dejar que TypeScript infiera y cuándo anotar, y nunca usas `any` sin una razón explícita.

### B1.3 · Arrays, tuplas y objetos

**Contenido**
- `string[]` vs `Array<string>`.
- Tuplas: `[number, number]` (coordenadas, pares clave-valor).
- Tipos de objeto en línea, propiedades opcionales (`?`) y `readonly`.
- *Excess property checking*: por qué TypeScript se queja de propiedades de más.
- Optional chaining (`?.`) y nullish coalescing (`??`) con tipos.

**Ejemplo**
```ts
const pesos: number[] = [80.5, 79.8, 79.2];
const punto: [number, number] = [10, 20];

const entreno: { tipo: string; minutos: number; notas?: string } = {
  tipo: "running",
  minutos: 30,
};

const largo = entreno.notas?.length ?? 0;
```

**Ejercicio**
- Modela con tipos en línea un día de tu app de entrenamiento: fecha, lista de ejercicios (nombre, series, repeticiones, peso) y agua consumida.
- Escribe una función que reciba ese día y devuelva el volumen total (series × repeticiones × peso).

**Lo dominas si…** puedes tipar cualquier objeto JSON que ya uses en tus proyectos sin consultar la documentación.

### B1.4 · `type` vs `interface`

**Contenido**
- Alias de tipo (`type`) e interfaces (`interface`).
- Diferencias reales: `interface` se puede extender y fusionar; `type` admite uniones y tipos calculados.
- Convención práctica: `interface` para formas de objetos, `type` para uniones y utilidades (o `type` para todo, pero de forma consistente).
- `extends` en interfaces e intersección (`&`) en types.

**Ejemplo**
```ts
interface Usuario {
  id: string;
  nombre: string;
  email: string;
}

interface Admin extends Usuario {
  permisos: string[];
}

type Tema = "light" | "dark";
type UsuarioConTema = Usuario & { tema: Tema };
```

**Ejercicio**
- Convierte los tipos en línea de B1.3 en interfaces reutilizables (`Ejercicio`, `DiaEntreno`).
- Crea un `type Categoria` con las categorías de color de tu Planificador 2026.

**Lo dominas si…** puedes justificar por qué elegiste `type` o `interface` en cada caso.

### B1.5 · Funciones tipadas

**Contenido**
- Tipar parámetros, retornos, parámetros opcionales y valores por defecto.
- Funciones como tipos: `type Handler = (e: Evento) => void`.
- Funciones asíncronas: `Promise<T>`.
- Sobrecargas (solo conocerlas).
- `void` vs `undefined`.

**Ejemplo**
```ts
interface Tarea {
  id: string;
  titulo: string;
  hecha: boolean;
}

async function obtenerTareas(url: string): Promise<Tarea[]> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return (await res.json()) as Tarea[];
}

type Filtro = (t: Tarea) => boolean;
const pendientes: Filtro = (t) => !t.hecha;
```

**Ejercicio**
- Escribe `obtenerUsuario(id: string): Promise<Usuario | null>` que llame a `https://jsonplaceholder.typicode.com/users/:id` y devuelva `null` si la respuesta no es 200.
- Explica en un comentario por qué el `as Tarea[]` es una "promesa" que tú haces al compilador y no una verificación real (lo resolveremos con Zod en I1).

**Lo dominas si…** tipas cualquier función asíncrona de tus proyectos con su `Promise<T>` correcto.

### B1.6 · Uniones y *narrowing*

**Contenido**
- Uniones (`A | B`) y cómo TypeScript "estrecha" el tipo.
- *Type guards*: `typeof`, `instanceof`, `in`, comparaciones de igualdad.
- **Uniones discriminadas** (la herramienta más útil del curso).
- Comprobación exhaustiva con `never` en un `switch`.

**Ejemplo**
```ts
type Resultado =
  | { ok: true; datos: string[] }
  | { ok: false; error: string };

function mostrar(r: Resultado) {
  if (r.ok) {
    console.log(r.datos.length); // aquí TS sabe que existe `datos`
  } else {
    console.error(r.error);      // aquí sabe que existe `error`
  }
}

type Actividad = { tipo: "fuerza"; series: number } | { tipo: "running"; km: number };

function resumen(a: Actividad): string {
  switch (a.tipo) {
    case "fuerza": return `${a.series} series`;
    case "running": return `${a.km} km`;
    default: {
      const _exhaustivo: never = a;
      return _exhaustivo;
    }
  }
}
```

**Ejercicio**
- Añade `{ tipo: "nutricion"; kcal: number }` a `Actividad` y observa cómo el compilador te obliga a manejar el nuevo caso.
- Modela el estado de una petición: `idle | loading | success | error` con una unión discriminada.

**Lo dominas si…** usas uniones discriminadas en lugar de objetos con muchos campos opcionales.

### B1.7 · Módulos, tipos de librerías y `tsconfig.json`

**Contenido**
- `import type` / `export type`.
- De dónde salen los tipos de las librerías: tipos incluidos vs paquetes `@types/*`.
- Archivos `.d.ts` y cómo leerlos (Ctrl/Cmd + clic).
- `tsconfig.json` línea por línea: `strict`, `target`, `module`, `moduleResolution`, `paths`, `include`.
- Alias de rutas (`@/components/...`).

**Ejemplo**
```jsonc
// tsconfig.json típico de Astro
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist"],
  "compilerOptions": {
    "baseUrl": ".",
    "paths": { "@/*": ["src/*"] },
    "jsx": "react-jsx",
    "jsxImportSource": "react"
  }
}
```
```ts
import type { Usuario } from "@/types/usuario";
```

**Ejercicio**
- Abre el `tsconfig.json` de tu app de entrenamiento y comenta cada opción con lo que hace.
- Sigue `astro/tsconfigs/strict` hasta el archivo real dentro de `node_modules` y lista qué opciones activa.
- Añade el alias `@/*` y migra tres imports relativos (`../../..`).

**Lo dominas si…** puedes crear un `tsconfig.json` desde cero y explicar cada línea.

### B1.8 · TypeScript en Astro

**Contenido**
- Tipar `Astro.props` con `interface Props`.
- Tipos que genera Astro (`.astro/types.d.ts`) y `astro check`.
- Tipar endpoints con `APIRoute`.
- Variables de entorno tipadas (`import.meta.env`, `astro:env`).
- Errores comunes en `.astro` y cómo leerlos.

**Ejemplo**
```astro
---
// src/components/Tarjeta.astro
interface Props {
  titulo: string;
  descripcion?: string;
  nivel: "basico" | "intermedio" | "avanzado";
}
const { titulo, descripcion = "", nivel } = Astro.props;
---
<article data-nivel={nivel}>
  <h2>{titulo}</h2>
  {descripcion && <p>{descripcion}</p>}
</article>
```
```ts
// src/pages/api/hola.ts
import type { APIRoute } from "astro";

export const GET: APIRoute = ({ url }) => {
  const nombre = url.searchParams.get("nombre") ?? "mundo";
  return Response.json({ mensaje: `Hola, ${nombre}` });
};
```

**Ejercicio**
- Ejecuta `npx astro check` en tu app de entrenamiento y corrige todos los errores.
- Tipa las `Props` de todos los componentes `.astro` de una página.

**Lo dominas si…** `astro check` pasa sin errores en uno de tus proyectos y no queda ningún `any` implícito.

### Proyecto del curso B1
**"Tipar la app de entrenamiento"**: crea una carpeta `src/types/` con los tipos de dominio (usuario, entreno, comida, hidratación), activa `strict`, elimina todos los `any` y consigue que `astro check` pase limpio.

### Evaluación final B1 (5 preguntas)
1. Inferencia de tipos vs anotación explícita.
2. Diferencia entre `any` y `unknown`.
3. `type` vs `interface`.
4. *Narrowing* en una unión discriminada.
5. Qué hace `strict` en `tsconfig.json`.

### Referencias
- TypeScript Handbook: https://www.typescriptlang.org/docs/handbook/intro.html
- Astro + TypeScript: https://docs.astro.build/en/guides/typescript/

---

## B2 · Git y flujo de trabajo

| Dato | Valor |
|---|---|
| ID / slug | `B2` / `git-y-flujo-de-trabajo` |
| Secciones | 4 (~4 h) |
| Prerrequisitos | Comandos básicos de Git |
| Objetivo | Trabajar con ramas, Pull Requests y resolver conflictos sin miedo |

**Al terminar podrás:** entender qué pasa dentro de Git, trabajar por ramas, abrir PRs en GitHub y deshacer errores.

### B2.1 · El modelo mental de Git

**Contenido**
- *Working directory*, *staging area* y repositorio.
- Qué es un *commit* (una foto, no un diff) y qué es `HEAD`.
- `git status`, `git diff`, `git diff --staged`, `git log --oneline --graph`.
- Buenos mensajes de commit (Conventional Commits: `feat:`, `fix:`, `docs:`).
- `.gitignore`: por qué `.env` y `node_modules` nunca se suben.

**Ejemplo**
```bash
git add -p                # elegir trozos concretos para el commit
git commit -m "feat: añade gráfica de peso semanal"
git log --oneline --graph --all
```

**Ejercicio**
- En un repo de práctica, haz 5 commits pequeños con `git add -p` y mensajes Conventional Commits.
- Revisa el `.gitignore` de tus proyectos y comprueba con `git ls-files | grep env` que no hay secretos versionados.

**Lo dominas si…** puedes dibujar en papel las tres zonas de Git y dónde está cada archivo.

### B2.2 · Ramas y *merge*

**Contenido**
- Una rama es solo un puntero a un commit.
- `git switch -c`, `git merge`, *fast-forward* vs *merge commit*.
- Flujo por ramas: `main` siempre desplegable, una rama por funcionalidad.
- Ramas de *preview* en Vercel.

**Ejemplo**
```bash
git switch -c feat/modo-oscuro
# ...cambios y commits...
git switch main
git merge feat/modo-oscuro
git branch -d feat/modo-oscuro
```

**Ejercicio**
- Crea dos ramas desde `main` que modifiquen archivos distintos y mézclalas.
- Sube una rama a GitHub y comprueba que Vercel genera una URL de *preview*.

**Lo dominas si…** trabajas cada cambio en una rama propia sin pensarlo.

### B2.3 · Conflictos y cómo deshacer cosas

**Contenido**
- Por qué aparecen conflictos y cómo leer los marcadores `<<<<<<<`, `=======`, `>>>>>>>`.
- Resolver conflictos en VS Code.
- Deshacer: `git restore`, `git restore --staged`, `git commit --amend`, `git revert`, `git reset` (soft/mixed/hard).
- `git stash` y `git reflog` (tu red de seguridad).

**Ejemplo**
```bash
git restore archivo.ts              # descarta cambios locales
git restore --staged archivo.ts     # saca del staging
git revert a1b2c3d                  # crea un commit que deshace otro (seguro en ramas compartidas)
git reflog                          # historial de dónde ha estado HEAD
```

**Ejercicio**
- Provoca un conflicto a propósito (dos ramas editan la misma línea) y resuélvelo.
- Haz un `git reset --hard` "por error" y recupera el commit con `git reflog`.

**Lo dominas si…** un conflicto ya no te produce ansiedad y sabes cuándo usar `revert` y cuándo `reset`.

### B2.4 · GitHub: remotos y Pull Requests

**Contenido**
- `origin`, `git fetch`, `git pull` (y `pull --rebase`), `git push -u`.
- Pull Requests: descripción, revisión, *squash merge*.
- `git rebase` básico para actualizar tu rama.
- CLI `gh` para crear PRs desde la terminal.

**Ejemplo**
```bash
git push -u origin feat/modo-oscuro
gh pr create --title "feat: modo oscuro" --body "Añade toggle light/dark"
gh pr merge --squash
```

**Ejercicio**
- Sube un proyecto tuyo a GitHub y haz todo el próximo cambio mediante una PR, aunque trabajes solo.

**Lo dominas si…** tu historial de `main` se compone solo de PRs mezcladas.

### Proyecto del curso B2
Mueve el **Planificador 2026** a un flujo con ramas y PRs: `main` protegido, una PR por cambio y *previews* de Vercel por rama.

### Evaluación final B2 (5 preguntas)
1. Las tres zonas de Git.
2. Qué es una rama internamente.
3. Cómo resolver un conflicto.
4. `git revert` vs `git reset`.
5. Para qué sirve una Pull Request.

### Referencias
- Pro Git (libro gratuito, en español): https://git-scm.com/book/es/v2
- GitHub CLI: https://cli.github.com/manual/

---

## B3 · Cómo funciona la web

| Dato | Valor |
|---|---|
| ID / slug | `B3` / `como-funciona-la-web` |
| Secciones | 5 (~5 h) |
| Prerrequisitos | Ninguno |
| Objetivo | Entender qué ocurre entre escribir una URL y ver la página, como base para servidores y backend |

**Al terminar podrás:** explicar DNS, HTTP, cookies y el modelo cliente-servidor, y depurar peticiones con DevTools y `curl`.

### B3.1 · Cliente, servidor y el viaje de una petición

**Contenido**
- Cliente vs servidor. Qué es un "servidor" (un programa y la máquina donde corre).
- IP, puertos (80, 443, 3000, 4321) y `localhost`.
- El viaje completo: URL → DNS → TCP → TLS → HTTP → respuesta → render.
- Estático vs SSR vs SPA (y dónde encaja Astro).

**Ejemplo**
```bash
curl -v https://example.com     # ver la conexión, TLS y cabeceras
lsof -i :4321                   # qué proceso está usando el puerto de Astro
```

**Ejercicio**
- Arranca tu app Astro en local y localiza con `lsof` el proceso que escucha en el puerto.
- Escribe en 10 pasos qué ocurre cuando visitas tu app en Vercel.

**Lo dominas si…** puedes explicar el viaje de una petición a alguien que no programa.

### B3.2 · DNS y dominios

**Contenido**
- Qué resuelve el DNS. Registros `A`, `AAAA`, `CNAME`, `MX`, `TXT`, `NS`.
- TTL y propagación.
- Lo que ya haces con Namecheap → Vercel, explicado.
- Subdominios.

**Ejemplo**
```bash
dig +short tudominio.com A
dig +short www.tudominio.com CNAME
dig tudominio.com NS
```

**Ejercicio**
- Usa `dig` sobre tus dominios y documenta cada registro y por qué existe.

**Lo dominas si…** puedes configurar un dominio nuevo hacia Vercel sin seguir un tutorial.

### B3.3 · HTTP a fondo

**Contenido**
- Anatomía de una petición y una respuesta: método, ruta, cabeceras, cuerpo.
- Métodos: `GET`, `POST`, `PUT`, `PATCH`, `DELETE`. Idempotencia.
- Códigos de estado: 2xx, 3xx, 4xx, 5xx (los 15 que de verdad usarás).
- Cabeceras clave: `Content-Type`, `Authorization`, `Cache-Control`, `Location`.
- JSON como formato de intercambio.

**Ejemplo**
```bash
curl -i https://jsonplaceholder.typicode.com/posts/1
curl -i -X POST https://jsonplaceholder.typicode.com/posts \
  -H "Content-Type: application/json" \
  -d '{"title":"Hola","body":"Mundo","userId":1}'
```

**Ejercicio**
- Usa la pestaña *Network* de DevTools en tu app de entrenamiento: identifica 5 peticiones, su método, su código y su `Content-Type`.
- Haz una tabla con los códigos 200, 201, 204, 301, 302, 304, 400, 401, 403, 404, 409, 422, 429, 500 y 503, con un ejemplo real de cuándo usarías cada uno.

**Lo dominas si…** eliges el método y el código de estado correctos al diseñar un endpoint.

### B3.4 · Cookies, sesiones y estado

**Contenido**
- HTTP no tiene estado: cómo se "recuerda" a un usuario.
- Cookies: `HttpOnly`, `Secure`, `SameSite`, `Max-Age`, `Path`.
- Sesión en servidor vs token (JWT): ventajas y riesgos.
- Qué hace Better Auth con tus cookies.
- `localStorage` vs cookies.

**Ejemplo**
```http
Set-Cookie: better-auth.session_token=abc123; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=604800
```

**Ejercicio**
- Inicia sesión en tu app de entrenamiento y, en DevTools → *Application* → *Cookies*, documenta cada cookie y sus atributos.
- Explica por qué no podrías leer esa cookie con `document.cookie`.

**Lo dominas si…** entiendes cómo tu servidor sabe quién eres en cada petición.

### B3.5 · CORS, HTTPS y caché

**Contenido**
- *Same-Origin Policy* y CORS: por qué falla un `fetch` a otro dominio.
- HTTPS y TLS: certificados, quién los emite (Let's Encrypt).
- Caché HTTP: `Cache-Control`, `ETag`, CDN (lo que hace Vercel por ti).

**Ejemplo**
```ts
// Cabeceras CORS en un endpoint de Astro
export const GET: APIRoute = () =>
  new Response(JSON.stringify({ ok: true }), {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "https://tudominio.com",
      "Cache-Control": "public, max-age=60",
    },
  });
```

**Ejercicio**
- Provoca un error de CORS haciendo `fetch` desde una página local a una API sin CORS; léelo en la consola y explícalo.
- Revisa las cabeceras de caché de un asset estático de tu app en Vercel.

**Lo dominas si…** puedes diagnosticar un error de CORS sin buscarlo en Google.

### Proyecto del curso B3
**"Radiografía de mi app"**: un documento (o página en tu app) que describa todo el recorrido de tu app de entrenamiento: DNS, certificado, peticiones al cargar, cookies de sesión y cabeceras de caché.

### Evaluación final B3 (5 preguntas)
1. Qué hace el DNS y qué es un registro `CNAME`.
2. Métodos HTTP e idempotencia.
3. Significado de los códigos 401, 403 y 404.
4. Atributos `HttpOnly` y `SameSite` de una cookie.
5. Qué problema resuelve CORS.

### Referencias
- MDN · HTTP: https://developer.mozilla.org/es/docs/Web/HTTP
- How DNS works: https://howdns.works/

---

## B4 · Fundamentos de bases de datos

| Dato | Valor |
|---|---|
| ID / slug | `B4` / `fundamentos-de-bases-de-datos` |
| Secciones | 5 (~5 h) |
| Prerrequisitos | B1 |
| Objetivo | Entender los conceptos universales de las bases de datos antes de profundizar en MongoDB |

**Al terminar podrás:** distinguir modelos de datos, diseñar entidades y relaciones, y entender índices y transacciones a nivel conceptual.

### B4.1 · Qué es una base de datos

**Contenido**
- Por qué no basta con un archivo JSON.
- SGBD: almacenamiento, consultas, concurrencia, durabilidad.
- Tipos: relacional (PostgreSQL, MySQL, SQLite), documental (MongoDB), clave-valor (Redis), otras.
- Servidor de base de datos vs base de datos embebida.
- Dónde vive tu clúster de MongoDB Atlas.

**Ejemplo**
```
Relacional (tablas)                     Documental (documentos)
users                                   users
| id | nombre | email      |            { _id: 1, nombre: "Dani",
|----|--------|------------|              email: "dani@...",
| 1  | Dani   | dani@...   |              entrenos: [{ fecha: ..., km: 5 }] }
```

**Ejercicio**
- Para el Planificador 2026, lista qué datos guardas y en qué tipo de base de datos encajaría mejor cada uno, con una justificación.

**Lo dominas si…** puedes explicar cuándo elegirías SQL y cuándo NoSQL.

### B4.2 · Modelado: entidades y relaciones

**Contenido**
- Entidades, atributos y claves (primaria, foránea, natural vs artificial).
- Relaciones 1:1, 1:N, N:M.
- Diagramas entidad-relación.
- Normalización (1FN, 2FN, 3FN) de forma práctica.

**Ejemplo**
```
Usuario 1 ──── N Curso_Progreso N ──── 1 Curso
Curso   1 ──── N Seccion
Usuario 1 ──── N Resultado_Evaluacion
```

**Ejercicio**
- Dibuja el diagrama entidad-relación de **esta plataforma** (usuarios, cursos, secciones, progreso, evaluaciones). Lo reutilizaremos en la Fase 3.

**Lo dominas si…** identificas el tipo de relación entre dos entidades al primer vistazo.

### B4.3 · SQL básico con SQLite

**Contenido**
- `CREATE TABLE`, `INSERT`, `SELECT`, `WHERE`, `ORDER BY`, `LIMIT`.
- `UPDATE` y `DELETE` (y el peligro de olvidar el `WHERE`).
- `JOIN` para unir tablas.
- Por qué aprender SQL aunque uses MongoDB.

**Ejemplo**
```sql
CREATE TABLE usuarios (id INTEGER PRIMARY KEY, nombre TEXT NOT NULL, email TEXT UNIQUE);
CREATE TABLE entrenos (id INTEGER PRIMARY KEY, usuario_id INTEGER REFERENCES usuarios(id), km REAL, fecha TEXT);

INSERT INTO usuarios (nombre, email) VALUES ('Dani', 'dani@ejemplo.com');
INSERT INTO entrenos (usuario_id, km, fecha) VALUES (1, 5.2, '2026-10-01');

SELECT u.nombre, SUM(e.km) AS total_km
FROM usuarios u JOIN entrenos e ON e.usuario_id = u.id
GROUP BY u.id;
```

**Ejercicio**
- Con `sqlite3` (viene en macOS), crea las tablas de tu diagrama de B4.2 e inserta datos de prueba.
- Escribe una consulta que devuelva el porcentaje de secciones leídas por un usuario.

**Lo dominas si…** escribes un `SELECT` con `JOIN` y `GROUP BY` sin ayuda.

### B4.4 · Índices

**Contenido**
- Qué es un índice (la analogía del índice de un libro).
- Coste: lecturas más rápidas, escrituras más lentas y más espacio.
- Índices únicos y compuestos; el orden de los campos importa.
- Escaneo completo vs uso de índice.

**Ejemplo**
```sql
EXPLAIN QUERY PLAN SELECT * FROM entrenos WHERE usuario_id = 1;
CREATE INDEX idx_entrenos_usuario ON entrenos(usuario_id);
EXPLAIN QUERY PLAN SELECT * FROM entrenos WHERE usuario_id = 1;
```

**Ejercicio**
- Inserta 100 000 filas con un script y compara el tiempo de una consulta antes y después de crear el índice.

**Lo dominas si…** sabes qué campos de tus consultas necesitan índice.

### B4.5 · Transacciones y ACID

**Contenido**
- Atomicidad, Consistencia, Aislamiento, Durabilidad.
- Ejemplo clásico: una transferencia bancaria.
- Concurrencia: condiciones de carrera y escrituras perdidas.
- Teorema CAP explicado sin humo.

**Ejemplo**
```sql
BEGIN TRANSACTION;
UPDATE cuentas SET saldo = saldo - 100 WHERE id = 1;
UPDATE cuentas SET saldo = saldo + 100 WHERE id = 2;
COMMIT;  -- o ROLLBACK si algo falla
```

**Ejercicio**
- Simula un fallo entre los dos `UPDATE` (sin transacción y con transacción) y compara el resultado.

**Lo dominas si…** reconoces en tus apps qué operaciones deberían ser atómicas.

### Proyecto del curso B4
**Modelo de datos de Dani Academy**: diagrama entidad-relación completo, script SQL con tablas, índices y datos de ejemplo, y 5 consultas útiles (progreso por curso, media de evaluaciones, etc.).

### Evaluación final B4 (5 preguntas)
1. Diferencia entre base de datos relacional y documental.
2. Tipos de relación (1:1, 1:N, N:M).
3. Qué hace un `JOIN`.
4. Ventajas y costes de un índice.
5. Qué garantiza la atomicidad.

### Referencias
- SQLite Tutorial: https://www.sqlitetutorial.net/
- Use The Index, Luke: https://use-the-index-luke.com/es

---

## B5 · MongoDB esencial

| Dato | Valor |
|---|---|
| ID / slug | `B5` / `mongodb-esencial` |
| Secciones | 6 (~6 h) |
| Prerrequisitos | B1, B4 |
| Objetivo | Usar MongoDB con el driver oficial y TypeScript con seguridad y buenas prácticas |

**Al terminar podrás:** hacer CRUD tipado, escribir filtros y proyecciones, y gestionar la conexión correctamente en Astro.

### B5.1 · Documentos, colecciones y BSON

**Contenido**
- Clúster → base de datos → colección → documento.
- BSON: `ObjectId`, `Date`, `Decimal128` y por qué importan.
- `_id` y cómo se genera.
- Herramientas: MongoDB Atlas, Compass y `mongosh`.

**Ejemplo**
```js
// mongosh
use academy
db.usuarios.insertOne({ nombre: "Dani", email: "dani@ejemplo.com", creado: new Date() })
db.usuarios.find()
```

**Ejercicio**
- Conéctate a tu clúster de Atlas con `mongosh` y con Compass; explora las colecciones que crea Better Auth en tu app de entrenamiento (`user`, `session`, `account`).

**Lo dominas si…** sabes qué es un `ObjectId` y qué información contiene.

### B5.2 · Conexión con el driver de Node y TypeScript

**Contenido**
- `MongoClient` y el patrón de **una sola conexión reutilizada**.
- Por qué en *serverless* (Vercel) se cachea el cliente en un módulo.
- Colecciones tipadas con genéricos: `collection<Usuario>("usuarios")`.
- Variables de entorno para el URI.

**Ejemplo**
```ts
// src/lib/mongo.ts
import { MongoClient, type Db } from "mongodb";

const uri = import.meta.env.MONGODB_URI;
if (!uri) throw new Error("Falta MONGODB_URI");

const client = new MongoClient(uri);
const clientPromise = client.connect();

export async function getDb(): Promise<Db> {
  const c = await clientPromise;
  return c.db(import.meta.env.MONGODB_DB ?? "academy");
}
```

**Ejercicio**
- Compara este módulo con cómo conectas en tu app de entrenamiento. ¿Abres una conexión por petición? Corrígelo si es así.

**Lo dominas si…** entiendes por qué abrir una conexión por petición agota el clúster.

### B5.3 · Create y Read

**Contenido**
- `insertOne`, `insertMany` y el `insertedId`.
- `findOne`, `find`, cursores y `toArray()`.
- Filtros: igualdad, `$gt`, `$lt`, `$in`, `$exists`, `$regex`.
- Proyecciones, `sort`, `limit`, `skip`.

**Ejemplo**
```ts
interface Entreno {
  _id?: ObjectId;
  userId: string;
  tipo: "fuerza" | "running";
  km?: number;
  fecha: Date;
}

const db = await getDb();
const entrenos = db.collection<Entreno>("entrenos");

await entrenos.insertOne({ userId: "u1", tipo: "running", km: 5.2, fecha: new Date() });

const ultimos = await entrenos
  .find({ userId: "u1", tipo: "running", km: { $gte: 5 } })
  .project({ km: 1, fecha: 1 })
  .sort({ fecha: -1 })
  .limit(10)
  .toArray();
```

**Ejercicio**
- Escribe funciones tipadas `crearEntreno` y `listarEntrenos(userId, desde, hasta)`.

**Lo dominas si…** escribes filtros con operadores sin consultar la documentación.

### B5.4 · Update y Delete

**Contenido**
- `updateOne`, `updateMany`: `$set`, `$unset`, `$inc`, `$push`, `$pull`, `$addToSet`.
- `upsert: true` (clave para "marcar como leído").
- `findOneAndUpdate` y `returnDocument`.
- `deleteOne`, `deleteMany` y el borrado lógico.

**Ejemplo**
```ts
// Marcar una sección como leída (idempotente)
await db.collection("progreso").updateOne(
  { userId, cursoId: "B1" },
  {
    $addToSet: { seccionesLeidas: "B1.3" },
    $set: { actualizado: new Date() },
    $setOnInsert: { creado: new Date() },
  },
  { upsert: true },
);
```

**Ejercicio**
- Implementa `marcarLeido` y `desmarcarLeido` (con `$pull`). Comprueba que llamar dos veces a `marcarLeido` no duplica la sección.

**Lo dominas si…** eliges el operador de actualización correcto y entiendes `upsert`.

### B5.5 · Fechas, ObjectId y errores comunes

**Contenido**
- Guardar fechas como `Date`, nunca como string. Zonas horarias (UTC en la BD, local en la UI).
- Convertir `string` ↔ `ObjectId` y validar con `ObjectId.isValid`.
- Serializar documentos para enviarlos al cliente (el `_id` no es JSON).
- Errores típicos: clave duplicada (`E11000`), timeouts, IP no permitida en Atlas.

**Ejemplo**
```ts
import { ObjectId } from "mongodb";

function toObjectId(id: string): ObjectId | null {
  return ObjectId.isValid(id) ? new ObjectId(id) : null;
}

const doc = await coll.findOne({ _id: toObjectId(id)! });
const json = doc && { ...doc, _id: doc._id.toString() };
```

**Ejercicio**
- Busca en tu Planificador 2026 fechas guardadas como string y escribe un script de migración a `Date`.

**Lo dominas si…** nunca más guardas una fecha como texto.

### B5.6 · Índices en MongoDB

**Contenido**
- `createIndex`: simples, compuestos y únicos.
- La regla **ESR** (Equality, Sort, Range) para índices compuestos.
- `explain("executionStats")`: `COLLSCAN` vs `IXSCAN`.
- Índices TTL (caducidad automática, útil para sesiones).

**Ejemplo**
```ts
await db.collection("progreso").createIndex({ userId: 1, cursoId: 1 }, { unique: true });
await db.collection("evaluaciones").createIndex({ userId: 1, fecha: -1 });
```
```js
// mongosh
db.evaluaciones.find({ userId: "u1" }).sort({ fecha: -1 }).explain("executionStats")
```

**Ejercicio**
- Ejecuta `explain` sobre las 3 consultas más frecuentes de tu app de entrenamiento y crea los índices necesarios.

**Lo dominas si…** lees un `explain` y sabes si tu consulta usa un índice.

### Proyecto del curso B5
**Capa de datos del Planificador 2026**: un módulo `src/lib/db/` con colecciones tipadas, funciones CRUD, índices creados por script (`scripts/create-indexes.ts`) y fechas migradas a `Date`.

### Evaluación final B5 (5 preguntas)
1. Por qué reutilizar el `MongoClient`.
2. Operadores de filtro (`$in`, `$gte`).
3. `$addToSet` vs `$push`.
4. Qué hace `upsert`.
5. Regla ESR para índices compuestos.

### Referencias
- MongoDB Node.js Driver: https://www.mongodb.com/docs/drivers/node/current/
- MongoDB University (gratis): https://learn.mongodb.com/

---

## B6 · React esencial

| Dato | Valor |
|---|---|
| ID / slug | `B6` / `react-esencial` |
| Secciones | 7 (~7 h) |
| Prerrequisitos | B1 |
| Objetivo | Construir componentes interactivos con React y TypeScript dentro de Astro |

**Al terminar podrás:** crear islas de React tipadas, manejar estado y eventos, renderizar listas y formularios, y elegir la directiva `client:*` correcta.

### B6.1 · JSX y componentes

**Contenido**
- Qué es JSX (azúcar sobre `React.createElement`).
- Componentes como funciones que devuelven UI.
- Diferencias con HTML: `className`, `htmlFor`, `style` como objeto, etiquetas cerradas.
- Expresiones `{}` y fragmentos `<>…</>`.

**Ejemplo**
```tsx
export function Saludo() {
  const nombre = "Dani";
  return (
    <>
      <h1 className="text-2xl">Hola, {nombre}</h1>
      <p>Hoy es {new Date().toLocaleDateString("es")}</p>
    </>
  );
}
```

**Ejercicio**
- Convierte un componente `.astro` sencillo (una tarjeta) en un componente React `.tsx`.

**Lo dominas si…** escribes JSX válido sin errores de sintaxis.

### B6.2 · Props tipadas y composición

**Contenido**
- Props con `interface`, valores por defecto y `children` (`React.ReactNode`).
- Composición vs configuración (pasar componentes en lugar de muchas props).
- Props de tipo función (*callbacks*).

**Ejemplo**
```tsx
interface CardProps {
  titulo: string;
  nivel?: "basico" | "intermedio" | "avanzado";
  children: React.ReactNode;
}

export function Card({ titulo, nivel = "basico", children }: CardProps) {
  return (
    <section data-nivel={nivel} className="rounded-xl p-4">
      <h2>{titulo}</h2>
      {children}
    </section>
  );
}
```

**Ejercicio**
- Crea `Card`, `Badge` y `Button` tipados y compón una tarjeta de curso con ellos.

**Lo dominas si…** usas `children` en lugar de multiplicar props.

### B6.3 · Estado con `useState` y eventos

**Contenido**
- Qué es el estado y por qué una variable normal no re-renderiza.
- `useState` con tipos, actualización funcional (`set(prev => …)`).
- Eventos tipados: `React.MouseEvent`, `React.ChangeEvent<HTMLInputElement>`.
- Inmutabilidad: actualizar arrays y objetos correctamente.

**Ejemplo**
```tsx
import { useState } from "react";

export function Contador() {
  const [vasos, setVasos] = useState(0);
  return (
    <button onClick={() => setVasos((v) => v + 1)}>
      Vasos de agua: {vasos}
    </button>
  );
}
```

**Ejercicio**
- Crea un contador de hidratación con botones +/−, un mínimo de 0 y un objetivo diario que cambie de color al alcanzarse.

**Lo dominas si…** nunca mutas el estado directamente.

### B6.4 · Listas, keys y renderizado condicional

**Contenido**
- `map` para listas y por qué `key` debe ser estable (no el índice).
- Renderizado condicional: `&&`, ternario y retorno temprano.
- Estados vacíos y de carga.

**Ejemplo**
```tsx
interface Seccion { id: string; titulo: string; leida: boolean }

export function ListaSecciones({ secciones }: { secciones: Seccion[] }) {
  if (secciones.length === 0) return <p>No hay secciones.</p>;
  return (
    <ul>
      {secciones.map((s) => (
        <li key={s.id}>
          {s.leida ? "✓" : "○"} {s.titulo}
        </li>
      ))}
    </ul>
  );
}
```

**Ejercicio**
- Lista de tareas: añadir, marcar como hecha y borrar, con un mensaje cuando la lista está vacía.

**Lo dominas si…** explicas qué falla si usas el índice del array como `key` al reordenar.

### B6.5 · Formularios controlados

**Contenido**
- Inputs controlados vs no controlados.
- Un estado por formulario (objeto) vs un estado por campo.
- `onSubmit`, `preventDefault` y `FormData`.
- Validación básica y mensajes de error.

**Ejemplo**
```tsx
export function FormEntreno({ onGuardar }: { onGuardar: (km: number) => void }) {
  const [km, setKm] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const valor = Number(km);
    if (!valor || valor <= 0) return setError("Introduce un número mayor que 0");
    setError(null);
    onGuardar(valor);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input value={km} onChange={(e) => setKm(e.target.value)} inputMode="decimal" />
      {error && <p role="alert">{error}</p>}
      <button type="submit">Guardar</button>
    </form>
  );
}
```

**Ejercicio**
- Formulario de registro (nombre, correo, contraseña) con validación de campos y botón deshabilitado mientras no sea válido.

**Lo dominas si…** construyes un formulario con validación sin librerías.

### B6.6 · `useEffect` y llamadas a APIs

**Contenido**
- Qué es un efecto y cuándo NO necesitas `useEffect`.
- Dependencias y la función de limpieza.
- Cargar datos con `fetch`: estados loading/success/error (unión discriminada de B1.6).
- `AbortController` para cancelar peticiones.

**Ejemplo**
```tsx
type Estado<T> = { s: "loading" } | { s: "ok"; data: T } | { s: "error"; msg: string };

export function Progreso({ cursoId }: { cursoId: string }) {
  const [estado, setEstado] = useState<Estado<{ porcentaje: number }>>({ s: "loading" });

  useEffect(() => {
    const ctrl = new AbortController();
    fetch(`/api/progreso/${cursoId}`, { signal: ctrl.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.statusText)))
      .then((data) => setEstado({ s: "ok", data }))
      .catch((e) => { if (!ctrl.signal.aborted) setEstado({ s: "error", msg: String(e) }); });
    return () => ctrl.abort();
  }, [cursoId]);

  if (estado.s === "loading") return <p>Cargando…</p>;
  if (estado.s === "error") return <p>Error: {estado.msg}</p>;
  return <p>{estado.data.porcentaje}% completado</p>;
}
```

**Ejercicio**
- Componente que cargue y muestre los usuarios de `jsonplaceholder` con estados de carga y error.

**Lo dominas si…** sabes qué pasa si olvidas una dependencia del efecto.

### B6.7 · Islas de React en Astro

**Contenido**
- Arquitectura de islas: HTML estático + componentes interactivos aislados.
- Directivas: `client:load`, `client:idle`, `client:visible`, `client:media`, `client:only="react"`.
- Pasar props de Astro a React (solo datos serializables).
- Compartir estado entre islas (nanostores) y cuándo no hacerlo.

**Ejemplo**
```astro
---
import { BotonLeido } from "@/components/BotonLeido";
const seccionId = "B1.3";
---
<article class="prose">
  <h1>Arrays, tuplas y objetos</h1>
  <!-- contenido estático: cero JS -->
</article>
<BotonLeido client:visible seccionId={seccionId} />
```

**Ejercicio**
- Crea una página Astro estática con tres islas que usen directivas distintas y observa en *Network* cuándo se descarga el JS de cada una.

**Lo dominas si…** eliges la directiva `client:*` adecuada para cada componente.

### Proyecto del curso B6
**Panel de hidratación interactivo** para tu app de entrenamiento: isla React con contador, objetivo diario, historial de los últimos 7 días cargado desde un endpoint y formulario para cambiar el objetivo.

### Evaluación final B6 (5 preguntas)
1. Por qué el estado provoca un re-render y una variable no.
2. Para qué sirve `key` en una lista.
3. Función de limpieza en `useEffect`.
4. Input controlado vs no controlado.
5. Diferencia entre `client:load` y `client:visible`.

### Referencias
- React (documentación oficial): https://es.react.dev/learn
- Astro + React: https://docs.astro.build/en/guides/integrations-guide/react/

---

## B7 · Tailwind CSS v4 esencial

| Dato | Valor |
|---|---|
| ID / slug | `B7` / `tailwind-css-v4-esencial` |
| Secciones | 5 (~5 h) |
| Prerrequisitos | CSS básico |
| Objetivo | Usar Tailwind v4 con criterio: utilidades, layout, responsive y estados |

**Al terminar podrás:** maquetar layouts complejos con Flex y Grid, diseñar *mobile-first* y entender la configuración de Tailwind v4 basada en CSS.

### B7.1 · Filosofía *utility-first* y configuración v4

**Contenido**
- Por qué utilidades en lugar de clases semánticas.
- Tailwind v4: configuración en CSS (`@import "tailwindcss"`, `@theme`), sin `tailwind.config.js`.
- Integración con Astro mediante `@tailwindcss/vite`.
- Detección automática de contenido y `@source`.
- Extensión *Tailwind CSS IntelliSense* en VS Code.

**Ejemplo**
```css
/* src/styles/global.css */
@import "tailwindcss";

@theme {
  --color-accent: #0d9488;
  --font-sans: "Inter", system-ui, sans-serif;
}
```
```ts
// astro.config.mjs
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({ vite: { plugins: [tailwindcss()] } });
```

**Ejercicio**
- Crea un proyecto Astro desde cero con Tailwind v4 y define en `@theme` dos colores y una fuente; úsalos como `bg-accent` y `font-sans`.

**Lo dominas si…** sabes dónde se configura cada cosa en v4 sin buscar un `tailwind.config.js`.

### B7.2 · Espaciado, tipografía y color

**Contenido**
- Escala de espaciado (`p-4`, `gap-6`, `space-y-2`) y por qué es consistente.
- Tipografía: `text-*`, `font-*`, `leading-*`, `tracking-*`, `max-w-prose`.
- Color y opacidad (`text-slate-700`, `bg-accent/10`).
- Bordes, sombras y radios.

**Ejemplo**
```html
<article class="mx-auto max-w-prose px-4 py-12">
  <h1 class="text-3xl font-semibold tracking-tight text-slate-900">Título</h1>
  <p class="mt-4 text-lg leading-relaxed text-slate-700">Texto con buena legibilidad.</p>
</article>
```

**Ejercicio**
- Maqueta una página de artículo centrada en la lectura (ancho máximo ~65 caracteres, interlineado amplio).

**Lo dominas si…** conoces de memoria la escala de espaciado básica.

### B7.3 · Flexbox y Grid

**Contenido**
- Flex: dirección, `justify-*`, `items-*`, `gap`, `flex-1`, `shrink-0`.
- Grid: `grid-cols-*`, `col-span-*`, `auto-fit` con `minmax` (valores arbitrarios).
- Patrones: barra lateral + contenido, rejilla de tarjetas, *header* fijo.

**Ejemplo**
```html
<div class="grid min-h-screen grid-cols-[16rem_1fr]">
  <aside class="border-r p-4">Índice</aside>
  <main class="p-8">Contenido</main>
</div>

<ul class="grid grid-cols-[repeat(auto-fill,minmax(16rem,1fr))] gap-4">…</ul>
```

**Ejercicio**
- Maqueta el layout de una página de curso: barra lateral con secciones, contenido central y barra superior.

**Lo dominas si…** eliges entre Flex y Grid sin dudar.

### B7.4 · Responsive y estados

**Contenido**
- *Mobile-first*: `sm:`, `md:`, `lg:`, `xl:`.
- *Container queries* (`@container`, `@md:`).
- Estados: `hover:`, `focus-visible:`, `active:`, `disabled:`, `group-hover:`, `peer-checked:`.
- Variante `dark:` (se profundiza en I7).

**Ejemplo**
```html
<aside class="hidden md:block">Índice</aside>
<button class="rounded-lg bg-accent px-4 py-2 text-white hover:bg-accent/90 focus-visible:outline-2 disabled:opacity-50">
  Marcar como leído
</button>
```

**Ejercicio**
- Haz responsive el layout de B7.3: en móvil la barra lateral se convierte en un menú desplegable.

**Lo dominas si…** escribes primero el estilo móvil y luego los *breakpoints*.

### B7.5 · Componentes y reutilización

**Contenido**
- Cuándo extraer un componente (Astro/React) en lugar de repetir clases.
- `@utility` y `@layer components` en v4 (con moderación).
- Clases condicionales: `clsx` + `tailwind-merge`.
- Plugin `@tailwindcss/typography` (`prose`) para contenido largo.

**Ejemplo**
```ts
// src/lib/cn.ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));
```
```tsx
<button className={cn("rounded-lg px-4 py-2", leido ? "bg-accent text-white" : "border")} />
```

**Ejercicio**
- Crea un componente `Button` con variantes (`primary`, `secondary`, `ghost`) y tamaños usando `cn`.

**Lo dominas si…** no repites la misma lista de clases en más de dos sitios.

### Proyecto del curso B7
**Maqueta estática de una página de curso** (sin lógica): layout responsive con índice lateral, contenido en `prose`, botones de "Marcar como leído" y navegación anterior/siguiente.

### Evaluación final B7 (5 preguntas)
1. Dónde se configura el tema en Tailwind v4.
2. Qué significa *mobile-first*.
3. Flex vs Grid.
4. Para qué sirve `group-hover:`.
5. Qué resuelve `tailwind-merge`.

### Referencias
- Tailwind CSS v4: https://tailwindcss.com/docs
- Tailwind Typography: https://github.com/tailwindlabs/tailwindcss-typography

---

# NIVEL INTERMEDIO

> **Meta del nivel:** pasar de "usar" a "diseñar". Construir backends propios en Astro, modelar datos con criterio, entender la autenticación por dentro, administrar un servidor Linux y escribir tests.

---

## I1 · TypeScript intermedio

| Dato | Valor |
|---|---|
| ID / slug | `I1` / `typescript-intermedio` |
| Secciones | 6 (~6 h) |
| Prerrequisitos | B1 |
| Objetivo | Escribir código reutilizable y seguro con genéricos, utility types y validación en tiempo de ejecución |

**Al terminar podrás:** crear funciones y componentes genéricos, derivar tipos de otros tipos y validar datos externos con Zod sin duplicar tipos.

### I1.1 · Genéricos

**Contenido**
- Por qué existen: reutilizar lógica sin perder el tipo.
- Funciones genéricas `<T>`, restricciones con `extends`, valores por defecto.
- Interfaces y tipos genéricos (`Resultado<T>`, `Paginado<T>`).
- Genéricos que ya usas sin saberlo: `Promise<T>`, `Array<T>`, `useState<T>`, `collection<T>`.

**Ejemplo**
```ts
function primero<T>(lista: T[]): T | undefined {
  return lista[0];
}

interface Paginado<T> {
  items: T[];
  total: number;
  pagina: number;
}

function porId<T extends { id: string }>(lista: T[], id: string): T | undefined {
  return lista.find((x) => x.id === id);
}
```

**Ejercicio**
- Escribe `agruparPor<T, K extends keyof T>(lista: T[], clave: K): Record<string, T[]>` y úsalo para agrupar entrenos por tipo.

**Lo dominas si…** lees la firma de una función genérica de una librería y entiendes qué hace.

### I1.2 · `keyof`, `typeof` e *indexed access*

**Contenido**
- `keyof T` para obtener las claves como unión.
- `typeof valor` para extraer tipos de valores existentes.
- `T["prop"]` y `T[number]` para acceder a tipos internos.
- `as const` para congelar literales.

**Ejemplo**
```ts
const NIVELES = ["basico", "intermedio", "avanzado"] as const;
type Nivel = (typeof NIVELES)[number]; // "basico" | "intermedio" | "avanzado"

const config = { tema: "dark", idioma: "es" };
type Config = typeof config;
type ClaveConfig = keyof Config; // "tema" | "idioma"
```

**Ejercicio**
- Define la lista de cursos del temario como `const` y deriva de ella el tipo `CursoId` (`"B1" | "B2" | …`) sin escribirlo a mano.

**Lo dominas si…** tienes una única fuente de verdad para tus constantes y sus tipos.

### I1.3 · *Utility types*

**Contenido**
- `Partial`, `Required`, `Readonly`, `Pick`, `Omit`, `Record`.
- `ReturnType`, `Parameters`, `Awaited`, `NonNullable`.
- Patrones: DTOs de creación (`Omit<Usuario, "id">`), actualización (`Partial<…>`).

**Ejemplo**
```ts
interface Usuario { id: string; nombre: string; email: string; creado: Date }

type NuevoUsuario = Omit<Usuario, "id" | "creado">;
type CambiosUsuario = Partial<Pick<Usuario, "nombre" | "email">>;
type ProgresoPorCurso = Record<string, number>;

async function cargar() { return { ok: true, total: 3 }; }
type DatosCarga = Awaited<ReturnType<typeof cargar>>;
```

**Ejercicio**
- Define los tipos de entrada y salida de un CRUD completo de "notas" del Planificador usando solo *utility types* a partir de una interfaz `Nota`.

**Lo dominas si…** no duplicas interfaces casi idénticas.

### I1.4 · Validación en tiempo de ejecución con Zod

**Contenido**
- El problema: los tipos no existen en ejecución; los datos externos (formularios, APIs, BD) pueden mentir.
- Esquemas Zod: `z.object`, `z.string().email()`, `z.number().min()`, `z.enum`, `z.array`.
- `parse` vs `safeParse`.
- `z.infer` para derivar el tipo desde el esquema (una sola fuente de verdad).
- Transformaciones y *coerción* (`z.coerce.number()`).

**Ejemplo**
```ts
import { z } from "zod";

export const RegistroSchema = z.object({
  nombre: z.string().min(2, "Mínimo 2 caracteres"),
  email: z.string().email("Correo no válido"),
  password: z.string().min(8, "Mínimo 8 caracteres"),
});

export type Registro = z.infer<typeof RegistroSchema>;

const resultado = RegistroSchema.safeParse(await request.json());
if (!resultado.success) {
  return Response.json({ errores: resultado.error.flatten().fieldErrors }, { status: 422 });
}
```

**Ejercicio**
- Sustituye el `as Tarea[]` de B1.5 por un esquema Zod y prueba qué pasa cuando la API devuelve un campo con el tipo incorrecto.

**Lo dominas si…** validas todo dato que cruce una frontera (petición, BD, API externa).

### I1.5 · Manejo de errores tipado

**Contenido**
- `catch (e)` es `unknown`: cómo tratarlo.
- Clases de error propias (`class NoEncontradoError extends Error`).
- Patrón `Result<T, E>` como alternativa a `throw`.
- Dónde capturar errores (en el borde, no en cada función).

**Ejemplo**
```ts
export class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "HttpError";
  }
}

try {
  await guardar();
} catch (e) {
  if (e instanceof HttpError) console.error(e.status, e.message);
  else if (e instanceof Error) console.error(e.message);
  else console.error("Error desconocido", e);
}
```

**Ejercicio**
- Crea `NoEncontradoError`, `NoAutorizadoError` y `ValidacionError`, y una función `aRespuesta(e: unknown): Response` que los convierta en el código HTTP adecuado.

**Lo dominas si…** ningún error de tu app termina como un 500 genérico sin motivo.

### I1.6 · Tipar un proyecto real de extremo a extremo

**Contenido**
- Tipos compartidos entre servidor y cliente (`src/types`, esquemas Zod en `src/schemas`).
- Tipar la colección de MongoDB, el endpoint y el componente React con el mismo tipo.
- Mapear documentos de BD a DTOs (`_id` → `id`).
- Estrategia de migración gradual de JS a TS.

**Ejemplo**
```ts
// src/schemas/entreno.ts
export const EntrenoSchema = z.object({
  tipo: z.enum(["fuerza", "running"]),
  km: z.number().positive().optional(),
  fecha: z.coerce.date(),
});
export type EntrenoInput = z.infer<typeof EntrenoSchema>;
export type EntrenoDTO = EntrenoInput & { id: string };
```

**Ejercicio**
- Lleva un mismo tipo desde el formulario React → endpoint → MongoDB → respuesta → listado en tu app de entrenamiento.

**Lo dominas si…** cambiar un campo del esquema hace fallar al compilador en todos los sitios que deben actualizarse.

### Proyecto del curso I1
**Librería de esquemas compartidos** para tu app de entrenamiento: todos los formularios y endpoints validan con Zod, los tipos se derivan con `z.infer` y existe un helper de errores HTTP.

### Evaluación final I1 (5 preguntas)
1. Para qué sirve una restricción `extends` en un genérico.
2. Qué devuelve `keyof`.
3. `Omit` vs `Pick`.
4. Por qué los tipos de TypeScript no validan datos en ejecución.
5. `parse` vs `safeParse` en Zod.

### Referencias
- TypeScript Handbook · Generics: https://www.typescriptlang.org/docs/handbook/2/generics.html
- Zod: https://zod.dev/

---

## I2 · React intermedio

| Dato | Valor |
|---|---|
| ID / slug | `I2` / `react-intermedio` |
| Secciones | 6 (~6 h) |
| Prerrequisitos | B6, I1 |
| Objetivo | Organizar la lógica de componentes con hooks propios, reducers y contexto, y manejar formularios y peticiones como en producción |

**Al terminar podrás:** extraer lógica a *custom hooks*, modelar estado complejo, aplicar actualizaciones optimistas y evitar re-renders innecesarios.

### I2.1 · Cómo renderiza React

**Contenido**
- Render vs *commit*. Qué dispara un re-render (estado, props, contexto, padre).
- Identidad de objetos y funciones entre renders.
- `React.StrictMode` y por qué ejecuta efectos dos veces en desarrollo.
- React DevTools: *Profiler* y "Highlight updates".

**Ejemplo**
```tsx
function Padre() {
  const [n, setN] = useState(0);
  return (
    <>
      <button onClick={() => setN(n + 1)}>{n}</button>
      <Hijo /> {/* se re-renderiza aunque no use `n` */}
    </>
  );
}
```

**Ejercicio**
- Instala React DevTools y descubre qué componentes se re-renderizan al usar tu panel de hidratación de B6.

**Lo dominas si…** predices qué componentes se volverán a renderizar ante un cambio.

### I2.2 · *Custom hooks*

**Contenido**
- Reglas de los hooks y por qué existen.
- Extraer lógica reutilizable: `useFetch`, `useLocalStorage`, `useMediaQuery`.
- Hooks genéricos con TypeScript.

**Ejemplo**
```ts
export function useLocalStorage<T>(clave: string, inicial: T) {
  const [valor, setValor] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(clave);
      return raw ? (JSON.parse(raw) as T) : inicial;
    } catch {
      return inicial;
    }
  });

  useEffect(() => {
    try { localStorage.setItem(clave, JSON.stringify(valor)); } catch {}
  }, [clave, valor]);

  return [valor, setValor] as const;
}
```

**Ejercicio**
- Crea `useTema()` que lea/guarde la preferencia light/dark y respete `prefers-color-scheme` por defecto.

**Lo dominas si…** tus componentes contienen UI y tus hooks contienen lógica.

### I2.3 · `useReducer` y estado complejo

**Contenido**
- Cuándo `useReducer` es mejor que varios `useState`.
- Acciones como uniones discriminadas (enlace con B1.6).
- Reducers puros y testeables.

**Ejemplo**
```ts
type Estado = { respuestas: Record<number, string>; paso: number; enviado: boolean };
type Accion =
  | { type: "responder"; pregunta: number; opcion: string }
  | { type: "siguiente" }
  | { type: "enviar" };

function quizReducer(s: Estado, a: Accion): Estado {
  switch (a.type) {
    case "responder": return { ...s, respuestas: { ...s.respuestas, [a.pregunta]: a.opcion } };
    case "siguiente": return { ...s, paso: Math.min(s.paso + 1, 4) };
    case "enviar":    return { ...s, enviado: true };
  }
}
```

**Ejercicio**
- Implementa el componente completo de un **cuestionario de 5 preguntas** con `useReducer`: navegación, respuestas y pantalla de resultado.

**Lo dominas si…** modelas un flujo de varios pasos sin estados contradictorios.

### I2.4 · Contexto y estado compartido

**Contenido**
- `createContext` + `Provider` + hook `useX()` tipado.
- Problemas de rendimiento del contexto y cómo dividirlo.
- En Astro: el contexto no cruza islas; alternativas (nanostores, eventos, el servidor como fuente de verdad).

**Ejemplo**
```tsx
const ProgresoCtx = createContext<{ leidas: Set<string>; marcar: (id: string) => void } | null>(null);

export function useProgreso() {
  const ctx = useContext(ProgresoCtx);
  if (!ctx) throw new Error("useProgreso debe usarse dentro de <ProgresoProvider>");
  return ctx;
}
```

**Ejercicio**
- Comparte el estado "secciones leídas" entre el índice lateral y el botón de cada sección, primero con contexto (misma isla) y después con nanostores (islas distintas).

**Lo dominas si…** sabes elegir entre props, contexto o un store externo.

### I2.5 · Formularios y peticiones en producción

**Contenido**
- Formularios con `react-hook-form` + `zodResolver` (reutilizando esquemas de I1).
- Estados de envío, errores del servidor y deshabilitar botones.
- Actualizaciones optimistas (`useOptimistic` o manual) con *rollback*.
- `useTransition` para no bloquear la UI.

**Ejemplo**
```tsx
function BotonLeido({ seccionId, inicial }: { seccionId: string; inicial: boolean }) {
  const [leido, setLeido] = useState(inicial);
  const [pendiente, startTransition] = useTransition();

  function toggle() {
    const anterior = leido;
    setLeido(!anterior); // optimista
    startTransition(async () => {
      const res = await fetch(`/api/progreso/${seccionId}`, { method: anterior ? "DELETE" : "PUT" });
      if (!res.ok) setLeido(anterior); // rollback
    });
  }

  return <button onClick={toggle} disabled={pendiente}>{leido ? "Leído ✓" : "Marcar como leído"}</button>;
}
```

**Ejercicio**
- Rehaz el formulario de registro de B6.5 con `react-hook-form` y el `RegistroSchema` de I1.4.

**Lo dominas si…** la UI responde al instante y se corrige sola si el servidor falla.

### I2.6 · Rendimiento y patrones

**Contenido**
- `memo`, `useMemo`, `useCallback`: cuándo sirven y cuándo son ruido.
- React Compiler (memoización automática) y su estado actual.
- Patrones: componentes compuestos, *render props*, *lifting state up*.
- Carga diferida con `lazy` + `Suspense`.

**Ejemplo**
```tsx
<Tabs defaultValue="progreso">
  <Tabs.List>
    <Tabs.Trigger value="progreso">Progreso</Tabs.Trigger>
    <Tabs.Trigger value="examenes">Exámenes</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Panel value="progreso">…</Tabs.Panel>
  <Tabs.Panel value="examenes">…</Tabs.Panel>
</Tabs>
```

**Ejercicio**
- Implementa el componente compuesto `Tabs` accesible (roles ARIA y navegación con teclado).

**Lo dominas si…** optimizas solo después de medir con el *Profiler*.

### Proyecto del curso I2
**Motor de cuestionarios**: componente reutilizable que recibe 5 preguntas, gestiona el flujo con `useReducer`, envía el resultado a un endpoint con estados de carga/error y muestra la puntuación con feedback por pregunta.

### Evaluación final I2 (5 preguntas)
1. Qué dispara un re-render.
2. Reglas de los hooks.
3. Cuándo usar `useReducer`.
4. Por qué el contexto de React no funciona entre islas de Astro.
5. Qué es una actualización optimista.

### Referencias
- React · Escape hatches: https://es.react.dev/learn/escape-hatches
- React Hook Form: https://react-hook-form.com/

---

## I3 · Backend con Astro

| Dato | Valor |
|---|---|
| ID / slug | `I3` / `backend-con-astro` |
| Secciones | 6 (~6 h) |
| Prerrequisitos | B3, B5, I1 |
| Objetivo | Diseñar y construir APIs y lógica de servidor dentro de Astro de forma ordenada y segura |

**Al terminar podrás:** crear endpoints REST, Astro Actions y *middleware*; validar entradas, manejar errores y estructurar el backend por capas.

### I3.1 · Modos de renderizado y adaptadores

**Contenido**
- Estático (SSG), servidor (SSR) y mixto: `output` y `export const prerender`.
- Adaptadores: `@astrojs/vercel`, `@astrojs/node`.
- Ciclo de vida de una petición en Astro SSR.
- *Server islands* (`server:defer`).

**Ejemplo**
```ts
// astro.config.mjs
import vercel from "@astrojs/vercel";
export default defineConfig({ output: "server", adapter: vercel() });
```
```astro
---
// src/pages/temario.astro
export const prerender = true; // esta página se genera en build
---
```

**Ejercicio**
- En tu app, clasifica cada página como estática o dinámica y configura `prerender` donde corresponda. Compara el resultado del build.

**Lo dominas si…** sabes qué páginas deben renderizarse en servidor y por qué.

### I3.2 · Endpoints (API routes)

**Contenido**
- Archivos `.ts` en `src/pages/api/`. Exportar `GET`, `POST`, `PUT`, `PATCH`, `DELETE`.
- Parámetros dinámicos (`[id].ts`), *query params*, cuerpo JSON y `FormData`.
- Respuestas: `Response.json`, códigos de estado, cabeceras, redirecciones.
- Diseño REST: recursos, verbos y nombres de rutas.

**Ejemplo**
```ts
// src/pages/api/progreso/[seccionId].ts
import type { APIRoute } from "astro";

export const PUT: APIRoute = async ({ params, locals }) => {
  if (!locals.user) return new Response(null, { status: 401 });
  await marcarLeido(locals.user.id, params.seccionId!);
  return new Response(null, { status: 204 });
};

export const DELETE: APIRoute = async ({ params, locals }) => {
  if (!locals.user) return new Response(null, { status: 401 });
  await desmarcarLeido(locals.user.id, params.seccionId!);
  return new Response(null, { status: 204 });
};
```

**Ejercicio**
- Diseña (en papel) y luego implementa la API REST de "notas" del Planificador: listar, crear, editar y borrar, con los códigos de estado correctos.

**Lo dominas si…** tus rutas y códigos de estado siguen las convenciones REST de B3.3.

### I3.3 · Astro Actions

**Contenido**
- `defineAction` con validación integrada (`input`).
- Llamarlas desde React (`actions.x()`) y desde formularios HTML.
- `ActionError` y códigos.
- Endpoints vs Actions: cuándo usar cada uno.

**Ejemplo**
```ts
// src/actions/index.ts
import { defineAction, ActionError } from "astro:actions";
import { z } from "astro/zod";

export const server = {
  enviarEvaluacion: defineAction({
    input: z.object({ cursoId: z.string(), respuestas: z.array(z.number()).length(5) }),
    handler: async (input, ctx) => {
      if (!ctx.locals.user) throw new ActionError({ code: "UNAUTHORIZED" });
      return corregirYGuardar(ctx.locals.user.id, input);
    },
  }),
};
```
```tsx
import { actions } from "astro:actions";
const { data, error } = await actions.enviarEvaluacion({ cursoId: "B1", respuestas });
```

**Ejercicio**
- Convierte uno de tus endpoints de formulario en una Action y compara la cantidad de código.

**Lo dominas si…** eliges entre endpoint y Action según quién consume la API.

### I3.4 · *Middleware* y `locals`

**Contenido**
- `onRequest` y `defineMiddleware`. Encadenar con `sequence`.
- `context.locals` tipado (`src/env.d.ts`).
- Casos de uso: sesión, protección de rutas, *logging*, cabeceras de seguridad.

**Ejemplo**
```ts
// src/middleware.ts
import { defineMiddleware } from "astro:middleware";
import { auth } from "@/lib/auth";

export const onRequest = defineMiddleware(async (ctx, next) => {
  const session = await auth.api.getSession({ headers: ctx.request.headers });
  ctx.locals.user = session?.user ?? null;
  ctx.locals.session = session?.session ?? null;

  const privada = ctx.url.pathname.startsWith("/curso") || ctx.url.pathname.startsWith("/progreso");
  if (privada && !ctx.locals.user) return ctx.redirect("/login");

  return next();
});
```
```ts
// src/env.d.ts
declare namespace App {
  interface Locals {
    user: import("better-auth").User | null;
    session: import("better-auth").Session | null;
  }
}
```

**Ejercicio**
- Añade un *middleware* que registre método, ruta, código de respuesta y duración de cada petición.

**Lo dominas si…** ninguna página privada comprueba la sesión por su cuenta: lo hace el *middleware*.

### I3.5 · Arquitectura por capas

**Contenido**
- Separar: ruta/action (HTTP) → servicio (reglas de negocio) → repositorio (MongoDB).
- Por qué la lógica no debe vivir en el endpoint.
- Inyección de dependencias sencilla (pasar el `db` como parámetro) para poder testear.
- Estructura de carpetas recomendada.

**Ejemplo**
```
src/
├── pages/api/…           # capa HTTP: parsear, validar, responder
├── actions/…             # capa HTTP alternativa
├── services/
│   └── progreso.service.ts   # reglas: "un curso está completo si…"
├── repositories/
│   └── progreso.repo.ts      # solo consultas a MongoDB
├── schemas/              # Zod
└── lib/                  # mongo, auth, utilidades
```

**Ejercicio**
- Refactoriza un endpoint "gordo" de tu app de entrenamiento a las tres capas.

**Lo dominas si…** podrías cambiar MongoDB por otra BD tocando solo los repositorios.

### I3.6 · Variables de entorno y configuración

**Contenido**
- `import.meta.env` vs `process.env`; variables públicas (`PUBLIC_`) y privadas.
- `astro:env` con esquema tipado (`envField`).
- `.env`, `.env.example` y variables en Vercel por entorno (Production, Preview, Development).
- Nunca exponer secretos al cliente.

**Ejemplo**
```ts
// astro.config.mjs
import { defineConfig, envField } from "astro/config";
export default defineConfig({
  env: {
    schema: {
      MONGODB_URI: envField.string({ context: "server", access: "secret" }),
      BETTER_AUTH_SECRET: envField.string({ context: "server", access: "secret" }),
      PUBLIC_SITE_NAME: envField.string({ context: "client", access: "public", default: "Dani Academy" }),
    },
  },
});
```
```ts
import { MONGODB_URI } from "astro:env/server";
```

**Ejercicio**
- Migra las variables de tu app de entrenamiento a `astro:env` y crea su `.env.example`.

**Lo dominas si…** el build falla de forma clara cuando falta una variable obligatoria.

### Proyecto del curso I3
**API de progreso y evaluaciones** (la base de la plataforma): *middleware* de sesión, endpoints `PUT/DELETE /api/progreso/:seccionId`, Action `enviarEvaluacion`, capas servicio/repositorio y validación con Zod.

### Evaluación final I3 (5 preguntas)
1. Diferencia entre `prerender = true` y SSR.
2. Qué código de estado devolver al crear un recurso.
3. Endpoint vs Astro Action.
4. Para qué sirve `context.locals`.
5. Responsabilidad de la capa de repositorio.

### Referencias
- Astro · Endpoints: https://docs.astro.build/en/guides/endpoints/
- Astro · Actions: https://docs.astro.build/en/guides/actions/
- Astro · Middleware: https://docs.astro.build/en/guides/middleware/

---

## I4 · Modelado de datos con MongoDB

| Dato | Valor |
|---|---|
| ID / slug | `I4` / `modelado-de-datos-con-mongodb` |
| Secciones | 6 (~6 h) |
| Prerrequisitos | B4, B5, I1 |
| Objetivo | Diseñar esquemas de MongoDB a partir de los patrones de acceso y sacar datos con agregaciones |

**Al terminar podrás:** decidir entre embeber o referenciar, aplicar patrones de diseño, escribir *pipelines* de agregación y validar esquemas en la BD.

### I4.1 · Diseñar a partir de las consultas

**Contenido**
- La regla de MongoDB: "los datos que se leen juntos se guardan juntos".
- Listar patrones de acceso antes de diseñar.
- Proporción lectura/escritura y tamaño de los datos.
- Límite de 16 MB por documento.

**Ejemplo**
```
Patrones de acceso de Dani Academy
1. Al abrir un curso → secciones leídas del usuario en ese curso       (muy frecuente)
2. Página de progreso → % por curso + últimas evaluaciones            (frecuente)
3. Marcar sección como leída                                          (muy frecuente, escritura)
4. Guardar resultado de evaluación                                    (poco frecuente)
```

**Ejercicio**
- Escribe los patrones de acceso de tu Planificador 2026 con su frecuencia estimada.

**Lo dominas si…** no empiezas a diseñar colecciones sin la lista de consultas.

### I4.2 · Embeber vs referenciar

**Contenido**
- Embeber: 1:1 y 1:pocos; lectura en una sola consulta.
- Referenciar: 1:muchos, N:M, datos que crecen sin límite.
- Arrays sin límite (*unbounded arrays*): el antipatrón más común.
- `$lookup` y su coste.

**Ejemplo**
```ts
// Opción A: un documento por usuario y curso (embebe las secciones leídas — acotadas)
{ userId: "u1", cursoId: "B1", seccionesLeidas: ["B1.1", "B1.2"], actualizado: ISODate() }

// Opción B: un documento por evento (crece sin límite → colección aparte)
{ userId: "u1", tipo: "evaluacion", cursoId: "B1", puntuacion: 4, fecha: ISODate() }
```

**Ejercicio**
- Para cada relación de tu diagrama de B4.2, decide embeber o referenciar y justifica la elección.

**Lo dominas si…** identificas un array que crecerá sin límite antes de que sea un problema.

### I4.3 · Patrones de diseño

**Contenido**
- *Subset*, *Computed*, *Bucket*, *Extended Reference*, *Outlier*, *Schema Versioning*.
- Desnormalizar con cabeza: qué hacer cuando cambia el dato duplicado.

**Ejemplo**
```ts
// Computed pattern: guardar el resumen en lugar de recalcularlo en cada visita
{
  userId: "u1",
  resumen: { seccionesLeidas: 23, cursosCompletados: 2, mediaEvaluaciones: 4.2 },
  actualizado: ISODate()
}
```

**Ejercicio**
- Aplica el patrón *Bucket* a los registros de hidratación de tu app (un documento por usuario y día en lugar de uno por vaso).

**Lo dominas si…** reconoces qué patrón aplica a un problema concreto.

### I4.4 · *Aggregation pipeline* I

**Contenido**
- Concepto de *pipeline* por etapas.
- `$match`, `$project`, `$addFields`, `$sort`, `$limit`, `$group`, `$unwind`, `$count`.
- Acumuladores: `$sum`, `$avg`, `$max`, `$push`.
- Probar *pipelines* en Compass.

**Ejemplo**
```ts
const mediaPorCurso = await db.collection("evaluaciones").aggregate([
  { $match: { userId } },
  { $group: { _id: "$cursoId", media: { $avg: "$puntuacion" }, intentos: { $sum: 1 } } },
  { $sort: { _id: 1 } },
]).toArray();
```

**Ejercicio**
- Calcula, con agregación, los km totales por semana de tu app de entrenamiento.

**Lo dominas si…** construyes un `$group` sin mirar ejemplos.

### I4.5 · *Aggregation pipeline* II

**Contenido**
- `$lookup` (joins) y `$lookup` con *pipeline*.
- `$facet` (varias agregaciones en una), `$bucket`, `$dateTrunc`.
- Rendimiento: `$match` y `$sort` al principio para usar índices.
- Tipar resultados de agregaciones (`aggregate<T>()`).

**Ejemplo**
```ts
const [dashboard] = await db.collection("progreso").aggregate<Dashboard>([
  { $match: { userId } },
  {
    $facet: {
      porCurso: [{ $project: { cursoId: 1, leidas: { $size: "$seccionesLeidas" } } }],
      total: [{ $group: { _id: null, leidas: { $sum: { $size: "$seccionesLeidas" } } } }],
    },
  },
]).toArray();
```

**Ejercicio**
- Construye con una sola agregación los datos de la **página de progreso**: % por curso, total de secciones leídas y última evaluación de cada curso.

**Lo dominas si…** una página completa de estadísticas sale de una sola consulta.

### I4.6 · Validación de esquema en la BD

**Contenido**
- `$jsonSchema` en `createCollection` / `collMod`.
- `validationLevel` y `validationAction`.
- Doble validación: Zod en la app + `$jsonSchema` en la BD.
- Migraciones de esquema con scripts versionados.

**Ejemplo**
```ts
await db.createCollection("evaluaciones", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["userId", "cursoId", "puntuacion", "fecha"],
      properties: {
        puntuacion: { bsonType: "int", minimum: 0, maximum: 5 },
        fecha: { bsonType: "date" },
      },
    },
  },
});
```

**Ejercicio**
- Añade validación `$jsonSchema` a la colección principal de tu Planificador e intenta insertar un documento inválido.

**Lo dominas si…** tu BD rechaza datos corruptos aunque la app tenga un bug.

### Proyecto del curso I4
**Esquema de Dani Academy en MongoDB**: documento de diseño (patrones de acceso, colecciones, índices, decisiones embeber/referenciar), script de creación con validación e índices y la agregación del dashboard de progreso.

### Evaluación final I4 (5 preguntas)
1. Regla principal del modelado en MongoDB.
2. Cuándo referenciar en lugar de embeber.
3. Qué es un *unbounded array*.
4. Qué hace `$group`.
5. Por qué poner `$match` al inicio del *pipeline*.

### Referencias
- MongoDB · Data Modeling: https://www.mongodb.com/docs/manual/data-modeling/
- MongoDB · Aggregation: https://www.mongodb.com/docs/manual/aggregation/

---

## I5 · Autenticación y autorización a fondo

| Dato | Valor |
|---|---|
| ID / slug | `I5` / `autenticacion-y-autorizacion` |
| Secciones | 5 (~5 h) |
| Prerrequisitos | B3, I3 |
| Objetivo | Entender qué hace Better Auth por dentro y proteger correctamente datos y rutas |

**Al terminar podrás:** explicar el flujo completo de registro y login, configurar Better Auth con MongoDB, proteger rutas y aplicar autorización por usuario y por rol.

### I5.1 · Contraseñas y *hashing*

**Contenido**
- Por qué nunca se guardan contraseñas en texto plano ni cifradas (reversibles).
- *Hashing* con sal: bcrypt, scrypt, argon2.
- Ataques: fuerza bruta, diccionario, *rainbow tables*, *credential stuffing*.
- Qué algoritmo usa Better Auth y dónde guarda el *hash* (colección `account`).

**Ejemplo**
```ts
import { scrypt, randomBytes, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
const scryptAsync = promisify(scrypt);

async function hash(password: string) {
  const salt = randomBytes(16).toString("hex");
  const key = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${salt}:${key.toString("hex")}`;
}
```

**Ejercicio**
- Implementa `hash` y `verificar` (con `timingSafeEqual`) solo con fines didácticos y explica por qué en producción usas la librería.

**Lo dominas si…** puedes explicar qué es una sal y por qué hace inútiles las *rainbow tables*.

### I5.2 · Better Auth con MongoDB

**Contenido**
- Configuración de servidor (`betterAuth`) y adaptador `@better-auth/mongo-adapter`.
- Colecciones generadas: `user`, `session`, `account`, `verification`.
- Ruta *catch-all* `src/pages/api/auth/[...all].ts`.
- Cliente (`createAuthClient`) para React.
- Campos adicionales del usuario (`additionalFields`).

**Ejemplo**
```ts
// src/lib/auth.ts
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { getMongoClient } from "@/lib/mongo";

const client = await getMongoClient();

export const auth = betterAuth({
  database: mongodbAdapter(client.db()),
  emailAndPassword: { enabled: true },
  secret: import.meta.env.BETTER_AUTH_SECRET,
  baseURL: import.meta.env.BETTER_AUTH_URL,
});
```
```ts
// src/pages/api/auth/[...all].ts
import type { APIRoute } from "astro";
import { auth } from "@/lib/auth";
export const ALL: APIRoute = (ctx) => auth.handler(ctx.request);
```

**Ejercicio**
- En tu app de entrenamiento, recorre en Compass las 4 colecciones de Better Auth después de registrarte, iniciar sesión y cerrar sesión. Documenta qué cambia en cada paso.

**Lo dominas si…** puedes configurar Better Auth en un proyecto nuevo sin copiar de otro.

### I5.3 · Sesiones, cookies y protección de rutas

**Contenido**
- Ciclo de vida de una sesión: creación, renovación (`updateAge`), expiración (`expiresIn`).
- Leer la sesión en el servidor (`auth.api.getSession`) vs en el cliente (`useSession`).
- Proteger páginas en el *middleware* y endpoints en cada handler.
- Redirecciones post-login (`?redirect=`), evitando *open redirects*.

**Ejemplo**
```ts
function destinoSeguro(param: string | null): string {
  return param && param.startsWith("/") && !param.startsWith("//") ? param : "/";
}
```

**Ejercicio**
- Protege las rutas privadas de tu app con *middleware* y añade un redireccionamiento seguro tras el login.

**Lo dominas si…** puedes explicar dónde se valida la sesión en cada tipo de petición.

### I5.4 · Autorización

**Contenido**
- Autenticación (quién eres) vs autorización (qué puedes hacer).
- **Autorización a nivel de dato:** filtrar SIEMPRE por `userId` de la sesión, nunca por uno que envía el cliente.
- IDOR (*Insecure Direct Object Reference*).
- Roles simples (`user`, `admin`) y comprobaciones centralizadas.

**Ejemplo**
```ts
// ❌ Vulnerable: el cliente decide de quién son los datos
const datos = await progreso.find({ userId: body.userId }).toArray();

// ✅ Correcto: el servidor decide a partir de la sesión
const datos = await progreso.find({ userId: locals.user!.id }).toArray();
```

**Ejercicio**
- Revisa todos los endpoints de tu app de entrenamiento buscando IDOR: intenta leer datos de otro usuario cambiando un ID en la petición.

**Lo dominas si…** cada consulta a la BD de datos privados incluye el `userId` de la sesión.

### I5.5 · Formularios de auth y experiencia de usuario

**Contenido**
- Registro (nombre, correo, contraseña) y login (correo, contraseña) con el cliente de Better Auth.
- Mensajes de error que no revelan si un correo existe.
- Estado de carga, autocompletado (`autocomplete="email"`, `"new-password"`, `"current-password"`).
- Cerrar sesión y limpiar el estado del cliente.

**Ejemplo**
```tsx
import { createAuthClient } from "better-auth/react";
export const authClient = createAuthClient();

const { error } = await authClient.signUp.email({ name, email, password });
if (error) setError("No se pudo crear la cuenta. Revisa los datos.");
else window.location.href = "/";
```

**Ejercicio**
- Construye las páginas `/registro` y `/login` con React + `react-hook-form` + Zod + `authClient`.

**Lo dominas si…** el flujo de auth funciona, es accesible y no filtra información.

### Proyecto del curso I5
**Módulo de autenticación reutilizable**: `lib/auth.ts`, `middleware.ts`, páginas de registro/login/logout, tipos de `locals` y un *checklist* de autorización aplicado a todos los endpoints.

### Evaluación final I5 (5 preguntas)
1. Por qué se usa sal al hacer *hash*.
2. Autenticación vs autorización.
3. Qué es una vulnerabilidad IDOR.
4. Dónde leer la sesión en Astro SSR.
5. Qué es un *open redirect*.

### Referencias
- Better Auth: https://www.better-auth.com/docs
- OWASP Authentication Cheat Sheet: https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html

---

## I6 · Servidores Linux

| Dato | Valor |
|---|---|
| ID / slug | `I6` / `servidores-linux` |
| Secciones | 6 (~6 h) |
| Prerrequisitos | B3 |
| Objetivo | Administrar un servidor Linux con confianza desde la terminal |

**Al terminar podrás:** moverte por un servidor con la terminal, gestionar usuarios y permisos, conectarte por SSH de forma segura, controlar procesos y servicios y configurar un firewall básico.

### I6.1 · La terminal sin miedo

**Contenido**
- Shell, `zsh` (tu iTerm2) y `bash`. Rutas absolutas y relativas.
- Navegación y archivos: `ls`, `cd`, `pwd`, `cp`, `mv`, `rm`, `mkdir`, `touch`.
- Leer archivos: `cat`, `less`, `head`, `tail -f`.
- Buscar: `grep`, `find`. Tuberías (`|`) y redirecciones (`>`, `>>`).
- Alias y `.zshrc`.

**Ejemplo**
```bash
grep -rn "MONGODB_URI" src/
find . -name "*.astro" -not -path "./node_modules/*" | wc -l
tail -f logs/app.log | grep ERROR
```

**Ejercicio**
- Crea 5 alias útiles en tu `.zshrc` (por ejemplo `gs` para `git status`, `dev` para `npm run dev`).
- Cuenta con una sola línea de comandos cuántos componentes React tiene tu app.

**Lo dominas si…** usas la terminal para tareas que antes hacías en Finder.

### I6.2 · Usuarios, permisos y paquetes

**Contenido**
- Usuarios y grupos, `root` y `sudo`.
- Permisos `rwx`, notación octal (`755`, `644`, `600`), `chmod`, `chown`.
- Gestor de paquetes `apt` (Ubuntu/Debian).
- Estructura del sistema de archivos: `/etc`, `/var`, `/home`, `/opt`, `/usr`.

**Ejemplo**
```bash
sudo adduser deploy
sudo usermod -aG sudo deploy
chmod 600 ~/.ssh/authorized_keys
ls -l /etc/nginx/
```

**Ejercicio**
- Con Docker (`docker run -it ubuntu bash`) o un VPS barato, crea un usuario `deploy` con `sudo` y practica permisos sobre archivos.

**Lo dominas si…** lees `-rw-r--r--` y sabes quién puede hacer qué.

### I6.3 · SSH

**Contenido**
- Claves pública y privada (`ssh-keygen -t ed25519`).
- `~/.ssh/config` para alias de servidores.
- Endurecer SSH: deshabilitar login de `root` y por contraseña.
- `scp` y `rsync` para copiar archivos.

**Ejemplo**
```
# ~/.ssh/config
Host academy
  HostName 203.0.113.10
  User deploy
  IdentityFile ~/.ssh/id_ed25519
```
```bash
ssh-copy-id academy
ssh academy
rsync -avz ./dist/ academy:/var/www/academy/
```

**Ejercicio**
- Configura acceso por clave a tu servidor de práctica y desactiva el acceso por contraseña en `/etc/ssh/sshd_config`.

**Lo dominas si…** entras a tu servidor con `ssh academy` y nadie puede entrar con contraseña.

### I6.4 · Procesos y servicios

**Contenido**
- Procesos: `ps`, `top`/`htop`, `kill`, señales (`SIGTERM`, `SIGKILL`).
- Primer plano/segundo plano, `nohup`.
- `systemd`: `systemctl start|stop|restart|status|enable`, `journalctl`.
- Crear un servicio propio para una app Node.

**Ejemplo**
```ini
# /etc/systemd/system/academy.service
[Unit]
Description=Dani Academy
After=network.target

[Service]
User=deploy
WorkingDirectory=/opt/academy
EnvironmentFile=/opt/academy/.env
ExecStart=/usr/bin/node dist/server/entry.mjs
Restart=always

[Install]
WantedBy=multi-user.target
```

**Ejercicio**
- Crea un servicio `systemd` para un servidor Node mínimo, mata su proceso y comprueba que se reinicia solo. Lee sus logs con `journalctl -u`.

**Lo dominas si…** tu app sobrevive a un reinicio del servidor.

### I6.5 · Redes y firewall

**Contenido**
- Interfaces e IPs (`ip a`), puertos abiertos (`ss -tulpn`).
- Firewall con `ufw`: permitir 22, 80, 443 y denegar el resto.
- `curl` y `ping` para diagnosticar.
- `fail2ban` contra ataques de fuerza bruta en SSH.

**Ejemplo**
```bash
sudo ufw default deny incoming
sudo ufw allow OpenSSH
sudo ufw allow 80,443/tcp
sudo ufw enable
sudo ss -tulpn
```

**Ejercicio**
- Configura `ufw` en tu servidor de práctica y comprueba desde tu Mac que un puerto no permitido está cerrado.

**Lo dominas si…** sabes qué puertos expone tu servidor y por qué.

### I6.6 · Scripts de Bash y automatización

**Contenido**
- Variables, condicionales, bucles y funciones en Bash.
- `set -euo pipefail` para scripts seguros.
- `cron` para tareas programadas (por ejemplo, avisos o backups).
- Logs y rotación (`logrotate`).

**Ejemplo**
```bash
#!/usr/bin/env bash
set -euo pipefail

FECHA=$(date +%F)
DESTINO="/var/backups/academy/$FECHA"
mkdir -p "$DESTINO"
mongodump --uri="$MONGODB_URI" --out="$DESTINO"
find /var/backups/academy -maxdepth 1 -mtime +7 -exec rm -rf {} +
echo "Backup OK: $DESTINO"
```
```
# crontab -e   →  todos los días a las 3:00
0 3 * * * /opt/academy/scripts/backup.sh >> /var/log/academy-backup.log 2>&1
```

**Ejercicio**
- Escribe un script que haga *backup* de tu base de datos del Planificador y prográmalo con `cron`.

**Lo dominas si…** automatizas una tarea repetitiva con un script en lugar de hacerla a mano.

### Proyecto del curso I6
**Servidor endurecido**: un VPS (o máquina virtual) con usuario `deploy`, SSH solo con clave, `ufw`, `fail2ban`, una app Node como servicio `systemd` y *backups* diarios con `cron`.

### Evaluación final I6 (5 preguntas)
1. Significado de los permisos `644`.
2. Por qué deshabilitar el login por contraseña en SSH.
3. `SIGTERM` vs `SIGKILL`.
4. Para qué sirve `systemd`.
5. Qué hace `ufw default deny incoming`.

### Referencias
- The Linux Command Line (gratuito): https://linuxcommand.org/tlcl.php
- DigitalOcean · Initial Server Setup with Ubuntu: https://www.digitalocean.com/community/tutorials

---

## I7 · Sistema de diseño con Tailwind v4

| Dato | Valor |
|---|---|
| ID / slug | `I7` / `sistema-de-diseno-con-tailwind` |
| Secciones | 5 (~5 h) |
| Prerrequisitos | B7 |
| Objetivo | Construir un sistema de diseño coherente: *tokens*, tema light/dark, tipografía de lectura y accesibilidad |

**Al terminar podrás:** definir *tokens* semánticos, implementar modo oscuro sin parpadeos, diseñar tipografía para lectura larga y cumplir criterios de accesibilidad.

### I7.1 · *Design tokens* y colores semánticos

**Contenido**
- *Tokens* primitivos (`teal-600`) vs semánticos (`accent`, `surface`, `danger`).
- Variables CSS + `@theme` en Tailwind v4.
- La paleta de Dani Academy convertida a *tokens*.

**Ejemplo**
```css
@import "tailwindcss";

:root {
  --bg: #fafafa;
  --surface: #eaedf2;
  --surface-2: #e2e8f0;
  --text: #0f172a;
  --muted: #475569;
  --accent: #0d9488;
  --info: #0284c7;
  --warning: #d97706;
  --danger: #f25c76;
}

@theme inline {
  --color-bg: var(--bg);
  --color-surface: var(--surface);
  --color-surface-2: var(--surface-2);
  --color-fg: var(--text);
  --color-muted: var(--muted);
  --color-accent: var(--accent);
  --color-info: var(--info);
  --color-warning: var(--warning);
  --color-danger: var(--danger);
}
```

**Ejercicio**
- Define los *tokens* de tu app de entrenamiento y sustituye todos los colores directos (`bg-slate-100`) por semánticos (`bg-surface`).

**Lo dominas si…** cambiar el color de acento implica tocar una sola línea.

### I7.2 · Modo light/dark sin parpadeo

**Contenido**
- `prefers-color-scheme` vs preferencia del usuario.
- `@custom-variant dark` en Tailwind v4 con clase `.dark` o `data-theme`.
- Script inline en `<head>` para evitar el parpadeo (FOUC).
- Persistencia en `localStorage` y compatibilidad con View Transitions de Astro.

**Ejemplo**
```css
@custom-variant dark (&:where([data-theme=dark], [data-theme=dark] *));

[data-theme="dark"] {
  --bg: #0b1120;
  --surface: #111827;
  --surface-2: #1f2937;
  --text: #e5e7eb;
  --muted: #94a3b8;
  --accent: #2dd4bf;
}
```
```astro
<script is:inline>
  const guardado = localStorage.getItem("tema");
  const oscuro = guardado ? guardado === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
  document.documentElement.dataset.theme = oscuro ? "dark" : "light";
</script>
```

**Ejercicio**
- Implementa el *toggle* de tema en tu app, sin parpadeo al recargar ni al navegar con View Transitions.

**Lo dominas si…** recargar la página en modo oscuro nunca muestra un destello blanco.

### I7.3 · Tipografía para lectura

**Contenido**
- Elegir fuentes: serif para lectura larga vs sans-serif para interfaz; monoespaciada para código.
- Carga de fuentes: `@fontsource`, `font-display: swap`, *preload*.
- Medida (60–75 caracteres), interlineado (1.6–1.8), escala tipográfica.
- Personalizar `prose` de `@tailwindcss/typography` con los *tokens*.
- Bloques de código con resaltado (Shiki, integrado en Astro).

**Ejemplo**
```css
@plugin "@tailwindcss/typography";

@theme {
  --font-serif: "Source Serif 4", Georgia, serif;
  --font-sans: "Inter", system-ui, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, monospace;
}
```
```html
<article class="prose prose-lg mx-auto max-w-[68ch] font-serif dark:prose-invert">…</article>
```

**Ejercicio**
- Diseña la tipografía de una sección del temario: títulos, párrafos, listas, citas y bloques de código, en light y dark.

**Lo dominas si…** puedes leer 20 minutos seguidos en tu página sin fatiga.

### I7.4 · Accesibilidad (a11y)

**Contenido**
- Contraste WCAG (4.5:1 para texto normal) y cómo medirlo.
- HTML semántico, *landmarks* (`header`, `nav`, `main`, `aside`), jerarquía de encabezados.
- Foco visible, navegación con teclado y *skip link*.
- ARIA solo cuando el HTML no basta; `aria-pressed` para botones *toggle*.
- `prefers-reduced-motion`.

**Ejemplo**
```html
<a href="#contenido" class="sr-only focus:not-sr-only">Saltar al contenido</a>
<button aria-pressed="true" class="focus-visible:outline-2 focus-visible:outline-accent">Leído</button>
```

**Ejercicio**
- Pasa Lighthouse y axe DevTools sobre tu página de curso y corrige todos los problemas de accesibilidad. Verifica el contraste de `#0d9488` sobre `#fafafa`.

**Lo dominas si…** puedes usar tu página entera solo con el teclado.

### I7.5 · Librería de componentes propia

**Contenido**
- Inventario de componentes: Button, Badge, Card, Checkbox, ProgressBar, Alert, Tabs.
- Variantes con `cva` (*class-variance-authority*) o un mapa de clases.
- Documentar componentes (una página `/ui` interna).

**Ejemplo**
```ts
import { cva, type VariantProps } from "class-variance-authority";

export const button = cva("inline-flex items-center rounded-lg font-medium transition", {
  variants: {
    variant: {
      primary: "bg-accent text-white hover:bg-accent/90",
      secondary: "bg-surface text-fg hover:bg-surface-2",
      danger: "bg-danger text-white",
    },
    size: { sm: "px-3 py-1.5 text-sm", md: "px-4 py-2" },
  },
  defaultVariants: { variant: "primary", size: "md" },
});
export type ButtonVariants = VariantProps<typeof button>;
```

**Ejercicio**
- Crea la página `/ui` con todos tus componentes en sus variantes, en light y dark.

**Lo dominas si…** construyes una página nueva solo combinando tus componentes.

### Proyecto del curso I7
**Sistema de diseño de Dani Academy**: *tokens* light/dark con la paleta oficial, tipografía de lectura, `prose` personalizado, *toggle* de tema sin parpadeo y página `/ui` con los componentes base, todo con accesibilidad AA.

### Evaluación final I7 (5 preguntas)
1. *Token* primitivo vs semántico.
2. Cómo evitar el parpadeo del modo oscuro.
3. Medida de línea recomendada para lectura.
4. Contraste mínimo WCAG AA para texto normal.
5. Cuándo usar `aria-pressed`.

### Referencias
- Tailwind v4 · Dark mode: https://tailwindcss.com/docs/dark-mode
- WCAG 2.2 Quick Reference: https://www.w3.org/WAI/WCAG22/quickref/
- Practical Typography: https://practicaltypography.com/

---

## I8 · Testing

| Dato | Valor |
|---|---|
| ID / slug | `I8` / `testing` |
| Secciones | 6 (~6 h) |
| Prerrequisitos | I1, I2, I3 |
| Objetivo | Escribir tests útiles en las tres capas: unitarios, de integración y *end-to-end* |

**Al terminar podrás:** decidir qué testear, escribir tests con Vitest, probar componentes React, endpoints con una BD real y flujos completos con Playwright.

### I8.1 · Por qué y qué testear

**Contenido**
- La pirámide (o el trofeo) de testing: unitarios, integración, E2E.
- Qué merece un test: reglas de negocio, bugs que ya ocurrieron, flujos críticos.
- Estructura AAA (*Arrange, Act, Assert*).
- Vitest: instalación y configuración con Astro (`getViteConfig`).

**Ejemplo**
```ts
// src/services/progreso.service.test.ts
import { describe, it, expect } from "vitest";
import { porcentaje } from "./progreso.service";

describe("porcentaje", () => {
  it("devuelve 0 cuando no hay secciones", () => {
    expect(porcentaje(0, 0)).toBe(0);
  });
  it("redondea al entero más cercano", () => {
    expect(porcentaje(1, 3)).toBe(33);
  });
});
```

**Ejercicio**
- Configura Vitest en tu app de entrenamiento y escribe 5 tests para una función pura (por ejemplo, cálculo de volumen o de km semanales).

**Lo dominas si…** sabes justificar por qué algo merece (o no) un test.

### I8.2 · Tests unitarios a fondo

**Contenido**
- *Matchers* (`toEqual`, `toThrow`, `toMatchObject`).
- Tests parametrizados (`it.each`).
- *Mocks*, *spies* y *fakes* (`vi.fn`, `vi.mock`, `vi.useFakeTimers`).
- Testear reducers (el del cuestionario de I2.3).

**Ejemplo**
```ts
it.each([
  [5, 5, 100],
  [3, 5, 60],
  [0, 5, 0],
])("aciertos=%i de %i → %i%%", (aciertos, total, esperado) => {
  expect(calcularNota(aciertos, total)).toBe(esperado);
});
```

**Ejercicio**
- Escribe tests completos para `quizReducer` cubriendo todas las acciones y casos límite.

**Lo dominas si…** cubres los casos límite antes de que aparezcan en producción.

### I8.3 · Testing de componentes React

**Contenido**
- Testing Library: testear como lo usa una persona (por rol y texto, no por clase).
- `render`, `screen`, `userEvent`, consultas `getByRole`, `findBy*`.
- Entorno `jsdom` o `happy-dom`.
- *Mock* de `fetch` con MSW.

**Ejemplo**
```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

it("marca la sección como leída", async () => {
  render(<BotonLeido seccionId="B1.1" inicial={false} />);
  await userEvent.click(screen.getByRole("button", { name: /marcar como leído/i }));
  expect(await screen.findByRole("button", { name: /leído/i })).toBeInTheDocument();
});
```

**Ejercicio**
- Testea el formulario de registro: errores de validación, botón deshabilitado y envío correcto.

**Lo dominas si…** tus tests no se rompen al cambiar clases de Tailwind.

### I8.4 · Tests de integración con MongoDB

**Contenido**
- Testear servicios y repositorios contra una BD real en memoria (`mongodb-memory-server`).
- Preparar y limpiar datos (`beforeEach`, `afterAll`).
- Testear endpoints de Astro llamando al handler con un `Request` simulado (o con Container API de Astro).

**Ejemplo**
```ts
import { MongoMemoryServer } from "mongodb-memory-server";
import { MongoClient } from "mongodb";

let mongo: MongoMemoryServer, client: MongoClient;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  client = await MongoClient.connect(mongo.getUri());
});
afterAll(async () => { await client.close(); await mongo.stop(); });

it("marcar dos veces no duplica la sección", async () => {
  const db = client.db("test");
  await marcarLeido(db, "u1", "B1.1");
  await marcarLeido(db, "u1", "B1.1");
  const doc = await db.collection("progreso").findOne({ userId: "u1" });
  expect(doc?.seccionesLeidas).toEqual(["B1.1"]);
});
```

**Ejercicio**
- Escribe tests de integración para el repositorio de progreso: marcar, desmarcar y calcular porcentaje.

**Lo dominas si…** confías en tus consultas sin probarlas a mano en Compass.

### I8.5 · Tests *end-to-end* con Playwright

**Contenido**
- Instalación, navegadores y `playwright.config.ts` con `webServer`.
- *Locators*, *assertions* automáticas y esperas.
- Reutilizar la sesión iniciada (`storageState`).
- Modo UI y *trace viewer* para depurar.

**Ejemplo**
```ts
import { test, expect } from "@playwright/test";

test("registro, lectura y progreso", async ({ page }) => {
  await page.goto("/registro");
  await page.getByLabel("Nombre").fill("Test");
  await page.getByLabel("Correo").fill(`t${Date.now()}@test.com`);
  await page.getByLabel("Contraseña").fill("password123");
  await page.getByRole("button", { name: "Crear cuenta" }).click();

  await page.goto("/curso/typescript-desde-cero");
  await page.getByRole("button", { name: "Marcar como leído" }).first().click();
  await page.goto("/progreso");
  await expect(page.getByText(/1 de 8/)).toBeVisible();
});
```

**Ejercicio**
- Escribe el test E2E del flujo principal de tu app de entrenamiento: login → registrar entreno → verlo en la lista.

**Lo dominas si…** un test E2E te avisa cuando rompes un flujo crítico.

### I8.6 · Cobertura y hábitos

**Contenido**
- Cobertura (`vitest --coverage`): útil como pista, no como objetivo.
- TDD aplicado a un bug: primero el test que falla, luego el arreglo.
- Tests lentos e inestables (*flaky*): cómo evitarlos.
- Organización de carpetas y *scripts* de `package.json`.

**Ejemplo**
```json
{
  "scripts": {
    "test": "vitest",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "playwright test"
  }
}
```

**Ejercicio**
- Elige un bug real que hayas tenido, reprodúcelo con un test que falle y arréglalo.

**Lo dominas si…** escribir un test antes de arreglar un bug es tu reflejo natural.

### Proyecto del curso I8
**Suite de tests de la API de progreso** (proyecto de I3): unitarios para servicios, integración con `mongodb-memory-server`, componentes con Testing Library y un test E2E del flujo "leer sección → ver progreso".

### Evaluación final I8 (5 preguntas)
1. Diferencia entre test unitario, de integración y E2E.
2. Qué es la estructura AAA.
3. Por qué consultar por rol en Testing Library.
4. Para qué sirve `mongodb-memory-server`.
5. Qué es un test *flaky*.

### Referencias
- Vitest: https://vitest.dev/
- Testing Library: https://testing-library.com/docs/react-testing-library/intro/
- Playwright: https://playwright.dev/

---

# NIVEL AVANZADO

> **Meta del nivel:** pensar como desarrollador full-stack que opera sus propios sistemas: tipos expresivos, bases de datos optimizadas (documentales y relacionales), servidores propios, seguridad, rendimiento y automatización.

---

## A1 · TypeScript avanzado

| Dato | Valor |
|---|---|
| ID / slug | `A1` / `typescript-avanzado` |
| Secciones | 5 (~5 h) |
| Prerrequisitos | I1 |
| Objetivo | Crear tipos que se calculan a partir de otros y entender los tipos de las librerías más complejas |

**Al terminar podrás:** escribir tipos condicionales, *mapped types* y *template literal types*, usar `infer` y diseñar APIs tipadas que guían a quien las usa.

### A1.1 · Tipos condicionales e `infer`

**Contenido**
- `T extends U ? X : Y`.
- Distribución sobre uniones (y cómo evitarla con `[T]`).
- `infer` para extraer tipos (cómo están hechos `ReturnType` y `Awaited`).

**Ejemplo**
```ts
type EsArray<T> = T extends unknown[] ? true : false;
type Elemento<T> = T extends (infer U)[] ? U : never;
type MiReturnType<F> = F extends (...args: any[]) => infer R ? R : never;

type A = Elemento<string[]>;   // string
```

**Ejercicio**
- Reimplementa `Awaited`, `Parameters` y `NonNullable` sin mirar su definición.

**Lo dominas si…** lees la definición de un *utility type* de `lib.es5.d.ts` y la entiendes.

### A1.2 · *Mapped types* y modificadores

**Contenido**
- `{ [K in keyof T]: … }`.
- Modificadores `readonly` y `?` (y quitarlos con `-`).
- Renombrar claves con `as`.
- Filtrar propiedades por tipo.

**Ejemplo**
```ts
type Getters<T> = { [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K] };
type SoloStrings<T> = { [K in keyof T as T[K] extends string ? K : never]: T[K] };

type G = Getters<{ nombre: string; edad: number }>;
// { getNombre: () => string; getEdad: () => number }
```

**Ejercicio**
- Crea `DeepPartial<T>` y `DeepReadonly<T>` recursivos y pruébalos con un objeto de configuración anidado.

**Lo dominas si…** transformas cualquier tipo de objeto en otro sin repetirlo.

### A1.3 · *Template literal types*

**Contenido**
- Tipos de cadena compuestos: `` `${A}-${B}` ``.
- `Uppercase`, `Lowercase`, `Capitalize`, `Uncapitalize`.
- Validar formatos en tipos (IDs, rutas, eventos).

**Ejemplo**
```ts
type Nivel = "B" | "I" | "A";
type CursoId = `${Nivel}${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8}`;
type SeccionId = `${CursoId}.${number}`;

const ok: SeccionId = "B1.3";
// const mal: SeccionId = "X1.3"; ❌
```

**Ejercicio**
- Tipa un sistema de eventos `on("progreso:marcado", handler)` donde el tipo del *payload* dependa del nombre del evento.

**Lo dominas si…** el compilador detecta un ID con formato incorrecto.

### A1.4 · Diseño de APIs con tipos

**Contenido**
- Inferencia a partir de argumentos (el truco de las librerías como Zod o tRPC).
- Parámetros genéricos `const` (`<const T>`).
- *Branded types* para IDs (`UserId` ≠ `CursoId` aunque ambos sean `string`).
- `satisfies` para validar sin perder inferencia.

**Ejemplo**
```ts
type Brand<T, B> = T & { readonly __brand: B };
type UserId = Brand<string, "UserId">;
type CursoId = Brand<string, "CursoId">;

function progreso(user: UserId, curso: CursoId) { /* … */ }
// progreso(cursoId, userId) ❌ ya no compila

const rutas = {
  inicio: "/",
  progreso: "/progreso",
} satisfies Record<string, `/${string}`>;
```

**Ejercicio**
- Aplica *branded types* a los IDs de tu app y `satisfies` a tus objetos de configuración.

**Lo dominas si…** tus tipos impiden errores que antes solo se veían en ejecución.

### A1.5 · Rendimiento del compilador y tipos de terceros

**Contenido**
- Leer errores largos de tipos (de abajo arriba).
- Declaraciones de módulos (`declare module`) y ampliación de tipos de librerías.
- `tsc --noEmit`, `--extendedDiagnostics` y proyectos lentos.
- Tipos complejos vs legibilidad: cuándo parar.

**Ejemplo**
```ts
// Ampliar los tipos de una librería
declare module "better-auth" {
  interface User {
    rol?: "user" | "admin";
  }
}
```

**Ejercicio**
- Toma el error de tipos más largo que encuentres en tu proyecto y explícalo línea por línea.

**Lo dominas si…** un error de tipos de 30 líneas no te bloquea.

### Proyecto del curso A1
**Contenido tipado de la plataforma**: tipos con *template literals* para `CursoId`/`SeccionId`, *branded types* para IDs de usuario, el temario declarado con `satisfies` y un sistema de eventos tipado.

### Evaluación final A1 (5 preguntas)
1. Qué hace `infer`.
2. Cómo renombrar claves en un *mapped type*.
3. Para qué sirve un *template literal type*.
4. Qué problema resuelven los *branded types*.
5. `satisfies` vs anotación de tipo.

### Referencias
- TypeScript · Type Manipulation: https://www.typescriptlang.org/docs/handbook/2/types-from-types.html
- Type Challenges: https://github.com/type-challenges/type-challenges

---

## A2 · MongoDB avanzado

| Dato | Valor |
|---|---|
| ID / slug | `A2` / `mongodb-avanzado` |
| Secciones | 5 (~5 h) |
| Prerrequisitos | I4 |
| Objetivo | Operar MongoDB en producción: transacciones, rendimiento, búsqueda y fiabilidad |

**Al terminar podrás:** usar transacciones cuando sean necesarias, optimizar consultas con índices avanzados, implementar búsqueda de texto y planificar *backups* y monitorización.

### A2.1 · Transacciones y consistencia

**Contenido**
- Atomicidad a nivel de documento (por qué muchas veces no necesitas transacciones).
- Transacciones multi-documento: `session.withTransaction`.
- *Write concern* y *read concern*. *Replica sets*.
- Concurrencia optimista con un campo `version`.

**Ejemplo**
```ts
const session = client.startSession();
try {
  await session.withTransaction(async () => {
    await evaluaciones.insertOne({ userId, cursoId, puntuacion, fecha: new Date() }, { session });
    await resumen.updateOne(
      { userId },
      { $inc: { evaluacionesHechas: 1 }, $max: { [`mejorNota.${cursoId}`]: puntuacion } },
      { session, upsert: true },
    );
  });
} finally {
  await session.endSession();
}
```

**Ejercicio**
- Implementa "guardar evaluación + actualizar resumen" con y sin transacción y analiza qué puede fallar en cada caso.

**Lo dominas si…** sabes cuándo una transacción es imprescindible y cuándo basta un único `updateOne`.

### A2.2 · Rendimiento e índices avanzados

**Contenido**
- `explain` a fondo: `totalKeysExamined`, `totalDocsExamined`, `nReturned`.
- Índices *covered*, parciales, *sparse*, multiclave (arrays), TTL.
- *Profiler* y *Performance Advisor* de Atlas.
- Paginación eficiente: por cursor (`_id > último`) en lugar de `skip`.

**Ejemplo**
```ts
// Paginación por cursor
const pagina = await evaluaciones
  .find({ userId, ...(despuesDe && { _id: { $lt: new ObjectId(despuesDe) } }) })
  .sort({ _id: -1 })
  .limit(20)
  .toArray();

// Índice parcial: solo evaluaciones aprobadas
await evaluaciones.createIndex({ userId: 1, cursoId: 1 }, { partialFilterExpression: { puntuacion: { $gte: 3 } } });
```

**Ejercicio**
- Inserta 1 millón de documentos de prueba, compara la paginación con `skip` vs por cursor y documenta los tiempos.

**Lo dominas si…** consigues que `totalDocsExamined` ≈ `nReturned` en tus consultas críticas.

### A2.3 · Búsqueda de texto

**Contenido**
- Índice `text` nativo y sus limitaciones (idioma español, *stemming*).
- Atlas Search: índices de búsqueda, `$search`, *fuzzy*, *autocomplete*, *highlight*.
- Cuándo vale la pena un motor de búsqueda dedicado.

**Ejemplo**
```ts
const resultados = await db.collection("secciones").aggregate([
  {
    $search: {
      index: "default",
      text: { query: "genericos", path: ["titulo", "contenido"], fuzzy: { maxEdits: 1 } },
      highlight: { path: "contenido" },
    },
  },
  { $limit: 10 },
  { $project: { titulo: 1, cursoId: 1, highlights: { $meta: "searchHighlights" } } },
]).toArray();
```

**Ejercicio**
- Añade búsqueda con Atlas Search a las notas de tu Planificador, tolerante a errores de escritura.

**Lo dominas si…** tu buscador encuentra "genericos" cuando el texto dice "genéricos".

### A2.4 · *Change streams* y eventos

**Contenido**
- `watch()` para reaccionar a cambios en tiempo real.
- Casos de uso: notificaciones (tus avisos de Telegram), cachés, auditoría.
- *Resume tokens* para no perder eventos.
- Atlas Triggers como alternativa *serverless*.

**Ejemplo**
```ts
const stream = db.collection("evaluaciones").watch([{ $match: { operationType: "insert" } }]);
for await (const cambio of stream) {
  const ev = cambio.fullDocument;
  if (ev.puntuacion === 5) await notificarTelegram(`🎉 5/5 en ${ev.cursoId}`);
}
```

**Ejercicio**
- Rehaz el sistema de avisos de tu Planificador usando *change streams* o Atlas Triggers en lugar de sondeo (*polling*).

**Lo dominas si…** reaccionas a cambios de la BD sin consultas periódicas.

### A2.5 · Operación: *backups*, seguridad y monitorización

**Contenido**
- Usuarios y roles de BD con mínimo privilegio; lista de IPs permitidas.
- `mongodump`/`mongorestore` vs *backups* de Atlas; probar la restauración.
- Métricas clave: conexiones, operaciones/s, latencia, *cache hit ratio*.
- MongoDB autoalojado vs Atlas: costes y responsabilidades.

**Ejemplo**
```bash
mongodump --uri="$MONGODB_URI" --archive=academy.gz --gzip
mongorestore --uri="$MONGODB_URI_STAGING" --archive=academy.gz --gzip --drop
```

**Ejercicio**
- Crea un usuario de BD de solo lectura para analítica y otro de lectura/escritura solo sobre la BD de la app. Haz un *backup* y restáuralo en otra BD.

**Lo dominas si…** has restaurado un *backup* con éxito al menos una vez.

### Proyecto del curso A2
**MongoDB listo para producción** en el Planificador 2026: índices revisados con `explain`, paginación por cursor, búsqueda con Atlas Search, avisos por *change streams* y *backup* restaurable documentado.

### Evaluación final A2 (5 preguntas)
1. Cuándo se necesita una transacción multi-documento.
2. Qué indica `totalDocsExamined` en un `explain`.
3. Por qué la paginación con `skip` es lenta.
4. Ventaja de Atlas Search sobre el índice `text`.
5. Para qué sirve un *resume token*.

### Referencias
- MongoDB · Transactions: https://www.mongodb.com/docs/manual/core/transactions/
- MongoDB · Atlas Search: https://www.mongodb.com/docs/atlas/atlas-search/

---

## A3 · SQL y PostgreSQL

| Dato | Valor |
|---|---|
| ID / slug | `A3` / `sql-y-postgresql` |
| Secciones | 6 (~6 h) |
| Prerrequisitos | B4, I1 |
| Objetivo | Dominar una base de datos relacional para poder elegir con criterio entre SQL y MongoDB |

**Al terminar podrás:** diseñar esquemas relacionales, escribir consultas avanzadas, usar PostgreSQL desde TypeScript con un ORM/*query builder* y comparar ambos mundos con datos reales.

### A3.1 · PostgreSQL en local y tipos de datos

**Contenido**
- Instalación con Docker y cliente `psql` (o TablePlus/DBeaver).
- Tipos: `text`, `integer`, `numeric`, `boolean`, `timestamptz`, `uuid`, `jsonb`, arrays.
- Restricciones: `PRIMARY KEY`, `FOREIGN KEY`, `UNIQUE`, `NOT NULL`, `CHECK`.
- Servicios gestionados (Neon, Supabase).

**Ejemplo**
```bash
docker run --name pg -e POSTGRES_PASSWORD=dev -p 5432:5432 -d postgres:17
docker exec -it pg psql -U postgres
```
```sql
CREATE TABLE usuarios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre text NOT NULL,
  email text NOT NULL UNIQUE,
  creado timestamptz NOT NULL DEFAULT now()
);
```

**Ejercicio**
- Crea en PostgreSQL el esquema de Dani Academy que diseñaste en B4 con todas las restricciones.

**Lo dominas si…** la BD impide por sí sola datos inconsistentes.

### A3.2 · Consultas avanzadas

**Contenido**
- `JOIN` (inner, left), `GROUP BY` + `HAVING`.
- Subconsultas y CTE (`WITH`).
- Funciones de ventana: `ROW_NUMBER`, `RANK`, `LAG`, medias móviles.
- `jsonb` y sus operadores.

**Ejemplo**
```sql
WITH notas AS (
  SELECT usuario_id, curso_id, puntuacion, fecha,
         ROW_NUMBER() OVER (PARTITION BY usuario_id, curso_id ORDER BY fecha DESC) AS rn
  FROM evaluaciones
)
SELECT curso_id, puntuacion AS ultima_nota
FROM notas
WHERE usuario_id = $1 AND rn = 1;
```

**Ejercicio**
- Reproduce en SQL la agregación del dashboard de progreso de I4.5 y compara ambas versiones.

**Lo dominas si…** usas una función de ventana para resolver "el último de cada grupo".

### A3.3 · Índices, planes y transacciones en PostgreSQL

**Contenido**
- `EXPLAIN ANALYZE` y cómo leerlo.
- Índices B-tree, compuestos, parciales y GIN (para `jsonb` y búsqueda).
- Niveles de aislamiento y bloqueos.
- Búsqueda de texto completo en español (`to_tsvector('spanish', …)`).

**Ejemplo**
```sql
EXPLAIN ANALYZE SELECT * FROM progreso WHERE usuario_id = '…' AND curso_id = 'B1';
CREATE INDEX ON progreso (usuario_id, curso_id);
```

**Ejercicio**
- Genera 1 millón de filas con `generate_series` y optimiza las tres consultas principales hasta que usen índices.

**Lo dominas si…** lees un `EXPLAIN ANALYZE` y detectas el cuello de botella.

### A3.4 · PostgreSQL desde TypeScript

**Contenido**
- Driver `pg` / `postgres` y consultas parametrizadas (nunca concatenar SQL).
- ORM y *query builders*: Drizzle ORM (esquema en TypeScript, tipos inferidos).
- Migraciones con `drizzle-kit`.
- *Pool* de conexiones en *serverless*.

**Ejemplo**
```ts
// src/db/schema.ts
import { pgTable, uuid, text, timestamp, integer } from "drizzle-orm/pg-core";

export const evaluaciones = pgTable("evaluaciones", {
  id: uuid("id").primaryKey().defaultRandom(),
  usuarioId: uuid("usuario_id").notNull(),
  cursoId: text("curso_id").notNull(),
  puntuacion: integer("puntuacion").notNull(),
  fecha: timestamp("fecha", { withTimezone: true }).defaultNow().notNull(),
});
```
```ts
const ultimas = await db.select().from(evaluaciones)
  .where(eq(evaluaciones.usuarioId, userId))
  .orderBy(desc(evaluaciones.fecha))
  .limit(5);
```

**Ejercicio**
- Implementa el repositorio de evaluaciones con Drizzle, manteniendo la misma interfaz que el de MongoDB (enlace con I3.5).

**Lo dominas si…** cambias de BD solo sustituyendo el repositorio.

### A3.5 · Diseño relacional avanzado

**Contenido**
- Tablas intermedias para N:M.
- Desnormalización controlada y vistas materializadas.
- Borrado en cascada vs borrado lógico.
- Row Level Security (RLS) como autorización en la BD.

**Ejemplo**
```sql
CREATE MATERIALIZED VIEW resumen_progreso AS
SELECT usuario_id, curso_id, COUNT(*) AS leidas
FROM secciones_leidas
GROUP BY usuario_id, curso_id;

REFRESH MATERIALIZED VIEW resumen_progreso;
```

**Ejercicio**
- Añade a tu esquema etiquetas para cursos (N:M) y una vista materializada para el dashboard.

**Lo dominas si…** decides entre normalizar o desnormalizar según los patrones de acceso.

### A3.6 · SQL vs MongoDB: decidir con criterio

**Contenido**
- Comparativa honesta: esquema, relaciones, transacciones, escalado, tipado, ecosistema.
- Casos reales: cuándo cada una brilla.
- Arquitecturas mixtas (*polyglot persistence*).

**Ejemplo**
```
| Necesidad                         | Mejor opción típica |
|-----------------------------------|---------------------|
| Muchas relaciones N:M e informes  | PostgreSQL          |
| Documentos flexibles y anidados   | MongoDB             |
| Transacciones financieras         | PostgreSQL          |
| Prototipo rápido con datos libres | MongoDB             |
```

**Ejercicio**
- Escribe un *ADR* (*Architecture Decision Record*) justificando por qué Dani Academy usa MongoDB y qué cambiaría si mañana necesitara PostgreSQL.

**Lo dominas si…** eliges base de datos por criterios técnicos y no por costumbre.

### Proyecto del curso A3
**Dani Academy sobre PostgreSQL (rama experimental)**: esquema con Drizzle, migraciones, repositorios con la misma interfaz que MongoDB y comparación de rendimiento y complejidad documentada en un ADR.

### Evaluación final A3 (5 preguntas)
1. Para qué sirve una CTE.
2. Qué resuelve una función de ventana.
3. Por qué usar consultas parametrizadas.
4. Qué es una vista materializada.
5. Un caso en el que elegirías PostgreSQL sobre MongoDB.

### Referencias
- PostgreSQL Tutorial: https://www.postgresqltutorial.com/
- Drizzle ORM: https://orm.drizzle.team/

---

## A4 · Despliegue en servidores propios

| Dato | Valor |
|---|---|
| ID / slug | `A4` / `despliegue-en-servidores-propios` |
| Secciones | 6 (~6 h) |
| Prerrequisitos | I3, I6 |
| Objetivo | Desplegar y operar una app Astro SSR en un VPS propio, más allá de Vercel |

**Al terminar podrás:** contenerizar una app con Docker, servirla tras Nginx con HTTPS, desplegar sin cortes y decidir entre VPS, PaaS y *serverless*.

### A4.1 · Vercel vs VPS vs PaaS

**Contenido**
- Qué hace Vercel por ti (build, CDN, HTTPS, *serverless*, *previews*).
- VPS (Hetzner, DigitalOcean), PaaS (Railway, Render, Fly.io), autoalojado con Coolify.
- Costes, control, responsabilidades y límites (*cold starts*, tiempo de ejecución).
- Adaptador `@astrojs/node` en modo `standalone`.

**Ejemplo**
```ts
// astro.config.mjs
import node from "@astrojs/node";
export default defineConfig({ output: "server", adapter: node({ mode: "standalone" }) });
```
```bash
npm run build
HOST=0.0.0.0 PORT=4321 node dist/server/entry.mjs
```

**Ejercicio**
- Compila tu app de entrenamiento con el adaptador Node y ejecútala en local como en producción.

**Lo dominas si…** sabes exactamente qué tendrías que montar tú si dejaras Vercel.

### A4.2 · Docker

**Contenido**
- Imágenes, contenedores, capas y caché.
- `Dockerfile` *multi-stage* para Astro.
- `.dockerignore`, variables de entorno y usuario no root.
- `docker compose` para app + MongoDB en local.

**Ejemplo**
```dockerfile
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production HOST=0.0.0.0 PORT=4321
COPY --from=build /app/dist ./dist
COPY --from=build /app/package*.json ./
RUN npm ci --omit=dev
USER node
EXPOSE 4321
CMD ["node", "dist/server/entry.mjs"]
```

**Ejercicio**
- Crea el `Dockerfile` y un `compose.yaml` con tu app y un MongoDB local; levanta todo con `docker compose up`.

**Lo dominas si…** tu app arranca igual en cualquier máquina con Docker.

### A4.3 · Nginx como *reverse proxy*

**Contenido**
- Qué es un *reverse proxy* y por qué ponerlo delante de Node.
- Configuración de `server`, `location`, `proxy_pass` y cabeceras `X-Forwarded-*`.
- Servir estáticos y compresión (gzip/brotli).
- Alternativa más simple: Caddy.

**Ejemplo**
```nginx
server {
  server_name academy.tudominio.com;

  location / {
    proxy_pass http://127.0.0.1:4321;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```

**Ejercicio**
- Sirve tu app en el VPS de I6 detrás de Nginx en el puerto 80.

**Lo dominas si…** explicas por qué Node no debería exponerse directamente en el puerto 80.

### A4.4 · HTTPS y dominios

**Contenido**
- Let's Encrypt y Certbot; renovación automática.
- Registro `A` en Namecheap apuntando a la IP del VPS (enlace con B3.2).
- Redirección HTTP → HTTPS y HSTS.

**Ejemplo**
```bash
sudo certbot --nginx -d academy.tudominio.com
sudo systemctl status certbot.timer
```

**Ejercicio**
- Apunta un subdominio a tu VPS, emite el certificado y comprueba la nota en SSL Labs.

**Lo dominas si…** tu subdominio tiene un certificado válido que se renueva solo.

### A4.5 · Despliegues sin cortes y *rollback*

**Contenido**
- Estrategias: reinicio simple, *blue-green*, *rolling*.
- PM2 o `systemd` para gestionar el proceso; o contenedores con `docker compose pull && up -d`.
- *Health checks* (`/api/health`).
- Volver a la versión anterior en minutos.

**Ejemplo**
```ts
// src/pages/api/health.ts
export const GET: APIRoute = async () => {
  try {
    await (await getDb()).command({ ping: 1 });
    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false }, { status: 503 });
  }
};
```
```bash
#!/usr/bin/env bash
set -euo pipefail
docker compose pull app
docker compose up -d app
curl -fsS https://academy.tudominio.com/api/health
```

**Ejercicio**
- Escribe un script de despliegue con *health check* que, si falla, vuelva a la imagen anterior.

**Lo dominas si…** un despliegue fallido no deja tu app caída.

### A4.6 · Operación diaria

**Contenido**
- Logs centralizados y rotación; `docker logs`, `journalctl`.
- Monitorización de disponibilidad (Uptime Kuma, Better Stack).
- Actualizaciones de seguridad (`unattended-upgrades`).
- *Runbook*: qué hacer cuando algo se cae.

**Ejemplo**
```markdown
## Runbook · La app no responde
1. `curl -I https://academy.tudominio.com/api/health`
2. `ssh academy` → `docker compose ps`
3. `docker compose logs --tail=200 app`
4. ¿MongoDB? `mongosh "$MONGODB_URI" --eval "db.runCommand({ping:1})"`
5. Rollback: `./scripts/rollback.sh`
```

**Ejercicio**
- Monta Uptime Kuma (en Docker) que vigile tu app y te avise por Telegram.

**Lo dominas si…** te enteras de una caída antes que tus usuarios.

### Proyecto del curso A4
**Dani Academy autoalojada**: imagen Docker, VPS endurecido (I6), Nginx + HTTPS en un subdominio propio, script de despliegue con *health check* y *rollback*, monitorización con avisos y *runbook* documentado.

### Evaluación final A4 (5 preguntas)
1. Qué aporta un *build multi-stage* en Docker.
2. Para qué sirve un *reverse proxy*.
3. Cómo se renueva un certificado de Let's Encrypt.
4. Qué es un *health check*.
5. Una ventaja y un inconveniente de un VPS frente a Vercel.

### Referencias
- Docker Docs: https://docs.docker.com/get-started/
- Nginx Beginner's Guide: https://nginx.org/en/docs/beginners_guide.html
- Astro · Deploy with Node: https://docs.astro.build/en/guides/integrations-guide/node/

---

## A5 · Seguridad web

| Dato | Valor |
|---|---|
| ID / slug | `A5` / `seguridad-web` |
| Secciones | 5 (~5 h) |
| Prerrequisitos | I3, I5 |
| Objetivo | Identificar y prevenir las vulnerabilidades más comunes en apps Astro + MongoDB |

**Al terminar podrás:** auditar tu propia app con la lista OWASP Top 10, prevenir XSS, inyección y CSRF, limitar abusos y gestionar secretos y dependencias.

### A5.1 · OWASP Top 10 y modelo de amenazas

**Contenido**
- Repaso del OWASP Top 10 con ejemplos en tu stack.
- Modelado de amenazas sencillo: activos, atacantes, superficies.
- Principios: mínimo privilegio, defensa en profundidad, fallar de forma segura.

**Ejemplo**
```
Activo: progreso y resultados de cada usuario
Amenaza: un usuario lee/modifica el progreso de otro (IDOR)
Control: filtrar siempre por locals.user.id (I5.4) + test de integración que lo verifique
```

**Ejercicio**
- Haz el modelo de amenazas de tu app de entrenamiento: 5 amenazas, su impacto y su control.

**Lo dominas si…** piensas en cómo romper una funcionalidad antes de darla por terminada.

### A5.2 · Inyección y XSS

**Contenido**
- Inyección NoSQL: operadores (`$ne`, `$gt`) colados en filtros desde el cuerpo de la petición.
- Inyección SQL (enlace con A3.4).
- XSS: almacenado, reflejado y basado en DOM. `set:html` en Astro y `dangerouslySetInnerHTML` en React.
- Sanitizar HTML (DOMPurify) y escapar por defecto.

**Ejemplo**
```ts
// ❌ body = { "email": { "$ne": null } } → devuelve el primer usuario
await users.findOne({ email: body.email });

// ✅ Validar el tipo antes de consultar
const { email } = z.object({ email: z.string().email() }).parse(body);
await users.findOne({ email });
```

**Ejercicio**
- Busca en tus proyectos todos los `set:html` / `dangerouslySetInnerHTML` y los filtros de MongoDB construidos con datos del cliente; corrígelos.

**Lo dominas si…** ningún dato del cliente llega a una consulta o al HTML sin validar/escapar.

### A5.3 · CSRF, cabeceras y CSP

**Contenido**
- CSRF y cómo lo mitigan `SameSite` y la comprobación de origen (`security.checkOrigin` de Astro).
- Cabeceras de seguridad: `Content-Security-Policy`, `X-Content-Type-Options`, `Referrer-Policy`, `Strict-Transport-Security`, `Permissions-Policy`.
- CSP con *hashes*/*nonces* y el script inline del tema.

**Ejemplo**
```ts
// src/middleware.ts (fragmento)
const res = await next();
res.headers.set("X-Content-Type-Options", "nosniff");
res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
res.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
return res;
```

**Ejercicio**
- Añade cabeceras de seguridad a tu app y consigue una A en securityheaders.com.

**Lo dominas si…** sabes qué ataque mitiga cada cabecera.

### A5.4 · *Rate limiting* y abuso

**Contenido**
- Fuerza bruta en el login y abuso de endpoints.
- *Rate limiting* por IP y por usuario (ventana fija, deslizante, *token bucket*).
- Rate limit de Better Auth y uno propio con MongoDB (índice TTL) o Redis.
- Obtener la IP real detrás de un proxy.

**Ejemplo**
```ts
// Ventana fija con MongoDB + índice TTL en `expira`
export async function limitar(clave: string, max: number, ventanaSeg: number) {
  const ahora = Date.now();
  const ventana = Math.floor(ahora / (ventanaSeg * 1000));
  const r = await db.collection("rate_limits").findOneAndUpdate(
    { _id: `${clave}:${ventana}` },
    { $inc: { n: 1 }, $setOnInsert: { expira: new Date(ahora + ventanaSeg * 1000) } },
    { upsert: true, returnDocument: "after" },
  );
  return (r?.n ?? 0) <= max;
}
```

**Ejercicio**
- Limita el envío de evaluaciones a 10 por hora por usuario y devuelve `429` con la cabecera `Retry-After`.

**Lo dominas si…** tus endpoints sensibles no aceptan peticiones ilimitadas.

### A5.5 · Secretos, dependencias y auditoría

**Contenido**
- Gestión de secretos: `.env`, variables de Vercel, rotación; qué hacer si subes un secreto a Git.
- Dependencias: `npm audit`, Dependabot/Renovate, *supply chain*.
- *Logging* seguro (nunca registrar contraseñas ni tokens).
- *Checklist* de seguridad antes de cada lanzamiento.

**Ejemplo**
```bash
npm audit --omit=dev
npx gitleaks detect --source .     # buscar secretos en el historial
```

**Ejercicio**
- Ejecuta `gitleaks` sobre tus repos, activa Dependabot y redacta tu *checklist* de seguridad.

**Lo dominas si…** sabes rotar un secreto filtrado en menos de 15 minutos.

### Proyecto del curso A5
**Auditoría de seguridad de Dani Academy**: modelo de amenazas, revisión OWASP, cabeceras y CSP, *rate limiting* en login y evaluaciones, tests que verifiquen la ausencia de IDOR e inyección NoSQL y *checklist* de lanzamiento.

### Evaluación final A5 (5 preguntas)
1. Cómo funciona una inyección NoSQL con `$ne`.
2. Tipos de XSS.
3. Qué mitiga `SameSite=Lax`.
4. Qué código HTTP devolver al superar un *rate limit*.
5. Qué hacer si se sube un secreto a un repositorio.

### Referencias
- OWASP Top 10: https://owasp.org/www-project-top-ten/
- OWASP Cheat Sheet Series: https://cheatsheetseries.owasp.org/
- MDN · Content Security Policy: https://developer.mozilla.org/es/docs/Web/HTTP/CSP

---

## A6 · Rendimiento y observabilidad

| Dato | Valor |
|---|---|
| ID / slug | `A6` / `rendimiento-y-observabilidad` |
| Secciones | 4 (~4 h) |
| Prerrequisitos | I3, A4 |
| Objetivo | Medir y mejorar la velocidad de la app y saber qué ocurre en producción |

**Al terminar podrás:** medir Core Web Vitals, optimizar carga de JS, imágenes y fuentes, aplicar caché en servidor y añadir logs estructurados y trazas de errores.

### A6.1 · Core Web Vitals

**Contenido**
- LCP, INP y CLS: qué miden y umbrales.
- Datos de laboratorio (Lighthouse) vs datos reales (CrUX, Vercel Speed Insights).
- Presupuestos de rendimiento.

**Ejemplo**
```bash
npx lighthouse https://academy.tudominio.com/curso/typescript-desde-cero --view
```

**Ejercicio**
- Mide las 3 páginas principales de tu app en móvil y documenta LCP, INP y CLS.

**Lo dominas si…** sabes qué métrica empeora cada tipo de problema.

### A6.2 · Optimización en el cliente

**Contenido**
- Menos JS: directivas `client:*` adecuadas, análisis del *bundle*.
- Imágenes con `<Image />` y `<Picture />` de Astro (formatos modernos, tamaños).
- Fuentes: *subsetting*, `preload`, `font-display`.
- Prefetch de Astro y View Transitions.

**Ejemplo**
```astro
---
import { Image } from "astro:assets";
import portada from "@/assets/portada.jpg";
---
<Image src={portada} alt="Portada del curso" widths={[400, 800]} sizes="(max-width: 800px) 100vw, 800px" />
```

**Ejercicio**
- Reduce el JS enviado en tu página más pesada al menos un 30 % y mide el antes/después.

**Lo dominas si…** cada kilobyte de JS de tu página tiene una justificación.

### A6.3 · Caché en servidor

**Contenido**
- Cabeceras `Cache-Control` y `s-maxage`/`stale-while-revalidate` en CDN.
- Caché en memoria y sus límites en *serverless*.
- Invalidación ("lo más difícil de la informática").
- Qué se puede cachear y qué nunca (datos privados por usuario).

**Ejemplo**
```ts
// Página pública del temario: CDN 1 h, sirve versión antigua mientras revalida
Astro.response.headers.set("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
```

**Ejercicio**
- Aplica caché de CDN a las páginas públicas y verifica con `curl -I` el estado de caché.

**Lo dominas si…** nunca cacheas por error una respuesta privada.

### A6.4 · Observabilidad

**Contenido**
- Logs estructurados (JSON) con `pino`; niveles y contexto (`requestId`, `userId`).
- Captura de errores con Sentry (cliente y servidor).
- Métricas básicas y alertas.
- Correlacionar un error del usuario con los logs del servidor.

**Ejemplo**
```ts
import pino from "pino";
export const log = pino({ level: import.meta.env.LOG_LEVEL ?? "info" });

// middleware
const requestId = crypto.randomUUID();
const inicio = performance.now();
const res = await next();
log.info({ requestId, ruta: ctx.url.pathname, status: res.status, ms: Math.round(performance.now() - inicio) });
```

**Ejercicio**
- Integra Sentry en tu app, provoca un error a propósito y localízalo con su traza y su `requestId`.

**Lo dominas si…** puedes explicar qué falló en producción sin reproducirlo en local.

### Proyecto del curso A6
**Informe de rendimiento y observabilidad de Dani Academy**: Core Web Vitals en verde en móvil, JS reducido, caché de CDN en páginas públicas, logs estructurados y Sentry configurado.

### Evaluación final A6 (5 preguntas)
1. Qué mide el LCP.
2. Datos de laboratorio vs datos reales.
3. Qué hace `stale-while-revalidate`.
4. Por qué no cachear respuestas privadas en la CDN.
5. Ventaja de los logs estructurados.

### Referencias
- web.dev · Core Web Vitals: https://web.dev/articles/vitals
- Sentry para Astro: https://docs.sentry.io/platforms/javascript/guides/astro/

---

## A7 · CI/CD con GitHub Actions

| Dato | Valor |
|---|---|
| ID / slug | `A7` / `cicd-con-github-actions` |
| Secciones | 4 (~4 h) |
| Prerrequisitos | B2, I8 |
| Objetivo | Automatizar la verificación y el despliegue de cada cambio |

**Al terminar podrás:** crear *workflows* de CI que validen tipos, *lint* y tests en cada PR, y pipelines de despliegue a Vercel o a tu VPS.

### A7.1 · Conceptos y primer *workflow*

**Contenido**
- CI vs CD. *Workflows*, *jobs*, *steps*, *runners*, eventos.
- Sintaxis YAML de GitHub Actions.
- Caché de dependencias.

**Ejemplo**
```yaml
# .github/workflows/ci.yml
name: CI
on:
  pull_request:
  push:
    branches: [main]

jobs:
  verificar:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: npm }
      - run: npm ci
      - run: npx astro check
      - run: npm run lint
      - run: npm run test:run
```

**Ejercicio**
- Añade este *workflow* a tu app de entrenamiento y abre una PR con un error de tipos a propósito para verlo fallar.

**Lo dominas si…** ninguna PR con errores de tipos puede mezclarse.

### A7.2 · Calidad de código automatizada

**Contenido**
- ESLint (configuración plana) + `typescript-eslint` + Prettier (o Biome).
- *Hooks* de Git con `lefthook` o `husky` + `lint-staged`.
- Reglas de protección de rama: CI obligatoria antes del *merge*.

**Ejemplo**
```yaml
# lefthook.yml
pre-commit:
  commands:
    lint:
      glob: "*.{ts,tsx,astro}"
      run: npx eslint {staged_files}
    format:
      glob: "*.{ts,tsx,astro,css,md}"
      run: npx prettier --check {staged_files}
```

**Ejercicio**
- Configura ESLint, Prettier y un *hook* de *pre-commit*; protege `main` para exigir CI verde.

**Lo dominas si…** el formato y el *lint* nunca se discuten en una revisión.

### A7.3 · Tests E2E y servicios en CI

**Contenido**
- Ejecutar Playwright en CI y guardar artefactos (trazas, capturas).
- Servicios en el *job* (MongoDB como contenedor).
- *Secrets* y variables de GitHub.
- Matrices (varias versiones de Node).

**Ejemplo**
```yaml
  e2e:
    runs-on: ubuntu-latest
    services:
      mongo:
        image: mongo:8
        ports: ["27017:27017"]
    env:
      MONGODB_URI: mongodb://localhost:27017/academy-test
      BETTER_AUTH_SECRET: ${{ secrets.BETTER_AUTH_SECRET_TEST }}
      BETTER_AUTH_URL: http://localhost:4321
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: npm }
      - run: npm ci
      - run: npx playwright install --with-deps chromium
      - run: npm run test:e2e
      - uses: actions/upload-artifact@v4
        if: failure()
        with: { name: playwright-report, path: playwright-report }
```

**Ejercicio**
- Añade el *job* E2E a tu CI con MongoDB como servicio.

**Lo dominas si…** cuando un E2E falla en CI, depuras con el informe descargado.

### A7.4 · Despliegue continuo

**Contenido**
- Vercel: *previews* por PR y producción desde `main` (lo que ya tienes, ahora entendido).
- CD a VPS: construir imagen Docker, publicar en GHCR y desplegar por SSH.
- Entornos y aprobaciones manuales.
- Versionado semántico y *changelog* automático.

**Ejemplo**
```yaml
  deploy:
    needs: [verificar, e2e]
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    environment: production
    steps:
      - uses: actions/checkout@v4
      - uses: docker/login-action@v3
        with: { registry: ghcr.io, username: ${{ github.actor }}, password: ${{ secrets.GITHUB_TOKEN }} }
      - uses: docker/build-push-action@v6
        with: { push: true, tags: ghcr.io/${{ github.repository }}:latest }
      - uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.VPS_HOST }}
          username: deploy
          key: ${{ secrets.VPS_SSH_KEY }}
          script: cd /opt/academy && ./scripts/deploy.sh
```

**Ejercicio**
- Automatiza el despliegue de A4 para que cada *merge* a `main` despliegue en tu VPS tras pasar CI.

**Lo dominas si…** desplegar es mezclar una PR, nada más.

### Proyecto del curso A7
**Pipeline completo de Dani Academy**: CI con tipos, *lint*, unitarios e integración; E2E con MongoDB en CI; *previews* en Vercel y despliegue automático a VPS desde `main`.

### Evaluación final A7 (5 preguntas)
1. Diferencia entre CI y CD.
2. Qué es un *job* y un *step*.
3. Cómo usar un secreto en un *workflow*.
4. Para qué sirven las reglas de protección de rama.
5. Qué hace `needs` en un *job*.

### Referencias
- GitHub Actions: https://docs.github.com/actions
- typescript-eslint: https://typescript-eslint.io/

---

## A8 · Arquitectura con Astro y React

| Dato | Valor |
|---|---|
| ID / slug | `A8` / `arquitectura-con-astro-y-react` |
| Secciones | 5 (~5 h) |
| Prerrequisitos | I2, I3, A1 |
| Objetivo | Tomar decisiones de arquitectura en proyectos Astro + React medianos y grandes |

**Al terminar podrás:** organizar el contenido con Content Collections, decidir qué renderizar en servidor o en cliente, gestionar estado entre islas y estructurar un proyecto para que escale.

### A8.1 · Content Collections

**Contenido**
- `src/content.config.ts`, *loaders* (`glob`, `file`) y esquemas Zod.
- Markdown/MDX con *frontmatter* tipado.
- `getCollection`, `getEntry`, `render`.
- Componentes React dentro de MDX.

**Ejemplo**
```ts
// src/content.config.ts
import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const secciones = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/cursos" }),
  schema: z.object({
    id: z.string(),            // "B1.3"
    cursoId: z.string(),       // "B1"
    titulo: z.string(),
    orden: z.number(),
    minutos: z.number().default(60),
  }),
});

export const collections = { secciones };
```

**Ejercicio**
- Migra el contenido de un curso de este temario a MDX con Content Collections y genera sus páginas con `getStaticPaths`.

**Lo dominas si…** un error en el *frontmatter* rompe el build con un mensaje claro.

### A8.2 · Servidor vs cliente: dónde vive cada cosa

**Contenido**
- Contenido estático + datos de usuario dinámicos en la misma página.
- *Server islands* (`server:defer`) para partes personalizadas en páginas cacheables.
- Datos iniciales desde el servidor para evitar *spinners*.
- Cuándo una isla React es excesiva (un `<script>` nativo basta).

**Ejemplo**
```astro
---
// Página de sección: el contenido se cachea; el progreso del usuario no.
import ProgresoUsuario from "@/components/ProgresoUsuario.astro";
---
<article class="prose">…contenido estático…</article>
<ProgresoUsuario server:defer seccionId="B1.3">
  <span slot="fallback">Cargando progreso…</span>
</ProgresoUsuario>
```

**Ejercicio**
- Rediseña la página de una sección para que el contenido sea cacheable y el estado "leído" llegue con una *server island*.

**Lo dominas si…** justificas cada isla de cliente de tu proyecto.

### A8.3 · Estado entre islas y sincronización

**Contenido**
- Nanostores (`atom`, `map`, `computed`) con `@nanostores/react`.
- El servidor como fuente de verdad e invalidación tras mutaciones.
- Sincronización entre pestañas (`BroadcastChannel`, evento `storage`).
- Persistencia de estado con View Transitions (`transition:persist`).

**Ejemplo**
```ts
// src/stores/progreso.ts
import { map, computed } from "nanostores";
export const $leidas = map<Record<string, boolean>>({});
export const $totalLeidas = computed($leidas, (l) => Object.values(l).filter(Boolean).length);
```
```tsx
import { useStore } from "@nanostores/react";
const total = useStore($totalLeidas);
```

**Ejercicio**
- Sincroniza el progreso entre el índice lateral, el botón de cada sección y una segunda pestaña abierta.

**Lo dominas si…** dos islas nunca muestran estados contradictorios.

### A8.4 · Estructura de proyecto escalable

**Contenido**
- Organización por funcionalidad (*feature folders*) vs por tipo.
- Límites entre módulos y *barrel files* (con cuidado).
- Convenciones de nombres y documentación (`README`, ADR).
- Monorepo (pnpm workspaces) solo cuando hace falta.

**Ejemplo**
```
src/
├── features/
│   ├── auth/        (components, actions, schemas, services)
│   ├── cursos/      (components, content, services)
│   ├── progreso/    (components, stores, services, repositories)
│   └── evaluaciones/
├── components/ui/   (sistema de diseño de I7)
├── lib/             (mongo, auth, logger)
├── layouts/
└── pages/           (solo enrutado: delgado)
```

**Ejercicio**
- Reorganiza tu app de entrenamiento por *features* y escribe un ADR explicando la estructura.

**Lo dominas si…** una funcionalidad nueva cabe en una carpeta sin tocar diez sitios.

### A8.5 · Revisión de arquitectura

**Contenido**
- Cómo revisar un proyecto: acoplamiento, duplicación, límites, rendimiento, seguridad.
- Deuda técnica: identificarla, priorizarla y pagarla.
- Documentar decisiones para tu "yo" del futuro (y para una IA).

**Ejemplo**
```markdown
# ADR-004 · Progreso en un documento por usuario y curso
Estado: aceptado · Fecha: 2026-10-02
Contexto: la consulta más frecuente es "secciones leídas de este curso".
Decisión: colección `progreso` con { userId, cursoId, seccionesLeidas[] } e índice único.
Consecuencias: lectura en 1 consulta; el array está acotado por el nº de secciones del curso.
```

**Ejercicio**
- Haz una revisión de arquitectura de tu Planificador 2026 y escribe los 3 ADR más importantes.

**Lo dominas si…** puedes explicar el porqué de cada decisión estructural de tus proyectos.

### Proyecto del curso A8
**Refactor arquitectónico de Dani Academy**: contenido en Content Collections, *server islands* para datos de usuario, nanostores entre islas, estructura por *features* y carpeta `docs/adr/` con las decisiones clave.

### Evaluación final A8 (5 preguntas)
1. Qué aporta un esquema en Content Collections.
2. Para qué sirve `server:defer`.
3. Cómo compartir estado entre islas.
4. Organización por *features* vs por tipo.
5. Qué es un ADR.

### Referencias
- Astro · Content Collections: https://docs.astro.build/en/guides/content-collections/
- Astro · Server Islands: https://docs.astro.build/en/guides/server-islands/
- Nanostores: https://github.com/nanostores/nanostores

---

# PROYECTO FINAL

## P1 · Proyecto integrador

| Dato | Valor |
|---|---|
| ID / slug | `P1` / `proyecto-integrador` |
| Secciones | 8 (~8 h + tiempo libre) |
| Prerrequisitos | Todo el temario |
| Objetivo | Construir de principio a fin una aplicación nueva aplicando todo lo aprendido |

**Propuesta:** reconstruir el **Planificador 2026 como producto v2** (multiusuario, con avisos por Telegram), o elegir una idea propia de complejidad similar. Debe incluir: Astro SSR + React + Tailwind v4, TypeScript estricto, MongoDB con modelado justificado, Better Auth, tests en las tres capas, CI/CD, despliegue en VPS con Docker y HTTPS, seguridad auditada y observabilidad.

### P1.1 · Descubrimiento y requisitos
**Contenido:** problema, usuarios, funcionalidades *must/should/could*, fuera de alcance.
**Ejercicio:** documento de requisitos de una página y lista priorizada de funcionalidades.
**Lo dominas si…** cualquiera entiende qué construirás y qué no.

### P1.2 · Diseño de datos y arquitectura
**Contenido:** patrones de acceso (I4.1), colecciones, índices, estructura de carpetas (A8.4), ADRs iniciales.
**Ejercicio:** documento de diseño + script de creación de colecciones con `$jsonSchema` e índices.
**Lo dominas si…** cada colección e índice responde a un patrón de acceso escrito.

### P1.3 · Base del proyecto
**Contenido:** repositorio, `tsconfig` estricto, Tailwind v4 con *tokens*, ESLint/Prettier, CI inicial, `.env.example` con `astro:env`.
**Ejercicio:** proyecto vacío pero desplegable, con CI verde.
**Lo dominas si…** el primer commit ya pasa tipos, *lint* y tests.

### P1.4 · Autenticación y autorización
**Contenido:** Better Auth + Mongo, *middleware*, páginas de registro/login, autorización por usuario.
**Ejercicio:** flujo de auth completo con test E2E.
**Lo dominas si…** ningún endpoint privado es accesible sin sesión ni con el ID de otro usuario.

### P1.5 · Funcionalidad principal
**Contenido:** CRUD principal por capas (ruta → servicio → repositorio), validación Zod, islas React con actualizaciones optimistas.
**Ejercicio:** funcionalidad *must* terminada con tests unitarios y de integración.
**Lo dominas si…** la funcionalidad principal funciona de punta a punta con tests.

### P1.6 · Funcionalidades avanzadas
**Contenido:** agregaciones para estadísticas, *change streams* o *cron* para avisos por Telegram, búsqueda.
**Ejercicio:** al menos dos funcionalidades *should*.
**Lo dominas si…** aplicas un concepto avanzado de MongoDB en un caso real.

### P1.7 · Calidad: seguridad, rendimiento y accesibilidad
**Contenido:** *checklist* de A5, Lighthouse/Core Web Vitals, axe, *rate limiting*, cabeceras, Sentry y logs.
**Ejercicio:** informe con métricas y vulnerabilidades revisadas antes y después.
**Lo dominas si…** Lighthouse ≥ 90 en todas las categorías y la auditoría de seguridad queda sin hallazgos abiertos.

### P1.8 · Despliegue y presentación
**Contenido:** Docker, VPS, Nginx + HTTPS, CD desde `main`, monitorización, `README` y demo.
**Ejercicio:** app en producción en un subdominio propio + `README` con arquitectura, decisiones y cómo ejecutarla.
**Lo dominas si…** otra persona puede clonar, ejecutar y desplegar el proyecto siguiendo solo el `README`.

### Evaluación final P1 (5 preguntas)
1. Justificación del modelo de datos elegido.
2. Cómo se protege la autorización a nivel de dato.
3. Estrategia de testing aplicada.
4. Flujo de despliegue y *rollback*.
5. La decisión técnica de la que más aprendiste y por qué.

> En P1 la evaluación es reflexiva: las respuestas son abiertas y se autoevalúan con una rúbrica (0–1 punto cada una).

---

## Anexo A · Resumen para la plataforma

Tabla de referencia rápida para la Fase 3 (índice del temario y semilla de la base de datos).

| Orden | ID | Slug | Curso | Nivel | Secciones |
|---|---|---|---|---|---|
| 1 | B1 | `typescript-desde-cero` | TypeScript desde cero | Básico | 8 |
| 2 | B2 | `git-y-flujo-de-trabajo` | Git y flujo de trabajo | Básico | 4 |
| 3 | B3 | `como-funciona-la-web` | Cómo funciona la web | Básico | 5 |
| 4 | B4 | `fundamentos-de-bases-de-datos` | Fundamentos de bases de datos | Básico | 5 |
| 5 | B5 | `mongodb-esencial` | MongoDB esencial | Básico | 6 |
| 6 | B6 | `react-esencial` | React esencial | Básico | 7 |
| 7 | B7 | `tailwind-css-v4-esencial` | Tailwind CSS v4 esencial | Básico | 5 |
| 8 | I1 | `typescript-intermedio` | TypeScript intermedio | Intermedio | 6 |
| 9 | I2 | `react-intermedio` | React intermedio | Intermedio | 6 |
| 10 | I3 | `backend-con-astro` | Backend con Astro | Intermedio | 6 |
| 11 | I4 | `modelado-de-datos-con-mongodb` | Modelado de datos con MongoDB | Intermedio | 6 |
| 12 | I5 | `autenticacion-y-autorizacion` | Autenticación y autorización a fondo | Intermedio | 5 |
| 13 | I6 | `servidores-linux` | Servidores Linux | Intermedio | 6 |
| 14 | I7 | `sistema-de-diseno-con-tailwind` | Sistema de diseño con Tailwind v4 | Intermedio | 5 |
| 15 | I8 | `testing` | Testing | Intermedio | 6 |
| 16 | A1 | `typescript-avanzado` | TypeScript avanzado | Avanzado | 5 |
| 17 | A2 | `mongodb-avanzado` | MongoDB avanzado | Avanzado | 5 |
| 18 | A3 | `sql-y-postgresql` | SQL y PostgreSQL | Avanzado | 6 |
| 19 | A4 | `despliegue-en-servidores-propios` | Despliegue en servidores propios | Avanzado | 6 |
| 20 | A5 | `seguridad-web` | Seguridad web | Avanzado | 5 |
| 21 | A6 | `rendimiento-y-observabilidad` | Rendimiento y observabilidad | Avanzado | 4 |
| 22 | A7 | `cicd-con-github-actions` | CI/CD con GitHub Actions | Avanzado | 4 |
| 23 | A8 | `arquitectura-con-astro-y-react` | Arquitectura con Astro y React | Avanzado | 5 |
| 24 | P1 | `proyecto-integrador` | Proyecto integrador | Proyecto final | 8 |
| | | | **Total** | | **134** |

## Anexo B · Cómo aprovechar cada sesión de 1 hora

| Minutos | Actividad |
|---|---|
| 0–5 | Repaso del "Lo dominas si…" de la sección anterior |
| 5–20 | Leer el **Contenido** |
| 20–35 | Ejecutar y modificar el **Ejemplo** |
| 35–55 | Resolver el **Ejercicio** |
| 55–60 | Comprobar el criterio "Lo dominas si…" y **Marcar como leído** |

Si no cumples el criterio, no marques la sección: repítela en la siguiente sesión. Avanzar despacio con bases sólidas es más rápido a medio plazo que avanzar con huecos.

---

## Pendiente de confirmar

- ¿El orden de los cursos y su reparto por niveles te encaja?
- ¿Quieres añadir, quitar o fusionar algún curso (por ejemplo, retrasar **A3 · SQL y PostgreSQL** o ampliar **I6 · Servidores Linux**)?
- ¿Confirmamos **B1 · TypeScript desde cero** como el primer curso a maquetar en la plataforma (Fase 3)?
