import {Request, Response} from 'express';
import { User } from '../models/user';
import jwt from 'jsonwebtoken';
import { BadRequestError } from '@pedro300898-modules/common';

const signup = async ( req: Request, res: Response) => {
    const { nome, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new BadRequestError('Email in use');
    }

    const user = User.build({ nome, email, password });
    await user.save();

     // Generate JWT
     const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_KEY!
    );

    // Store it on session object
    req.session = {
      jwt: userJwt,
    };

    return res.status(201).send(user);
}

export {signup};