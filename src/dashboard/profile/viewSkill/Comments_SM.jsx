import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import API from '../../../axios/axios';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faXmark } from "@fortawesome/free-solid-svg-icons";

function Commnent_SM(props) {
  const navigate = useNavigate();
  const skillId = props.skill_id;
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [avatarCache, setAvatarCache] = useState({});
  const [loading, setLoading] = useState(false);

  const getImage = async (media_url) => {
    const response = await axios.get(`http://localhost:8080${media_url}`, { responseType: 'blob' });
    const imageBlob = response.data;
    const imageObjectURL = URL.createObjectURL(imageBlob);
    return imageObjectURL;
  }

  const fetchComments = async (skillId) => {
    try {
      setLoading(true);
      const response = await API.get(`/comments/${skillId}`);
      const data = response.data;
      // Fetch avatars for all comments
      const commentsWithAvatars = await Promise.all(
        data.map(async (comment) => {
          const avatarUrl = await fetchAvatar(comment.user_avatar);
          return {
            ...comment,
            avatarUrl: avatarUrl
          };
        })
      );
      setComments(commentsWithAvatars);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error('Error fetching comments:', error);
    }
  };

  const fetchAvatar = async (media_url) => {
    if (!media_url) return null;

    try {
      if (avatarCache[media_url]) {
        return avatarCache[media_url];
      }

      if (media_url.startsWith('http')) {
        return media_url;
      }

      const imageObjectURL = await getImage(media_url);

      setAvatarCache(prev => ({
        ...prev,
        [media_url]: imageObjectURL
      }));

      return imageObjectURL;
    } catch (error) {
      console.error('Error fetching avatar:', error);
      return null;
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('token');
    if(!token) {
      navigate('/');
      return;
    }
    if (!skillId) return;
    fetchComments(skillId);
  }, []);

  const submitNewComment = async () => {
    if (!newComment.trim()) return;

    try {
      const response = await API.post('/comment', {
        text: newComment,
        skill_id: skillId
      });
      console.log('Comment submitted:', response);
      setNewComment('');
      fetchComments(skillId);
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  }

  const MAX_TEXT_LEN = 80;
  const [expanded, setExpanded] = useState({});

  const toggleExpand = (id) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  }

  const handleTextareaSize = (event) => {
    event.target.style.height = "auto";
    event.target.style.height = `${event.target.scrollHeight}px`;
  }

  return (
    <>
      <div className='flex flex-col bg-neutral-950 text-white w-full h-screen'>
        {/* Sticky Header */}
        <header className='sticky top-0 z-10 flex justify-between items-center flex-none w-full p-4 bg-neutral-950 border-b border-neutral-800'>
          <h1 className='text-xl font-bold'>Comments</h1>
          <FontAwesomeIcon 
            icon={faXmark} 
            onClick={() => props.setOpenComments(false)} 
            className='text-2xl cursor-pointer hover:text-neutral-400 transition-colors' 
          />
        </header>

        {/* Scrollable Main Content */}
        <main className='flex-1 overflow-y-auto w-full p-4'>
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <div className='animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500'></div>
            </div>
          ) : comments.length > 0 ? (
            comments.map((comment) => {
              const isExpanded = expanded[comment.id];
              const isLong = comment.text?.length > MAX_TEXT_LEN;

              return (
                <div key={comment.id} className='comment-item flex gap-4 mb-6'>
                  <div className="flex-none">
                    <img
                      src={comment.avatarUrl || '/default-avatar.png'}
                      className="w-10 h-10 rounded-full object-cover border border-neutral-700"
                      alt="Comment author"
                      onError={(e) => {
                        e.target.src = '/default-avatar.png';
                      }}
                    />
                  </div>

                  <div className='flex-1 min-w-0'>
                    <div className='mb-1'>
                      <span className="font-bold text-white">{comment.user_name}</span>
                      <span className="text-xs text-neutral-500 ml-2">
                        {new Date(comment.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="text-gray-300">
                      {isExpanded || !isLong
                        ? comment.text
                        : comment.text?.slice(0, MAX_TEXT_LEN)}
                      {isLong && (
                        <span
                          onClick={() => toggleExpand(comment.id)}
                          className="text-xs font-bold text-blue-500 hover:text-blue-400 hover:underline cursor-pointer ml-1"
                        >
                          {isExpanded ? "...Less" : "...More"}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="flex flex-col justify-center items-center h-full text-center text-gray-400">
              <p className="text-lg mb-2">No comments yet</p>
              <p className="text-sm">Be the first to comment!</p>
            </div>
          )}
        </main>

        {/* Sticky Footer */}
        <footer className='sticky bottom-0 z-10 flex justify-between items-end w-full bg-neutral-950 border-t border-neutral-800'>
          <textarea 
            rows={1}
            value={newComment}
            placeholder='Add a comment...'
            onInput={handleTextareaSize}
            onChange={(e) => setNewComment(e.target.value)}
            className='flex-1 bg-neutral-900 max-h-52 outline-none p-4 resize-none'></textarea>
          
          <p
            onClick={submitNewComment}
            disabled={!newComment.trim()}
            className={`font-bold transition-colors p-4 h-full flex items-center justify-center
              ${newComment.trim()
                ? 'text-white cursor-pointer'
                : 'text-gray-500 cursor-not-allowed'
              }`}
          >
            Post
          </p>
        </footer>
      </div>
    </>
  )
}

export default Commnent_SM;