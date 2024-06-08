export type llmGenerate = (
  credential: string,
  instruction: string,
  prompt: string,
  handleDelta: llmStreamHandler,
  opts: llmOptions,
) => Promise<llmStreamBreaker>

export type llmListModels = (key: string) => Promise<string[]>

export type llmStreamHandler = (delta: string, done: boolean) => void

export type llmStreamBreaker = () => void

export type llmOptions = {
  model: string
  temperature?: number
}

export type llmProvider = {
  id: string // internal id to be used in the persistent storage
  name: string // display name
  models: (s: string) => Promise<string[]>
  start: llmGenerate
  defaultModel: string
  apiKeyLabel: string // label for the API key input field
  localApiKey: string // default value for the API key input field if needed
}
