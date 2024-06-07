import { Button } from "@mui/material"
import { useEffect, useState } from "react"

import PauseCircleOutlinedIcon from "@mui/icons-material/PauseCircleOutlined"
import PlayCircleOutlinedIcon from "@mui/icons-material/PlayCircleOutlined"

import { loadConfig } from "../configurations"
import { ChattyKathy } from "./ChattyKathy"
import { detectLang } from "./langDetector"
import { getVoiceByName, recommendVoice } from "./pollyVoices"

export const SpeechButton = ({ text, working }: { text: string; working: boolean }) => {
  const voiceEn = loadConfig("config", "polly-voice-en")
  const voiceJp = loadConfig("config", "polly-voice-jp")

  const [chatter] = useState(() => {
    const cfg = loadConfig("config", "polly")
    if (cfg === "") {
      return null
    }

    const [region, accessKeyId, secretAccessKey] = cfg.split(":")
    const chatter = ChattyKathy({
      awsCredentials: async () => ({
        accessKeyId,
        secretAccessKey,
      }),
      awsRegion: region,
      defaultVoice: getVoiceByName(voiceJp),
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

        if (sentence !== "") {
          setWillSpeakFrom((s) => s + sentence.length)

          const lang = detectLang(sentence)
          const voice =
            lang === "ja-JP"
              ? getVoiceByName(voiceJp)
              : lang === "en-US"
                ? getVoiceByName(voiceEn)
                : recommendVoice(lang)
          console.log("speaking", lang, "[", voice, "]", sentence)
          chatter?.Speak(sentence, () => {}, voice)
        }
      } else {
        handleSpeakStop()
      }
    }
  }, [speaking, text, willSpeakFrom, chatter, working, voiceEn, voiceJp])

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
  const sentences = text.match(/(.*?[\n",.;:!?。「」！？『』“]+)/)
  if (sentences && sentences.length > 1) {
    return sentences[1]
  }
  return ""
}
