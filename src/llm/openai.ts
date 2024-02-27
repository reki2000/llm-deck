import OpenAI from "openai"
import { llmStarter } from "./llm"

export const gpt4turbo: llmStarter = async (apiKey, prompt, on, opts = {}) => {
  const openai = new OpenAI({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true,
  })

  const stream = await openai.beta.chat.completions
    .stream({
      model: "gpt-4-turbo-preview",
      messages: [{ role: "user", content: prompt }],
      stream: true,
      ...opts,
    })
    .on("content", (delta) => on(delta, false))
    .on("end", () => on("", true))
    .on("error", (error) => on(`Error: ${error}`, true))

  return () => {
    stream.controller.abort()
  }
}
