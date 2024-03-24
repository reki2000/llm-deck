import { Button } from "@mui/material"
import { useState } from "react"

import PlayCircleOutlinedIcon from "@mui/icons-material/PlayCircleOutlined"
import StopCircleOutlinedIcon from "@mui/icons-material/StopCircleOutlined"

import { loadCredential } from "../credential"
import { ChattyKathy } from "./ChattyKathy"

export const SpeechButton = ({ text }: { text: string }) => {
  const [chatter] = useState(() => {
    if (loadCredential("polly") === "") {
      return null
    }

    const [region, accessKeyId, secretAccessKey] = loadCredential("polly").split(":")
    const chatter = ChattyKathy({
      awsCredentials: async () => ({
        accessKeyId,
        secretAccessKey,
      }),
      awsRegion: region,
      pollyVoiceId: loadCredential("polly-voice"),
      speedRate: 1.2,
    })
    return chatter
  })

  const [speaking, setSpeaking] = useState(false)

  const handleSpeak = (text: string) =>
    chatter?.Speak(text, () => {
      setSpeaking(false)
    })
  const handleSpeakStop = () => chatter?.ShutUp()

  return (
    chatter && (
      <Button
        onClick={() => {
          setSpeaking((s) => !s)
          speaking ? handleSpeakStop() : handleSpeak(text)
        }}
      >
        {speaking ? <StopCircleOutlinedIcon /> : <PlayCircleOutlinedIcon />}
      </Button>
    )
  )
}
