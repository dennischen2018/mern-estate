import User from "../models/user.model.js";
import bcryptjs from 'bcrypt';
import { errorHandler } from "../utils/error.js";
// import { errorHandler } from "../utils/error.js";
import jwt from 'jsonwebtoken';


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

export const signin = async(req, res, next) => {

    console.log('signin', req.body);
    const {email, password} = req.body;
    //check email
    const validUser = await User.findOne({email});
    if (!validUser) {
        return next(errorHandler(404, 'User not found!'));
    }

    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
        return next(errorHandler(410, 'Wrong credentials!'))
    }
    const token = jwt.sign({id: validUser._id}, process.env.JWT_SECRET);
    const {password: pass, ...rest } = validUser._doc;



    res.cookie('access_token', token, {httpOnly: true})
        .status(200)
        .json(rest);

    try {
        await newUser.save();
        res.status(201).json("user created");
    } catch (error) {
        next (error);
    }

};