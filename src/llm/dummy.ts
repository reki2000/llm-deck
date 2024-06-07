import { llmProvider } from "./llm"

const response = [
  "`short line`",
  "\n```text\n loooooong lineeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee code block \n```\n",
]

export const dummyProvider: llmProvider = {
  id: "dummy",
  name: "Dummy",
  apiKeyLabel: "API_KEY",
  localApiKey: "",
  models: async () => ["dummy-model", "dummy-model-1"],
  start: async (_, __, prompt, handle) => {
    handle(prompt, false)
    ;(async () => {
      for (const text of response) {
        await new Promise((resolve) => setTimeout(resolve, 500))
        handle(`${text} `, false)
      }
      handle("completed.", true)
    })()
    return () => {}
  },
  defaultModel: "dummy-model-1",
}
