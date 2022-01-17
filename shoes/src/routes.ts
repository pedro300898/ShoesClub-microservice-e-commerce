import express from "express";
import { body } from 'express-validator';
import { createShoe } from './routes/new';
import { indexShoe } from './routes/index';
import { showShoe } from './routes/show';
import { updateShoe } from "./routes/update";
import { validateRequest , requireAuth } from '@pedro300898-modules/common';

const routes = express.Router();

routes.post(
  '/api/shoes',
  requireAuth,
  [
    body('title').not().isEmpty().withMessage('Title is required'),
    body('price')
      .isFloat({ gt: 0 })
      .withMessage('Price must be greater than 0'),
  ],
  validateRequest,
  createShoe
);

routes.get('/api/shoes', indexShoe);

routes.get('/api/shoes/:id', showShoe);

routes.put(
  '/api/shoes/:id',
  requireAuth,
  [
    body('title').not().isEmpty().withMessage('Title is required'),
    body('price')
      .isFloat({ gt: 0 })
      .withMessage('Price must be provided and must be greater than 0'),
  ],
  validateRequest, updateShoe);

export {routes} ;