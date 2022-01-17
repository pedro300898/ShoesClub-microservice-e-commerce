import {
  Subjects,
  Publisher,
  ExpirationCompleteEvent,
} from '@pedro300898-modules/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
