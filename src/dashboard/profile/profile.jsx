import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API from '../../axios/axios';
import Postcard from '../posts/postcard';
import NavBar from '../navigation/navbar';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import './profile.css';

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: "", email: "", avatar:"", bio:"", follower_count: 0, following_count: 0 });
  const [image, setImage] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [following, setFollowing] = useState(false);
  const [followersList, setFollowersList] = useState([]);
  const [followingList, setFollowingList] = useState([]);
  const [loadingFollowers, setLoadingFollowers] = useState(false);
  const [loadingFollowing, setLoadingFollowing] = useState(false);
  const [currentTab, setCurrentTab] = useState('followers'); // 'followers' or 'following'
  const [editProfile, setEditProfile] = useState(false);

  const getImage = async (media_url) => {
    const response = await axios.get(`http://localhost:8080${media_url}`, { responseType: 'blob' });
    const imageBlob = response.data;
    const imageObjectURL = URL.createObjectURL(imageBlob);
    setImage(imageObjectURL || null);
  }

  const getProfileInfo = async () => {
    try {
      const response = await API.get('/profile');
      const data = response.data;
      getImage(data.avatar);
      setUser(data);
    } catch(error) {
      console.log(error);
    }
  }
  
  const getAllPosts = async () => {
    try {
      setLoading(true);
      const response = await API.get('/my-skills');
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
      const response = await API.get('/profile/followers');
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
      const response = await API.get('/profile/following');
      console.log(response)
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

  // Refresh user data to get updated counts from server
  const refreshUserData = async () => {
    try {
      const response = await API.get('/profile');
      const updatedData = response.data;
      setUser(updatedData);
    } catch (error) {
      console.error('Error refreshing user data:', error);
    }
  };

  // Combined follow/unfollow handler (simpler approach)
  const handleFollowAction = async (userId, isCurrentlyFollowing) => {
    try {
      if (isCurrentlyFollowing) {
        await API.delete(`/users/${userId}/follow`);
      } else {
        await API.post(`/users/${userId}/follow`);
      }

      // Update the appropriate list based on current tab
      if (currentTab === 'followers') {
        setFollowersList(prev => 
          prev.map(user => 
            user.id === userId 
              ? { ...user, is_following: !isCurrentlyFollowing } 
              : user
          )
        );
      } else {
        // For following tab, remove from list if unfollowing
        if (isCurrentlyFollowing) {
          setFollowingList(prev => prev.filter(user => user.id !== userId));
        }
      }

      // Refresh user counts from server
      await refreshUserData();
      
    } catch (error) {
      console.error('Error in follow action:', error);
    }
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
    const token = JSON.stringify(localStorage.getItem('token'));
    if (!token) {
      navigate('/');
      return;
    }
    getProfileInfo();
    getAllPosts();
  }, []);

  return (
    <>
    <div className='profile-bg-container bg-neutral-950'>
      <NavBar />
      <div className='w-full md:w-md lg:w-lg xl:w-xl mx-auto'>
        <div className='profile-container'>
          <div className='profile-img-container'>
            <img src={image || null} alt="profile-image" />
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
        <div className='profile-info-button'>
          <button className='bg-neutral-700' onClick={() => navigate('/editProfile')}>Edit Profile</button>
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
            Create your first posta
          </button>
        </div>
      ) : (
        <div className='profile-posts'>
          {posts.map(post => (
            <Postcard 
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
                          src={follower.avatar ? `http://localhost:8080${follower.avatar}` : '/default-avatar.png'} 
                          alt="profile" 
                          className='w-10 h-10 rounded-full object-cover bg-neutral-600' 
                          onError={(e) => {
                            e.target.src = '/default-avatar.png';
                          }}
                        />
                      </div>              
                      <div className='flex flex-1 justify-between items-center'>
                        <h1 className='cursor-pointer hover:underline'  onClick={() => navigate('/profileView/', {state: {user_id: follower.id}})}>
                          {follower.name}
                        </h1>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleFollowAction(follower.id, follower.is_following);
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
                          src={followed.avatar ? `http://localhost:8080${followed.avatar}` : '/default-avatar.png'} 
                          alt="profile" 
                          className='w-10 h-10 rounded-full object-cover bg-neutral-600' 
                          onError={(e) => {
                            e.target.src = '/default-avatar.png';
                          }}
                        />
                      </div>              
                      <div className='flex flex-1 justify-between items-center'>
                        <h1 className='cursor-pointer hover:underline' onClick={() => navigate('/profileView/', {state: {user_id: followed.id}})}>
                          {followed.name}
                        </h1>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleFollowAction(followed.id, true); // true = is currently following
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

export default Profile;