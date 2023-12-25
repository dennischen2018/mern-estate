import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth'
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice';

export default function OAuth() {

    const dispatch = useDispatch();
    const handleGoogleClick = async () => {

        try {
            const provider = new GoogleAuthProvider();
            const auth = getAuth(app);
            const result = await signInWithPopup(auth, provider);
            console.log(result);

            //CAll API to save login info to Mongo DB
            const res = await fetch('/api/auth/google',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: result.user.displayName, 
                    email: result.user.email, 
                    photo: result.user.photoURL})
            })

            const data = JSON.stringify(res);    
            dispatch(signInSuccess(data));
            
        } catch (error) {
            console.log('Could not sign in with google', error)
        }
    }

    return (
        <button 
            onClick={handleGoogleClick}
            className='bg-red-700 text-white p-3 rounded-lg uppercase
            hover:opacity-60'>
            Continue with google
        </button>
    )
}
 