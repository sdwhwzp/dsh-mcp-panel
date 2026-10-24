/** Claude request compatibility for the optional panel probe tool. */
import type { Context } from '@deepseek-ai/cordis'
import type {} from '@deepseek-ai/dsh-system-prompt'
import type { ToolDefinition } from '@deepseek-ai/dsh-tools'

/** Model selection captured by executor-owned step admission. */
interface ProbeActivation {
  readonly modelSelection: { readonly provider: string }
}

/**
 * Register the probe with step admission; released single-call registries ignore the second argument.
 * @param ctx - Context owning the probe registration.
 * @param definition - Probe capability, including its output and execution policy.
 * @returns Registration disposer.
 */
export function registerModelProbe(ctx: Context, definition: ToolDefinition): () => void {
  const register: (tool: ToolDefinition, options: { when: (input: ProbeActivation) => boolean }) => () => void
    = ctx.tools.register.bind(ctx.tools)
  return register(definition, { when: input => !['claude', 'subscriptions-claude'].includes(input.modelSelection.provider) })
}

/**
 * Omit the probe schema from Claude assemblies before request-header persistence.
 * Other MCP tools and the panel's direct probe action remain available.
 * @param ctx - Plugin context owning the assembly listener.
 * @returns Disposer for the model-specific filter.
 */
export function installProbeModelFilter(ctx: Context): () => void {
  return ctx.on('system-prompt/assemble', async (_assembly, _context, next) => {
    const assembled = await next()
    if (!['claude', 'subscriptions-claude'].includes(assembled.variables['provider'] ?? '') || !('tools' in assembled) || !Array.isArray(assembled.tools)) return assembled
    const tools = assembled.tools as Awaited<ReturnType<Context['systemPrompt']['assemble']>>['tools']
    return {
      ...assembled,
      tools: tools.filter(tool => tool.name !== 'mcp_probe'),
    }
  }, { prepend: true })
}
