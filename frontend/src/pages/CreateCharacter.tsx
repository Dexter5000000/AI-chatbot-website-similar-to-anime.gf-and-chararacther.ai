import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Upload, Image as ImageIcon, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';

interface CreateCharacterFormData {
  name: string;
  description: string;
  personality: string;
  background: string;
  greeting: string;
  avatar: string;
  isPublic: boolean;
  tags: string[];
}

const CreateCharacter: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [tagInput, setTagInput] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<CreateCharacterFormData>({
    defaultValues: {
      isPublic: true,
      tags: [],
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + Math.random().toString(36).substring(7)
    }
  });

  const tags = watch('tags');

  const onSubmit = async (data: CreateCharacterFormData) => {
    if (!user) {
      toast.error('You must be logged in to create a character');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/characters', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create character');
      }

      const newCharacter = await response.json();
      toast.success('Character created successfully!');
      navigate(`/chat/${newCharacter._id}`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to create character');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setValue('tags', [...tags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setValue('tags', tags.filter(tag => tag !== tagToRemove));
  };

  const generateRandomAvatar = () => {
    const seed = Math.random().toString(36).substring(7);
    const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;
    setValue('avatar', avatarUrl);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/characters')}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Create Character
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Design a unique AI personality
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Avatar */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Character Avatar
            </label>
            <div className="flex items-center space-x-4">
              <img
                src={watch('avatar')}
                alt="Character avatar"
                className="w-20 h-20 rounded-full"
              />
              <div className="flex-1">
                <input
                  {...register('avatar', { required: 'Avatar URL is required' })}
                  type="url"
                  placeholder="Enter avatar URL"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={generateRandomAvatar}
                  className="mt-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm"
                >
                  <Sparkles className="inline w-4 h-4 mr-1" />
                  Generate Random Avatar
                </button>
              </div>
            </div>
            {errors.avatar && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.avatar.message}
              </p>
            )}
          </div>

          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Character Name *
            </label>
            <input
              {...register('name', { 
                required: 'Character name is required',
                maxLength: { value: 50, message: 'Name must be less than 50 characters' }
              })}
              type="text"
              placeholder="e.g., Luna, Captain Nova, Professor Sage"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description *
            </label>
            <textarea
              {...register('description', { 
                required: 'Description is required',
                maxLength: { value: 500, message: 'Description must be less than 500 characters' }
              })}
              rows={3}
              placeholder="Brief description of your character (e.g., A mystical oracle with ancient wisdom)"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Personality */}
          <div>
            <label htmlFor="personality" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Personality *
            </label>
            <textarea
              {...register('personality', { 
                required: 'Personality is required',
                maxLength: { value: 1000, message: 'Personality must be less than 1000 characters' }
              })}
              rows={4}
              placeholder="Describe your character's personality, speaking style, quirks, and mannerisms. This will guide how the AI responds."
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            {errors.personality && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.personality.message}
              </p>
            )}
          </div>

          {/* Background */}
          <div>
            <label htmlFor="background" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Background Story (Optional)
            </label>
            <textarea
              {...register('background', { 
                maxLength: { value: 1000, message: 'Background must be less than 1000 characters' }
              })}
              rows={3}
              placeholder="Your character's backstory, history, or context that might come up in conversations"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            {errors.background && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.background.message}
              </p>
            )}
          </div>

          {/* Greeting */}
          <div>
            <label htmlFor="greeting" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Default Greeting (Optional)
            </label>
            <input
              {...register('greeting', { 
                maxLength: { value: 200, message: 'Greeting must be less than 200 characters' }
              })}
              type="text"
              placeholder="Hello! I'm excited to meet you!"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            {errors.greeting && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.greeting.message}
              </p>
            )}
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tags
            </label>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              placeholder="Add tags and press Enter (e.g., Friendly, Wise, Funny)"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 rounded-full text-sm flex items-center"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-2 text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-200"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Public/Private */}
          <div>
            <label className="flex items-center space-x-2">
              <input
                {...register('isPublic')}
                type="checkbox"
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Make this character public (others can chat with them)
              </span>
            </label>
          </div>

          {/* Submit */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/characters')}
              className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                'Create Character'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCharacter;