import express from "express";
import { body } from 'express-validator';
import mongoose from 'mongoose';
import { newOrder } from './routes/new';
import { indexOrder } from './routes/index';
import { showOrder } from './routes/show';
import { deleteOrder } from "./routes/delete";
import { validateRequest , requireAuth } from '@pedro300898-modules/common';

const routes = express.Router();

routes.post('/api/orders', requireAuth,
    [
      body('shoeId')
        .not()
        .isEmpty()
        .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
        .withMessage('ShoeId must be provided'),
    ],
    validateRequest, newOrder);
  
routes.get('/api/orders', requireAuth, indexOrder);

routes.get('/api/orders/:orderId', requireAuth, showOrder);

routes.delete('/api/orders/:orderId', requireAuth, deleteOrder);

export {routes} ;