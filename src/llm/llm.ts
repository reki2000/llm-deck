import { bedrockProvider } from "./bedrock"
import { openAIProvider } from "./openai"
import { vertexAIProvider } from "./vertexai"

export type llmGenerate = (
  credential: string,
  instruction: string[],
  prompt: string,
  handleDelta: llmStreamHandler,
  opts: llmOptions,
) => Promise<llmStreahBreaker>

export type llmListModels = (key: string) => Promise<string[]>

export type llmStreamHandler = (delta: string, done: boolean) => void

export type llmStreahBreaker = () => void

export type llmOptions = {
  model: string
  temperature?: number
}

export type llmProvider = {
  name: string
  apiKeyLabel: string
  apiKey: string
  models: (s: string) => Promise<string[]>
  start: llmGenerate
}

const dummyProvider: llmProvider = {
  name: "dummy",
  apiKeyLabel: "API_KEY",
  apiKey: "",
  models: async () => ["dummy-model"],
  start: async (_, __, prompt, handle) => {
    handle(prompt, false)
    let alive = true
    ;(async () => {
      while (Math.random() < 0.95 && alive) {
        await new Promise((resolve) => setTimeout(resolve, 100))
        handle("dummy ", false)
      }
      handle("completed.", true)
    })()
    return () => {
      alive = false
    }
  },
}

export const InstalledLLMs: llmProvider[] = [
  dummyProvider,
  openAIProvider,
  vertexAIProvider,
  bedrockProvider,
]
