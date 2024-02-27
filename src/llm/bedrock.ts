import {
  BedrockRuntimeClient,
  InvokeModelWithResponseStreamCommand,
  InvokeModelWithResponseStreamCommandInput,
} from "@aws-sdk/client-bedrock-runtime"

import { llmStarter } from "./llm"

// apiKey format: AWS_REGION:AWS_ACCESS_KEY_ID:AWS_SECRET_ACCESS_KEY
export const claude21: llmStarter = async (apiKey, input, on, opts = {}) => {
  const keys = apiKey.split(":")

  const client = new BedrockRuntimeClient({
    region: keys[0],
    credentials: {
      accessKeyId: keys[1],
      secretAccessKey: keys[2],
    },
  })

  const MODEL_ID = "anthropic.claude-v2:1"

  const params: InvokeModelWithResponseStreamCommandInput = {
    modelId: MODEL_ID,
    contentType: "application/json",
    accept: "application/json",
    body: JSON.stringify({
      prompt: `Human:${input} Assistant:`,
      max_tokens_to_sample: 10000,
      temperature: 0.8,
      top_k: 250,
      top_p: 1,
      ...opts,
    }),
  }
  const decoder = new TextDecoder("utf-8")
  const command = new InvokeModelWithResponseStreamCommand(params)
  const res = await client.send(command)
  let cancelled = false
  ;(async () => {
    for await (const event of res.body || []) {
      if (cancelled) {
        break
      }
      if (event.chunk?.bytes) {
        const chunk = JSON.parse(decoder.decode(event.chunk.bytes))
        on(chunk.completion, false) // change this line
      }
    }
    on("", true)
  })()

  return () => {
    cancelled = true
  }
}
