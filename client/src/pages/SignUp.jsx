import React, { useState } from 'react'
import {Link, useNavigate} from 'react-router-dom';

export default function SignUp() {

  const [formData, setFormData] = useState({})
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,

    });
    console.log("formData", formData);
  }

  const handleSubmit = async (e) => {

    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/auth/signup', 
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
  
      const data = await res.json();
      console.log(data);
  
      if (data.success === false) {
        setLoading(false);
        setError(data.message);
        return;
      }
  
      setLoading(false)
      setError(null);
      navigate('/sign-in')
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }



  }

  return (
    <div className='p3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'> 
        Sign Up 
      </h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4 '>
        <input id='username' type='text' placeholder='user name'
          className='border  p-3 rounded-lg' onChange={handleChange}>
        </input>
        <input id='email' type='text' placeholder='email'
          className='border  p-3 rounded-lg' onChange={handleChange}>
        </input>
        <input id='password' type='password' placeholder='password'
          className='border  p-3 rounded-lg' onChange={handleChange}>
        </input>

        <button disabled={loading} className='bg-slate-700 text-white p-3 rounded-lg 
          uppercase hover:opacity-80'>
            {loading? 'Loading' : 'Sign Up'}
        </button>
      </form>

      <div className='flex gap-2 mt-5'>
        <p>Have an account?</p>
        <Link to={"/sign-in"}>
          <span className='text-blue-700'>Sign in</span>
        </Link>
      </div>

      {error && <p className='text-red-700 mt-5'>{error}</p>}
    </div>
  )
}
