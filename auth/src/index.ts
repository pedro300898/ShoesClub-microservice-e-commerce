import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import {routes} from './routes';

try {
    mongoose.connect('mongodb+srv://tccJoaoPedro:tccJoaoPedro@cluster0.zeshw.mongodb.net/shoesClub?retryWrites=true&w=majority');
    console.log('Connected to MongoDb');
  } catch (err) {
    console.error(err);
  }

const app = express();
app.use(express.json());
app.use(cors());
app.use(routes);

app.listen(3000, () => {
    console.log("listening on 3000");
});