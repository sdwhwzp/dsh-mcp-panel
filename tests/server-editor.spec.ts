// @vitest-environment jsdom
/**
 * Editor input-handler tests. The header/env key-value rows update through a
 * state updater, and React clears a synthetic event's `currentTarget` as soon
 * as the handler returns — so a handler that reads the event inside the updater
 * throws whenever React defers that updater to the render phase (a paste, or
 * any update queued behind another one), unmounting the settings tree.
 *
 * @module dsh-mcp-panel/test/server-editor.spec
 */

import { describe, expect, it } from 'vitest'
import { createElement } from 'react'
import { createRoot } from 'react-dom/client'
import { act } from 'react'
import { ServerEditor } from '../src/client/ServerEditor.tsx'

/** Minimal locale: every key renders as itself. */
const t = ((key: string) => key) as never

/** Actions the editor never reaches in these tests. */
const actions = {
  preview: async () => { throw new Error('not reached') },
  write: async () => { throw new Error('not reached') },
} as never

/** Render the editor in add mode and return its container. */
async function mountEditor(): Promise<HTMLElement> {
  const container = document.createElement('div')
  document.body.append(container)
  const root = createRoot(container)
  await act(async () => {
    root.render(createElement(ServerEditor, {
      t, view: null, entryId: '', writeEnabled: true, actions,
      onClose: () => {}, onWritten: () => {},
    }))
  })
  return container
}

/** Set an input's value the way a browser does, then dispatch React's event. */
function typeInto(input: HTMLInputElement, value: string): void {
  const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set
  setter?.call(input, value)
  input.dispatchEvent(new Event('input', { bubbles: true }))
}

describe('ServerEditor key/value rows', () => {
  it('keeps every keystroke when updates queue up', async () => {
    const container = await mountEditor()
    const addRow = [...container.querySelectorAll('button')].find(button => button.textContent === 'addRow')
    expect(addRow).toBeDefined()
    await act(async () => { addRow?.click() })

    const key = container.querySelector<HTMLInputElement>('.dmcp-map-key')
    const value = container.querySelector<HTMLInputElement>('.dmcp-map-value')
    expect(key).not.toBeNull()
    expect(value).not.toBeNull()

    // Two dispatches inside one act: the second updater is no longer eagerly
    // evaluated, so it runs after React has cleared `currentTarget`.
    await act(async () => {
      typeInto(key as HTMLInputElement, 'Authorization')
      typeInto(value as HTMLInputElement, 'Bearer sk-test')
    })

    expect(container.querySelector<HTMLInputElement>('.dmcp-map-key')?.value).toBe('Authorization')
    expect(container.querySelector<HTMLInputElement>('.dmcp-map-value')?.value).toBe('Bearer sk-test')
  })
})
