import { GoogleGenerativeAI } from "@google/generative-ai"
import { llmProvider, llmReloader, llmStarter } from "./llm"

const listModels: llmReloader = async (_: string) => {
  // TODO: Implement this
  return ["gemini-1.0-pro-001"]
}

const gemini1: llmStarter = async (apiKey, instructions, input, on, opts) => {
  const genAI = new GoogleGenerativeAI(apiKey)

  const generativeModel = genAI.getGenerativeModel({
    model: opts.model,
  })

  const chat = generativeModel.startChat({})
  const chatInput1 = input
  let cancelled = false
  ;(async () => {
    try {
      const result1 = await chat.sendMessageStream(instructions + chatInput1)
      for await (const item of result1.stream) {
        if (cancelled) {
          break
        }
        const answer = item.candidates?.[0].content.parts[0].text || ""
        on(answer, false)
      }
      on("", true)
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
  name: "Vertex AI",
  start: gemini1,
  apiKeyLabel: "ACCESS_KEY",
  apiKey: import.meta.env.VITE_GCP_ACCESS_KEY,
  models: listModels,
}
