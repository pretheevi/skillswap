import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import API from "../../axios/axios";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";
import './comments.css';

function Comments(props) {
  const navigate = useNavigate();
  const [comments, setComments] = useState([]);
  const [commentLoading, setCommentLoading] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [authorAvatar, setAuthorAvatar] = useState(null);
  const [avatarCache, setAvatarCache] = useState({}); // Cache for avatar URLs


  const getImage = async (media_url) => {
    const response = await axios.get(`http://localhost:8080${media_url}`, { responseType: 'blob' });
    const imageBlob = response.data;
    const imageObjectURL = URL.createObjectURL(imageBlob);
    return imageObjectURL;
  }

  // Function to fetch avatar image
  const fetchAvatar = async (media_url) => {
    if (!media_url) return null;

    try {
      // Check cache first
      if (avatarCache[media_url]) {
        return avatarCache[media_url];
      }

      // If it's already a full URL, use it directly
      if (media_url.startsWith('http')) {
        return media_url;
      }

      const imageObjectURL = await getImage(media_url);

      // Cache the result
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

  const fetchComments = async () => {
    try {
      setCommentLoading(true);
      const response = await API.get(`/comments/${props.skill_id}`);
      const commentsData = response.data;

      // Fetch avatars for all comments
      const commentsWithAvatars = await Promise.all(
        commentsData.map(async (comment) => {
          const avatarUrl = await fetchAvatar(comment.user_avatar);
          return {
            ...comment,
            avatarUrl: avatarUrl
          };
        })
      );

      setComments(commentsWithAvatars);
      console.log('Fetched comments with avatars:', commentsWithAvatars);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setCommentLoading(false);
    }
  }

  const submitNewComment = async () => {
    if (!newComment.trim()) return;

    try {
      const response = await API.post('/comment', {
        text: newComment,
        skill_id: props.skill_id
      });
      console.log('Comment submitted:', response);
      setNewComment('');
      fetchComments(); // Refresh comments list
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  }

  // Fetch author avatar
  useEffect(() => {
    const fetchAuthorAvatar = async () => {
      if (props.user_avatar) {
        const avatar = await fetchAvatar(props.user_avatar);
        setAuthorAvatar(avatar);
      }
    };

    fetchAuthorAvatar();
  }, [props.profileImage]);

  useEffect(() => {
    fetchComments();
  }, [props.skill_id]);

  // Cleanup object URLs when component unmounts
  useEffect(() => {
    return () => {
      // Revoke all object URLs to prevent memory leaks
      Object.values(avatarCache).forEach(url => {
        if (url && url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, []);

  const handleTextareaSize = (event) => {
    event.target.style.height = "auto";
    event.target.style.height = `${event.target.scrollHeight}px`;
  }

  const MAX_TEXT_LEN = 80;
  const [expanded, setExpanded] = useState({});

  const toggleExpand = (id) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  }

  const SKILL_MAX_DESCRIPTION = 80;
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);
  const isDescriptionLong = props.skill_description?.length > SKILL_MAX_DESCRIPTION;

  const toogleDescriptionExpand = () => {
    setDescriptionExpanded(prev => !prev);
  }

  return (
    <div className="comments-bg-container bg-neutral-950">
      <div className="comments-media-section relative w-full md:w-1/2 flex justify-center items-center">
        <FontAwesomeIcon
          icon={faChevronLeft}
          onClick={() => props.toggleShowComments()}
          className="absolute top-4 left-4 text-3xl font-bold cursor-pointer text-white hover:text-gray-300"
        />
        <img src={props.image} className="media-image" alt="Skill media" />
      </div>

      <div className="comments-content-section flex flex-col w-full md:w-1/2 h-[95%] mt-10 md:mt-0 border-s border-neutral-400">
        <div className='post-metadata flex-none p-4'>
          <div className='post-author flex justify-start items-center gap-4'>
            <img
              src={authorAvatar || '/default-avatar.png'}
              className="author-avatar bg-neutral-500 w-15 h-15 rounded-full object-cover"
              alt="Author avatar"
              onError={(e) => {
                e.target.src = '/default-avatar.png';
              }}
            />
            <p className="author-name text-2xl font-bold text-white">{props.user_name}</p>
          </div>
          <div className='post-description'>
            <p className="description-text text-white">
              {descriptionExpanded || !isDescriptionLong
                ? props.skill_description
                : props.skill_description.slice(0, SKILL_MAX_DESCRIPTION)}
              {isDescriptionLong && (
                <span
                  onClick={toogleDescriptionExpand}
                  className="description-toggle text-blue-500 font-bold cursor-pointer hover:text-blue-400 ml-1"
                >
                  {descriptionExpanded ? "...Less" : "...More"}
                </span>
              )}
            </p>
          </div>
        </div>

        <div className="comments-list-container flex-1 overflow-x-hidden overflow-y-auto mt-4 p-4 border-t border-neutral-400 pt-4">
          {commentLoading ? (
            <div className="text-center text-white">Loading comments...</div>
          ) : comments.length > 0 ? (
            comments.map((comment) => {
              const isExpanded = expanded[comment.id];
              const isLong = comment.text?.length > MAX_TEXT_LEN;

              return (
                <div key={comment.id} className='comment-item flex gap-4 mb-4'>
                  <div className="flex-none">
                    <img
                      src={comment.avatarUrl || '/default-avatar.png'}
                      className="comment-author-avatar w-10 h-10 rounded-full bg-neutral-500 object-cover"
                      alt="Comment author"
                      onError={(e) => {
                        e.target.src = '/default-avatar.png';
                      }}
                    />
                  </div>

                  <div className='comment-content flex-1 min-w-0'>
                    <p className="comment-author font-bold text-white">{comment.user_name}</p>
                    <p className="comment-text text-gray-300">
                      {isExpanded || !isLong
                        ? comment.text
                        : comment.text?.slice(0, MAX_TEXT_LEN)}
                      {isLong && (
                        <span
                          onClick={() => toggleExpand(comment.id)}
                          className="comment-expand-toggle text-xs font-bold text-blue-500 hover:text-blue-400 hover:underline cursor-pointer ml-1"
                        >
                          {isExpanded ? "...Less" : "...More"}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center text-gray-400">No comments yet. Be the first to comment!</div>
          )}
        </div>

        <div className='add-comment-container flex-none flex justify-between items-center max-h-40 p-4 border-t border-neutral-500'>
          <textarea
            rows={1}
            value={newComment}
            placeholder='Add a comment...'
            onInput={handleTextareaSize}
            onChange={(e) => setNewComment(e.target.value)}
            className='flex-1 bg-transparent text-white outline-none resize-none placeholder-gray-500'
          />
          <button
            onClick={submitNewComment}
            disabled={!newComment.trim()}
            className={`ml-2 px-4 py-2 rounded-lg font-bold cursor-pointer transition-colors ${newComment.trim()
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-700 text-gray-500 cursor-not-allowed'
              }`}
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
}

export default Comments;