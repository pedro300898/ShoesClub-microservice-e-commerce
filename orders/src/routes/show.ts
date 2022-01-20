import { Request, Response } from 'express';
import { requireAuth, NotFoundError, NotAuthorizedError } from '@pedro300898-modules/common';
import { Order } from '../models/order';

const showOrder =  async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.orderId).populate('ticket');

    if (!order) {
      throw new NotFoundError();
    }
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    res.send(order);
};

export { showOrder };
