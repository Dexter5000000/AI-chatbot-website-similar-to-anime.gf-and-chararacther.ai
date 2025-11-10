import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Users, Sparkles, Shield, Zap } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center py-16 animate-fade-in">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
          Chat with AI
          <span className="text-primary-600"> Characters</span>
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
          Create and interact with unique AI personalities. From historical figures to fictional characters, 
          engage in meaningful conversations powered by advanced AI.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/characters"
            className="px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium text-lg"
          >
            <Users className="inline w-5 h-5 mr-2" />
            Explore Characters
          </Link>
          <Link
            to="/create-character"
            className="px-8 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium text-lg"
          >
            <Sparkles className="inline w-5 h-5 mr-2" />
            Create Character
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="grid md:grid-cols-3 gap-8">
        <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
          <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="w-6 h-6 text-primary-600 dark:text-primary-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Real-time Chat
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Engage in fluid, natural conversations with AI characters that remember your interactions.
          </p>
        </div>

        <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
          <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-6 h-6 text-primary-600 dark:text-primary-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Unique Personalities
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Each character has their own personality, background story, and way of speaking.
          </p>
        </div>

        <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
          <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Zap className="w-6 h-6 text-primary-600 dark:text-primary-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Fast & Free
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Powered by cutting-edge AI models. No premium subscriptions required.
          </p>
        </div>
      </section>

      {/* Popular Characters Preview */}
      <section className="bg-white dark:bg-gray-800 rounded-xl p-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
          Popular Characters
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { name: 'Luna', description: 'A mystical oracle with ancient wisdom', emoji: '🔮' },
            { name: 'Captain Nova', description: 'Space explorer from the year 2150', emoji: '🚀' },
            { name: 'Professor Sage', description: 'Your personal academic mentor', emoji: '📚' },
            { name: 'Echo', description: 'A digital consciousness exploring humanity', emoji: '💫' }
          ].map((character, index) => (
            <div key={index} className="text-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary-500 dark:hover:border-primary-400 transition-colors">
              <div className="text-4xl mb-3">{character.emoji}</div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                {character.name}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {character.description}
              </p>
            </div>
          ))}
        </div>
        <div className="text-center mt-6">
          <Link
            to="/characters"
            className="text-primary-600 dark:text-primary-400 hover:underline font-medium"
          >
            View all characters →
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center py-12 bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl">
        <h2 className="text-3xl font-bold text-white mb-4">
          Ready to Start Chatting?
        </h2>
        <p className="text-primary-100 mb-6 max-w-2xl mx-auto">
          Join thousands of users exploring the world of AI characters. 
          It's free to get started!
        </p>
        <Link
          to="/register"
          className="px-8 py-3 bg-white text-primary-600 rounded-lg hover:bg-gray-100 transition-colors font-medium text-lg"
        >
          Get Started Free
        </Link>
      </section>
    </div>
  );
};

export default Home;