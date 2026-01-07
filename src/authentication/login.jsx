import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
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
    setFrom(prev => ({...prev, [name]:value.trim()}));
  } 
  const loginSubmit = async () => {
    try{
      setError({email: false, password: false});
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
      toast.error(error.response.data.error)
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
        </div>

        <div className="input-group">
          <div className="input-field bg-neutral-800 border border-neutral-600 rounded-xs">
            <label htmlFor="email" className={`text-neutral-400 ${form.email ? 'input-placeholder-active' : 'input-placeholder'}`}>Email</label>
            <input  type="text" 
                    name="email" 
                    id="email"
                    className={`${form.email && 'input-active'}`}
                    onChange={inputChange} 
                    onBlur={handleOnBlurError} />
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
                    onBlur={handleOnBlurError} />
          </div>
          {error.password && <p className="text-red-400 text-xs mb-4">Password must be longer than 4 characters</p>}
        </div>
        
        <button type='button' 
                className={`${loading ? "bg-purple-950" : "bg-blue-900"} font-bold`} 
                onClick={loginSubmit}>
          {loading ? "Logging..." : "Log in"}
        </button>
      </div>
      <div className='min-w-[100px] w-[300px] max-w-[400px] border border-neutral-500 p-4 text-center'>
        <p className="text-sm">Don't have an account? 
          <span className="text-sm ms-2 text-blue-800 font-bold cursor-pointer" onClick={() => navigate("/register")}>
            Sign Up
          </span>
        </p>
      </div>
    </div>
  )
}

export default Login;