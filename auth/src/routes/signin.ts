import express from 'express';
import { body, validationResult } from 'express-validator';
import { validateRequest, BadRequestError } from '@suup/common';
import { User } from '../models/user';
import { Password } from '../services/password';
import JWT from 'jsonwebtoken';

const router = express.Router();

router.post(
  '/api/users/signin',
  body('email').isEmail().withMessage('Email must be valid'),
  body('password').trim().notEmpty().withMessage('you must supply a password'),
  validateRequest,
  async (req, res) => {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      throw new BadRequestError('invalid credenitals');
    }
    const passwordMatch = await Password.compare(
      existingUser.password,
      password
    );
    if (!passwordMatch) {
      throw new BadRequestError('invalid credenitals');
    }
    const userJWT = JWT.sign(
      {
        id: existingUser.id,
        email: existingUser.email,
      },
      process.env.JWT_KEY!
    );
    req.session = {
      jwt: userJWT,
    };
    res.status(201).send(existingUser);
  }
);

export { router as signinRouter };
