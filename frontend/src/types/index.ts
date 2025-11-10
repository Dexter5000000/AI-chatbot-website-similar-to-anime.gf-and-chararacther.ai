export interface Character {
  _id: string;
  name: string;
  description: string;
  personality: string;
  avatar: string;
  background?: string;
  greeting?: string;
  createdBy: {
    _id: string;
    username: string;
  };
  isPublic: boolean;
  tags: string[];
  messageCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  characterId: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
}