import { VertexAI } from "@google-cloud/vertexai"
import { llmHandler } from "./llm"

const gemini1: llmHandler = async (input, on) => {
  const projectId = import.meta.env.VITE_GCP_PROJECT
  const location = import.meta.env.VITE_GCP_LOCATION
  const credentials = JSON.parse(import.meta.env.VITE_GEMINI_API_JSON)

  const vertexAI = new VertexAI({
    project: projectId,
    location: location,
    googleAuthOptions: {
      credentials: credentials,
      scopes: ["https://www.googleapis.com/auth/cloud-platform"],
    },
  })

  //   const model = "gemini-1.0-pro-vision"
  //   const generativeModel = vertexAI.getGenerativeModel({
  //     model: model,
  //   })

  //   const chat = generativeModel.startChat({})
  //   const chatInput1 = input
  //   const result1 = await chat.sendMessageStream(chatInput1)

  //   for await (const item of result1.stream) {
  //     const answer = item.candidates[0].content.parts[0].text || ""
  //     on(answer, "")
  //   }

  //   return () => {
  //     result1.stream.return("")
  //   }
  return () => {}
}

export default gemini1
