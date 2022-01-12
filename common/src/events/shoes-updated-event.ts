import { Subjects } from './subjects';

export interface shoeUpdatedEvent {
  subject: Subjects.shoeUpdated;
  data: {
    id: string;
    version: number;
    title: string;
    price: number;
    userId: string;
    orderId?: string;
  };
}
