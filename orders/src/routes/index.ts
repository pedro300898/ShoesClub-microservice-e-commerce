import { Request, Response } from 'express';
import { Order } from '../models/order';

const indexOrder = async (req: Request, res: Response) => {
  const orders = await Order.find({
    userId: req.currentUser!.id,
  }).populate('shoe');

  res.send(orders);
};

export { indexOrder };
