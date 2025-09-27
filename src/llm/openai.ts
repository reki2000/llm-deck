import OpenAI from 'openai'
import type { llmGenerate, llmListModels, llmProvider } from './llm'

const listModels: llmListModels = async (apiKey: string) => {
  const openai = new OpenAI({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true,
  })
  const models = await openai.models.list()
  return models.data.map((m) => m.id).filter((n) => n.startsWith('gpt-') || n.startsWith('o'))
}

const generate: llmGenerate = async (apiKey, session, on, opts) => {
  const openai = new OpenAI({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true,
  })

  const input = session
    .getHistory()
    .map((h) => `${h.role}: ${h.text}`)
    .join('\n')

  const stream = openai.responses.stream({
    model: opts.model,
    input: input,
    stream: true,
  })
  ;(async () => {
    try {
      for await (const event of stream) {
        if (event.type === 'response.output_text.delta') {
          on(event.delta, false)
        }
      }
      on('', true)
    } catch (error) {
      on(`${error}`, true)
    }
  })()

  return () => {
    stream.controller.abort()
  }
}

export const openAIProvider: llmProvider = {
  id: 'openai',
  name: 'OpenAI',
  start: generate,
  models: listModels,
  apiKeyLabel: 'OPENAI_API_KEY',
  localApiKey: import.meta.env.VITE_OPENAI_API_KEY,
  defaultModel: 'gpt-4o',
}
