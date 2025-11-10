import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Edit, LogOut, MessageCircle, Settings } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import CharacterCard from '../components/CharacterCard';
import { Character } from '../types';

const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyCharacters();
  }, []);

  const fetchMyCharacters = async () => {
    try {
      const response = await fetch('/api/characters/user/my-characters', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setCharacters(data.characters || []);
    } catch (error) {
      toast.error('Failed to load your characters');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCharacter = async (characterId: string) => {
    if (!window.confirm('Are you sure you want to delete this character? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/characters/${characterId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete character');
      }

      setCharacters(prev => prev.filter(char => char._id !== characterId));
      toast.success('Character deleted successfully');
    } catch (error) {
      toast.error('Failed to delete character');
    }
  };

  if (!user) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Please log in to view your profile
        </h2>
        <Link
          to="/login"
          className="text-primary-600 dark:text-primary-400 hover:underline"
        >
          Go to Login →
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-primary-600 rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {user.username}
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                {user.email}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Member since {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
              <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <button
              onClick={logout}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 text-center">
          <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">
            {characters.length}
          </div>
          <div className="text-gray-600 dark:text-gray-300">
            Characters Created
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 text-center">
          <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">
            {characters.reduce((sum, char) => sum + char.messageCount, 0)}
          </div>
          <div className="text-gray-600 dark:text-gray-300">
            Total Messages
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 text-center">
          <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">
            {characters.filter(char => char.isPublic).length}
          </div>
          <div className="text-gray-600 dark:text-gray-300">
            Public Characters
          </div>
        </div>
      </div>

      {/* My Characters */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            My Characters
          </h2>
          <Link
            to="/create-character"
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Create New Character
          </Link>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 dark:bg-gray-700 rounded-lg h-64"></div>
              </div>
            ))}
          </div>
        ) : characters.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
            <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No characters yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Create your first AI character to get started
            </p>
            <Link
              to="/create-character"
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Create Character
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {characters.map(character => (
              <div key={character._id} className="relative group">
                <CharacterCard character={character} />
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex space-x-1">
                    <Link
                      to={`/create-character?edit=${character._id}`}
                      className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <Edit className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    </Link>
                    <button
                      onClick={() => handleDeleteCharacter(character._id)}
                      className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <LogOut className="w-4 h-4 text-red-600 dark:text-red-400" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;