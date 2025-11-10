import axios from 'axios';
import { Character } from '../models/Character';
import { Message } from '../models/Message';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export class LLMService {
  private provider: string;
  private apiKey?: string;
  private baseUrl?: string;
  private model: string;

  constructor() {
    this.provider = process.env.AI_SERVICE_PROVIDER || 'ollama';
    this.apiKey = process.env.HUGGINGFACE_API_KEY || process.env.GROQ_API_KEY;
    this.baseUrl = process.env.OLLAMA_BASE_URL;
    this.model = this.getDefaultModel();
  }

  private getDefaultModel(): string {
    switch (this.provider) {
      case 'huggingface':
        return process.env.HUGGINGFACE_MODEL || 'meta-llama/Llama-2-7b-chat-hf';
      case 'groq':
        return process.env.GROQ_MODEL || 'mixtral-8x7b-32768';
      case 'ollama':
        return process.env.OLLAMA_MODEL || 'mistral';
      default:
        return 'mistral';
    }
  }

  private buildPrompt(character: any, messages: ChatMessage[]): string {
    const systemPrompt = `You are ${character.name}. ${character.personality}. 
${character.background ? `Background: ${character.background}` : ''}
${character.greeting ? `You typically greet people by saying: "${character.greeting}"` : ''}

Stay in character at all times. Respond as ${character.name} would, maintaining their personality and speaking style.`;

    const conversationHistory = messages
      .slice(-10) // Keep last 10 messages for context
      .map(msg => `${msg.role === 'user' ? 'User' : character.name}: ${msg.content}`)
      .join('\n');

    return `${systemPrompt}\n\n${conversationHistory}\n\n${character.name}:`;
  }

  async generateResponse(
    characterId: string,
    userId: string,
    userMessage: string
  ): Promise<string> {
    try {
      // Get character details
      const character = await Character.findById(characterId);
      if (!character) {
        throw new Error('Character not found');
      }

      // Get recent message history
      const recentMessages = await Message.find({
        userId,
        characterId
      })
        .sort({ timestamp: -1 })
        .limit(10)
        .lean();

      // Build conversation array
      const conversation: ChatMessage[] = [
        ...recentMessages.reverse().map(msg => ({
          role: msg.role as 'user' | 'assistant',
          content: msg.content
        })),
        { role: 'user', content: userMessage }
      ];

      let response: string;

      switch (this.provider) {
        case 'huggingface':
          response = await this.callHuggingFace(character, conversation);
          break;
        case 'groq':
          response = await this.callGroq(character, conversation);
          break;
        case 'ollama':
          response = await this.callOllama(character, conversation);
          break;
        default:
          throw new Error('Unsupported AI provider');
      }

      return response;
    } catch (error) {
      console.error('LLM Service Error:', error);
      throw new Error('Failed to generate response');
    }
  }

  private async callHuggingFace(character: any, messages: ChatMessage[]): Promise<string> {
    if (!this.apiKey) {
      throw new Error('Hugging Face API key not configured');
    }

    const prompt = this.buildPrompt(character, messages);

    try {
      const response = await axios.post(
        `https://api-inference.huggingface.co/models/${this.model}`,
        {
          inputs: prompt,
          parameters: {
            max_new_tokens: 500,
            temperature: 0.7,
            do_sample: true,
            top_p: 0.9,
            return_full_text: false
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data && response.data[0] && response.data[0].generated_text) {
        return response.data[0].generated_text.trim();
      }

      throw new Error('Invalid response from Hugging Face API');
    } catch (error) {
      console.error('Hugging Face API Error:', error);
      throw error;
    }
  }

  private async callGroq(character: any, messages: ChatMessage[]): Promise<string> {
    if (!this.apiKey) {
      throw new Error('Groq API key not configured');
    }

    const systemPrompt = `You are ${character.name}. ${character.personality}. 
${character.background ? `Background: ${character.background}` : ''}
${character.greeting ? `You typically greet people by saying: "${character.greeting}"` : ''}

Stay in character at all times. Respond as ${character.name} would, maintaining their personality and speaking style.`;

    const conversation = [
      { role: 'system', content: systemPrompt },
      ...messages
    ];

    try {
      const response = await axios.post(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          model: this.model,
          messages: conversation,
          max_tokens: 500,
          temperature: 0.7,
          top_p: 0.9
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data && response.data.choices && response.data.choices[0]) {
        return response.data.choices[0].message.content.trim();
      }

      throw new Error('Invalid response from Groq API');
    } catch (error) {
      console.error('Groq API Error:', error);
      throw error;
    }
  }

  private async callOllama(character: any, messages: ChatMessage[]): Promise<string> {
    if (!this.baseUrl) {
      throw new Error('Ollama base URL not configured');
    }

    const systemPrompt = `You are ${character.name}. ${character.personality}. 
${character.background ? `Background: ${character.background}` : ''}
${character.greeting ? `You typically greet people by saying: "${character.greeting}"` : ''}

Stay in character at all times. Respond as ${character.name} would, maintaining their personality and speaking style.`;

    const conversation = [
      { role: 'system', content: systemPrompt },
      ...messages
    ];

    try {
      const response = await axios.post(
        `${this.baseUrl}/api/chat`,
        {
          model: this.model,
          messages: conversation,
          stream: false,
          options: {
            temperature: 0.7,
            top_p: 0.9,
            num_predict: 500
          }
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data && response.data.message && response.data.message.content) {
        return response.data.message.content.trim();
      }

      throw new Error('Invalid response from Ollama API');
    } catch (error) {
      console.error('Ollama API Error:', error);
      throw error;
    }
  }
}

export const llmService = new LLMService();