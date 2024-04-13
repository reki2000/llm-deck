export type llmGenerate = (
  credential: string,
  instruction: string,
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
  defaultModel: string
  start: llmGenerate
}
