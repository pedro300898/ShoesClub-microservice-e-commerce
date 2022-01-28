import { Request, Response } from 'express';
import { Shoe } from '../models/shoe';

const indexShoe= async (req: Request, res: Response) => {
  const shoe = await Shoe.find({orderId: undefined});

  res.send(shoe);
};

export { indexShoe };
