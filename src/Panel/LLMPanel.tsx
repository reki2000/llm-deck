// src/Panel/LLMPanel.tsx
import { Button, Stack } from "@mui/material"
import { useEffect, useState } from "react"
import { Session } from "../llm/session"
import { SpeechButton } from "../speech/SpeechButton"
import ResponseField from "./ResponseField"
import { LLMSelect } from "./Select/LLMSelect"
import { useLLMResponse } from "./useLLMResponse"

interface LLMPanelProps {
  sessionId: string
  instruction: string
  prompt: string
  id: string
  onEnd: () => void
  onClose: () => void
}

const useSession = (instruction: string , prompt: string) => {
  const [session, setSession] = useState(new Session())

  useEffect(() => {
    const session = new Session()
    session.setInstruction(instruction)
    session.addPrompt(prompt)
    setSession(session)
  }, [instruction, prompt])

  const addResponse = (response:string) => {
    setSession((h) => {
      h.addResponse(response)
      return h
    })
  }

  return [session, addResponse] as [Session, (response:string) => void]
}

export const LLMPanel: React.FC<LLMPanelProps> = (props) => {
  const [markdown, setMarkdown] = useState(true)
  const [session, addResponse] = useSession(props.instruction, props.prompt)

  const { response, working } = useLLMResponse(
    props.sessionId,
    session,
    props.id,
    () => { 
      addResponse(response)
      props.onEnd() 
    },
  )

  return (
    <Stack spacing={1} width="100%">
      <Stack direction="row" spacing={1} display="flex" alignItems="center">
        <LLMSelect id={props.id} />
        <Button onClick={props.onClose}>Close</Button>
      </Stack>
      <Stack direction="row" display="flex" alignItems="center">
        <SpeechButton text={response} working={working} />
        <Button onClick={() => setMarkdown((v) => !v)}>{markdown ? "Text" : "Markdown/Tex"}</Button>
      </Stack>
      <ResponseField text={response} markdown={markdown} />
      {working ? "[working...]" : "[completed]"}
    </Stack>
  )
}
