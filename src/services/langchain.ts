import { ChatOpenAI } from "@langchain/openai";
import { ChatAnthropic } from "@langchain/anthropic";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatCohere } from "@langchain/cohere";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";

// Configuração dos modelos de LLM
export class LangChainService {
  private openaiModel: ChatOpenAI | null = null;
  private anthropicModel: ChatAnthropic | null = null;
  private googleModel: ChatGoogleGenerativeAI | null = null;
  private cohereModel: ChatCohere | null = null;

  constructor() {
    this.initializeModels();
  }

  private initializeModels() {
    // Inicializar modelos apenas se as chaves de API estiverem disponíveis
    if (process.env.REACT_APP_OPENAI_API_KEY) {
      this.openaiModel = new ChatOpenAI({
        openAIApiKey: process.env.REACT_APP_OPENAI_API_KEY,
        modelName: "gpt-3.5-turbo",
        temperature: 0.7,
      });
    }

    if (process.env.REACT_APP_ANTHROPIC_API_KEY) {
      this.anthropicModel = new ChatAnthropic({
        apiKey: process.env.REACT_APP_ANTHROPIC_API_KEY,
        model: "claude-3-sonnet-20240229",
        temperature: 0.7,
      });
    }

    if (process.env.REACT_APP_GOOGLE_API_KEY) {
      this.googleModel = new ChatGoogleGenerativeAI({
        apiKey: process.env.REACT_APP_GOOGLE_API_KEY,
        model: "gemini-pro",
        temperature: 0.7,
      });
    }

    if (process.env.REACT_APP_COHERE_API_KEY) {
      this.cohereModel = new ChatCohere({
        apiKey: process.env.REACT_APP_COHERE_API_KEY,
        model: "command",
        temperature: 0.7,
      });
    }
  }

  // Método para gerar resposta usando OpenAI
  async generateOpenAIResponse(prompt: string, systemPrompt?: string): Promise<string> {
    if (!this.openaiModel) {
      throw new Error("OpenAI model not initialized. Please check your API key.");
    }

    const messages = [];
    if (systemPrompt) {
      messages.push(new SystemMessage(systemPrompt));
    }
    messages.push(new HumanMessage(prompt));

    try {
      const response = await this.openaiModel.invoke(messages);
      return response.content as string;
    } catch (error) {
      console.error("Error generating OpenAI response:", error);
      throw error;
    }
  }

  // Método para gerar resposta usando Anthropic
  async generateAnthropicResponse(prompt: string, systemPrompt?: string): Promise<string> {
    if (!this.anthropicModel) {
      throw new Error("Anthropic model not initialized. Please check your API key.");
    }

    const messages = [];
    if (systemPrompt) {
      messages.push(new SystemMessage(systemPrompt));
    }
    messages.push(new HumanMessage(prompt));

    try {
      const response = await this.anthropicModel.invoke(messages);
      return response.content as string;
    } catch (error) {
      console.error("Error generating Anthropic response:", error);
      throw error;
    }
  }

  // Método para criar uma sequência de processamento
  createProcessingChain(systemPrompt: string) {
    if (!this.openaiModel) {
      throw new Error("OpenAI model not initialized. Please check your API key.");
    }

    return RunnableSequence.from([
      {
        system: () => systemPrompt,
        human: (input: { text: string }) => input.text,
      },
      {
        system: (input) => new SystemMessage(input.system),
        human: (input) => new HumanMessage(input.human),
      },
      this.openaiModel,
      new StringOutputParser(),
    ]);
  }

  // Método para processar conversas do Chatwoot com IA
  async processChatwootConversation(
    conversation: any,
    modelType: "openai" | "anthropic" | "google" | "cohere" = "openai"
  ): Promise<string> {
    const systemPrompt = `Você é um assistente especializado em análise de conversas de suporte ao cliente. 
    Analise a conversa fornecida e forneça insights sobre:
    1. Sentimento do cliente
    2. Urgência do problema
    3. Sugestões de resposta
    4. Classificação do tipo de problema
    
    Seja conciso e objetivo em sua análise.`;

    const conversationText = this.formatConversationForAI(conversation);
    const prompt = `Analise a seguinte conversa de suporte ao cliente:\n\n${conversationText}`;

    switch (modelType) {
      case "openai":
        return await this.generateOpenAIResponse(prompt, systemPrompt);
      case "anthropic":
        return await this.generateAnthropicResponse(prompt, systemPrompt);
      default:
        return await this.generateOpenAIResponse(prompt, systemPrompt);
    }
  }

  // Método para formatar conversa do Chatwoot para análise da IA
  private formatConversationForAI(conversation: any): string {
    if (!conversation.messages || !Array.isArray(conversation.messages)) {
      return "Conversa vazia ou formato inválido";
    }

    return conversation.messages
      .map((message: any) => {
        const sender = message.sender?.name || message.sender?.email || "Desconhecido";
        const content = message.content || "";
        const timestamp = message.created_at ? new Date(message.created_at).toLocaleString() : "";
        return `[${timestamp}] ${sender}: ${content}`;
      })
      .join("\n");
  }

  // Método para gerar sugestões de resposta
  async generateResponseSuggestions(
    conversation: any,
    modelType: "openai" | "anthropic" | "google" | "cohere" = "openai"
  ): Promise<string[]> {
    const systemPrompt = `Você é um assistente especializado em suporte ao cliente. 
    Com base na conversa fornecida, gere 3 sugestões de resposta diferentes que sejam:
    1. Profissionais e cordiais
    2. Diretas ao ponto
    3. Úteis para resolver o problema do cliente
    
    Retorne apenas as sugestões, uma por linha, sem numeração.`;

    const conversationText = this.formatConversationForAI(conversation);
    const prompt = `Com base na seguinte conversa, gere 3 sugestões de resposta:\n\n${conversationText}`;

    let response: string;
    switch (modelType) {
      case "openai":
        response = await this.generateOpenAIResponse(prompt, systemPrompt);
        break;
      case "anthropic":
        response = await this.generateAnthropicResponse(prompt, systemPrompt);
        break;
      default:
        response = await this.generateOpenAIResponse(prompt, systemPrompt);
    }

    return response.split("\n").filter((suggestion: string) => suggestion.trim().length > 0);
  }
}

// Instância singleton do serviço
export const langChainService = new LangChainService(); 