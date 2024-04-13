import { BedrockClient, ListFoundationModelsCommand, ModelModality } from "@aws-sdk/client-bedrock"
import {
  BedrockRuntimeClient,
  InvokeModelWithResponseStreamCommand,
  InvokeModelWithResponseStreamCommandInput,
} from "@aws-sdk/client-bedrock-runtime"

import { llmGenerate, llmListModels } from "./llm"

const listModels: llmListModels = async (apiKey: string) => {
  const keys = apiKey.split(":")
  const client = new BedrockClient({
    region: keys[0],
    credentials: {
      accessKeyId: keys[1],
      secretAccessKey: keys[2],
    },
  })

  const input = {
    // byProvider: 'STRING_VALUE',
    // byCustomizationType: 'FINE_TUNING' || 'CONTINUED_PRE_TRAINING',
    byOutputModality: ModelModality.TEXT, // || 'IMAGE' || 'EMBEDDING',
    // byInferenceType: 'ON_DEMAND' || 'PROVISIONED',
  }

  const command = new ListFoundationModelsCommand(input)

  const response = await client.send(command)

  return response.modelSummaries?.map((m) => m.modelId || "").filter((n) => n !== "") || []
}

// apiKey format: AWS_REGION:AWS_ACCESS_KEY_ID:AWS_SECRET_ACCESS_KEY
const generate: llmGenerate = async (apiKey, instruction, input, on, opts) => {
  const keys = apiKey.split(":")

  const client = new BedrockRuntimeClient({
    region: keys[0],
    credentials: {
      accessKeyId: keys[1],
      secretAccessKey: keys[2],
    },
  })

  const payload = opts.model.includes("claude-3")
    ? {
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Following is instruction: ${instruction}`,
              },
              { type: "text", text: `User's question is here: ${input}` },
            ],
          },
        ],
        anthropic_version: "bedrock-2023-05-31",
        max_tokens: 10000,
      }
    : {
        prompt: `Human:${instruction} ${input} Assistant:`,
        max_tokens_to_sample: 10000,
        temperature: 0.8,
        top_k: 250,
        top_p: 1,
      }

  const params: InvokeModelWithResponseStreamCommandInput = {
    modelId: opts.model,
    contentType: "application/json",
    accept: "application/json",
    body: JSON.stringify(payload),
  }
  const decoder = new TextDecoder("utf-8")
  const command = new InvokeModelWithResponseStreamCommand(params)
  let cancelled = false
  ;(async () => {
    try {
      const res = await client.send(command)
      for await (const event of res.body || []) {
        if (cancelled) {
          break
        }
        if (event.chunk?.bytes) {
          const chunk = JSON.parse(decoder.decode(event.chunk.bytes))
          on(chunk?.delta?.text || chunk.completion || "", false) // change this line
        }
      }
      on("", true)
    } catch (e) {
      if (e instanceof Error) {
        on(`Error: ${e.message}`, true)
      } else {
        throw e
      }
    }
  })()

  return () => {
    cancelled = true
  }
}

export const bedrockProvider = {
  name: "Bedrock",
  start: generate,
  apiKeyLabel: "REGION:ACCESS_KEY_ID:SECRET_ACCESS_KEY",
  apiKey: import.meta.env.VITE_AWS_CREDENTIALS,
  models: listModels,
  defaultModel: "anthoropic.claude-3-sonnet-20240229-v1:0",
}
