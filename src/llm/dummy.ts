import { llmProvider } from "./llm"

export const dummyProvider: llmProvider = {
  name: "dummy",
  apiKeyLabel: "API_KEY",
  apiKey: "",
  models: async () => ["dummy-model", "dummy-model-1"],
  start: async (_, __, prompt, handle) => {
    handle(prompt, false)
    let alive = true
    ;(async () => {
      for (let i = 0; i <= 3 && alive; i++) {
        await new Promise((resolve) => setTimeout(resolve, 500))
        handle(`"Hello" といいました。`, false)
      }
      handle("completed.", true)
    })()
    return () => {
      alive = false
    }
  },
  defaultModel: "dummy-model-1",
}
