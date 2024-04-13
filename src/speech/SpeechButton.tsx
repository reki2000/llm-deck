import { Button } from "@mui/material"
import { useEffect, useState } from "react"

import PauseCircleOutlinedIcon from "@mui/icons-material/PauseCircleOutlined"
import PlayCircleOutlinedIcon from "@mui/icons-material/PlayCircleOutlined"

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
  const [willSpeakFrom, setWillSpeakFrom] = useState(0)

  useEffect(() => {
    if (speaking) {
      if (text.length >= willSpeakFrom) {
        const diff = text.slice(willSpeakFrom)
        const sentence = detectSentence(diff) || (!working && diff) || ""
        const isEnglish = /^[a-zA-Z0-9\s.,!?'"-]*$/.test(sentence)

        if (sentence !== "") {
          setWillSpeakFrom((s) => s + sentence.length)
          chatter?.Speak(sentence, () => {}, isEnglish ? { lang: "en-US", voice: "Joanna" } : {})
        }
      } else {
        handleSpeakStop()
      }
    }
  }, [speaking, text, willSpeakFrom, chatter, working])

  const handleSpeakStop = () => {
    chatter?.ShutUp()
    setWillSpeakFrom(0)
  }

  return (
    chatter && (
      <Button
        onClick={() => {
          setSpeaking((s) => !s)
          speaking && handleSpeakStop()
        }}
      >
        {speaking ? <PauseCircleOutlinedIcon /> : <PlayCircleOutlinedIcon />}
      </Button>
    )
  )
}

const detectSentence = (text: string) => {
  const sentences = text.match(/(.*?[\n".!?。「」！？『』“]+)/)
  if (sentences && sentences.length > 1) {
    return sentences[1]
  }
  return ""
}
