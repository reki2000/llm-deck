import type { llmProvider } from './llm'

const response = [
  '`short line`',
  '\n```text\n loooooong lineeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee code block \n```\n',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
]

export const dummyProvider: llmProvider = {
  id: 'dummy',
  name: 'Dummy',
  apiKeyLabel: 'API_KEY',
  localApiKey: '',
  models: async () => ['dummy-model', 'dummy-model-1'],
  start: async (_, __, handle) => {
    handle('started..\n', false)
    ;(async () => {
      for (const text of response) {
        for (const line of text.split(' ')) {
          handle(`${line} `, false)
          await new Promise((resolve) => setTimeout(resolve, 50))
        }
      }
      handle('completed.', true)
    })()
    return () => {}
  },
  defaultModel: 'dummy-model-1',
}
