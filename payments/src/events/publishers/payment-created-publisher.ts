import { Subjects, Publisher, PaymentCreatedEvent } from '@pedro300898-modules/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
