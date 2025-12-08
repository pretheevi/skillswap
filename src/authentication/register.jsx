import React, { useState } from "react";
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
        throw new Error('invalid inputs');
      }
      const response = await API.post('/register', form);
      if(response.status === 201) {
        navigate('/login');
      }
      console.log(response);
      setLoading(false);
    } catch(error) {
      console.log(error)
      setLoading(false);
    }
  }
  return (
    <>
      <div className="auth-bg-container">
        <div className="auth-content-card">
          <h1 className='auth-heading'>Sign up</h1>
          <div className='auth-form-field'>
            <label htmlFor="name">Name</label>
            <input type="text" name='name' id='name' onChange={inputChange} />
            {error.name && <p>Name must be longer than 3 characters</p>}
          </div>
          <div className='auth-form-field'>
            <label htmlFor="email">Email</label>
            <input type="text" name='email' id='email'  onChange={inputChange} />
            {error.email && <p>Email is invalid</p>}
          </div>
          <div className='auth-form-field'>
            <label htmlFor="password">Password</label>
            <input type="password" name='password' id='password'  onChange={inputChange} />
            {error.password && <p>Password must be longer than 4 characters</p>}
          </div>
          <div className='auth-form-field'>
            <label htmlFor="confirmPassword">Comfirm Password</label>
            <input type="password" name='confirmPassword' id='confirmPassword'  onChange={inputChange} />
            {error.confirmPassword && <p>confirm password not matching</p>}
          </div>
          <div className='auth-form-button-field'>
            <button type='button' className={`${loading ? "auth-loading" : ""}`} onClick={loginSubmit}>
              {
                loading ? "signing up..." : "sign up"
              }
            </button>
          </div>
          <div className='auth-signup-link-field'>
            <p>Already have a account? 
              <span onClick={() => navigate('/')}>login</span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}


export default Register;