import OpenAI from "openai"
import { llmHandler } from "./llm"

const openai = new OpenAI({
	apiKey: import.meta.env.VITE_OPENAI_API_KEY,
	dangerouslyAllowBrowser: true,
})

const gpt4turbo: llmHandler = async (prompt, on) => {
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

export default gpt4turbo
