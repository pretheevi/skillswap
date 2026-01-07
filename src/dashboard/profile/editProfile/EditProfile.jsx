import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import axios from 'axios';
import API from '../../../axios/axios';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

function EditProfile(props) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", bio: "", avatar: null });
  const [preview, setPreview] = useState("");
  const [user, setUser] = useState({ name: "", avatar:"", bio:"" });
  const [loading, setLoading] = useState(false);

  const getImage = async (media_url) => {
    const response = await axios.get(`http://localhost:8080${media_url}`, { responseType: 'blob' });
    const imageBlob = response.data;
    const imageObjectURL = URL.createObjectURL(imageBlob);
    setPreview(imageObjectURL || null);
  }


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
        avatar: null // Don't set file object from fetched data
      });
      
      // Set user state
      setUser({name: data.name, avatar: data.avatar, bio: data.bio});
      
      // Set preview image if avatar exists
      if (data.avatar) {
        getImage(data.avatar);
      }
    } catch(error) {
      console.log(error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  }

  const submitForm = async (event) => {
    try {
      event.preventDefault();
      setLoading(true);
      
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('bio', form.bio);
      
      if (form.avatar) {
        formData.append('avatar', form.avatar);
      }

      console.log('Submitting form data:', {
        name: form.name,
        bio: form.bio,
        avatar: form.avatar?.name
      });

      const response = await API.post('/profile', formData);
      console.log('Update response:', response);

      toast.success('Profile updated!');
      navigate('/profile')
    } catch (error) {
      console.error(error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  }

  const handleInputChange = (event) => {
    const { name, value } = event.target;
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

      setForm(prev => ({ ...prev, avatar: file }));
      setPreview(URL.createObjectURL(file));
    }
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
              {preview ? (
                <img 
                  src={preview} 
                  alt="Preview" 
                  className='w-24 h-24 rounded-full object-cover border-2 border-gray-200'
                />
              ) : (
                <div className='w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center'>
                  <span className='text-gray-500 text-2xl'>👤</span>
                </div>
              )}
            </div>
            
            <label className='cursor-pointer'>
              <span className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm'>
                {preview && preview.includes('blob:') ? 'Change Photo' : 'Upload Photo'}
              </span>
              <input
                type="file"
                accept="image/*"
                className='hidden'
                onChange={handleFileChange}
              />
            </label>
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
              required
            />
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
            />
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