import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from 'swiper/react'
import {Navigation} from 'swiper/modules'
import SwiperCore from 'swiper'
import 'swiper/css/bundle';
import ListingItem from "./ListingItem";

export default function Home() {

  const [offerListing, setOfferListing] = useState([]);
  const [saleListing, setSaleListing] = useState([]);
  const [rentListing, setRentListing] = useState([]);

  SwiperCore.use([Navigation]);

  console.log('>>> offerListing', offerListing);
  console.log('>>> saleListing', saleListing);
  console.log('>>> rentListing', rentListing);

  useEffect(()=>{

    const fetchOfferListing = async () => {
      console.log('>>> fetchOfferListing...')
      try {
        const res = await fetch('/api/listing/get?offer=true&limit=4');
        const data = await res.json();
        setOfferListing(data);
        fetchRentListing();
      } catch (error) {
        console.log(error)
      }
    }

    const fetchRentListing = async () => {
      console.log('>>> fetchRentListing...')
      try {
        const res = await fetch('/api/listing/get?type=rent&limit=4');
        const data = await res.json();
        setRentListing(data);
        fetchSaleListing();


      } catch (error) {
        console.log(error)
      }
    }

    const fetchSaleListing = async () => {
      console.log('>>> fetchSaleListing...')
      try {
        const res = await fetch('/api/listing/get?type=sale&limit=4');
        const data = await res.json();
        setSaleListing(data);

      } catch (error) {
        console.log(error)
      }
    }

    fetchOfferListing();

  }, [])
  
  return (
    <div>
      {/* ------- top ------- */}
      <div className="flex flex-col gap-6 p-20 px-3 max-w-screen-2xl mx-auto">
        <h1 className="text-sla700 font-bold text-3xl lg:text-6xl">
          Find your next <span className="text-slate-500">perfect</span>
          <br/>
          place with ease
        </h1>

        <div className="text-gray-600 text-xs sm:text-sm">
          Dennis Estate is the best place to find your next 
          perfect place to live.
          <br/>
          We have a wide range of properties for you to choose from.
        </div>
        <Link to="/search" className="text-xs sm:text-sm text-blue-800 font-bold
            ">
          Let's get started..
        </Link>
      </div>

      {/* ------ swiper ------- */}
      <Swiper navigation>
        {
          offerListing && offerListing.length > 0 && 
          offerListing.map((listing) => 
            <SwiperSlide>
              <div className="h-[500px]" 
                style={{background:`url(${listing.imageUrls[0]}) center no-repeat`, 
                backgroundSize:'cover'}}>
              </div>
            </SwiperSlide>
          )
        }
      </Swiper>

      {/* --------- listing ----------- */}
        <div className="max-w-screen-2xl mx-auto p-2 flex flex-col gap-2 my-8">
          {/* --------- offer ---------- */}
          {
            offerListing && offerListing.length > 0 && (
              <div className="">
                <div className="my-2">
                  <h2 className="text-2xl font-semibold text-slate-600">Recent offers</h2>
                  <Link className="text-sm text-blue-800 hover:underline" to={'/search?offer=true'}>
                    Show more offers
                  </Link>
                </div>
                <div className="flex flex-wrap gap-4">
                  {
                    offerListing.map((listing) => (
                      <ListingItem listing={listing} key="listing._id"/>
                    ))
                  }
                </div>
              </div>
            )
          }

          {/* --------- Rent --------- */}
          {
            rentListing && rentListing.length > 0 && (
              <div className="">
                <div className="my-2">
                  <h2 className="text-2xl font-semibold text-slate-600">Recent place for rent</h2>
                  <Link className="text-sm text-blue-800 hover:underline" 
                    to={'/search?type=rent'}>
                    Show more offers
                  </Link>
                </div>
                <div className="flex flex-wrap gap-4">
                  {
                    rentListing.map((listing) => (
                      <ListingItem listing={listing} key="listing._id"/>
                    ))
                  }
                </div>
              </div>
            )
          }

          {/* --------- Sale ------------ */}
          {
            saleListing && saleListing.length > 0 && (
              <div className="">
                <div className="my-2">
                  <h2 className="text-2xl font-semibold text-slate-600">Recent place for sale</h2>
                  <Link className="text-sm text-blue-800 hover:underline" 
                    to={'/search?type=sale'}>
                    Show more offers
                  </Link>
                </div>
                <div className="flex flex-wrap gap-4">
                  {
                    saleListing.map((listing) => (
                      <ListingItem listing={listing} key="listing._id"/>
                    ))
                  }
                </div>
              </div>
            )
          }
        </div>





    </div>
  )
}
