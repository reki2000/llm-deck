import OpenAI from "openai"
import { llmHandler } from "./llm"

export const gpt4turbo: llmHandler = async (apiKey, prompt, on) => {
  const openai = new OpenAI({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true,
  })

  const stream = await openai.beta.chat.completions
    .stream({
      model: "gpt-4-turbo-preview",
      messages: [{ role: "user", content: prompt }],
      stream: true,
    })
    .on("content", on)

  return () => {
    stream.controller.abort()
  }
}
