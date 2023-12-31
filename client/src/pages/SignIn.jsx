import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice';
import OAuth from '../components/OAuth';

export default function SignIn() {

  const [formData, setFormData] = useState({})
  const {error,loading} = useSelector((state) => state.user);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,

    });
    console.log("formData", formData);
  }

  const handleSubmit = async (e) => {

    e.preventDefault();

    dispatch (signInStart())

    try {
      const res = await fetch('/api/auth/signin', 
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
        dispatch(signInFailure(data.message))
        return;
      }

      dispatch (signInSuccess (data))
      console.log('>>> navigate to home page...')
      navigate('/') 

    } catch (error) {
        dispatch(signInFailure(error.message))
    }

  }

  return (
    <div className='p3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'> 
        Sign In
      </h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4 '>
        <input id='email' type='text' placeholder='email'
          className='border  p-3 rounded-lg' onChange={handleChange}>
        </input>
        <input id='password' type='password' placeholder='password'
          className='border  p-3 rounded-lg' onChange={handleChange}>
        </input>

        <button disabled={loading} className='bg-slate-700 text-white p-3 rounded-lg 
          uppercase hover:opacity-80'>
            {loading? 'Loading' : 'Sign In'}
        </button>
        <OAuth/>
      </form>

      <div className='flex gap-2 mt-5'>
        <p>Dont have an account?</p>
        <Link to={"/sign-up"}>
          <span className='text-blue-700'>Sign On</span>
        </Link>
      </div>

      {error && <p className='text-red-700 mt-5'>{error}</p>}
    </div>
  )
}
