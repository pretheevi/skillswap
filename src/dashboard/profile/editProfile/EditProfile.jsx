import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import axios from 'axios';
import API from '../../../axios/axios';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

function EditProfile(props) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", avatar: null, bio: "", remove_avatar: false });
  const [user, setUser] = useState({ name: "", avatar:"", bio:"" });
  const [loading, setLoading] = useState(false);
  const [bioLength, setBioLength] = useState(0);

  const MAX_NAME_LENGTH = 50;
  const MAX_BIO_LENGTH = 100;

  const getProfileInfo = async () => {
    try {
      setLoading(true);
      const response = await API.get('/profile');
      const data = response.data;
      console.log('Fetched user data:', data);
      
      // Set the form state with user data
      setForm({
        name: data.name || "",
        bio: data.bio || "",
        avatar: null, // Don't set file object from fetched data
        remove_avatar: false // Reset remove flag
      });
      
      // Set user state
      setUser({name: data.name, avatar: data.avatar, bio: data.bio});
      
      // Set initial bio length
      setBioLength(data.bio?.length || 0);
    } catch(error) {
      console.log(error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  }

  const validateForm = () => {
    // Name validation
    if (!form.name.trim()) {
      toast.error('Please enter your name');
      return false;
    }
    
    if (form.name.length > MAX_NAME_LENGTH) {
      toast.error(`Name must be less than ${MAX_NAME_LENGTH} characters`);
      return false;
    }
    
    // Bio validation
    if (form.bio.length > MAX_BIO_LENGTH) {
      toast.error(`Bio must be less than ${MAX_BIO_LENGTH} characters`);
      return false;
    }
    
    return true;
  }

  const submitForm = async (event) => {
    try {
      event.preventDefault();
      
      // Validate form before submission
      if (!validateForm()) {
        return;
      }
      
      setLoading(true);
      
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('bio', form.bio);
      
      // Check if we need to remove avatar
      if (form.remove_avatar) {
        formData.append('remove_avatar', 'true');
      }
      
      // Check if new file is uploaded
      if (form.avatar) {
        formData.append('avatar', form.avatar);
      }

      console.log('Submitting form data:', {
        name: form.name,
        bio: form.bio,
        avatar: form.avatar?.name,
        remove_avatar: form.remove_avatar
      });

      const response = await API.post('/profile', formData);
      console.log('Update response:', response);

      // Update local state after successful update
      setUser(prev => ({
        ...prev,
        name: form.name,
        bio: form.bio,
        avatar: form.remove_avatar ? "" : (response.data.user?.avatar || prev.avatar)
      }));
      
      // Reset remove_avatar flag
      setForm(prev => ({ ...prev, remove_avatar: false }));
      
      toast.success('Profile updated!');
      navigate('/profile')
    } catch (error) {
      console.error(error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  }

  const removeProfilePic = async () => {
    // Set remove_avatar flag to true
    setForm(prev => ({ ...prev, remove_avatar: true }));
    
    // Clear any selected file
    setForm(prev => ({ ...prev, avatar: null }));
    
    // Show immediate visual feedback
    setUser(prev => ({ ...prev, avatar: "" }));
    
    toast.success('Profile picture will be removed when you save changes');
  }

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    
    // For bio field, check character limit
    if (name === 'bio') {
      const currentLength = value.length;
      setBioLength(currentLength);
      
      // Don't allow typing beyond max length
      if (currentLength > MAX_BIO_LENGTH) {
        toast.error(`Bio cannot exceed ${MAX_BIO_LENGTH} characters`);
        return; // Don't update the state
      }
      
      // Warn when reaching limit
      if (currentLength === MAX_BIO_LENGTH) {
        toast.info('Maximum bio length reached');
      }
    }
    
    // For name field, check character limit
    if (name === 'name') {
      const currentLength = value.length;
      
      // Don't allow typing beyond max length
      if (currentLength > MAX_NAME_LENGTH) {
        toast.error(`Name cannot exceed ${MAX_NAME_LENGTH} characters`);
        return; // Don't update the state
      }
      
      // Warn when reaching limit
      if (currentLength === MAX_NAME_LENGTH) {
        toast.info('Maximum name length reached');
      }
    }
    
    setForm(prev => ({ ...prev, [name]: value }));
  }

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
         return;
      }

      // When uploading new file, clear remove_avatar flag
      setForm(prev => ({ ...prev, avatar: file, remove_avatar: false }));
      
      // Update preview immediately
      const reader = new FileReader();
      reader.onload = (e) => {
        setUser(prev => ({ ...prev, avatar: e.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Determine which avatar to show in preview
  const getAvatarPreview = () => {
    if (form.remove_avatar) {
      return ""; // Show default avatar when remove is clicked
    }
    if (form.avatar) {
      // If new file selected, use its preview
      return user.avatar; // This is updated by FileReader in handleFileChange
    }
    return user.avatar; // Otherwise show current avatar
  };

  useEffect(() => {
    getProfileInfo();
  }, []);

  if (loading && !form.name) {
    return (
      <div className='flex justify-center items-center min-h-screen bg-neutral-950'>
        <div className='text-white'>Loading...</div>
      </div>
    );
  }

  const avatarPreview = getAvatarPreview();

  return (
    <div className='flex justify-center items-center bg-neutral-950 w-full min-h-screen p-4 z-50'>
      <div className='w-full max-w-md bg-neutral-900 text-white border border-neutral-700 rounded-xl shadow-lg p-6'>
        <div className='flex justify-between'>
            <h2 className='text-2xl font-bold mb-6'>Edit Profile</h2>
            <div className='text-2xl cursor-pointer' onClick={() => navigate('/profile')}><FontAwesomeIcon icon={faXmark} /></div>
        </div>
        <form onSubmit={submitForm} className='space-y-6'>
          {/* Avatar Upload */}
          <div className='flex flex-col items-center'>
            <div className='mb-4'>
              {avatarPreview ? (
                <img 
                  src={avatarPreview} 
                  alt="Preview" 
                  className='w-24 h-24 rounded-full object-cover border-2 border-gray-200'
                />
              ) : (
                <div className='w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center'>
                  <span className='text-gray-500 text-2xl'>👤</span>
                </div>
              )}
            </div>
            
            <div className='flex justify-center items-center gap-2'>
              <label className='cursor-pointer mb-2'>
                <span className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm'>
                  {user.avatar && !form.remove_avatar && !form.avatar ? 'Change Photo' : 'Upload Photo'}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className='hidden'
                  onChange={handleFileChange}
                />
              </label>
            
              {/* Remove Profile Pic Button - Added here */}
              {user.avatar && !form.remove_avatar && !form.avatar && (
                <button
                  type="button"
                  onClick={removeProfilePic}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm mb-2"
                  disabled={loading}
                >
                  Remove Profile Pic
                </button>
              )}
            </div>
            
            <p className='text-xs text-gray-500 mt-2'>JPG, PNG up to 5MB</p>
          </div>

          {/* Name Field */}
          <div>
            <label className='block text-sm font-medium mb-2'>
              Name
            </label>
            <input 
              type='text'
              name='name' 
              value={form.name}
              className='w-full p-3 bg-neutral-800 border border-neutral-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-white'
              onChange={handleInputChange}
              placeholder='Your name'
              maxLength={MAX_NAME_LENGTH}
              required
            />
            <div className='text-xs text-neutral-400 mt-1 text-right'>
              {form.name.length}/{MAX_NAME_LENGTH}
            </div>
          </div>

          {/* Bio Field */}
          <div>
            <label className='block text-sm font-medium mb-2'>
              Bio
            </label>
            <textarea 
              name='bio' 
              value={form.bio}
              rows='4'
              className='w-full p-3 bg-neutral-800 border border-neutral-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none text-white'
              onChange={handleInputChange}
              placeholder='Tell something about yourself...'
              maxLength={MAX_BIO_LENGTH}
            />
            <div className={`text-xs mt-1 text-right ${
              bioLength > MAX_BIO_LENGTH ? 'text-red-400' : 'text-neutral-400'
            }`}>
              {bioLength}/{MAX_BIO_LENGTH}
            </div>
          </div>

          {/* Buttons */}
          <div className='flex gap-3 pt-4'>
            <button 
              type='submit'
              className='flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditProfile;