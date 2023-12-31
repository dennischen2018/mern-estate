import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore from 'swiper'
import {Navigation} from 'swiper/modules'
import 'swiper/css/bundle'
import {FaBath, FaBed, FaChair, FaMapMarkerAlt, FaParking, FaShare} from 'react-icons/fa'

export default function Listing() {

  SwiperCore.use([Navigation]);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);

  const params = useParams();

  useEffect (() => {
    console.log('... useEffect() ...')
    const fetchListing = async () => {
      try {
        setLoading(true);
        console.log('... fetch listing ', params.listingId)
        const res = await fetch(`/api/listing/get/${params.listingId}`)
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        
        setListing(data);
        setLoading(false);
        setError(false);
          
      } catch (error) {
          setError(true)
          setLoading(false)
      }
    }
    fetchListing();
  },[params.listingId]);

  console.log(listing);

  return (
    <main>
      {loading && <p className='text-center my-7 text-2xl'>Loading...</p>}
      {error && <p className='text-red-600 text-center my-7 text-2xl'>Somthing went wrong.</p>}

      {listing && !loading && !error && 
        <div>
          <Swiper navigation>
              {listing.imageUrls.map((url) => (
                <SwiperSlide key={url}>
                  <div
                    className='h-[350px]'
                    // style={{background: `url(${url}) no-repeat center`}} //doesn't work???
                    style={{background: 'url(' + '"'+url +'") no-repeat center', backgroundSize: 'cover'}}
                  >                      
                  </div>
                </SwiperSlide>)
              )}
          </Swiper>
            <div className='fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12
              flex justify-center items-center bg-slate-100 cursor-pointer'>
              <FaShare className='text-slate-500'
                onClick={()=>{
                  navigator.clipboard.writeText(window.location.href);
                  setCopied(true);
                  setTimeout(() => {
                    setCopied(false)
                  }, 2000);
                }}
              />
            </div>
            {copied && 
                <p className='fixed top-[23%] right-[5%] z-10 rounded-md 
                    bg-slate-100 p-2'>Link copied!</p>
              }

            <div className='flex flex-col max-w-4xl mx-auto p-1 my-3 gap-2'>
              <p className='text-2xl font-semibold'>
                {listing.name} - ${" "} {listing.offer? 
                  listing.discountPrice.toLocaleString("en-US") : 
                  listing.regularPrice.toLocaleString('en-US') }
                {listing.type === 'rent' && ' / month'}
              </p>

              <p className='flex items-center mt-0 gap-2 text-slate-600'>
                  <FaMapMarkerAlt className='text-green-700'>
                  </FaMapMarkerAlt>
                  {listing.address}
              </p>

              <div className='flex gap-4'>
                  <p className='bg-red-900 w-full max-w-[180px] text-white text-center
                      rounded-md p-1'>
                      {listing.type === 'rent' ? 'For Rent': 'For Sale'}
                  </p>
                  { listing.offer && 
                      <p className='bg-green-900 w-full max-w-[180px] text-white
                          text-center rounded-md p-1'>
                          ${+listing.regularPrice - +listing.discountPrice} discount
                      </p>
                  }
              </div>
              <p className='text-slate-700'>
                  <span className='font-semibold text-black'>
                      Description - {' '}
                  </span>
                  {listing.description}
              </p>

              <ul className='text-green-700 font-semibold text-sm flex items-center gap-2 sm:gap-4 '>
                  <li className='flex items-center gap-2 whitespace-nowrap'>
                      <FaBed className='text-lg'/>
                      {listing.bedrooms > 1 ? `${listing.bedrooms} beds` : 
                          `${listing.bedrooms} bed`}
                  </li>
                  <li className='flex items-center gap-2 whitespace-nowrap'>
                      <FaBath className='text-lg'/>
                      {listing.bathrooms > 1 ? `${listing.bathrooms} baths` : 
                          `${listing.bathrooms} bath`}
                  </li>
                  <li className='flex items-center gap-2 whitespace-nowrap'>
                      <FaParking className='text-lg'/>
                      {listing.parking ? 'Parking spot' : 'No Parking'}
                  </li>
                  <li className='flex items-center gap-2 whitespace-nowrap'>
                      <FaChair className='text-lg'/>
                      {listing.furnished ? 'Furnished' : 'Unfurnished'}
                  </li>
              </ul>
            </div>


        </div>

      }
    
    </main>
  )
}
