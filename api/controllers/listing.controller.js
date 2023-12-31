import Listing from "../models/listing.model.js";

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