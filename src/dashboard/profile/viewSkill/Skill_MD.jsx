import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import API from '../../../axios/axios';
import { toast } from 'sonner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faChevronLeft, faEllipsisV, faUser, faU } from '@fortawesome/free-solid-svg-icons';
import { faHeart, faComment } from '@fortawesome/free-regular-svg-icons';

function Skill_MD(props) {
  const navigate = useNavigate();
  const skill_id = props.skill_id;
  const [user, setUser] = useState({});
  const [skill, setSkill] = useState({});
  const [media, setMedia] = useState({});
  const [image, setImage] = useState('');
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState([]);
  const [avatarCache, setAvatarCache] = useState({});
  const [loading, setLoading] = useState(false);
  const [editPost, setEditPost] = useState(false);
  const [deletingPost, setDeletingPost] = useState(false);
  const isDeletingRef = useRef(false);

  const fetchUser = async (user_id) => {
    const response = await API.get(`/profileById/${user_id}`);
    console.log(response);
    setUser(response.data);
  }

  const fetchSkillById = async (skill_id) => {
    try {
      const response = await API.get(`/skills/${skill_id}`);
      const data = response.data
      await  fetchUser(data.user_id);
      console.log(data)
      setSkill(data || {});
      setMedia(data.media || {});
    } catch (error) {
      console.log(error)
    }
  }

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


  const fetchComments = async (skill_id) => {
    try {
      setLoading(true);
      const response = await API.get(`/comments/${skill_id}`);
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
      console.log(commentsWithAvatars)
      setComments(commentsWithAvatars);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error('Error fetching comments:', error);
    }
  };



  useEffect(() => {
    const token = localStorage.getItem('token');
    if(!token) {
      navigate('/');
      return;
    }
    if (!skill_id) return;
    fetchSkillById(skill_id);
    fetchComments(skill_id);
    console.log(JSON.parse(localStorage.getItem('user')))
  }, []);

  const submitNewComment = async () => {
    if (!newComment.trim()) return;

    try {
      const response = await API.post('/comment', {
        text: newComment,
        skill_id: skill_id
      });
      console.log('Comment submitted:', response);
      setNewComment('');
      fetchComments(skill_id);
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  }

  const handleDelete = async () => {
    // Check ref immediately (synchronous)
    if (isDeletingRef.current) {
      toast.info('Deletion already in progress...');
      return;
    }
    
    try {
      isDeletingRef.current = true; // Set ref immediately
      setDeletingPost(true); // Update state for UI
      
      toast.info('Deleting Skill post');
      await props.deletePost(skill_id);
      toast.success('Skill post deleted successfully');
      
    } catch(error) {
      toast.error('Deleting skill post failed. Try again');
    } finally {
      // Always reset both
      isDeletingRef.current = false;
      setDeletingPost(false);
    }
  };

  const [expandDescription, setExpandDescription] = useState(false);
  const SKILL_MAX_DESCRIPTION = 20;
  const isDescriptionLong = skill.description?.length > SKILL_MAX_DESCRIPTION;
  const toogleDescriptionExpand = (id) => {
    setExpandDescription(prev => !prev)
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
   
    <div className='flex justify-center items-center bg-neutral-950 text-white w-full h-screen'>
      <div className='relative flex flex-col justify-center items-center border border-neutral-800 w-1/2 h-screen'>
        <FontAwesomeIcon icon={faChevronLeft} className='absolute top-0 left-0 text-2xl cursor-pointer m-4' onClick={() => props.setShowSkill(false)} />
        {media && <img src={media.media_url} alt='skill image' />}
      </div>
      <div className='relative flex flex-col justify-center items-center border border-neutral-800 w-1/2 h-screen'>
        <header className='sticky top-0 left-0 w-full border border-neutral-800 p-4'>
          <div className='flex justify-start items-center gap-4'>
            {user.avatar
             ? (<img src={user.avatar} alt="pro-pic" className='w-20 h-20 rounded-full' />)
             : (<div className='flex justify-center items-center rounded-full text-2xl bg-neutral-500 w-12 h-10'>
                  <FontAwesomeIcon icon={faUser} />
                </div>)}
            <div className='flex justify-between items-center w-full'>
              <h1>{user.name}</h1>
              {props.profilePost && skill.user_id === JSON.parse(localStorage.getItem('user')).id && <FontAwesomeIcon icon={faEllipsisV} onClick={() => setEditPost(true)} className='cursor-pointer' />}
            </div>
          </div>
          <div className='wrap-break-word mt-4'>
            <p>
              {expandDescription || !isDescriptionLong
                ? skill.description
                : skill.description.slice(0, SKILL_MAX_DESCRIPTION)}
              {isDescriptionLong && (
                <span onClick={() => toogleDescriptionExpand()} className='text-indigo-500 font-bold cursor-pointer'>
                  {expandDescription ? "...Less" : "...More"}
                </span>
              )}
            </p>
          </div>
        </header>
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
                    {comment.avatarUrl ? (
                    <img
                      src={comment.avatarUrl || '/default-avatar.png'}
                      className="w-10 h-10 rounded-full object-cover border border-neutral-700"
                      alt="Comment author"
                      onError={(e) => {
                        e.target.src = '/default-avatar.png';
                      }}
                    />
                    ) : (
                      <div className='flex justify-center items-center rounded-full text-2xl bg-neutral-500 w-10 h-10'>
                        <FontAwesomeIcon icon={faUser} />
                      </div>
                    )}

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
    </div>

     {props.profilePost && editPost && <div className='profile-edit-bg'>
        <div className='profile-edit-container bg-neutral-800 w-lg h-96 rounded-2xl'>
          <p className='text-red-400 font-bold hover:bg-neutral-700' onClick={handleDelete}>
            {deletingPost ? 'Deleting...' : 'Delete Skill'}
          </p>
          <p
            className='hover:bg-neutral-700'
            onClick={() => navigate('/createPost', { state: { skill_id } })}
          >
            Edit Skill
          </p>
          <p className='hover:bg-neutral-700' onClick={() => setEditPost(false)}>Cancel</p>
        </div>
      </div>
      }
   </>
  )
}

export default Skill_MD;