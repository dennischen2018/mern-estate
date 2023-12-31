import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { createListing, deleteListing} from '../controllers/listing.controller.js';

const router = express.Router();

router.post('/create', verifyToken, createListing);
router.delete('/delete/:id', verifyToken, deleteListing);
// router.post('/google', google)
// router.get('/signout', signOut)

export default router;
