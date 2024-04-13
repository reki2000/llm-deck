import { Polly, SynthesizeSpeechCommandInput } from "@aws-sdk/client-polly"
import { AwsCredentialIdentityProvider } from "@smithy/types"
/*
 * This code is based on https://github.com/ejbeaty/ChattyKathy/blob/master/ChattyKathy.js
 */

type ChattyKathySettings = {
  awsCredentials: AwsCredentialIdentityProvider
  awsRegion: string
  pollyVoiceId?: string
  speedRate: number
}

type Message = {
  msg: string
  lang?: string
  voice?: string
}

export const ChattyKathy = (settings: ChattyKathySettings) => {
  // Add audio node to html
  const elementId = `audioElement${new Date().getTime()}`
  const audioElement = document.createElement("audio")
  audioElement.setAttribute("id", elementId)
  document.body.appendChild(audioElement)

  let isSpeaking = false
  let playlist = [] as Message[]
  let _onEnd = () => {}

  const polly = new Polly({
    credentials: settings.awsCredentials,
    region: settings.awsRegion,
  })

  return {
    // Speak
    Speak: (msg: string, onEnd: () => void, { lang, voice }: { lang?: string; voice?: string }) => {
      _onEnd = onEnd
      if (isSpeaking) {
        playlist.push({ msg, lang, voice })
      } else {
        say({ msg, lang, voice }).then(sayNext)
      }
    },

    // Quit speaking, clear playlist
    ShutUp: () => shutUp(),

    // Speak & return promise
    SpeakWithPromise: (msg: Message) => say(msg),

    IsSpeaking: () => isSpeaking,
  }

  // Quit talking
  function shutUp() {
    isSpeaking = false
    audioElement.pause()
    playlist = []
  }

  // Speak the message
  async function say(message: Message) {
    isSpeaking = true
    await playAudio(await requestSpeechFromAWS(message))
  }

  // Say next
  function sayNext() {
    if (playlist.length > 0) {
      const msg = playlist[0]
      playlist.splice(0, 1)
      say(msg).then(sayNext)
    } else {
      _onEnd()
    }
  }

  // Make request to Amazon polly
  async function requestSpeechFromAWS(message: Message) {
    const langMsg = message.lang
      ? `<lang xml:lang="${message.lang}">${message.msg}</lang>`
      : message.msg
    const params = {
      OutputFormat: "mp3",
      Text: `<speak><prosody rate="${settings.speedRate * 100}%">${langMsg}</prosody></speak>`,
      VoiceId: message.voice || settings.pollyVoiceId,
      TextType: "ssml",
    } as SynthesizeSpeechCommandInput

    const data = await polly.synthesizeSpeech(params)
    return (await data?.AudioStream?.transformToByteArray()) || Uint8Array.from([])
  }

  // Play audio
  function playAudio(audioStream: Uint8Array) {
    return new Promise<void>((success, _) => {
      const blob = new Blob([audioStream.buffer], { type: "audio/mp3" })
      const url = URL.createObjectURL(blob)
      audioElement.src = url
      audioElement.addEventListener("ended", () => {
        isSpeaking = false
        success()
      })
      audioElement.play()
    })
  }
}
