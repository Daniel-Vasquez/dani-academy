# Planificación · Dani Academy

> Documento generado en la **Fase 3**. Fuentes: `respuestas.md` (perfil) y `temario.md` (contenido).
> Cada **Tanda** está escrita para que una IA (o tú) pueda ejecutarla **sin contexto adicional**: incluye objetivo, dependencias, variables de entorno, estructura de archivos, código clave y criterios de aceptación.
> Regla de oro: **no empieces una Tanda sin haber cumplido los criterios de aceptación de la anterior.**

---

## Índice

- [0. Visión general](#0-visión-general)
- [1. Decisiones de arquitectura](#1-decisiones-de-arquitectura)
- [2. Estructura de carpetas final](#2-estructura-de-carpetas-final)
- [3. Modelo de datos (MongoDB)](#3-modelo-de-datos-mongodb)
- [4. Rutas de la aplicación](#4-rutas-de-la-aplicación)
- [5. Sistema de diseño](#5-sistema-de-diseño)
- [6. Convenciones](#6-convenciones)
- [7. Mapa de Tandas](#7-mapa-de-tandas)
- [Tanda 0 · Fundaciones del proyecto](#tanda-0--fundaciones-del-proyecto)
- [Tanda 1 · Maquetación del curso B1](#tanda-1--maquetación-del-curso-b1)
- [Tanda 2 · MongoDB y capa de datos](#tanda-2--mongodb-y-capa-de-datos)
- [Tanda 3 · Autenticación con Better Auth](#tanda-3--autenticación-con-better-auth)
- [Tanda 4 · Tracking: "Marcar como leído" y sesiones de estudio](#tanda-4--tracking-marcar-como-leído-y-sesiones-de-estudio)
- [Tanda 5 · Evaluaciones](#tanda-5--evaluaciones)
- [Tanda 6 · Índice del temario](#tanda-6--índice-del-temario)
- [Tanda 7 · Página de progreso](#tanda-7--página-de-progreso)
- [Tanda 8 · Producción de contenido](#tanda-8--producción-de-contenido)
- [Tanda 9 · Calidad: tests, seguridad, accesibilidad y CI](#tanda-9--calidad-tests-seguridad-accesibilidad-y-ci)
- [Tanda 10 · Despliegue a producción](#tanda-10--despliegue-a-producción)
- [Anexo A · Variables de entorno](#anexo-a--variables-de-entorno)
- [Anexo B · Prompt para ejecutar una Tanda con una IA](#anexo-b--prompt-para-ejecutar-una-tanda-con-una-ia)

---

## 0. Visión general

**Dani Academy** es una plataforma personal de aprendizaje para leer el temario de `temario.md`, marcar el avance por sección, hacer una evaluación de 5 preguntas al final de cada curso y ver el progreso.

| Pieza | Decisión |
|---|---|
| Framework | **Astro** (`output: "server"`) con islas de **React** |
| Estilos | **Tailwind CSS v4** (`@tailwindcss/vite`) + `@tailwindcss/typography` |
| Lenguaje | **TypeScript** en modo `strict` |
| Contenido | **Astro Content Collections** (MDX + JSON + YAML dentro del repo) |
| Base de datos | **MongoDB** (Atlas) con el driver oficial `mongodb`. Solo datos del usuario |
| Autenticación | **Better Auth** + `@better-auth/mongo-adapter`. Solo correo y contraseña |
| Despliegue | **Vercel** (`@astrojs/vercel`) |

**Funcionalidades (alcance cerrado):**

1. Registro (nombre, correo, contraseña) e inicio de sesión (correo, contraseña). Sin 2FA, sin verificación de correo y sin recuperación de contraseña.
2. Lectura de cursos por secciones, con un botón **Marcar como leído** en cada sección.
3. Evaluación de **5 preguntas** al final de cada curso; cada intento se guarda en MongoDB.
4. **Índice del temario**: niveles → cursos; al hacer clic en un curso se abre el curso.
5. **Página de progreso**: sesiones de estudio, resultados de exámenes y avance.
6. Modo **light/dark**, diseño centrado en la lectura.

---

## 1. Decisiones de arquitectura

| # | Decisión | Motivo |
|---|---|---|
| D1 | **El contenido vive en el repo** (Content Collections), **no en MongoDB** | El temario es código versionado: se revisa en PRs, se valida con Zod en el build y no necesita un CMS. MongoDB guarda solo lo que pertenece a cada usuario |
| D2 | **Todas las páginas se renderizan en servidor** (`output: "server"`) | Todas las páginas, salvo login y registro, son privadas y muestran datos del usuario |
| D3 | **Identificadores estables**: curso `B1`, sección `B1.3` | Son las claves con las que se guarda el progreso. Nunca cambian aunque cambie el título o el slug |
| D4 | **Una colección por tipo de evento del usuario** (`section_progress`, `quiz_attempts`, `study_sessions`) | Escrituras simples e idempotentes, índices claros y documentos acotados (ver §3) |
| D5 | **`userId` se guarda como `string`** (el `user.id` de la sesión de Better Auth) | Simplicidad: nunca se hace `$lookup` contra `user`, siempre se filtra por la sesión |
| D6 | **Arquitectura por capas en servidor**: ruta/acción → servicio → repositorio | Lógica testeable, endpoints delgados (temario I3.5) |
| D7 | **Los repositorios son factorías que reciben un `Db`** | Permite tests de integración con `mongodb-memory-server` (Tanda 9) |
| D8 | **La lógica pura vive en `src/lib/domain/`** sin imports de `astro:*` | Se testea con Vitest sin montar Astro |
| D9 | **Las respuestas correctas de las evaluaciones nunca llegan al cliente** | La corrección se hace en una Astro Action en servidor |
| D10 | **Sesión de estudio = latidos (*heartbeats*) agrupados** con un hueco máximo de 30 min | Mide tiempo real de lectura sin depender de que el usuario pulse "terminar" |
| D11 | **Identificadores de código en inglés, textos de interfaz y URLs en español** | Convención habitual; el contenido y la UI están en español |

---

## 2. Estructura de carpetas final

Esta es la estructura al terminar todas las Tandas. Cada Tanda indica qué archivos crea o modifica.

```
dani-academy/
├── .env                          # local, NO se sube (gitignored)
├── .env.example                  # plantilla de variables
├── .github/workflows/ci.yml      # Tanda 9
├── astro.config.mjs
├── package.json
├── playwright.config.ts          # Tanda 9
├── tsconfig.json
├── vitest.config.ts              # Tanda 9
├── respuestas.md · temario.md · planificacion.md
├── public/
│   └── favicon.svg
├── scripts/
│   └── db-setup.ts               # Tanda 2 (colecciones, validadores, índices)
├── src/
│   ├── actions/
│   │   └── index.ts              # Tanda 5 (submitQuiz)
│   ├── components/
│   │   ├── auth/                 # Tanda 3 (LoginForm.tsx, RegisterForm.tsx)
│   │   ├── course/               # Tanda 1 (CourseSidebar, SectionNav, MarkAsReadButton…)
│   │   ├── layout/               # Tanda 1 (SiteHeader, ThemeToggle, SkipLink)
│   │   ├── mdx/                  # Tanda 1 (Callout)
│   │   ├── progress/             # Tanda 7
│   │   ├── quiz/                 # Tanda 5 (Quiz.tsx)
│   │   ├── syllabus/             # Tanda 6
│   │   └── ui/                   # Tanda 1 (Badge, ProgressBar, ButtonLink)
│   ├── content/
│   │   ├── courses.json          # Tanda 1 (catálogo de los 24 cursos)
│   │   ├── sections/
│   │   │   └── typescript-desde-cero/
│   │   │       ├── 01-que-es-typescript.mdx
│   │   │       └── …             # Tanda 1 (B1) y Tanda 8 (resto)
│   │   └── quizzes/
│   │       └── b1.yaml           # Tanda 5 (B1) y Tanda 8 (resto)
│   ├── content.config.ts         # Tanda 1
│   ├── env.d.ts                  # Tanda 3
│   ├── layouts/
│   │   ├── AuthLayout.astro      # Tanda 3
│   │   ├── BaseLayout.astro      # Tanda 1
│   │   └── CourseLayout.astro    # Tanda 1
│   ├── lib/
│   │   ├── auth.ts               # Tanda 3
│   │   ├── auth-client.ts        # Tanda 3
│   │   ├── cn.ts                 # Tanda 0
│   │   ├── constants.ts          # Tanda 1
│   │   ├── content.ts            # Tanda 1
│   │   ├── domain/               # Tandas 4, 5, 7 (lógica pura)
│   │   ├── errors.ts             # Tanda 4
│   │   └── mongo.ts              # Tanda 2
│   ├── middleware.ts             # Tanda 3
│   ├── pages/
│   │   ├── 404.astro             # Tanda 1
│   │   ├── index.astro           # Tanda 3 (redirige a /temario)
│   │   ├── login.astro           # Tanda 3
│   │   ├── registro.astro        # Tanda 3
│   │   ├── temario.astro         # Tanda 6
│   │   ├── progreso.astro        # Tanda 7
│   │   ├── cursos/[course]/index.astro       # Tanda 1
│   │   ├── cursos/[course]/[section].astro   # Tanda 1
│   │   ├── cursos/[course]/evaluacion.astro  # Tanda 5
│   │   └── api/
│   │       ├── auth/[...all].ts  # Tanda 3
│   │       ├── health.ts         # Tanda 2
│   │       ├── progress/[sectionId].ts      # Tanda 4
│   │       └── study-sessions/heartbeat.ts  # Tanda 4
│   ├── schemas/                  # Zod compartido cliente/servidor (Tanda 3+)
│   ├── server/
│   │   ├── repositories/         # Tanda 2+ (acceso a MongoDB)
│   │   └── services/             # Tanda 4+ (reglas de negocio)
│   └── styles/
│       └── global.css            # Tanda 0
└── tests/
    ├── e2e/                      # Tanda 9
    ├── integration/              # Tanda 9
    └── unit/                     # Tanda 9
```

---

## 3. Modelo de datos (MongoDB)

Base de datos: `dani_academy` (configurable con `MONGODB_DB`).

### 3.1 Colecciones gestionadas por Better Auth (Tanda 3)

| Colección | Contenido |
|---|---|
| `user` | `name`, `email`, `emailVerified`, `image`, `createdAt`, `updatedAt` |
| `session` | `token`, `userId`, `expiresAt`, `ipAddress`, `userAgent` |
| `account` | `providerId: "credential"`, `userId`, `password` (hash) |
| `verification` | No se usa (no hay verificación de correo), pero Better Auth puede crearla |

> No se modifican a mano. Solo se añaden índices (Tanda 3).

### 3.2 Colecciones propias

#### `section_progress` — una fila por sección leída (Tanda 4)

```ts
interface SectionProgressDoc {
  _id?: ObjectId;
  userId: string;      // user.id de Better Auth
  courseId: string;    // "B1"
  sectionId: string;   // "B1.3"
  readAt: Date;        // primera vez que se marcó como leída
}
```

| Índice | Uso |
|---|---|
| `{ userId: 1, sectionId: 1 }` **único** | Idempotencia de "marcar como leído" |
| `{ userId: 1, courseId: 1 }` | Secciones leídas de un curso (consulta más frecuente) |
| `{ userId: 1, readAt: -1 }` | "Continuar donde lo dejaste" y actividad reciente |

*¿Por qué no un array `seccionesLeidas` dentro de un documento por curso?* Porque así cada lectura conserva su fecha (`readAt`), que se usa en la página de progreso, y desmarcar es un simple `deleteOne`. El número de documentos está acotado (134 secciones por usuario como máximo).

#### `quiz_attempts` — un documento por intento de evaluación (Tanda 5)

```ts
interface QuizAttemptDoc {
  _id?: ObjectId;
  userId: string;
  courseId: string;        // "B1"
  answers: number[];       // índice de la opción elegida en cada pregunta (longitud 5)
  results: boolean[];      // acierto/fallo por pregunta (longitud 5)
  score: number;           // 0–5
  total: number;           // 5
  passed: boolean;         // score >= passingScore del curso
  submittedAt: Date;
}
```

| Índice | Uso |
|---|---|
| `{ userId: 1, courseId: 1, submittedAt: -1 }` | Intentos de un curso, mejor nota, último intento |
| `{ userId: 1, submittedAt: -1 }` | Historial de exámenes en la página de progreso |

#### `study_sessions` — sesiones de estudio (Tanda 4)

```ts
interface StudySessionDoc {
  _id?: ObjectId;
  userId: string;
  startedAt: Date;
  lastSeenAt: Date;        // se actualiza con cada heartbeat (cada 60 s con la pestaña visible)
  sectionIds: string[];    // secciones visitadas en la sesión ($addToSet, acotado)
  courseIds: string[];
}
```

Regla: un *heartbeat* extiende la sesión más reciente si `lastSeenAt` es de hace ≤ 30 min; si no, crea una nueva. Duración = `lastSeenAt − startedAt + 60 s`.

| Índice | Uso |
|---|---|
| `{ userId: 1, lastSeenAt: -1 }` | Encontrar la sesión activa y listar sesiones recientes |

#### `rate_limits` — límites de uso (Tanda 9)

```ts
interface RateLimitDoc { _id: string; n: number; expiresAt: Date }  // _id = "<clave>:<ventana>"
```

| Índice | Uso |
|---|---|
| `{ expiresAt: 1 }` con `expireAfterSeconds: 0` (TTL) | Borrado automático de ventanas caducadas |

### 3.3 Diagrama

```
Better Auth                       Dani Academy (por usuario)
┌──────────┐ 1      N ┌─────────────────────┐
│  user    │──────────│ section_progress    │  (userId, courseId, sectionId, readAt)
│  _id     │          └─────────────────────┘
│  name    │ 1      N ┌─────────────────────┐
│  email   │──────────│ quiz_attempts       │  (userId, courseId, score, passed, submittedAt)
└──────────┘          └─────────────────────┘
     │ 1            N ┌─────────────────────┐
     └────────────────│ study_sessions      │  (userId, startedAt, lastSeenAt, sectionIds)
                      └─────────────────────┘
Contenido (repo, no Mongo): courses.json · sections/*.mdx · quizzes/*.yaml
```

---

## 4. Rutas de la aplicación

| Ruta | Tipo | Acceso | Tanda | Descripción |
|---|---|---|---|---|
| `/` | Página | Privada | 3 | Redirige a `/temario` |
| `/login` | Página | Pública | 3 | Inicio de sesión (correo + contraseña) |
| `/registro` | Página | Pública | 3 | Registro (nombre + correo + contraseña) |
| `/temario` | Página | Privada | 6 | Índice del temario por niveles |
| `/cursos/[course]` | Página | Privada | 1 | Portada del curso: objetivo, secciones, evaluación |
| `/cursos/[course]/[section]` | Página | Privada | 1 | Lectura de una sección + "Marcar como leído" |
| `/cursos/[course]/evaluacion` | Página | Privada | 5 | Evaluación de 5 preguntas |
| `/progreso` | Página | Privada | 7 | Sesiones, exámenes y avance |
| `/api/auth/*` | API | Pública | 3 | Handler de Better Auth |
| `/api/health` | API | Pública | 2 | Comprobación de salud (ping a MongoDB) |
| `/api/progress/[sectionId]` | API | Privada | 4 | `PUT` marca, `DELETE` desmarca |
| `/api/study-sessions/heartbeat` | API | Privada | 4 | `POST` registra un latido de estudio |
| `/_actions/submitQuiz` | Action | Privada | 5 | Corrige y guarda una evaluación |

> En la Tanda 1 todavía no hay autenticación: las páginas del curso son accesibles sin sesión. A partir de la Tanda 3, el *middleware* las protege.

---

## 5. Sistema de diseño

### 5.1 Principios

1. **La lectura es lo primero.** Una sola columna de texto de **~68 caracteres**, interlineado amplio y sin barras laterales a la derecha, *banners* ni animaciones decorativas.
2. **La interfaz se aparta.** Cabecera mínima, índice lateral discreto y colores de acento solo para acciones y estados.
3. **Light y dark de primera clase.** Todo color sale de un *token*; ningún componente usa colores directos (`bg-slate-100`).
4. **Accesible por defecto.** Contraste WCAG AA, foco visible, navegación completa con teclado, `prefers-reduced-motion`.

### 5.2 Paleta y *tokens*

**Light** (paleta del brief):

| Token | Valor | Uso |
|---|---|---|
| `--bg` | `#fafafa` | Fondo de la página y del área de lectura |
| `--surface` | `#eaedf2` | Contenedores: barra lateral, tarjetas, bloques de código |
| `--surface-2` | `#e2e8f0` | Bordes, *hover*, separadores, pistas de barras de progreso |
| `--fg` | `#0f172a` | Texto principal |
| `--muted` | `#475569` | Texto secundario |
| `--accent` | `#0d9488` | Acento principal (teal): barras de progreso, iconos, bordes activos |
| `--accent-strong` | `#0f766e` | Acento para **texto y fondos de botón** (contraste AA) |
| `--info` | `#0284c7` | Enlaces informativos, notas |
| `--warning` | `#d97706` | Avisos, evaluación pendiente |
| `--danger` | `#f25c76` | Errores (bordes, iconos, fondos tenues) |
| `--danger-strong` | `#be123c` | Texto de error (contraste AA) |

> **Nota de accesibilidad:** `#0d9488` sobre `#fafafa` tiene un contraste aproximado de 3,7:1 y `#f25c76` de unos 3:1, que **no** llegan al 4,5:1 que pide AA para texto normal. Por eso se usan tal cual en elementos no textuales (barras, iconos, bordes) y se añaden variantes `-strong` para texto y botones. Es la misma paleta, aplicada con criterio (temario I7.4).

**Dark** (derivada para mantener el mismo carácter):

| Token | Valor |
|---|---|
| `--bg` | `#0d1117` |
| `--surface` | `#161b22` |
| `--surface-2` | `#222a35` |
| `--fg` | `#e6edf3` |
| `--muted` | `#9aa4b2` |
| `--accent` | `#2dd4bf` |
| `--accent-strong` | `#5eead4` |
| `--info` | `#38bdf8` |
| `--warning` | `#fbbf24` |
| `--danger` | `#f87191` |
| `--danger-strong` | `#fda4af` |

En dark, los botones con fondo `accent-strong` usan texto `--accent-contrast` (`#04201d`); en light, `#ffffff`.

### 5.3 Tipografía

| Rol | Fuente | Paquete | Uso |
|---|---|---|---|
| Lectura | **Source Serif 4** (variable) | `@fontsource-variable/source-serif-4` | Cuerpo y títulos del contenido (`prose`) |
| Interfaz | **Inter** (variable) | `@fontsource-variable/inter` | Navegación, botones, etiquetas, formularios |
| Código | **JetBrains Mono** (variable) | `@fontsource-variable/jetbrains-mono` | Bloques e *inline code* |

| Elemento | Tamaño / interlineado |
|---|---|
| Cuerpo de lectura | 1.125rem (18 px) / 1.75 |
| H1 de sección | 2.25rem (móvil 1.875rem), semibold, `tracking-tight` |
| H2 de contenido | 1.5rem, semibold, margen superior amplio |
| Código | 0.875em, interlineado 1.6, sin ajuste de línea (*scroll* horizontal) |
| Interfaz | 0.875rem–1rem en Inter |

Resaltado de código: **Shiki** (integrado en Astro) con temas duales `github-light` / `github-dark`, controlados por el atributo `data-theme`.

### 5.4 Layout del curso (Tanda 1)

```
Escritorio (≥ 1024 px)
┌───────────────────────────────────────────────────────────────────┐
│ Dani Academy   Temario / B1 · TypeScript desde cero        [☾]   │  ← cabecera de 56 px, borde inferior
├──────────────────┬────────────────────────────────────────────────┤
│ B1 · TypeScript  │                                                │
│ ▓▓▓▓░░░░ 3/8     │     B1.3 · Sección 3 de 8 · 60 min             │
│                  │     Arrays, tuplas y objetos                   │
│ ✓ 1 Qué es TS    │                                                │
│ ✓ 2 Primitivos   │     Texto de lectura en serif, 68ch máx…       │
│ ● 3 Arrays…      │     ```ts                                      │
│ ○ 4 type vs int. │     código                                     │
│ ○ …              │     ```                                        │
│ ─────────────    │     ┌ Ejercicio ─────────────────────┐         │
│ ◇ Evaluación     │     └────────────────────────────────┘         │
│                  │     [ Marcar como leído ]                       │
│ (sticky, 18rem)  │     ← Anterior            Siguiente →          │
└──────────────────┴────────────────────────────────────────────────┘

Móvil (< 1024 px): la barra lateral se convierte en un <details> "Índice del curso (3/8)"
debajo de la cabecera; el contenido ocupa todo el ancho con 16 px de margen.
```

---

## 6. Convenciones

| Tema | Convención |
|---|---|
| Gestor de paquetes | `npm` |
| Node | 22.12 o superior (LTS) |
| Imports | Alias `@/` → `src/` |
| Componentes | `PascalCase.astro` / `PascalCase.tsx`. Islas React con `export default` |
| Funciones y variables | `camelCase` en inglés |
| Textos de UI | Español. Términos técnicos en inglés cuando sea lo natural |
| Colores | Solo *tokens* (`bg-surface`, `text-muted`, `bg-accent-strong`) |
| Clases condicionales | `cn()` de `@/lib/cn` |
| Commits | Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`). Una rama y una PR por Tanda: `tanda-N-nombre` |
| Validación | Zod en todo dato que cruce una frontera (petición, BD, contenido) |
| Errores de API | JSON `{ error: string }` + código HTTP correcto |
| Fechas | Se guardan como `Date` (UTC); se muestran en `APP_TIMEZONE` |

---

## 7. Mapa de Tandas

| Tanda | Nombre | Entrega | Credenciales necesarias |
|---|---|---|---|
| 0 | Fundaciones | Proyecto Astro + React + Tailwind v4 + TS strict configurado | Ninguna |
| 1 | **Maquetación del curso B1** | Portada y páginas de lectura de B1, light/dark, botón visual "Marcar como leído" | Ninguna |
| 2 | MongoDB y capa de datos | Conexión, tipos, script de colecciones/índices, `/api/health` | `MONGODB_URI`, `MONGODB_DB` |
| 3 | Autenticación | Registro, login, logout, *middleware* de protección | `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL` |
| 4 | Tracking | "Marcar como leído" persistente + sesiones de estudio | — (usa las anteriores) |
| 5 | Evaluaciones | Evaluación de 5 preguntas de B1, corrección en servidor e historial | `APP_TIMEZONE` |
| 6 | Índice del temario | `/temario` con niveles, cursos, estado y "continuar" | — |
| 7 | Página de progreso | `/progreso` con KPIs, avance, exámenes y sesiones | — |
| 8 | Producción de contenido | Secciones y evaluaciones de los 23 cursos restantes | — |
| 9 | Calidad | Tests, seguridad, *rate limiting*, accesibilidad, CI | Docker en local; el CI no necesita secretos |
| 10 | Despliegue | Producción en Vercel + Atlas + dominio propio | Variables en Vercel, acceso a Atlas y Namecheap |

---

## Tanda 0 · Fundaciones del proyecto

| Dato | Valor |
|---|---|
| Objetivo | Proyecto Astro configurado con React, MDX, Tailwind v4, TypeScript strict, fuentes y *tokens* de diseño |
| Prerrequisitos | Node 22+, npm, Git |
| Variables de entorno | **Ninguna** |
| Rama | `tanda-0-fundaciones` |
| Resultado visible | Una página temporal que muestra los *tokens* en light y dark |

### 0.1 Crear el proyecto

La carpeta ya contiene `respuestas.md`, `temario.md` y `planificacion.md`, así que el proyecto se genera en una carpeta temporal y se mueve:

```bash
cd ~/Documents/proyectos/proyectos-astro/dani-academy
npm create astro@latest .tmp-astro -- --template minimal --no-install --no-git --skip-houston --yes
cp -R .tmp-astro/. . && rm -rf .tmp-astro
npm install
git init && git add -A && git commit -m "chore: proyecto Astro inicial"
git switch -c tanda-0-fundaciones
```

### 0.2 Integraciones y dependencias

```bash
# Integraciones oficiales (modifican astro.config.mjs automáticamente)
npx astro add react mdx vercel --yes

# Tailwind v4 + tipografía
npm i tailwindcss @tailwindcss/vite @tailwindcss/typography

# Fuentes autoalojadas
npm i @fontsource-variable/inter @fontsource-variable/source-serif-4 @fontsource-variable/jetbrains-mono

# Utilidades de clases
npm i clsx tailwind-merge

# Herramientas de desarrollo
npm i -D @astrojs/check typescript prettier prettier-plugin-astro prettier-plugin-tailwindcss
```

### 0.3 `astro.config.mjs`

Sustituye el archivo generado por este (las integraciones ya instaladas se mantienen):

```js
// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import mdx from "@astrojs/mdx";
import vercel from "@astrojs/vercel";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  output: "server",
  adapter: vercel(),
  integrations: [react(), mdx()],
  vite: {
    plugins: [tailwindcss()],
  },
  markdown: {
    shikiConfig: {
      // Temas duales: el CSS de global.css elige uno según [data-theme]
      themes: { light: "github-light", dark: "github-dark" },
      defaultColor: false,
      wrap: false,
    },
  },
  prefetch: {
    prefetchAll: false,
    defaultStrategy: "hover",
  },
  // env.schema se añade en la Tanda 2
});
```

### 0.4 `tsconfig.json`

```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist", "node_modules"],
  "compilerOptions": {
    "paths": { "@/*": ["./src/*"] },
    "jsx": "react-jsx",
    "jsxImportSource": "react",
    "noUncheckedIndexedAccess": true
  }
}
```

> TypeScript 6 marca `baseUrl` como obsoleto: `paths` se resuelve relativo al `tsconfig.json`, por eso las rutas empiezan por `./`.

### 0.5 `src/styles/global.css` (*tokens* y estilos base)

```css
@import "tailwindcss";
@plugin "@tailwindcss/typography";

/* Modo oscuro controlado por el atributo data-theme del <html> */
@custom-variant dark (&:where([data-theme="dark"], [data-theme="dark"] *));

/* ───────────── Tokens: light (paleta oficial) ───────────── */
:root {
  color-scheme: light;
  --bg: #fafafa;
  --surface: #eaedf2;
  --surface-2: #e2e8f0;
  --fg: #0f172a;
  --muted: #475569;
  --accent: #0d9488;
  --accent-strong: #0f766e;
  --accent-contrast: #ffffff;
  --info: #0284c7;
  --warning: #d97706;
  --danger: #f25c76;
  --danger-strong: #be123c;
}

/* ───────────── Tokens: dark ───────────── */
[data-theme="dark"] {
  color-scheme: dark;
  --bg: #0d1117;
  --surface: #161b22;
  --surface-2: #222a35;
  --fg: #e6edf3;
  --muted: #9aa4b2;
  --accent: #2dd4bf;
  --accent-strong: #5eead4;
  --accent-contrast: #04201d;
  --info: #38bdf8;
  --warning: #fbbf24;
  --danger: #f87191;
  --danger-strong: #fda4af;
}

/* Tokens → utilidades de Tailwind (bg-surface, text-muted, border-accent…) */
@theme inline {
  --color-bg: var(--bg);
  --color-surface: var(--surface);
  --color-surface-2: var(--surface-2);
  --color-fg: var(--fg);
  --color-muted: var(--muted);
  --color-accent: var(--accent);
  --color-accent-strong: var(--accent-strong);
  --color-accent-contrast: var(--accent-contrast);
  --color-info: var(--info);
  --color-warning: var(--warning);
  --color-danger: var(--danger);
  --color-danger-strong: var(--danger-strong);
}

@theme {
  --font-sans: "Inter Variable", ui-sans-serif, system-ui, sans-serif;
  --font-serif: "Source Serif 4 Variable", ui-serif, Georgia, serif;
  --font-mono: "JetBrains Mono Variable", ui-monospace, SFMono-Regular, monospace;
}

@layer base {
  html {
    background-color: var(--bg);
    color: var(--fg);
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
  }
  ::selection {
    background-color: color-mix(in oklab, var(--accent) 28%, transparent);
  }
  :focus-visible {
    outline: 2px solid var(--accent-strong);
    outline-offset: 2px;
  }
}

/* ───────────── Contenido largo (prose) ligado a los tokens ─────────────
   Al usar variables, la misma regla sirve para light y dark: no hace falta prose-invert. */
.prose {
  --tw-prose-body: var(--fg);
  --tw-prose-headings: var(--fg);
  --tw-prose-lead: var(--muted);
  --tw-prose-links: var(--accent-strong);
  --tw-prose-bold: var(--fg);
  --tw-prose-counters: var(--muted);
  --tw-prose-bullets: var(--accent);
  --tw-prose-hr: var(--surface-2);
  --tw-prose-quotes: var(--fg);
  --tw-prose-quote-borders: var(--accent);
  --tw-prose-captions: var(--muted);
  --tw-prose-code: var(--fg);
  --tw-prose-pre-code: inherit;
  --tw-prose-pre-bg: var(--surface);
  --tw-prose-th-borders: var(--surface-2);
  --tw-prose-td-borders: var(--surface-2);
}
.prose :where(code):not(:where(pre code)) {
  background-color: var(--surface);
  border-radius: 0.375rem;
  padding: 0.15em 0.35em;
  font-weight: 500;
}
.prose :where(code):not(:where(pre code))::before,
.prose :where(code):not(:where(pre code))::after {
  content: none;
}

/* ───────────── Bloques de código (Shiki, temas duales) ───────────── */
.astro-code {
  background-color: var(--surface) !important;
  border: 1px solid var(--surface-2);
  border-radius: 0.75rem;
  padding: 1rem 1.25rem;
  font-size: 0.875em;
  line-height: 1.6;
  overflow-x: auto;
}
.astro-code,
.astro-code span {
  color: var(--shiki-light);
}
[data-theme="dark"] .astro-code,
[data-theme="dark"] .astro-code span {
  color: var(--shiki-dark);
}

/* ───────────── Movimiento reducido ───────────── */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after,
  ::view-transition-group(*),
  ::view-transition-old(*),
  ::view-transition-new(*) {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### 0.6 `src/lib/cn.ts`

```ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Une clases condicionales y resuelve conflictos de Tailwind (la última gana). */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
```

> `tailwind-merge` no conoce los colores personalizados por defecto, pero como siguen el patrón `bg-*`/`text-*` los trata como colores y resuelve bien los conflictos habituales.

### 0.7 Prettier y scripts

`.prettierrc.json`:

```json
{
  "printWidth": 100,
  "plugins": ["prettier-plugin-astro", "prettier-plugin-tailwindcss"],
  "overrides": [{ "files": "*.astro", "options": { "parser": "astro" } }],
  "tailwindStylesheet": "./src/styles/global.css"
}
```

`package.json` (sección `scripts`):

```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "check": "astro check",
    "format": "prettier --write .",
    "format:check": "prettier --check ."
  }
}
```

`.gitignore` (comprueba que incluya):

```gitignore
node_modules/
dist/
.astro/
.vercel/
.env
.env.*
!.env.example
.DS_Store
coverage/
playwright-report/
test-results/
```

### 0.8 Página temporal de verificación

`src/pages/index.astro` (se sustituye en la Tanda 1):

```astro
---
import "@fontsource-variable/inter";
import "@fontsource-variable/source-serif-4";
import "@/styles/global.css";
---
<html lang="es" data-theme="light">
  <head><meta charset="utf-8" /><title>Tokens</title></head>
  <body class="bg-bg p-10 font-sans text-fg">
    <h1 class="font-serif text-4xl font-semibold">Dani Academy</h1>
    <div class="mt-6 flex gap-3">
      {["bg-surface", "bg-surface-2", "bg-accent", "bg-accent-strong", "bg-info", "bg-warning", "bg-danger"].map((c) => (
        <div class={`size-16 rounded-xl ${c}`} title={c} />
      ))}
    </div>
    <button class="mt-6 rounded-lg border px-3 py-1" onclick="document.documentElement.dataset.theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'">
      Cambiar tema
    </button>
  </body>
</html>
```

### Criterios de aceptación — Tanda 0

- [ ] `npm run dev` arranca en `http://localhost:4321` y muestra la página de *tokens*.
- [ ] El botón cambia entre light y dark y los 7 colores cambian.
- [ ] Los títulos se ven en Source Serif 4 y el resto en Inter (compruébalo en DevTools → *Computed* → `font-family`).
- [ ] `npm run check` termina sin errores.
- [ ] `npm run build` termina sin errores.
- [ ] Commit: `chore: fundaciones (astro, react, mdx, tailwind v4, tokens)`.

---

## Tanda 1 · Maquetación del curso B1

| Dato | Valor |
|---|---|
| Objetivo | Maquetar **únicamente** la experiencia del primer curso (**B1 · TypeScript desde cero**): portada del curso y páginas de lectura de sus 8 secciones |
| Prerrequisitos | Tanda 0 |
| Variables de entorno | **Ninguna** |
| Rama | `tanda-1-maquetacion-b1` |
| Fuera de alcance | Base de datos, autenticación, persistencia del botón, evaluación, índice del temario y página de progreso |

**Qué se entrega:**

- `/cursos/typescript-desde-cero`: portada del curso (objetivo, datos, lista de secciones, bloque de evaluación).
- `/cursos/typescript-desde-cero/[section]`: lectura de cada sección con índice lateral, contenido MDX, botón **Marcar como leído** (solo visual) y navegación anterior/siguiente.
- Modo light/dark con selector, sin parpadeo y compatible con View Transitions.
- Contenido real de las 8 secciones de B1.

### 1.1 Archivos de esta Tanda

```
src/
├── content.config.ts                         (nuevo)
├── content/
│   ├── courses.json                          (nuevo: catálogo completo, solo B1 publicado)
│   └── sections/typescript-desde-cero/
│       ├── 01-que-es-typescript.mdx          (nuevo)
│       ├── 02-tipos-primitivos-e-inferencia.mdx
│       ├── 03-arrays-tuplas-y-objetos.mdx
│       ├── 04-type-vs-interface.mdx
│       ├── 05-funciones-tipadas.mdx
│       ├── 06-uniones-y-narrowing.mdx
│       ├── 07-modulos-y-tsconfig.mdx
│       └── 08-typescript-en-astro.mdx
├── lib/
│   ├── constants.ts                          (nuevo)
│   └── content.ts                            (nuevo)
├── layouts/
│   ├── BaseLayout.astro                      (nuevo)
│   └── CourseLayout.astro                    (nuevo)
├── components/
│   ├── layout/SiteHeader.astro               (nuevo)
│   ├── layout/ThemeToggle.astro              (nuevo)
│   ├── course/CourseSidebar.astro            (nuevo)
│   ├── course/SectionNav.astro               (nuevo)
│   ├── course/MarkAsReadButton.tsx           (nuevo)
│   ├── mdx/Callout.astro                     (nuevo)
│   ├── ui/Badge.astro                        (nuevo)
│   ├── ui/ButtonLink.astro                   (nuevo)
│   └── ui/ProgressBar.astro                  (nuevo)
├── pages/
│   ├── index.astro                           (sustituir: redirige al curso B1)
│   ├── 404.astro                             (nuevo)
│   └── cursos/[course]/
│       ├── index.astro                       (nuevo: portada)
│       └── [section].astro                   (nuevo: lectura)
public/favicon.svg                            (nuevo)
```

### 1.2 `src/lib/constants.ts`

```ts
export const LEVELS = {
  basic: { label: "Básico", order: 1 },
  intermediate: { label: "Intermedio", order: 2 },
  advanced: { label: "Avanzado", order: 3 },
  final: { label: "Proyecto final", order: 4 },
} as const;

export type Level = keyof typeof LEVELS;

export const QUIZ_QUESTIONS = 5;
export const DEFAULT_PASSING_SCORE = 4; // 4 de 5 para aprobar
export const QUIZ_REQUIRES_ALL_SECTIONS = true; // la evaluación se desbloquea al leer todo el curso

export const HEARTBEAT_INTERVAL_SECONDS = 60; // Tanda 4
export const SESSION_GAP_MINUTES = 30; // Tanda 4

export const THEME_STORAGE_KEY = "da-theme";
```

### 1.3 `src/content.config.ts`

```ts
import { defineCollection, reference } from "astro:content";
import { file, glob } from "astro/loaders";
import { z } from "astro/zod";

const COURSE_ID = /^([BIA][1-8]|P1)$/;
const SECTION_ID = /^([BIA][1-8]|P1)\.\d{1,2}$/;

const courses = defineCollection({
  loader: file("src/content/courses.json"),
  schema: z.object({
    id: z.string().regex(COURSE_ID),
    slug: z.string().regex(/^[a-z0-9-]+$/),
    title: z.string(),
    level: z.enum(["basic", "intermediate", "advanced", "final"]),
    order: z.number().int().positive(),
    objective: z.string(),
    prerequisites: z.array(z.string()), // IDs de curso ("B1") o texto libre ("JavaScript")
    plannedSections: z.number().int().positive(),
    published: z.boolean(),
  }),
});

const sections = defineCollection({
  // Ignora archivos que empiecen por "_" (borradores)
  loader: glob({ pattern: "**/[^_]*.mdx", base: "./src/content/sections" }),
  schema: z.object({
    sectionId: z.string().regex(SECTION_ID),
    course: reference("courses"),
    title: z.string(),
    order: z.number().int().positive(),
    minutes: z.number().int().positive().default(60),
    summary: z.string().max(220),
  }),
});

export const collections = { courses, sections };
```

> El `id` de cada sección lo genera el *loader* a partir de la ruta: `typescript-desde-cero/01-que-es-typescript`. La última parte se usa como slug de la URL.

### 1.4 `src/content/courses.json` (catálogo completo)

Se crea el catálogo de los 24 cursos ya ahora (es contenido, no interfaz). Solo B1 tiene `"published": true`.

```json
[
  { "id": "B1", "slug": "typescript-desde-cero", "title": "TypeScript desde cero", "level": "basic", "order": 1, "objective": "Escribir y leer TypeScript con soltura en proyectos Astro y entender su configuración.", "prerequisites": ["JavaScript"], "plannedSections": 8, "published": true },
  { "id": "B2", "slug": "git-y-flujo-de-trabajo", "title": "Git y flujo de trabajo", "level": "basic", "order": 2, "objective": "Trabajar con ramas, Pull Requests y resolver conflictos sin miedo.", "prerequisites": ["Comandos básicos de Git"], "plannedSections": 4, "published": false },
  { "id": "B3", "slug": "como-funciona-la-web", "title": "Cómo funciona la web", "level": "basic", "order": 3, "objective": "Entender qué ocurre entre escribir una URL y ver la página: DNS, HTTP, cookies y caché.", "prerequisites": [], "plannedSections": 5, "published": false },
  { "id": "B4", "slug": "fundamentos-de-bases-de-datos", "title": "Fundamentos de bases de datos", "level": "basic", "order": 4, "objective": "Entender los conceptos universales de las bases de datos antes de profundizar en MongoDB.", "prerequisites": ["B1"], "plannedSections": 5, "published": false },
  { "id": "B5", "slug": "mongodb-esencial", "title": "MongoDB esencial", "level": "basic", "order": 5, "objective": "Usar MongoDB con el driver oficial y TypeScript con seguridad y buenas prácticas.", "prerequisites": ["B1", "B4"], "plannedSections": 6, "published": false },
  { "id": "B6", "slug": "react-esencial", "title": "React esencial", "level": "basic", "order": 6, "objective": "Construir componentes interactivos con React y TypeScript dentro de Astro.", "prerequisites": ["B1"], "plannedSections": 7, "published": false },
  { "id": "B7", "slug": "tailwind-css-v4-esencial", "title": "Tailwind CSS v4 esencial", "level": "basic", "order": 7, "objective": "Usar Tailwind v4 con criterio: utilidades, layout, responsive y estados.", "prerequisites": ["CSS básico"], "plannedSections": 5, "published": false },
  { "id": "I1", "slug": "typescript-intermedio", "title": "TypeScript intermedio", "level": "intermediate", "order": 8, "objective": "Escribir código reutilizable y seguro con genéricos, utility types y validación con Zod.", "prerequisites": ["B1"], "plannedSections": 6, "published": false },
  { "id": "I2", "slug": "react-intermedio", "title": "React intermedio", "level": "intermediate", "order": 9, "objective": "Organizar la lógica con hooks propios, reducers y contexto, y manejar formularios y peticiones como en producción.", "prerequisites": ["B6", "I1"], "plannedSections": 6, "published": false },
  { "id": "I3", "slug": "backend-con-astro", "title": "Backend con Astro", "level": "intermediate", "order": 10, "objective": "Diseñar y construir APIs y lógica de servidor dentro de Astro de forma ordenada y segura.", "prerequisites": ["B3", "B5", "I1"], "plannedSections": 6, "published": false },
  { "id": "I4", "slug": "modelado-de-datos-con-mongodb", "title": "Modelado de datos con MongoDB", "level": "intermediate", "order": 11, "objective": "Diseñar esquemas de MongoDB a partir de los patrones de acceso y sacar datos con agregaciones.", "prerequisites": ["B4", "B5", "I1"], "plannedSections": 6, "published": false },
  { "id": "I5", "slug": "autenticacion-y-autorizacion", "title": "Autenticación y autorización a fondo", "level": "intermediate", "order": 12, "objective": "Entender qué hace Better Auth por dentro y proteger correctamente datos y rutas.", "prerequisites": ["B3", "I3"], "plannedSections": 5, "published": false },
  { "id": "I6", "slug": "servidores-linux", "title": "Servidores Linux", "level": "intermediate", "order": 13, "objective": "Administrar un servidor Linux con confianza desde la terminal.", "prerequisites": ["B3"], "plannedSections": 6, "published": false },
  { "id": "I7", "slug": "sistema-de-diseno-con-tailwind", "title": "Sistema de diseño con Tailwind v4", "level": "intermediate", "order": 14, "objective": "Construir un sistema de diseño coherente: tokens, light/dark, tipografía de lectura y accesibilidad.", "prerequisites": ["B7"], "plannedSections": 5, "published": false },
  { "id": "I8", "slug": "testing", "title": "Testing", "level": "intermediate", "order": 15, "objective": "Escribir tests útiles en las tres capas: unitarios, de integración y end-to-end.", "prerequisites": ["I1", "I2", "I3"], "plannedSections": 6, "published": false },
  { "id": "A1", "slug": "typescript-avanzado", "title": "TypeScript avanzado", "level": "advanced", "order": 16, "objective": "Crear tipos que se calculan a partir de otros y entender los tipos de las librerías más complejas.", "prerequisites": ["I1"], "plannedSections": 5, "published": false },
  { "id": "A2", "slug": "mongodb-avanzado", "title": "MongoDB avanzado", "level": "advanced", "order": 17, "objective": "Operar MongoDB en producción: transacciones, rendimiento, búsqueda y fiabilidad.", "prerequisites": ["I4"], "plannedSections": 5, "published": false },
  { "id": "A3", "slug": "sql-y-postgresql", "title": "SQL y PostgreSQL", "level": "advanced", "order": 18, "objective": "Dominar una base de datos relacional para elegir con criterio entre SQL y MongoDB.", "prerequisites": ["B4", "I1"], "plannedSections": 6, "published": false },
  { "id": "A4", "slug": "despliegue-en-servidores-propios", "title": "Despliegue en servidores propios", "level": "advanced", "order": 19, "objective": "Desplegar y operar una app Astro SSR en un VPS propio, más allá de Vercel.", "prerequisites": ["I3", "I6"], "plannedSections": 6, "published": false },
  { "id": "A5", "slug": "seguridad-web", "title": "Seguridad web", "level": "advanced", "order": 20, "objective": "Identificar y prevenir las vulnerabilidades más comunes en apps Astro + MongoDB.", "prerequisites": ["I3", "I5"], "plannedSections": 5, "published": false },
  { "id": "A6", "slug": "rendimiento-y-observabilidad", "title": "Rendimiento y observabilidad", "level": "advanced", "order": 21, "objective": "Medir y mejorar la velocidad de la app y saber qué ocurre en producción.", "prerequisites": ["I3", "A4"], "plannedSections": 4, "published": false },
  { "id": "A7", "slug": "cicd-con-github-actions", "title": "CI/CD con GitHub Actions", "level": "advanced", "order": 22, "objective": "Automatizar la verificación y el despliegue de cada cambio.", "prerequisites": ["B2", "I8"], "plannedSections": 4, "published": false },
  { "id": "A8", "slug": "arquitectura-con-astro-y-react", "title": "Arquitectura con Astro y React", "level": "advanced", "order": 23, "objective": "Tomar decisiones de arquitectura en proyectos Astro + React medianos y grandes.", "prerequisites": ["I2", "I3", "A1"], "plannedSections": 5, "published": false },
  { "id": "P1", "slug": "proyecto-integrador", "title": "Proyecto integrador", "level": "final", "order": 24, "objective": "Construir de principio a fin una aplicación nueva aplicando todo lo aprendido.", "prerequisites": ["Todo el temario"], "plannedSections": 8, "published": false }
]
```

### 1.5 `src/lib/content.ts` (acceso al contenido)

```ts
import { getCollection, type CollectionEntry } from "astro:content";

export type Course = CollectionEntry<"courses">;
export type Section = CollectionEntry<"sections">;

export async function getCourses(): Promise<Course[]> {
  const courses = await getCollection("courses");
  return courses.sort((a, b) => a.data.order - b.data.order);
}

export async function getCourseBySlug(slug: string): Promise<Course | undefined> {
  const courses = await getCollection("courses");
  return courses.find((c) => c.data.slug === slug);
}

export async function getCourseSections(courseId: string): Promise<Section[]> {
  const sections = await getCollection("sections", (s) => s.data.course.id === courseId);
  return sections.sort((a, b) => a.data.order - b.data.order);
}

export async function getSectionById(sectionId: string): Promise<Section | undefined> {
  const [section] = await getCollection("sections", (s) => s.data.sectionId === sectionId);
  return section;
}

/** "typescript-desde-cero/03-arrays-tuplas-y-objetos" → "03-arrays-tuplas-y-objetos" */
export const sectionSlug = (section: Section): string => section.id.split("/").at(-1)!;

export const courseUrl = (course: Course): string => `/cursos/${course.data.slug}`;

export const sectionUrl = (course: Course, section: Section): string =>
  `${courseUrl(course)}/${sectionSlug(section)}`;
```

### 1.6 `src/layouts/BaseLayout.astro`

Incluye el script que aplica el tema **antes del primer pintado** (sin parpadeo) y lo reaplica tras cada navegación con View Transitions.

```astro
---
import "@fontsource-variable/inter";
import "@fontsource-variable/source-serif-4";
import "@fontsource-variable/jetbrains-mono";
import "@/styles/global.css";
import { ClientRouter } from "astro:transitions";
import { THEME_STORAGE_KEY } from "@/lib/constants";

interface Props {
  title: string;
  description?: string;
}

const { title, description = "Plataforma personal de aprendizaje full-stack." } = Astro.props;
const fullTitle = title === "Dani Academy" ? title : `${title} · Dani Academy`;
---

<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content={description} />
    <meta name="color-scheme" content="light dark" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <title>{fullTitle}</title>

    <script is:inline define:vars={{ storageKey: THEME_STORAGE_KEY }}>
      const applyTheme = () => {
        let stored = null;
        try {
          stored = localStorage.getItem(storageKey);
        } catch {}
        const dark = stored
          ? stored === "dark"
          : window.matchMedia("(prefers-color-scheme: dark)").matches;
        document.documentElement.dataset.theme = dark ? "dark" : "light";
      };
      applyTheme();
      if (!window.__daThemeListener) {
        window.__daThemeListener = true;
        document.addEventListener("astro:after-swap", applyTheme);
      }
    </script>

    <ClientRouter />
  </head>
  <body class="min-h-dvh bg-bg font-sans text-fg">
    <slot />
  </body>
</html>
```

### 1.7 `src/components/layout/ThemeToggle.astro`

```astro
---
---

<button
  type="button"
  data-theme-toggle
  aria-label="Cambiar tema"
  class="inline-flex size-9 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface hover:text-fg"
>
  <!-- Luna (visible en light) -->
  <svg class="size-5 dark:hidden" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true">
    <path stroke-linecap="round" stroke-linejoin="round" d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
  <!-- Sol (visible en dark) -->
  <svg class="hidden size-5 dark:block" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true">
    <circle cx="12" cy="12" r="4" />
    <path stroke-linecap="round" d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41m11.32-11.32 1.41-1.41" />
  </svg>
</button>

<script>
  import { THEME_STORAGE_KEY } from "@/lib/constants";

  const updateLabel = (btn: HTMLButtonElement) => {
    const dark = document.documentElement.dataset.theme === "dark";
    btn.setAttribute("aria-label", dark ? "Activar modo claro" : "Activar modo oscuro");
  };

  const setup = () => {
    document.querySelectorAll<HTMLButtonElement>("[data-theme-toggle]").forEach((btn) => {
      updateLabel(btn);
      btn.onclick = () => {
        const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
        document.documentElement.dataset.theme = next;
        try {
          localStorage.setItem(THEME_STORAGE_KEY, next);
        } catch {}
        updateLabel(btn);
      };
    });
  };

  // astro:page-load se dispara en la carga inicial y tras cada navegación
  document.addEventListener("astro:page-load", setup);
</script>
```

### 1.8 `src/components/layout/SiteHeader.astro`

```astro
---
import ThemeToggle from "./ThemeToggle.astro";

interface Crumb {
  label: string;
  href?: string;
}
interface Props {
  crumbs?: Crumb[];
}

const { crumbs = [] } = Astro.props;
---

<a
  href="#contenido"
  class="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-lg focus:bg-accent-strong focus:px-4 focus:py-2 focus:text-accent-contrast"
>
  Saltar al contenido
</a>

<header class="sticky top-0 z-30 border-b border-surface-2 bg-bg/90 backdrop-blur supports-[backdrop-filter]:bg-bg/75">
  <div class="mx-auto flex h-14 max-w-7xl items-center gap-4 px-4 lg:px-6">
    <a href="/" class="shrink-0 font-serif text-lg font-semibold tracking-tight">Dani Academy</a>

    {
      crumbs.length > 0 && (
        <nav aria-label="Ruta de navegación" class="hidden min-w-0 md:block">
          <ol class="flex items-center gap-2 text-sm text-muted">
            {crumbs.map((crumb) => (
              <li class="flex min-w-0 items-center gap-2">
                <span aria-hidden="true" class="text-surface-2">/</span>
                {crumb.href ? (
                  <a href={crumb.href} class="truncate transition-colors hover:text-fg">{crumb.label}</a>
                ) : (
                  <span aria-current="page" class="truncate text-fg">{crumb.label}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      )
    }

    <div class="ml-auto flex items-center gap-1">
      <slot name="actions" />
      <ThemeToggle />
    </div>
  </div>
</header>
```

### 1.9 Componentes de UI

`src/components/ui/Badge.astro`:

```astro
---
type Tone = "neutral" | "accent" | "info" | "warning" | "danger";
interface Props {
  tone?: Tone;
  class?: string;
}
const { tone = "neutral", class: className } = Astro.props;

// Texto siempre con contraste AA: el color va en el fondo tenue y el anillo
const tones: Record<Tone, string> = {
  neutral: "bg-surface text-muted ring-surface-2",
  accent: "bg-accent/10 text-accent-strong ring-accent/30",
  info: "bg-info/10 text-fg ring-info/30",
  warning: "bg-warning/10 text-fg ring-warning/40",
  danger: "bg-danger/10 text-danger-strong ring-danger/40",
};
---

<span class:list={["inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset", tones[tone], className]}>
  <slot />
</span>
```

`src/components/ui/ButtonLink.astro`:

```astro
---
type Variant = "primary" | "secondary" | "ghost";
interface Props {
  href: string;
  variant?: Variant;
  class?: string;
}
const { href, variant = "primary", class: className } = Astro.props;

const variants: Record<Variant, string> = {
  primary: "bg-accent-strong text-accent-contrast hover:opacity-90",
  secondary: "bg-surface text-fg ring-1 ring-inset ring-surface-2 hover:bg-surface-2",
  ghost: "text-muted hover:bg-surface hover:text-fg",
};
---

<a
  href={href}
  class:list={["inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition", variants[variant], className]}
>
  <slot />
</a>
```

`src/components/ui/ProgressBar.astro`:

```astro
---
interface Props {
  value: number;
  max: number;
  label: string;
  size?: "sm" | "md";
}
const { value, max, label, size = "sm" } = Astro.props;
const pct = max === 0 ? 0 : Math.round((value / max) * 100);
---

<div
  role="progressbar"
  aria-label={label}
  aria-valuemin={0}
  aria-valuemax={max}
  aria-valuenow={value}
  aria-valuetext={`${value} de ${max}`}
  class:list={["w-full overflow-hidden rounded-full bg-surface-2", size === "sm" ? "h-1.5" : "h-2.5"]}
>
  <div data-progress-fill class="h-full rounded-full bg-accent transition-[width] duration-300" style={`width: ${pct}%`}></div>
</div>
```

### 1.10 `src/components/mdx/Callout.astro`

Bloques destacados del contenido (Ejercicio, Lo dominas si…, Nota…). Se usan en MDX sin importarlos (se inyectan con `components`).

```astro
---
type CalloutType = "note" | "tip" | "warning" | "exercise" | "mastery" | "risk";
interface Props {
  type?: CalloutType;
  title?: string;
}
const { type = "note", title } = Astro.props;

const styles: Record<CalloutType, { label: string; border: string }> = {
  note: { label: "Nota", border: "border-info" },
  tip: { label: "Consejo", border: "border-accent" },
  warning: { label: "Cuidado", border: "border-warning" },
  exercise: { label: "Ejercicio", border: "border-accent" },
  mastery: { label: "Lo dominas si…", border: "border-accent-strong" },
  // Obligatorio después de cada bloque de código importante (formato "receta", §8.6)
  risk: { label: "Complicaciones y riesgos", border: "border-danger" },
};
const style = styles[type];
const heading = title ?? style.label;
---

<aside class:list={["not-prose my-8 rounded-r-xl border-l-4 bg-surface px-5 py-4", style.border]} aria-label={heading}>
  <p class="mb-2 font-sans text-xs font-semibold tracking-wider text-muted uppercase">{heading}</p>
  <div class="prose max-w-none font-serif prose-p:my-2 prose-ul:my-2">
    <slot />
  </div>
</aside>
```

### 1.11 `src/components/course/CourseSidebar.astro`

Índice del curso con el estado de cada sección. Escucha el evento `da:section-read` (emitido por el botón) para actualizarse sin recargar.

```astro
---
import ProgressBar from "@/components/ui/ProgressBar.astro";
import { LEVELS } from "@/lib/constants";
import { courseUrl, sectionUrl, type Course, type Section } from "@/lib/content";

interface Props {
  course: Course;
  sections: Section[];
  readIds: string[];
  currentSectionId?: string;
  current?: "overview" | "quiz";
  quizAvailable?: boolean; // false en Tanda 1; true a partir de la Tanda 5
}

const { course, sections, readIds, currentSectionId, current, quizAvailable = false } = Astro.props;
const read = new Set(readIds);
const readCount = sections.filter((s) => read.has(s.data.sectionId)).length;
---

<nav aria-label={`Índice de ${course.data.title}`} data-course-sidebar data-total={sections.length}>
  <a href={courseUrl(course)} aria-current={current === "overview" ? "page" : undefined} class="block rounded-lg px-3 py-2 transition-colors hover:bg-surface-2">
    <span class="text-xs font-medium tracking-wider text-muted uppercase">{course.id} · {LEVELS[course.data.level].label}</span>
    <span class="mt-1 block font-serif text-lg leading-snug font-semibold">{course.data.title}</span>
  </a>

  <div class="mt-3 flex items-center gap-3 px-3">
    <ProgressBar value={readCount} max={sections.length} label="Progreso del curso" />
    <span data-read-count class="shrink-0 text-xs text-muted tabular-nums">{readCount}/{sections.length}</span>
  </div>

  <ol class="mt-6 space-y-0.5">
    {
      sections.map((section) => {
        const isRead = read.has(section.data.sectionId);
        const isCurrent = section.data.sectionId === currentSectionId;
        return (
          <li data-section-id={section.data.sectionId} data-read={String(isRead)} class="group">
            <a
              href={sectionUrl(course, section)}
              aria-current={isCurrent ? "page" : undefined}
              class="flex items-start gap-3 rounded-lg px-3 py-2 text-sm text-muted transition-colors hover:bg-surface-2 hover:text-fg aria-[current=page]:bg-surface-2 aria-[current=page]:font-medium aria-[current=page]:text-fg"
            >
              <span class="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border border-surface-2 text-[0.625rem] tabular-nums group-data-[read=true]:border-accent group-data-[read=true]:bg-accent group-data-[read=true]:text-accent-contrast">
                <span class="group-data-[read=true]:hidden">{section.data.order}</span>
                <svg class="hidden size-3 group-data-[read=true]:block" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m5 13 4 4L19 7" />
                </svg>
              </span>
              <span class="leading-snug">
                {section.data.title}
                <span data-read-label class="sr-only">{isRead ? " (leída)" : ""}</span>
              </span>
            </a>
          </li>
        );
      })
    }
  </ol>

  <div class="mt-6 border-t border-surface-2 pt-4">
    {
      quizAvailable ? (
        <a href={`${courseUrl(course)}/evaluacion`} aria-current={current === "quiz" ? "page" : undefined} class="flex items-center justify-between rounded-lg px-3 py-2 text-sm text-muted transition-colors hover:bg-surface-2 hover:text-fg aria-[current=page]:bg-surface-2 aria-[current=page]:text-fg">
          Evaluación final <span class="text-xs">5 preguntas</span>
        </a>
      ) : (
        <p class="flex items-center justify-between px-3 py-2 text-sm text-muted">
          Evaluación final <span class="text-xs">Próximamente</span>
        </p>
      )
    }
  </div>
</nav>

<script>
  type ReadDetail = { sectionId: string; read: boolean };

  const refreshCounters = () => {
    const nav = document.querySelector<HTMLElement>("[data-course-sidebar]");
    if (!nav) return;
    const total = Number(nav.dataset.total ?? 0);
    const count = nav.querySelectorAll('[data-read="true"]').length;
    const pct = total === 0 ? 0 : Math.round((count / total) * 100);

    document.querySelectorAll("[data-read-count]").forEach((el) => (el.textContent = `${count}/${total}`));
    document.querySelectorAll<HTMLElement>("[data-course-sidebar] [role=progressbar]").forEach((bar) => {
      bar.setAttribute("aria-valuenow", String(count));
      bar.setAttribute("aria-valuetext", `${count} de ${total}`);
      const fill = bar.querySelector<HTMLElement>("[data-progress-fill]");
      if (fill) fill.style.width = `${pct}%`;
    });
  };

  document.addEventListener("da:section-read", (event) => {
    const { sectionId, read } = (event as CustomEvent<ReadDetail>).detail;
    document.querySelectorAll<HTMLElement>(`[data-section-id="${CSS.escape(sectionId)}"]`).forEach((el) => {
      el.dataset.read = String(read);
      const label = el.querySelector("[data-read-label]");
      if (label) label.textContent = read ? " (leída)" : "";
    });
    refreshCounters();
  });
</script>
```

### 1.12 `src/components/course/MarkAsReadButton.tsx`

En esta Tanda solo cambia el estado visual y emite el evento `da:section-read`. La Tanda 4 le añade persistencia (misma interfaz de props).

```tsx
import { useState } from "react";
import { cn } from "@/lib/cn";

interface Props {
  sectionId: string;
  initialRead?: boolean;
}

export default function MarkAsReadButton({ sectionId, initialRead = false }: Props) {
  const [read, setRead] = useState(initialRead);

  function toggle() {
    const next = !read;
    setRead(next);
    document.dispatchEvent(new CustomEvent("da:section-read", { detail: { sectionId, read: next } }));
  }

  return (
    <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4">
      <button
        type="button"
        aria-pressed={read}
        onClick={toggle}
        className={cn(
          "inline-flex items-center gap-2 rounded-xl px-5 py-3 font-sans text-sm font-semibold transition",
          read
            ? "bg-accent/10 text-accent-strong ring-1 ring-accent/40 ring-inset hover:bg-accent/15"
            : "bg-accent-strong text-accent-contrast hover:opacity-90",
        )}
      >
        <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="m5 13 4 4L19 7" />
        </svg>
        {read ? "Leído" : "Marcar como leído"}
      </button>
      <p className="font-sans text-sm text-muted" aria-live="polite">
        {read ? "Sección completada." : "Márcala cuando cumplas el criterio «Lo dominas si…»."}
      </p>
    </div>
  );
}
```

### 1.13 `src/components/course/SectionNav.astro`

```astro
---
interface NavLink {
  href: string;
  title: string;
  label: string;
}
interface Props {
  prev?: NavLink;
  next?: NavLink;
}
const { prev, next } = Astro.props;
const card = "group block rounded-xl border border-surface-2 p-4 transition-colors hover:border-accent hover:bg-surface/60";
---

<nav aria-label="Navegación entre secciones" class="mt-10 grid gap-3 sm:grid-cols-2">
  {
    prev ? (
      <a href={prev.href} rel="prev" class={card}>
        <span class="text-xs text-muted">← {prev.label}</span>
        <span class="mt-1 block font-medium text-fg">{prev.title}</span>
      </a>
    ) : (
      <span class="hidden sm:block" />
    )
  }
  {
    next && (
      <a href={next.href} rel="next" class:list={[card, "sm:text-right"]}>
        <span class="text-xs text-muted">{next.label} →</span>
        <span class="mt-1 block font-medium text-fg">{next.title}</span>
      </a>
    )
  }
</nav>
```

### 1.14 `src/layouts/CourseLayout.astro`

```astro
---
import BaseLayout from "./BaseLayout.astro";
import SiteHeader from "@/components/layout/SiteHeader.astro";
import CourseSidebar from "@/components/course/CourseSidebar.astro";
import type { Course, Section } from "@/lib/content";

interface Props {
  title: string;
  description?: string;
  course: Course;
  sections: Section[];
  readIds: string[];
  currentSectionId?: string;
  current?: "overview" | "quiz";
  quizAvailable?: boolean;
}

const { title, description, ...sidebar } = Astro.props;
const { course, sections, readIds } = sidebar;
const readCount = sections.filter((s) => readIds.includes(s.data.sectionId)).length;
---

<BaseLayout title={title} description={description}>
  <SiteHeader
    crumbs={[
      { label: "Temario" }, // Tanda 6: añadir href: "/temario"
      { label: `${course.id} · ${course.data.title}` },
    ]}
  >
    <slot name="header-actions" slot="actions" />
  </SiteHeader>

  <div class="mx-auto max-w-7xl lg:grid lg:grid-cols-[18rem_minmax(0,1fr)] lg:gap-12 lg:px-6">
    <!-- Índice en móvil: desplegable nativo, sin JavaScript -->
    <details class="border-b border-surface-2 px-4 py-3 lg:hidden">
      <summary class="flex cursor-pointer items-center justify-between text-sm font-medium">
        Índice del curso
        <span data-read-count class="text-muted tabular-nums">{readCount}/{sections.length}</span>
      </summary>
      <div class="pt-4 pb-2">
        <CourseSidebar {...sidebar} />
      </div>
    </details>

    <!-- Índice en escritorio: fijo al hacer scroll -->
    <aside class="hidden lg:block">
      <div class="sticky top-14 max-h-[calc(100dvh-3.5rem)] overflow-y-auto py-8 pr-2">
        <CourseSidebar {...sidebar} />
      </div>
    </aside>

    <main id="contenido" class="min-w-0 px-4 py-10 sm:px-6 lg:px-0 lg:py-14">
      <slot />
    </main>
  </div>
</BaseLayout>
```

> El índice se renderiza dos veces (móvil y escritorio) y solo uno es visible. El script del *sidebar* actualiza ambos.

### 1.15 `src/pages/cursos/[course]/[section].astro` (lectura)

```astro
---
import { render } from "astro:content";
import CourseLayout from "@/layouts/CourseLayout.astro";
import Callout from "@/components/mdx/Callout.astro";
import SectionNav from "@/components/course/SectionNav.astro";
import MarkAsReadButton from "@/components/course/MarkAsReadButton";
import { courseUrl, getCourseBySlug, getCourseSections, sectionSlug, sectionUrl } from "@/lib/content";

const { course: courseSlug = "", section: sectionParam = "" } = Astro.params;

const course = await getCourseBySlug(courseSlug);
if (!course?.data.published) return Astro.rewrite("/404");

const sections = await getCourseSections(course.id);
const index = sections.findIndex((s) => sectionSlug(s) === sectionParam);
const section = sections[index];
if (!section) return Astro.rewrite("/404");

const { Content } = await render(section);

// Tanda 4: sustituir por las secciones leídas del usuario (MongoDB)
const readIds: string[] = [];
const isRead = readIds.includes(section.data.sectionId);

const prevSection = sections[index - 1];
const nextSection = sections[index + 1];

const prev = prevSection && { href: sectionUrl(course, prevSection), title: prevSection.data.title, label: "Anterior" };
const next = nextSection
  ? { href: sectionUrl(course, nextSection), title: nextSection.data.title, label: "Siguiente" }
  : { href: courseUrl(course), title: "Volver a la portada del curso", label: "Fin del curso" }; // Tanda 5: ir a la evaluación
---

<CourseLayout
  title={`${section.data.title} · ${course.id}`}
  description={section.data.summary}
  course={course}
  sections={sections}
  readIds={readIds}
  currentSectionId={section.data.sectionId}
>
  <article class="mx-auto max-w-[68ch]">
    <header class="mb-10">
      <p class="text-sm text-muted">
        <span class="font-semibold text-accent-strong">{section.data.sectionId}</span>
        <span aria-hidden="true"> · </span>Sección {index + 1} de {sections.length}
        <span aria-hidden="true"> · </span>{section.data.minutes} min
      </p>
      <h1 class="mt-3 font-serif text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
        {section.data.title}
      </h1>
      <p class="mt-4 font-serif text-lg leading-relaxed text-muted">{section.data.summary}</p>
    </header>

    <div class="prose prose-lg max-w-none font-serif prose-headings:font-semibold prose-headings:tracking-tight prose-h2:mt-14 prose-pre:my-6">
      <Content components={{ Callout }} />
    </div>

    <footer class="mt-16 border-t border-surface-2 pt-8">
      <MarkAsReadButton client:visible sectionId={section.data.sectionId} initialRead={isRead} />
      <SectionNav prev={prev} next={next} />
    </footer>
  </article>
</CourseLayout>
```

### 1.16 `src/pages/cursos/[course]/index.astro` (portada del curso)

```astro
---
import CourseLayout from "@/layouts/CourseLayout.astro";
import Badge from "@/components/ui/Badge.astro";
import ButtonLink from "@/components/ui/ButtonLink.astro";
import { DEFAULT_PASSING_SCORE, LEVELS, QUIZ_QUESTIONS } from "@/lib/constants";
import { courseUrl, getCourseBySlug, getCourseSections, getCourses, sectionUrl } from "@/lib/content";

const { course: courseSlug = "" } = Astro.params;
const course = await getCourseBySlug(courseSlug);
if (!course?.data.published) return Astro.rewrite("/404");

const sections = await getCourseSections(course.id);
const allCourses = await getCourses();

// Tanda 4: secciones leídas desde MongoDB
const readIds: string[] = [];
const read = new Set(readIds);
const readCount = sections.filter((s) => read.has(s.data.sectionId)).length;
const firstUnread = sections.find((s) => !read.has(s.data.sectionId)) ?? sections[0];
const totalHours = Math.round(sections.reduce((acc, s) => acc + s.data.minutes, 0) / 60);

const ctaLabel = readCount === 0 ? "Empezar curso" : readCount === sections.length ? "Repasar curso" : "Continuar";

const prerequisites = course.data.prerequisites.map((p) => {
  const match = allCourses.find((c) => c.id === p);
  return match ? { label: `${match.id} · ${match.data.title}`, href: match.data.published ? courseUrl(match) : undefined } : { label: p };
});
---

<CourseLayout title={course.data.title} description={course.data.objective} course={course} sections={sections} readIds={readIds} current="overview">
  <div class="mx-auto max-w-[68ch]">
    <header>
      <div class="flex flex-wrap items-center gap-2">
        <Badge tone="accent">{LEVELS[course.data.level].label}</Badge>
        <Badge>{course.id}</Badge>
      </div>
      <h1 class="mt-4 font-serif text-4xl font-semibold tracking-tight text-balance sm:text-5xl">{course.data.title}</h1>
      <p class="mt-5 font-serif text-xl leading-relaxed text-muted">{course.data.objective}</p>

      <dl class="mt-8 grid grid-cols-3 gap-4 rounded-2xl bg-surface p-5">
        <div>
          <dt class="text-xs text-muted">Secciones</dt>
          <dd class="mt-1 text-2xl font-semibold tabular-nums">{sections.length}</dd>
        </div>
        <div>
          <dt class="text-xs text-muted">Duración</dt>
          <dd class="mt-1 text-2xl font-semibold tabular-nums">~{totalHours} h</dd>
        </div>
        <div>
          <dt class="text-xs text-muted">Evaluación</dt>
          <dd class="mt-1 text-2xl font-semibold tabular-nums">{QUIZ_QUESTIONS} preg.</dd>
        </div>
      </dl>

      <div class="mt-6 flex flex-wrap items-center gap-4">
        {firstUnread && <ButtonLink href={sectionUrl(course, firstUnread)}>{ctaLabel} →</ButtonLink>}
        <span class="text-sm text-muted"><span data-read-count>{readCount}/{sections.length}</span> secciones leídas</span>
      </div>

      {
        prerequisites.length > 0 && (
          <p class="mt-6 text-sm text-muted">
            Requisitos previos:{" "}
            {prerequisites.map((p, i) => (
              <>
                {p.href ? <a href={p.href} class="text-accent-strong underline-offset-2 hover:underline">{p.label}</a> : <span class="text-fg">{p.label}</span>}
                {i < prerequisites.length - 1 && ", "}
              </>
            ))}
          </p>
        )
      }
    </header>

    <section aria-labelledby="contenido-curso" class="mt-16">
      <h2 id="contenido-curso" class="font-serif text-2xl font-semibold tracking-tight">Contenido del curso</h2>
      <ol class="mt-6 divide-y divide-surface-2 border-y border-surface-2">
        {
          sections.map((s) => (
            <li data-section-id={s.data.sectionId} data-read={String(read.has(s.data.sectionId))} class="group">
              <a href={sectionUrl(course, s)} class="-mx-3 flex gap-4 rounded-lg px-3 py-5 transition-colors hover:bg-surface/60">
                <span class="mt-1 flex size-7 shrink-0 items-center justify-center rounded-full border border-surface-2 text-xs font-medium tabular-nums group-data-[read=true]:border-accent group-data-[read=true]:bg-accent group-data-[read=true]:text-accent-contrast">
                  {s.data.order}
                </span>
                <span class="min-w-0 flex-1">
                  <span class="block font-serif text-lg font-medium text-fg">{s.data.title}</span>
                  <span class="mt-1 block text-sm text-muted">{s.data.summary}</span>
                </span>
                <span class="shrink-0 text-xs text-muted tabular-nums">{s.data.minutes} min</span>
              </a>
            </li>
          ))
        }
      </ol>
    </section>

    <section aria-labelledby="evaluacion" class="mt-14 rounded-2xl border border-surface-2 p-6">
      <div class="flex items-center justify-between gap-4">
        <h2 id="evaluacion" class="font-serif text-xl font-semibold">Evaluación final</h2>
        <Badge tone="warning">Próximamente</Badge>
      </div>
      <p class="mt-3 text-sm leading-relaxed text-muted">
        {QUIZ_QUESTIONS} preguntas sobre los conceptos clave del curso. Se aprueba con {DEFAULT_PASSING_SCORE}/{QUIZ_QUESTIONS}
        y se desbloquea al marcar todas las secciones como leídas.
      </p>
    </section>
  </div>
</CourseLayout>
```

### 1.17 `src/pages/404.astro`, `src/pages/index.astro` y `public/favicon.svg`

```astro
---
// src/pages/404.astro
import BaseLayout from "@/layouts/BaseLayout.astro";
import SiteHeader from "@/components/layout/SiteHeader.astro";
import ButtonLink from "@/components/ui/ButtonLink.astro";
---

<BaseLayout title="Página no encontrada">
  <SiteHeader />
  <main id="contenido" class="mx-auto max-w-[68ch] px-4 py-24 text-center">
    <p class="text-sm font-semibold text-accent-strong">404</p>
    <h1 class="mt-3 font-serif text-4xl font-semibold tracking-tight">Esta página no existe</h1>
    <p class="mt-4 text-muted">Puede que el curso aún no esté publicado o que el enlace sea incorrecto.</p>
    <ButtonLink href="/" class="mt-8">Volver al inicio</ButtonLink>
  </main>
</BaseLayout>
```

```astro
---
// src/pages/index.astro — Tanda 1: lleva directamente al curso B1 (en la Tanda 3 pasa a /temario)
return Astro.redirect("/cursos/typescript-desde-cero");
---
```

```svg
<!-- public/favicon.svg -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="8" fill="#0f766e"/>
  <text x="16" y="22" font-family="Georgia, serif" font-size="18" font-weight="700" fill="#fff" text-anchor="middle">D</text>
</svg>
```

### 1.18 Contenido de B1: formato de una sección

**Frontmatter de las 8 secciones** (el cuerpo se redacta expandiendo la sección correspondiente de `temario.md`):

| Archivo | `sectionId` | `order` | `title` | `summary` |
|---|---|---|---|---|
| `01-que-es-typescript.mdx` | B1.1 | 1 | Qué es TypeScript y por qué existe | Qué añade TypeScript a JavaScript, cómo se compila y cómo lo usa tu editor para ayudarte. |
| `02-tipos-primitivos-e-inferencia.mdx` | B1.2 | 2 | Tipos primitivos e inferencia | Los tipos básicos, cuándo dejar que TypeScript infiera y por qué unknown es mejor que any. |
| `03-arrays-tuplas-y-objetos.mdx` | B1.3 | 3 | Arrays, tuplas y objetos | Tipar colecciones y objetos, propiedades opcionales, readonly y encadenamiento opcional. |
| `04-type-vs-interface.mdx` | B1.4 | 4 | type vs interface | Las dos formas de nombrar tipos, sus diferencias reales y una convención para elegir. |
| `05-funciones-tipadas.mdx` | B1.5 | 5 | Funciones tipadas | Parámetros, retornos, funciones como tipos y funciones asíncronas con Promise<T>. |
| `06-uniones-y-narrowing.mdx` | B1.6 | 6 | Uniones y narrowing | Uniones, type guards y uniones discriminadas: la herramienta más útil del curso. |
| `07-modulos-y-tsconfig.mdx` | B1.7 | 7 | Módulos, tipos de librerías y tsconfig.json | De dónde salen los tipos de las librerías y qué hace cada opción de tsconfig.json. |
| `08-typescript-en-astro.mdx` | B1.8 | 8 | TypeScript en Astro | Props tipadas, endpoints con APIRoute, variables de entorno y astro check. |

> Los campos `title` y `summary` son **texto plano** (sin Markdown: nada de acentos graves ni asteriscos), porque se muestran tal cual en títulos, índices y metadatos. Escríbelos entre comillas en el YAML.

> ⚠️ **Sustituida desde el 9 de octubre de 2026 por el formato "receta" de §8.6.** La estructura de abajo y la sección de referencia `01-que-es-typescript.mdx` describen el formato original; se conservan como historial. Todos los cursos básicos (B1–B7) ya están reescritos en el formato nuevo.

**Estructura original de cada sección:**

1. Párrafo de entrada: el problema que resuelve la sección (2–4 frases).
2. 3–5 apartados `##` con la teoría del **Contenido** del temario, cada uno con al menos un bloque de código.
3. `## Errores comunes`: 2–4 errores típicos con el mensaje real del compilador.
4. `<Callout type="exercise">` con el **Ejercicio** del temario, en pasos numerados.
5. `<Callout type="mastery">` con el criterio **Lo dominas si…**.
6. `## Resumen`: 3–5 viñetas.

Longitud orientativa: 1 200–2 000 palabras (unos 20 minutos de lectura más 40 de práctica). Español, con términos técnicos en inglés en cursiva la primera vez (*narrowing*, *type guard*).

**Sección completa de referencia — `01-que-es-typescript.mdx`:**

````mdx
---
sectionId: "B1.1"
course: "B1"
title: "Qué es TypeScript y por qué existe"
order: 1
minutes: 60
summary: "Qué añade TypeScript a JavaScript, cómo se compila y cómo lo usa tu editor para ayudarte."
---

Llevas un año escribiendo JavaScript y TypeScript ya aparece en tus proyectos: el `tsconfig.json` de Astro, los archivos `.ts`, los errores en rojo de VS Code. Hasta ahora ha sido una caja negra. En esta sección vas a entender qué es, qué problema resuelve y, sobre todo, qué **no** hace.

## JavaScript con un sistema de tipos

TypeScript es JavaScript con una capa extra: un **sistema de tipos** que se comprueba **antes** de ejecutar el código. Todo JavaScript válido es TypeScript válido; TypeScript solo añade anotaciones y un compilador que las revisa.

```ts
function sumar(a: number, b: number): number {
  return a + b;
}

sumar(2, 3); // ✅ 5
sumar("2", 3); // ❌ Argument of type 'string' is not assignable to parameter of type 'number'.
```

En JavaScript, `sumar("2", 3)` devolvería `"23"` sin quejarse, y el error aparecería mucho después, quizá en producción. TypeScript lo detecta mientras escribes.

## Estático vs dinámico

- **Tipado dinámico** (JavaScript): los tipos se descubren al ejecutar. Los errores aparecen en *runtime*.
- **Tipado estático** (TypeScript): los tipos se comprueban al compilar. Los errores aparecen en el editor.

La idea clave: TypeScript desplaza una familia entera de errores **del momento en que el usuario usa la app al momento en que tú escribes el código**.

## Los tipos desaparecen al compilar

El navegador y Node no entienden TypeScript. Antes de ejecutarse, el código se **compila** (o simplemente se le quitan los tipos) y queda JavaScript normal:

```ts
// suma.ts
function sumar(a: number, b: number): number {
  return a + b;
}
```

```js
// suma.js (resultado)
function sumar(a, b) {
  return a + b;
}
```

Por eso TypeScript **no hace tu código más lento** en producción: lo que se ejecuta es el mismo JavaScript que habrías escrito a mano.

<Callout type="note">
  Como los tipos desaparecen, TypeScript **no valida datos en ejecución**. Si una API devuelve algo inesperado, el compilador no lo sabrá. Eso lo resolveremos con Zod en el curso I1.
</Callout>

## Tus herramientas: `tsc`, `tsx` y el editor

```bash
npm init -y
npm i -D typescript tsx
npx tsc --init      # crea un tsconfig.json
npx tsx suma.ts     # ejecuta un .ts directamente (quita los tipos al vuelo)
npx tsc             # compila y comprueba tipos de todo el proyecto
```

- `tsc` es el compilador oficial: **comprueba** tipos y genera `.js`.
- `tsx` ejecuta `.ts` sin generar archivos: rápido para practicar, pero **no comprueba** tipos.
- VS Code usa el mismo motor de TypeScript para el *hover*, el autocompletado y *Go to Definition* (`F12`). Úsalo constantemente.

## Errores comunes

- **Creer que `tsx` comprueba tipos.** Solo los quita. Para comprobar, ejecuta `npx tsc --noEmit`.
- **Ignorar los subrayados rojos** "porque funciona". Si el compilador se queja, es que en algún caso no funciona.
- **Anotar todo.** Muchas veces TypeScript ya sabe el tipo; lo veremos en la siguiente sección.

<Callout type="exercise">
  1. Crea una carpeta `ts-playground` e instala `typescript` y `tsx`.
  2. Copia una función de JavaScript de tu Planificador o de tu app de entrenamiento a un archivo `.ts`.
  3. Corrige todos los errores que marque el editor y ejecuta `npx tsc --noEmit` hasta que no quede ninguno.
  4. Compila con `npx tsc` y abre el `.js` generado: comprueba que los tipos han desaparecido.
</Callout>

<Callout type="mastery">
  Puedes explicar con tus palabras por qué TypeScript no hace tu código más lento en producción y por qué, aun así, no protege contra datos inesperados en *runtime*.
</Callout>

## Resumen

- TypeScript = JavaScript + tipos comprobados antes de ejecutar.
- Los tipos se eliminan al compilar: el resultado es JavaScript normal.
- Detecta errores en el editor en lugar de en producción.
- `tsc` comprueba tipos; `tsx` solo ejecuta.
- No valida datos externos en ejecución (eso llega con Zod).
````

### Notas de implementación (Tanda 1 ya ejecutada)

Cambios respecto al código de esta Tanda, descubiertos al verificarla. **El código real del repositorio manda:**

- **`Callout.astro` no usa `not-prose`** en el contenedor: `@tailwindcss/typography` ignora todo lo que está dentro de un `not-prose`, aunque se vuelva a añadir `prose` dentro (las listas perdían la numeración). Solo el título del cuadro es `not-prose`; el contenido hereda los estilos del artículo.
- **Precarga de fuentes** en `BaseLayout.astro` (`<link rel="preload">` de los `woff2` *latin* de Source Serif 4 e Inter, importados con `?url`): sin ella, el cambio de fuente provocaba un CLS de 0,26 en la sección B1.1.
- **Ajustes de contraste en el código** (`global.css`): algunos colores de `github-light` (comentarios, verde, rojo y naranja) y el gris de comentarios de `github-dark` no llegan a 4,5:1 sobre `--surface`; se sobrescriben solo en el tema correspondiente.
- **Código en línea dentro de un `Callout`** con fondo `--surface-2`, para que se distinga del fondo del cuadro.
- **Astro 7 permite un solo `astro dev` por proyecto** (archivo de bloqueo `.astro/dev.json`). Para levantar un segundo servidor, usa `astro dev --port <n> --ignore-lock`.
- Verificado con Lighthouse (móvil, claro y oscuro, build de producción): rendimiento 97–100, accesibilidad, buenas prácticas y SEO 100, CLS 0 en las 9 páginas.

### Criterios de aceptación — Tanda 1

- [ ] `/` redirige a `/cursos/typescript-desde-cero`.
- [ ] La portada muestra nivel, ID, título, objetivo, 3 datos (8 secciones · ~8 h · 5 preguntas), botón "Empezar curso", requisitos, lista de 8 secciones y bloque de evaluación "Próximamente".
- [ ] Las 8 secciones existen, se abren desde la portada y desde el índice, y siguen la estructura de §1.18.
- [ ] En escritorio, el índice lateral queda fijo al hacer *scroll* y marca la sección actual; en móvil se convierte en un desplegable.
- [ ] Anterior/Siguiente funciona; la última sección enlaza a la portada.
- [ ] "Marcar como leído" cambia de estado, actualiza el icono de la sección en el índice y el contador `n/8` **sin recargar**. (Al recargar se pierde: es lo esperado en esta Tanda.)
- [ ] El tema light/dark se conserva al recargar y al navegar, sin destello blanco.
- [ ] Los bloques de código usan JetBrains Mono y cambian de tema con el modo.
- [ ] Una ruta inexistente (`/cursos/xyz` o `/cursos/typescript-desde-cero/xyz`) muestra la 404.
- [ ] Navegación completa con teclado: *skip link*, índice, botón y anterior/siguiente con foco visible.
- [ ] Lighthouse (móvil) en la página de una sección: Accesibilidad ≥ 95 y Rendimiento ≥ 90.
- [ ] `npm run check` y `npm run build` sin errores.

---

## Tanda 2 · MongoDB y capa de datos

| Dato | Valor |
|---|---|
| Objetivo | Conectar la app a MongoDB Atlas, definir los tipos de documentos, crear colecciones con validación e índices y exponer `/api/health` |
| Prerrequisitos | Tanda 1 |
| Rama | `tanda-2-mongodb` |
| Fuera de alcance | Autenticación y lectura/escritura de progreso (Tandas 3 y 4) |

### 🔑 Variables de entorno que necesito de tu parte

| Variable | Ejemplo | Dónde se obtiene |
|---|---|---|
| `MONGODB_URI` | `mongodb+srv://academy_app:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority&appName=dani-academy` | Atlas → *Database* → *Connect* → *Drivers* |
| `MONGODB_DB` | `dani_academy` | Nombre que elijas (por defecto `dani_academy`) |

**Pasos en MongoDB Atlas (los haces tú):**

1. Crea un clúster (el gratuito M0 sirve) o reutiliza el que ya tienes.
2. *Database Access* → *Add New Database User*: usuario `academy_app`, contraseña larga generada y rol **readWrite** solo sobre la base de datos `dani_academy` (*Specific Privileges*).
3. *Network Access* → añade tu IP actual. (Para Vercel se añade `0.0.0.0/0` en la Tanda 10.)
4. Copia la cadena de conexión y crea tu `.env` local:

```bash
cp .env.example .env   # y rellena MONGODB_URI y MONGODB_DB
```

### 2.1 Dependencias

```bash
npm i mongodb
npm i -D tsx @types/node
```

### 2.2 Variables tipadas con `astro:env`

Añade a `astro.config.mjs`:

```js
import { defineConfig, envField } from "astro/config";

export default defineConfig({
  // …lo anterior…
  env: {
    schema: {
      MONGODB_URI: envField.string({ context: "server", access: "secret" }),
      MONGODB_DB: envField.string({ context: "server", access: "secret", default: "dani_academy" }),
    },
  },
});
```

### 2.3 Archivos de esta Tanda

```
src/
├── lib/mongo.ts                       (nuevo)
├── server/
│   ├── db-types.ts                    (nuevo)
│   └── repositories/index.ts          (nuevo, vacío de momento)
└── pages/api/health.ts                (nuevo)
scripts/db-setup.ts                    (nuevo)
```

### 2.4 `src/lib/mongo.ts`

```ts
import { MongoClient, type Db } from "mongodb";
import { MONGODB_DB, MONGODB_URI } from "astro:env/server";

declare global {
  // eslint-disable-next-line no-var
  var __daMongoClient: MongoClient | undefined;
}

/**
 * Un único cliente por proceso (temario B5.2).
 * En desarrollo se guarda en globalThis para sobrevivir a las recargas de Vite
 * y no abrir un pool de conexiones nuevo en cada cambio.
 */
export const mongoClient: MongoClient =
  globalThis.__daMongoClient ??
  new MongoClient(MONGODB_URI, {
    appName: "dani-academy",
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5_000,
  });

if (import.meta.env.DEV) globalThis.__daMongoClient = mongoClient;

/** El driver conecta en la primera operación: no hace falta `await client.connect()`. */
export const db: Db = mongoClient.db(MONGODB_DB);
```

### 2.5 `src/server/db-types.ts`

```ts
import type { ObjectId } from "mongodb";

export const COLLECTIONS = {
  sectionProgress: "section_progress",
  quizAttempts: "quiz_attempts",
  studySessions: "study_sessions",
  rateLimits: "rate_limits",
} as const;

export interface SectionProgressDoc {
  _id?: ObjectId;
  userId: string;
  courseId: string;
  sectionId: string;
  readAt: Date;
}

export interface QuizAttemptDoc {
  _id?: ObjectId;
  userId: string;
  courseId: string;
  answers: number[];
  results: boolean[];
  score: number;
  total: number;
  passed: boolean;
  submittedAt: Date;
}

export interface StudySessionDoc {
  _id?: ObjectId;
  userId: string;
  startedAt: Date;
  lastSeenAt: Date;
  sectionIds: string[];
  courseIds: string[];
}

export interface RateLimitDoc {
  _id: string; // "<clave>:<ventana>"
  n: number;
  expiresAt: Date;
}
```

`src/server/repositories/index.ts` (se completa en las Tandas 4 y 5):

```ts
import { db } from "@/lib/mongo";

/** Punto único donde se conectan los repositorios con la base de datos real. */
export const repos = {
  // progress: createProgressRepo(db),            ← Tanda 4
  // studySessions: createStudySessionsRepo(db),  ← Tanda 4
  // quizAttempts: createQuizAttemptsRepo(db),    ← Tanda 5
};

export { db };
```

### 2.6 `scripts/db-setup.ts` (colecciones, validación e índices)

Script **idempotente**: se puede ejecutar tantas veces como quieras (en local, en preview y en producción).

```ts
/**
 * Uso: npm run db:setup
 * Crea (o actualiza) colecciones con validación $jsonSchema e índices.
 */
import { MongoClient, type CreateIndexesOptions, type Db, type Document, type IndexSpecification } from "mongodb";
import { COLLECTIONS } from "../src/server/db-types";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB ?? "dani_academy";
if (!uri) {
  console.error("✖ Falta MONGODB_URI (¿has creado el archivo .env?)");
  process.exit(1);
}

const COURSE_ID = "^([BIA][1-8]|P1)$";
const SECTION_ID = "^([BIA][1-8]|P1)\\.\\d{1,2}$";

const validators: Record<string, Document> = {
  [COLLECTIONS.sectionProgress]: {
    $jsonSchema: {
      bsonType: "object",
      required: ["userId", "courseId", "sectionId", "readAt"],
      properties: {
        userId: { bsonType: "string", minLength: 1 },
        courseId: { bsonType: "string", pattern: COURSE_ID },
        sectionId: { bsonType: "string", pattern: SECTION_ID },
        readAt: { bsonType: "date" },
      },
    },
  },
  [COLLECTIONS.quizAttempts]: {
    $jsonSchema: {
      bsonType: "object",
      required: ["userId", "courseId", "answers", "results", "score", "total", "passed", "submittedAt"],
      properties: {
        userId: { bsonType: "string", minLength: 1 },
        courseId: { bsonType: "string", pattern: COURSE_ID },
        answers: { bsonType: "array", minItems: 5, maxItems: 5, items: { bsonType: "number", minimum: 0, maximum: 3 } },
        results: { bsonType: "array", minItems: 5, maxItems: 5, items: { bsonType: "bool" } },
        score: { bsonType: "number", minimum: 0, maximum: 5 },
        total: { bsonType: "number", minimum: 5, maximum: 5 },
        passed: { bsonType: "bool" },
        submittedAt: { bsonType: "date" },
      },
    },
  },
  [COLLECTIONS.studySessions]: {
    $jsonSchema: {
      bsonType: "object",
      required: ["userId", "startedAt", "lastSeenAt", "sectionIds", "courseIds"],
      properties: {
        userId: { bsonType: "string", minLength: 1 },
        startedAt: { bsonType: "date" },
        lastSeenAt: { bsonType: "date" },
        sectionIds: { bsonType: "array", items: { bsonType: "string", pattern: SECTION_ID } },
        courseIds: { bsonType: "array", items: { bsonType: "string", pattern: COURSE_ID } },
      },
    },
  },
};

type IndexDef = [collection: string, spec: IndexSpecification, options?: CreateIndexesOptions];

const indexes: IndexDef[] = [
  // Propias
  [COLLECTIONS.sectionProgress, { userId: 1, sectionId: 1 }, { unique: true, name: "user_section_unique" }],
  [COLLECTIONS.sectionProgress, { userId: 1, courseId: 1 }, { name: "user_course" }],
  [COLLECTIONS.sectionProgress, { userId: 1, readAt: -1 }, { name: "user_readAt" }],
  [COLLECTIONS.quizAttempts, { userId: 1, courseId: 1, submittedAt: -1 }, { name: "user_course_submittedAt" }],
  [COLLECTIONS.quizAttempts, { userId: 1, submittedAt: -1 }, { name: "user_submittedAt" }],
  [COLLECTIONS.studySessions, { userId: 1, lastSeenAt: -1 }, { name: "user_lastSeenAt" }],
  // Better Auth (Tanda 3): consultas por email, token y userId
  ["user", { email: 1 }, { unique: true, name: "email_unique" }],
  ["session", { token: 1 }, { unique: true, name: "token_unique" }],
  ["session", { userId: 1 }, { name: "userId" }],
  ["account", { userId: 1 }, { name: "userId" }],
];

async function ensureCollection(db: Db, name: string, validator: Document) {
  const exists = (await db.listCollections({ name }, { nameOnly: true }).toArray()).length > 0;
  const options = { validator, validationLevel: "strict", validationAction: "error" } as const;
  if (exists) {
    await db.command({ collMod: name, ...options });
    console.log(`↻ ${name}: validación actualizada`);
  } else {
    await db.createCollection(name, options);
    console.log(`＋ ${name}: creada`);
  }
}

async function main() {
  const client = new MongoClient(uri!);
  try {
    const db = client.db(dbName);
    console.log(`Base de datos: ${dbName}`);

    for (const [name, validator] of Object.entries(validators)) {
      await ensureCollection(db, name, validator);
    }

    for (const [collection, spec, options] of indexes) {
      try {
        const name = await db.collection(collection).createIndex(spec, options);
        console.log(`✓ índice ${collection}.${name}`);
      } catch (error) {
        console.warn(`⚠ índice ${collection} ${JSON.stringify(spec)}: ${(error as Error).message}`);
      }
    }
    console.log("Listo.");
  } finally {
    await client.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
```

`package.json`:

```json
{
  "scripts": {
    "db:setup": "tsx --env-file=.env scripts/db-setup.ts"
  }
}
```

### 2.7 `src/pages/api/health.ts`

```ts
import type { APIRoute } from "astro";
import { db } from "@/lib/mongo";

const noStore = { "Cache-Control": "no-store" };

export const GET: APIRoute = async () => {
  const started = performance.now();
  try {
    await db.command({ ping: 1 });
    return Response.json({ ok: true, db: "up", ms: Math.round(performance.now() - started) }, { headers: noStore });
  } catch (error) {
    console.error("[health] MongoDB no responde", error);
    return Response.json({ ok: false, db: "down" }, { status: 503, headers: noStore });
  }
};
```

### Notas de implementación (Tanda 2 ya ejecutada)

- Versiones instaladas: driver `mongodb` 7.7, `tsx` 4.23. Las APIs del plan no cambian.
- **`db:setup` usa ya la forma final** (`node --env-file-if-exists=.env --import tsx scripts/db-setup.ts`), que el plan reservaba para la Tanda 9: no falla si no existe `.env` (CI) y no depende de opciones de `tsx`.
- **`collMod` requiere el rol `dbAdmin`.** Con un usuario solo `readWrite`, el script crea colecciones e índices pero no puede actualizar el validador de una colección existente: ahora avisa en lugar de fallar.
- `MONGODB_URI` se valida con `startsWith: "mongodb"` en `astro:env`, para detectar al instante una URI mal pegada.
- Verificado: dos ejecuciones de `db:setup` sin errores; Atlas rechaza documentos inválidos (código 121) y duplicados (11000); `/api/health` → 200 con Atlas, 503 con una URI inaccesible (la app sigue sirviendo páginas) y error `EnvInvalidVariables` con una URI mal formada.

### Criterios de aceptación — Tanda 2

- [ ] `npm run db:setup` termina con "Listo." y en Atlas/Compass existen `section_progress`, `quiz_attempts` y `study_sessions` con su validador y sus índices.
- [ ] Ejecutar `npm run db:setup` una segunda vez no falla.
- [ ] `curl -i http://localhost:4321/api/health` devuelve `200` con `{"ok":true,"db":"up",…}`.
- [ ] Con un `MONGODB_URI` incorrecto, `/api/health` devuelve `503` (y la app no se cae).
- [ ] Si falta `MONGODB_URI`, Astro muestra un error claro de variable de entorno.
- [ ] Insertar a mano en Compass un documento inválido en `section_progress` (por ejemplo, `sectionId: "X"`) es rechazado.
- [ ] `npm run check` y `npm run build` sin errores. `.env` **no** aparece en `git status`.

---

## Tanda 3 · Autenticación con Better Auth

| Dato | Valor |
|---|---|
| Objetivo | Registro (nombre, correo, contraseña), inicio de sesión (correo, contraseña), cierre de sesión y protección de todas las rutas privadas |
| Prerrequisitos | Tanda 2 |
| Rama | `tanda-3-auth` |
| Fuera de alcance | 2FA, verificación de correo, recuperación de contraseña, proveedores sociales (**no se implementan**) |

### 🔑 Variables de entorno que necesito de tu parte

| Variable | Ejemplo | Cómo se obtiene |
|---|---|---|
| `BETTER_AUTH_SECRET` | `k3Jx…` (≥ 32 caracteres) | Genéralo con `openssl rand -base64 32`. Uno distinto por entorno |
| `BETTER_AUTH_URL` | `http://localhost:4321` | URL base de la app. En producción, tu dominio (Tanda 10) |

(Siguen siendo necesarias `MONGODB_URI` y `MONGODB_DB` de la Tanda 2.)

### 3.1 Dependencias

```bash
npm i better-auth @better-auth/mongo-adapter
npm i zod react-hook-form @hookform/resolvers
```

### 3.2 `astro.config.mjs` — nuevas variables

```js
env: {
  schema: {
    MONGODB_URI: envField.string({ context: "server", access: "secret" }),
    MONGODB_DB: envField.string({ context: "server", access: "secret", default: "dani_academy" }),
    BETTER_AUTH_SECRET: envField.string({ context: "server", access: "secret", min: 32 }),
    BETTER_AUTH_URL: envField.string({ context: "server", access: "secret", url: true }),
  },
},
```

### 3.3 Archivos de esta Tanda

```
src/
├── env.d.ts                              (nuevo: tipos de Astro.locals)
├── middleware.ts                         (nuevo)
├── lib/
│   ├── auth.ts                           (nuevo: servidor)
│   ├── auth-client.ts                    (nuevo: navegador)
│   └── redirect.ts                       (nuevo)
├── schemas/auth.ts                       (nuevo)
├── layouts/AuthLayout.astro              (nuevo)
├── components/
│   ├── auth/TextField.tsx                (nuevo)
│   ├── auth/LoginForm.tsx                (nuevo)
│   ├── auth/RegisterForm.tsx             (nuevo)
│   └── layout/UserMenu.astro             (nuevo)
│   └── layout/SiteHeader.astro           (modificar: muestra UserMenu)
└── pages/
    ├── api/auth/[...all].ts              (nuevo)
    ├── login.astro                       (nuevo)
    └── registro.astro                    (nuevo)
```

### 3.4 `src/lib/auth.ts`

```ts
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { BETTER_AUTH_SECRET, BETTER_AUTH_URL } from "astro:env/server";
import { db, mongoClient } from "@/lib/mongo";

export const auth = betterAuth({
  appName: "Dani Academy",
  baseURL: BETTER_AUTH_URL,
  secret: BETTER_AUTH_SECRET,
  // Pasar el cliente permite a Better Auth usar transacciones (requiere replica set: Atlas lo es)
  database: mongodbAdapter(db, { client: mongoClient }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true, // tras registrarse, la sesión queda iniciada
    requireEmailVerification: false,
    minPasswordLength: 8,
    maxPasswordLength: 128,
    // Sin sendResetPassword: la recuperación de contraseña queda deshabilitada
  },
  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 días
    updateAge: 60 * 60 * 24, // renueva la expiración como mucho una vez al día
    cookieCache: { enabled: true, maxAge: 5 * 60 }, // evita ir a Mongo en cada petición
  },
  trustedOrigins: [BETTER_AUTH_URL],
});

export type AuthSession = typeof auth.$Infer.Session;
```

### 3.5 Handler de Better Auth: `src/pages/api/auth/[...all].ts`

```ts
import type { APIRoute } from "astro";
import { auth } from "@/lib/auth";

export const ALL: APIRoute = ({ request }) => auth.handler(request);
```

### 3.6 `src/lib/auth-client.ts`

Cliente sin dependencias de React: sirve tanto en islas React como en `<script>` de Astro.

```ts
import { createAuthClient } from "better-auth/client";

// Sin baseURL: usa el mismo origen que la página
export const authClient = createAuthClient();
```

### 3.7 `src/env.d.ts`

```ts
/// <reference types="astro/client" />

declare namespace App {
  interface Locals {
    user: import("@/lib/auth").AuthSession["user"] | null;
    session: import("@/lib/auth").AuthSession["session"] | null;
  }
}
```

### 3.8 `src/lib/redirect.ts`

Evita *open redirects* (temario I5.3): solo se permiten rutas internas.

```ts
export function safeRedirect(target: string | null | undefined, fallback = "/"): string {
  if (!target) return fallback;
  if (!target.startsWith("/") || target.startsWith("//") || target.startsWith("/\\")) return fallback;
  return target;
}
```

### 3.9 `src/middleware.ts`

```ts
import { defineMiddleware, sequence } from "astro:middleware";
import { auth } from "@/lib/auth";

const AUTH_PAGES = new Set(["/login", "/registro"]);
const PUBLIC_PREFIXES = ["/api/auth/", "/api/health"];

const isApi = (pathname: string) => pathname.startsWith("/api/") || pathname.startsWith("/_actions/");

/** 1. Carga la sesión en Astro.locals */
const loadSession = defineMiddleware(async (ctx, next) => {
  ctx.locals.user = null;
  ctx.locals.session = null;

  if (ctx.isPrerendered || ctx.url.pathname.startsWith("/api/auth/")) return next();

  const data = await auth.api.getSession({ headers: ctx.request.headers });
  ctx.locals.user = data?.user ?? null;
  ctx.locals.session = data?.session ?? null;
  return next();
});

/** 2. Protege todo lo que no sea público */
const guard = defineMiddleware(async (ctx, next) => {
  const { pathname, search } = ctx.url;

  if (PUBLIC_PREFIXES.some((p) => pathname.startsWith(p))) return next();

  if (AUTH_PAGES.has(pathname)) {
    return ctx.locals.user ? ctx.redirect("/") : next();
  }

  if (!ctx.locals.user) {
    if (isApi(pathname)) return Response.json({ error: "No autenticado" }, { status: 401 });
    return ctx.redirect(`/login?redirect=${encodeURIComponent(pathname + search)}`);
  }

  return next();
});

export const onRequest = sequence(loadSession, guard);
```

> La página `404.astro` también queda protegida: un usuario sin sesión que visita una ruta inexistente acaba en `/login`. Es aceptable en una app privada.

### 3.10 `src/schemas/auth.ts`

```ts
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Introduce un correo válido"),
  password: z.string().min(1, "Introduce tu contraseña"),
});

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Mínimo 2 caracteres").max(60, "Máximo 60 caracteres"),
  email: z.string().trim().toLowerCase().email("Introduce un correo válido"),
  password: z.string().min(8, "Mínimo 8 caracteres").max(128, "Máximo 128 caracteres"),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
```

### 3.11 Componentes de formulario

`src/components/auth/TextField.tsx`:

```tsx
import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const TextField = forwardRef<HTMLInputElement, Props>(function TextField(
  { label, error, id, name, className, ...props },
  ref,
) {
  const inputId = id ?? name;
  const errorId = `${inputId}-error`;
  return (
    <div>
      <label htmlFor={inputId} className="block text-sm font-medium text-fg">
        {label}
      </label>
      <input
        ref={ref}
        id={inputId}
        name={name}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className={cn(
          "mt-1.5 block w-full rounded-xl border border-surface-2 bg-bg px-4 py-2.5 text-fg",
          "placeholder:text-muted/70 focus:border-accent focus:ring-2 focus:ring-accent/30 focus:outline-none",
          "aria-[invalid=true]:border-danger",
          className,
        )}
        {...props}
      />
      {error && (
        <p id={errorId} className="mt-1.5 text-sm text-danger-strong">
          {error}
        </p>
      )}
    </div>
  );
});
```

`src/components/auth/RegisterForm.tsx`:

```tsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@/lib/auth-client";
import { registerSchema, type RegisterInput } from "@/schemas/auth";
import { TextField } from "./TextField";

export default function RegisterForm({ redirectTo }: { redirectTo: string }) {
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({ resolver: zodResolver(registerSchema), mode: "onBlur" });

  const onSubmit = handleSubmit(async ({ name, email, password }) => {
    setServerError(null);
    const { error } = await authClient.signUp.email({ name, email, password });
    if (error) {
      setServerError("No se pudo crear la cuenta. Si ya tienes una, inicia sesión.");
      return;
    }
    window.location.assign(redirectTo); // recarga completa: el servidor ya ve la cookie
  });

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <TextField label="Nombre" type="text" autoComplete="name" error={errors.name?.message} {...register("name")} />
      <TextField label="Correo" type="email" autoComplete="email" inputMode="email" error={errors.email?.message} {...register("email")} />
      <TextField label="Contraseña" type="password" autoComplete="new-password" error={errors.password?.message} {...register("password")} />

      {serverError && (
        <p role="alert" className="rounded-xl border border-danger/50 bg-danger/10 px-4 py-3 text-sm text-danger-strong">
          {serverError}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-xl bg-accent-strong px-5 py-3 text-sm font-semibold text-accent-contrast transition hover:opacity-90 disabled:opacity-60"
      >
        {isSubmitting ? "Creando cuenta…" : "Crear cuenta"}
      </button>
    </form>
  );
}
```

`src/components/auth/LoginForm.tsx`: igual que `RegisterForm` con estas diferencias:

```tsx
// Esquema: loginSchema / LoginInput. Campos: email (autoComplete="email") y password (autoComplete="current-password").
const { error } = await authClient.signIn.email({ email, password });
if (error) {
  // Mensaje genérico: no revela si el correo existe (temario I5.5)
  setServerError("Correo o contraseña incorrectos.");
  return;
}
window.location.assign(redirectTo);
// Texto del botón: "Entrar" / "Entrando…"
```

### 3.12 `src/layouts/AuthLayout.astro`

```astro
---
import BaseLayout from "./BaseLayout.astro";
import ThemeToggle from "@/components/layout/ThemeToggle.astro";

interface Props {
  title: string;
}
const { title } = Astro.props;
---

<BaseLayout title={title}>
  <div class="flex min-h-dvh flex-col">
    <header class="flex h-14 items-center justify-between px-4 lg:px-6">
      <span class="font-serif text-lg font-semibold tracking-tight">Dani Academy</span>
      <ThemeToggle />
    </header>
    <main id="contenido" class="flex flex-1 items-center justify-center px-4 pb-16">
      <div class="w-full max-w-sm rounded-2xl border border-surface-2 bg-surface/50 p-8 shadow-sm">
        <slot />
      </div>
    </main>
  </div>
</BaseLayout>
```

### 3.13 Páginas `login.astro` y `registro.astro`

```astro
---
// src/pages/login.astro
import AuthLayout from "@/layouts/AuthLayout.astro";
import LoginForm from "@/components/auth/LoginForm";
import { safeRedirect } from "@/lib/redirect";

const redirectTo = safeRedirect(Astro.url.searchParams.get("redirect"));
const registerHref = `/registro${redirectTo !== "/" ? `?redirect=${encodeURIComponent(redirectTo)}` : ""}`;
---

<AuthLayout title="Iniciar sesión">
  <h1 class="font-serif text-2xl font-semibold tracking-tight">Bienvenido de nuevo</h1>
  <p class="mt-2 mb-8 text-sm text-muted">Entra para continuar con tu temario.</p>
  <LoginForm client:load redirectTo={redirectTo} />
  <p class="mt-6 text-center text-sm text-muted">
    ¿No tienes cuenta? <a href={registerHref} class="font-medium text-accent-strong hover:underline">Crear cuenta</a>
  </p>
</AuthLayout>
```

`src/pages/registro.astro`: igual, con título "Crear cuenta", subtítulo "Solo necesitas tu nombre, tu correo y una contraseña.", `<RegisterForm client:load …/>` y enlace "¿Ya tienes cuenta? Inicia sesión" a `/login`.

### 3.14 Menú de usuario en la cabecera

`src/components/layout/UserMenu.astro`:

```astro
---
const user = Astro.locals.user;
---

{
  user && (
    <div class="flex items-center gap-1">
      <span class="hidden px-2 text-sm text-muted md:inline">{user.name}</span>
      <button type="button" data-sign-out class="rounded-lg px-3 py-1.5 text-sm text-muted transition-colors hover:bg-surface hover:text-fg">
        Salir
      </button>
    </div>
  )
}

<script>
  import { authClient } from "@/lib/auth-client";

  document.addEventListener("astro:page-load", () => {
    document.querySelectorAll<HTMLButtonElement>("[data-sign-out]").forEach((btn) => {
      btn.onclick = async () => {
        btn.disabled = true;
        await authClient.signOut();
        window.location.assign("/login");
      };
    });
  });
</script>
```

En `SiteHeader.astro`, dentro de `<div class="ml-auto …">`, añade `<UserMenu />` antes de `<ThemeToggle />`.

### Notas de implementación (Tanda 3 ya ejecutada)

- Versiones: `better-auth` y `@better-auth/mongo-adapter` 1.7.7, `zod` 4.6, `react-hook-form` 7.89.
- **Sin `@hookform/resolvers`:** una dependencia opcional suya pide Zod 3 y npm no resuelve el conflicto con el Zod 4 de Astro 7. Se sustituye por `src/lib/zod-resolver.ts` (15 líneas). Los esquemas usan la API de Zod 4: `z.string().trim().toLowerCase().pipe(z.email(…))`.
- **`trustedOrigins` es una función:** en producción solo confía en `BETTER_AUTH_URL`; en desarrollo también en el origen real de la petición si es `localhost` (Astro cambia de puerto si el 4321 está ocupado).
- **Componentes extra:** `FormAlert.tsx` (error general del formulario y clase del botón, compartidos por login y registro). El login muestra un mensaje propio si Better Auth responde `429`.
- **CSRF de Astro:** `security.checkOrigin` (activo por defecto) rechaza con `403` las peticiones `PUT/POST/DELETE` sin `Origin` del propio sitio, antes del *middleware*. Un `curl` sin cabecera `Origin` recibe ese `403`; con `-H "Origin: <tu URL>"` recibe el `401` JSON del *middleware*. Los navegadores siempre envían `Origin`.
- Verificado (build de producción y `astro dev` en otro puerto): 16 comprobaciones de flujo en Chrome; en Atlas, contraseña hasheada (scrypt, `sal:hash`) y 0 sesiones tras cerrar sesión; Lighthouse en `/login` y `/registro` con accesibilidad 100 en ambos temas.

### Criterios de aceptación — Tanda 3

- [ ] Sin sesión, `/cursos/typescript-desde-cero` redirige a `/login?redirect=%2Fcursos%2Ftypescript-desde-cero`.
- [ ] El registro con nombre, correo y contraseña crea un documento en `user` y otro en `account` (con `password` **hasheada**) y deja la sesión iniciada.
- [ ] Tras registrarse o iniciar sesión, se vuelve a la ruta de `redirect`. `?redirect=https://evil.com` y `?redirect=//evil.com` llevan a `/`.
- [ ] Una contraseña incorrecta muestra "Correo o contraseña incorrectos." (el mismo mensaje si el correo no existe).
- [ ] Los errores de validación aparecen bajo cada campo y se anuncian a lectores de pantalla (`aria-invalid`, `aria-describedby`).
- [ ] Con sesión, `/login` y `/registro` redirigen a `/`.
- [ ] "Salir" cierra la sesión y lleva a `/login`; el documento de `session` desaparece en Mongo.
- [ ] La cookie de sesión es `HttpOnly` y `SameSite=Lax` (DevTools → *Application* → *Cookies*).
- [ ] `curl -i http://localhost:4321/api/progress/B1.1 -X PUT` sin cookie devuelve `401` JSON (aunque el endpoint aún no exista, el *middleware* responde antes).
- [ ] No existe ninguna ruta ni UI de recuperación de contraseña, 2FA o verificación de correo.
- [ ] `npm run db:setup` crea los índices de `user`, `session` y `account` sin avisos.
- [ ] `npm run check` y `npm run build` sin errores.

---

## Tanda 4 · Tracking: "Marcar como leído" y sesiones de estudio

| Dato | Valor |
|---|---|
| Objetivo | Persistir en MongoDB el estado leído/no leído de cada sección y registrar sesiones de estudio |
| Prerrequisitos | Tanda 3 |
| Variables de entorno | **Ninguna nueva** |
| Rama | `tanda-4-tracking` |

### 4.1 Archivos de esta Tanda

```
src/
├── lib/
│   ├── constants.ts                          (modificar: regex de IDs)
│   ├── errors.ts                             (nuevo)
│   └── domain/progress.ts                    (nuevo: lógica pura)
├── server/
│   ├── repositories/progress.repo.ts         (nuevo)
│   ├── repositories/study-sessions.repo.ts   (nuevo)
│   ├── repositories/index.ts                 (modificar)
│   ├── services/progress.service.ts          (nuevo)
│   └── services/study-session.service.ts     (nuevo)
├── components/course/
│   ├── MarkAsReadButton.tsx                  (modificar: persistencia)
│   └── StudyTracker.astro                    (nuevo)
└── pages/
    ├── api/progress/[sectionId].ts           (nuevo)
    ├── api/study-sessions/heartbeat.ts       (nuevo)
    ├── cursos/[course]/index.astro           (modificar: readIds reales)
    └── cursos/[course]/[section].astro       (modificar: readIds reales + StudyTracker)
```

### 4.2 Constantes y errores

Añade a `src/lib/constants.ts` (y úsalas también en `content.config.ts` en lugar de las regex locales):

```ts
export const COURSE_ID_REGEX = /^([BIA][1-8]|P1)$/;
export const SECTION_ID_REGEX = /^([BIA][1-8]|P1)\.\d{1,2}$/;
export const IDLE_AFTER_MINUTES = 5; // sin interacción → no se cuentan latidos
```

`src/lib/errors.ts`:

```ts
export class HttpError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = new.target.name;
  }
}

export class BadRequestError extends HttpError {
  constructor(message = "Petición no válida") { super(400, message); }
}
export class UnauthorizedError extends HttpError {
  constructor(message = "No autenticado") { super(401, message); }
}
export class ForbiddenError extends HttpError {
  constructor(message = "No permitido") { super(403, message); }
}
export class NotFoundError extends HttpError {
  constructor(message = "No encontrado") { super(404, message); }
}
export class TooManyRequestsError extends HttpError {
  constructor(public readonly retryAfterSeconds: number) { super(429, "Demasiadas peticiones"); }
}

/** Convierte cualquier error en una respuesta JSON con el código correcto. */
export function toErrorResponse(error: unknown): Response {
  if (error instanceof TooManyRequestsError) {
    return Response.json({ error: error.message }, { status: 429, headers: { "Retry-After": String(error.retryAfterSeconds) } });
  }
  if (error instanceof HttpError) {
    return Response.json({ error: error.message }, { status: error.status });
  }
  console.error("[api] Error no controlado", error);
  return Response.json({ error: "Error interno" }, { status: 500 });
}
```

### 4.3 Lógica pura: `src/lib/domain/progress.ts`

```ts
export type CourseStatus = "not-started" | "in-progress" | "read" | "completed";

export function percent(done: number, total: number): number {
  if (total <= 0) return 0;
  return Math.min(100, Math.round((done / total) * 100));
}

/** read = todas las secciones leídas pero evaluación sin aprobar; completed = todo leído + aprobada */
export function courseStatus(readCount: number, totalSections: number, quizPassed: boolean): CourseStatus {
  if (totalSections > 0 && readCount >= totalSections) return quizPassed ? "completed" : "read";
  return readCount === 0 ? "not-started" : "in-progress";
}

/** Duración de una sesión en minutos (se suma un intervalo de latido: el último minuto también cuenta) */
export function sessionMinutes(startedAt: Date, lastSeenAt: Date, heartbeatSeconds = 60): number {
  const ms = lastSeenAt.getTime() - startedAt.getTime() + heartbeatSeconds * 1000;
  return Math.max(1, Math.round(ms / 60_000));
}
```

### 4.4 Repositorios

`src/server/repositories/progress.repo.ts`:

```ts
import type { Db } from "mongodb";
import { COLLECTIONS, type SectionProgressDoc } from "@/server/db-types";

const DUPLICATE_KEY = 11000;

export function createProgressRepo(db: Db) {
  const col = db.collection<SectionProgressDoc>(COLLECTIONS.sectionProgress);

  return {
    /** Idempotente: marcar dos veces no duplica ni cambia la fecha original */
    async markRead(userId: string, courseId: string, sectionId: string, now = new Date()) {
      try {
        await col.updateOne(
          { userId, sectionId },
          { $setOnInsert: { courseId, readAt: now } },
          { upsert: true },
        );
      } catch (error) {
        // Dos peticiones simultáneas: la segunda choca con el índice único → ya está marcada
        if ((error as { code?: number }).code !== DUPLICATE_KEY) throw error;
      }
    },

    async unmarkRead(userId: string, sectionId: string) {
      await col.deleteOne({ userId, sectionId });
    },

    async readSectionIds(userId: string, courseId: string): Promise<string[]> {
      const docs = await col.find({ userId, courseId }, { projection: { _id: 0, sectionId: 1 } }).toArray();
      return docs.map((d) => d.sectionId);
    },

    async allReadSectionIds(userId: string): Promise<string[]> {
      const docs = await col.find({ userId }, { projection: { _id: 0, sectionId: 1 } }).toArray();
      return docs.map((d) => d.sectionId);
    },

    async lastRead(userId: string): Promise<SectionProgressDoc | null> {
      return col.find({ userId }).sort({ readAt: -1 }).limit(1).next();
    },
  };
}

export type ProgressRepo = ReturnType<typeof createProgressRepo>;
```

`src/server/repositories/study-sessions.repo.ts`:

```ts
import type { Db } from "mongodb";
import { SESSION_GAP_MINUTES } from "@/lib/constants";
import { COLLECTIONS, type StudySessionDoc } from "@/server/db-types";

export function createStudySessionsRepo(db: Db) {
  const col = db.collection<StudySessionDoc>(COLLECTIONS.studySessions);

  return {
    /** Extiende la sesión activa (último latido hace ≤ 30 min) o crea una nueva */
    async heartbeat(userId: string, courseId: string, sectionId: string, now = new Date()) {
      const cutoff = new Date(now.getTime() - SESSION_GAP_MINUTES * 60_000);
      const extended = await col.findOneAndUpdate(
        { userId, lastSeenAt: { $gte: cutoff } },
        { $set: { lastSeenAt: now }, $addToSet: { sectionIds: sectionId, courseIds: courseId } },
        { sort: { lastSeenAt: -1 }, returnDocument: "after" },
      );
      if (extended) return extended;

      const session: StudySessionDoc = { userId, startedAt: now, lastSeenAt: now, sectionIds: [sectionId], courseIds: [courseId] };
      await col.insertOne(session);
      return session;
    },

    async recent(userId: string, limit = 15): Promise<StudySessionDoc[]> {
      return col.find({ userId }).sort({ lastSeenAt: -1 }).limit(limit).toArray();
    },
  };
}

export type StudySessionsRepo = ReturnType<typeof createStudySessionsRepo>;
```

`src/server/repositories/index.ts`:

```ts
import { db } from "@/lib/mongo";
import { createProgressRepo } from "./progress.repo";
import { createStudySessionsRepo } from "./study-sessions.repo";

export const repos = {
  progress: createProgressRepo(db),
  studySessions: createStudySessionsRepo(db),
};
```

### 4.5 Servicios

`src/server/services/progress.service.ts`:

```ts
import { getSectionById } from "@/lib/content";
import { NotFoundError } from "@/lib/errors";
import { repos } from "@/server/repositories";

export async function setSectionRead(userId: string, sectionId: string, read: boolean): Promise<void> {
  const section = await getSectionById(sectionId);
  if (!section) throw new NotFoundError("La sección no existe");

  if (read) await repos.progress.markRead(userId, section.data.course.id, sectionId);
  else await repos.progress.unmarkRead(userId, sectionId);
}

export function getCourseReadIds(userId: string, courseId: string): Promise<string[]> {
  return repos.progress.readSectionIds(userId, courseId);
}
```

`src/server/services/study-session.service.ts`:

```ts
import { getSectionById } from "@/lib/content";
import { NotFoundError } from "@/lib/errors";
import { repos } from "@/server/repositories";

export async function recordHeartbeat(userId: string, sectionId: string): Promise<void> {
  const section = await getSectionById(sectionId);
  if (!section) throw new NotFoundError("La sección no existe");
  await repos.studySessions.heartbeat(userId, section.data.course.id, sectionId);
}
```

### 4.6 Endpoints

`src/pages/api/progress/[sectionId].ts`:

```ts
import type { APIRoute } from "astro";
import { SECTION_ID_REGEX } from "@/lib/constants";
import { BadRequestError, UnauthorizedError, toErrorResponse } from "@/lib/errors";
import { setSectionRead } from "@/server/services/progress.service";

const handler =
  (read: boolean): APIRoute =>
  async ({ params, locals }) => {
    try {
      if (!locals.user) throw new UnauthorizedError();
      const sectionId = params.sectionId ?? "";
      if (!SECTION_ID_REGEX.test(sectionId)) throw new BadRequestError("Identificador de sección no válido");

      // El userId SIEMPRE sale de la sesión, nunca de la petición (temario I5.4)
      await setSectionRead(locals.user.id, sectionId, read);
      return new Response(null, { status: 204 });
    } catch (error) {
      return toErrorResponse(error);
    }
  };

export const PUT = handler(true);
export const DELETE = handler(false);
```

`src/pages/api/study-sessions/heartbeat.ts`:

```ts
import type { APIRoute } from "astro";
import { z } from "zod";
import { SECTION_ID_REGEX } from "@/lib/constants";
import { BadRequestError, UnauthorizedError, toErrorResponse } from "@/lib/errors";
import { recordHeartbeat } from "@/server/services/study-session.service";

const bodySchema = z.object({ sectionId: z.string().regex(SECTION_ID_REGEX) });

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    if (!locals.user) throw new UnauthorizedError();
    const parsed = bodySchema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) throw new BadRequestError();
    await recordHeartbeat(locals.user.id, parsed.data.sectionId);
    return new Response(null, { status: 204 });
  } catch (error) {
    return toErrorResponse(error);
  }
};
```

### 4.7 `MarkAsReadButton.tsx` con persistencia

Actualización optimista con *rollback* (temario I2.5). Mantiene el evento `da:section-read` para el índice lateral.

```tsx
import { useState } from "react";
import { cn } from "@/lib/cn";

interface Props {
  sectionId: string;
  initialRead?: boolean;
}

const emit = (sectionId: string, read: boolean) =>
  document.dispatchEvent(new CustomEvent("da:section-read", { detail: { sectionId, read } }));

export default function MarkAsReadButton({ sectionId, initialRead = false }: Props) {
  const [read, setRead] = useState(initialRead);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function toggle() {
    const previous = read;
    const next = !previous;
    setRead(next);
    emit(sectionId, next);
    setError(null);
    setPending(true);

    try {
      const res = await fetch(`/api/progress/${encodeURIComponent(sectionId)}`, { method: next ? "PUT" : "DELETE" });
      if (res.status === 401) {
        window.location.assign(`/login?redirect=${encodeURIComponent(location.pathname)}`);
        return;
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
    } catch {
      setRead(previous); // rollback
      emit(sectionId, previous);
      setError("No se pudo guardar. Revisa tu conexión e inténtalo de nuevo.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4">
      <button
        type="button"
        aria-pressed={read}
        aria-busy={pending}
        disabled={pending}
        onClick={toggle}
        className={cn(
          "inline-flex items-center gap-2 rounded-xl px-5 py-3 font-sans text-sm font-semibold transition disabled:cursor-wait",
          read
            ? "bg-accent/10 text-accent-strong ring-1 ring-accent/40 ring-inset hover:bg-accent/15"
            : "bg-accent-strong text-accent-contrast hover:opacity-90",
        )}
      >
        <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="m5 13 4 4L19 7" />
        </svg>
        {read ? "Leído" : "Marcar como leído"}
      </button>
      <p className={cn("font-sans text-sm", error ? "text-danger-strong" : "text-muted")} aria-live="polite">
        {error ?? (read ? "Sección completada. Se ha guardado tu progreso." : "Márcala cuando cumplas el criterio «Lo dominas si…».")}
      </p>
    </div>
  );
}
```

### 4.8 `src/components/course/StudyTracker.astro`

Envía un latido al abrir la sección y cada 60 s mientras la pestaña esté visible **y** haya habido interacción en los últimos 5 minutos.

```astro
---
interface Props {
  sectionId: string;
}
const { sectionId } = Astro.props;
---

<div data-study-tracker data-section-id={sectionId} hidden></div>

<script>
  import { HEARTBEAT_INTERVAL_SECONDS, IDLE_AFTER_MINUTES } from "@/lib/constants";

  let timer: number | undefined;
  let lastActivity = Date.now();

  const markActive = () => (lastActivity = Date.now());
  ["scroll", "keydown", "pointerdown", "pointermove"].forEach((evt) =>
    window.addEventListener(evt, markActive, { passive: true }),
  );

  const beat = (sectionId: string) => {
    const idle = Date.now() - lastActivity > IDLE_AFTER_MINUTES * 60_000;
    if (document.visibilityState !== "visible" || idle) return;
    fetch("/api/study-sessions/heartbeat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sectionId }),
      keepalive: true,
    }).catch(() => {});
  };

  const stop = () => {
    if (timer) window.clearInterval(timer);
    timer = undefined;
  };

  const start = () => {
    stop();
    const sectionId = document.querySelector<HTMLElement>("[data-study-tracker]")?.dataset.sectionId;
    if (!sectionId) return;
    markActive();
    beat(sectionId);
    timer = window.setInterval(() => beat(sectionId), HEARTBEAT_INTERVAL_SECONDS * 1000);
  };

  document.addEventListener("astro:page-load", start);
  document.addEventListener("astro:before-swap", stop);
</script>
```

### 4.9 Páginas con datos reales

En `src/pages/cursos/[course]/[section].astro`:

```ts
import StudyTracker from "@/components/course/StudyTracker.astro";
import { getCourseReadIds } from "@/server/services/progress.service";

const user = Astro.locals.user!; // el middleware garantiza la sesión
const readIds = await getCourseReadIds(user.id, course.id);
```

y dentro del `<article>`, al final: `<StudyTracker sectionId={section.data.sectionId} />`.

En `src/pages/cursos/[course]/index.astro`, sustituye `const readIds: string[] = [];` por la misma llamada a `getCourseReadIds`.

### Notas de implementación (Tanda 4 ya ejecutada)

- `COURSE_ID_REGEX` y `SECTION_ID_REGEX` ya existían en `constants.ts` desde la Tanda 1; solo se añadió `IDLE_AFTER_MINUTES`.
- **Criterio del 404 corregido:** `B9.1` no tiene un formato válido (los cursos van de B1 a B8), así que la API responde `400`, que es lo correcto. Para el `404` se usa un identificador con formato válido de una sección que no existe, como `B2.1`.
- Verificado con dos usuarios reales contra Atlas (18 comprobaciones de API): idempotencia y fecha original, 8 `PUT` simultáneos → un documento, aislamiento entre usuarios y la regla de los 30 minutos de las sesiones (simulada moviendo `lastSeenAt`). En Chrome (13 comprobaciones), con reloj y temporizadores simulados: un solo intervalo tras navegar con View Transitions, sin latidos con la pestaña oculta o tras 5 min de inactividad, persistencia al recargar y *rollback* sin red.

### Criterios de aceptación — Tanda 4

- [ ] Marcar una sección crea **un** documento en `section_progress`; pulsar varias veces o en dos pestañas no crea duplicados.
- [ ] Desmarcar lo elimina. Al recargar, el estado del botón, del índice y del contador coincide con Mongo.
- [ ] Con la red desactivada (DevTools → *Offline*), el botón vuelve a su estado anterior y muestra el error.
- [ ] `PUT /api/progress/Z9.9` → `400`; `PUT /api/progress/B2.1` (formato válido, no existe) → `404`; sin sesión → `401`.
- [ ] Con dos usuarios distintos, cada uno ve solo su progreso.
- [ ] Al leer una sección durante 3 minutos se crea **una** sesión en `study_sessions` con `lastSeenAt` actualizado; tras 30 min sin latidos, el siguiente crea una sesión nueva.
- [ ] Con la pestaña oculta o sin interacción durante más de 5 min no se envían latidos (compruébalo en *Network*).
- [ ] Al navegar entre secciones con View Transitions no se acumulan intervalos (un único latido por minuto).
- [ ] `npm run check` y `npm run build` sin errores.

---

## Tanda 5 · Evaluaciones

| Dato | Valor |
|---|---|
| Objetivo | Evaluación de 5 preguntas al final del curso B1, corregida en servidor y guardada en `quiz_attempts`, con historial de intentos |
| Prerrequisitos | Tanda 4 |
| Rama | `tanda-5-evaluaciones` |

### 🔑 Variables de entorno que necesito de tu parte

| Variable | Ejemplo | Para qué |
|---|---|---|
| `APP_TIMEZONE` | `Europe/Madrid`, `America/Bogota`, `America/Mexico_City`… | Zona horaria IANA en la que se muestran fechas y se agrupan los días de estudio. Indica la tuya |

```js
// astro.config.mjs → env.schema
APP_TIMEZONE: envField.string({ context: "server", access: "public", default: "America/Mexico_City" }),
```

### 5.1 Reglas de la evaluación

| Regla | Valor |
|---|---|
| Preguntas | 5, de opción múltiple con 4 opciones y una sola correcta |
| Aprobado | `passingScore` del curso (por defecto 4/5) |
| Desbloqueo | Al marcar todas las secciones del curso como leídas (`QUIZ_REQUIRES_ALL_SECTIONS`) |
| Intentos | Ilimitados. **Cada intento se guarda.** El curso cuenta como aprobado si algún intento lo está |
| Seguridad | Las respuestas correctas y las explicaciones **no** se envían al navegador antes de corregir |

### 5.2 Archivos de esta Tanda

```
src/
├── content.config.ts                         (modificar: colección quizzes)
├── content/quizzes/b1.yaml                   (nuevo)
├── lib/
│   ├── domain/quiz.ts                        (nuevo: corrección pura)
│   ├── format.ts                             (nuevo: fechas en APP_TIMEZONE)
│   └── inline-code.tsx                       (nuevo: `código` en enunciados)
├── server/
│   ├── repositories/quiz-attempts.repo.ts    (nuevo)
│   ├── repositories/index.ts                 (modificar)
│   └── services/quiz.service.ts              (nuevo)
├── actions/index.ts                          (nuevo: submitQuiz)
├── components/quiz/Quiz.tsx                  (nuevo)
└── pages/cursos/[course]/
    ├── evaluacion.astro                      (nuevo)
    ├── index.astro                           (modificar: bloque de evaluación real)
    └── [section].astro                       (modificar: la última sección enlaza a la evaluación)
```

### 5.3 Colección `quizzes`

Añade a `src/content.config.ts`:

```ts
import { DEFAULT_PASSING_SCORE, QUIZ_QUESTIONS } from "@/lib/constants";

const quizzes = defineCollection({
  loader: glob({ pattern: "*.yaml", base: "./src/content/quizzes" }),
  schema: z.object({
    course: reference("courses"),
    passingScore: z.number().int().min(1).max(QUIZ_QUESTIONS).default(DEFAULT_PASSING_SCORE),
    questions: z
      .array(
        z.object({
          prompt: z.string(),
          code: z.string().optional(),
          options: z.array(z.string()).length(4),
          answer: z.number().int().min(0).max(3),
          explanation: z.string(),
        }),
      )
      .length(QUIZ_QUESTIONS),
  }),
});

export const collections = { courses, sections, quizzes };
```

### 5.4 `src/content/quizzes/b1.yaml` (evaluación completa de B1)

Cubre los 5 temas de la "Evaluación final B1" de `temario.md`.

```yaml
course: B1
passingScore: 4
questions:
  - prompt: "¿Qué tipo infiere TypeScript para la constante `tema`?"
    code: |
      const tema = "dark";
    options:
      - "string"
      - "\"dark\" (un tipo literal)"
      - "any"
      - "unknown"
    answer: 1
    explanation: "Con `const` el valor no puede cambiar, así que TypeScript infiere el tipo más preciso posible: el literal \"dark\". Con `let` inferiría `string`."

  - prompt: "¿Cuál es la diferencia principal entre `any` y `unknown`?"
    options:
      - "Ninguna: los dos aceptan cualquier valor y se pueden usar libremente."
      - "`any` solo acepta objetos y `unknown` solo acepta tipos primitivos."
      - "`unknown` acepta cualquier valor pero obliga a comprobar su tipo antes de usarlo; `any` desactiva las comprobaciones."
      - "`unknown` lanza un error en tiempo de ejecución si el tipo no coincide."
    answer: 2
    explanation: "`any` apaga el compilador para ese valor. `unknown` es su versión segura: acepta cualquier cosa, pero no te deja usarla hasta que la estrechas con `typeof`, `instanceof`, etc. Recuerda que los tipos no existen en tiempo de ejecución."

  - prompt: "¿Qué puede expresar un alias `type` que una `interface` no puede?"
    options:
      - "Una unión de tipos, como \"light\" | \"dark\"."
      - "Un objeto con propiedades opcionales."
      - "Una forma de objeto que extiende a otra."
      - "Un objeto con métodos."
    answer: 0
    explanation: "Las interfaces describen formas de objeto (y se pueden extender y fusionar). Las uniones, tuplas y tipos calculados solo se pueden nombrar con `type`."

  - prompt: "Dentro del `if`, ¿a qué propiedades de `r` puedes acceder sin error?"
    code: |
      type Resultado =
        | { ok: true; datos: string[] }
        | { ok: false; error: string };

      function mostrar(r: Resultado) {
        if (!r.ok) {
          // 👉 aquí
        }
      }
    options:
      - "Solo a `ok`."
      - "A `ok` y a `datos`."
      - "A `ok`, `datos` y `error`."
      - "A `ok` y a `error`."
    answer: 3
    explanation: "`ok` es el discriminante. Si `!r.ok`, TypeScript sabe que `ok` es `false` y estrecha `r` a la variante `{ ok: false; error: string }`."

  - prompt: "¿Qué ocurre al activar `\"strict\": true` en `tsconfig.json`?"
    options:
      - "El JavaScript compilado se ejecuta más rápido."
      - "Se activa un conjunto de comprobaciones más estrictas, como `strictNullChecks` y `noImplicitAny`."
      - "TypeScript valida en tiempo de ejecución los datos que llegan de las APIs."
      - "Se prohíbe usar archivos JavaScript dentro del proyecto."
    answer: 1
    explanation: "`strict` es un interruptor que activa varias opciones a la vez (`strictNullChecks`, `noImplicitAny`, `strictFunctionTypes`…). Detecta más errores al compilar; no cambia el rendimiento ni valida nada en ejecución."
```

### 5.5 Lógica pura: `src/lib/domain/quiz.ts`

```ts
export interface GradeResult {
  results: boolean[];
  score: number;
  total: number;
  passed: boolean;
}

export function gradeQuiz(answerKey: number[], answers: number[], passingScore: number): GradeResult {
  if (answers.length !== answerKey.length) {
    throw new Error(`Se esperaban ${answerKey.length} respuestas y llegaron ${answers.length}`);
  }
  const results = answerKey.map((correct, i) => answers[i] === correct);
  const score = results.filter(Boolean).length;
  return { results, score, total: answerKey.length, passed: score >= passingScore };
}
```

### 5.6 `src/lib/format.ts`

Solo se usa en servidor (páginas `.astro`).

```ts
import { APP_TIMEZONE } from "astro:env/server";

const dateTime = new Intl.DateTimeFormat("es", { dateStyle: "medium", timeStyle: "short", timeZone: APP_TIMEZONE });
const dateOnly = new Intl.DateTimeFormat("es", { dateStyle: "medium", timeZone: APP_TIMEZONE });
const dayKeyFmt = new Intl.DateTimeFormat("en-CA", { year: "numeric", month: "2-digit", day: "2-digit", timeZone: APP_TIMEZONE });

export const formatDateTime = (d: Date) => dateTime.format(d);
export const formatDate = (d: Date) => dateOnly.format(d);
/** "2026-10-02" en la zona horaria de la app (para agrupar por días) */
export const dayKey = (d: Date) => dayKeyFmt.format(d);
export const timezone = APP_TIMEZONE;

export function formatMinutes(total: number): string {
  if (total < 60) return `${total} min`;
  const h = Math.floor(total / 60);
  const m = total % 60;
  return m === 0 ? `${h} h` : `${h} h ${m} min`;
}
```

### 5.7 `src/lib/inline-code.tsx`

Convierte `` `texto` `` en `<code>` dentro de enunciados y opciones (sin usar HTML crudo).

```tsx
import { Fragment, type ReactNode } from "react";

export function renderInline(text: string): ReactNode {
  return text.split(/(`[^`]+`)/g).map((part, i) =>
    part.startsWith("`") && part.endsWith("`") ? (
      <code key={i} className="rounded bg-surface px-1 py-0.5 font-mono text-[0.9em]">
        {part.slice(1, -1)}
      </code>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  );
}
```

### 5.8 Repositorio y servicio

`src/server/repositories/quiz-attempts.repo.ts`:

```ts
import type { Db } from "mongodb";
import { COLLECTIONS, type QuizAttemptDoc } from "@/server/db-types";

export interface CourseQuizSummary {
  courseId: string;
  attempts: number;
  best: number;
  passed: boolean;
  lastScore: number;
  lastAt: Date;
}

export function createQuizAttemptsRepo(db: Db) {
  const col = db.collection<QuizAttemptDoc>(COLLECTIONS.quizAttempts);

  return {
    async insert(attempt: QuizAttemptDoc) {
      await col.insertOne(attempt);
    },

    async listByCourse(userId: string, courseId: string, limit = 5): Promise<QuizAttemptDoc[]> {
      return col.find({ userId, courseId }).sort({ submittedAt: -1 }).limit(limit).toArray();
    },

    async recent(userId: string, limit = 20): Promise<QuizAttemptDoc[]> {
      return col.find({ userId }).sort({ submittedAt: -1 }).limit(limit).toArray();
    },

    /** Resumen por curso: nº de intentos, mejor nota, si alguna vez aprobó y último intento */
    async summaryByCourse(userId: string): Promise<Record<string, CourseQuizSummary>> {
      const rows = await col
        .aggregate<CourseQuizSummary & { _id: string }>([
          { $match: { userId } },
          { $sort: { submittedAt: -1 } },
          {
            $group: {
              _id: "$courseId",
              attempts: { $sum: 1 },
              best: { $max: "$score" },
              passed: { $max: "$passed" }, // true > false en el orden BSON
              lastScore: { $first: "$score" },
              lastAt: { $first: "$submittedAt" },
            },
          },
        ])
        .toArray();
      return Object.fromEntries(rows.map(({ _id, ...r }) => [_id, { ...r, courseId: _id }]));
    },
  };
}
```

Registra el repositorio en `src/server/repositories/index.ts`: `quizAttempts: createQuizAttemptsRepo(db)`.

`src/server/services/quiz.service.ts`:

```ts
import { getCollection, type CollectionEntry } from "astro:content";
import { QUIZ_REQUIRES_ALL_SECTIONS } from "@/lib/constants";
import { getCourseSections } from "@/lib/content";
import { gradeQuiz } from "@/lib/domain/quiz";
import { ForbiddenError, NotFoundError } from "@/lib/errors";
import { repos } from "@/server/repositories";

export type Quiz = CollectionEntry<"quizzes">;
export interface PublicQuestion {
  prompt: string;
  code?: string;
  options: string[];
}
export interface QuestionReview {
  correctAnswer: number;
  explanation: string;
  isCorrect: boolean;
}

export async function getQuizByCourseId(courseId: string): Promise<Quiz | undefined> {
  const [quiz] = await getCollection("quizzes", (q) => q.data.course.id === courseId);
  return quiz;
}

/** Lo único que viaja al navegador antes de corregir */
export function toPublicQuestions(quiz: Quiz): PublicQuestion[] {
  return quiz.data.questions.map(({ prompt, code, options }) => ({ prompt, code, options }));
}

export async function getQuizAccess(userId: string, courseId: string) {
  const sections = await getCourseSections(courseId);
  const read = new Set(await repos.progress.readSectionIds(userId, courseId));
  const pending = sections.filter((s) => !read.has(s.data.sectionId));
  return {
    unlocked: !QUIZ_REQUIRES_ALL_SECTIONS || pending.length === 0,
    remaining: pending.length,
    firstPending: pending[0],
  };
}

export async function submitQuiz(userId: string, courseId: string, answers: number[]) {
  const quiz = await getQuizByCourseId(courseId);
  if (!quiz) throw new NotFoundError("Este curso no tiene evaluación");

  const access = await getQuizAccess(userId, courseId);
  if (!access.unlocked) throw new ForbiddenError(`Te faltan ${access.remaining} secciones por leer`);

  const { questions, passingScore } = quiz.data;
  const grade = gradeQuiz(questions.map((q) => q.answer), answers, passingScore);

  await repos.quizAttempts.insert({ userId, courseId, answers, ...grade, submittedAt: new Date() });

  const review: QuestionReview[] = questions.map((q, i) => ({
    correctAnswer: q.answer,
    explanation: q.explanation,
    isCorrect: grade.results[i] ?? false,
  }));

  return { score: grade.score, total: grade.total, passed: grade.passed, passingScore, review };
}

export type SubmitQuizResult = Awaited<ReturnType<typeof submitQuiz>>;
```

### 5.9 Astro Action: `src/actions/index.ts`

```ts
import { ActionError, defineAction, type ActionErrorCode } from "astro:actions";
import { z } from "astro/zod";
import { COURSE_ID_REGEX, QUIZ_QUESTIONS } from "@/lib/constants";
import { HttpError } from "@/lib/errors";
import { submitQuiz } from "@/server/services/quiz.service";

const codeFor = (status: number): ActionErrorCode =>
  ({ 400: "BAD_REQUEST", 401: "UNAUTHORIZED", 403: "FORBIDDEN", 404: "NOT_FOUND", 429: "TOO_MANY_REQUESTS" } as const)[
    status as 400 | 401 | 403 | 404 | 429
  ] ?? "INTERNAL_SERVER_ERROR";

export const server = {
  submitQuiz: defineAction({
    input: z.object({
      courseId: z.string().regex(COURSE_ID_REGEX),
      answers: z.array(z.number().int().min(0).max(3)).length(QUIZ_QUESTIONS),
    }),
    handler: async ({ courseId, answers }, ctx) => {
      const user = ctx.locals.user;
      if (!user) throw new ActionError({ code: "UNAUTHORIZED", message: "Inicia sesión para enviar la evaluación" });
      try {
        return await submitQuiz(user.id, courseId, answers);
      } catch (error) {
        if (error instanceof HttpError) throw new ActionError({ code: codeFor(error.status), message: error.message });
        throw error;
      }
    },
  }),
};
```

### 5.10 `src/components/quiz/Quiz.tsx`

Una pregunta por pantalla (lectura sin distracciones), estado con `useReducer` (temario I2.3). El *reducer* se exporta para testearlo en la Tanda 9.

```tsx
import { useReducer } from "react";
import { actions } from "astro:actions";
import { cn } from "@/lib/cn";
import { renderInline } from "@/lib/inline-code";
import type { PublicQuestion, SubmitQuizResult } from "@/server/services/quiz.service";

type Answers = (number | null)[];

export type QuizState =
  | { status: "answering"; step: number; answers: Answers; error?: string }
  | { status: "submitting"; step: number; answers: Answers }
  | { status: "done"; answers: number[]; result: SubmitQuizResult };

export type QuizAction =
  | { type: "select"; option: number }
  | { type: "go"; step: number }
  | { type: "submit" }
  | { type: "failed"; error: string }
  | { type: "graded"; result: SubmitQuizResult }
  | { type: "reset"; count: number };

export const initialQuizState = (count: number): QuizState => ({
  status: "answering",
  step: 0,
  answers: Array<number | null>(count).fill(null),
});

export function quizReducer(state: QuizState, action: QuizAction): QuizState {
  switch (action.type) {
    case "select":
      if (state.status !== "answering") return state;
      return { ...state, error: undefined, answers: state.answers.map((a, i) => (i === state.step ? action.option : a)) };
    case "go":
      if (state.status !== "answering") return state;
      return { ...state, step: Math.max(0, Math.min(action.step, state.answers.length - 1)) };
    case "submit":
      if (state.status !== "answering" || state.answers.some((a) => a === null)) return state;
      return { status: "submitting", step: state.step, answers: state.answers };
    case "failed":
      if (state.status !== "submitting") return state;
      return { status: "answering", step: state.step, answers: state.answers, error: action.error };
    case "graded":
      if (state.status !== "submitting") return state;
      return { status: "done", answers: state.answers as number[], result: action.result };
    case "reset":
      return initialQuizState(action.count);
  }
}

interface Props {
  courseId: string;
  courseHref: string;
  questions: PublicQuestion[];
}

const LETTERS = ["A", "B", "C", "D"];

export default function Quiz({ courseId, courseHref, questions }: Props) {
  const [state, dispatch] = useReducer(quizReducer, questions.length, initialQuizState);

  async function submit() {
    if (state.status !== "answering" || state.answers.some((a) => a === null)) return;
    const answers = state.answers as number[];
    dispatch({ type: "submit" });
    const { data, error } = await actions.submitQuiz({ courseId, answers });
    if (error) dispatch({ type: "failed", error: error.message });
    else dispatch({ type: "graded", result: data });
  }

  if (state.status === "done") {
    const { result, answers } = state;
    return (
      <section aria-labelledby="quiz-result" className="space-y-8">
        <div className={cn("rounded-2xl border p-6", result.passed ? "border-accent/50 bg-accent/10" : "border-warning/50 bg-warning/10")}>
          <h2 id="quiz-result" className="font-serif text-2xl font-semibold">
            {result.passed ? "¡Aprobado!" : "Aún no"} · {result.score}/{result.total}
          </h2>
          <p className="mt-2 text-sm text-muted">
            {result.passed
              ? "Has superado la evaluación de este curso. El resultado se ha guardado en tu progreso."
              : `Necesitas ${result.passingScore}/${result.total}. Repasa las explicaciones y vuelve a intentarlo.`}
          </p>
        </div>

        <ol className="space-y-6">
          {questions.map((q, i) => {
            const review = result.review[i]!;
            return (
              <li key={i} className="rounded-2xl border border-surface-2 p-5">
                <p className="text-xs font-medium tracking-wider text-muted uppercase">
                  Pregunta {i + 1} · {review.isCorrect ? "Correcta" : "Incorrecta"}
                </p>
                <p className="mt-2 font-serif text-lg">{renderInline(q.prompt)}</p>
                <p className="mt-3 text-sm">
                  Tu respuesta: <strong>{renderInline(q.options[answers[i]!]!)}</strong>
                </p>
                {!review.isCorrect && (
                  <p className="mt-1 text-sm">
                    Correcta: <strong className="text-accent-strong">{renderInline(q.options[review.correctAnswer]!)}</strong>
                  </p>
                )}
                <p className="mt-3 border-l-2 border-accent pl-3 font-serif text-muted">{renderInline(review.explanation)}</p>
              </li>
            );
          })}
        </ol>

        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={() => dispatch({ type: "reset", count: questions.length })} className="rounded-xl bg-surface px-5 py-2.5 text-sm font-semibold ring-1 ring-surface-2 ring-inset hover:bg-surface-2">
            Reintentar
          </button>
          <a href={courseHref} className="rounded-xl bg-accent-strong px-5 py-2.5 text-sm font-semibold text-accent-contrast hover:opacity-90">
            Volver al curso
          </a>
        </div>
      </section>
    );
  }

  const { step, answers } = state;
  const question = questions[step]!;
  const isLast = step === questions.length - 1;
  const answeredCount = answers.filter((a) => a !== null).length;
  const submitting = state.status === "submitting";

  return (
    <section aria-labelledby="quiz-question" className="space-y-6">
      <div className="flex items-center justify-between text-sm text-muted">
        <span>Pregunta {step + 1} de {questions.length}</span>
        <span>{answeredCount}/{questions.length} respondidas</span>
      </div>

      <fieldset disabled={submitting} className="space-y-4">
        <legend id="quiz-question" className="font-serif text-xl leading-snug font-medium">
          {renderInline(question.prompt)}
        </legend>
        {question.code && (
          <pre className="overflow-x-auto rounded-xl border border-surface-2 bg-surface p-4 font-mono text-sm leading-relaxed">
            <code>{question.code}</code>
          </pre>
        )}
        <div className="space-y-2" role="radiogroup">
          {question.options.map((option, i) => (
            <label
              key={i}
              className={cn(
                "flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors",
                answers[step] === i ? "border-accent bg-accent/10" : "border-surface-2 hover:bg-surface",
              )}
            >
              <input
                type="radio"
                name={`q-${step}`}
                className="mt-1 accent-[var(--accent-strong)]"
                checked={answers[step] === i}
                onChange={() => dispatch({ type: "select", option: i })}
              />
              <span>
                <span className="mr-2 font-semibold text-muted">{LETTERS[i]}.</span>
                {renderInline(option)}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      {state.status === "answering" && state.error && (
        <p role="alert" className="rounded-xl border border-danger/50 bg-danger/10 px-4 py-3 text-sm text-danger-strong">
          {state.error}
        </p>
      )}

      <div className="flex items-center justify-between gap-3">
        <button type="button" disabled={step === 0 || submitting} onClick={() => dispatch({ type: "go", step: step - 1 })} className="rounded-xl px-4 py-2.5 text-sm font-medium text-muted hover:bg-surface disabled:opacity-40">
          ← Anterior
        </button>
        {isLast ? (
          <button type="button" disabled={answeredCount < questions.length || submitting} onClick={submit} className="rounded-xl bg-accent-strong px-5 py-2.5 text-sm font-semibold text-accent-contrast hover:opacity-90 disabled:opacity-50">
            {submitting ? "Corrigiendo…" : "Enviar respuestas"}
          </button>
        ) : (
          <button type="button" disabled={answers[step] === null} onClick={() => dispatch({ type: "go", step: step + 1 })} className="rounded-xl bg-accent-strong px-5 py-2.5 text-sm font-semibold text-accent-contrast hover:opacity-90 disabled:opacity-50">
            Siguiente →
          </button>
        )}
      </div>
    </section>
  );
}
```

> `Quiz.tsx` importa solo **tipos** de `quiz.service.ts`; los tipos desaparecen al compilar, así que no se arrastra código de servidor al navegador. Usa `import type` para garantizarlo.

### 5.11 `src/pages/cursos/[course]/evaluacion.astro`

```astro
---
import CourseLayout from "@/layouts/CourseLayout.astro";
import Badge from "@/components/ui/Badge.astro";
import ButtonLink from "@/components/ui/ButtonLink.astro";
import Quiz from "@/components/quiz/Quiz";
import { courseUrl, getCourseBySlug, getCourseSections, sectionUrl } from "@/lib/content";
import { formatDateTime } from "@/lib/format";
import { repos } from "@/server/repositories";
import { getCourseReadIds } from "@/server/services/progress.service";
import { getQuizAccess, getQuizByCourseId, toPublicQuestions } from "@/server/services/quiz.service";

const user = Astro.locals.user!;
const course = await getCourseBySlug(Astro.params.course ?? "");
if (!course?.data.published) return Astro.rewrite("/404");

const quiz = await getQuizByCourseId(course.id);
if (!quiz) return Astro.rewrite("/404");

const [sections, readIds, access, history] = await Promise.all([
  getCourseSections(course.id),
  getCourseReadIds(user.id, course.id),
  getQuizAccess(user.id, course.id),
  repos.quizAttempts.listByCourse(user.id, course.id, 5),
]);
const { passingScore, questions } = quiz.data;
---

<CourseLayout title={`Evaluación · ${course.data.title}`} course={course} sections={sections} readIds={readIds} current="quiz" quizAvailable>
  <div class="mx-auto max-w-[68ch]">
    <header class="mb-10">
      <p class="text-sm text-muted"><span class="font-semibold text-accent-strong">{course.id}</span> · Evaluación final</p>
      <h1 class="mt-3 font-serif text-3xl font-semibold tracking-tight sm:text-4xl">{course.data.title}</h1>
      <p class="mt-4 font-serif text-lg text-muted">
        {questions.length} preguntas. Se aprueba con {passingScore}/{questions.length}. Puedes repetirla las veces que quieras; cada intento se guarda en tu progreso.
      </p>
    </header>

    {
      access.unlocked ? (
        <Quiz client:load courseId={course.id} courseHref={courseUrl(course)} questions={toPublicQuestions(quiz)} />
      ) : (
        <div class="rounded-2xl border border-warning/50 bg-warning/10 p-6">
          <h2 class="font-serif text-xl font-semibold">Evaluación bloqueada</h2>
          <p class="mt-2 text-sm text-muted">
            Te {access.remaining === 1 ? "falta 1 sección" : `faltan ${access.remaining} secciones`} por marcar como leída.
          </p>
          {access.firstPending && <ButtonLink href={sectionUrl(course, access.firstPending)} class="mt-4">Ir a la siguiente sección →</ButtonLink>}
        </div>
      )
    }

    {
      history.length > 0 && (
        <section aria-labelledby="intentos" class="mt-16">
          <h2 id="intentos" class="font-serif text-xl font-semibold">Tus últimos intentos</h2>
          <table class="mt-4 w-full text-left text-sm">
            <thead class="text-muted">
              <tr><th class="py-2 font-medium">Fecha</th><th class="py-2 font-medium">Nota</th><th class="py-2 font-medium">Resultado</th></tr>
            </thead>
            <tbody class="divide-y divide-surface-2">
              {history.map((a) => (
                <tr>
                  <td class="py-3">{formatDateTime(a.submittedAt)}</td>
                  <td class="py-3 tabular-nums">{a.score}/{a.total}</td>
                  <td class="py-3">{a.passed ? <Badge tone="accent">Aprobado</Badge> : <Badge tone="warning">No aprobado</Badge>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )
    }
  </div>
</CourseLayout>
```

### 5.12 Cambios en páginas existentes

- **`[section].astro`**: si no hay sección siguiente y el curso tiene evaluación, el enlace final es `{ href: \`${courseUrl(course)}/evaluacion\`, title: "Evaluación final · 5 preguntas", label: "Siguiente" }`. Pasa `quizAvailable={Boolean(quiz)}` a `CourseLayout`.
- **`index.astro` (portada)**: sustituye el bloque "Próximamente" por uno con tres estados, usando `getQuizAccess` y `repos.quizAttempts.listByCourse(user.id, course.id, 20)`:
  - **Bloqueada** → `Badge tone="neutral"` "Bloqueada" + "Te faltan N secciones".
  - **Disponible** → `Badge tone="info"` "Disponible" + botón "Hacer la evaluación".
  - **Aprobada** → `Badge tone="accent"` "Aprobada · mejor nota X/5" + botón secundario "Repetir".
- Pasa `quizAvailable` también a `CourseLayout` en la portada.

### Notas de implementación (Tanda 5 ya ejecutada)

- **Accesibilidad del cuestionario:** el enunciado es un `<h2>` (con `tabIndex={-1}`) en lugar de un `<legend>`, y al cambiar de pregunta o mostrar el resultado el foco pasa a ese título. Así el lector de pantalla anuncia cada pregunta nueva y el teclado no se queda en un botón que desaparece. El `fieldset` conserva un `<legend>` oculto ("Pregunta N"). Las opciones muestran el foco del teclado con `has-[:focus-visible]`.
- **Portada:** el bloque de evaluación tiene cuatro estados (sin evaluación, bloqueada, disponible —con la mejor nota si ya hubo intentos— y aprobada) y lee hasta 50 intentos para calcular la mejor nota.
- **Mapa de errores de la Action:** `STATUS_TO_CODE` (objeto) en lugar de la expresión del plan; mismo comportamiento.
- Verificado: el HTML, las *props* de la isla y el JavaScript del cliente no contienen `answer` ni el texto de las explicaciones (las *props* solo llevan `prompt`, `code` y `options`). 26 comprobaciones en Chrome (bloqueo y desbloqueo, navegación, corrección 3/5 y 5/5, revisión, reintento, historial, estados de la portada y errores 400/401/403/404 de la Action). Lighthouse con sesión iniciada y compresión brotli: rendimiento 100 y accesibilidad 100 en la evaluación, en claro y en oscuro.
- **Medir rendimiento siempre con compresión** (Vercel usa brotli): sin ella, la evaluación baja a ~81 por los ~300 KB de JavaScript sin comprimir (React se carga desde el inicio porque el cuestionario es `client:load`).

### Criterios de aceptación — Tanda 5

- [ ] Con secciones sin leer, `/cursos/typescript-desde-cero/evaluacion` muestra "Evaluación bloqueada" con el número correcto y un enlace a la primera pendiente.
- [ ] Con todo leído, se muestran las 5 preguntas de una en una; "Siguiente" exige elegir una opción y "Enviar" exige las 5.
- [ ] En el código fuente de la página (Ver código fuente / *props* de la isla) **no** aparecen `answer` ni `explanation`.
- [ ] Al enviar se crea un documento en `quiz_attempts` con `answers`, `results`, `score`, `passed` y `submittedAt`.
- [ ] La pantalla de resultado muestra la nota, aprobado/no aprobado, la respuesta correcta y la explicación de cada pregunta.
- [ ] "Reintentar" reinicia el cuestionario; un segundo intento crea otro documento.
- [ ] El historial muestra los últimos intentos con la fecha en `APP_TIMEZONE`.
- [ ] Llamar a la acción con `answers` de longitud 4, con un `courseId` inválido o sin sesión devuelve un error controlado (no 500).
- [ ] La portada del curso refleja el estado de la evaluación (bloqueada / disponible / aprobada).
- [ ] `npm run check` y `npm run build` sin errores.

---

## Tanda 6 · Índice del temario

| Dato | Valor |
|---|---|
| Objetivo | Página `/temario` con los 24 cursos agrupados por nivel, su estado para el usuario y un acceso "Continuar donde lo dejaste". Al hacer clic en un curso publicado se abre su portada |
| Prerrequisitos | Tanda 5 |
| Variables de entorno | **Ninguna nueva** |
| Rama | `tanda-6-temario` |

### 6.1 Archivos de esta Tanda

```
src/
├── server/services/overview.service.ts       (nuevo)
├── components/
│   ├── layout/MainNav.astro                  (nuevo)
│   ├── layout/SiteHeader.astro               (modificar: incluye MainNav)
│   └── syllabus/
│       ├── ContinueBanner.astro              (nuevo)
│       ├── CourseCard.astro                  (nuevo)
│       └── LevelSection.astro                (nuevo)
├── layouts/CourseLayout.astro                (modificar: miga "Temario" con href)
└── pages/
    ├── index.astro                           (modificar: redirige a /temario)
    └── temario.astro                         (nuevo)
```

### 6.2 `src/server/services/overview.service.ts`

```ts
import { courseUrl, getCourseSections, getCourses, sectionUrl, type Course, type Section } from "@/lib/content";
import { courseStatus, percent, type CourseStatus } from "@/lib/domain/progress";
import { repos } from "@/server/repositories";
import type { CourseQuizSummary } from "@/server/repositories/quiz-attempts.repo";
import { getQuizByCourseId } from "./quiz.service";

export type OverviewStatus = CourseStatus | "unpublished";

export interface CourseOverview {
  course: Course;
  href: string | null; // null si el curso no está publicado
  totalSections: number;
  readCount: number;
  percent: number;
  status: OverviewStatus;
  hasQuiz: boolean;
  quiz: CourseQuizSummary | null;
  nextSection: Section | null; // primera sección sin leer
}

export async function getSyllabusOverview(userId: string): Promise<CourseOverview[]> {
  const [courses, readIds, quizSummary] = await Promise.all([
    getCourses(),
    repos.progress.allReadSectionIds(userId),
    repos.quizAttempts.summaryByCourse(userId),
  ]);
  const read = new Set(readIds);

  return Promise.all(
    courses.map(async (course): Promise<CourseOverview> => {
      if (!course.data.published) {
        return {
          course, href: null, totalSections: course.data.plannedSections, readCount: 0, percent: 0,
          status: "unpublished", hasQuiz: false, quiz: null, nextSection: null,
        };
      }
      const [sections, quizEntry] = await Promise.all([getCourseSections(course.id), getQuizByCourseId(course.id)]);
      const readCount = sections.filter((s) => read.has(s.data.sectionId)).length;
      const quiz = quizSummary[course.id] ?? null;
      return {
        course,
        href: courseUrl(course),
        totalSections: sections.length,
        readCount,
        percent: percent(readCount, sections.length),
        status: courseStatus(readCount, sections.length, quiz?.passed ?? false),
        hasQuiz: Boolean(quizEntry),
        quiz,
        nextSection: sections.find((s) => !read.has(s.data.sectionId)) ?? null,
      };
    }),
  );
}

export interface ContinueTarget {
  href: string;
  title: string;
  detail: string;
}

/** Decide a dónde lleva "Continuar": último curso tocado → primer curso sin completar → nada */
export function getContinueTarget(overview: CourseOverview[], lastCourseId?: string): ContinueTarget | null {
  const targetFor = (item: CourseOverview): ContinueTarget | null => {
    if (!item.href || item.status === "completed") return null;
    if (item.nextSection) {
      return {
        href: sectionUrl(item.course, item.nextSection),
        title: item.nextSection.data.title,
        detail: `${item.course.id} · ${item.course.data.title} · Sección ${item.nextSection.data.order} de ${item.totalSections}`,
      };
    }
    if (item.hasQuiz) {
      return { href: `${item.href}/evaluacion`, title: "Evaluación final", detail: `${item.course.id} · ${item.course.data.title}` };
    }
    return null;
  };

  const last = overview.find((o) => o.course.id === lastCourseId);
  const fromLast = last && targetFor(last);
  if (fromLast) return fromLast;

  for (const item of overview) {
    const target = targetFor(item);
    if (target) return target;
  }
  return null;
}
```

### 6.3 Navegación principal

`src/components/layout/MainNav.astro`:

```astro
---
const links = [
  { href: "/temario", label: "Temario" },
  // { href: "/progreso", label: "Progreso" },  ← se activa en la Tanda 7
];
const path = Astro.url.pathname;
---

{
  Astro.locals.user && (
    <nav aria-label="Principal" class="flex items-center gap-1">
      {links.map((l) => (
        <a
          href={l.href}
          aria-current={path === l.href || path.startsWith(`${l.href}/`) ? "page" : undefined}
          class="rounded-lg px-3 py-1.5 text-sm text-muted transition-colors hover:bg-surface hover:text-fg aria-[current=page]:font-medium aria-[current=page]:text-fg"
        >
          {l.label}
        </a>
      ))}
    </nav>
  )
}
```

En `SiteHeader.astro`, coloca `<MainNav />` al principio de `<div class="ml-auto …">`. En `CourseLayout.astro`, la miga pasa a `{ label: "Temario", href: "/temario" }`. En `src/pages/index.astro`: `return Astro.redirect("/temario");`.

### 6.4 Componentes del temario

`src/components/syllabus/CourseCard.astro`:

```astro
---
import Badge from "@/components/ui/Badge.astro";
import ProgressBar from "@/components/ui/ProgressBar.astro";
import type { CourseOverview, OverviewStatus } from "@/server/services/overview.service";

interface Props {
  item: CourseOverview;
}
const { item } = Astro.props;
const { course, href, readCount, totalSections, status, quiz } = item;

const STATUS: Record<OverviewStatus, { label: string; tone: "neutral" | "accent" | "info" | "warning" }> = {
  "not-started": { label: "Sin empezar", tone: "neutral" },
  "in-progress": { label: "En curso", tone: "info" },
  read: { label: "Falta la evaluación", tone: "warning" },
  completed: { label: "Completado", tone: "accent" },
  unpublished: { label: "Próximamente", tone: "neutral" },
};
const meta = STATUS[status];
const Tag = href ? "a" : "div";
---

<Tag
  href={href ?? undefined}
  aria-disabled={href ? undefined : "true"}
  class:list={[
    "flex h-full flex-col rounded-2xl border border-surface-2 p-5 transition",
    href ? "hover:border-accent hover:bg-surface/60" : "opacity-60",
  ]}
>
  <div class="flex items-center justify-between gap-2">
    <span class="text-xs font-semibold tracking-wider text-muted uppercase">{course.id}</span>
    <Badge tone={meta.tone}>{meta.label}</Badge>
  </div>
  <h3 class="mt-3 font-serif text-lg leading-snug font-semibold">{course.data.title}</h3>
  <p class="mt-2 line-clamp-2 text-sm text-muted">{course.data.objective}</p>

  <div class="mt-auto pt-5">
    <div class="mb-2 flex justify-between text-xs text-muted tabular-nums">
      <span>{href ? `${readCount}/${totalSections} secciones` : `${totalSections} secciones`}</span>
      {quiz && <span>Mejor nota {quiz.best}/5</span>}
    </div>
    {href && <ProgressBar value={readCount} max={totalSections} label={`Progreso de ${course.data.title}`} />}
  </div>
</Tag>
```

`src/components/syllabus/LevelSection.astro`:

```astro
---
import CourseCard from "./CourseCard.astro";
import type { CourseOverview } from "@/server/services/overview.service";

interface Props {
  id: string;
  title: string;
  description: string;
  items: CourseOverview[];
}
const { id, title, description, items } = Astro.props;
const completed = items.filter((i) => i.status === "completed").length;
---

<section aria-labelledby={id} class="mt-14">
  <div class="flex flex-wrap items-end justify-between gap-2 border-b border-surface-2 pb-3">
    <div>
      <h2 id={id} class="font-serif text-2xl font-semibold tracking-tight">{title}</h2>
      <p class="mt-1 text-sm text-muted">{description}</p>
    </div>
    <p class="text-sm text-muted tabular-nums">{completed} de {items.length} completados</p>
  </div>
  <ul class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
    {items.map((item) => <li><CourseCard item={item} /></li>)}
  </ul>
</section>
```

`src/components/syllabus/ContinueBanner.astro`:

```astro
---
import type { ContinueTarget } from "@/server/services/overview.service";
interface Props {
  target: ContinueTarget;
}
const { target } = Astro.props;
---

<a href={target.href} class="mt-8 flex items-center justify-between gap-6 rounded-2xl bg-accent-strong p-6 text-accent-contrast transition hover:opacity-95">
  <div class="min-w-0">
    <p class="text-xs font-semibold tracking-wider uppercase opacity-80">Continuar donde lo dejaste</p>
    <p class="mt-1 truncate font-serif text-xl font-semibold">{target.title}</p>
    <p class="mt-1 truncate text-sm opacity-80">{target.detail}</p>
  </div>
  <span aria-hidden="true" class="text-2xl">→</span>
</a>
```

### 6.5 `src/pages/temario.astro`

```astro
---
import BaseLayout from "@/layouts/BaseLayout.astro";
import SiteHeader from "@/components/layout/SiteHeader.astro";
import ContinueBanner from "@/components/syllabus/ContinueBanner.astro";
import LevelSection from "@/components/syllabus/LevelSection.astro";
import { LEVELS, type Level } from "@/lib/constants";
import { repos } from "@/server/repositories";
import { getContinueTarget, getSyllabusOverview } from "@/server/services/overview.service";

const user = Astro.locals.user!;
const [overview, lastRead] = await Promise.all([getSyllabusOverview(user.id), repos.progress.lastRead(user.id)]);
const target = getContinueTarget(overview, lastRead?.courseId);

const DESCRIPTIONS: Record<Level, string> = {
  basic: "Entender las piezas que ya usas en lugar de copiarlas.",
  intermediate: "Pasar de usar a diseñar: backend, datos, auth, servidores y tests.",
  advanced: "Operar tus propios sistemas: tipos expresivos, SQL, VPS, seguridad y CI/CD.",
  final: "Construir una aplicación completa aplicando todo lo aprendido.",
};

const groups = (Object.keys(LEVELS) as Level[])
  .sort((a, b) => LEVELS[a].order - LEVELS[b].order)
  .map((level) => ({ level, items: overview.filter((o) => o.course.data.level === level) }))
  .filter((g) => g.items.length > 0);
---

<BaseLayout title="Temario">
  <SiteHeader />
  <main id="contenido" class="mx-auto max-w-6xl px-4 py-12 lg:px-6">
    <header class="max-w-[68ch]">
      <h1 class="font-serif text-4xl font-semibold tracking-tight">Hola, {user.name.split(" ")[0]}</h1>
      <p class="mt-3 font-serif text-lg text-muted">
        Tu temario: {overview.length} cursos en tres niveles y un proyecto final. Cada sección es una sesión de unos 60 minutos.
      </p>
    </header>

    {target && <ContinueBanner target={target} />}

    {groups.map((g) => <LevelSection id={`nivel-${g.level}`} title={LEVELS[g.level].label} description={DESCRIPTIONS[g.level]} items={g.items} />)}
  </main>
</BaseLayout>
```

### Notas de implementación (Tanda 6 ya ejecutada)

- **`src/lib/status.ts` se crea ya en esta Tanda** (el plan lo dejaba para la 7): `CourseCard` usa el mapa `COURSE_STATUS` y la página de progreso lo reutilizará.
- **Banner "Continuar" sin `opacity-80`:** el texto blanco al 80 % sobre `--accent-strong` quedaba en 4,13:1 (no llega a AA). Ahora usa el color completo (5,47:1) y el título y el detalle pasan a otra línea en lugar de cortarse con `truncate` (en móvil se perdía "Sección N de 8").
- El saludo usa solo el primer nombre (`Hola, Dani`).
- Verificado: 23 comprobaciones en Chrome con un usuario nuevo que recorre los cuatro estados de B1 (incluido un intento suspendido que muestra "Mejor nota 1/5" sin completar el curso), el banner con lecturas fuera de orden, la miga "Temario" y la rejilla 1/2/3 columnas. Lighthouse con sesión: rendimiento 99 y accesibilidad 100 en claro y en oscuro.

### Criterios de aceptación — Tanda 6

- [ ] Tras iniciar sesión, `/` lleva a `/temario`.
- [ ] Se ven 4 grupos (Básico 7, Intermedio 8, Avanzado 8, Proyecto final 1) en el orden de `courses.json`.
- [ ] B1 es un enlace a su portada; los cursos no publicados se ven atenuados, con "Próximamente", y **no** son enlaces.
- [ ] El estado de B1 cambia según el progreso: Sin empezar → En curso → Falta la evaluación → Completado; muestra "Mejor nota X/5" si hay intentos.
- [ ] "Continuar donde lo dejaste" lleva a la primera sección sin leer del último curso tocado; si todo está leído, a la evaluación; si el curso está completado, desaparece (o apunta al siguiente curso publicado).
- [ ] La miga "Temario" del curso enlaza a `/temario` y el enlace "Temario" de la cabecera se marca como actual.
- [ ] Rejilla de 1 columna en móvil, 2 en tablet y 3 en escritorio.
- [ ] `npm run check` y `npm run build` sin errores.

---

## Tanda 7 · Página de progreso

| Dato | Valor |
|---|---|
| Objetivo | Página `/progreso` con resumen, avance por curso, resultados de exámenes, sesiones de estudio y actividad de las últimas 12 semanas |
| Prerrequisitos | Tanda 6 |
| Variables de entorno | **Ninguna nueva** (usa `APP_TIMEZONE` de la Tanda 5) |
| Rama | `tanda-7-progreso` |

### 7.1 Contenido de la página

```
┌────────────────────────────────────────────────────────────────────┐
│ Tu progreso                                                        │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐                │
│ │ 38 %     │ │ 2 / 3    │ │ 4,5 / 5  │ │ 6 h 40m  │                │
│ │ avance   │ │ cursos   │ │ media    │ │ estudio  │                │
│ │ 17/45 s. │ │ complet. │ │ exámenes │ │ 9 sesion.│                │
│ └──────────┘ └──────────┘ └──────────┘ └──────────┘                │
│ Racha: 4 días (récord 9)                                           │
│                                                                    │
│ Actividad (12 semanas)    ▢▢▣▣▢▣■ … (heatmap L-D)                   │
│                                                                    │
│ Avance por curso          B1 ▓▓▓▓▓▓▓▓ 8/8  Completado              │
│                           B2 ▓▓░░░░░░ 1/4  En curso                │
│                                                                    │
│ Resultados de exámenes    Fecha · Curso · Nota · Resultado         │
│                                                                    │
│ Sesiones recientes        2 oct, 18:05 · 52 min · 3 secciones (B1) │
└────────────────────────────────────────────────────────────────────┘
```

### 7.2 Archivos de esta Tanda

```
src/
├── lib/domain/
│   ├── streak.ts                              (nuevo)
│   └── heatmap.ts                             (nuevo)
├── server/
│   ├── repositories/study-sessions.repo.ts    (modificar: totales y actividad por día)
│   └── services/stats.service.ts              (nuevo)
├── components/progress/
│   ├── StatCard.astro                         (nuevo)
│   ├── ActivityHeatmap.astro                  (nuevo)
│   ├── CourseProgressList.astro               (nuevo)
│   ├── QuizHistoryTable.astro                 (nuevo)
│   └── SessionsList.astro                     (nuevo)
├── components/layout/MainNav.astro            (modificar: activa "Progreso")
└── pages/progreso.astro                       (nuevo)
```

### 7.3 Lógica pura

`src/lib/domain/streak.ts`:

```ts
const shift = (day: string, n: number): string => {
  const d = new Date(`${day}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
};

/**
 * days: claves "YYYY-MM-DD" con estudio (en la zona de la app).
 * La racha actual cuenta hasta hoy, o hasta ayer si hoy todavía no has estudiado.
 */
export function computeStreak(days: string[], today: string): { current: number; longest: number } {
  const set = new Set(days);

  let current = 0;
  let cursor = set.has(today) ? today : shift(today, -1);
  while (set.has(cursor)) {
    current++;
    cursor = shift(cursor, -1);
  }

  let longest = 0;
  for (const day of set) {
    if (set.has(shift(day, -1))) continue; // no es el inicio de una racha
    let length = 1;
    let next = shift(day, 1);
    while (set.has(next)) {
      length++;
      next = shift(next, 1);
    }
    longest = Math.max(longest, length);
  }

  return { current, longest };
}
```

`src/lib/domain/heatmap.ts`:

```ts
export interface HeatCell {
  day: string;
  minutes: number;
  level: 0 | 1 | 2 | 3 | 4;
  future: boolean;
}

const levelFor = (m: number): HeatCell["level"] => (m === 0 ? 0 : m < 15 ? 1 : m < 30 ? 2 : m < 60 ? 3 : 4);

/** Columnas = semanas (lunes a domingo); la última contiene `today` */
export function buildHeatmap(minutesByDay: Record<string, number>, today: string, weeks = 12): HeatCell[][] {
  const todayDate = new Date(`${today}T00:00:00Z`);
  const weekday = (todayDate.getUTCDay() + 6) % 7; // 0 = lunes
  const start = new Date(todayDate);
  start.setUTCDate(start.getUTCDate() - weekday - (weeks - 1) * 7);

  return Array.from({ length: weeks }, (_, w) =>
    Array.from({ length: 7 }, (_, d) => {
      const date = new Date(start);
      date.setUTCDate(start.getUTCDate() + w * 7 + d);
      const day = date.toISOString().slice(0, 10);
      const minutes = minutesByDay[day] ?? 0;
      return { day, minutes, level: levelFor(minutes), future: day > today };
    }),
  );
}
```

### 7.4 Repositorio de sesiones: nuevas consultas

Añade a `createStudySessionsRepo`:

```ts
import { HEARTBEAT_INTERVAL_SECONDS } from "@/lib/constants";

const HEARTBEAT_MS = HEARTBEAT_INTERVAL_SECONDS * 1000;
const durationMs = { $add: [{ $subtract: ["$lastSeenAt", "$startedAt"] }, HEARTBEAT_MS] };

// …dentro del objeto devuelto:

async totals(userId: string): Promise<{ sessions: number; minutes: number }> {
  const [row] = await col
    .aggregate<{ sessions: number; ms: number }>([
      { $match: { userId } },
      { $group: { _id: null, sessions: { $sum: 1 }, ms: { $sum: durationMs } } },
    ])
    .toArray();
  return { sessions: row?.sessions ?? 0, minutes: Math.round((row?.ms ?? 0) / 60_000) };
},

/** Minutos por día (zona horaria de la app) desde `from`; sin `from`, todo el historial */
async minutesByDay(userId: string, timezone: string, from?: Date): Promise<Record<string, number>> {
  const rows = await col
    .aggregate<{ _id: string; ms: number }>([
      { $match: { userId, ...(from && { startedAt: { $gte: from } }) } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$startedAt", timezone } },
          ms: { $sum: durationMs },
        },
      },
    ])
    .toArray();
  return Object.fromEntries(rows.map((r) => [r._id, Math.round(r.ms / 60_000)]));
},
```

### 7.5 `src/server/services/stats.service.ts`

```ts
import { LEVELS, type Level } from "@/lib/constants";
import { buildHeatmap } from "@/lib/domain/heatmap";
import { percent, sessionMinutes } from "@/lib/domain/progress";
import { computeStreak } from "@/lib/domain/streak";
import { dayKey, timezone } from "@/lib/format";
import { repos } from "@/server/repositories";
import { getSyllabusOverview } from "./overview.service";

export async function getProgressDashboard(userId: string) {
  const now = new Date();
  const today = dayKey(now);

  const [overview, attempts, recentSessions, totals, allDays] = await Promise.all([
    getSyllabusOverview(userId),
    repos.quizAttempts.recent(userId, 20),
    repos.studySessions.recent(userId, 15),
    repos.studySessions.totals(userId),
    repos.studySessions.minutesByDay(userId, timezone),
  ]);

  const published = overview.filter((o) => o.href);
  const sectionsTotal = published.reduce((acc, o) => acc + o.totalSections, 0);
  const sectionsRead = published.reduce((acc, o) => acc + o.readCount, 0);
  const bestScores = published.flatMap((o) => (o.quiz ? [o.quiz.best] : []));
  const titleById = new Map(overview.map((o) => [o.course.id, o.course.data.title]));
  const hrefById = new Map(overview.map((o) => [o.course.id, o.href]));

  return {
    summary: {
      percent: percent(sectionsRead, sectionsTotal),
      sectionsRead,
      sectionsTotal,
      coursesCompleted: published.filter((o) => o.status === "completed").length,
      coursesPublished: published.length,
      averageScore: bestScores.length ? bestScores.reduce((a, b) => a + b, 0) / bestScores.length : null,
      studyMinutes: totals.minutes,
      sessions: totals.sessions,
      streak: computeStreak(Object.keys(allDays), today),
    },
    byLevel: (Object.keys(LEVELS) as Level[]).map((level) => ({
      level,
      label: LEVELS[level].label,
      items: published.filter((o) => o.course.data.level === level),
      upcoming: overview.filter((o) => !o.href && o.course.data.level === level).length,
    })),
    quizHistory: attempts.map((a) => ({
      ...a,
      courseTitle: titleById.get(a.courseId) ?? a.courseId,
      courseHref: hrefById.get(a.courseId) ?? null,
    })),
    sessions: recentSessions.map((s) => ({
      startedAt: s.startedAt,
      minutes: sessionMinutes(s.startedAt, s.lastSeenAt),
      sections: s.sectionIds.length,
      courseIds: s.courseIds,
    })),
    heatmap: buildHeatmap(allDays, today, 12),
  };
}

export type ProgressDashboard = Awaited<ReturnType<typeof getProgressDashboard>>;
```

### 7.6 Componentes

`src/components/progress/StatCard.astro`:

```astro
---
interface Props {
  label: string;
  value: string;
  hint?: string;
}
const { label, value, hint } = Astro.props;
---

<div class="rounded-2xl bg-surface p-5">
  <dt class="text-xs font-medium tracking-wider text-muted uppercase">{label}</dt>
  <dd class="mt-2 font-serif text-3xl font-semibold tabular-nums">{value}</dd>
  {hint && <dd class="mt-1 text-sm text-muted">{hint}</dd>}
</div>
```

`src/components/progress/ActivityHeatmap.astro`:

```astro
---
import type { HeatCell } from "@/lib/domain/heatmap";
import { formatMinutes } from "@/lib/format";

interface Props {
  columns: HeatCell[][];
}
const { columns } = Astro.props;
const cells = columns.flat().filter((c) => !c.future);
const activeDays = cells.filter((c) => c.minutes > 0).length;
const totalMinutes = cells.reduce((a, c) => a + c.minutes, 0);

const LEVEL_CLASS = ["bg-surface-2", "bg-accent/25", "bg-accent/50", "bg-accent/75", "bg-accent"];
const dayLabel = new Intl.DateTimeFormat("es", { day: "numeric", month: "short", timeZone: "UTC" });
---

<figure>
  <div
    role="img"
    aria-label={`Actividad de las últimas 12 semanas: ${activeDays} días con estudio, ${formatMinutes(totalMinutes)} en total.`}
    class="grid grid-flow-col grid-rows-7 gap-1 overflow-x-auto"
  >
    {
      columns.flat().map((cell) => (
        <span
          title={cell.future ? "" : `${dayLabel.format(new Date(`${cell.day}T00:00:00Z`))}: ${cell.minutes} min`}
          class:list={["size-3.5 rounded-sm sm:size-4", cell.future ? "bg-transparent" : LEVEL_CLASS[cell.level]]}
        />
      ))
    }
  </div>
  <figcaption class="mt-3 flex items-center gap-2 text-xs text-muted">
    Menos {LEVEL_CLASS.map((c) => <span class:list={["size-3 rounded-sm", c]} />)} Más
  </figcaption>
</figure>
```

`CourseProgressList.astro`, `QuizHistoryTable.astro` y `SessionsList.astro` siguen los patrones ya vistos:

- **CourseProgressList** (props: `byLevel`): por nivel, un `h3` y una lista de filas `ID · título (enlace) · ProgressBar · n/total · Badge de estado` (reutiliza el mapa `STATUS` de `CourseCard`; extráelo a `src/lib/status.ts`). Si `upcoming > 0`, una línea "y N cursos próximamente".
- **QuizHistoryTable** (props: `quizHistory`): tabla con `formatDateTime(submittedAt)`, curso (enlace si `courseHref`), `score/total` y `Badge` Aprobado/No aprobado. Estado vacío: "Todavía no has hecho ninguna evaluación."
- **SessionsList** (props: `sessions`): lista con `formatDateTime(startedAt)`, `formatMinutes(minutes)`, "N secciones" y los `courseIds`. Estado vacío: "Tus sesiones aparecerán aquí cuando empieces a leer."

### 7.7 `src/pages/progreso.astro`

```astro
---
import BaseLayout from "@/layouts/BaseLayout.astro";
import SiteHeader from "@/components/layout/SiteHeader.astro";
import StatCard from "@/components/progress/StatCard.astro";
import ActivityHeatmap from "@/components/progress/ActivityHeatmap.astro";
import CourseProgressList from "@/components/progress/CourseProgressList.astro";
import QuizHistoryTable from "@/components/progress/QuizHistoryTable.astro";
import SessionsList from "@/components/progress/SessionsList.astro";
import { formatMinutes } from "@/lib/format";
import { getProgressDashboard } from "@/server/services/stats.service";

const user = Astro.locals.user!;
const { summary, byLevel, quizHistory, sessions, heatmap } = await getProgressDashboard(user.id);
const avg = summary.averageScore === null ? "—" : `${summary.averageScore.toLocaleString("es", { maximumFractionDigits: 1 })}/5`;
---

<BaseLayout title="Progreso">
  <SiteHeader />
  <main id="contenido" class="mx-auto max-w-5xl px-4 py-12 lg:px-6">
    <h1 class="font-serif text-4xl font-semibold tracking-tight">Tu progreso</h1>

    <dl class="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
      <StatCard label="Avance" value={`${summary.percent} %`} hint={`${summary.sectionsRead}/${summary.sectionsTotal} secciones`} />
      <StatCard label="Cursos" value={`${summary.coursesCompleted}/${summary.coursesPublished}`} hint="completados" />
      <StatCard label="Exámenes" value={avg} hint="media de mejores notas" />
      <StatCard label="Estudio" value={formatMinutes(summary.studyMinutes)} hint={`${summary.sessions} sesiones`} />
    </dl>
    <p class="mt-4 text-sm text-muted">
      Racha actual: <strong class="text-fg">{summary.streak.current} {summary.streak.current === 1 ? "día" : "días"}</strong> · Récord: {summary.streak.longest}
    </p>

    <section aria-labelledby="actividad" class="mt-14">
      <h2 id="actividad" class="font-serif text-2xl font-semibold">Actividad</h2>
      <div class="mt-4"><ActivityHeatmap columns={heatmap} /></div>
    </section>

    <section aria-labelledby="avance" class="mt-14">
      <h2 id="avance" class="font-serif text-2xl font-semibold">Avance por curso</h2>
      <CourseProgressList byLevel={byLevel} />
    </section>

    <section aria-labelledby="examenes" class="mt-14">
      <h2 id="examenes" class="font-serif text-2xl font-semibold">Resultados de exámenes</h2>
      <QuizHistoryTable quizHistory={quizHistory} />
    </section>

    <section aria-labelledby="sesiones" class="mt-14">
      <h2 id="sesiones" class="font-serif text-2xl font-semibold">Sesiones recientes</h2>
      <SessionsList sessions={sessions} />
    </section>
  </main>
</BaseLayout>
```

### Notas de implementación (Tanda 7 ya ejecutada)

- **Zona horaria por defecto:** `APP_TIMEZONE` usa `America/Mexico_City` como valor por defecto (`astro.config.mjs`, `.env.example` y CI). Las fechas se siguen **guardando** en UTC; la aritmética UTC de `streak.ts`, `heatmap.ts` y del formateo de las celdas del *heatmap* trabaja sobre claves de día ya convertidas a la zona de la app, así que no desplaza los días.
- **Heatmap:** etiquetas de los días de la semana (L, X, V, D), atributos `data-day`/`data-level` en cada celda (útiles para tests) y un resumen accesible (`role="img"` con días con estudio y minutos totales).
- **`quizHistory` solo expone los campos necesarios** (sin `answers` ni `results`).
- **Cabecera en móvil:** con los enlaces Temario y Progreso no cabía en pantallas estrechas (el botón de tema quedaba cortado y la página se ensanchaba). Ahora los enlaces usan menos relleno por debajo de `sm`, y por debajo de 380 px la marca se abrevia a "DA" (el enlace conserva `aria-label="Dani Academy, inicio"`). Verificado sin recortes a 320, 360, 390, 768 y 1280 px.
- Verificado: racha y *heatmap* con casos límite (hueco de un día, cambio de mes y año, lunes como inicio de semana, días futuros); agrupación por días contra Atlas (una sesión a las 23:30 de Ciudad de México cuenta ese día, no el siguiente como en UTC); 17 comprobaciones en Chrome con estados vacíos y con datos sembrados; Lighthouse con sesión en `/progreso`, `/temario` y una sección: rendimiento 99–100 y accesibilidad 100 en claro y en oscuro.

### Criterios de aceptación — Tanda 7

- [ ] El enlace "Progreso" de la cabecera lleva a `/progreso` y se marca como actual.
- [ ] Con un usuario nuevo, todos los bloques muestran estados vacíos sin errores (0 %, "—", 0 min).
- [ ] Tras leer secciones, hacer la evaluación y estudiar unos minutos, las 4 tarjetas muestran valores coherentes con Mongo.
- [ ] La media de exámenes usa la **mejor** nota de cada curso.
- [ ] El *heatmap* muestra 12 columnas (lunes a domingo), el día de hoy en la última y los días futuros vacíos; el `title` de cada celda indica fecha y minutos.
- [ ] Las fechas y la agrupación por días respetan `APP_TIMEZONE` (una sesión a las 23:30 locales cuenta en ese día, no en el siguiente en UTC).
- [ ] La racha cuenta días consecutivos y no se rompe si hoy aún no has estudiado.
- [ ] El historial de exámenes lista intentos de todos los cursos, del más reciente al más antiguo.
- [ ] La página es legible en móvil y pasa axe sin infracciones.
- [ ] `npm run check` y `npm run build` sin errores.

---

## Tanda 8 · Producción de contenido

| Dato | Valor |
|---|---|
| Objetivo | Redactar y publicar las secciones y evaluaciones de los 23 cursos restantes, con la misma calidad que B1 |
| Prerrequisitos | Tanda 7 (la plataforma ya está completa: esta Tanda solo añade contenido) |
| Variables de entorno | **Ninguna** |
| Ramas | Una por sub-tanda: `tanda-8a-basico`, `tanda-8b-intermedio`, `tanda-8c-avanzado`, `tanda-8d-proyecto-final` |

> **Recomendación:** no hace falta producir todo el contenido de golpe. Publica cada curso cuando vayas a estudiarlo; el ritmo de 4 h/semana deja margen de sobra.

### 8.1 Sub-tandas

| Sub-tanda | Cursos | Secciones | Evaluaciones |
|---|---|---|---|
| 8a | B2, B3, B4, B5, B6, B7 | 32 | 6 |
| 8b | I1–I8 | 46 | 8 |
| 8c | A1–A8 | 40 | 8 |
| 8d | P1 | 8 | 1 (autoevaluación, ver §8.5) |

### 8.2 Procedimiento por curso (repetible)

1. **Leer** el curso en `temario.md` (tabla de datos, secciones, proyecto, evaluación final y referencias).
2. **Crear la carpeta** `src/content/sections/<slug>/` (slug de `courses.json`).
3. **Crear un `.mdx` por sección**: `NN-slug-corto.mdx` con el frontmatter de §1.18 (`sectionId`, `course`, `title`, `order`, `minutes: 60`, `summary` en texto plano) y el **formato "receta" de §8.6** (obligatorio).
4. **Crear `src/content/quizzes/<id en minúsculas>.yaml`** con 5 preguntas, una por cada tema de la "Evaluación final" del temario, en el formato de `b1.yaml`:
   - 4 opciones plausibles; la correcta repartida entre posiciones (no siempre la misma).
   - `explanation` que enseñe, no que solo confirme.
   - Al menos 2 preguntas con `code` cuando el curso sea de programación.
5. **Publicar**: `"published": true` en `courses.json`.
6. **Verificar**: `npm run check && npm run build`, y revisar en el navegador la portada, **todas** las secciones del curso y la evaluación (§8.6, "Verificación").
7. **Revisión del usuario**: un curso cada vez. Tras el commit, se informa y se espera su confirmación antes de empezar el siguiente.

### 8.3 Lista de control de calidad del contenido

- [ ] Cada sección cubre **todo** el "Contenido" del temario y su ejercicio es el del temario (puede ampliarse).
- [ ] Todo bloque de código es correcto y ejecutable (o marcado claramente como fragmento). En TypeScript, sin errores con `strict`.
- [ ] Las APIs coinciden con la versión actual de la documentación oficial enlazada en "Referencias" (Astro, Tailwind v4, MongoDB driver, Better Auth, etc.). **Comprobar antes de escribir.**
- [ ] Ejercicios conectados con los proyectos reales del alumno (Planificador 2026, app de entrenamiento o esta plataforma) siempre que tenga sentido.
- [ ] Español claro, frases cortas, términos técnicos en inglés en cursiva la primera vez.
- [ ] Sin HTML crudo en el MDX salvo componentes del proyecto (`Callout`).
- [ ] Formato "receta" de §8.6: `## Paso N`, archivos completos sin `// ...`, un `<Callout type="risk">` tras cada bloque de código importante, ejercicio con solución completa y salidas reales.
- [ ] `summary` de 220 caracteres como máximo (el esquema lo exige y el build falla si se supera).

### 8.4 (Opcional) Proyecto y referencias en la portada del curso

Para mostrar el **Proyecto del curso** y las **Referencias** del temario, amplía el esquema de `courses`:

```ts
project: z.object({ title: z.string(), description: z.string() }).optional(),
references: z.array(z.object({ label: z.string(), url: z.string().url() })).default([]),
```

y añade en la portada dos bloques al final: "Proyecto del curso" (tarjeta `bg-surface`) y "Para profundizar" (lista de enlaces con `rel="noopener"`).

### 8.5 Evaluación de P1 (autoevaluación)

El temario define la evaluación de P1 como **reflexiva**: 5 preguntas abiertas autoevaluadas con rúbrica (0–1 punto cada una). Se implementa como variante del esquema de `quizzes` mediante una unión discriminada:

```ts
const choiceQuestion = z.object({
  prompt: z.string(),
  code: z.string().optional(),
  options: z.array(z.string()).length(4),
  answer: z.number().int().min(0).max(3),
  explanation: z.string(),
});
const selfQuestion = z.object({
  prompt: z.string(),
  rubric: z.string(), // qué debe contener una buena respuesta
});

schema: z.discriminatedUnion("mode", [
  z.object({ mode: z.literal("choice").default("choice"), course: reference("courses"), passingScore: z.number().int().default(4), questions: z.array(choiceQuestion).length(5) }),
  z.object({ mode: z.literal("self"), course: reference("courses"), passingScore: z.number().int().default(4), questions: z.array(selfQuestion).length(5) }),
]),
```

- En modo `self`, la isla muestra cada pregunta con un `<textarea>` para la reflexión y, tras escribirla, la rúbrica y dos botones "Cumple" / "No cumple". Las `answers` guardadas son `1`/`0` y `results` sus booleanos.
- `submitQuiz` acepta un `mode` y, en `self`, calcula `score` como la suma de "Cumple" (no hay respuesta correcta que ocultar). El texto de las reflexiones **no** se guarda (no está en el alcance); si lo quieres, añade `notes: string[]` al documento y al validador.
- Añade `mode: choice` explícito a los YAML existentes o confía en el `default`.

### 8.6 Formato "receta" de las lecciones (obligatorio desde el 9 de octubre de 2026)

Todas las lecciones, las ya reescritas (B1–B7) y las que se escriban a partir de ahora (I1–I8, A1–A8, P1), siguen este formato. `temario.md` define **qué** se enseña; esta sección define **cómo** se maqueta cada `.mdx`.

**Regla de oro:** la ruta de aprendizaje, los títulos, el orden y los temas de cada sección son los de `temario.md` y no se cambian. Solo cambia la forma de explicarlos.

**Los cuatro requisitos:**

1. **Receta paso a paso:** la teoría se convierte en una secuencia de acciones (`## Paso 1: …`, `## Paso 2: …`) que va desde cero hasta una implementación final que funciona, sin saltos.
2. **Detalle exhaustivo:** cada paso explica el *por qué* y el *cómo*, con analogías y ejemplos reales (Planificador 2026, app de entrenamiento o esta plataforma, cuando tenga sentido).
3. **Código literal para copiar y pegar:** archivos **completos** y funcionales, con la ruta en un comentario de la primera línea (`// Archivo: src/...`). Prohibido `// ... resto del código` y los fragmentos sueltos que el alumno tenga que completar.
4. **Complicaciones y riesgos:** después de **cada** bloque de código importante, un `<Callout type="risk">` con errores comunes, problemas de rendimiento o de seguridad y trampas de la tecnología.

**Estructura de cada `.mdx`:**

````mdx
---
sectionId: "I1.1"
course: "I1"
title: "Título exacto del temario"
order: 1
minutes: 60
summary: "Texto plano de 220 caracteres como máximo: qué construye y qué comprueba el alumno."
---

Párrafo de entrada: el problema que resuelve la sección y qué se va a construir (3–5 frases).

**Lo que tendrás al terminar:** el resultado concreto (archivos, páginas, comandos).

**Requisitos:** versiones, cursos previos o el proyecto de laboratorio de la sección anterior.

## Paso 1: verbo + resultado

Explicación del por qué y el cómo.

```ts
// Archivo: src/lib/ejemplo.ts
(archivo completo)
```

Salida real o medida obtenida al ejecutarlo:

```text
(salida literal)
```

<Callout type="risk">

- **Trampa concreta:** qué pasa, por qué y cómo evitarla.
- **Rendimiento o seguridad:** lo mismo.

</Callout>

## Paso 2: …

## Ejercicio práctico

<Callout type="exercise">

1. Enunciado en pasos numerados (el del temario, ampliable).

</Callout>

Solución completa (todos los archivos), su salida real y las decisiones explicadas.

<Callout type="risk">

- Riesgos propios de la solución.

</Callout>

<Callout type="mastery">

Criterio "Lo dominas si…" del temario, redactado como lo que el alumno ya sabe hacer.

</Callout>

## Resumen

- 4–6 viñetas.
````

**Reglas de maquetación del MDX:**

- **`Callout`**: el contenido va **sin sangría** y con una **línea en blanco** después de la etiqueta de apertura y antes de la de cierre. Sin ellas, MDX no interpreta las listas y Prettier las aplasta en un párrafo.
- Tipos de `Callout` en uso: `risk` (Complicaciones y riesgos), `exercise`, `mastery` y, solo si hacen falta, `note`, `tip` y `warning`.
- `summary` y `title` en **texto plano** (sin acentos graves ni asteriscos) y `summary` de **220 caracteres como máximo** (`z.string().max(220)` en `content.config.ts`: si se supera, el build falla con `InvalidContentEntryDataError`).
- Código en línea que contiene un acento grave (por ejemplo, una plantilla de JavaScript): se delimita con **dos** acentos graves a cada lado y espacios por dentro.
- Tablas para comparar opciones; bloques `text` para las salidas de consola y las medidas.
- Referencias a otras lecciones por su ID (`B6.7`, `I1.2`), comprobando antes que esa lección trata de verdad el tema citado.
- Prettier: el *override* de `*.mdx` en `.prettierrc.json` (`embeddedLanguageFormatting: "off"`, `proseWrap: "preserve"`) no toca el código ni parte las líneas. Se pasa `npx prettier --write` sobre los `.mdx` del curso antes del commit.

**Verificación (antes de publicar cada curso):**

1. **Laboratorio real:** cada curso se construye en un proyecto desechable **fuera del repositorio** (carpeta temporal). Todo el código de la lección se ejecuta ahí, y las salidas, mensajes de error y medidas que se citan son los obtenidos, nunca inventados.
2. **El código de la lección sale de los archivos verificados:** el borrador usa marcadores (`{{CLAVE}}`) que un *script* sustituye por los archivos del laboratorio. Después se comprueba que no queda ningún marcador.
3. **Afirmaciones comprobadas:** el comportamiento de librerías y navegadores se comprueba ejecutándolo o en `node_modules`. Lo visual (CSS, *responsive*, estados) se mide en Chrome automatizado (`getComputedStyle`, tamaños a varios anchos, capturas).
4. **Seguridad de los comandos:** `set -e`, rutas absolutas y `cd "$DIR" || exit 1` antes de cualquier comando que escriba archivos. Un `cd` fallido ya llegó a sobrescribir archivos del repositorio y el `.env`. Nunca se imprimen valores de `.env`.
5. **En la plataforma:** `npm run check`, `npm run build` y revisión de **todas** las secciones con un usuario de prueba (`@dani-academy.test`, borrado al terminar): sin errores de consola, sin *scroll* horizontal, listas de los `Callout` con su numeración y entradilla con el `summary` nuevo. Si el servidor de desarrollo muestra contenido antiguo o un 504 de Vite, se reinicia (`astro dev stop` y `astro dev --background`).
6. **Commit por curso** en `main`: `content: curso <ID> reescrito en formato receta` (o `content: curso <ID> · <título>` si el curso es nuevo), y espera de la revisión del usuario antes del siguiente.

### Notas de implementación (sub-tanda 8a ya ejecutada: B2–B7)

- **Publicados:** B2 (4 secciones), B3 (5), B4 (5), B5 (6), B6 (7) y B7 (5), con sus evaluaciones. Un commit por curso.
- **Cómo se verificó cada curso** (repetir en 8b–8d):
  1. Los ejemplos se ejecutan antes de escribir la lección: Git en un repositorio de prueba, SQL con `sqlite3`, MongoDB contra Atlas en colecciones temporales (`__lab_*`, borradas después), React con el `tsc` del proyecto y las utilidades de Tailwind con su compilador. Así, los mensajes y salidas que citan las lecciones son reales.
  2. Las afirmaciones sobre el comportamiento de una librería se comprueban en su código en `node_modules`. Esto corrigió, por ejemplo, que Better Auth responde **422** (no 409) a un correo ya registrado, que Astro **no da error** al pasar una función como prop a una isla (llega como `null`) y a qué peticiones aplica `security.checkOrigin`.
  3. Un verificador en el navegador recorre cada curso: el curso es un enlace en `/temario`, la portada lista N secciones, cada sección tiene ≥ 2 bloques de código, "Ejercicio", "Lo dominas si…", "Errores comunes" y "Resumen" sin MDX sin procesar (con el formato de §8.6, "Errores comunes" pasa a ser los bloques "Complicaciones y riesgos" y se comprueban los apartados `Paso N`); después marca todo, responde la evaluación con su clave y espera 5/5 y "Completado".
- **Reglas para los YAML de evaluación:** `prompt`, `options` y `explanation` solo admiten `` `código` `` en línea (el componente no interpreta `**negrita**` ni otro Markdown). Repartir la posición de la respuesta correcta.
- **`@source not "../content"` en `global.css`:** Tailwind escaneaba las lecciones y generaba CSS para las clases de los ejemplos (`bg-slate-900`, `bg-amber-50`…). El MDX no necesita utilidades para pintarse (los `Callout` llevan las suyas), así que se excluye: el CSS pasó de 69,9 KB a 62,3 KB sin cambios visuales.
- Lighthouse (con sesión, claro y oscuro) en lecciones con tablas y mucho código: rendimiento 99–100, accesibilidad 100, CLS 0.

### Criterios de aceptación — Tanda 8 (por sub-tanda)

- [ ] Todos los cursos de la sub-tanda tienen `published: true`, sus secciones (número igual a `plannedSections`) y su evaluación.
- [ ] El índice del temario los muestra como enlaces y su estado funciona.
- [ ] `npm run build` valida todo el contenido (un frontmatter incorrecto rompe el build con un mensaje claro).
- [ ] Revisión manual de la lista de control §8.3.

---

## Tanda 9 · Calidad: tests, seguridad, accesibilidad y CI

| Dato | Valor |
|---|---|
| Objetivo | Tests unitarios, de integración y E2E; cabeceras de seguridad y *rate limiting*; auditoría de accesibilidad; *linting* y CI en GitHub Actions |
| Prerrequisitos | Tanda 7 (puede hacerse en paralelo a la Tanda 8) |
| Rama | `main` (se trabaja sin ramas) |

### 🔑 Credenciales necesarias

| Dónde | Qué | Notas |
|---|---|---|
| Local (E2E) | Docker Desktop instalado | Para levantar MongoDB como *replica set* de un nodo |
| GitHub | Repositorio en GitHub con Actions activado | El CI **no necesita secretos**: genera un `BETTER_AUTH_SECRET` desechable y usa un MongoDB en contenedor |
| `.env` local (opcional) | `MONGODB_URI_TEST` | Solo si prefieres lanzar los E2E contra otra instancia |

### 9.1 Dependencias

```bash
npm i -D vitest @vitest/coverage-v8 mongodb-memory-server jsdom \
  @testing-library/react @testing-library/user-event @testing-library/jest-dom \
  @playwright/test @axe-core/playwright \
  eslint @eslint/js typescript-eslint eslint-plugin-astro eslint-plugin-react-hooks globals
npx playwright install chromium
```

`package.json`:

```json
{
  "scripts": {
    "lint": "eslint .",
    "test": "vitest",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "playwright test",
    "db:setup": "node --env-file-if-exists=.env --import tsx scripts/db-setup.ts"
  }
}
```

> El script `db:setup` cambia para no fallar cuando no existe `.env` (en CI las variables llegan del entorno). Requiere Node 22.9+.

### 9.2 Estructura de tests

```
tests/
├── unit/
│   ├── quiz.test.ts            # gradeQuiz
│   ├── progress.test.ts        # percent, courseStatus, sessionMinutes
│   ├── streak.test.ts          # computeStreak
│   ├── heatmap.test.ts         # buildHeatmap
│   └── redirect.test.ts        # safeRedirect
├── integration/
│   ├── setup.ts                # MongoMemoryReplSet compartido
│   ├── progress.repo.test.ts
│   ├── study-sessions.repo.test.ts
│   ├── quiz-attempts.repo.test.ts
│   └── rate-limit.test.ts
├── components/
│   ├── quiz-reducer.test.ts
│   └── MarkAsReadButton.test.tsx
└── e2e/
    ├── auth.spec.ts
    ├── learning-flow.spec.ts
    ├── authorization.spec.ts
    └── a11y.spec.ts
```

### 9.3 `vitest.config.ts`

```ts
/// <reference types="vitest/config" />
import { getViteConfig } from "astro/config";

export default getViteConfig({
  test: {
    include: ["tests/{unit,integration,components}/**/*.test.{ts,tsx}"],
    environment: "node", // los tests de componentes usan el comentario `// @vitest-environment jsdom`
    setupFiles: ["@testing-library/jest-dom/vitest"],
    testTimeout: 30_000,
    coverage: { include: ["src/lib/**", "src/server/**"] },
  },
});
```

### 9.4 Ejemplos de tests

**Unitario** — `tests/unit/quiz.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { gradeQuiz } from "@/lib/domain/quiz";

describe("gradeQuiz", () => {
  const key = [1, 2, 0, 3, 1];

  it.each([
    [[1, 2, 0, 3, 1], 5, true],
    [[1, 2, 0, 3, 0], 4, true],
    [[0, 2, 0, 3, 0], 3, false],
    [[0, 0, 1, 0, 0], 0, false],
  ])("respuestas %j → %i aciertos (aprobado: %s)", (answers, score, passed) => {
    const result = gradeQuiz(key, answers, 4);
    expect(result.score).toBe(score);
    expect(result.passed).toBe(passed);
    expect(result.results).toHaveLength(5);
  });

  it("falla si el número de respuestas no coincide", () => {
    expect(() => gradeQuiz(key, [1, 2], 4)).toThrow();
  });
});
```

**Integración** — `tests/integration/setup.ts` y `progress.repo.test.ts`:

```ts
// tests/integration/setup.ts
import { MongoMemoryReplSet } from "mongodb-memory-server";
import { MongoClient, type Db } from "mongodb";
import { afterAll, beforeAll, beforeEach } from "vitest";

let replSet: MongoMemoryReplSet;
let client: MongoClient;
export let db: Db;

beforeAll(async () => {
  replSet = await MongoMemoryReplSet.create({ replSet: { count: 1 } });
  client = await MongoClient.connect(replSet.getUri());
  db = client.db("test");
});

beforeEach(async () => {
  await db.dropDatabase();
  // Índice único necesario para probar la idempotencia
  await db.collection("section_progress").createIndex({ userId: 1, sectionId: 1 }, { unique: true });
});

afterAll(async () => {
  await client?.close();
  await replSet?.stop();
});
```

```ts
// tests/integration/progress.repo.test.ts
import { describe, expect, it } from "vitest";
import { db } from "./setup";
import { createProgressRepo } from "@/server/repositories/progress.repo";

describe("progress.repo", () => {
  it("marcar dos veces no duplica y conserva la fecha original", async () => {
    const repo = createProgressRepo(db);
    const first = new Date("2026-10-01T10:00:00Z");
    await repo.markRead("u1", "B1", "B1.1", first);
    await repo.markRead("u1", "B1", "B1.1", new Date("2026-10-02T10:00:00Z"));

    const docs = await db.collection("section_progress").find({ userId: "u1" }).toArray();
    expect(docs).toHaveLength(1);
    expect(docs[0]!.readAt).toEqual(first);
  });

  it("aísla el progreso entre usuarios", async () => {
    const repo = createProgressRepo(db);
    await repo.markRead("u1", "B1", "B1.1");
    expect(await repo.readSectionIds("u2", "B1")).toEqual([]);
  });

  it("marcados en paralelo no lanzan error", async () => {
    const repo = createProgressRepo(db);
    await Promise.all(Array.from({ length: 5 }, () => repo.markRead("u1", "B1", "B1.2")));
    expect(await repo.readSectionIds("u1", "B1")).toEqual(["B1.2"]);
  });
});
```

**Componente** — `tests/components/MarkAsReadButton.test.tsx`:

```tsx
// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, expect, it, vi } from "vitest";
import MarkAsReadButton from "@/components/course/MarkAsReadButton";

afterEach(() => vi.restoreAllMocks());

it("marca la sección y llama a la API con PUT", async () => {
  const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(null, { status: 204 }));
  render(<MarkAsReadButton sectionId="B1.1" />);

  await userEvent.click(screen.getByRole("button", { name: /marcar como leído/i }));

  expect(fetchMock).toHaveBeenCalledWith("/api/progress/B1.1", { method: "PUT" });
  expect(screen.getByRole("button", { name: /leído/i })).toHaveAttribute("aria-pressed", "true");
});

it("revierte el estado si la API falla", async () => {
  vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(null, { status: 500 }));
  render(<MarkAsReadButton sectionId="B1.1" />);

  await userEvent.click(screen.getByRole("button", { name: /marcar como leído/i }));

  expect(await screen.findByText(/no se pudo guardar/i)).toBeInTheDocument();
  expect(screen.getByRole("button")).toHaveAttribute("aria-pressed", "false");
});
```

Otros tests a escribir (mismo estilo): `computeStreak` (racha que incluye hoy, que acaba ayer, huecos, récord), `buildHeatmap` (12×7, hoy en la última columna, días futuros), `safeRedirect` (`//evil.com`, `https://…`, `/ok`), `quizReducer` (no envía con respuestas vacías, `failed` vuelve a `answering` con error, `reset`), `study-sessions.repo` (extiende dentro de 30 min, crea nueva después, `minutesByDay` con zona horaria), `quiz-attempts.repo` (`summaryByCourse` con mejor nota y `passed`).

### 9.5 E2E con Playwright

**MongoDB local para E2E** (una vez; Better Auth usa transacciones, que requieren *replica set*):

```bash
docker run -d --name mongo-e2e -p 27017:27017 mongo:8 --replSet rs0 --bind_ip_all
docker exec mongo-e2e mongosh --quiet --eval 'rs.initiate({_id:"rs0",members:[{_id:0,host:"localhost:27017"}]})'
```

Ejecución local (las variables del *shell* tienen prioridad sobre `.env`):

```bash
export MONGODB_URI="mongodb://localhost:27017/?directConnection=true" MONGODB_DB="dani_academy_e2e"
npm run db:setup && npm run test:e2e
```

`playwright.config.ts`:

```ts
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: false,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  use: { baseURL: "http://localhost:4321", trace: "retain-on-failure" },
  webServer: {
    command: "npm run dev -- --port 4321",
    url: "http://localhost:4321/api/health",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
});
```

`tests/e2e/learning-flow.spec.ts` (flujo completo):

```ts
import { expect, test } from "@playwright/test";

const B1_SECTIONS = Array.from({ length: 8 }, (_, i) => `B1.${i + 1}`);
const B1_ANSWERS = [1, 2, 0, 3, 1]; // claves de src/content/quizzes/b1.yaml

test("registro → leer → evaluación → progreso", async ({ page }) => {
  const email = `e2e-${Date.now()}@test.dev`;

  await page.goto("/registro");
  await page.getByLabel("Nombre").fill("E2E");
  await page.getByLabel("Correo").fill(email);
  await page.getByLabel("Contraseña").fill("password-seguro-123");
  await page.getByRole("button", { name: "Crear cuenta" }).click();
  await expect(page).toHaveURL(/\/temario$/);

  // Una sección por la interfaz…
  await page.getByRole("link", { name: /TypeScript desde cero/ }).click();
  await page.getByRole("link", { name: /Empezar curso/ }).click();
  await page.getByRole("button", { name: "Marcar como leído" }).click();
  await expect(page.getByRole("button", { name: "Leído" })).toHaveAttribute("aria-pressed", "true");

  // …y el resto por la API, con la misma cookie de sesión
  for (const id of B1_SECTIONS.slice(1)) {
    expect((await page.request.put(`/api/progress/${id}`)).status()).toBe(204);
  }

  await page.goto("/cursos/typescript-desde-cero/evaluacion");
  for (const [i, answer] of B1_ANSWERS.entries()) {
    await page.getByRole("radio").nth(answer).check();
    await page.getByRole("button", { name: i === 4 ? "Enviar respuestas" : "Siguiente →" }).click();
  }
  await expect(page.getByRole("heading", { name: /Aprobado/ })).toBeVisible();

  await page.goto("/progreso");
  await expect(page.getByText("100 %").or(page.getByText(/8\/\d+ secciones/))).toBeVisible();
});
```

`tests/e2e/authorization.spec.ts`: sin sesión, `/temario` redirige a `/login?redirect=%2Ftemario` y `PUT /api/progress/B1.1` devuelve `401`; con sesión, `?redirect=//evil.com` tras el login acaba en `/temario`.

`tests/e2e/a11y.spec.ts`:

```ts
import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("login sin infracciones de accesibilidad (light y dark)", async ({ page }) => {
  for (const theme of ["light", "dark"]) {
    await page.addInitScript((t) => localStorage.setItem("da-theme", t), theme);
    await page.goto("/login");
    const { violations } = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
    expect(violations).toEqual([]);
  }
});
// Repetir (tras registrar un usuario en beforeAll) para /temario, portada de B1, una sección, la evaluación y /progreso.
```

### 9.6 Seguridad

**Cabeceras y caché privada** — añade un *middleware* al principio de la secuencia en `src/middleware.ts`:

```ts
const securityHeaders = defineMiddleware(async (ctx, next) => {
  const response = await next();
  try {
    const h = response.headers;
    h.set("X-Content-Type-Options", "nosniff");
    h.set("Referrer-Policy", "strict-origin-when-cross-origin");
    h.set("X-Frame-Options", "DENY");
    h.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
    if (import.meta.env.PROD) h.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains");
    // Ninguna respuesta con datos de usuario debe quedarse en una caché compartida (temario A6.3)
    if (ctx.locals.user) h.set("Cache-Control", "private, no-store");
  } catch {
    // Algunas respuestas tienen cabeceras inmutables: se dejan tal cual
  }
  return response;
});

export const onRequest = sequence(securityHeaders, loadSession, guard);
```

> **CSP:** el script inline del tema y las islas necesitan *hashes*. Usa la opción nativa de CSP de Astro (`security.csp`, o `experimental.csp` según tu versión), que calcula los *hashes* automáticamente. Empieza en modo informe si tu versión lo permite.

**Rate limiting propio** — `src/server/repositories/rate-limit.repo.ts`:

```ts
import type { Db } from "mongodb";
import { COLLECTIONS, type RateLimitDoc } from "@/server/db-types";

/** Ventana fija con contador en Mongo; el índice TTL borra las ventanas caducadas */
export function createRateLimitRepo(db: Db) {
  const col = db.collection<RateLimitDoc>(COLLECTIONS.rateLimits);
  return {
    async hit(key: string, max: number, windowSeconds: number, now = Date.now()) {
      const windowMs = windowSeconds * 1000;
      const windowStart = Math.floor(now / windowMs) * windowMs;
      const doc = await col.findOneAndUpdate(
        { _id: `${key}:${windowStart}` },
        { $inc: { n: 1 }, $setOnInsert: { expiresAt: new Date(windowStart + windowMs) } },
        { upsert: true, returnDocument: "after" },
      );
      return {
        allowed: (doc?.n ?? 1) <= max,
        retryAfterSeconds: Math.ceil((windowStart + windowMs - now) / 1000),
      };
    },
  };
}
```

Regístralo como `repos.rateLimit` y añade a `scripts/db-setup.ts`:

```ts
[COLLECTIONS.rateLimits, { expiresAt: 1 }, { expireAfterSeconds: 0, name: "ttl" }],
```

Aplica límites en los servicios (lanzando `TooManyRequestsError`):

| Operación | Clave | Límite |
|---|---|---|
| Enviar evaluación | `quiz:<userId>` | 10 por hora |
| Marcar/desmarcar | `progress:<userId>` | 60 por minuto |
| Heartbeat | `hb:<userId>` | 5 por minuto |

```ts
// Ejemplo en submitQuiz (quiz.service.ts)
const { allowed, retryAfterSeconds } = await repos.rateLimit.hit(`quiz:${userId}`, 10, 3600);
if (!allowed) throw new TooManyRequestsError(retryAfterSeconds);
```

**Rate limiting de Better Auth** (fuerza bruta en login/registro). En *serverless* la memoria no se comparte entre instancias, así que se guarda en la base de datos. Añade a `betterAuth({...})` y comprueba las opciones exactas en la documentación de tu versión:

```ts
rateLimit: {
  enabled: true,
  storage: "database",
  window: 60,
  max: 100,
  customRules: {
    "/sign-in/email": { window: 60, max: 5 },
    "/sign-up/email": { window: 3600, max: 5 },
  },
},
```

### 9.7 ESLint — `eslint.config.js`

```js
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import astro from "eslint-plugin-astro";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";

export default tseslint.config(
  { ignores: ["dist", ".astro", ".vercel", "node_modules", "coverage", "playwright-report", "test-results"] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...astro.configs.recommended,
  {
    files: ["**/*.tsx"],
    plugins: { "react-hooks": reactHooks },
    rules: reactHooks.configs.recommended.rules,
  },
  { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
);
```

### 9.8 CI — `.github/workflows/ci.yml`

```yaml
name: CI

on:
  pull_request:
  push:
    branches: [main]

concurrency:
  group: ci-${{ github.ref }}
  cancel-in-progress: true

env:
  MONGODB_URI: mongodb://localhost:27017/?directConnection=true
  MONGODB_DB: dani_academy_ci
  BETTER_AUTH_URL: http://localhost:4321
  APP_TIMEZONE: America/Mexico_City

jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: npm }
      - run: npm ci
      - run: echo "BETTER_AUTH_SECRET=$(openssl rand -base64 32)" >> "$GITHUB_ENV"
      - run: npm run format:check
      - run: npm run lint
      - run: npm run check
      - run: npm run test:run
      - run: npm run build

  e2e:
    needs: verify
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: npm }
      - run: npm ci
      - run: echo "BETTER_AUTH_SECRET=$(openssl rand -base64 32)" >> "$GITHUB_ENV"
      - name: MongoDB (replica set de un nodo)
        run: |
          docker run -d --name mongo -p 27017:27017 mongo:8 --replSet rs0 --bind_ip_all
          for i in $(seq 1 30); do
            docker exec mongo mongosh --quiet --eval 'try { rs.status().ok } catch (e) { rs.initiate({_id:"rs0",members:[{_id:0,host:"localhost:27017"}]}).ok }' && break
            sleep 1
          done
      - run: npm run db:setup
      - run: npx playwright install --with-deps chromium
      - run: npm run test:e2e
      - uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: playwright-report
          path: playwright-report
          retention-days: 7
```

En GitHub → *Settings* → *Branches*: protege `main` y exige que `verify` y `e2e` pasen antes de mezclar.

### Notas de implementación (Tanda 9 ya ejecutada)

Cambios respecto al plan, descubiertos al verificarla. **El código real del repositorio manda:**

- **Sin Docker en local:** `npm run test:e2e:local` (`scripts/e2e-local.mjs`) levanta un *replica set* de MongoDB en memoria, ejecuta `db:setup` y Playwright, imprime cuántos usuarios se crearon en esa base (prueba de que no se tocó Atlas) y lo apaga. El CI sigue usando `mongo:8` en Docker. `npm run test:e2e` a secas es el comando del CI.
- **Playwright nunca usa el servidor de trabajo:** puerto propio (`E2E_PORT`, 4322), `astro dev --ignore-lock`, `reuseExistingServer: false`, y `playwright.config.ts` se niega a arrancar si `MONGODB_URI` no es `localhost`/`127.0.0.1`.
- **Las llamadas directas a la API en los E2E llevan `Origin`:** `security.checkOrigin` de Astro responde **403** ("Cross-site PUT form submissions are forbidden") a un PUT/POST/DELETE sin él. El `fetch` del navegador lo envía siempre; `page.request` no. Helper `api(page)` en `tests/e2e/fixtures.ts`, y un test que comprueba el 403 con un origen ajeno (CSRF).
- **Una IP por test:** Better Auth limita por IP y en local todas las peticiones son `127.0.0.1`. El *fixture* da a cada test una `x-forwarded-for` aleatoria; así el límite de 5 registros/hora no se agota entre tests.
- **Better Auth:** sin `rateLimit.enabled` solo limita en producción, y trae reglas por defecto para `/sign-in` y `/sign-up` (3 cada 10 s). Configurado `enabled: true` (también en desarrollo), `storage: "database"` (colección `rateLimit`, índice único en `key` en `db:setup`), 5 logins/min y 5 registros/hora por IP, y `ipAddressHeaders: ["x-vercel-forwarded-for", "x-forwarded-for"]` (Vercel sobrescribe ambas). Verificado: 5 × 401 y después 429 con `X-Retry-After`; otra IP no queda bloqueada.
- **Rate limiting propio:** `RATE_LIMITS` en `constants.ts` y `enforceRateLimit()` en `rate-limit.service.ts`, llamado al principio de `submitQuiz`, `setSectionRead` y `recordHeartbeat`. El límite de latidos es de **20 por minuto** (no 5, como proponía la tabla de §9.6): `StudyTracker` envía uno al abrir cada sección además del de cada minuto, y con 5 un usuario que recorría 6 secciones en menos de un minuto recibía 429 (detectado al revisar el curso I1). El repositorio reintenta una vez si dos *upserts* simultáneos de una ventana nueva chocan con `_id` (probado con 20 peticiones en paralelo). `TooManyRequestsError` da un mensaje en español con los minutos de espera, y `RegisterForm` explica el 429.
- **CSP nativa de Astro** (`security.csp`), verificada con un build de producción (adaptador Node en una copia) navegando en Chrome:
  - Llega como **cabecera** `content-security-policy` con *hashes* en `script-src`. `style-src` lleva `'unsafe-inline'` porque Shiki pinta el código con estilos en línea (limitación documentada de Astro); la protección contra XSS está en `script-src`.
  - Astro **no** calcula el *hash* de los scripts `is:inline` (ni con `define:vars` ni literales). El script del tema vive en `src/scripts/theme-init.js`, se incrusta con `set:html` y `BaseLayout` registra su *hash* con `Astro.csp.insertScriptHash()` sobre el mismo texto. Un test unitario comprueba que usa la clave `THEME_STORAGE_KEY`.
  - `font-src` necesita `data:` (Fontsource incrusta subconjuntos pequeños).
  - El `<ClientRouter />` funciona con la CSP (navegación sin recarga, islas y tema verificados). Única advertencia en consola: bloquea un `<script src="data:application/javascript,">` vacío que el router usa solo para esperar a los módulos en línea; su `onerror` resuelve la misma promesa, así que no afecta. No se añade `data:` a `script-src`.
- **Cabeceras:** `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`, `Permissions-Policy`, HSTS solo en producción y `Cache-Control: private, no-store` con sesión (comprobado en `/temario`, `/progreso` y la portada del curso).
- **Versiones:** ESLint 10 (`defineConfig` de `eslint/config`), Vitest 5, jsdom 30, Playwright 1.64. El CI usa **Node 24**: jsdom 30 exige `^22.22.2 || ^24.15.0 || >=26`.
- **Tipos de jest-dom:** `tests/jest-dom.d.ts` (sin él, `astro check` falla en los tests de componentes).
- **Resultados:** 90 tests de Vitest (unitarios, integración y componentes), cobertura del 100 % en `src/lib/domain` y `src/lib/redirect.ts`; 25 E2E en escritorio y móvil (1 omitido a propósito en móvil: el límite de evaluaciones es de API); axe sin infracciones WCAG 2.1 A/AA en 7 páginas, claro y oscuro. El CI se simuló completo en una copia sin `.env` con `CI=true`.
- **Hecho tras la Tanda:** `npm run db:setup` ejecutado contra Atlas (índice TTL de `rate_limits` y único de `rateLimit`, verificados) y primer CI en GitHub en verde (`verify` y `e2e`). Web desplegada en Vercel revisada por el usuario con la CSP activa: sin errores en consola. **Tanda 9 cerrada.**
- **Sin protección de rama en GitHub (decisión del usuario):** un ruleset que exija `verify` y `e2e` rechaza todo `git push` directo a `main` (el commit aún no tiene CI), y el proyecto se trabaja solo en `main`, sin ramas. En su lugar, `.githooks/pre-push` ejecuta `format:check`, `lint`, `check` y `test:run` (~13 s) y cancela el *push* si algo falla. Se instala solo con `npm install` (script `prepare`: `git config core.hooksPath .githooks`). Los E2E no van en el *hook*: `npm run test:e2e:local` a mano y siempre en el CI, que queda como aviso. Emergencia: `git push --no-verify`.
- `npm audit` informa de 6 vulnerabilidades (2 moderadas, 4 altas) que ya existían antes de esta Tanda, en dependencias de `@astrojs/vercel` y `@tailwindcss/typography`; su arreglo exige `--force` (cambios incompatibles).

### Criterios de aceptación — Tanda 9

- [ ] `npm run test:run` pasa (unitarios, integración y componentes). Cobertura de `src/lib/domain` ≥ 90 %.
- [ ] `npm run test:e2e` pasa en local contra el MongoDB de Docker, en escritorio y en móvil.
- [ ] axe no reporta infracciones WCAG A/AA en ninguna página, en light ni en dark.
- [ ] La respuesta de cualquier página privada incluye `Cache-Control: private, no-store` y las cabeceras de seguridad.
- [ ] Más de 5 intentos de login fallidos en un minuto devuelven `429`.
- [ ] Enviar 11 evaluaciones en una hora devuelve un error `TOO_MANY_REQUESTS` en la undécima.
- [ ] `npm run lint` y `npm run format:check` pasan.
- [ ] En GitHub, una PR ejecuta `verify` y `e2e` en verde, y `main` está protegida.

---

## Tanda 10 · Despliegue a producción

| Dato | Valor |
|---|---|
| Objetivo | App en producción en Vercel, con MongoDB Atlas de producción y un subdominio propio |
| Prerrequisitos | Tanda 9 (o al menos Tanda 7 si quieres desplegar antes) |
| Rama | `main` (el despliegue lo dispara el *merge*) |

### 🔑 Variables y accesos que necesito de tu parte

| Dónde | Variable / acceso | Valor en producción |
|---|---|---|
| Vercel → *Settings* → *Environment Variables* (**Production**) | `MONGODB_URI` | URI del usuario de producción (distinto del de desarrollo) |
| | `MONGODB_DB` | `dani_academy` |
| | `BETTER_AUTH_SECRET` | **Nuevo**, generado con `openssl rand -base64 32` (no reutilices el de desarrollo) |
| | `BETTER_AUTH_URL` | `https://academy.<tu-dominio>` |
| | `APP_TIMEZONE` | Tu zona IANA |
| Vercel (**Preview**, opcional) | Las mismas, con `MONGODB_DB=dani_academy_preview` y otro secreto | Ver nota sobre *previews* |
| MongoDB Atlas | Acceso de administrador del proyecto | Para crear el usuario y la regla de red |
| Namecheap | Acceso al panel DNS del dominio | Para el registro `CNAME` |

### 10.1 MongoDB Atlas (producción)

1. *Database Access*: usuario `academy_prod` con **readWrite** solo sobre `dani_academy`, contraseña larga y distinta.
2. *Network Access*: Vercel usa IPs dinámicas, así que añade `0.0.0.0/0`. Compénsalo con: usuario con mínimos privilegios, contraseña fuerte y conexión TLS (la URI `+srv` ya la usa).
3. Crea un `.env.production.local` (está en `.gitignore`) con las variables de producción y prepara la base de datos:

```bash
node --env-file=.env.production.local --import tsx scripts/db-setup.ts
```

4. **Backups:** el plan gratuito M0 no incluye *backups* automáticos. Opciones: subir a un plan con *backups*, o programar `mongodump` (temario I6.6). Haz al menos un *backup* y una restauración de prueba antes de depender de los datos.

### 10.2 Vercel

1. *Add New Project* → importa el repositorio de GitHub. *Framework preset*: Astro (lo detecta solo).
2. Añade las variables de §10 en **Production** (y en **Preview** si las vas a usar).
3. *Settings* → *Functions*: elige la región más cercana a tu clúster de Atlas (por ejemplo, la misma región de AWS) para reducir latencia.
4. Despliega y comprueba `https://<proyecto>.vercel.app/api/health`.

**Conexiones a MongoDB en Vercel (recomendado):** con Fluid Compute, Vercel recomienda adjuntar el *pool* del driver para cerrar conexiones inactivas antes de suspender la función. Si tu versión de `@vercel/functions` incluye `attachDatabasePool`:

```ts
// src/lib/mongo.ts (añadir)
import { attachDatabasePool } from "@vercel/functions";
if (process.env.VERCEL) attachDatabasePool(mongoClient);
```

**Nota sobre *previews*:** cada *preview* tiene una URL distinta y Better Auth valida el origen contra `BETTER_AUTH_URL`/`trustedOrigins`. Lo más simple es probar el login en local y en producción, y usar las *previews* para revisar la interfaz. Si necesitas login en *previews*, añade a `trustedOrigins` el patrón de tus URLs de Vercel (consulta en la documentación de Better Auth el soporte de comodines de tu versión).

### 10.3 Dominio (Namecheap → Vercel)

1. Vercel → *Settings* → *Domains* → añade `academy.<tu-dominio>`.
2. Namecheap → *Advanced DNS* → nuevo registro **CNAME**: *Host* `academy`, *Value* el que indique Vercel (normalmente `cname.vercel-dns.com`), TTL automático.
3. Espera a que Vercel marque el dominio como válido y emita el certificado HTTPS.
4. Actualiza `BETTER_AUTH_URL` en Vercel a `https://academy.<tu-dominio>` y vuelve a desplegar.

### 10.4 Prueba de humo en producción

- [ ] `https://academy.<tu-dominio>/api/health` → `200`.
- [ ] Registro, login y logout funcionan; la cookie es `Secure`, `HttpOnly` y `SameSite=Lax`.
- [ ] Marcar como leído persiste tras recargar; la evaluación se guarda; `/progreso` muestra los datos.
- [ ] Las fechas salen en tu zona horaria.
- [ ] `https://<proyecto>.vercel.app` redirige al dominio propio (*Settings* → *Domains* → *Redirect*).
- [ ] Lighthouse móvil en producción: Rendimiento ≥ 90, Accesibilidad ≥ 95, Buenas prácticas ≥ 95.
- [ ] (Opcional) Vercel Speed Insights activado para medir Core Web Vitals reales (temario A6.1).

### Criterios de aceptación — Tanda 10

- [ ] Cada *merge* a `main` despliega automáticamente en producción tras pasar el CI.
- [ ] Producción y desarrollo usan **bases de datos, usuarios de Mongo y secretos distintos**.
- [ ] Existe al menos un *backup* restaurado con éxito.
- [ ] Prueba de humo §10.4 completa.

---

## Anexo A · Variables de entorno

Plantilla completa en `.env.example`.

| Variable | Contexto | Obligatoria | Tanda | Descripción |
|---|---|---|---|---|
| `MONGODB_URI` | servidor, secreta | Sí | 2 | Cadena de conexión de MongoDB |
| `MONGODB_DB` | servidor, secreta | No (`dani_academy`) | 2 | Nombre de la base de datos |
| `BETTER_AUTH_SECRET` | servidor, secreta | Sí (≥ 32 caracteres) | 3 | Firma de cookies y tokens de sesión |
| `BETTER_AUTH_URL` | servidor, secreta | Sí | 3 | URL base de la app |
| `APP_TIMEZONE` | servidor, pública | No (`America/Mexico_City`) | 5 | Zona IANA para fechas y días de estudio |
| `MONGODB_URI_TEST` | solo tests | No | 9 | Instancia alternativa para E2E |
| `LOG_LEVEL` | servidor | No | Futuro (A6) | Nivel de logs estructurados |
| `SENTRY_DSN` / `PUBLIC_SENTRY_DSN` / `SENTRY_AUTH_TOKEN` | servidor / cliente / build | No | Futuro (A6) | Captura de errores con Sentry |

Esquema final de `astro.config.mjs` → `env.schema`:

```js
env: {
  schema: {
    MONGODB_URI: envField.string({ context: "server", access: "secret" }),
    MONGODB_DB: envField.string({ context: "server", access: "secret", default: "dani_academy" }),
    BETTER_AUTH_SECRET: envField.string({ context: "server", access: "secret", min: 32 }),
    BETTER_AUTH_URL: envField.string({ context: "server", access: "secret", url: true }),
    APP_TIMEZONE: envField.string({ context: "server", access: "public", default: "America/Mexico_City" }),
    LOG_LEVEL: envField.enum({ context: "server", access: "public", values: ["debug", "info", "warn", "error"], default: "info" }),
  },
},
```

---

## Anexo B · Prompt para ejecutar una Tanda con una IA

Copia este texto, cambia `N` y pégalo en una sesión nueva abierta en la carpeta del proyecto:

```text
Eres un desarrollador full-stack experto en Astro, React, Tailwind CSS v4, TypeScript y MongoDB.

Lee `planificacion.md` completo (sobre todo las secciones 1 a 6) y ejecuta SOLO la "Tanda N".
- Crea una rama `tanda-N-<nombre>` desde `main`.
- Sigue al pie de la letra la estructura de archivos y el código de la Tanda. Si una API ha
  cambiado en la versión instalada de una librería, consulta su documentación oficial, adapta
  el código y explícame el cambio.
- No implementes nada que la Tanda marque como "Fuera de alcance" ni adelantes Tandas futuras.
- Si la Tanda pide variables de entorno, comprueba que existen en `.env`; si faltan, detente y
  pídemelas indicando cómo obtenerlas.
- Al terminar, recorre los "Criterios de aceptación" uno a uno, dime cuáles has verificado y
  cómo, y cuáles debo comprobar yo en el navegador.
- Haz commits pequeños con Conventional Commits. No hagas merge a `main`.
```

