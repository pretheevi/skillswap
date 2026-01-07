import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../axios/axios';
import NavBar from '../navigation/navbar';

export default function Explore() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Search users
  const searchUsers = async (query) => {
    if (!query.trim()) {
      setUsers([]);
      return;
    }

    try {
      setLoading(true);
      // Assuming API endpoint: GET /users/search?q={query}
      const response = await API.get(`/users/search?q=${encodeURIComponent(query)}`);
      console.log(response)
      setUsers(response.data || []);
    } catch (error) {
      console.error('Error searching users:', error);
    } finally {
      setLoading(false);
    }
  };

  // Debounced search
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      searchUsers(searchQuery);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  // Handle follow action
  const handleFollow = async (userId) => {
    try {
      // Assuming API endpoint: POST /users/{userId}/follow
      await API.post(`/users/${userId}/follow`);
      
      // Update local state
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userId 
            ? { ...user, is_following: true }
            : user
        )
      );
    } catch (error) {
      console.error('Error following user:', error);
    }
  };

  // Handle unfollow action
  const handleUnfollow = async (userId) => {
    try {
      // Assuming API endpoint: DELETE /users/{userId}/follow
      await API.delete(`/users/${userId}/follow`);
      
      // Update local state
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userId 
            ? { ...user, is_following: false }
            : user
        )
      );
    } catch (error) {
      console.error('Error unfollowing user:', error);
    }
  };

  // Navigate to user profile
  const navigateToProfile = (userId) => {
    navigate(`/profile/${userId}`);
  };

  return (
    <div className='bg-neutral-950 min-h-screen text-white p-4'>
      <NavBar />
      <div className='max-w-2xl mx-auto'>
        {/* Search Bar */}
        <div className='mb-6'>
          <input
            type="text"
            placeholder='Search users...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='w-full p-3 bg-neutral-900 border border-neutral-700 rounded-lg focus:outline-none focus:border-blue-500'
          />
        </div>

        {/* Search Results */}
        {searchQuery && (
          <div>
            {loading ? (
              <div className='flex justify-center py-8'>
                <div className='animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500'></div>
              </div>
            ) : users.length > 0 ? (
              <div className='space-y-3'>
                {users.map(user => (
                  <div 
                    key={user.id} 
                    className='bg-neutral-900 rounded-lg p-4 hover:bg-neutral-800 transition-colors cursor-pointer'
                    onClick={() => navigateToProfile(user.id)}
                  >
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center gap-3'>
                        <img 
                          src={user.avatar ? `http://localhost:8080${user.avatar}` : '/default-avatar.png'} 
                          alt={user.name}
                          className='w-10 h-10 rounded-full object-cover border border-neutral-700'
                          onError={(e) => {
                            e.target.src = '/default-avatar.png';
                          }}
                        />
                        <div>
                          <h3 className='font-medium'>{user.name}</h3>
                          {user.bio && (
                            <p className='text-sm text-neutral-400 truncate max-w-xs'>{user.bio}</p>
                          )}
                        </div>
                      </div>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          user.is_following ? handleUnfollow(user.id) : handleFollow(user.id);
                        }}
                        className={`px-4 py-1 rounded-lg text-sm ${
                          user.is_following 
                            ? 'bg-neutral-700 hover:bg-neutral-600' 
                            : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                      >
                        {user.is_following ? 'Following' : 'Follow'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className='text-center py-8 text-neutral-400'>
                No users found for "{searchQuery}"
              </div>
            )}
          </div>
        )}

        {/* Empty state when no search */}
        {!searchQuery && (
          <div className='text-center py-12 text-neutral-400'>
            <p>Search for users by name or username</p>
          </div>
        )}
      </div>
    </div>
  );
}