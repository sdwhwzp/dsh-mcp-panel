/** Executor-owned trial calls keep resource normalization and pipeline error handling. */
import { expect, it } from 'vitest'
import { createTrialCaller } from '../src/trial.ts'
import type { ToolExecutionResult } from '@deepseek-ai/dsh-tools'
import { mountHarness } from './harness.ts'

type Tools = Parameters<ReturnType<typeof createTrialCaller>['runTrialCall']>[0]
const limits = { timeoutMs: 1000, maxResultChars: 4000 }

it('submits normalized resource arguments through one unlogged executor batch', async () => {
  const harness = await mountHarness([])
  harness.ctx.tools.register({
    name: 'list_mcp_resources', description: 'resources', parameters: {},
    output: { schema: { type: 'null' }, render: () => [] },
    execute: () => Promise.resolve(null),
  })
  let captured: unknown
  const tools: Tools = {
    get: name => harness.ctx.tools.get(name),
    execute: async (input) => {
      captured = input
      return { results: [{ callId: input.calls[0]!.id, result: { isError: false, value: null, content: [] } }], additionalContexts: [], concluded: false }
    },
  }
  const result = await createTrialCaller().runTrialCall(tools, undefined, undefined,
    { serverName: 'demo', toolName: 'list_mcp_resources', argsJson: '{}' }, limits)
  expect(result.isError).toBe(false)
  expect(captured).toEqual({
    calls: [{ type: 'tool-call', id: result.callId, name: 'list_mcp_resources', arguments: '{"server":"demo"}' }],
    signal: expect.any(AbortSignal),
  })
})

it('reports an empty batch and projects executor refusals without inventing success', async () => {
  const harness = await mountHarness([])
  harness.ctx.tools.register({ name: 'mcp__demo__read', description: 'read', parameters: {},
    output: { schema: { type: 'null' }, render: () => [] }, execute: () => Promise.resolve(null) })
  const caller = createTrialCaller()
  const request = { serverName: 'demo', toolName: 'mcp__demo__read', argsJson: '{}' }
  const empty: Tools = { get: name => harness.ctx.tools.get(name),
    execute: () => Promise.resolve({ results: [], additionalContexts: [], concluded: false }) }
  await expect(caller.runTrialCall(empty, undefined, undefined, request, limits)).rejects.toThrow('no result')
  const error: ToolExecutionResult = { isError: true, error: new Error('denied'), content: [] }
  const refused: Tools = { ...empty, execute: input => Promise.resolve({ results: [{ callId: input.calls[0]!.id, result: error }], additionalContexts: [], concluded: false }) }
  const result = await caller.runTrialCall(refused, undefined, undefined, request, limits)
  expect(result.isError).toBe(true)
  expect(JSON.parse(result.resultJson)).toEqual({ error: { message: 'denied' }, content: [] })
})
