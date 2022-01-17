import { Request, Response } from 'express';
import { NotFoundError, NotAuthorizedError, BadRequestError } from '@pedro300898-modules/common';
import { Shoe } from '../models/shoe';
import { shoeUpdatedPublisher } from '../events/publishers/shoe-updated-publisher';
import { natsWrapper } from '../nats-wrapper';


const updateShoe = async (req: Request, res: Response) => {
    const shoe = await Shoe.findById(req.params.id);

    if (!shoe) {
      throw new NotFoundError();
    }

    if (shoe.orderId) {
      throw new BadRequestError('Cannot edit a reserved shoe');
    }

    if (shoe.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    shoe.set({
      title: req.body.title,
      price: req.body.price,
    });
    await shoe.save();
    new shoeUpdatedPublisher(natsWrapper.client).publish({
      id: shoe.id,
      title: shoe.title,
      price: shoe.price,
      userId: shoe.userId,
      version: shoe.version,
    });

    res.send(shoe);
};

export { updateShoe };
