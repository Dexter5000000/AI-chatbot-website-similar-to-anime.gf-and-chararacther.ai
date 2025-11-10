import mongoose, { Document, Schema } from 'mongoose';

export interface IMessage extends Document {
  userId: mongoose.Types.ObjectId;
  characterId: mongoose.Types.ObjectId;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

const messageSchema = new Schema<IMessage>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  characterId: {
    type: Schema.Types.ObjectId,
    ref: 'Character',
    required: true
  },
  content: {
    type: String,
    required: true,
    maxlength: 2000
  },
  role: {
    type: String,
    enum: ['user', 'assistant'],
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Compound index for efficient querying
messageSchema.index({ userId: 1, characterId: 1, timestamp: 1 });

export const Message = mongoose.model<IMessage>('Message', messageSchema);