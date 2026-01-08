import React, { useEffect, useRef, useState } from 'react'
import API from '../../../axios/axios';
import { toast } from 'sonner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { faHeart, faComment } from '@fortawesome/free-regular-svg-icons';
import Comments_SM from './Comments_SM';
import { useNavigate } from 'react-router-dom';

function Skill_SM(props) {
  const navigate = useNavigate();
  const skill_id = props.skill_id;
  const [skill, setSkill] = useState({});
  const [media, setMedia] = useState({});
  const [image, setImage] = useState('');
  const [expandDescription, setExpandDescription] = useState(false);
  const [openComments, setOpenComments] = useState(false);
  const [editPost, setEditPost] = useState(false);
  const [deletingPost, setDeletingPost] = useState(false);
  const isDeletingRef = useRef(false);

  const fetchSkillById = async (skill_id) => {
    try {
      const response = await API.get(`/skills/${skill_id}`);
      const data = response.data
      console.log(data)
      setSkill(data || {});
      setMedia(data.media || {});
      console.log(data)
    } catch (error) {
      console.log(error)
    }
  }


  useEffect(() => {
    fetchSkillById(skill_id);
  }, []);

  const SKILL_MAX_DESCRIPTION = 20;
  const isDescriptionLong = skill.description?.length > SKILL_MAX_DESCRIPTION;
  const toogleDescriptionExpand = (id) => {
    setExpandDescription(prev => !prev)
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

  return (
    <>
      <div className='flex flex-col bg-neutral-950 text-white w-full h-screen'>
        <header className='relative flex justify-center items-center p-4'>
          <FontAwesomeIcon icon={faXmark} className='absolute right-4 text-xl' onClick={() => props.setShowSkill(false)} />
          <h1>Post</h1>
        </header>
        <main className='max-h-1/2 overflow-hidden'>
          <div className='flex justify-center items-center w-full h-full object-contain'>
            {media && <img src={media.media_url} alt="skill image" className='object-contain' />}
          </div>
        </main>
        <footer className='p-4'>
          <div className='flex justify-between gap-2 w-full'>
            <div className='flex gap-2'>
            <div className='flex justify-center items-center gap-1'>
              <FontAwesomeIcon icon={faHeart} className='cursor-pointer' />
              <p>{skill?.rating}</p>
            </div>
            <div className='flex justify-center items-center gap-1 cursor-pointer' onClick={() => setOpenComments(true)}>
              <FontAwesomeIcon icon={faComment} className='cursor-pointer' />
              <p>{skill?.comments?.comment_count}</p>
            </div>
            </div>
            <div>
              {props.profilePost && <FontAwesomeIcon icon={faEllipsisV} onClick={() => setEditPost(true)} />}
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
        </footer>
      </div>

      {openComments && <div className='fixed top-0 left-0 w-full h-screen z-50'>
        <Comments_SM skill_id={skill_id} setOpenComments={setOpenComments} />
      </div>}

      {props.profilePost && editPost && <div className='profile-edit-bg'>
        <div className='profile-edit-container bg-neutral-800 w-lg h-96 rounded-2xl'>
          <p className='text-red-400 font-bold hover:bg-neutral-700' onClick={handleDelete}>Delete Skill</p>
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

export default Skill_SM;