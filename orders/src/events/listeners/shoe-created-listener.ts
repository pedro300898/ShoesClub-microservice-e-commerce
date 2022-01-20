import { Message } from 'node-nats-streaming';
import { Subjects, Listener, shoeCreatedEvent } from '@pedro300898-modules/common';
import { Shoe } from '../../models/shoe';
import { queueGroupName } from './queue-group-name';

export class shoeCreatedListener extends Listener<shoeCreatedEvent> {
  subject: Subjects.shoeCreated = Subjects.shoeCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: shoeCreatedEvent['data'], msg: Message) {
    const { id, title, price } = data;

    const shoe = Shoe.build({
      id,
      title,
      price,
    });
    await shoe.save();

    msg.ack();
  }
}
