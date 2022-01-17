import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface ShoeAttrs {
  title: string;
  price: number;
  userId: string;
}

interface ShoeDoc extends mongoose.Document {
  title: string;
  price: number;
  userId: string;
  version: number;
  orderId?: string;
}

interface ShoeModel extends mongoose.Model<ShoeDoc> {
  build(attrs: ShoeAttrs): ShoeDoc;
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
    },
    userId: {
      type: String,
      required: true,
    },
    orderId: {
      type: String,
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

shoeSchema.statics.build = (attrs: ShoeAttrs) => {
  return new Shoe(attrs);
};

const Shoe = mongoose.model<ShoeDoc, ShoeModel>('Shoe', shoeSchema);

export { Shoe };
