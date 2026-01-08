import React, { useState, useEffect } from "react";
import {toast} from 'sonner';
import { useNavigate } from 'react-router-dom';
import API from "../axios/axios";
import './authentication.css';

function Register() {
  const navigate = useNavigate();
  const [form, setFrom] = useState({
    name: "",
    email: "", 
    password: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({
    name: false,
    email: false, 
    password: false,
    confirmPassword: false   
  });

  const validateForm = (form) => {
    let isValid = true;
    if(form.name.length <= 3) {
      isValid = false;
      setError(prev => ({...prev, name:true}));
    }
    if(form.email.length === 0) {
      isValid = false;
      setError(prev => ({...prev, email:true}));
    }
    if(!form.email.includes('@')) {
      isValid = false;
      setError(prev => ({...prev, email:true}));
    } 
    if(form.password.length <= 4) {
      isValid = false;
      setError(prev => ({...prev, password:true}));
    }
    if(form.confirmPassword !== form.password) {
      isValid = false
      setError(prev => ({...prev, confirmPassword:true}));
    }
    return isValid;
  }
  const inputChange = (event) => {
    const {name, value} = event.target;
    setError(prev => ({...prev, [name]:false}));
    setFrom(prev => ({...prev, [name]:value}));
  } 
  const loginSubmit = async () => {
    try{
      setLoading(true);
      if(!validateForm(form)) {
        throw new Error("invalid inputs");
      }
      const response = await API.post("/register", form);
      if(response.status === 201) {
        navigate("/login");
      }
      console.log(response);
      setLoading(false);
    } catch(error) {
      console.log(error)
      setLoading(false);
      toast.error(error.response.data.error);
    }
  }

  const handleOnBlurError = (event) => {
    if(event.target.value.length === 0) {
      setError(prev => ({...prev, [event.target.name]: true}));
    }
  }

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Enter') {
        loginSubmit()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [loginSubmit])

  return (
  <div className="auth-bg-container bg-neutral-950">
    <div className="auth-form-container border border-neutral-500 p-4">
      <div className="flex flex-col justify-center items-center w-full mb-6">
        <h1 className="header font-extrabold">Skill Swap</h1>
        <p className="text-center text-neutral-400 font-semibold">Sign up to see skill photos and videos from your friends.</p>
      </div>

      
      <div className="input-group">
        <div className="input-field bg-neutral-800 border border-neutral-600 rounded-xs">
          <label htmlFor="name" className={`text-neutral-400 ${form.name ? 'input-placeholder-active' : 'input-placeholder'}`}>Name</label>
          <input  type="text" 
                  name='name' 
                  id='name' 
                  className={`${form.name && 'input-active'}`}
                  onChange={inputChange}
                  onBlur={handleOnBlurError} />
        </div>
        {error.name && <p className="text-red-400 text-xs mb-4">Name must be longer than 3 letters</p>}
      </div>
      
      <div className="input-group">
        <div className="input-field bg-neutral-800 border border-neutral-600 rounded-xs">
          <label htmlFor="email" className={`text-neutral-400 ${form.email ? 'input-placeholder-active' : 'input-placeholder'}`}>Email</label>
          <input  type="text" 
                  name="email" 
                  id="email"
                  className={`${form.email && 'input-active'}`}
                  onChange={inputChange}
                  onBlur={handleOnBlurError}  />
        </div>
        {error.email && <p className="text-red-400 text-xs mb-4">Email is invalid</p>}
      </div>
      
      <div className="input-group">
        <div className="input-field bg-neutral-800 border border-neutral-600 rounded-xs">
          <label htmlFor="password" className={`text-neutral-400 ${form.password ? 'input-placeholder-active' : 'input-placeholder'}`}>Password</label>
          <input  type="password" 
                  name="password"
                  id="password" 
                  className={`${form.password && 'input-active'}`}
                  onChange={inputChange}
                  onBlur={handleOnBlurError}  />
        </div>
        {error.password && <p className="text-red-400 text-xs mb-4">Password must be longer than 4 characters</p>}
      </div>
      
      <div className="input-group">
        <div className="input-field bg-neutral-800 border border-neutral-600 rounded-xs">
          <label htmlFor="confirmPassword" className={`text-neutral-400 ${form.confirmPassword ? 'input-placeholder-active' : 'input-placeholder'}`}>Confirm Password</label>
          <input  type="password" 
                  name="confirmPassword" 
                  id="confirmPassword" 
                  className={`${form.confirmPassword && 'input-active'}`}
                  onChange={inputChange}
                  onBlur={handleOnBlurError}  />
        </div>
        {error.confirmPassword && <p className="text-red-400 text-xs mb-4">Confirm password not matching</p>}
      </div>
      <button type='button' className={`${loading ? "btn-outline bg-purple-950" : "bg-blue-900"}`} onClick={loginSubmit}>
          {loading ? "Signing up..." : "Sign up"}
      </button>
    </div>
    <div className='min-w-[100px] w-[300px] max-w-[400px] border border-neutral-500 p-4 text-center'>
        <p className="text-sm">Have an account?</p>
        <p className="text-sm ms-2 text-blue-800 font-bold cursor-pointer" onClick={() => navigate("/login")}>Log in</p>
      </div>
  </div>
  );
}


export default Register;