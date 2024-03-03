import OpenAI from "openai"
import { llmProvider, llmReloader, llmStarter } from "./llm"

const listModels: llmReloader = async (apiKey: string) => {
  const openai = new OpenAI({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true,
  })
  const models = await openai.models.list()
  return models.data.map((m) => m.id).filter((n) => n.startsWith("gpt-"))
}

const starter: llmStarter = async (apiKey, instructions, prompt, on, opts) => {
  const openai = new OpenAI({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true,
  })

  const stream = await openai.beta.chat.completions
    .stream({
      model: opts.model,
      messages: [
        { role: "system", content: instructions.join(" #### ") },
        { role: "user", content: prompt },
      ],
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
  name: "OpenAI",
  start: starter,
  apiKeyLabel: "OPENAI_API_KEY",
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  models: listModels,
}
