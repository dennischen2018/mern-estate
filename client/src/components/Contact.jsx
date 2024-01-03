import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

export default function Contact({listing}) {

  const [landlord, setLandlord] = useState(null);
  const [message, setMessage] = useState('');

  console.log('...Contact listing', listing)
  console.log('...landlord', landlord)
  
  
  useEffect(()=>{
    const fetchedLandlord = async() => {
      console.log('... fetchedLandlord....')
      try {
        const res = await fetch(`/api/user/${listing.userRef}`);
        const data = await res.json();
        setLandlord(data);
        
      } catch (error) {
        ocnsole.log(error)
      }
    }

    fetchedLandlord();

  },[listing.userRef])

  const onChange = (e) => {
    setMessage(e.target.value);
  }

  return (
    <>
    {landlord &&
      <div className='flex flex-col gap-2'>
        <p>Contact <span className='font-semibold'>{landlord.username}</span> for  
        <span className='font-semibold'> {listing.name.toLowerCase()} </span></p>
        <textarea 
          name='message' 
          id='message' 
          placeholder='Enter your message here...'
          rows='2'
          value={message} 
          onChange={onChange}
          className='w-full border p-3 rounded-lg'>
        
        </textarea>

        <Link to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`}
          className='bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95'>
          Send Message
        </Link>
      </div>
    }
    </>
  )
   
}
