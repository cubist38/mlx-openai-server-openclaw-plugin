# MLX OpenAI Server OpenClaw Plugin

Third-party OpenClaw provider plugin for [mlx-openai-server](https://github.com/cubist38/mlx-openai-server), a local OpenAI-compatible API server for Apple Silicon MLX models.

This package keeps the MLX provider outside the OpenClaw core repository, as requested by the OpenClaw PR bot, while preserving the provider behavior from the original PR:

- provider id: `mlx-openai-server`
- default base URL: `http://127.0.0.1:8000/v1`
- auth opt-in env var: `MLX_OPENAI_SERVER_API_KEY`
- model discovery through `GET /v1/models`
- chat routing through OpenClaw's `openai-completions` transport

## Install

From a local checkout:

```bash
openclaw plugins install --link .
openclaw gateway restart
```

After publishing to ClawHub:

```bash
openclaw plugins install @cubist38/mlx-openai-server-openclaw-plugin
openclaw gateway restart
```

## Start MLX OpenAI Server

```bash
mlx-openai-server launch \
  --model-type lm \
  --model-path mlx-community/Qwen3-Coder-Next-4bit \
  --reasoning-parser qwen3_moe \
  --tool-call-parser qwen3_coder
```

The server should expose `/v1/models` and `/v1/chat/completions` under `http://127.0.0.1:8000/v1`.

## Configure OpenClaw

If your local server does not enforce authentication, any non-empty value works:

```bash
export MLX_OPENAI_SERVER_API_KEY="mlx-local"
```

Then select a served model using the provider prefix:

```json5
{
  agents: {
    defaults: {
      model: {
        primary: "mlx-openai-server/mlx-community/Qwen3-Coder-Next-4bit",
      },
    },
  },
}
```

Verify discovery:

```bash
openclaw models list --provider mlx-openai-server
```

## Manual Provider Config

Use explicit config when the server is not running on the default loopback URL, when you want to pin model metadata, or when the server requires a real API key:

```json5
{
  models: {
    providers: {
      "mlx-openai-server": {
        baseUrl: "http://127.0.0.1:8000/v1",
        apiKey: "${MLX_OPENAI_SERVER_API_KEY}",
        api: "openai-completions",
        request: { allowPrivateNetwork: true },
        timeoutSeconds: 300,
        models: [
          {
            id: "mlx-community/Qwen3-Coder-Next-4bit",
            name: "Local MLX Model",
            reasoning: true,
            input: ["text"],
            cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
            contextWindow: 128000,
            maxTokens: 8192,
          },
        ],
      },
    },
  },
}
```

## Publish

Install and authenticate the ClawHub CLI first:

```bash
npm i -g clawhub
clawhub login
clawhub whoami
```

Publish from this repository checkout:

```bash
clawhub package publish . \
  --family code-plugin \
  --source-repo cubist38/mlx-openai-server-openclaw-plugin \
  --source-commit "$(git rev-parse HEAD)" \
  --source-ref main \
  --changelog "Initial MLX OpenAI Server provider plugin"
```

## Development

```bash
npm install
npm run typecheck
npm test
```
