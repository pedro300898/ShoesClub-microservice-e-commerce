import express from 'express';
import mongoose from 'mongoose';
import cookieSession from 'cookie-session';
import { natsWrapper } from './nats-wrapper';
import { OrderCreatedListener } from './events/listeners/order-created-listener';
import { OrderCancelledListener } from './events/listeners/order-cancelled-listener';
import { currentUser } from '@pedro300898-modules/common';
import { createChargeRouter } from './routes/new';

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

    new OrderCreatedListener(natsWrapper.client).listen();
    new OrderCancelledListener(natsWrapper.client).listen();
  } catch (err) {
    console.error(err);
  }
  try {
      mongoose.connect('mongodb://auth-mongo-srv:27017/payments');
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
  app.use(createChargeRouter);

  app.listen(3000, () => {
      console.log("listening on 3000");
  });
};

start();