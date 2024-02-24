import { GoogleGenerativeAI } from "@google/generative-ai"
import { llmHandler } from "./llm"

export const gemini1: llmHandler = async (apiKey, input, on) => {
  const genAI = new GoogleGenerativeAI(apiKey)

  const model = "gemini-1.0-pro-001"
  const generativeModel = genAI.getGenerativeModel({
    model: model,
  })

  const chat = generativeModel.startChat({})
  const chatInput1 = input
  const result1 = await chat.sendMessageStream(chatInput1)
  ;(async () => {
    for await (const item of result1.stream) {
      const answer = item.candidates?.[0].content.parts[0].text || ""
      on(answer, "")
    }
  })()

  return () => {
    result1.stream.return("")
  }
}
