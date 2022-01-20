import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import cookieSession from 'cookie-session';
import {routes} from './routes';
import { natsWrapper } from './nats-wrapper';
import { shoeCreatedListener } from './events/listeners/shoe-created-listener';
import { shoeUpdatedListener } from './events/listeners/shoe-updated-listener';
import { ExpirationCompleteListener } from './events/listeners/expiration-complete-listener';
import { PaymentCreatedListener } from './events/listeners/payment-created-listener';
import { currentUser } from '@pedro300898-modules/common';


const start = async () => {

  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error('NATS_CLIENT_ID must be defined');
  }
  if (!process.env.NATS_URL) {
    throw new Error('NATS_URL must be defined');
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error('NATS_CLUSTER_ID must be defined');
  }

  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );
    natsWrapper.client.on('close', () => {
      console.log('NATS connection closed!');
      process.exit();
    });
    process.on('SIGINT', () => natsWrapper.client.close());
    process.on('SIGTERM', () => natsWrapper.client.close());

    new shoeCreatedListener(natsWrapper.client).listen();
    new shoeUpdatedListener(natsWrapper.client).listen();
    new ExpirationCompleteListener(natsWrapper.client).listen();
    new PaymentCreatedListener(natsWrapper.client).listen();
  } catch (err) {
    console.error(err);
  }
  try {
      mongoose.connect('mongodb://auth-mongo-srv:27017/shoes');
      console.log('Connected to MongoDb');
    } catch (err) {
      console.error(err);
    };

  const app = express();
  app.use(
    cookieSession({
      signed: false,
      secure: false,
    })
  );
  app.use(currentUser);
  app.use(express.json());
  app.use(cors());
  app.use(routes);

  app.listen(3000, () => {
      console.log("listening on 3000");
  });
};

start();