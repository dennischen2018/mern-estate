import User from "../models/user.model.js";
import bcryptjs from 'bcrypt';
// import { errorHandler } from "../utils/error.js";


export const signup = async(req, res, next) => {

    console.log('signup', req.body);
    const {username, email, password} = req.body;
    const hashedPassword = bcryptjs.hashSync(password, 10);
    console.log('hashedPassword', hashedPassword)
    const newUser = new User({ username, email, password:hashedPassword});

    try {
        await newUser.save();
        res.status(201).json("user created");
    } catch (error) {
        next (error);
    }

};