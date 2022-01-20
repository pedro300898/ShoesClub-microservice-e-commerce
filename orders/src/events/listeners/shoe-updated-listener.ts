import { Message } from 'node-nats-streaming';
import { Subjects, Listener, shoeUpdatedEvent } from '@pedro300898-modules/common';
import { Shoe } from '../../models/shoe';
import { queueGroupName } from './queue-group-name';

export class shoeUpdatedListener extends Listener<shoeUpdatedEvent> {
  subject: Subjects.shoeUpdated = Subjects.shoeUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: shoeUpdatedEvent['data'], msg: Message) {
    const shoe = await Shoe.findByEvent(data);

    if (!shoe) {
      throw new Error('Shoe not found');
    }

    const { title, price } = data;
    shoe.set({ title, price });
    await shoe.save();

    msg.ack();
  }
}
