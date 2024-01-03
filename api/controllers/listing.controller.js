import Listing from "../models/listing.model.js";
import { errorHandler } from "../utils/error.js";

export const createListing = async (req, res, next) => {
    console.log('...listing controller... req.body ', req.body)
    try {
        const listing = await Listing.create(req.body);
        return res.status(201).json(listing)
    } catch (error) {
        console.log('...error', error)
        next(error);
    }
}

export const deleteListing = async (req, res, next) => {
    console.log('... delete listing... req.body', req.body)
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
        return next (errorHandler(404, 'Listing not found!'));
    }

    if (req.user.id !== listing.userRef) {
        return next (errorHandler(401, 'You can only delete your own listing!'));
    }

    try {
        await Listing.findByIdAndDelete(req.params.id);
        res.status(200).json('Listing has been deleted!');
    } catch (error) {
        next(error);
    }
}

export const updateListing  = async (req, res, next) => {

    console.log('...update listing... req.params.id', req.params.id, 'req.body', req.body)
    try {
        const listing = await Listing.findById(req.params.id);
        console.log('...found listing', listing)
        if (!listing) {
            return next(errorHandler(404, 'Listing not found!'))
        }

        if (req.user.id != listing.userRef) {
            return next(errorHandler(401, 'You can only update your own listing!'))
        }

    
        const updatedListing = await Listing.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new: true}
        );

        res.status(200).json(updatedListing);

    } catch (error) {
        console.log(error)
        next(error); 
    }
 
}

export const getListing = async (req, res, next) => {
    console.log('... get listing ... req.params.id', req.params.id)
    try {
        const listing = await Listing.findById(req.params.id)
        console.log('..listing', listing)
        if (!listing) {
            return next (errorHandler(404, 'Listing not found!'))
        }
        res.status(200).json(listing);
    } catch (error) {
        next (error);
    }
}

export const getListings = async (req, res, next) => {
  console.log('... get listings ...')
  try {
    const query = req.query;
    const limit = parseInt(query.limit) || 9
    const startIndex = parseInt(query.startIndex);
    console.log('@@@ startIndex', startIndex)

    let offer = query.offer;
    console.log('@@@ offer', offer);
    if (offer === undefined || offer === 'false'){
      offer = {$in: [false, true]}
    }

    let furnished = query.furnished;
    console.log('@@@ furnished', furnished);
    if (furnished === undefined || furnished === 'false') {
      furnished = { $in: [false, true]};
    }

    let parking = query.parking;
    console.log('@@@ parking', parking);
    if (parking === undefined || parking === 'false') {
      parking = { $in: [false, true]};
    }

    let type = query.type;
    console.log('@@@ type', type);
    if (type === undefined || type === 'all') {
      type = { $in: ['sale', 'rent']};
    }

    const searchTerm = query.searchTerm || '';

    const sort = query.sort || 'createAt';

    const order = query.order || 'desc';

    console.log('>>> starting search... ')

    const listings = await Listing.find ({
      name: { $regex: searchTerm, $options: 'i'},
      offer,
      furnished,
      parking,
      type,
    }).sort ({[sort]:order
    }).limit(limit).skip(startIndex);

    console.log(' search result:', listings)

    return res.status(200).json(listings);

  } catch (error) {
    console.log('...error...', error)
    next (error);
  }
}