# Perfil técnico y necesidades de aprendizaje

> Documento generado en la Fase 1 a partir de la entrevista. Es la base para diseñar el `temario.md` (Fase 2).
> Los puntos marcados como **(inferido)** son conclusiones mías a partir de tus respuestas, no cosas que dijiste directamente. Corrígelos si no te representan.

---

## 1. Resumen ejecutivo

Desarrollador **junior con enfoque frontend**, con 1 año programando y 2 años en entorno profesional (principalmente sitios con WordPress y herramientas no-code/low-code). Ya construye aplicaciones reales con **Astro + Tailwind + MongoDB + Better Auth** y las despliega en Vercel, pero lo hace sin una base sólida de TypeScript, de modelado de datos ni de backend. Quiere **subir de nivel** y entender a fondo servidores y bases de datos.

---

## 2. Experiencia y nivel

| Aspecto | Detalle |
|---|---|
| Tiempo programando | 1 año |
| Tiempo en entorno profesional | 2 años |
| Nivel autopercibido | Junior |
| Área más fuerte | Frontend |
| Lenguaje que domina | JavaScript |
| TypeScript | No lo sabe usar. Aparece en sus proyectos (por plantillas/configuración por defecto) pero no sabe configurarlo ni programar con él |

---

## 3. Stack de trabajo

**Herramientas y plataformas**
- WordPress, Bricks Builder
- Hostinger, DreamHost (hosting tradicional)
- Vercel (despliegue de proyectos, dominios y subdominios)
- Namecheap (compra de dominios y enlace a Vercel)

**Entorno de desarrollo**
- macOS
- iTerm2
- Visual Studio Code

**Tecnologías de la plataforma que vamos a construir (autoevaluación 1-10)**

| Tecnología | Nivel |
|---|---|
| Astro | 8 / 10 |
| Tailwind CSS (v4) | 4 / 10 |
| React | 5 / 10 |
| MongoDB | 4 / 10 |

**Git y flujo de trabajo**
- Git: solo comandos básicos.
- Despliegue: Vercel, con dominios propios.
- Testing: no mencionó experiencia **(inferido: ninguna)**.

---

## 4. Proyectos realizados

### 4.1 Planificador 2026
Planificador anual personal y autoalojable.
- Vista de los 12 meses de 2026 o 2027.
- Marcado de días por categorías de color, notas e imágenes adjuntas.
- Avisos programados que llegan al teléfono por **Telegram**.
- Datos en su propio clúster de **MongoDB** y despliegue propio.

### 4.2 App de seguimiento de fuerza, running, nutrición e hidratación
Construida sobre un plan de recomposición + 5K de 12 semanas (descrito en `rutina.md`).
- **Astro 7** con View Transitions y renderizado en servidor (SSR).
- **Tailwind CSS v4** vía `@tailwindcss/vite`, con tema oscuro/claro.
- **MongoDB Atlas** + **Better Auth** (email y contraseña).
- **Chart.js** para gráficas.
- Desplegado en **Vercel**.

### Autenticación y APIs
- Ha implementado autenticación con sesiones usando Better Auth y `@better-auth/mongo-adapter`.
- Nivel: básico (registro/login con correo y contraseña, nada avanzado).
- No mencionó haber diseñado APIs propias de forma explícita.

---

## 5. Lo que sabe vs. lo que le falta

### Ya domina o maneja bien
- JavaScript (nivel con soltura).
- Astro (maquetación, SSR, View Transitions).
- Despliegue básico en Vercel y gestión de dominios/DNS.
- Flujo básico de autenticación con Better Auth.

### Conoce de forma superficial (hay uso real, pero sin fundamentos)
- **TypeScript:** está presente en sus proyectos, pero no sabe configurarlo ni escribir tipos.
- **MongoDB:** lo usa conectado a sus apps (4/10), sin modelado, índices ni consultas avanzadas **(inferido)**.
- **React:** lo usa (5/10), probablemente sin dominar hooks, estado y patrones de composición **(inferido)**.
- **Tailwind CSS v4:** lo usa (4/10), con probable falta de dominio en la configuración basada en CSS, theming y diseño responsivo sistemático **(inferido)**.
- **Git:** solo comandos básicos (sin ramas, flujos de trabajo ni resolución de conflictos) **(inferido)**.

### Quiere aprender desde cero
- **Servidores** (explícito).
- **Bases de datos** (explícito).

---

## 6. Necesidades de aprendizaje priorizadas

> Prioridad según impacto en sus proyectos actuales y en su objetivo de "subir de nivel".

| Prioridad | Tema | Motivo |
|---|---|---|
| Alta | **TypeScript** | Está en todos sus proyectos y no lo entiende. Es el mayor cuello de botella actual |
| Alta | **MongoDB y modelado de datos** | Autoevaluación más baja (4/10) y pedido explícito de aprender bases de datos |
| Alta | **Fundamentos de servidores** | Pedido explícito: Linux, redes/HTTP, procesos, despliegue más allá de Vercel |
| Alta | **Bases de datos en general** | Pedido explícito: conceptos, SQL vs NoSQL, índices, transacciones, relaciones |
| Media | **React** | 5/10: hooks, estado, composición, islas de React dentro de Astro |
| Media | **Backend y APIs en Astro** | Endpoints, validación, manejo de errores, autenticación y autorización más profundas |
| Media | **Tailwind CSS v4** | 4/10: sistema de diseño, theming, light/dark, tipografía |
| Media | **Git** | Ramas, pull requests, flujo de trabajo, resolución de conflictos |
| Baja | **Testing** | Sin experiencia mencionada |
| Baja | **Seguridad, rendimiento y CI/CD** | Complementarios para llegar a nivel intermedio-avanzado |

---

## 7. Objetivo y forma de aprender

| Aspecto | Respuesta |
|---|---|
| Meta principal | Subir de nivel |
| Tiempo disponible | 4 horas por semana, en sesiones de 1 hora |
| Estilo de aprendizaje | Ejemplos de código, ejercicios prácticos y construcción de proyectos |
| Idioma del contenido | Mayormente español, con términos técnicos en inglés |
| Primer curso | Sin preferencia (decide el mentor) |

**Implicaciones para el diseño del temario**
- Cada sección debe poder completarse en **una sesión de ~1 hora**.
- Mucho código ejecutable, ejercicios al final de cada sección y proyectos que integren lo aprendido.
- Teoría breve y siempre aterrizada en ejemplos.
- Español como idioma base; términos como *hooks*, *endpoint*, *middleware*, *schema* o *query* se mantienen en inglés.
- Con ~4 h/semana, el temario completo se medirá en meses: conviene ordenarlo para que cada nivel entregue valor por sí solo.

---

## 8. Sugerencia para el primer curso (por confirmar)

Como no tienes preferencia, mi propuesta es empezar por **TypeScript**, porque:
1. Ya está en todos tus proyectos y hoy es una caja negra.
2. Mejora todo lo demás que vas a aprender (React, APIs, modelado de datos con MongoDB).
3. Es el mejor punto de partida para el resto del temario y para la primera página de la plataforma.

Alternativa: empezar por **fundamentos de bases de datos y MongoDB**, si prefieres atacar primero lo que más te interesa.

---

## 9. Pendiente de confirmar

- ¿El perfil refleja bien tu situación?
- ¿Estás de acuerdo con las prioridades de la sección 6?
- ¿Empezamos por TypeScript o prefieres otro primer curso?
