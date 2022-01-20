import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { Order, OrderStatus } from './order';

interface ShoeAttrs {
  id: string;
  title: string;
  price: number;
}

export interface ShoeDoc extends mongoose.Document {
  title: string;
  price: number;
  version: number;
  isReserved(): Promise<boolean>;
}

interface ShoeModel extends mongoose.Model<ShoeDoc> {
  build(attrs: ShoeAttrs): ShoeDoc;
  findByEvent(event: {
    id: string;
    version: number;
  }): Promise<ShoeDoc | null>;
}

const shoeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

shoeSchema.set('versionKey', 'version');
shoeSchema.plugin(updateIfCurrentPlugin);

shoeSchema.statics.findByEvent = (event: { id: string; version: number }) => {
  return Shoe.findOne({
    _id: event.id,
    version: event.version - 1,
  });
};
shoeSchema.statics.build = (attrs: ShoeAttrs) => {
  return new Shoe({
    _id: attrs.id,
    title: attrs.title,
    price: attrs.price,
  });
};
shoeSchema.methods.isReserved = async function () {
  // this === the shoe document that we just called 'isReserved' on
  const existingOrder = await Order.findOne({
    shoe: this as any,
    status: {
      $in: [
        OrderStatus.Created,
        OrderStatus.AwaitingPayment,
        OrderStatus.Complete,
      ],
    },
  });

  return !!existingOrder;
};

const Shoe = mongoose.model<ShoeDoc, ShoeModel>('Shoe', shoeSchema);

export { Shoe };
