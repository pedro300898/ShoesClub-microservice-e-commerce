import { Listener, OrderCancelledEvent, Subjects } from '@pedro300898-modules/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { Shoe } from '../../models/shoe';
import { shoeUpdatedPublisher } from '../publishers/shoe-updated-publisher';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    const shoe = await Shoe.findById(data.shoe.id);

    if (!shoe) {
      throw new Error('Shoe not found');
    }

    shoe.set({ orderId: undefined });
    await shoe.save();
    await new shoeUpdatedPublisher(this.client).publish({
      id: shoe.id,
      orderId: shoe.orderId,
      userId: shoe.userId,
      price: shoe.price,
      title: shoe.title,
      version: shoe.version,
    });

    msg.ack();
  }
}
