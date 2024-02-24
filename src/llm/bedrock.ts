import {
  BedrockRuntimeClient,
  InvokeModelWithResponseStreamCommand,
  InvokeModelWithResponseStreamCommandInput,
} from "@aws-sdk/client-bedrock-runtime"

import { llmHandler } from "./llm"

// apiKey format: AWS_REGION:AWS_ACCESS_KEY_ID:AWS_SECRET_ACCESS_KEY
export const claude21: llmHandler = async (apiKey, input, on) => {
  const keys = apiKey.split(":")
  console.log(keys)

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
      max_tokens_to_sample: 300,
      temperature: 0.5,
      top_k: 250,
      top_p: 1,
    }),
  }
  ;(async () => {
    const command = new InvokeModelWithResponseStreamCommand(params)
    const res = await client.send(command)

    const decoder = new TextDecoder("utf-8")
    for await (const event of res.body || []) {
      if (event.chunk?.bytes) {
        const chunk = JSON.parse(decoder.decode(event.chunk.bytes))
        on(chunk.completion, "") // change this line
      }
    }
  })()

  return () => {}
}
