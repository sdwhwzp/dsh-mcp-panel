<div align="center">

# dsh-mcp-panel
- **Canal 1024 store**: `npm i -g dsh1024` uma vez, depois `dsh1024 plugin --profile web add dsh-mcp-panel` (conta para o ranking de instalações do [deepseek1024.com](https://deepseek1024.com)).

**O console de gerenciamento MCP para o cliente MCP oficial do DeepSeek Harness: adicione, edite, remova e teste servidores MCP numa página de configurações, com status honesto, diagnósticos de saúde e gravações de perfil seguras e reversíveis.**

*Cliente oficial = ponte, este plugin = console: leia o status pelo seam `mcp/status`, escreva apenas patches de perfil somente-anexar e com aprovação.*

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
[![dshfind](https://dshfind.com/api/badge/PerryLink/dsh-mcp-panel?metric=downloads&lang=pt)](https://dshfind.com/pt/plugins/PerryLink/dsh-mcp-panel?ref=badge)

[English](README.md) · [简体中文](README-zh.md) · [Español](README-es.md) · [Português](README-pt.md) · [हिन्दी](README-hi.md)

```sh
dsh plugin --profile <name> add dsh-mcp-panel
```


</div>

---

**📖 Base de conhecimento do ecossistema** — dados medidos, não marketing: [guia de desenvolvimento · dados de seleção · critérios de manutenção](https://perrylink.github.io/dsh-plugin-guide/).

<!-- star-cta -->
## Install & uninstall

- **Canal git** (último `main`): `dsh plugin --profile web add github:PerryLink/dsh-mcp-panel` — o script `prepare` constrói apenas com dependências de produção.
- **Canal npm** (versões publicadas): `dsh plugin --profile web add dsh-mcp-panel`.
- **Canal tarball**: `pnpm pack` neste repo, depois `dsh plugin --profile web add ./dsh-mcp-panel-<version>.tgz`.
- **Desinstalar**: remova a linha `mcp-panel` do `cordis.patch.yml` (a superfície web a recarrega em quente), apague o pacote do `node_modules` do perfil e verifique com `dsh web --dump-config` que não reste nenhuma linha `mcp-panel`.

## ⭐ 如果它帮到了你

Este plugin faz parte da [família de plugins DSH](https://github.com/PerryLink) (mais de 40, todos Apache-2.0). Se for útil, **deixe uma estrela**: não desbloqueia nada, mas ajuda a próxima pessoa a encontrá-lo.

*English:* part of a 95 plugin family for DeepSeek Harness. If it is useful, **a star helps the next person find it** — nothing is gated behind it.

## What is dsh-mcp-panel?

O console de gerenciamento MCP para o cliente MCP oficial do DeepSeek Harness: adicione, edite, remova e teste servidores MCP numa página de configurações, com status honesto, diagnósticos de saúde e gravações de perfil seguras e reversíveis.

Cliente oficial = ponte, este plugin = console: leia o status pelo seam `mcp/status`, escreva apenas patches de perfil somente-anexar e com aprovação.

![Diagrama de fluxo de dsh-mcp-panel: instalar → abrir painel → agir.](docs/assets/dsh-mcp-panel-flow.svg)

*Visão geral do fluxo: instalar → abrir painel → agir. Os exemplos abaixo usam a superfície real de comandos.*


*A mesma execução, animada.*

## Compatibility

| Superfície | Status |
|---|---|
| Harness | DeepSeek Harness `dsh-v0.2.1-rc.2` (verificado 2026-10-18): `engines.dsh >=0.2.1-0 <0.3.0`; os caminhos de compatibilidade P0 têm testes de regressão. |
| Node | `^22.19.0 \|\| >=24.0.0` |
| Plataformas | Web GUI (duas faces: host + navegador) |
| Modelo | Qualquer (o painel é somente leitura; só a saída de `/mcp` é legível pelo modelo) |

## What you get

O `dsh-mcp-panel` é a camada de experiência sobre o cliente MCP oficial: uma visão de runtime somente leitura mais gravações de perfil seguras e reversíveis.

- **Comando `/mcp`** — uma linha por servidor: transporte, destino, contagem de ferramentas, status de conexão (do seam upstream; `unknown` quando não observado), último erro, reconexões — legível pelo modelo, reconstruível do log da sessão, cinco idiomas de saída.
- **`/mcp <servidor> tools`** — nomes e descrições das ferramentas `mcp__*` visíveis para o modelo.
- **`/mcp <servidor> health`** — sugestões de autorreparo derivadas (ENOENT → dependência ausente, ECONNREFUSED, timeouts, 401/403/404, DNS, rate limit, reconexão esgotada…); código de saída / cauda de stderr rotulados honestamente como *aguardando suporte upstream*.
Os testes usam um lote sem registro de etapas do modelo nas versões com executores e a API de chamada individual nas instalações anteriores. Os dois caminhos preservam as permissões e a política de aprovação ativas.

- **`/mcp <servidor> call <tool> [json]`** — chamada de teste pelo **pipeline oficial de ferramentas** (`ctx.tools.execute()`); política de permissão pré-execução, aprovação, guards e pós-execução, tudo em vigor.
- **Configurações → Plugins → MCP** — cartões de status com selos, diagnósticos e sondas, mais o CRUD de servidores e o banco de testes de ferramentas.
- **CRUD de servidores** — formulários de adicionar/editar/remover → `insert` para adicionar e anulações dirigidas por id (`- id:` + `name:` + `disabled:`/`config:`) para editar/remover → cópia para a área de transferência ou gravação com aprovação, backups automáticos e re-verificação contra o loader.
- **Navegação de Resources** — listagem de recursos, listagem de templates e leituras de URI somente leitura pelas ferramentas oficiais `list_mcp_resources` / `list_mcp_resource_templates` / `read_mcp_resource` (ponteadas pelo serviço `@deepseek-ai/dsh-mcp-resources`); os resultados aparecem apenas na aba, nunca no contexto do modelo.
- **Banco de testes de ferramentas** — servidor → ferramenta `mcp__*` → argumentos JSON → resultado JSON canônico + conteúdo renderizado; limitado por `trialMaxResultChars`; somente painel, nunca contexto do modelo.

## Architecture: official client = bridge, this plugin = console

O [`@deepseek-ai/dsh-mcp-client`](https://github.com/deepseek-ai/deepseek-harness/tree/master/packages/mcp/mcp-client) é a **única ponte**: uma instância por servidor MCP, configurada como linha escrita à mão no `cordis.yml`, que conecta o transporte, sincroniza ferramentas e registra os nomes `mcp__<servidor>__<ferramenta>`. Este plugin nunca a substitui: é a **camada de experiência** por cima:

```text
                    ┌────────────────────────────────────────────┐
 profile            │  cordis.yml / cordis.patch.yml             │
 composição         │   - id: mcp-github                          │
 (uma linha por     │     name: '@deepseek-ai/dsh-mcp-client'     │
  servidor, à mão)  │     config: { serverName, transport, … }    │
                    │   - id: mcp-panel                           │
                    │     name: dsh-mcp-panel   ◄── este plugin   │
                    └───────────────┬────────────────────────────┘
                                    │
        ┌───────────────────────────┴───────────────────────────┐
        │                                                        │
   ┌────▼──────────────┐        ┌───────────────────────────┐    │
   │ @deepseek-ai/dsh- │        │ dsh-mcp-panel (console)   │    │
   │ mcp-client        │        │                           │    │
   │ • transporte      │        │ • comando /mcp            │    │
   │ • sincronização   │        │ • Configurações → Plugins │    │
   │ • ferramentas     │◄──────►│   → MCP: CRUD, banco de   │    │
   │ • seam mcp/status │ status │ • diagnósticos de saúde   │    │
   └───────────────────┘        │ • sondas, capacidades     │    │
                                └───────────────────────────┘    │
```

O console **lê** o cliente pelo seu seam de observabilidade `mcp/status` (evento + serviço de consulta `mcpStatus`), pelo registro de ferramentas e pelo loader; **escreve** apenas na camada de patches do perfil — somente-anexar, com aprovação e sempre com backup. Transporte, OAuth e protocolo permanecem intocados.

## Console vs. hand-written cordis.yml

| | cordis.yml à mão | Console dsh-mcp-panel |
|---|---|---|
| Adicionar servidor | Editar YAML, cuidar indentação/aspas | Formulário → fragmento de patch → **copiar** ou **gravar** (aprovação + backup) |
| Editar servidor | Editar YAML, reiniciar/recarga a quente | Formulário pré-preenchido da linha ao vivo; segredos inalterados preservam o valor no host |
| Remover servidor | Apagar a linha | Anulação `- id:` + `disabled: true` (o vocabulário de patches não tem remove) — re-habilitável |
| Ver status | Ler logs | Selos + reconexões + último erro, ao vivo do `mcp/status` |
| Testar uma ferramenta | Pedir ao modelo | Banco de testes → pipeline oficial `ctx.tools.execute()` (permissões e aprovação em vigor) |
| Diagnosticar falhas | grep de logs | `/mcp <servidor> health` com sugestões derivadas |
| Erros | Reverter à mão | Cada gravação é somente-anexar e deixa um backup com marca de tempo |

A saída do console É o vocabulário do `cordis.patch.yml` — as mesmas linhas que você escreveria à mão, geradas, pré-visualizadas e aplicadas com segurança.

## Quick start

```sh
dsh plugin --profile web add github:PerryLink/dsh-mcp-panel
```

```sh
# 1. instale o bundle no seu perfil
dsh plugin --profile web add github:PerryLink/dsh-mcp-panel

# ou do npm (versões publicadas)
dsh plugin --profile web add dsh-mcp-panel

# 2. reinicie e verifique a linha
dsh --profile web --dump-config | grep -A3 'id: mcp-panel'
```

Depois abra **Configurações → Plugins → MCP**, ou execute:

```text
/mcp
/mcp everything tools
/mcp everything health
/mcp everything call echo '{"message": "hi"}'
```

### Exemplos

São os pontos de entrada reais; instale e chame um.

#### Exemplo detalhado

**Comando**

~~~sh
/mcp github tools
~~~

**Saída**

~~~text
Tools of "github" (1, model-visible public names):
- mcp__github__create_issue — Create a new issue in a GitHub repository
~~~

*Observado em `plugins/dsh-mcp-panel/tests/command.spec.ts:99-110; renderer at src/command.ts:352-360`*

#### Ramo de falha

**Entrada**

~~~text
/mcp nope tools
~~~

**Saída**

~~~text
Unknown MCP server "nope" (configured: github)
~~~

*Observado em `plugins/dsh-mcp-panel/src/command.ts:104-105; plugins/dsh-mcp-panel/tests/command.spec.ts:152-157`*

#### Exemplos breves

- `/mcp <server> tools`
- `/mcp <server> health`

## Configuration

Todas as opções são campos Schemastery `Config` (modificáveis a partir do cordis.yml). O `cordis.patch.yml` documenta cada chave.

| Chave | Padrão | Significado |
|---|---|---|
| `probeEnabled` | `true` | Registra a ferramenta `mcp_probe` (resultados somente do painel) |
| `probeTimeoutMs` | `10000` | Prazo por sonda em ms |
| `maxProbes` | `10` | Registros de sonda mostrados no painel |
| `refreshIntervalMs` | `0` | Atualização sugerida do painel em ms; `0` = sob demanda |
| `outputLanguage` | `en` | Idioma de saída do `/mcp`: `en \| zh \| es \| pt \| hi` |
| `passiveProbeEnabled` | `false` | Sondear periodicamente servidores streamable-http |
| `passiveProbeIntervalMs` | `60000` | Intervalo de sonda passiva em ms |
| `trialEnabled` | `true` | Banco de testes de ferramentas (aba de configurações + `/mcp call`) |
| `trialTimeoutMs` | `120000` | Prazo do painel por chamada de teste em ms |
| `trialMaxResultChars` | `60000` | Teto do payload do resultado de teste em caracteres |
| `writeEnabled` | `true` | Interruptor de segurança: `false` rejeita toda gravação (copiar continua funcionando) |
| `writeVerifyEnabled` | `true` | Re-verifica cada gravação contra o estado re-aplicado do loader antes de reportar sucesso |
| `writeVerifyTimeoutMs` | `3000` | Orçamento de sondagem para a verificação de gravação em ms |
| `backupCount` | `5` | Backups de `cordis.patch.yml` retidos por gravação |
| `catalogEntries` | `[]` | Sobreposição do usuário para o diretório recomendado: anexa entradas; uma entrada com o mesmo `id` substitui a integrada |

As solicitações Claude omitem `mcp_probe`; os outros provedores o mantêm quando habilitado. As ferramentas MCP configuradas e as sondagens manuais do painel continuam disponíveis. A troca de provedor vale na próxima solicitação.

## Tools & surfaces

| Superfície | Tipo | Notas |
|---|---|---|
| `/mcp` | command | Linha de status por servidor; legível pelo modelo e reconstruível do log |
| `/mcp <servidor> tools` | command | Nomes + descrições de `mcp__*` visíveis para o modelo |
| `/mcp <servidor> health` | command | Sugestões de autorreparo derivadas do texto de erro saneado |
| `/mcp <servidor> call <tool> [json]` | command | Chamada de teste pelo pipeline oficial de ferramentas |
| `mcp_probe` | tool | Sonda opcional de conectividade Streamable HTTP (trabalho em segundo plano) |
| Configurações → Plugins → MCP | Slot de UI | Cartões de status, CRUD de servidores e banco de testes |
| Remote Typert `mcpPanel` | service | Canal de instantâneas somente leitura (host → cliente) |

## Resources & Prompts

Resources JÁ são ponteados upstream: o bundle base monta `@deepseek-ai/dsh-mcp-resources`, o cliente oficial registra o provider de recursos de cada conexão em `ctx.mcpResources`, e esse pacote possui as três ferramentas compartilhadas (`list_mcp_resources`, `list_mcp_resource_templates`, `read_mcp_resource`). O console detecta o serviço e as ferramentas registradas, e oferece um navegador de Resources somente leitura (lista / templates / leitura de URI) em cada cartão de servidor — cada chamada passa pelo pipeline OFICIAL de ferramentas e os resultados nunca entram no contexto do modelo.

**Templates de prompts** e **assinaturas de recursos** permanecem adiados upstream; o painel de capacidades marca Prompts **aguardando suporte upstream**.

## Permissions & data

- **Permissões**: o manifesto `dshWorkshop` declara `network:outbound` e `native-code:none`.
- **Dados**: o painel é somente leitura; grava apenas fragmentos de `cordis.patch.yml` somente-anexar (com aprovação, backup primeiro). Credenciais em URLs, senhas userinfo, valores de headers, tokens bearer e JWTs são redigidos antes de renderizar; os `headers` configurados nunca entram em nenhuma instantânea, e os **valores** de env/headers nunca saem do host (o editor vê apenas chaves).

## Security boundaries

- **A ponte continua sendo a ponte.** Sem mudanças de transporte, OAuth ou protocolo; uma linha mcp-client por servidor, exatamente como à mão.
- **Sem status falso.** Campos de conexão sem observações upstream leem `unknown` / `—` com `statusSource: 'derived'`; códigos de saída e stderr nunca são inventados.
- **Gravações somente-anexar, com aprovação e backup.** O console nunca reescreve o `cordis.patch.yml`; anexa operações geradas, conserva os `backupCount` backups mais recentes e re-verifica cada gravação contra o estado re-aplicado do loader antes de reportar sucesso (um patch omitido nunca aparece como sucesso).
- **Sem injeção de prompts.** O painel não registra seções de prompt; seu único texto visível ao modelo são as duas descrições de ferramenta/comando.

## Known limitations

- **Templates de prompts e assinaturas de recursos** aguardam suporte upstream — o cliente oficial pontua ferramentas e recursos, mas não prompts nem assinaturas.
- **Códigos de saída / caudas de stderr** são rotulados *aguardando suporte upstream* até o cliente expô-los.
- **Painel somente leitura** — o console nunca falsifica um estado de conexão; campos não observáveis leem `unknown` / `-1` / `—`.
- **Gravações são verificadas, não garantidas** — o console re-verifica cada gravação contra o estado re-aplicado do loader e falha honestamente quando o loader não a aplicou (ex.: uma linha inserida por `$DSH_HOME/cordis.patch.yml`, que um patch de camada de perfil não alcança).

## Development

```sh
pnpm run typecheck && pnpm run typecheck:ci && pnpm test && pnpm run build && pnpm run verify:self-contained && pnpm run verify:artifacts && pnpm pack
```

O `scripts/verify-headless.mjs` inicia o perfil web real e imprime a saída exata de `/mcp`. Publicação: `node scripts/release.mjs <x.y.z>` executa a porta completa, faz commit e etiqueta `v<x.y.z>` localmente (nunca empurra).

## Topics

`dsh`, `dsh-plugin`, `deepseek-harness`, `deepseek`, `cordis`, `mcp`, `mcp-client`, `observability`, `panel`

## Contributors

- [@PerryLink](https://github.com/PerryLink) — criador e mantenedor.
- [@xiaoyuyu6420](https://github.com/xiaoyuyu6420) — diagnosticou as devDependencies de client ausentes por trás das falhas de build em checkouts limpos (PR #5).
- [@feiler0](https://github.com/feiler0) — contribuiu com a sonda de servidores MCP stdio (um handshake MCP initialize via stdin/stdout) (PR #7, mesclada como PR #15).

## PerryLink DSH Plugin Family

Este projeto faz parte da família de plugins do DeepSeek Harness da [PerryLink](https://github.com/PerryLink). O registro fica recolhido abaixo para que cada README mantenha uma primeira tela curta; expanda para ver cada linha e seu status.

<details>
<summary>Expandir todos os plugins</summary>

| Plugin | Status |
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
| **[dsh-budget](https://github.com/PerryLink/dsh-budget)** | 🧊 CONGELADO — ver o README do repositório |
| **[dsh-claude-move](https://github.com/PerryLink/dsh-claude-move)** | 🧊 CONGELADO — ver o README do repositório |
| **[dsh-defend](https://github.com/PerryLink/dsh-defend)** | 🧊 CONGELADO — ver o README do repositório |
| **[dsh-draw](https://github.com/PerryLink/dsh-draw)** | 🧊 CONGELADO — ver o README do repositório |
| **[dsh-reach](https://github.com/PerryLink/dsh-reach)** | 🧊 CONGELADO — ver o README do repositório |
| **[dsh-background-agents](https://github.com/PerryLink/dsh-background-agents)** | 🚫 RETIRADO — ver o README do repositório |
| **[dsh-session-pin](https://github.com/PerryLink/dsh-session-pin)** | 🚫 RETIRADO — ver o README do repositório |
| **[dsh-team-rooms](https://github.com/PerryLink/dsh-team-rooms)** | 🚫 RETIRADO — ver o README do repositório |

</details>

## License

[Apache License 2.0](LICENSE) © 2026 contribuidores do dsh-mcp-panel

### Instalar a partir do mercado do DSH Desktop

Todos os plugins PerryLink podem ser explorados no mercado integrado do DSH Desktop: **Market → Sources → add source → colar** `https://perrylink-dsh-catalog.perrylink.workers.dev/catalog-source.json` **→ selecionar**. A instalação continua passando pela verificação de identidade npm do mercado e pela sua confirmação.
