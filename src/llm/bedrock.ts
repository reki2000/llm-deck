import { BedrockClient, ListFoundationModelsCommand, ModelModality } from '@aws-sdk/client-bedrock'
import {
  BedrockRuntimeClient,
  InvokeModelWithResponseStreamCommand,
  type InvokeModelWithResponseStreamCommandInput,
} from '@aws-sdk/client-bedrock-runtime'

import type { llmGenerate, llmListModels } from './llm'

const listModels: llmListModels = async (apiKey: string) => {
  const keys = apiKey.split(':')
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

  return (
    response.modelSummaries
      ?.filter((m) => m.responseStreamingSupported)
      .map((m) => m.modelId || '')
      .map((m) => (m.includes('claude-3-7-sonnet') ? `us.${m}` : m))
      .filter((n) => n) || []
  )
}

// apiKey format: AWS_REGION:AWS_ACCESS_KEY_ID:AWS_SECRET_ACCESS_KEY
const generate: llmGenerate = async (apiKey, session, on, opts) => {
  const keys = apiKey.split(':')

  const client = new BedrockRuntimeClient({
    region: keys[0],
    credentials: {
      accessKeyId: keys[1],
      secretAccessKey: keys[2],
    },
  })

  const payload = opts.model.includes('claude')
    ? {
        system: session.getInstruction().join(' '),
        messages: session
          .getHistory()
          .filter((h) => h.role !== 'system')
          .map((h) => ({
            role: h.role,
            content: [{ type: 'text', text: h.text }],
          })),
        anthropic_version: 'bedrock-2023-05-31',
        max_tokens: 16 * 1024,
      }
    : opts.model.includes('meta.llama')
      ? {
          prompt: `<|begin_of_text|>\n${session.getHistory().map(({ role, text }) => `<|start_header_id|>${role}<|end_header_id|>\n${text}<|eot_id|>\n<|start_header_id|>assistant<|end_header_id|>`)}`,
          top_p: 1,
        }
      : {
          prompt: `${session
            .getHistory()
            .map((h) => `${h.role}:${h.text}`)
            .join(' ')} assistant:`,
          max_tokens_to_sample: 16 * 1024,
          temperature: 0.8,
          top_k: 250,
          top_p: 1,
        }

  const params: InvokeModelWithResponseStreamCommandInput = {
    modelId: opts.model,
    contentType: 'application/json',
    accept: 'application/json',
    body: JSON.stringify(payload),
  }
  const decoder = new TextDecoder('utf-8')
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
          on(chunk?.delta?.text || chunk.completion || chunk.generation || '', false) // change this line
        }
      }
      on('', true)
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
  id: 'bedrock',
  name: 'Bedrock',
  start: generate,
  models: listModels,
  defaultModel: 'anthropic.claude-3-sonnet-20240229-v1:0',
  apiKeyLabel: 'REGION:ACCESS_KEY_ID:SECRET_ACCESS_KEY',
  localApiKey: import.meta.env.VITE_AWS_CREDENTIALS,
}
