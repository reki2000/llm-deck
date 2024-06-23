import OpenAI from "openai"
import { llmGenerate, llmListModels, llmProvider } from "./llm"

const listModels: llmListModels = async (apiKey: string) => {
  const openai = new OpenAI({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true,
  })
  const models = await openai.models.list()
  return models.data.map((m) => m.id).filter((n) => n.startsWith("gpt-"))
}

const generate: llmGenerate = async (apiKey, session, on, opts) => {
  const openai = new OpenAI({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true,
  })

  const stream = await openai.beta.chat.completions
    .stream({
      model: opts.model,
      messages: session.getHistory().map((h) => ({ role: h.role, content: h.text })),
      stream: true,
    })
    .on("content", (delta) => on(delta, false))
    .on("end", () => on("", true))
    .on("error", (error) => on(`${error}`, true))

  return () => {
    stream.controller.abort()
  }
}

export const openAIProvider: llmProvider = {
  id: "openai",
  name: "OpenAI",
  start: generate,
  models: listModels,
  apiKeyLabel: "OPENAI_API_KEY",
  localApiKey: import.meta.env.VITE_OPENAI_API_KEY,
  defaultModel: "gpt-4o",
}
