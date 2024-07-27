import { ulid } from "ulid"

export class Session {
  id: string = ulid()
  private history: { role: Role; text: string }[] = []

  setInstruction(instruction: string) {
    this.history.push({ role: "system", text: instruction })
  }

  addPrompt(prompt: string) {
    this.history.push({ role: "user", text: prompt })
  }

  addResponse(response: string) {
    this.history.push({ role: "assistant", text: response })
  }

  getHistory() {
    return this.history
  }

  getInstruction() {
    return this.history.filter((h) => h.role === "system").map((h) => h.text)
  }

  clear() {
    this.history = []
  }
}

export type Role = "system" | "user" | "assistant"
