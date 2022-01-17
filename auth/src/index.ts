import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import {routes} from './routes';
import cookieSession from 'cookie-session';

if (!process.env.JWT_KEY) {
  throw new Error('JWT_KEY must be defined');
}

try {
    mongoose.connect('mongodb://auth-mongo-srv:27017/auth');
    console.log('Connected to MongoDb');
  } catch (err) {
    console.error(err);
  }

const app = express();
app.use(
  cookieSession({
    signed: false,
    secure: false,
  })
);
app.use(express.json());
app.use(cors());
app.use(routes);

app.listen(3000, () => {
    console.log("listening on 3000");
});