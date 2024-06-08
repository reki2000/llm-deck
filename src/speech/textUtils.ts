// src/utils/textUtils.ts
export const detectSentence = (text: string): string => {
  const sentences = text.match(/(.*?[\n",.;:!?。「」！？『』“]+)/)
  if (sentences && sentences.length > 1) {
    return sentences[1]
  }
  return ""
}
