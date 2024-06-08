import { useEffect, useRef, useState } from "react"

interface UseResponseParams {
  sessionId: string
  starter: (onDelta: (delta: string, done: boolean) => void) => void
  onEnd: () => void
}

export const useResponse = ({ sessionId, starter, onEnd }: UseResponseParams) => {
  const [response, setResponse] = useState("")
  const [working, setWorking] = useState(false)

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
      starter((delta, done) => {
        setResponse((s) => `${s}${delta}`)
        if (done) {
          onEnd()
          setWorking(false)
          return
        }
      })
    }
  }, [sessionId, starter, onEnd])

  return { response, working }
}
