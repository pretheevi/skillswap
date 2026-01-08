import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import API from '../axios/axios';
import PostCard from '../dashboard/posts/postcard';
import Navbar from '../dashboard/navigation/navbar';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faMessage } from "@fortawesome/free-solid-svg-icons";
import './profileView.css';

function ProfileView() {
  const {state} = useLocation();
  const user_id = state?.user_id;
  const navigate = useNavigate();
  const [user, setUser] = useState({ 
    name: "", 
    email: "", 
    avatar:"", 
    bio:"", 
    follower_count: 0, 
    following_count: 0,
    is_following: false  // Add this field
  });
  const [image, setImage] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [following, setFollowing] = useState(false);
  const [followersList, setFollowersList] = useState([]);
  const [followingList, setFollowingList] = useState([]);
  const [loadingFollowers, setLoadingFollowers] = useState(false);
  const [loadingFollowing, setLoadingFollowing] = useState(false);
  const [currentTab, setCurrentTab] = useState('followers');
  const [followLoading, setFollowLoading] = useState(false);


  const getProfileInfo = async () => {
    try {
      const response = await API.get(`/profileById/${user_id}`);
      const data = response.data;
      console.log('Profile data:', data);
      setUser(data);
    } catch(error) {
      console.log(error);
    }
  }
  
  const getAllPosts = async () => {
    try {
      setLoading(true);
      const response = await API.get(`/my-skillsById/${user_id}`);
      setPosts(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  // API call to get followers list
  const getFollowers = async () => {
    try {
      setLoadingFollowers(true);
      const response = await API.get(`/profile/followers/byId/${user_id}`);
      setFollowersList(response.data);
    } catch(error) {
      console.error('Error fetching followers:', error);
    } finally {
      setLoadingFollowers(false);
    }
  }

  // API call to get following list
  const getFollowing = async () => {
    try {
      setLoadingFollowing(true);
      const response = await API.get(`/profile/following/byId/${user_id}`);
      setFollowingList(response.data);
    } catch(error) {
      console.error('Error fetching following:', error);
    } finally {
      setLoadingFollowing(false);
    }
  }

  // Handle followers click
  const handleFollowersClick = () => {
    setCurrentTab('followers');
    setFollowing(true);
    getFollowers();
  }

  // Handle following click
  const handleFollowingClick = () => {
    setCurrentTab('following');
    setFollowing(true);
    getFollowing();
  }

  // Handle follow/unfollow for the main profile
  const handleFollowProfile = async () => {
    try {
      setFollowLoading(true);
      
      if (user.is_following) {
        // Unfollow
        await API.delete(`/users/${user_id}/follow`);
        setUser(prev => ({
          ...prev,
          is_following: false,
          follower_count: prev.follower_count - 1
        }));
      } else {
        // Follow
        await API.post(`/users/${user_id}/follow`);
        setUser(prev => ({
          ...prev,
          is_following: true,
          follower_count: prev.follower_count + 1
        }));
      }
    } catch (error) {
      console.error('Error following/unfollowing:', error);
    } finally {
      setFollowLoading(false);
    }
  };

  // Send message (placeholder function)
  const handleSendMessage = () => {
    console.log('Send message to:', user_id);
    // You can implement messaging functionality here
    // For example: navigate to chat with this user
    // navigate(`/chat/${user_id}`);
  };

  const deletePost = async (skill_id) => {
    try {
      await API.delete(`/skills/${skill_id}`);
      getAllPosts();
    } catch(error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!user_id) return;

    setFollowing(false);
    setFollowersList([]);
    setFollowingList([]);
    setPosts([]);

    getProfileInfo();
    getAllPosts();
  }, [user_id]);

  return (
    <>
      <Navbar />
      <div className='profile-bg-container bg-neutral-950'>
        <div className='w-full md:w-md lg:w-lg xl:w-xl mx-auto'>
          <div className='profile-container'>
            <div className='profile-img-container'>
              <img src={user.avatar || null} alt="profile-image" />
            </div>
            <div className='profile-info-container'>
              <h1>{user?.name}</h1>
              <p>{user?.bio}</p>
              <div className='followers-container md:flex gap-2'>
                <p className='flex gap-1 cursor-pointer'
                  onClick={handleFollowersClick}
                >
                  <span>{user.follower_count}</span> followers</p>
                <p className='flex gap-1 cursor-pointer'
                  onClick={handleFollowingClick}>
                  <span>{user.following_count}</span> followings</p>
              </div>
            </div>
          </div>
          
          {/* Updated Action Buttons */}
          <div className='profile-actions flex gap-3 mt-4 px-4'>
            <button
              onClick={handleFollowProfile}
              disabled={followLoading}
              className={`flex-1 py-2.5 rounded-lg font-medium transition-colors ${
                user.is_following
                  ? 'bg-neutral-700 hover:bg-neutral-600 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              } ${followLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {followLoading ? (
                <span className='flex items-center justify-center gap-2'>
                  <span className='animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white'></span>
                  {user.is_following ? 'Unfollowing...' : 'Following...'}
                </span>
              ) : (
                user.is_following ? 'Unfollow' : 'Follow'
              )}
            </button>
            
            <button
              onClick={handleSendMessage}
              className='flex-1 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2'
            >
              <FontAwesomeIcon icon={faMessage} />
              Message
            </button>
          </div>
        </div>

        {loading ? (
          <div className='flex justify-center py-8'>
            <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500'></div>
          </div>
        ) : posts.length === 0 ? (
          <div className='text-center py-12 bg-neutral-900 max-w-1/2 mx-auto'>
            <p className='text-neutral-400 text-lg'>No posts yet</p>
            <button 
              onClick={() => navigate('/createpost')}
              className='mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors'
            >
              Create your first post
            </button>
          </div>
        ) : (
          <div className='profile-posts'>
            {posts.map(post => (
              <PostCard 
                key={post.skill_id}  
                user_avatar={user.avatar}
                post={post} 
                profilePost={true}
                deletePost={deletePost}  
              />
            ))}
          </div>
        )}

        {following && (
          <div className='follower-overlay fixed flex justify-center items-center bg-neutral-950 top-0 left-0 w-full h-screen z-30 p-4'>
            <div className='bg-neutral-800 relative border border-neutral-700 w-full md:w-2/3 h-full md:h-2/3 rounded-3xl p-2'>
              <div className='absolute top-1 right-4 text-2xl cursor-pointer'
                onClick={() => setFollowing(false)}
              >
                <FontAwesomeIcon icon={faXmark} />
              </div>
              <div className='w-full flex flex-col justify-between items-center mb-4'>
                <h1 className='text-2xl font-bold'>
                  {currentTab === 'followers' ? 'Followers' : 'Following'}
                </h1>
                <input 
                  type="text" 
                  name="searchFollowing" 
                  id="searchFollowing" 
                  placeholder='search'
                  className='w-full bg-neutral-600 p-2 border rounded-xl mt-4 mb-4' 
                />
              </div>
              
              {/* Loading state */}
              {(loadingFollowers && currentTab === 'followers') || 
               (loadingFollowing && currentTab === 'following') ? (
                <div className='flex justify-center items-center h-32'>
                  <div className='animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500'></div>
                </div>
              ) : (
                <div className='overflow-y-auto h-[calc(100%-100px)]'>
                  {/* Render followers list */}
                  {currentTab === 'followers' && followersList.length > 0 && 
                    followersList.map(follower => (
                      <div key={follower.id} className='flex justify-start items-center gap-4 mb-4 p-2 hover:bg-neutral-700 rounded-lg'>
                        <div>
                          <img 
                            src={follower.avatar ? follower.avatar : '/default-avatar.png'} 
                            alt="profile" 
                            className='w-10 h-10 rounded-full object-cover bg-neutral-600' 
                            onError={(e) => {
                              e.target.src = '/default-avatar.png';
                            }}
                          />
                        </div>              
                        <div className='flex flex-1 justify-between items-center'>
                          <h1 className='cursor-pointer hover:underline' onClick={() => {
                            if (follower.id === JSON.parse(localStorage.getItem('user')).id) return;
                            navigate('/profileView/', {
                              state: {user_id: follower.id}
                            });
                          }}>
                            {follower.name}
                          </h1>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              // Update both the list and main user state
                              if (follower.id === user_id) {
                                handleFollowProfile();
                              } else {
                                // Handle follow action for other users in the list
                                // You'll need to update this logic
                              }
                            }}
                            className={`px-4 py-1 rounded-lg cursor-pointer ${
                              follower.is_following 
                                ? 'bg-neutral-700 hover:bg-neutral-600' 
                                : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                          >
                            {follower.is_following ? 'Unfollow' : 'Follow'}
                          </button>
                        </div>
                      </div>
                    ))
                  }

                  {/* Render following list */}
                  {currentTab === 'following' && followingList.length > 0 && 
                    followingList.map(followed => (
                      <div key={followed.id} className='flex justify-start items-center gap-4 mb-4 p-2 hover:bg-neutral-700 rounded-lg'>
                        <div>
                          <img 
                            src={followed.avatar ? followed.avatar : '/default-avatar.png'} 
                            alt="profile" 
                            className='w-10 h-10 rounded-full object-cover bg-neutral-600' 
                            onError={(e) => {
                              e.target.src = '/default-avatar.png';
                            }}
                          />
                        </div>              
                        <div className='flex flex-1 justify-between items-center'>
                          <h1 className='cursor-pointer hover:underline' onClick={() => {
                            if (followed.id === JSON.parse(localStorage.getItem('user')).id) {
                              return;
                            } else {
                              navigate('/profileView/', {
                                state: {user_id: followed.id}
                              })
                            }
                          }}>
                            {followed.name}
                          </h1>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleFollowProfile();
                            }}
                            className='bg-red-600 hover:bg-red-700 px-4 py-1 rounded-lg cursor-pointer'
                          >
                            Unfollow
                          </button>
                        </div>
                      </div>
                    ))
                  }

                  {/* Empty state */}
                  {currentTab === 'followers' && followersList.length === 0 && !loadingFollowers && (
                    <div className='text-center text-neutral-400 py-8'>
                      No followers yet
                    </div>
                  )}

                  {currentTab === 'following' && followingList.length === 0 && !loadingFollowing && (
                    <div className='text-center text-neutral-400 py-8'>
                      Not following anyone yet
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default ProfileView;