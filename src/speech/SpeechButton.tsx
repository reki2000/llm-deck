import { Button } from "@mui/material"
import { useEffect, useState } from "react"

import PlayCircleOutlinedIcon from "@mui/icons-material/PlayCircleOutlined"
import StopCircleOutlinedIcon from "@mui/icons-material/StopCircleOutlined"

import { loadCredential } from "../credential"
import { ChattyKathy } from "./ChattyKathy"

export const SpeechButton = ({ text, working }: { text: string; working: boolean }) => {
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
  const [spokenText, setSpokenText] = useState("")

  useEffect(() => {
    if (speaking) {
      if (text.length >= spokenText.length && text.startsWith(spokenText)) {
        const diff = text.slice(spokenText.length)
        const sentence = working ? detectSentence(diff) : diff
        if (sentence !== "") {
          setSpokenText(spokenText + sentence)
          chatter?.Speak(sentence, () => {})
        }
      }
    }
  }, [speaking, text, spokenText, chatter, working])

  const handleSpeakStop = () => {
    setSpeaking(false)
    setSpokenText("")
    chatter?.ShutUp()
  }

  return (
    chatter && (
      <Button
        onClick={() => {
          setSpeaking((s) => !s)
          speaking && handleSpeakStop()
        }}
      >
        {speaking ? <StopCircleOutlinedIcon /> : <PlayCircleOutlinedIcon />}
      </Button>
    )
  )
}

const detectSentence = (text: string) => {
  const sentences = text.match(/(.*?[。」".!?！？])/)
  if (sentences && sentences.length > 1) {
    console.log("input: ", text, " detect: ", sentences[1])
    return sentences[1]
  }
  return ""
}
