import React, { useEffect, useState } from 'react';
import { Await, useNavigate } from 'react-router-dom';
import axios from 'axios';
import API from '../../axios/axios';
import './postCard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faXmark, faArrowLeft, faChevronLeft, faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartRegular, faComment } from "@fortawesome/free-regular-svg-icons";
import Skill_SM from '../profile/viewSkill/Skill_SM';
import Commnent_SM from '../profile/viewSkill/Comments_SM';
import Skill_MD from '../profile/viewSkill/Skill_MD';

const PostCard = ({ post, profilePost, deletePost }) => {
  const [showSkillDetail, setShowSkillDetail] = useState(false);
   const [openComments, setOpenComments] = useState(false);
  const { 
      user_id, 
      user_name, 
      user_email,
      user_avatar, 
      skill_id, 
      skill_title,
      skill_description, 
      skill_level, 
      skill_category, 
      media, 
      rating, 
      comment_count
     } = post;

  const toggleShowComments = () => {
    if(!profilePost) {
      setOpenComments(true);
      setShowSkillDetail(true);
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('token');
    if(!token) {
      navigate('/');
      return;
    }
  })

  const SKILL_MAX_DESCRIPTION = 80;
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);
  const isDescriptionLong = skill_description?.length > SKILL_MAX_DESCRIPTION;
  const toogleDescriptionExpand = (id) => {
    setDescriptionExpanded(prev => !prev)
  }

  return (
    <>
      <article
        key={skill_id}
        className={`${profilePost ? 'border border-neutral-700' : 'w-full md:w-md lg:w-lg xl:w-xl mx-auto mb-6'}`}
        onClick={() => {
          if (profilePost) {
            setShowSkillDetail(true);
          }
        }}
      >
        <header className={`${profilePost ? '' : 'header-container ps-4'}`}>
          <img src={user_avatar} alt="prf-pic" className={`${profilePost ? 'hidden' : ''} flex-none`} />
          <div className={`flex justify-between ${profilePost ? '' : ''} flex-1`}>
            <div className={`${profilePost ? '' : ''}`}>
              <p className={`${profilePost ? 'hidden' : ''}`}>{user_name}</p>
            </div>
          </div>
        </header>
        <div className={`post-image-container ${profilePost ? 'h-28 md:h-33 lg:h-40 xl:h-48 mb-2' : 'max-h-[850px]'}`}>
          <img src={media[0].media_url} alt="post-media" />
        </div>
        <div className='like-comment-container my-4'>
          <span className={`${profilePost ? '' : 'cursor-pointer'} text-white`}>
            <FontAwesomeIcon icon={faHeartRegular} />
            {rating && <p>{rating}</p>}
          </span>
          <span className={`${profilePost ? '' : 'cursor-pointer'}`} onClick={() => !profilePost && toggleShowComments()}>
            <FontAwesomeIcon icon={faComment} />
            <p>{comment_count}</p>
          </span>
        </div>
        {!profilePost && <div className={`description-container ${profilePost ? 'hidden' : ''}`}>
          <p>
            {descriptionExpanded || !isDescriptionLong
              ? skill_description
              : skill_description.slice(0, SKILL_MAX_DESCRIPTION)}
            {isDescriptionLong && (
              <span onClick={() => toogleDescriptionExpand()}>
                {descriptionExpanded ? "...Less" : "...More"}
              </span>
            )}
          </p>
        </div>}
      </article>
      
      {profilePost && showSkillDetail && <div className='fixed bg-neutral-950 top-0 left-0 z-50 w-full h-screen md:hidden'>
          <Skill_SM skill_id={skill_id} setShowSkill={setShowSkillDetail} profilePost={profilePost} deletePost={deletePost} />
      </div>}

      {!profilePost && openComments && <div className='fixed bg-neutral-950 top-0 left-0 z-50 w-full h-screen md:hidden'>
        <Commnent_SM skill_id={skill_id} setOpenComments={setOpenComments} />
      </div> }
            
      {showSkillDetail && <div className='Skill_MD fixed bg-neutral-950 top-0 left-0 z-50 w-full h-screen'>
          <Skill_MD skill_id={skill_id} setShowSkill={setShowSkillDetail} profilePost={profilePost} deletePost={deletePost} />
      </div>}
    </>
  );
};

export default PostCard;