import { toast } from 'sonner';
import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faImage, faTimes, faPlus } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import API from '../../axios/axios';
import './createPost.css';

function CreatePost() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const skill_id = state?.skill_id;
  const isEdit = Boolean(skill_id);
  console.log('skill_id',skill_id, isEdit);
  const fileInputRef = useRef(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null); // Add this state

  const [form, setForm] = useState({
    title: '',
    category: '',
    level: 'beginner',
    description: '',
  });

  const categories = ['web', 'design', 'data', 'mobile', 'marketing', 'language'];

  const skillLevels = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'expert', label: 'Expert' }
  ];

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file type
    if (!file.type.includes('jpeg') && !file.type.includes('jpg')) {
      toast.error('Please upload only JPEG/JPG images');
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    // Store the file object
    setSelectedFile(file); // Add this

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
      toast.success('Image uploaded successfully');
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setPreviewImage(null);
    setSelectedFile(null); // Clear the stored file
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    toast.info('Image removed');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!previewImage) {
      toast.error('Please upload an image');
      return;
    }

    if (!form.title.trim()) {
      toast.error('Please enter a title');
      return;
    }

    if (!form.category) {
      toast.error('Please select a category');
      return;
    }

    if (!form.description.trim()) {
      toast.error('Please add a description');
      return;
    }

    const toastId = toast.loading('Creating your skill post...');

    try {
      const formData = new FormData();
      
      // For edit mode: only append media if a new file is selected
      // For create mode: always append media (it's required)
      if (isEdit && selectedFile) {
        formData.append('media', selectedFile);
      } else if (!isEdit) {
        if (!selectedFile) {
          toast.error('Please upload an image', { id: toastId });
          return;
        }
        formData.append('media', selectedFile);
      }
      
      // Always append form data
      formData.append('title', form.title);
      formData.append('category', form.category);
      formData.append('level', form.level);
      formData.append('description', form.description);

      console.log('Sending form data:', {
        isEdit,
        hasNewImage: !!selectedFile,
        title: form.title
      });

      console.log(selectedFile);
      const response = isEdit
        ? await API.put(`/skills/${skill_id}`, formData)
        : await API.post('/skills', formData);

      console.log('Response:', response);
      
      toast.success('Skill created successfully!', { id: toastId });
      setTimeout(() => navigate('/home'), 1000);
      
    } catch (err) {
      console.error('Error creating skill:', err);
      
      if (err.response) {
        const errorMessage = err.response.data?.error || err.response.data?.message || 'Failed to create post';
        toast.error(errorMessage, { id: toastId });
      } else if (err.request) {
        toast.error('Network error. Please check your connection.', { id: toastId });
      } else {
        toast.error('An unexpected error occurred. Please try again.', { id: toastId });
      }
    }
  };


  const getImage = async (media_url) => {
    const response = await axios.get(`http://localhost:8080${media_url}`, { responseType: 'blob' });
    return response.data
  }

  const fetchSkillById = async (skill_id) => {
    try {
      const response = await API.get(`/skills/${skill_id}`);
      const data = response.data
      console.log(data)
      setForm({
        title: data.title,
        category: data.category,
        level: data.level,
        description: data.description
      })

      const blob = await getImage(data.media_url);
      const file = new File([blob], 'existing-image.jpg', {
        type: blob.type,
      });

      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(blob));
    } catch(error) {
      console.log(error)
    }
  }
  useEffect(() => { 
    if(isEdit) {
      fetchSkillById(skill_id)
    } else {

    }
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTriggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className='bg-neutral-950 w-full min-h-screen text-white p-4'>
      <div className='flex flex-col w-full max-w-5xl mx-auto border border-neutral-800 rounded-xl overflow-hidden bg-neutral-900'>
        {/* Header */}
        <div className='w-full flex justify-between items-center p-4 border-b border-neutral-800 bg-neutral-900'>
          <button 
            className="p-2 hover:bg-neutral-800 rounded-lg transition"
            onClick={() => navigate('/home')}
          >
            <FontAwesomeIcon icon={faArrowLeft} className="text-xl" />
          </button>
          <h1 className='text-lg font-semibold'>Create New Post</h1>
          <button 
            className='px-4 py-2 rounded-lg font-medium bg-indigo-600 hover:bg-indigo-700 transition'
            onClick={handleSubmit}
          >
            Share
          </button>
        </div>

        {/* Main Content */}
        <div className='flex flex-col md:flex-row w-full flex-1'>
          {/* Image Upload Section */}
          <div className='w-full md:w-1/2 p-4'>
            <div className='border-2 border-dashed border-neutral-700 rounded-xl h-full min-h-[400px] flex flex-col items-center justify-center p-4 hover:border-neutral-600 transition'>
              {previewImage ? (
                <div className='relative w-full h-full'>
                  <img 
                    src={previewImage} 
                    alt="preview" 
                    className='w-full h-full object-contain rounded-lg'
                  />
                  <button 
                    className='absolute top-2 right-2 bg-black/70 hover:bg-black/90 p-2 rounded-full transition'
                    onClick={handleRemoveImage}
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </div>
              ) : (
                <div 
                  className='flex flex-col items-center justify-center w-full h-full cursor-pointer'
                  onClick={handleTriggerFileInput}
                >
                  <div className='bg-neutral-800 p-6 rounded-full mb-4'>
                    <FontAwesomeIcon icon={faPlus} className="text-4xl text-neutral-400" />
                  </div>
                  <p className='text-lg font-medium mb-2'>Upload your image</p>
                  <p className='text-neutral-400 text-sm mb-4'>JPEG only • Max 5MB</p>
                  <button className='px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-medium transition'>
                    Select from device
                  </button>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    name="media"
                    onChange={handleImageUpload} 
                    accept=".jpg,.jpeg,image/jpeg" 
                    className='hidden' 
                  />
                </div>
              )}
            </div>
          </div>

          {/* Form Details Section */}
          <div className='w-full md:w-1/2 p-4 border-t md:border-t-0 md:border-l border-neutral-800'>
            <div className='space-y-6'>
              {/* Author Info */}
              <div className='flex items-center space-x-3 p-3 bg-neutral-800/50 rounded-lg'>
                <div className='w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500'></div>
                <div>
                  <h3 className='font-semibold'>Your Name</h3>
                  <p className='text-sm text-neutral-400'>Skill Creator</p>
                </div>
              </div>

              {/* Title Input */}
              <div>
                <label className='block text-sm font-medium mb-2'>Title *</label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleInputChange}
                  placeholder='What skill are you sharing?'
                  className='w-full p-3 bg-neutral-800 border border-neutral-700 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'
                  maxLength={100}
                />
                <div className='text-xs text-neutral-400 mt-1 text-right'>
                  {form.title.length}/100
                </div>
              </div>

              {/* Category Select */}
              <div>
                <label className='block text-sm font-medium mb-2'>Category *</label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleInputChange}
                  className='w-full p-3 bg-neutral-800 border border-neutral-700 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 appearance-none'
                >
                  <option value="">Select a category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Skill Level */}
              <div>
                <label className='block text-sm font-medium mb-2'>Skill Level</label>
                <div className='flex space-x-2'>
                  {skillLevels.map(level => (
                    <button
                      key={level.value}
                      type="button"
                      className={`flex-1 py-2 px-3 rounded-lg font-medium transition ${form.level === level.value 
                        ? 'bg-indigo-600' 
                        : 'bg-neutral-800 hover:bg-neutral-700'}`}
                      onClick={() => setForm(prev => ({ ...prev, level: level.value }))}
                    >
                      {level.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className='block text-sm font-medium mb-2'>Description *</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleInputChange}
                  placeholder='Describe your skill, experience, or what you can teach...'
                  className='w-full p-3 bg-neutral-800 border border-neutral-700 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none'
                  rows={4}
                  maxLength={500}
                />
                <div className='text-xs text-neutral-400 mt-1 text-right'>
                  {form.description.length}/500
                </div>
              </div>

              {/* Tips */}
              <div className='p-3 bg-neutral-800/50 rounded-lg'>
                <p className='text-sm text-neutral-300'>
                  💡 <span className='font-medium'>Tip:</span> Be specific about what you can teach or what you want to learn
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreatePost;