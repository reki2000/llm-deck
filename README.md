# LLM Deck

This app lets you see responses from multiple LLMs at once.

<img src="https://github.com/reki2000/llm-deck/assets/2533597/b7e4a642-3e6a-41c5-932d-30c59329ddf5" width="700px">

[DEMO SITE](https://reki2000.github.io/llm-deck/)

## How to use

1. First, enter your API keys in the "credential" field.

   **Your information will be stored ONLY in your browser's localStorage and will NEVER be sent to the host. However, avoid using untrusted hosts.**
  - GPT4(OpenAI): OPENAI_API_KEY
  - Gemini(Google): ACCESS_KEY
  - Claude(AWS Bedrock): AWS_REGION:AWS_ACCESS_KEY_ID:AWS_SECRET_ACCESS_KEY (colon separeted)

3. Type your question or command, then click 'Send' on the right to receive the response.

## Development

To set up the development environment:

- Add your API keys to the `.env` file to overwrite values in the localStore.

```
cp .env.sample .env

# Set your API keys in .env
```

```
npm install

npm run dev

# Open your browser and go to http://localhost:5173
```
