import { Request, Response } from 'express';
import { Shoe } from '../models/shoe';
import { shoeCreatedPublisher } from '../events/publishers/shoe-created-publisher';
import { natsWrapper } from '../nats-wrapper';


  const createShoe = async (req: Request, res: Response) => {
    const { title, price } = req.body;

    const shoe = Shoe.build({
      title,
      price,
      userId: req.currentUser!.id,
    });
    await shoe.save();
    new shoeCreatedPublisher(natsWrapper.client).publish({
      id: shoe.id,
      title: shoe.title,
      price: shoe.price,
      userId: shoe.userId,
      version: shoe.version,
    });

    res.status(201).send(shoe);
  };

export { createShoe };
