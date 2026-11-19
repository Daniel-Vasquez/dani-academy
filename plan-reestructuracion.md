# Plan de reestructuración editorial · "Al grano"

> **Para la IA que ejecute este plan:** trabaja **una sola Tanda por sesión**, y solo cuando la persona la autorice. Antes de editar nada, lee también `guia-maquetacion-cursos.md`. Si una regla de este plan contradice esa guía, **gana este plan** en el contenido didáctico; en la maquetación (sintaxis, componentes, frontmatter), gana la guía. Al terminar la Tanda, pasa el checklist de la §5 y detente.

Fecha de la auditoría: 2026-11-18. Base: commit `ebe7f3b`.

---

## 0. Auditoría

### 0.1 Qué hay

- **24 cursos** en `src/content/courses.json`. **P1 (Proyecto integrador) no tiene ninguna sección**, y queda fuera.
- **23 cursos con contenido y 125 secciones** (`src/content/sections/<slug>/NN-*.mdx`), todas publicadas, cada una con su evaluación (`src/content/quizzes/<id>.yaml`).
- **272.000 palabras de prosa y 202.000 de código** (57 % prosa), en 2.762 bloques de código y 668 bloques `risk`.

| Curso | Título                               | Secc. | Prosa  | Código | Entrada media | Analogías | `risk` > 3 viñetas | Pasos con código sin `risk` | Sección más larga |
| ----- | ------------------------------------ | ----- | ------ | ------ | ------------- | --------- | ------------------ | --------------------------- | ----------------- |
| B1    | TypeScript desde cero                | 8     | 16.740 | 7.446  | 138           | 2         | 4                  | 0                           | B1.8 (2.738)      |
| B2    | Git y flujo de trabajo               | 4     | 10.593 | 4.442  | 154           | 0         | 3                  | 3                           | B2.3 (3.003)      |
| B3    | Cómo funciona la web                 | 5     | 14.619 | 7.604  | 159           | 0         | 4                  | 1                           | B3.5 (3.143)      |
| B4    | Fundamentos de bases de datos        | 5     | 12.270 | 4.934  | 165           | 0         | 0                  | 1                           | B4.3 (2.648)      |
| B5    | MongoDB esencial                     | 6     | 12.275 | 7.462  | 158           | 0         | 2                  | 2                           | B5.1 (2.282)      |
| B6    | React esencial                       | 7     | 12.803 | 7.256  | 153           | 0         | 2                  | 0                           | B6.6 (2.059)      |
| B7    | Tailwind CSS v4 esencial             | 5     | 9.994  | 6.435  | 156           | 0         | 1                  | 1                           | B7.4 (2.429)      |
| I1    | TypeScript intermedio                | 6     | 13.597 | 11.178 | 178           | 0         | 1                  | 0                           | I1.6 (3.010)      |
| I2    | React intermedio                     | 6     | 12.610 | 9.545  | 185           | 0         | 3                  | 0                           | I2.1 (2.510)      |
| I3    | Backend con Astro                    | 6     | 11.028 | 12.755 | 194           | 0         | 1                  | 1                           | I3.1 (2.042)      |
| I4    | Modelado de datos con MongoDB        | 6     | 12.774 | 13.598 | 202           | 1         | 2                  | 0                           | I4.3 (2.529)      |
| I5    | Autenticación y autorización a fondo | 4     | 8.171  | 7.402  | 168           | 0         | 0                  | 0                           | I5.2 (2.293)      |
| I6    | Servidores Linux                     | 6     | 10.784 | 6.333  | 187           | 0         | 0                  | 1                           | I6.2 (2.072)      |
| I7    | Sistema de diseño con Tailwind v4    | 5     | 8.611  | 8.449  | 170           | 0         | 0                  | 2                           | I7.4 (2.070)      |
| I8    | Testing                              | 6     | 10.767 | 12.275 | 174           | 0         | 0                  | 0                           | I8.2 (1.978)      |
| A1    | TypeScript avanzado                  | 5     | 9.407  | 8.079  | 163           | 0         | 0                  | 0                           | A1.5 (2.113)      |
| A2    | MongoDB avanzado                     | 5     | 9.090  | 9.719  | 203           | 0         | 0                  | 0                           | A2.1 (2.105)      |
| A3    | SQL y PostgreSQL                     | 6     | 16.971 | 26.540 | 195           | 0         | 0                  | 1                           | A3.3 (4.040)      |
| A4    | Despliegue en servidores propios     | 6     | 20.268 | 11.231 | 275           | 6         | 15                 | 0                           | A4.2 (4.160)      |
| A5    | Seguridad web                        | 5     | 11.650 | 5.739  | 222           | 5         | 15                 | 0                           | A5.1 (2.756)      |
| A6    | Rendimiento y observabilidad         | 4     | 9.343  | 4.688  | 166           | 4         | 17                 | 6                           | A6.4 (2.564)      |
| A7    | CI/CD con GitHub Actions             | 4     | 7.464  | 2.356  | 159           | 4         | 16                 | 1                           | A7.4 (2.118)      |
| A8    | Arquitectura con Astro y React       | 5     | 10.008 | 6.391  | 201           | 5         | 4                  | 24                          | A8.2 (2.302)      |

"Entrada" = palabras antes del primer `##`. "Prosa" = palabras fuera de los bloques de código.

### 0.2 Dónde sobra teoría (patrones medidos)

1. **La entrada se dice tres veces.** La página ya muestra el `summary` bajo el título. Después, cada lección repite la idea en un párrafo de entrada (de 138 a 275 palabras de media según el curso) y otra vez en "**Lo que tendrás al terminar:**" (125 de 125 lecciones).
2. **Pasos de pura teoría, sin código.** Ejemplo: B1.1, Paso 1, con 217 palabras, una analogía y ningún bloque de código. La idea se demuestra de verdad tres pasos después.
3. **Analogías.** Hay 27 ("Una analogía: …"), sobre todo en A4 a A8. Ocupan un párrafo y repiten lo que el código demuestra.
4. **Explicación línea a línea.** Listas numeradas que comentan **todas** las líneas, también las obvias. Ejemplo: B1.1, Paso 2, con 121 palabras para 6 comandos de terminal.
5. **Bloques `risk` hinchados.** Tienen 106 palabras y 2,8 viñetas de media, y 90 superan las 3 viñetas, sobre todo en A4 (15), A5 (15), A6 (17 de 18) y A7 (16 de 17). Muchas viñetas repiten lo explicado en la prosa o mezclan dos trampas.
6. **El Resumen repite la lección:** 13.600 palabras en total, unas 109 por sección.
7. **Párrafos de transición** ("Ahora vas a…", "Antes de instalar nada, piensa…", "Esta es la sección más útil del curso").

### 0.3 Desviaciones que ya existen (no vienen de este plan)

El _script_ de la §5.2, ejecutado sobre `HEAD`:

- **40 pasos con código y sin `risk`.** Casi todos están en A8 (24) y A6 (6). La primera versión del validador contaba 44: tomaba por pasos los `##` de un README dentro de un bloque de código, y ya está corregido.
- **Las 5 lecciones de A8 no tienen `## Ejercicio práctico`.** El bloque `exercise` va directamente tras el último paso.
- **2 marcadores de código incompleto:** `fundamentos-de-bases-de-datos/05-transacciones-y-acid.mdx:304` (`// ...todas las operaciones...`) y `git-y-flujo-de-trabajo/04-github-remotos-y-pull-requests.mdx:449` (`# ...edita, prueba...`).

Cada Tanda corrige las de sus cursos. No hace falta una Tanda aparte.

### 0.4 Qué se conserva en cada archivo

En todas las lecciones, sin excepción: el frontmatter, el nombre del archivo, los `## Paso N` (numeración y orden), `## Ejercicio práctico` y `## Resumen`, los `<Callout>` con su sintaxis, **todo el código y sus salidas reales**, las rutas `// Archivo:` y las referencias por ID (`B4.3`). El detalle está en la §2.

---

## 1. Guía de estilo "Al grano"

### 1.1 La estructura de cada paso

Cada `## Paso N` trata **un solo concepto**, con este orden fijo:

````mdx
## Paso N: ⟨concepto en minúscula⟩

**Qué es:** ⟨definición directa, 2 o 3 líneas como máximo⟩.

**Cómo se usa:**

```ts
// Archivo: src/…
⟨código completo, el mismo que ya había⟩
```

```text
⟨salida real, la misma que ya había⟩
```

- **⟨Línea o decisión clave⟩:** ⟨por qué⟩. (1 a 3 viñetas: solo lo que no es obvio)

<Callout type="risk">

- **⟨Trampa⟩:** ⟨qué pasa y cómo evitarlo⟩.
- **⟨Trampa⟩:** ⟨…⟩.

</Callout>
````

- **`**Qué es:**` y `**Cómo se usa:**`** son párrafos en negrita, **no** títulos `###`: el índice de la página no cambia y no se añade ningún componente.
- **Un paso sin código** (una tabla de referencia, una decisión) lleva `**Qué es:**` y la tabla, sin `**Cómo se usa:**`. Si tampoco hay tabla, probablemente sobra: fusiónalo con el paso donde se demuestra.
- **Si un paso solo explicaba un comando del anterior,** fusiónalo con ese paso.

### 1.2 Reglas de redacción

1. **Entrada: 1 o 2 frases, 60 palabras como máximo,** con lo que el `summary` **no** dice: el problema concreto o el punto de partida. Nunca repitas el `summary`.
2. **"Lo que tendrás al terminar" desaparece.** Ya lo dice el `summary`. **"Requisitos" se queda**, en una sola línea.
3. **Sin analogías, historia ni frases de transición.** Si una idea necesita una analogía para entenderse, falta un ejemplo de código.
4. **"Qué es":** sujeto y verbo en la primera frase. Ni "En esta sección…" ni "Antes de…".
5. **Explica solo las líneas clave:** lo que sorprende, lo que se suele hacer mal o lo que cambia el resultado. No describas un `mkdir`.
6. **`risk`: de 2 a 3 viñetas, unas 45 palabras cada una como máximo,** con una sola trampa por viñeta. Si una trampa ya está en la prosa, va en el `risk` y no en la prosa, nunca en los dos.
7. **Resumen: de 4 a 6 viñetas de una línea,** con unas 15 palabras cada una como máximo.
8. **Tablas** para referencias (tipos, opciones, errores frecuentes), no párrafos.
9. **Las medidas no se tocan.** Las frases que dicen dónde y con qué se midió quedan en una línea. Las cifras y salidas no cambian.
10. **Objetivo:** recortar entre un 35 y un 45 % de la prosa por lección, sin quitar código ni salidas. Si un recorte obliga a cambiar código, ese código **se vuelve a ejecutar** y su salida se copia literal. Nunca se inventa una salida.

### 1.3 Antes y después (fragmento real: B1.1)

**Antes** (`01-que-es-typescript.mdx`, Paso 1: 217 palabras, sin código):

```mdx
## Paso 1: entender el problema que resuelve TypeScript

Antes de instalar nada, piensa en cómo funciona JavaScript. JavaScript es un lenguaje de **tipado dinámico**: una variable puede contener un número ahora y un texto después, y nadie comprueba nada hasta que el código **se ejecuta**. Si una función espera un número y le llega un texto, JavaScript no se queja: hace lo que puede con lo que recibe.

Una analogía: JavaScript es como un cocinero que no lee la receta antes de empezar. Si le das sal en lugar de azúcar, no protesta al recibirla: lo descubres cuando pruebas el pastel. TypeScript es un **ayudante que lee la receta antes de que enciendas el horno** y te dice "esto que me pasas es sal, y la receta pide azúcar".

Técnicamente, TypeScript es **JavaScript más un sistema de tipos**:

- Todo JavaScript válido es TypeScript válido (puedes renombrar un `.js` a `.ts` y empezar).
- Tú añades **anotaciones de tipo** (por ejemplo, "este parámetro es un número").
- Un programa, el **compilador** (`tsc`), lee tu código, comprueba que los tipos encajan y te avisa de los errores **sin ejecutar nada**.
- Después, los tipos **se borran**: lo que se ejecuta en el navegador o en Node es JavaScript normal.

Esa última frase es la más importante de la sección, y en el Paso 6 la vas a comprobar tú mismo.
```

**Después.** El Paso 1 desaparece: su definición pasa a ser el `**Qué es:**` del paso que la demuestra, el antiguo Paso 5. Ese paso reutiliza **el mismo código y la misma salida** que ya tenía la lección:

````mdx
## Paso 4: el mismo código en TypeScript

**Qué es:** TypeScript es JavaScript con anotaciones de tipo. El compilador (`tsc`) comprueba que encajan **sin ejecutar nada**, y luego las borra: se ejecuta JavaScript normal.

**Cómo se usa:**

```ts
// Archivo: src/01-suma.ts
function sumarKm(a: number, b: number): number {
  return a + b;
}

const kmLunes = Number("5"); // convertimos el texto del formulario a número
const kmMartes = 3;

const total = sumarKm(kmLunes, kmMartes);
console.log(`Total de la semana: ${total} km`);
console.log(`¿Supera los 10 km? ${total > 10}`);
```

Quita el `Number(...)`, deja `"5"`, y ejecuta `npm run typecheck`:

```text
src/01-suma.ts:9:23 - error TS2345: Argument of type 'string' is not assignable to parameter of type 'number'.

9 const total = sumarKm(kmLunes, kmMartes);
                        ~~~~~~~

Found 1 error in src/01-suma.ts:9
```

- **`a: number`:** el parámetro debe ser un número. **`): number`:** lo que devuelve.
- **`9:23` y `TS2345`:** la línea, la columna y el código del error. VS Code lo subraya con el mismo motor.

<Callout type="risk">

- **`tsx` no comprueba tipos:** con `"5"`, `npm start` vuelve a decir 53 km. Usa `npm run typecheck` (o `tsc --noEmit`) antes de cada _commit_ y en el CI.
- **`Number("cinco")` es `NaN`, y sigue siendo un `number`:** los tipos comprueban la forma, no el valor. Los valores se validan con Zod (I1).

</Callout>
````

Resultado: se fusionan los pasos 1 y 5, y desaparecen la analogía, la transición y la lista de cuatro viñetas. Se conservan el código, la salida y las dos trampas, y la prosa baja de unas 480 palabras a unas 150.

---

## 2. Reglas de preservación (no se tocan)

**Archivos que no se editan en ninguna Tanda:**

- `src/content/quizzes/*.yaml`: las evaluaciones.
- `src/content/courses.json` y `src/content.config.ts`.
- Todo lo que hay fuera de `src/content/sections/`: páginas, componentes, _layouts_, estilos, `src/lib`, `src/server` y tests.
- `guia-maquetacion-cursos.md`, hasta que la persona apruebe el piloto (§6).

**Dentro de cada `.mdx`:**

1. **Frontmatter:** `sectionId`, `course`, `title`, `order` y `summary` quedan idénticos. Son claves del progreso y de las notas, títulos del índice y texto del buscador. Solo `minutes` puede cambiar, y solo si la persona lo aprueba (§6).
2. **Nombre y ruta del archivo:** son la URL, y los tests E2E usan varias.
3. **Pasos:** se pueden fusionar o quitar, pero los que queden se renumeran del 1 en adelante sin huecos. Los dos últimos `##` son siempre `## Ejercicio práctico` y `## Resumen`.
4. **Componentes:** solo `<Callout type="risk|exercise|mastery">`, sin `import`, con una línea en blanco tras la apertura y antes del cierre, y el contenido sin sangría. Un `exercise` y un `mastery` por lección.
5. **Ni HTML ni clases de Tailwind** en el MDX: no tendrían efecto, porque `@source not "../content"`.
6. **Código:** no se borra ni se cambia ningún bloque que se ejecute en el laboratorio, ni su salida `text`. Se conserva la primera línea `// Archivo:`. Se puede quitar un bloque duplicado, si el validador lo lista y se justifica.
7. **El enunciado del ejercicio y el criterio "Lo dominas si…"** vienen de `temario.md`. Se pueden acortar las frases, pero no cambiar lo que piden.
8. **Lo que citan las evaluaciones:** las `explanation` de los YAML mencionan 81 veces una sección (`en A7.1…`) y datos medidos en ella. Antes de recortar una lección, busca su ID en el YAML de su curso. **Cada dato citado debe seguir apareciendo en la lección.**
9. **Lo que usan los tests E2E:**
   - Las palabras `getStaticPaths` e `hidratación` en el contenido (`tests/e2e/search.spec.ts`).
   - Los bloques de código de `backend-con-astro/05` y `06` (`copy-code.spec.ts`).
   - El título "Tipos primitivos e inferencia" de B1.2 (`notes.spec.ts`).
   - Las 8 secciones de B1 (`learning-flow.spec.ts`).
10. **Referencias cruzadas por ID** (`B1.6`, `I3.5`): si un paso citado desaparece por una fusión, actualiza el texto que lo cita, también en otros cursos (`grep -rn "B1\.6" src/content/sections`).
11. **MDX:** fuera de código, nada de `{`, `}` ni `<` seguido de una letra.

---

## 3. Tanda 1 · Piloto: TypeScript desde cero (B1)

8 lecciones, 16.740 palabras de prosa. **Objetivo: unas 10.000** (−40 %), con el mismo código. Lo que citan las evaluaciones (`b1.yaml`), y por tanto se conserva:

- el literal `"dark"` con `const`, en B1.2;
- `any` frente a `unknown`, en B1.2;
- `interface` frente a `type` y la fusión de declaraciones, en B1.4;
- el discriminante `ok` y la variante `{ ok: false; error: string }`, en B1.4 y B1.6;
- las opciones que activa `strict`, en B1.1 y B1.7.

| Archivo                                | Prosa → objetivo | Qué se recorta o se reformula                                                                                                                                                                                                                                                                                                                                                                      |
| -------------------------------------- | ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `01-que-es-typescript.mdx`             | 2.007 → 1.200    | Entrada (137 p) a 2 frases, y fuera "Lo que tendrás". **Paso 1 (217 p, analogía, sin código) se fusiona con el Paso 5**, como en la §1.3. Paso 2: la lista de 6 comandos (121 p) se queda en `--save-dev` y `tsx`; los campos de `package.json` (61 p), en 2. Paso 5: "Cómo leer el error" pasa a una viñeta. Paso 7: las 5 funciones del editor (107 p), en una tabla de 3 filas. Pasos de 7 a 6. |
| `02-tipos-primitivos-e-inferencia.mdx` | 2.040 → 1.250    | Entrada (130 p). Paso 1: la lista de primitivos (93 p) pasa a una tabla de tipo y ejemplo. Paso 2: el `risk` de los arrays vacíos (121 p) a una viñeta. Paso 3: la lista numerada de los 3 sitios donde anotar (114 p) a 3 viñetas cortas. Paso 5: la explicación (95 p) y el `risk` de "largo a propósito" (100 p) se recortan. **Se conserva el literal `"dark"`** del Paso 7.                   |
| `03-arrays-tuplas-y-objetos.mdx`       | 2.022 → 1.200    | Entrada (132 p). Los `risk` de los pasos 1, 2 y 3 (91 a 123 p) se dejan en 2 viñetas cada uno. Paso 5, tipado estructural: se conserva la explicación (es el concepto) y su `risk` (127 p) se reduce. Paso 6: la lista numerada (137 p) y el `risk` (163 p, el más largo del curso) se recortan.                                                                                                   |
| `04-type-vs-interface.mdx`             | 1.883 → 1.150    | Entrada (129 p). Paso 3: un solo `risk` para `extends` frente a `&`. **Se conservan la fusión de declaraciones del Paso 5 y el ejemplo con `ok`.** Paso 6: la convención (108 p) en 3 reglas.                                                                                                                                                                                                      |
| `05-funciones-tipadas.mdx`             | 1.941 → 1.150    | Entrada (138 p). `risk` del Paso 1 (124 p, 4 viñetas) a 3. Paso 3: `risk` de 120 p. Paso 5: la lista numerada (139 p) y el `risk` sobre `as` (178 p) se recortan, conservando la demostración con la URL errónea. Paso 6, sobrecargas "para reconocerlas": se queda en un bloque y una viñeta.                                                                                                     |
| `06-uniones-y-narrowing.mdx`           | 1.853 → 1.150    | Entrada (155 p), sin "la sección más útil del curso" ni la analogía. `risk` de los pasos 2, 4 y 6 (106 a 114 p). Paso 5: se conserva la unión discriminada completa. El `risk` del ejercicio (116 p) explica el genérico: se queda en una viñeta con referencia a A1.                                                                                                                              |
| `07-modulos-y-tsconfig.mdx`            | 2.256 → 1.350    | Entrada (139 p). `risk` de los pasos 2, 3, 4 y 5 (114 a 146 p): 2 o 3 viñetas cada uno. **Paso 6, el `tsconfig.json` línea a línea (461 p de prosa):** pasa a una tabla de opción, qué hace y cuándo importa. **Se conservan las opciones que activa `strict`.** `risk` del ejercicio, de 123 p.                                                                                                   |
| `08-typescript-en-astro.mdx`           | 2.738 → 1.550    | Entrada (141 p). Paso 1: `risk` de 122 p. Paso 5, endpoints: 446 p de prosa; la lista numerada de 4 comprobaciones (102 p) a 4 viñetas cortas. Paso 6, `astro:env`: 477 p, y el `risk` de 185 p (5 viñetas) a 3. **Paso 7 (tabla de errores, sin código y sin `risk`)** se queda como tabla con `**Qué es:**`: es una referencia útil.                                                             |

Comandos al terminar: los de la §5. Un _commit_ al final: `content(B1): reestructuración "al grano"`.

---

## 4. Tandas siguientes

Mismo procedimiento, **un curso cada vez dentro de la Tanda** (editar, validar y pasar al siguiente), con un _commit_ por Tanda. El tamaño está pensado para no pasar de unas 35.000 palabras de prosa por sesión.

| Tanda | Cursos                                         | Secc. | Prosa  | Atención especial                                                                                                   |
| ----- | ---------------------------------------------- | ----- | ------ | ------------------------------------------------------------------------------------------------------------------- |
| 2     | B2 Git · B3 Cómo funciona la web               | 9     | 25.200 | B2.4: el marcador `# ...edita, prueba...`. B3.1: un paso sin `risk`. B3.5 es la más larga del nivel.                |
| 3     | B4 Fundamentos de BD · B5 MongoDB esencial     | 11    | 24.500 | B4.5: el marcador `// ...todas las operaciones...`.                                                                 |
| 4     | B6 React esencial · B7 Tailwind esencial       | 12    | 22.800 | B6.7 lo usan otros cursos como referencia de islas: cuidado con los IDs.                                            |
| 5     | I1 TypeScript intermedio · I2 React intermedio | 12    | 26.200 | I2.6 la cita I3.1 (`Suspense` y el `fallback`).                                                                     |
| 6     | I3 Backend con Astro · I4 Modelado con MongoDB | 12    | 23.800 | I3.5 e I3.6: bloques que usan los E2E (§2.9). I3.5 lo cita A8.4.                                                    |
| 7     | I5 Autenticación · I6 Servidores Linux         | 10    | 19.000 | I5: no publicar detalles de seguridad de la plataforma.                                                             |
| 8     | I7 Sistema de diseño · I8 Testing              | 11    | 19.400 | 2 pasos de I7 sin `risk`.                                                                                           |
| 9     | A1 TypeScript avanzado · A2 MongoDB avanzado   | 10    | 18.500 | Entrada media de A2: 203 palabras.                                                                                  |
| 10    | A3 SQL y PostgreSQL                            | 6     | 17.000 | El curso con más código (26.500). A3.3, de 4.040 palabras, es la segunda lección más larga.                         |
| 11    | A4 Despliegue en servidores propios            | 6     | 20.300 | Entrada media de 275 palabras, 6 analogías y 15 `risk` de más de 3 viñetas. A4.1 y A4.2 superan las 4.000 palabras. |
| 12    | A5 Seguridad web · A6 Rendimiento              | 9     | 21.000 | 32 `risk` de más de 3 viñetas y 9 analogías. 6 pasos de A6 sin `risk`.                                              |
| 13    | A7 CI/CD · A8 Arquitectura                     | 9     | 17.500 | A8: añadir `## Ejercicio práctico` en las 5 lecciones y `risk` en 24 pasos. A7 tiene un 76 % de prosa.              |

P1 no entra en ninguna Tanda.

---

## 5. Checklist de validación por Tanda

### 5.1 Lista rápida

- [ ] **El validador da `✓` en cada archivo** de la Tanda (§5.2), sin `ERROR`. Los avisos de bloques eliminados están revisados uno a uno.
- [ ] **La prosa baja entre un 35 y un 45 %** por lección (lo dice el validador). Menos de un 25 % es poco; más de un 55 %, sospechoso.
- [ ] **Ningún bloque de código ni salida `text` ha cambiado,** salvo los justificados y vueltos a ejecutar.
- [ ] **Cada paso con código tiene `**Qué es:**`, `**Cómo se usa:**` y un `risk`** de 2 o 3 viñetas.
- [ ] **Entrada de 60 palabras o menos,** sin "Lo que tendrás al terminar" ni analogías.
- [ ] **Los datos que citan las evaluaciones del curso siguen en su lección** (§2.8): `grep` de cada uno.
- [ ] **Las referencias por ID siguen siendo válidas** (§2.10).
- [ ] **Comandos en verde:** `npx prettier --check .`, `npx eslint .`, `npx astro check`, `npx vitest run`, `npm run test:e2e:local` y `npm run build`.
- [ ] **Comprobación visual:** abre dos lecciones de la Tanda, en claro y oscuro y a 412 px. Nada desborda, los `Callout` se ven y el código tiene su botón de copiar.
- [ ] **La evaluación del curso se aprueba** con sus respuestas, y el progreso se guarda (lo cubre `learning-flow.spec.ts` para B1; en las demás, un E2E temporal).

### 5.2 El validador

Guárdalo como `scripts/validar-tanda.py` en la Tanda 1, y ejecútalo antes del _commit_ contra la versión anterior:

```bash
python3 scripts/validar-tanda.py HEAD src/content/sections/typescript-desde-cero
```

````python
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
    # Los ## dentro de un bloque de código (un README de ejemplo) no son pasos
    marcado = FENCE.sub("⟦CÓDIGO⟧", cuerpo)
    for bloque in re.split(r"^## ", marcado, flags=re.M)[1:]:
        titulo = bloque.splitlines()[0]
        if titulo.startswith("Paso") and "⟦CÓDIGO⟧" in bloque and 'type="risk"' not in bloque:
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
````

Comprobado sobre el contenido actual: B1 pasa sin errores, con sus avisos (entradas de 129 a 155 palabras, 2 analogías y 3 `risk` de más de 3 viñetas). En todo el contenido marca exactamente las desviaciones de la §0.3. Tiene límites: lee el MDX con expresiones regulares y no sustituye a una lectura.

---

## 6. Decisiones pendientes (las toma la persona antes de la Tanda 1)

| Decisión                                                             | Recomendación                                                                                         |
| -------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| ¿Quitar "**Lo que tendrás al terminar:**" de las 125 lecciones?      | **Sí:** repite el `summary`, que la página ya muestra debajo del título.                              |
| ¿Etiquetas visibles `**Qué es:**` y `**Cómo se usa:**` en cada paso? | **Sí, como párrafos en negrita:** hacen visible la estructura sin añadir títulos ni componentes.      |
| ¿Recalcular `minutes` tras el recorte?                               | **No en el piloto.** Medirlo después de la Tanda 1 y decidir para todas a la vez.                     |
| ¿Actualizar `guia-maquetacion-cursos.md`?                            | **Sí, después del piloto aprobado:** su §2 (plantilla) y su §4 (regla 5) describen el formato actual. |
| ¿Corregir en su Tanda las desviaciones previas de la §0.3?           | **Sí:** se corrigen al tocar el curso.                                                                |
