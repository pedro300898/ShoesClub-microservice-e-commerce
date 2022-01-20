import { Request, Response } from 'express';
import { NotFoundError, OrderStatus, BadRequestError } from '@pedro300898-modules/common';
import { Shoe } from '../models/shoe';
import { Order } from '../models/order';
import { OrderCreatedPublisher } from '../events/publishers/order-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const EXPIRATION_WINDOW_SECONDS = 1 * 60;


const newOrder =  async (req: Request, res: Response) => {
    const { shoeId } = req.body;

    // Find the shoe the user is trying to order in the database
    const shoe = await Shoe.findById(shoeId);
    if (!shoe) {
      throw new NotFoundError();
    }

    // Make sure that this shoe is not already reserved
    const isReserved = await shoe.isReserved();
    if (isReserved) {
      throw new BadRequestError('Shoe is already reserved');
    }

    // Calculate an expiration date for this order
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    // Build the order and save it to the database
    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
      shoe,
    });
    await order.save();

    // Publish an event saying that an order was created
    new OrderCreatedPublisher(natsWrapper.client).publish({
      id: order.id,
      version: order.version,
      status: order.status,
      userId: order.userId,
      expiresAt: order.expiresAt.toISOString(),
      shoe: {
        id: shoe.id,
        price: shoe.price,
      },
    });

    res.status(201).send(order);
  };

export { newOrder };
