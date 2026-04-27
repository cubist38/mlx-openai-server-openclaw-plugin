import {
  definePluginEntry,
  type OpenClawPluginApi,
  type ProviderAuthMethodNonInteractiveContext,
} from "openclaw/plugin-sdk/plugin-entry";
import {
  buildMlxOpenaiServerProvider,
  MLX_OPENAI_SERVER_DEFAULT_API_KEY_ENV_VAR,
  MLX_OPENAI_SERVER_DEFAULT_BASE_URL,
  MLX_OPENAI_SERVER_DOCS_URL,
  MLX_OPENAI_SERVER_MODEL_PLACEHOLDER,
  MLX_OPENAI_SERVER_PROVIDER_ID,
  MLX_OPENAI_SERVER_PROVIDER_LABEL,
} from "./api.js";

async function loadProviderSetup() {
  return await import("openclaw/plugin-sdk/provider-setup");
}

export default definePluginEntry({
  id: MLX_OPENAI_SERVER_PROVIDER_ID,
  name: "MLX OpenAI Server Provider",
  description: "Third-party MLX OpenAI Server provider plugin for OpenClaw",
  register(api: OpenClawPluginApi) {
    api.registerProvider({
      id: MLX_OPENAI_SERVER_PROVIDER_ID,
      label: MLX_OPENAI_SERVER_PROVIDER_LABEL,
      docsPath: MLX_OPENAI_SERVER_DOCS_URL,
      envVars: [MLX_OPENAI_SERVER_DEFAULT_API_KEY_ENV_VAR],
      auth: [
        {
          id: "custom",
          label: MLX_OPENAI_SERVER_PROVIDER_LABEL,
          hint: "Apple Silicon self-hosted OpenAI-compatible server",
          kind: "custom",
          run: async (ctx) => {
            const providerSetup = await loadProviderSetup();
            return await providerSetup.promptAndConfigureOpenAICompatibleSelfHostedProviderAuth({
              cfg: ctx.config,
              prompter: ctx.prompter,
              providerId: MLX_OPENAI_SERVER_PROVIDER_ID,
              providerLabel: MLX_OPENAI_SERVER_PROVIDER_LABEL,
              defaultBaseUrl: MLX_OPENAI_SERVER_DEFAULT_BASE_URL,
              defaultApiKeyEnvVar: MLX_OPENAI_SERVER_DEFAULT_API_KEY_ENV_VAR,
              modelPlaceholder: MLX_OPENAI_SERVER_MODEL_PLACEHOLDER,
            });
          },
          runNonInteractive: async (ctx: ProviderAuthMethodNonInteractiveContext) => {
            const providerSetup = await loadProviderSetup();
            return await providerSetup.configureOpenAICompatibleSelfHostedProviderNonInteractive({
              ctx,
              providerId: MLX_OPENAI_SERVER_PROVIDER_ID,
              providerLabel: MLX_OPENAI_SERVER_PROVIDER_LABEL,
              defaultBaseUrl: MLX_OPENAI_SERVER_DEFAULT_BASE_URL,
              defaultApiKeyEnvVar: MLX_OPENAI_SERVER_DEFAULT_API_KEY_ENV_VAR,
              modelPlaceholder: MLX_OPENAI_SERVER_MODEL_PLACEHOLDER,
            });
          },
        },
      ],
      discovery: {
        order: "late",
        run: async (ctx) => {
          const providerSetup = await loadProviderSetup();
          return await providerSetup.discoverOpenAICompatibleSelfHostedProvider({
            ctx,
            providerId: MLX_OPENAI_SERVER_PROVIDER_ID,
            buildProvider: buildMlxOpenaiServerProvider,
          });
        },
      },
      wizard: {
        setup: {
          choiceId: MLX_OPENAI_SERVER_PROVIDER_ID,
          choiceLabel: MLX_OPENAI_SERVER_PROVIDER_LABEL,
          choiceHint: "Apple Silicon self-hosted OpenAI-compatible server",
          groupId: MLX_OPENAI_SERVER_PROVIDER_ID,
          groupLabel: MLX_OPENAI_SERVER_PROVIDER_LABEL,
          groupHint: "Apple Silicon local MLX inference",
          methodId: "custom",
        },
        modelPicker: {
          label: "MLX OpenAI Server (custom)",
          hint: "Enter MLX OpenAI Server URL + API key + model",
          methodId: "custom",
        },
      },
      buildUnknownModelHint: () =>
        "MLX OpenAI Server requires authentication to be registered as a provider. " +
        `Set ${MLX_OPENAI_SERVER_DEFAULT_API_KEY_ENV_VAR} to any non-empty value ` +
        'or run "openclaw configure". ' +
        `See: ${MLX_OPENAI_SERVER_DOCS_URL}`,
    });
  },
});
