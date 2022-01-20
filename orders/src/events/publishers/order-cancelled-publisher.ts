import { Subjects, Publisher, OrderCancelledEvent } from '@pedro300898-modules/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
