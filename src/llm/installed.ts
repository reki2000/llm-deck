import { bedrockProvider } from "./bedrock"
import { dummyProvider } from "./dummy"
import { llmProvider } from "./llm"
import { openAIProvider } from "./openai"
import { vertexAIProvider } from "./vertexai"

export const InstalledLLMs: llmProvider[] = [
  openAIProvider,
  vertexAIProvider,
  bedrockProvider,
  ...(import.meta.env.DEV ? [dummyProvider] : []),
]
