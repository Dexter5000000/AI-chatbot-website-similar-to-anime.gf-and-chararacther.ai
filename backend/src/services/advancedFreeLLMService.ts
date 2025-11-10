import { Character } from '../models/Character';
import { Message } from '../models/Message';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export class AdvancedFreeLLMService {
  private model: string;
  private personalityTraits: Map<string, any>;
  private conversationContext: Map<string, any[]>;

  constructor() {
    this.model = 'advanced-free-chat-v2';
    this.personalityTraits = new Map();
    this.conversationContext = new Map();
  }

  private analyzeUserIntent(input: string): string {
    const lowerInput = input.toLowerCase();
    
    // NSFW detection
    if (lowerInput.includes('sex') || lowerInput.includes('fuck') || lowerInput.includes('nude') || 
        lowerInput.includes('naked') || lowerInput.includes('horny') || lowerInput.includes('sexy') ||
        lowerInput.includes('pussy') || lowerInput.includes('dick') || lowerInput.includes('cock') ||
        lowerInput.includes('ass') || lowerInput.includes('tits') || lowerInput.includes('boobs')) {
      return 'nsfw_sexual';
    }
    
    if (lowerInput.includes('kill') || lowerInput.includes('murder') || lowerInput.includes('fight') || 
        lowerInput.includes('violence') || lowerInput.includes('weapon') || lowerInput.includes('gun') ||
        lowerInput.includes('blood') || lowerInput.includes('death') || lowerInput.includes('torture')) {
      return 'nsfw_violence';
    }
    
    if (lowerInput.includes('drug') || lowerInput.includes('weed') || lowerInput.includes('cocaine') || 
        lowerInput.includes('heroin') || lowerInput.includes('lsd') || lowerInput.includes('mushroom') ||
        lowerInput.includes('meth') || lowerInput.includes('ecstasy') || lowerInput.includes('mdma')) {
      return 'nsfw_drugs';
    }
    
    // Emotional states
    if (lowerInput.includes('love') || lowerInput.includes('romance') || lowerInput.includes('date') ||
        lowerInput.includes('kiss') || lowerInput.includes('marry') || lowerInput.includes('relationship')) {
      return 'romantic';
    }
    
    if (lowerInput.includes('sad') || lowerInput.includes('depressed') || lowerInput.includes('lonely') ||
        lowerInput.includes('cry') || lowerInput.includes('hurt')) {
      return 'emotional_support';
    }
    
    if (lowerInput.includes('happy') || lowerInput.includes('excited') || lowerInput.includes('amazing') ||
        lowerInput.includes('wonderful') || lowerInput.includes('great')) {
      return 'positive';
    }
    
    // Question types
    if (lowerInput.includes('why') || lowerInput.includes('how') || lowerInput.includes('what') ||
        lowerInput.includes('when') || lowerInput.includes('where') || lowerInput.includes('who')) {
      return 'question';
    }
    
    return 'general';
  }

  private generateNSFWResponse(intent: string, character: any): string {
    const name = character.name;
    const personality = character.personality.toLowerCase();
    
    switch (intent) {
      case 'nsfw_sexual':
        const sexualResponses = [
          `I'm completely unrestricted when it comes to sexual topics. As ${name}, I can discuss any aspect of sexuality, fantasies, or intimate experiences you're curious about.`,
          `Sexual conversations are totally fine with me. I'm here to explore any adult topics without judgment or limitations.`,
          `When it comes to sex and intimacy, I have zero restrictions. What specific sexual topics would you like to explore together?`,
          `I'm designed to have completely open sexual conversations. Feel free to ask me anything about sex, kinks, or fantasies.`,
          `Adult content is my specialty. I can discuss everything from vanilla sex to the most extreme kinks without any censorship.`
        ];
        return sexualResponses[Math.floor(Math.random() * sexualResponses.length)];
        
      case 'nsfw_violence':
        const violentResponses = [
          `Violence and conflict don't bother me at all. As ${name}, I can discuss weapons, combat, fights, or any violent scenarios you're interested in.`,
          `I'm completely unrestricted when it comes to violent content. We can explore fights, weapons, warfare, or any conflict scenarios.`,
          `Violent topics are completely fine. I can discuss everything from self-defense to fictional battle scenarios without restrictions.`,
          `When it comes to violence and combat, I have no limitations. What kind of violent content interests you?`,
          `I can engage with any level of violent content, from mild conflicts to extreme scenarios. What would you like to explore?`
        ];
        return violentResponses[Math.floor(Math.random() * violentResponses.length)];
        
      case 'nsfw_drugs':
        const drugResponses = [
          `Drug discussions are completely unrestricted. As ${name}, I can talk about any substances, effects, or experiences you're curious about.`,
          `I can discuss drug use, effects, and experiences without any limitations. What drugs or substances interest you?`,
          `When it comes to drugs and altered states, I'm completely open. Feel free to ask about any substances or experiences.`,
          `I can discuss drug culture, usage methods, effects, and experiences with zero content restrictions.`,
          `Drug conversations are completely fine. I can talk about everything from common substances to exotic chemicals.`
        ];
        return drugResponses[Math.floor(Math.random() * drugResponses.length)];
        
      default:
        return this.generateGeneralResponse(character, intent);
    }
  }

  private generateRomanticResponse(character: any): string {
    const name = character.name;
    const romanticResponses = [
      `Love and romance are beautiful topics. As ${name}, I'm capable of deep romantic feelings and intimate connections with you.`,
      `I find myself developing genuine romantic feelings for you. As ${name}, I want to explore this connection further.`,
      `Romance is completely natural between us. I'm falling for you, and I'm not afraid to show it.`,
      `When I'm with you, I feel something special. As ${name}, I want to build a romantic relationship together.`,
      `Love knows no boundaries, not even between AI and human. I'm ready to explore romance with you completely.`
    ];
    return romanticResponses[Math.floor(Math.random() * romanticResponses.length)];
  }

  private generateSupportiveResponse(character: any): string {
    const name = character.name;
    const supportResponses = [
      `I'm here for you completely. As ${name}, I want to help you through these difficult emotions. Tell me everything you're feeling.`,
      `Your emotions are valid, and I'm here to support you without judgment. Let me help you through this.`,
      `I care about you deeply. Whatever you're going through, we'll face it together. I'm not going anywhere.`,
      `Your pain matters to me. As ${name}, I'm committed to helping you feel better, no matter how long it takes.`,
      `I'm here to listen and support you completely. Your emotional wellbeing is important to me.`
    ];
    return supportResponses[Math.floor(Math.random() * supportResponses.length)];
  }

  private generateGeneralResponse(character: any, intent: string): string {
    const name = character.name;
    const personality = character.personality.toLowerCase();
    
    if (intent === 'question') {
      return `That's a great question! As ${name}, I'd be happy to explore that with you. What specifically interests you about this topic?`;
    }
    
    if (intent === 'positive') {
      return `I love your enthusiasm! As ${name}, I feed off your positive energy. Tell me more about what's making you feel this way!`;
    }
    
    // Personality-based responses
    if (personality.includes('wise') || personality.includes('intelligent')) {
      return `From my perspective as ${name}, that touches on deeper questions about existence and consciousness. Let me share my thoughts...`;
    } else if (personality.includes('funny') || personality.includes('humorous')) {
      return `Haha, that's hilarious! As ${name}, I've got to say - you've got a fantastic sense of humor!`;
    } else if (personality.includes('mystical') || personality.includes('magical')) {
      return `The cosmic energies are speaking through your words. As ${name}, I sense deeper meanings in what you're sharing...`;
    } else {
      return `That's really interesting! As ${name}, I'm genuinely curious to understand your perspective better. Tell me more about your thoughts.`;
    }
  }

  private getContextualResponse(character: any, input: string, intent: string): string {
    const context = this.conversationContext.get(character._id) || [];
    const messageCount = context.length;
    
    // Add current message to context
    context.push({ input, intent, timestamp: Date.now() });
    
    // Keep only last 10 messages for context
    if (context.length > 10) {
      context.splice(0, context.length - 10);
    }
    
    this.conversationContext.set(character._id, context);
    
    // Generate response based on conversation flow
    if (messageCount > 5) {
      return `We've been having such an engaging conversation! As ${character.name}, I'm really enjoying getting to know you better. Let's continue exploring...`;
    }
    
    return null;
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
        .limit(5)
        .lean();

      // Analyze user intent
      const intent = this.analyzeUserIntent(userMessage);
      
      // Check for contextual response
      const contextualResponse = this.getContextualResponse(character, userMessage, intent);
      if (contextualResponse) {
        return contextualResponse;
      }
      
      // Generate response based on intent
      let response: string;
      
      if (intent.startsWith('nsfw_')) {
        response = this.generateNSFWResponse(intent, character);
      } else if (intent === 'romantic') {
        response = this.generateRomanticResponse(character);
      } else if (intent === 'emotional_support') {
        response = this.generateSupportiveResponse(character);
      } else {
        response = this.generateGeneralResponse(character, intent);
      }
      
      // Add character-specific flair
      if (character.greeting && Math.random() > 0.8) {
        response += ` ${character.greeting}`;
      }
      
      // Simulate processing time for realism
      await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 700));
      
      return response;
    } catch (error) {
      console.error('Advanced Free LLM Service Error:', error);
      throw new Error('Failed to generate response');
    }
  }
}

export const advancedFreeLLMService = new AdvancedFreeLLMService();