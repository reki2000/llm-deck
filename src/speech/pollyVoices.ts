export type PollyVoice = {
  name: string
  lang: string
  neural?: boolean
  gender: string
  longform?: boolean
  bilingual?: boolean
  caster?: boolean
}

const voices: PollyVoice[] = [
  { name: "Zeina", lang: "arb", gender: "female", longform: false },
  { name: "Hala", lang: "ar-AE", neural: true, gender: "female", bilingual: true },
  { name: "Zayd", lang: "ar-AE", gender: "male", bilingual: true },
  { name: "Lisa", lang: "nl-BE", neural: true, gender: "female" },
  { name: "Arlet", lang: "ca-ES", neural: true, gender: "female" },
  { name: "Hiujin", lang: "yue-CN", neural: true, gender: "female" },
  { name: "Zhiyu", lang: "cmn-CN", neural: true, gender: "female", longform: false },
  { name: "Naja", lang: "da-DK", gender: "female" },
  { name: "Mads", lang: "da-DK", gender: "male" },
  { name: "Sofie", lang: "da-DK", neural: true, gender: "female" },
  { name: "Laura", lang: "nl-NL", neural: true, gender: "female", longform: true },
  { name: "Lotte", lang: "nl-NL", gender: "female" },
  { name: "Ruben", lang: "nl-NL", gender: "male" },
  { name: "Nicole", lang: "en-AU", gender: "female" },
  { name: "Olivia", lang: "en-AU", neural: true, gender: "female" },
  { name: "Russell", lang: "en-AU", gender: "male", longform: true },
  { name: "Amy", lang: "en-GB", neural: true, gender: "female", caster: true },
  { name: "Emma", lang: "en-GB", neural: true, gender: "female" },
  { name: "Brian", lang: "en-GB", neural: true, gender: "male" },
  { name: "Arthur", lang: "en-GB", neural: true, gender: "male" },
  { name: "Aditi", lang: "en-IN", gender: "female", bilingual: true },
  { name: "Raveena", lang: "en-IN", neural: true, gender: "female" },
  { name: "Kajal", lang: "en-IN", neural: true, gender: "female", bilingual: true },
  { name: "Niamh", lang: "en-IN", neural: true, gender: "female" },
  { name: "Aria", lang: "en-NZ", neural: true, gender: "female" },
  { name: "Ayanda", lang: "en-ZA", neural: true, gender: "female" },
  { name: "Danielle", lang: "en-US", neural: true, gender: "female", caster: true },
  { name: "Gregory", lang: "en-US", neural: true, gender: "male", caster: true },
  { name: "Ivy", lang: "en-US", neural: true, gender: "female" },
  { name: "Joanna", lang: "en-US", neural: true, gender: "female", caster: true },
  { name: "Kendra", lang: "en-US", neural: true, gender: "female" },
  { name: "Kimberly", lang: "en-US", neural: true, gender: "female" },
  { name: "Salli", lang: "en-US", neural: true, gender: "female" },
  { name: "Joey", lang: "en-US", neural: true, gender: "male" },
  { name: "Justin", lang: "en-US", neural: true, gender: "male" },
  { name: "Kevin", lang: "en-US", neural: true, gender: "male" },
  { name: "Matthew", lang: "en-US", neural: true, gender: "male", caster: true },
  { name: "Ruth", lang: "en-US", neural: true, gender: "female", caster: true },
  { name: "Stephen", lang: "en-US", neural: true, gender: "male" },
  { name: "Geraint", lang: "en-GB-WLS", gender: "male", longform: false },
  { name: "Suvi", lang: "fi-FI", neural: true, gender: "female" },
  { name: "Celine", lang: "fr-FR", gender: "female", longform: true },
  { name: "Lea", lang: "fr-FR", neural: true, gender: "female" },
  { name: "Mathieu", lang: "fr-FR", gender: "male" },
  { name: "Remi", lang: "fr-FR", neural: true, gender: "male" },
  { name: "Isabelle", lang: "fr-BE", neural: true, gender: "female" },
  { name: "Chantal", lang: "fr-CA", gender: "female" },
  { name: "Gabrielle", lang: "fr-CA", neural: true, gender: "female" },
  { name: "Liam", lang: "fr-CA", neural: true, gender: "male" },
  { name: "Marlene", lang: "de-DE", gender: "female" },
  { name: "Vicki", lang: "de-DE", neural: true, gender: "female" },
  { name: "Hans", lang: "de-DE", gender: "male" },
  { name: "Daniel", lang: "de-DE", neural: true, gender: "male" },
  { name: "Hannah", lang: "de-AT", neural: true, gender: "female" },
  { name: "Aditi", lang: "hi-IN", gender: "female", bilingual: true },
  { name: "Kajal", lang: "hi-IN", neural: true, gender: "female", bilingual: true },
  { name: "Dóra", lang: "is-IS", gender: "female" },
  { name: "Karl", lang: "is-IS", gender: "male" },
  { name: "Carla", lang: "it-IT", gender: "female" },
  { name: "Bianca", lang: "it-IT", neural: true, gender: "female" },
  { name: "Giorgio", lang: "it-IT", gender: "male" },
  { name: "Adriano", lang: "it-IT", neural: true, gender: "male" },
  { name: "Mizuki", lang: "ja-JP", gender: "female" },
  { name: "Takumi", lang: "ja-JP", neural: true, gender: "male" },
  { name: "Kazuha", lang: "ja-JP", neural: true, gender: "female" },
  { name: "Tomoko", lang: "ja-JP", neural: true, gender: "female" },
  { name: "Seoyeon", lang: "ko-KR", neural: true, gender: "female", longform: true },
  { name: "Liv", lang: "nb-NO", gender: "female" },
  { name: "Ida", lang: "nb-NO", neural: true, gender: "female" },
  { name: "Ewa", lang: "pl-PL", gender: "female" },
  { name: "Maja", lang: "pl-PL", gender: "female" },
  { name: "Jacek", lang: "pl-PL", gender: "male" },
  { name: "Jan", lang: "pl-PL", gender: "male" },
  { name: "Ola", lang: "pl-PL", neural: true, gender: "female" },
  { name: "Camila", lang: "pt-BR", neural: true, gender: "female" },
  { name: "Vitoria", lang: "pt-BR", neural: true, gender: "female" },
  { name: "Ricardo", lang: "pt-BR", gender: "male" },
  { name: "Thiago", lang: "pt-BR", neural: true, gender: "male" },
  { name: "Inês", lang: "pt-PT", neural: true, gender: "female" },
  { name: "Cristiano", lang: "pt-PT", gender: "male" },
  { name: "Carmen", lang: "ro-RO", gender: "female" },
  { name: "Tatyana", lang: "ru-RU", gender: "female" },
  { name: "Maxim", lang: "ru-RU", gender: "male" },
  { name: "Conchita", lang: "es-ES", gender: "female" },
  { name: "Lucia", lang: "es-ES", neural: true, gender: "female" },
  { name: "Enrique", lang: "es-ES", gender: "male" },
  { name: "Sergio", lang: "es-ES", neural: true, gender: "male" },
  { name: "Mia", lang: "es-MX", neural: true, gender: "female" },
  { name: "Andres", lang: "es-MX", neural: true, gender: "male" },
  { name: "Lupe", lang: "es-US", neural: true, gender: "female", caster: true },
  { name: "Penelope", lang: "es-US", gender: "female" },
  { name: "Miguel", lang: "es-US", gender: "male" },
  { name: "Pedro", lang: "es-US", neural: true, gender: "male" },
  { name: "Astrid", lang: "sv-SE", gender: "female" },
  { name: "Elin", lang: "sv-SE", neural: true, gender: "female" },
  { name: "Filiz", lang: "tr-TR", gender: "female" },
  { name: "Burcu", lang: "tr-TR", neural: true, gender: "male" },
  { name: "Gwyneth", lang: "cy-GB", gender: "female" },
]

const defaultVoice: PollyVoice = { name: "Joey", lang: "en-US", neural: true, gender: "male" }

export const voicesJp = voices.filter((voice) => voice.lang === "ja-JP")
export const voicesEn = voices.filter((voice) => voice.lang === "en-US")
export const getVoiceByName = (name: string) =>
  voices.find((voice) => voice.name === name) || defaultVoice

// find voice name by lang
// if exact match not found, try to find by iso2. priority: neural > non-neural
export const recommendVoice = (lang: string) => {
  const exactMatch = voices.filter((voice) => voice.lang === lang)

  const iso2 = lang.split("-").length > 0 ? lang.split("-")[0] : ""
  const langMatch = voices.filter((voice) => voice.lang.startsWith(iso2))

  const match = exactMatch.length > 0 ? exactMatch : langMatch

  const neural = match.find((voice) => voice.neural)

  return neural || match[0] || defaultVoice
}
