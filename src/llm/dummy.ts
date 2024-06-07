import { llmProvider } from "./llm"

const response = [
  "`short line`",
  "\n```text\n loooooong lineeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee code block \n```\n",
]

export const dummyProvider: llmProvider = {
  name: "dummy",
  apiKeyLabel: "API_KEY",
  apiKey: "",
  models: async () => ["dummy-model", "dummy-model-1"],
  start: async (_, __, prompt, handle) => {
    handle(prompt, false)
    let alive = true
    ;(async () => {
      for (const text of response) {
        await new Promise((resolve) => setTimeout(resolve, 500))
        handle(`${text} `, false)
      }
      handle("completed.", true)
    })()
    return () => {
      alive = false
    }
  },
  defaultModel: "dummy-model-1",
}
