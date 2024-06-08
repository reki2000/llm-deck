import { Button, Stack } from "@mui/material"

import { Fragment, useRef, useState } from "react"
import { llmStreahBreaker as llmStreamBreaker } from "../llm/llm"

import TexMarkdown from "./TexMarkdown"

import { SpeechButton } from "../speech/SpeechButton"
import { LLMSelect, loadPanelConfig } from "./LLMSelect"
import { useResponse } from "./response"

const ResponseField = ({ text, markdown }: { text: string; markdown: boolean }) => {
  return markdown ? (
    <TexMarkdown>{text}</TexMarkdown>
  ) : (
    text.split("\n").map((item, i, arr) => (
      <Fragment key={item}>
        {item}
        {i < arr.length - 1 && <br />}
      </Fragment>
    ))
  )
}

// LLMPanel is a component that displays the UI of the configurations for a single LLM provider.
// 'sessionID' prop fires the LLM provider to generate the response for the givin prompt and configurations.
export const LLMPanel = ({
  sessionId,
  instruction,
  prompt,
  id,
  onEnd,
  onClose,
}: {
  sessionId: string
  instruction: string
  prompt: string
  id: string
  onEnd: () => void
  onClose: () => void
}) => {
  const [markdown, setMarkdown] = useState(true)

  const breaker = useRef<llmStreamBreaker | null>(null)

  if (sessionId === "" && breaker.current) {
    breaker.current()
    breaker.current = null
  }

  const { response, working } = useResponse({
    sessionId,
    starter: (onDelta) => {
      const { llm, model } = loadPanelConfig(id)
      const starter = async () => {
        breaker.current = await llm.start(llm.credential, instruction, prompt, onDelta, {
          model: model,
        })
      }
      starter()
    },
    onEnd,
  })

  return (
    <>
      <Stack spacing={1} width="100%">
        <Stack direction="row" spacing={1} display="flex" alignItems="center">
          <LLMSelect id={id} />
          <Button onClick={() => onClose()}>Close</Button>
        </Stack>
        <Stack direction="row" display="flex" alignItems="center">
          <SpeechButton text={response} working={working} />
          <Button
            onClick={() => {
              setMarkdown((v) => !v)
            }}
          >
            {markdown ? "Text" : "Markdown/Tex"}
          </Button>
        </Stack>
        <ResponseField text={response} markdown={markdown} />
        {working ? "[working...]" : "[completed]"}
      </Stack>
    </>
  )
}
