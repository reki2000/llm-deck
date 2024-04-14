import { detect } from "tinyld"

// ISO code to Polly language code mapping
const langMap: { [key: string]: string } = {
  nl: "nl-NL",
  en: "en-US",
  fr: "fr-FR",
  de: "de-DE",
  ga: "ga-IE",
  it: "it-IT",
  pt: "pt-PT",
  es: "es-ES",

  cs: "cs-CZ",
  el: "el-GR",
  la: "la-LA",
  mk: "mk-MK",
  sr: "sr-RS",
  sk: "sk-SK",

  be: "be-BY",
  bg: "bg-BG",
  et: "et-EE",
  hu: "hu-HU",
  lv: "lv-LV",
  lt: "lt-LT",
  pl: "pl-PL",
  ro: "ro-RO",
  ru: "ru-RU",
  uk: "uk-UA",

  da: "da-DK",
  fi: "fi-FI",
  is: "is-IS",
  no: "nb-NO",
  sv: "sv-SE",

  ar: "arb",
  hy: "hy-AM",
  he: "he-IL",
  kk: "kk-KZ",
  mn: "mn-MN",
  fa: "fa-IR",
  tt: "tt-RU",
  tr: "tr-TR",
  tk: "tk-TM",
  yi: "yi-DE",

  ja: "ja-JP",
  ko: "ko-KR",
  zh: "cmn-CN",

  bn: "bn-BD",
  gu: "gu-IN",
  hi: "hi-IN",
  kn: "kn-IN",
  ta: "ta-IN",
  te: "te-IN",
  ur: "ur-PK",

  my: "my-MM",
  id: "id-ID",
  km: "km-KH",
  tl: "fil-PH",
  th: "th-TH",
  vi: "vi-VN",

  af: "af-ZA",
  am: "am-ET",
  ber: "ber-DZ",
  rn: "rn-BI",

  eo: "eo",
  tlh: "tlh",
  vo: "vo",
}

export const detectLang = (text: string) => {
  const top = detect(text)
  const lang = langMap[top] || "en-US"
  return lang
}
