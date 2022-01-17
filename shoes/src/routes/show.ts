import { Request, Response } from 'express';
import { NotFoundError } from '@pedro300898-modules/common';
import { Shoe } from '../models/shoe';


const showShoe = async (req: Request, res: Response) => {
  const shoe = await Shoe.findById(req.params.id);
  if (!shoe) {
    throw new NotFoundError();
  }

  res.send(shoe);
};

export { showShoe };
