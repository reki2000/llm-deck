import CloseIcon from '@mui/icons-material/Close'
import FormatClearIcon from '@mui/icons-material/FormatClear'
import FormatSizeIcon from '@mui/icons-material/FormatSize'
import SendIcon from '@mui/icons-material/Send'
// src/Panel/LLMPanel.tsx
import { Button, Stack, TextField } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import { usePanelContext } from '../PanelContext'
import { MinWidthButton } from '../components/miniButton'
import { Session } from '../llm/session'
import { SpeechButton } from '../speech/SpeechButton'
import ResponseField from './ResponseField'
import { LLMSelect } from './Select/LLMSelect'
import TexMarkdown from './TexMarkdown'
import { useResponse } from './useResponse'

type LLMPanelProps = {
  panelId: string
  instruction: string
  prompt: string
}

const usePanelStatus = (panelId: string) => {
  const { panels, close, notifyState } = usePanelContext()
  const working = panels[panelId]
  return { working, notifyEnd: () => notifyState(panelId, false), close: () => close(panelId) }
}

export const LLMPanel = (props: LLMPanelProps) => {
  const session = useRef<Session>(new Session())
  const { working: doWork, notifyEnd, close } = usePanelStatus(props.panelId)
  const { response, working, start, stop } = useResponse(props.panelId, notifyEnd)

  console.log('controller got: ', props)

  useEffect(() => {
    if (!doWork && working) {
      stop()
      console.log('session stopped: ', session)
    } else if (doWork && !working) {
      const s = new Session()
      s.setInstruction(props.instruction)
      s.addPrompt(props.prompt)
      session.current = s
      start(session.current)
      console.log('session started: ', session)
    }
  }, [props, start, stop, working, doWork])

  const handleReply = (response: string, reply: string) => {
    session.current.addResponse(response)
    session.current.addPrompt(reply)
    start(session.current)
  }

  const [markdown, setMarkdown] = useState(true)
  const [reply, setReply] = useState('')

  return (
    <Stack spacing={1} width="100%">
      <Stack direction="row" spacing={1} display="flex" alignItems="center">
        <LLMSelect id={props.panelId} />
        <Stack direction="row" display="flex" alignItems="center">
          <SpeechButton text={response} working={working} />
          <MinWidthButton onClick={() => setMarkdown((v) => !v)}>
            {markdown ? <FormatClearIcon /> : <FormatSizeIcon />}
          </MinWidthButton>
          <MinWidthButton onClick={close}>
            <CloseIcon />
          </MinWidthButton>
        </Stack>
      </Stack>
      {session.current.getHistory().map(({ role, text }, i) =>
        i <= 1 || text === '' ? (
          ''
        ) : role === 'assistant' ? (
          <TexMarkdown key={text}>{text}</TexMarkdown>
        ) : (
          <div
            key={text}
            style={{
              backgroundColor: '#f0f0f0',
              padding: '8px',
              borderRadius: '4px',
              marginTop: '4px',
              marginBottom: '4px',
            }}
          >
            {text}
          </div>
        ),
      )}
      <ResponseField text={response} markdown={markdown} />
      {working ? (
        '[working...]'
      ) : (
        <Stack direction="row" spacing={1} display="flex" alignItems="center">
          <TextField
            label="Reply"
            fullWidth
            onChange={(event) => setReply(event.target.value)}
            onKeyDown={(event) => {
              if (event.shiftKey && event.key === 'Enter') {
                handleReply(response, reply)
                event.preventDefault()
              }
            }}
          />
          <Button sx={{ minWidth: 'auto' }} onClick={() => handleReply(response, reply)}>
            <SendIcon />
          </Button>
        </Stack>
      )}
    </Stack>
  )
}
