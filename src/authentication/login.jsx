import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../axios/axios'

import './authentication.css';
function Login() {
  const navigate = useNavigate();
  const [form, setFrom] = useState({email: "", password: ""});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({email: false, password: false});

  const validateForm = (form) => {
    let isValid = true;
    if(form.email.length === 0) {
      isValid = false;
      setError(prev => ({...prev, email: true}));
    }
    if(!form.email.includes('@')) {
      isValid = false;
      setError(prev => ({...prev, email: true}));
    } 
    if(form.password.length <= 4) {
      isValid = false;
      setError(prev => ({...prev, password: true }));
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
      const response = await API.post("/login", form);
      console.log(response);
      if(response.status === 200){
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user))
        navigate("/dashboard")
      }
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
          <h1 className='auth-heading'>Login</h1>
          <div className='auth-form-field'>
            <label htmlFor="email">Email</label>
            <input type="text" name='email' id='email' onChange={inputChange} />
            {error.email && <p>Email is invalid</p>}
          </div>

          <div className='auth-form-field'>
            <label htmlFor="password">Password</label>
            <input type="password" name='password' id='password' onChange={inputChange} />
            {error.password && <p>Password must be longer than 4 characters</p>}
          </div>
          <div className="auth-form-button-field">
            <button type='button' className={`${loading ? "auth-loading" : ""}`} onClick={loginSubmit}>
              {
                loading ? "logging..." : "login"
              }
            </button>
          </div>
          <div className='auth-signup-link-field'>
            <p>Don't have an account? 
              <span onClick={() => navigate('/register')}>Sign Up</span>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export default Login;