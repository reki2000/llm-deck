// src/hooks/useSpeech.ts
import { useEffect, useState } from "react"
import { loadConfig } from "../configurations"
import { ChattyKathy } from "../speech/ChattyKathy"
import { detectLang } from "../speech/langDetector"
import { getVoiceByName, recommendVoice } from "../speech/pollyVoices"
import { detectSentence } from "./textUtils"

export const useSpeech = (text: string, working: boolean) => {
  const reloadChatter = () => {
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
      defaultVoice: getVoiceByName(loadConfig("config", "polly-voice-jp")),
      speedRate: 1.2,
    })

    return chatter
  }

  const [chatter, setChatter] = useState(() => reloadChatter())
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
              ? getVoiceByName(loadConfig("config", "polly-voice-jp"))
              : lang === "en-US"
                ? getVoiceByName(loadConfig("config", "polly-voice-en"))
                : recommendVoice(lang)
          console.log("speaking", lang, "[", voice, "]", sentence)
          chatter?.Speak(sentence, () => {}, voice)
        }
      } else {
        handleSpeakStop()
      }
    }
  }, [speaking, text, chatter, willSpeakFrom, working])

  const handleSpeakStop = () => {
    chatter?.ShutUp()
    setChatter(null)
    setWillSpeakFrom(0)
  }

  const toggleSpeaking = () => {
    if (speaking) {
      setSpeaking(false)
      handleSpeakStop()
    } else {
      setSpeaking(true)
      setChatter(reloadChatter())
    }
  }

  return { speaking, toggleSpeaking }
}
