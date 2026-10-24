<div align="center">

# dsh-mcp-panel
- **Canal 1024 store**: `npm i -g dsh1024` una vez, luego `dsh1024 plugin --profile web add dsh-mcp-panel` (cuenta para el ranking de instalaciones de [deepseek1024.com](https://deepseek1024.com)).

**La consola de gestión MCP para el cliente MCP oficial de DeepSeek Harness: añade, edita, elimina y prueba servidores MCP desde una página de ajustes, con estado honesto, diagnósticos de salud y escrituras de perfil seguras y reversibles.**

*Cliente oficial = puente, este plugin = consola: lee el estado por el seam `mcp/status`, escribe solo parches de perfil de solo-anexar y con aprobación.*

[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](LICENSE)
[![Gitee](https://img.shields.io/badge/Gitee-mirror-c71d23?logo=gitee)](https://gitee.com/perrylink/dsh-mcp-panel)
[![DSH plugin](https://img.shields.io/badge/dsh--plugin-✅-green)](https://github.com/topics/dsh-plugin)
[![dsh-doctor](https://raw.githubusercontent.com/PerryLink/dsh-plugin-doctor/main/badges/PerryLink__dsh-mcp-panel.svg)](https://github.com/PerryLink/dsh-plugin-doctor#verified-徽章)
[![DSH Market](https://raw.githubusercontent.com/2BingLing/dsh-market/master/assets/readme/badge-top-rated.svg)](https://dsh.market/)
[![Node](https://img.shields.io/badge/node-%5E22.19%20%7C%7C%20%3E%3D24-brightgreen.svg)](#)
[![CI](https://img.shields.io/github/actions/workflow/status/PerryLink/dsh-mcp-panel/ci.yml?branch=main&label=CI)](https://github.com/PerryLink/dsh-mcp-panel/actions)
[![Version](https://img.shields.io/github/v/tag/PerryLink/dsh-mcp-panel?label=version)](https://github.com/PerryLink/dsh-mcp-panel/releases)
[![npm version](https://img.shields.io/npm/v/dsh-mcp-panel)](https://www.npmjs.com/package/dsh-mcp-panel)
[![npm downloads](https://img.shields.io/npm/dm/dsh-mcp-panel)](https://www.npmjs.com/package/dsh-mcp-panel)
[![dshfind](https://dshfind.com/api/badge/PerryLink/dsh-mcp-panel?metric=downloads&lang=es)](https://dshfind.com/es/plugins/PerryLink/dsh-mcp-panel?ref=badge)

[English](README.md) · [简体中文](README-zh.md) · [Español](README-es.md) · [Português](README-pt.md) · [हिन्दी](README-hi.md)

```sh
dsh plugin --profile <name> add dsh-mcp-panel
```


</div>

---

**📖 Base de conocimiento del ecosistema** — datos medidos, no marketing: [guía de desarrollo · datos de selección · criterios de mantenimiento](https://perrylink.github.io/dsh-plugin-guide/).

<!-- star-cta -->
## Install & uninstall

- **Canal git** (último `main`): `dsh plugin --profile web add github:PerryLink/dsh-mcp-panel` — el script `prepare` construye solo con dependencias de producción.
- **Canal npm** (versiones publicadas): `dsh plugin --profile web add dsh-mcp-panel`.
- **Canal tarball**: `pnpm pack` en este repo, luego `dsh plugin --profile web add ./dsh-mcp-panel-<version>.tgz`.
- **Desinstalar**: elimina la fila `mcp-panel` de `cordis.patch.yml` (la superficie web la recarga en caliente), borra el paquete del `node_modules` del perfil y verifica con `dsh web --dump-config` que no quede ninguna fila `mcp-panel`.

## ⭐ 如果它帮到了你

Este plugin forma parte de la [familia de plugins DSH](https://github.com/PerryLink) (más de 40, todos Apache-2.0). Si te resulta útil, **dale una estrella**: no desbloquea nada, pero ayuda a que la siguiente persona lo encuentre antes.

*English:* part of a 95 plugin family for DeepSeek Harness. If it is useful, **a star helps the next person find it** — nothing is gated behind it.

## What is dsh-mcp-panel?

La consola de gestión MCP para el cliente MCP oficial de DeepSeek Harness: añade, edita, elimina y prueba servidores MCP desde una página de ajustes, con estado honesto, diagnósticos de salud y escrituras de perfil seguras y reversibles.

Cliente oficial = puente, este plugin = consola: lee el estado por el seam `mcp/status`, escribe solo parches de perfil de solo-anexar y con aprobación.

![Diagrama de flujo de dsh-mcp-panel: instalar → abrir panel → actuar.](docs/assets/dsh-mcp-panel-flow.svg)

*Resumen del flujo: instalar → abrir panel → actuar. Los ejemplos siguientes usan la superficie de comandos real.*


*La misma ejecución, animada.*

## Compatibility

| Superficie | Estado |
|---|---|
| Harness | DeepSeek Harness `dsh-v0.2.1-rc.2` (verificado 2026-10-18): `engines.dsh >=0.2.1-0 <0.3.0`; las rutas de compatibilidad P0 tienen pruebas de regresión. |
| Node | `^22.19.0 \|\| >=24.0.0` |
| Plataformas | Web GUI (doble cara: host + navegador) |
| Modelo | Cualquiera (el panel es de solo lectura; solo la salida de `/mcp` es legible por el modelo) |

## What you get

`dsh-mcp-panel` es la capa de experiencia sobre el cliente MCP oficial: una vista de runtime de solo lectura más escrituras de perfil seguras y reversibles.

- **Comando `/mcp`** — una fila por servidor: transporte, destino, número de herramientas, estado de conexión (desde el seam upstream; `unknown` cuando no hay observación), último error, reconexiones — legible por el modelo, reconstruible del log de sesión, cinco idiomas de salida.
- **`/mcp <servidor> tools`** — nombres y descripciones de las herramientas `mcp__*` visibles para el modelo.
- **`/mcp <servidor> health`** — sugerencias de autorreparación derivadas (ENOENT → dependencia faltante, ECONNREFUSED, timeouts, 401/403/404, DNS, rate limit, reconexión agotada…); código de salida / stderr etiquetados honestamente como *pendiente de soporte upstream*.
Las pruebas usan un lote sin registro de pasos del modelo en las versiones con ejecutores y la API de llamada individual en instalaciones anteriores. Ambas rutas conservan los permisos y la política de aprobación activos.

- **`/mcp <servidor> call <tool> [json]`** — llamada de prueba por el **pipeline oficial de herramientas** (`ctx.tools.execute()`); política de permisos pre-ejecución, aprobación, guards y post-ejecución, todo en vigor.
- **Ajustes → Plugins → MCP** — tarjetas de estado con insignias, diagnósticos y sondas, más el CRUD de servidores y el banco de pruebas de herramientas.
- **CRUD de servidores** — formularios de alta/edición/borrado → `insert` para alta y anulaciones dirigidas por id (`- id:` + `name:` + `disabled:`/`config:`) para edición/borrado → copia al portapapeles o escritura con aprobación, copias de seguridad automáticas y re-verificación contra el loader.
- **Navegación de Resources** — listado de recursos, listado de plantillas y lecturas de URI de solo lectura mediante las herramientas oficiales `list_mcp_resources` / `list_mcp_resource_templates` / `read_mcp_resource` (puenteadas por el servicio `@deepseek-ai/dsh-mcp-resources`); los resultados se muestran solo en la pestaña, nunca en el contexto del modelo.
- **Banco de pruebas de herramientas** — servidor → herramienta `mcp__*` → argumentos JSON → resultado JSON canónico + contenido renderizado; limitado por `trialMaxResultChars`; solo panel, nunca contexto del modelo.

## Architecture: official client = bridge, this plugin = console

[`@deepseek-ai/dsh-mcp-client`](https://github.com/deepseek-ai/deepseek-harness/tree/master/packages/mcp/mcp-client) es el **único puente**: una instancia por servidor MCP, configurada como fila escrita a mano en `cordis.yml`, que conecta el transporte, sincroniza herramientas y registra los nombres `mcp__<servidor>__<herramienta>`. Este plugin nunca lo sustituye: es la **capa de experiencia** encima:

```text
                    ┌────────────────────────────────────────────┐
 profile            │  cordis.yml / cordis.patch.yml             │
 composición        │   - id: mcp-github                          │
 (una fila por      │     name: '@deepseek-ai/dsh-mcp-client'     │
  servidor, a mano) │     config: { serverName, transport, … }    │
                    │   - id: mcp-panel                           │
                    │     name: dsh-mcp-panel   ◄── este plugin   │
                    └───────────────┬────────────────────────────┘
                                    │
        ┌───────────────────────────┴───────────────────────────┐
        │                                                        │
   ┌────▼──────────────┐        ┌───────────────────────────┐    │
   │ @deepseek-ai/dsh- │        │ dsh-mcp-panel (consola)   │    │
   │ mcp-client        │        │                           │    │
   │ • transporte      │        │ • comando /mcp            │    │
   │ • sincronización  │        │ • Ajustes → Plugins →     │    │
   │ • herramientas    │◄──────►│   MCP: CRUD, banco de     │    │
   │ • seam mcp/status │ estado │ • diagnósticos de salud   │    │
   └───────────────────┘        │ • sondas, capacidades     │    │
                                └───────────────────────────┘    │
```

La consola **lee** el cliente por su seam de observabilidad `mcp/status` (evento + servicio de consulta `mcpStatus`), el registro de herramientas y el loader; **escribe** solo en la capa de parches del perfil — solo-anexar, con aprobación y siempre con copia de seguridad. Transporte, OAuth y protocolo permanecen intactos.

## Console vs. hand-written cordis.yml

| | cordis.yml a mano | Consola dsh-mcp-panel |
|---|---|---|
| Añadir servidor | Editar YAML, cuidar indentación/comillas | Formulario → fragmento de parche → **copiar** o **escribir** (aprobación + copia de seguridad) |
| Editar servidor | Editar YAML, reiniciar/recarga en caliente | Formulario precargado de la fila en vivo; los secretos sin cambios conservan su valor en el host |
| Eliminar servidor | Borrar la fila | Anulación `- id:` + `disabled: true` (el vocabulario de parches no tiene remove) — re-habilitable |
| Ver estado | Leer logs | Insignias + reconexiones + último error, en vivo desde `mcp/status` |
| Probar una herramienta | Pedírselo al modelo | Banco de pruebas → pipeline oficial `ctx.tools.execute()` (permisos y aprobación en vigor) |
| Diagnosticar fallos | grep de logs | `/mcp <servidor> health` con sugerencias derivadas |
| Errores | Revertir a mano | Cada escritura es solo-anexar y deja una copia de seguridad con marca de tiempo |

La salida de la consola ES el vocabulario de `cordis.patch.yml` — las mismas líneas que escribirías a mano, generadas, previsualizadas y aplicadas con seguridad.

## Quick start

```sh
dsh plugin --profile web add github:PerryLink/dsh-mcp-panel
```

```sh
# 1. instala el bundle en tu perfil
dsh plugin --profile web add github:PerryLink/dsh-mcp-panel

# o desde npm (versiones publicadas)
dsh plugin --profile web add dsh-mcp-panel

# 2. reinicia y verifica la fila
dsh --profile web --dump-config | grep -A3 'id: mcp-panel'
```

Luego abre **Ajustes → Plugins → MCP**, o ejecuta:

```text
/mcp
/mcp everything tools
/mcp everything health
/mcp everything call echo '{"message": "hi"}'
```

### Ejemplos

Son los puntos de entrada reales; instala y llama a uno.

#### Ejemplo detallado

**Comando**

~~~sh
/mcp github tools
~~~

**Salida**

~~~text
Tools of "github" (1, model-visible public names):
- mcp__github__create_issue — Create a new issue in a GitHub repository
~~~

*Observado en `plugins/dsh-mcp-panel/tests/command.spec.ts:99-110; renderer at src/command.ts:352-360`*

#### Rama de fallo

**Entrada**

~~~text
/mcp nope tools
~~~

**Salida**

~~~text
Unknown MCP server "nope" (configured: github)
~~~

*Observado en `plugins/dsh-mcp-panel/src/command.ts:104-105; plugins/dsh-mcp-panel/tests/command.spec.ts:152-157`*

#### Ejemplos breves

- `/mcp <server> tools`
- `/mcp <server> health`

## Configuration

Todas las opciones son campos Schemastery `Config` (modificables desde cordis.yml). `cordis.patch.yml` documenta cada clave.

| Clave | Por defecto | Significado |
|---|---|---|
| `probeEnabled` | `true` | Registra la herramienta `mcp_probe` (resultados solo del panel) |
| `probeTimeoutMs` | `10000` | Tiempo límite por sonda en ms |
| `maxProbes` | `10` | Registros de sonda mostrados en el panel |
| `refreshIntervalMs` | `0` | Refresco sugerido del panel en ms; `0` = bajo demanda |
| `outputLanguage` | `en` | Idioma de salida de `/mcp`: `en \| zh \| es \| pt \| hi` |
| `passiveProbeEnabled` | `false` | Sondear periódicamente servidores streamable-http |
| `passiveProbeIntervalMs` | `60000` | Intervalo de sonda pasiva en ms |
| `trialEnabled` | `true` | Banco de pruebas de herramientas (pestaña de ajustes + `/mcp call`) |
| `trialTimeoutMs` | `120000` | Plazo del panel por llamada de prueba en ms |
| `trialMaxResultChars` | `60000` | Tope del payload de resultado de prueba en caracteres |
| `writeEnabled` | `true` | Interruptor de seguridad: `false` rechaza toda escritura (copiar sigue funcionando) |
| `writeVerifyEnabled` | `true` | Re-verifica cada escritura contra el estado re-aplicado del loader antes de reportar éxito |
| `writeVerifyTimeoutMs` | `3000` | Presupuesto de sondeo para la verificación de escritura en ms |
| `backupCount` | `5` | Copias de `cordis.patch.yml` retenidas por escritura |
| `catalogEntries` | `[]` | Superposición de usuario para el directorio recomendado: anexa entradas; una entrada con el mismo `id` reemplaza la integrada |

Las solicitudes de Claude omiten `mcp_probe`; los demás proveedores lo conservan si está habilitado. Las herramientas MCP configuradas y las pruebas manuales del panel siguen disponibles. El cambio de proveedor se aplica en la siguiente solicitud.

## Tools & surfaces

| Superficie | Tipo | Notas |
|---|---|---|
| `/mcp` | command | Fila de estado por servidor; legible por el modelo y reconstruible del log |
| `/mcp <servidor> tools` | command | Nombres + descripciones de `mcp__*` visibles para el modelo |
| `/mcp <servidor> health` | command | Sugerencias de autorreparación derivadas del texto de error saneado |
| `/mcp <servidor> call <tool> [json]` | command | Llamada de prueba por el pipeline oficial de herramientas |
| `mcp_probe` | tool | Sonda opcional de conectividad Streamable HTTP (trabajo en segundo plano) |
| Ajustes → Plugins → MCP | Slot de UI | Tarjetas de estado, CRUD de servidores y banco de pruebas |
| Remote Typert `mcpPanel` | service | Canal de instantáneas de solo lectura (host → cliente) |

## Resources & Prompts

Resources YA están puenteados upstream: el bundle base monta `@deepseek-ai/dsh-mcp-resources`, el cliente oficial registra el provider de recursos de cada conexión en `ctx.mcpResources`, y ese paquete posee las tres herramientas compartidas (`list_mcp_resources`, `list_mcp_resource_templates`, `read_mcp_resource`). La consola detecta el servicio y las herramientas registradas, y ofrece un navegador de Resources de solo lectura (lista / plantillas / lectura de URI) en cada tarjeta de servidor — cada llamada pasa por el pipeline OFICIAL de herramientas y los resultados nunca entran en el contexto del modelo.

Las **plantillas de prompts** y las **suscripciones a recursos** siguen diferidas upstream; el tablero de capacidades marca Prompts **pendiente de soporte upstream**.

## Permissions & data

- **Permisos**: el manifiesto `dshWorkshop` declara `network:outbound` y `native-code:none`.
- **Datos**: el panel es de solo lectura; escribe solo fragmentos de `cordis.patch.yml` de solo-anexar (con aprobación, respaldo primero). Credenciales en URLs, contraseñas userinfo, valores de headers, tokens bearer y JWTs se redactan antes de renderizar; los `headers` configurados nunca entran en ninguna instantánea, y los **valores** de env/headers nunca salen del host (el editor ve solo claves).

## Security boundaries

- **El puente sigue siendo el puente.** Sin cambios de transporte, OAuth o protocolo; una fila mcp-client por servidor, exactamente como a mano.
- **Sin estado falso.** Los campos de conexión sin observaciones upstream leen `unknown` / `—` con `statusSource: 'derived'`; códigos de salida y stderr nunca se inventan.
- **Escrituras solo-anexar, con aprobación y respaldo.** La consola nunca reescribe `cordis.patch.yml`; anexa operaciones generadas, conserva las `backupCount` copias más recientes y re-verifica cada escritura contra el estado re-aplicado del loader antes de reportar éxito (un parche omitido nunca se muestra como éxito).
- **Sin inyección de prompts.** El panel no registra secciones de prompt; su único texto visible al modelo son las dos descripciones de herramienta/comando.

## Known limitations

- **Plantillas de prompts y suscripciones a recursos** están pendientes de soporte upstream — el cliente oficial puentea herramientas y recursos, pero no prompts ni suscripciones.
- **Códigos de salida / stderr** se etiquetan *pendiente de soporte upstream* hasta que el cliente los exponga.
- **Panel de solo lectura** — la consola nunca falsifica un estado de conexión; los campos no observables leen `unknown` / `-1` / `—`.
- **Las escrituras se verifican, no se garantizan** — la consola re-verifica cada escritura contra el estado re-aplicado del loader y falla honestamente cuando el loader no la aplicó (p. ej. una fila insertada por `$DSH_HOME/cordis.patch.yml`, que un parche de capa de perfil no puede alcanzar).

## Development

```sh
pnpm run typecheck && pnpm run typecheck:ci && pnpm test && pnpm run build && pnpm run verify:self-contained && pnpm run verify:artifacts && pnpm pack
```

`scripts/verify-headless.mjs` arranca el perfil web real e imprime la salida exacta de `/mcp`. Publicación: `node scripts/release.mjs <x.y.z>` ejecuta la puerta completa, hace commit y etiqueta `v<x.y.z>` localmente (nunca empuja).

## Topics

`dsh`, `dsh-plugin`, `deepseek-harness`, `deepseek`, `cordis`, `mcp`, `mcp-client`, `observability`, `panel`

## Contributors

- [@PerryLink](https://github.com/PerryLink) — creador y mantenedor.
- [@xiaoyuyu6420](https://github.com/xiaoyuyu6420) — diagnosticó las devDependencies de client faltantes detrás de los fallos de build en checkouts limpios (PR #5).
- [@feiler0](https://github.com/feiler0) — contribuyó la sonda de servidores MCP stdio (un handshake MCP initialize sobre stdin/stdout) (PR #7, fusionada como PR #15).

## PerryLink DSH Plugin Family

Este proyecto forma parte de la familia de plugins de DeepSeek Harness de [PerryLink](https://github.com/PerryLink). El registro permanece plegado abajo para que cada README conserve una primera pantalla corta; expándelo para ver cada fila y su estado.

<details>
<summary>Expandir todos los plugins</summary>

| Plugin | Estado |
|---|---|
| **[dsh-aqua-input-check](https://github.com/PerryLink/dsh-aqua-input-check)** |  |
| **[dsh-archive-check](https://github.com/PerryLink/dsh-archive-check)** |  |
| **[dsh-auto-review](https://github.com/PerryLink/dsh-auto-review)** |  |
| **[dsh-autotier](https://github.com/PerryLink/dsh-autotier)** |  |
| **[dsh-bid-ca-precheck](https://github.com/PerryLink/dsh-bid-ca-precheck)** |  |
| **[dsh-bid-qual-check](https://github.com/PerryLink/dsh-bid-qual-check)** |  |
| **[dsh-cert-mcp](https://github.com/PerryLink/dsh-cert-mcp)** |  |
| **[dsh-checkpoint-rewind](https://github.com/PerryLink/dsh-checkpoint-rewind)** |  |
| **[dsh-click](https://github.com/PerryLink/dsh-click)** |  |
| **[dsh-composer-history](https://github.com/PerryLink/dsh-composer-history)** |  |
| **[dsh-contract-stance](https://github.com/PerryLink/dsh-contract-stance)** |  |
| **[dsh-customs-doc-check](https://github.com/PerryLink/dsh-customs-doc-check)** |  |
| **[dsh-data-quality](https://github.com/PerryLink/dsh-data-quality)** |  |
| **[dsh-demurrage-ledger](https://github.com/PerryLink/dsh-demurrage-ledger)** |  |
| **[dsh-doublecheck](https://github.com/PerryLink/dsh-doublecheck)** |  |
| **[dsh-drill-script-check](https://github.com/PerryLink/dsh-drill-script-check)** |  |
| **[dsh-eia-guide-check](https://github.com/PerryLink/dsh-eia-guide-check)** |  |
| **[dsh-emergency-plan](https://github.com/PerryLink/dsh-emergency-plan)** |  |
| **[dsh-essay-rubric-check](https://github.com/PerryLink/dsh-essay-rubric-check)** |  |
| **[dsh-evidence-check](https://github.com/PerryLink/dsh-evidence-check)** |  |
| **[dsh-export-ctl-check](https://github.com/PerryLink/dsh-export-ctl-check)** |  |
| **[dsh-fast](https://github.com/PerryLink/dsh-fast)** |  |
| **[dsh-fmea-table-check](https://github.com/PerryLink/dsh-fmea-table-check)** |  |
| **[dsh-forecast-penalty](https://github.com/PerryLink/dsh-forecast-penalty)** |  |
| **[dsh-fund-research](https://github.com/PerryLink/dsh-fund-research)** |  |
| **[dsh-github](https://github.com/PerryLink/dsh-github)** |  |
| **[dsh-gongwen-flow-check](https://github.com/PerryLink/dsh-gongwen-flow-check)** |  |
| **[dsh-gongwen-word-check](https://github.com/PerryLink/dsh-gongwen-word-check)** |  |
| **[dsh-guard-plan-qc](https://github.com/PerryLink/dsh-guard-plan-qc)** |  |
| **[dsh-hazchem-check](https://github.com/PerryLink/dsh-hazchem-check)** |  |
| **[dsh-hazplan-check](https://github.com/PerryLink/dsh-hazplan-check)** |  |
| **[dsh-hidden-risk-map](https://github.com/PerryLink/dsh-hidden-risk-map)** |  |
| **[dsh-hs-classify](https://github.com/PerryLink/dsh-hs-classify)** |  |
| **[dsh-icd-rule-check](https://github.com/PerryLink/dsh-icd-rule-check)** |  |
| **[dsh-industry-research](https://github.com/PerryLink/dsh-industry-research)** |  |
| **[dsh-lawcite-adapter](https://github.com/PerryLink/dsh-lawcite-adapter)** |  |
| **[dsh-laya](https://github.com/PerryLink/dsh-laya)** |  |
| **[dsh-lc-doc-check](https://github.com/PerryLink/dsh-lc-doc-check)** |  |
| **[dsh-learning-gap-check](https://github.com/PerryLink/dsh-learning-gap-check)** |  |
| **[dsh-library](https://github.com/PerryLink/dsh-library)** |  |
| **[dsh-local-ai](https://github.com/PerryLink/dsh-local-ai)** |  |
| **[dsh-lsp-actions](https://github.com/PerryLink/dsh-lsp-actions)** |  |
| **[dsh-mask](https://github.com/PerryLink/dsh-mask)** |  |
| **[dsh-mcp-panel](https://github.com/PerryLink/dsh-mcp-panel)** |  |
| **[dsh-medrec-qc](https://github.com/PerryLink/dsh-medrec-qc)** |  |
| **[dsh-memento](https://github.com/PerryLink/dsh-memento)** |  |
| **[dsh-nsfc-form-check](https://github.com/PerryLink/dsh-nsfc-form-check)** |  |
| **[dsh-nurse-record-check](https://github.com/PerryLink/dsh-nurse-record-check)** |  |
| **[dsh-observe](https://github.com/PerryLink/dsh-observe)** |  |
| **[dsh-origin-rvc-check](https://github.com/PerryLink/dsh-origin-rvc-check)** |  |
| **[dsh-ota-review-check](https://github.com/PerryLink/dsh-ota-review-check)** |  |
| **[dsh-output-styles](https://github.com/PerryLink/dsh-output-styles)** |  |
| **[dsh-paper-doc-adapter](https://github.com/PerryLink/dsh-paper-doc-adapter)** |  |
| **[dsh-permission-rules](https://github.com/PerryLink/dsh-permission-rules)** |  |
| **[dsh-permit-report-check](https://github.com/PerryLink/dsh-permit-report-check)** |  |
| **[dsh-pipeline-check](https://github.com/PerryLink/dsh-pipeline-check)** |  |
| **[dsh-pleading-draft](https://github.com/PerryLink/dsh-pleading-draft)** |  |
| **[dsh-plugin-doctor](https://github.com/PerryLink/dsh-plugin-doctor)** |  |
| **[dsh-plugin-guide](https://github.com/PerryLink/dsh-plugin-guide)** |  |
| **[dsh-plugin-kit](https://github.com/PerryLink/dsh-plugin-kit)** |  |
| **[dsh-plugin-upgrade](https://github.com/PerryLink/dsh-plugin-upgrade)** |  |
| **[dsh-policy-brief-draft](https://github.com/PerryLink/dsh-policy-brief-draft)** |  |
| **[dsh-power-loss-split](https://github.com/PerryLink/dsh-power-loss-split)** |  |
| **[dsh-power-ticket-check](https://github.com/PerryLink/dsh-power-ticket-check)** |  |
| **[dsh-ppap-check](https://github.com/PerryLink/dsh-ppap-check)** |  |
| **[dsh-protest-deadline](https://github.com/PerryLink/dsh-protest-deadline)** |  |
| **[dsh-railway-window](https://github.com/PerryLink/dsh-railway-window)** |  |
| **[dsh-repair-order-qc](https://github.com/PerryLink/dsh-repair-order-qc)** |  |
| **[dsh-research-report](https://github.com/PerryLink/dsh-research-report)** |  |
| **[dsh-review-reply-check](https://github.com/PerryLink/dsh-review-reply-check)** |  |
| **[dsh-rulefile-check](https://github.com/PerryLink/dsh-rulefile-check)** |  |
| **[dsh-safety-brief-check](https://github.com/PerryLink/dsh-safety-brief-check)** |  |
| **[dsh-score](https://github.com/PerryLink/dsh-score)** |  |
| **[dsh-session-sync](https://github.com/PerryLink/dsh-session-sync)** |  |
| **[dsh-site-log-check](https://github.com/PerryLink/dsh-site-log-check)** |  |
| **[dsh-skill-pack-security](https://github.com/PerryLink/dsh-skill-pack-security)** |  |
| **[dsh-soe-decision-check](https://github.com/PerryLink/dsh-soe-decision-check)** |  |
| **[dsh-soilwater-check](https://github.com/PerryLink/dsh-soilwater-check)** |  |
| **[dsh-sop-sync-check](https://github.com/PerryLink/dsh-sop-sync-check)** |  |
| **[dsh-spc-gbt-adapter](https://github.com/PerryLink/dsh-spc-gbt-adapter)** |  |
| **[dsh-talk](https://github.com/PerryLink/dsh-talk)** |  |
| **[dsh-tender-extract](https://github.com/PerryLink/dsh-tender-extract)** |  |
| **[dsh-tender-matrix](https://github.com/PerryLink/dsh-tender-matrix)** |  |
| **[dsh-test-drive](https://github.com/PerryLink/dsh-test-drive)** |  |
| **[dsh-ticktick](https://github.com/PerryLink/dsh-ticktick)** |  |
| **[dsh-translate](https://github.com/PerryLink/dsh-translate)** |  |
| **[dsh-warranty-calc](https://github.com/PerryLink/dsh-warranty-calc)** |  |
| **[dsh-budget](https://github.com/PerryLink/dsh-budget)** | 🧊 CONGELADO — ver el README del repositorio |
| **[dsh-claude-move](https://github.com/PerryLink/dsh-claude-move)** | 🧊 CONGELADO — ver el README del repositorio |
| **[dsh-defend](https://github.com/PerryLink/dsh-defend)** | 🧊 CONGELADO — ver el README del repositorio |
| **[dsh-draw](https://github.com/PerryLink/dsh-draw)** | 🧊 CONGELADO — ver el README del repositorio |
| **[dsh-reach](https://github.com/PerryLink/dsh-reach)** | 🧊 CONGELADO — ver el README del repositorio |
| **[dsh-background-agents](https://github.com/PerryLink/dsh-background-agents)** | 🚫 RETIRADO — ver el README del repositorio |
| **[dsh-session-pin](https://github.com/PerryLink/dsh-session-pin)** | 🚫 RETIRADO — ver el README del repositorio |
| **[dsh-team-rooms](https://github.com/PerryLink/dsh-team-rooms)** | 🚫 RETIRADO — ver el README del repositorio |

</details>

## License

[Apache License 2.0](LICENSE) © 2026 colaboradores de dsh-mcp-panel

### Instalar desde el mercado de DSH Desktop

Todos los plugins de PerryLink pueden explorarse en el mercado integrado de DSH Desktop: **Market → Sources → add source → pegar** `https://perrylink-dsh-catalog.perrylink.workers.dev/catalog-source.json` **→ seleccionarlo**. La instalación sigue pasando por la verificación de identidad npm del mercado y tu confirmación.
