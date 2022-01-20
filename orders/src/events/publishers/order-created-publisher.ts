import { Publisher, OrderCreatedEvent, Subjects } from '@pedro300898-modules/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
