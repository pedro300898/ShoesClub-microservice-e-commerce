import express from "express";
import { body } from 'express-validator';
import { signup } from './routes/signup';
import { signin } from './routes/signin';
import { validateRequest , currentUser } from '@pedro300898-modules/common';

const routes = express.Router();

routes.post('/api/users/signup', [
    body('email').isEmail().withMessage('O Email precisa ser valido !'),
    body('password')
      .trim()
      .notEmpty()
      .withMessage('Você precisa fornecer uma senha valida !'),
  ],
    validateRequest,
    signup);

routes.post(
      '/api/users/signin',
      [
        body('email').isEmail().withMessage('Email must be valid'),
        body('password')
          .trim()
          .notEmpty()
          .withMessage('You must supply a password'),
      ],
      validateRequest,
      signin
    );

routes.post('/api/users/signout', (req, res) => {
    //limpa a sessão.   
    req.session = null;
    res.send({});
  });

routes.get('/api/users/currentuser', currentUser, (req, res) => {
  res.send({ currentUser: req.currentUser || null });
});

export {routes} ;