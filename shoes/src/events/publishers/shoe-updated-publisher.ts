import { Publisher, Subjects, shoeUpdatedEvent } from '@pedro300898-modules/common';

export class shoeUpdatedPublisher extends Publisher<shoeUpdatedEvent> {
  subject: Subjects.shoeUpdated = Subjects.shoeUpdated;
}
