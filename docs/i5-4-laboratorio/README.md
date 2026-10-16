# Laboratorio de I5.4 · Autorización

Código de la app `entrenos-app` (la del curso I3, con Better Auth de I5.2–I5.3) tal como quedó
al preparar I5.4. Está aquí como referencia para escribir la lección; **no forma parte de la
plataforma**. Los archivos llevan la extensión `.ts.txt` para que `astro check`, ESLint y
Prettier no los procesen (sus imports apuntan a archivos de esa otra app).

| Archivo                              | Qué contiene                                                                                                                                                                                             |
| ------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/lib/auth.ts.txt`                | Configuración de Better Auth: sesión (`expiresIn`, `updateAge`, `cookieCache`), campos adicionales `zonaHoraria` y `rol` (`input: false`, por defecto `"user"`), tipo `UsuarioSesion` y `aUsuarioSesion` |
| `src/lib/sesion.ts.txt`              | `ProhibidoError` (403), `usuarioDe` (401), `exigirRol` y `exigirAdmin` (relee la sesión sin caché de cookies)                                                                                            |
| `src/pages/api/admin/resumen.ts.txt` | Endpoint solo para administradores, protegido con `exigirAdmin`                                                                                                                                          |
| `scripts/i5/04-rol.ts.txt`           | Script para dar o quitar el rol de administrador (`node --env-file=.env scripts/i5/04-rol.ts <email> admin\|user`)                                                                                       |
| `mediciones-roles.txt`               | Resultado medido con `curl` contra el servidor de desarrollo del laboratorio                                                                                                                             |

Lo que muestran las mediciones:

- Un usuario recién registrado recibe `rol: "user"`.
- Sin rol de administrador, el endpoint responde 403; sin sesión, 401.
- Al dar o quitar el rol con el script, el cambio se aplica al momento con la misma sesión
  abierta, porque `exigirAdmin` lee la sesión con `disableCookieCache` (con la caché de cookies
  habría tardado hasta 5 minutos, I5.3).

Contexto del resto de la app (filtro por `userId` en el repositorio, `usuarioDe` en cada
endpoint, `idUsuario` en las Actions): lecciones I3.5 e I5.3.
