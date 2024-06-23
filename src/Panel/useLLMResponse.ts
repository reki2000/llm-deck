// src/hooks/useLLMResponse.ts
import { useEffect, useRef, useState } from "react"
import { llmStreamBreaker } from "../llm/llm"

import { Session } from "../llm/session"
import { loadPanelConfig } from "./panelConfigUtils"

export const useLLMResponse = (
  sessionId: string,
  session: Session,
  id: string,
  onEnd: () => void,
) => {
  const [response, setResponse] = useState("")
  const [working, setWorking] = useState(false)

  const breaker = useRef<llmStreamBreaker | null>(null)

  if (sessionId === "" && breaker.current) {
    breaker.current()
    breaker.current = null
  }

  const onDelta = (delta: string, done: boolean) => {
    setResponse((s) => `${s}${delta}`)
    if (done) {
      onEnd()
      setWorking(false)
    }
  }

  const currentSessionId = useRef("")

  useEffect(() => {
    if (sessionId === "" && currentSessionId.current !== "") {
      onEnd()
      currentSessionId.current = ""
      setWorking(false)
      return
    }

    if (currentSessionId.current !== sessionId) {
      currentSessionId.current = sessionId
      setResponse("")
      setWorking(true)
      const { llm, credential, model } = loadPanelConfig(id)
      ;(async () => {
        breaker.current = await llm.start(credential, session, onDelta, { model })
      })()
    }
  }, [sessionId, onEnd, onDelta, session, id])

  return { response, working }
}
