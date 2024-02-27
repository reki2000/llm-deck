import { claude21 } from "./bedrock"
import { gpt4turbo } from "./openai"
import { gemini1 } from "./vertexai"

export type llmStarter = (
  credential: string,
  prompt: string,
  handleDelta: llmStream,
  opts: llmOptions,
) => Promise<llmStreahBreaker>

export type llmStream = (delta: string, done: boolean) => void

export type llmStreahBreaker = () => void

export const InstalledLLMs = [
  {
    name: "gpt4-turbo",
    start: gpt4turbo,
    label: "OPENAI_API_KEY",
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  },
  {
    name: "gemini 1.0 pro",
    start: gemini1,
    label: "ACCESS_KEY",
    apiKey: import.meta.env.VITE_GCP_ACCESS_KEY,
  },
  {
    name: "claude 2.1",
    start: claude21,
    label: "AWS_REGION:AWS_ACCESS_KEY_ID:AWS_SECRET_ACCESS_KEY",
    apiKey: import.meta.env.VITE_AWS_CREDENTIALS,
  },
]

export type llmOptions = {
  temperature?: number
}
