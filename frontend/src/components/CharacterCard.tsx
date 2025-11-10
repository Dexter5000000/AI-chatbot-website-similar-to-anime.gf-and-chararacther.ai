import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, User, Heart } from 'lucide-react';
import { Character } from '../types';

interface CharacterCardProps {
  character: Character;
}

const CharacterCard: React.FC<CharacterCardProps> = ({ character }) => {
  return (
    <Link
      to={`/chat/${character._id}`}
      className="block bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden group"
    >
      <div className="aspect-square relative overflow-hidden">
        <img
          src={character.avatar}
          alt={character.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="absolute bottom-4 left-4 right-4">
            <p className="text-white text-sm line-clamp-2">
              {character.personality}
            </p>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
          {character.name}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-3">
          {character.description}
        </p>
        
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center space-x-3">
            <span className="flex items-center">
              <MessageCircle className="w-3 h-3 mr-1" />
              {character.messageCount}
            </span>
            <span className="flex items-center">
              <User className="w-3 h-3 mr-1" />
              {character.createdBy?.username || 'Anonymous'}
            </span>
          </div>
          {character.isPublic && (
            <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 rounded-full">
              Public
            </span>
          )}
        </div>
        
        {character.tags && character.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {character.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-xs"
              >
                {tag}
              </span>
            ))}
            {character.tags.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-xs">
                +{character.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
};

export default CharacterCard;