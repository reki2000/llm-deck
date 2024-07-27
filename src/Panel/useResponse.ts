import { useCallback, useRef, useState } from "react"
import { llmStreamBreaker } from "../llm/llm"
import { Session } from "../llm/session"
import { loadPanelConfig } from "./panelConfigUtils"

export const useResponse = (panelId: string, onEnd: () => void) => {
  const [response, setResponse] = useState("")
  const working = useRef(false)

  const breaker = useRef<llmStreamBreaker | null>(null)

  const stop = useCallback(() => {
    breaker.current?.()
    breaker.current = null
    working.current = false
  }, [])

  const onDelta = useCallback(
    (delta: string, done: boolean) => {
      setResponse((s) => `${s}${delta}`)
      if (done) {
        onEnd()
        stop()
      }
    },
    [stop, onEnd],
  )

  const startAsync = async (session: Session) => {
    stop() // Use the onStop callback for consistency

    const { llm, credential, model } = loadPanelConfig(panelId)
    try {
      setResponse("")
      working.current = true
      breaker.current = await llm.start(credential, session, onDelta, { model })
    } catch (error) {
      console.error("Failed to start LLM session:", error)
      stop() // Ensure we stop and clean up on error
    }
  }

  return {
    response,
    working: working.current,
    start: (session: Session) => {
      startAsync(session)
    },
    stop,
  }
}
