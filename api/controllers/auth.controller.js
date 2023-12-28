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

    try {
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
        console.log('... sign return', rest);
        res.cookie('access_token', token, {httpOnly: true});
        res.status(200).json(rest);
    } catch (error) {
        next (error);
    }

};

export const google = async (req, res, next) => {
    console.log('....google().....')
    console.log('....request body...', req.body)
    try {
        const user = await User.findOne({email: req.body.email})
        if (user) {
            console.log('.... found user in Mongo DB ....', user)
            const token = jwt.sign({id: user._id}, process.env.JWT_SECRET)
            const { password: pass, ...rest } = user._doc;
            console.log('... google signin call return', rest)
            res.cookie('access_token', token, { httpOnly: true})
            .status(200)
            .json(rest)
        } else {
            console.log('.... not found user ....')
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
            //Save to Mongo DB
            const newUser = new User({
                username: req.body.name.split(' ').join('').toLowerCase() + Math.random().toString(36).slice(-4), 
                email: req.body.email,
                password: hashedPassword,
                avatar: req.body.photo 
            })
            console.log('.... save new user....')
            await newUser.save();
            const token = jwt.sign({id: newUser._id}, process.env.JWT_SECRET)
            const { password: pass, ...rest} = newUser._doc;
            res.cookie('access_token', token, {httpOnly: true})
                .status(200)
                .json(rest)
        }


    } catch (error) {
        console.log('>>>>> error:', error)
        next (error);
    }
}