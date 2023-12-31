import { useSelector } from "react-redux"
import { useRef, useState, useEffect} from 'react'
import { 
  getDownloadURL, 
  getStorage, 
  ref, 
  uploadBytesResumable 
} from 'firebase/storage'
import { app } from "../firebase";
import { 
  updateUserStart, 
  updateUserSuccess, 
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signOutUserStart,
  signOutUserSuccess,
  signOutUserFailure
} from "../redux/user/userSlice.js";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";


export default function Profile() {
  const { currentUser, loading, error} = useSelector( state => state.user)
  const fileRef = useRef(null);
  const [file, setFile] = useState();
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingError, setShowListingError] = useState(false);
  const [userListings, setUserListings] = useState([]);


  const dispath = useDispatch();
  const navigate = useNavigate();
  console.log(filePerc);
  console.log(formData);
  console.log(fileUploadError)
  console.log('error:',error)
  
  //firebase storage
  // allow read;
  // allow write: if 
  // request.resource.size < 2 * 1024 * 1024 &&
  // request.resource.contentType.matches('image/.*')

  useEffect( () =>{
    if (file) {
      handleFileUpload(file);
    }
  }, [file])

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + "-" + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);
    console.log('uploading image....')
    uploadTask.on('state_changed', (snapshot) => {
        console.log('... state changed...')
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true)
      },
      () => {
        console.log('...getDownloadURL...')
        getDownloadURL(uploadTask.snapshot.ref).then (
          (downloadURL) => {
            console.log('..downloadURL', downloadURL)
            setFormData({...formData, avatar: downloadURL})
          }
        );
      }
    )

  }

  const handleChange = (e) => {
    setFormData({...formData, [e.target.id]: e.target.value})
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispath(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success === false) {
        dispath(updateUserFailure(data.message));
        return;
      }
      dispath(updateUserSuccess(data));
      setUpdateSuccess(true);

    } catch (error) {
      dispath(updateUserFailure(error.message))
    }
  }

  const handleDeleteUser = async () => {
    try {
      dispath(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'POST',
      });

      const data = await res.json();
      if (data.success === false) {
        dispath(deleteUserFailure(data.message));
        return;
      }

      dispath(deleteUserSuccess(data));
      navigate('/signin')

    } catch (error) {
      dispath(deleteUserFailure(error.message))
    }
  };

  const handleSignOut = async () => {
    console.log('...handleSignOut...')
    try {
      dispath(signOutUserStart())
      const res = await fetch(`/api/auth/signout`);
      const data = await res.json();
      console.log('...success', data.success)
      if (data.success === false) {
        dispath(signOutUserFailure(data.message))
      }

      dispath(signOutUserSuccess(data))
      navigate('/signin')

    } catch (error) {
      console.log('..error', error)
      dispath(signOutUserFailure(error.message))
    }
  }

  const handleShowListings = async () => {
    try {
      setShowListingError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`)
      const data = await res.json();
      if (data.success === false) {
        setShowListingError(true);
        return;
      }
      setUserListings(data);
    } catch (error) {
      setShowListingError(true);
    }
  }


  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input onChange={e=> setFile(e.target.files[0])} type="file" ref={fileRef} hidden accept="image/*"/>
        <img onClick={()=>fileRef.current.click()} 
          src={formData.avatar || currentUser.avatar} alt="profile" 
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center"/>
        
        <p className="text-sm self-center">
          {fileUploadError?
            <span className="text-red-700">Error Image Upload (image must be less then 2 mb</span>
            :
            filePerc > 0 && filePerc < 100 ? 
              <span> {`Uploading ${filePerc}%`}</span>
              :
              filePerc === 100 ? 
                <span className="text-green-700">Image successfully uploaded!</span>
                : ""
        } 
        </p>
        
        <input type="text" id="username" placeholder="User Name" 
          defaultValue={currentUser.username}
          onChange={handleChange}
          className="border p-3 rounded-lg"/>
        <input type="text" id="email" placeholder="Email" 
          defaultValue={currentUser.email}
          onChange={handleChange}
          className="border p-3 rounded-lg"/>
        <input type="password" id="password" placeholder="Password" 
          onChange={handleChange}
          className="border p-3 rounded-lg"/>
        <button disabled={loading} className="bg-slate-700 text-white rounded-lg p-3 uppercase 
                    hover:opacity-90 disabled: opacity-80">
            {loading ? 'Loading...': 'Update'} 
        </button>
        <Link to={"/create-listing"} className="bg-green-700 text-white p-3
                  rounded-lg hover:opacity-90 disabled: opacity-80 text-center uppercase">
            Create Listing
        </Link>
      </form>
      <div className="flex justify-between mt-5">
        <span onClick={handleDeleteUser}
          className="text-red-700 cursor-pointer">
          Delete Account
        </span>
        <span onClick={handleSignOut} className="text-red-700 cursor-pointer">Sign out</span>
      </div>

      <p className="text-green-700 mt-5">{updateSuccess ? "User is updated successfully!" : ""}</p>
    
    
      {/* ============ Show Listing ============ */}
      
      <button onClick={handleShowListings} 
        className="text-green-900 w-full font-bold ">
          Show Listings
      </button>
      <p className="text-red-600">{showListingError? 'Error showing listing' : '' }</p>

      {userListings && userListings.length > 0 && 
        <div>
          <h1 className="text-center mt-7 mb-2 text-2xl font-semibold">Your Listings</h1>
          {userListings.map((listing) => 
            <div  key={listing._id} 
              className="border rounded-lg p-3 flex justify-between 
                  items-center gap-4">
              <Link to="`/listing/${listing._id}">
                <img src={listing.imageUrls[0]} alt="listing cover" 
                  className="h-16 w-16 object-contain"/>
              </Link>
              <Link to="`/listing/${listing._id}"
                className="text-slate-700 font-semibold flex-1 hover:underline truncate">
                <p>{listing.name}</p>
              </Link>

              <div className="flex flex-col items-center">
                <button className="text-red-700">Delete</button>
                <button className="text-green-700">Edit</button>
              </div>
            </div>
          )}  
        </div>
      }
    </div>
  )
}
