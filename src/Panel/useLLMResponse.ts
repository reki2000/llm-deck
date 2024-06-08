// src/hooks/useLLMResponse.ts
import { useRef, useState } from "react"
import { llmStreamBreaker } from "../llm/llm"
import { useResponse } from "./useResponse"

import { loadPanelConfig } from "./panelConfigUtils"

export const useLLMResponse = (
  sessionId: string,
  instruction: string,
  prompt: string,
  id: string,
  onEnd: () => void,
) => {
  const breaker = useRef<llmStreamBreaker | null>(null)
  const [markdown, setMarkdown] = useState(true)

  if (sessionId === "" && breaker.current) {
    breaker.current()
    breaker.current = null
  }

  const { response, working } = useResponse({
    sessionId,
    starter: (onDelta) => {
      const { llm, credential, model } = loadPanelConfig(id)
      const starter = async () => {
        breaker.current = await llm.start(credential, instruction, prompt, onDelta, { model })
      }
      starter()
    },
    onEnd,
  })

  return { response, working, markdown, setMarkdown }
}
