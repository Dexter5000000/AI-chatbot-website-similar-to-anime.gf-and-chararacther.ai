import mongoose, { Document, Schema } from 'mongoose';

export interface ICharacter extends Document {
  name: string;
  description: string;
  personality: string;
  avatar: string;
  background?: string;
  greeting?: string;
  createdBy: mongoose.Types.ObjectId;
  isPublic: boolean;
  tags: string[];
  messageCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const characterSchema = new Schema<ICharacter>({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  description: {
    type: String,
    required: true,
    maxlength: 500
  },
  personality: {
    type: String,
    required: true,
    maxlength: 1000
  },
  avatar: {
    type: String,
    required: true
  },
  background: {
    type: String,
    maxlength: 1000
  },
  greeting: {
    type: String,
    maxlength: 200,
    default: "Hello! I'm excited to meet you!"
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  messageCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for searching characters
characterSchema.index({ name: 'text', description: 'text', tags: 'text' });

export const Character = mongoose.model<ICharacter>('Character', characterSchema);