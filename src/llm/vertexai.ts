import { GoogleGenerativeAI } from '@google/generative-ai'
import type { llmGenerate, llmListModels, llmProvider } from './llm'

const listModels: llmListModels = async (apiKey: string) => {
  const api = 'https://generativelanguage.googleapis.com/v1beta/models'
  const req = { headers: { 'content-type': 'application/json', 'x-goog-api-key': apiKey } }
  const models = await fetch(api, req).then((res) => res.json())

  const list = models.models
    .filter((m: { supportedGenerationMethods: string[] }) =>
      m.supportedGenerationMethods.includes('generateContent'),
    )
    .map((m: { name: string }) => m.name.replace('models/', ''))
  return list
}

const generate: llmGenerate = async (apiKey, session, on, opts) => {
  const genAI = new GoogleGenerativeAI(apiKey)

  const generativeModel = genAI.getGenerativeModel({
    model: opts.model,
    systemInstruction: {
      role: 'system',
      parts: session.getInstruction().map((i) => ({ text: i })),
    },
  })

  const chat = generativeModel.startChat({
    history: session
      .getHistory()
      .filter((h) => h.role !== 'system')
      .map((h) => ({
        role: h.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: h.text }],
      })),
  })
  let cancelled = false
  ;(async () => {
    try {
      const result1 = await chat.sendMessageStream('continue')
      for await (const item of result1.stream) {
        if (cancelled) {
          break
        }
        const answer = item.candidates?.[0].content.parts[0].text || ''
        on(answer, false)
      }
      on('', true)
    } catch (e) {
      if (e instanceof Error) {
        on(e.message, true)
      } else {
        throw e
      }
    }
  })()

  return () => {
    cancelled = true
  }
}

export const vertexAIProvider: llmProvider = {
  id: 'vertexai',
  name: 'Vertex AI',
  start: generate,
  models: listModels,
  defaultModel: 'gemini-1.5-pro',
  apiKeyLabel: 'ACCESS_KEY',
  localApiKey: import.meta.env.VITE_GCP_ACCESS_KEY,
}
