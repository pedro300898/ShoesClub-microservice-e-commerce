import { Message } from 'node-nats-streaming';
import { Listener, OrderCreatedEvent, Subjects } from '@pedro300898-modules/common';
import { queueGroupName } from './queue-group-name';
import { Shoe } from '../../models/shoe';
import { shoeUpdatedPublisher } from '../publishers/shoe-updated-publisher';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    // Find the shoe that the order is reserving
    const shoe = await Shoe.findById(data.shoe.id);

    // If no shoe, throw error
    if (!shoe) {
      throw new Error('Shoe not found');
    }

    // Mark the shoe as being reserved by setting its orderId property
    shoe.set({ orderId: data.id });

    // Save the shoe
    await shoe.save();
    await new shoeUpdatedPublisher(this.client).publish({
      id: shoe.id,
      price: shoe.price,
      title: shoe.title,
      userId: shoe.userId,
      orderId: shoe.orderId,
      version: shoe.version,
    });

    // ack the message
    msg.ack();
  }
}
