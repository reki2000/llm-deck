// src/Panel/LLMPanel.tsx
import { Button, Stack } from "@mui/material"
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

export const LLMPanel: React.FC<LLMPanelProps> = (props) => {
  const { response, working, markdown, setMarkdown } = useLLMResponse(
    props.sessionId,
    props.instruction,
    props.prompt,
    props.id,
    props.onEnd,
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
