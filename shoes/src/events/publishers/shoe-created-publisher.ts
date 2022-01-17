import { Publisher, Subjects, shoeCreatedEvent } from '@pedro300898-modules/common';

export class shoeCreatedPublisher extends Publisher<shoeCreatedEvent> {
  subject: Subjects.shoeCreated = Subjects.shoeCreated;
}
