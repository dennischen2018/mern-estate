import express from "express";
import { deleteUser, test, updateUser} from '../controllers/user.comtroller.js'
import { verifyToken } from "../utils/verifyUser.js";
import { getUserListing, getUser} from "../controllers/user.comtroller.js";

const router = express.Router();

router.get('/test', test);
router.post('/update/:id', verifyToken,  updateUser)
router.post('/delete/:id', verifyToken,  deleteUser)
router.get('/listings/:id', verifyToken, getUserListing)
router.get('/:id', verifyToken, getUser)

export default router;
