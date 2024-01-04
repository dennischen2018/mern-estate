import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import ListingItem from "./ListingItem";

export default function Search() {

  const navigate = useNavigate();

  const [sidebardata, setSidebardata] = useState({
    searchTerm: '',
    type: 'all',
    parking: false,
    furnished: false,
    offer: false,
    sort: 'created_at',
    order: 'desc',
  });

  const [loading, setLoading] = useState(false);
  const [listing, setListing] = useState([]);
  const [showMore, setShowMore] = useState(false);

  console.log(">>>> loading", loading)
  console.log(">>>> listing", listing)

  console.log('$$$ sidebardata', sidebardata)

  useEffect(()=>{

    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    const typeFromUrl = urlParams.get('type');
    const parkingFromUrl = urlParams.get('parking');
    const furnishedFromUrl = urlParams.get('furnished');
    const offerFromUrl = urlParams.get('offer');
    const sortFromUrl = urlParams.get('sort');
    const orderFromUrl = urlParams.get('order');

    console.log('...urlParams', urlParams)
    console.log('>>> furnishedFromUrl', furnishedFromUrl)
    if (searchTermFromUrl ||
      typeFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      offerFromUrl ||
      sortFromUrl ||
      orderFromUrl ){
        setSidebardata({
          searchTerm: searchTermFromUrl || '',
          type: typeFromUrl || 'all',
          parking: parkingFromUrl === 'true' ? true : false,
          furnished: furnishedFromUrl === 'true' ? true : false,
          offer: offerFromUrl === 'true' ? true : false,
          sort: sortFromUrl || 'created_at',
          order: orderFromUrl || 'desc'
        })
      }

      const fetchListing = async () => {
        setLoading(true);
        const searchQuery = urlParams.toString();
        console.log('>>> searchQuery', searchQuery)
        const res = await fetch(`/api/listing/get?${searchQuery}`);
        const data = await res.json();
        if (data.length > 8) {
          setShowMore(true);
        } else {
          setShowMore(false);
        }
        setListing(data);
        setLoading(false);
      }

      fetchListing();

  }, [location.search])

  const handleChange = (e) => {
    if (e.target.id === 'all' || e.target.id === 'rent' || e.target.id === 'sale'){
      setSidebardata({...sidebardata, type: e.target.id})
    }

    if (e.target.id === 'searchTerm') {
      setSidebardata({...sidebardata, searchTerm: e.target.value})
    }

    if (e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer') {
      setSidebardata({
        ...sidebardata, 
        [e.target.id]: e.target.checked || e.target.checked === 'true' ? true : false,
      })
    }

    if (e.target.id === 'sort_order') {
      const sort = e.target.value.split('_')[0] || 'created_at';
      const order = e.target.value.split('_')[1] || 'desc';
      setSidebardata({...sidebardata, sort, order})
    }

  }

  const handleSummit = (e) => {

    e.preventDefault();
    const urlParams = new URLSearchParams();
    console.log('...urlParams', urlParams)
    urlParams.set('searchTerm', sidebardata.searchTerm);
    urlParams.set('type', sidebardata.type);
    urlParams.set('parking', sidebardata.parking);
    urlParams.set('furnished', sidebardata.furnished);
    urlParams.set('offer', sidebardata.offer);
    urlParams.set('sort', sidebardata.sort);
    urlParams.set('order', sidebardata.order);

    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`)
  
  }

  const onShowMoreClick = async () => {
    const numberOfListings = listing.length;
    const startIndex = numberOfListings;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('startIndex', startIndex);
    const searchQuery = urlParams.toString();
    // const res = await fetch(`/api/listing/get?${searchQuery}`);
    const apiUrl = '/api/listing/get?' + searchQuery;
    console.log('...apiUrl', apiUrl)
    const res = await fetch(apiUrl);
    const data = await res.json();

    console.log('...onShowMoreClick -> data', data)

    if (data.length < 9) {
      setShowMore(false);
    }

    setListing([...listing, ...data]);

  }

  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7 border-b-2 md:border-r-2 md:min-h-screen">
        <form onSubmit={handleSummit} className="flex flex-col gap-8">
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold">Search Term</label>
            <input type="text" className="border rounded-lg p-3 w-full"
              id="searchTerm"
              placeholder="Search..."
              value={sidebardata.searchTerm}
              onChange={handleChange}
              />
          </div>

          <div className="flex gap-2 flex-wrap items-center">
            <label className="font-semibold">Type:</label>
            <div className="flex gap-2">
              <input type="checkbox" id="all"
                className="w-5"
                onChange={handleChange}
                checked={sidebardata.type === 'all'}/>
              <span>Rent & Sale</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="rent"
                checked={sidebardata.type ==='rent'}
                onChange={handleChange}
                className="w-5"/>
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="sale"
                checked={sidebardata.type === 'sale'}
                onChange={handleChange}
                className="w-5"/>
              <span>Sale</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="offer"
                checked={sidebardata.offer}
                onChange={handleChange}
                className="w-5"/>
              <span>Offer</span>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap items-center">
            <label className="font-semibold">Amenities:</label>
            <div className="flex gap-2">
              <input type="checkbox" id="parking"
                checked={sidebardata.parking}
                onChange={handleChange}
                className="w-5"/>
              <span>Parking</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="furnished"
                checked={sidebardata.furnished}
                onChange={handleChange}
                className="w-5"/>
              <span>Furnished</span>

            </div>
          </div>

          <div className="flex items-center gap-2">
            <label className="font-semibold">Sort:</label>
            <select id="sort_order"
              defaultValue={'created_at_desc'}
              onChange={handleChange}
              className="order rounded-lg p-3">
              <option value='regularPrice_desc'>Price high to low</option>
              <option value='regularPrice_asc'>Price low to high</option>
              <option value='createdAt_desc'>Latest</option>
              <option value='createdAt_asc'>Oldest</option>
            </select>
          </div>

          <button className="bg-slate-700 text-white p-3 rounded-lg hover:opacity-95">Search</button>
        </form>
      </div>



      {/* ======================= Search Result =================== */}
      <div className="flex flex-col flex-1">
        <h1 className="text-3xl font-semibold border-b p-3 text-slate-700 mt-5">
          Listing results
        </h1>
      
        <div className="p-7 flex flex-wrap gap-4">
          { !loading && listing.length === 0 && (
            <p className="text-xl text-slate-700">No listing found!</p>
          )}

          {loading && (
            <p className="text-xl text-slate-700 text-center w-full">Loading...</p>
          )}

          {
            !loading && listing && listing.map((listItem) => 
              <ListingItem key={listItem._id} listing={listItem}/>
            )
          }

          {showMore && (
            <button className="text-green-700 hover:underline p-2 text-center w-full font-bold"
              onClick={ () => {
                onShowMoreClick();
              }}>
              Show more
            </button>
          )}

        </div>
      </div>
    </div>




  )
}
