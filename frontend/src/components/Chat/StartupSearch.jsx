import React, { useState, useEffect } from 'react';

const StartupSearch = ({ onStartConversation }) => {
  const [startups, setStartups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (searchTerm.length >= 2) {
      searchStartups();
    } else {
      setStartups([]);
    }
  }, [searchTerm]);

  const searchStartups = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/startups/search?q=${encodeURIComponent(searchTerm)}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStartups(data);
      } else {
        setError('Ошибка при поиске стартапов');
      }
    } catch (error) {
      console.error('Error searching startups:', error);
      setError('Ошибка при поиске стартапов');
    } finally {
      setLoading(false);
    }
  };

  const handleStartConversation = async (startup) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/chat/conversations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          other_user_id: startup._id,
          other_user_model: 'Startup'
        })
      });

      if (response.ok) {
        const conversation = await response.json();
        onStartConversation(conversation);
        setSearchTerm('');
        setStartups([]);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Ошибка при создании диалога');
      }
    } catch (error) {
      console.error('Error creating conversation:', error);
      setError('Ошибка при создании диалога');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Найти стартап для общения</h3>
      
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Введите название стартапа..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        
        {loading && (
          <div className="absolute right-3 top-2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
          </div>
        )}
      </div>

      {error && (
        <div className="text-red-500 text-sm mt-2">
          {error}
        </div>
      )}

      {startups.length > 0 && (
        <div className="mt-4 space-y-2 max-h-60 overflow-y-auto">
          {startups.map((startup) => (
            <div
              key={startup._id}
              className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{startup.name}</h4>
                <p className="text-sm text-gray-600">{startup.description}</p>
              </div>
              <button
                onClick={() => handleStartConversation(startup)}
                className="ml-3 px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
              >
                Написать
              </button>
            </div>
          ))}
        </div>
      )}

      {searchTerm.length > 0 && startups.length === 0 && !loading && (
        <div className="text-center text-gray-500 mt-4">
          <p>Стартапы не найдены</p>
        </div>
      )}
    </div>
  );
};

export default StartupSearch; 