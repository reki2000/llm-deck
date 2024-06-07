import { bedrockProvider } from "./bedrock"
import { dummyProvider } from "./dummy"
import { llmProvider } from "./llm"
import { openAIProvider } from "./openai"
import { vertexAIProvider } from "./vertexai"

export const InstalledLLMs: llmProvider[] = [
  ...(import.meta.env.DEV ? [dummyProvider] : []),
  openAIProvider,
  vertexAIProvider,
  bedrockProvider,
]
