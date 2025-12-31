import { ChatOpenAI } from "@langchain/openai";
import { BaseChatModel } from "@langchain/core/language_models/chat_models";
import type { ModelConfig } from "./types";
import * as dotenv from "dotenv";

dotenv.config({ path: require("path").join(__dirname, "../../../.env") });

export function createModel(config: ModelConfig): BaseChatModel {
  const { provider, modelName, apiKey, baseURL, temperature = 0, maxTokens = 10 } = config;

  const openRouterKey = apiKey || process.env.OPENROUTER_API_KEY;
  
  if (!openRouterKey && provider === "openrouter") {
    throw new Error("OPENROUTER_API_KEY not found. Please set it in .env file.");
  }

  switch (provider) {
    case "openrouter":
      return new ChatOpenAI({
        modelName,
        openAIApiKey: openRouterKey,
        configuration: {
          baseURL: "https://openrouter.ai/api/v1",
          defaultHeaders: {
            "HTTP-Referer": "https://github.com/gym-ai-benchmark",
            "X-Title": "Gym AI Benchmark",
          },
        },
        temperature,
        maxTokens,
      });

    case "openai":
      return new ChatOpenAI({
        modelName,
        openAIApiKey: apiKey || process.env.OPENAI_API_KEY,
        temperature,
        maxTokens,
      });

    case "anthropic":
      return new ChatOpenAI({
        modelName,
        openAIApiKey: apiKey || process.env.ANTHROPIC_API_KEY,
        configuration: {
          baseURL: "https://api.anthropic.com/v1",
        },
        temperature,
        maxTokens,
      });

    case "google":
      return new ChatOpenAI({
        modelName,
        openAIApiKey: apiKey || process.env.GOOGLE_API_KEY,
        configuration: {
          baseURL: "https://generativelanguage.googleapis.com/v1",
        },
        temperature,
        maxTokens,
      });

    case "ollama":
      return new ChatOpenAI({
        modelName,
        configuration: {
          baseURL: baseURL || process.env.OLLAMA_BASE_URL || "http://localhost:11434",
        },
        temperature,
        maxTokens,
      });

    default:
      throw new Error(`Unsupported provider: ${provider}`);
  }
}

export const FREE_MODELS = [
  "meta-llama/llama-3-8b-instruct:free",
  "google/gemini-flash-1.5:free",
  "mistralai/mistral-7b-instruct:free",
  "nousresearch/nous-capybara-7b:free",
  "openchat/openchat-7b:free",
  "gryphe/mythomist-7b:free",
];

export const POPULAR_MODELS = [
  "openai/gpt-4",
  "openai/gpt-4-turbo",
  "openai/gpt-3.5-turbo",
  "anthropic/claude-3-opus",
  "anthropic/claude-3-sonnet",
  "anthropic/claude-3-haiku",
  "google/gemini-pro",
  "google/gemini-1.5-pro",
  "meta-llama/llama-3-70b",
  "mistralai/mixtral-8x7b",
];

