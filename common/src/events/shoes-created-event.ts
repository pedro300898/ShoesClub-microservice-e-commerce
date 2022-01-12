import { Subjects } from './subjects';

export interface shoeCreatedEvent {
  subject: Subjects.shoeCreated;
  data: {
    id: string;
    version: number;
    title: string;
    price: number;
    userId: string;
  };
}
