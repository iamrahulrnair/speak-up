import mongoose, { Schema } from 'mongoose';
import { Review } from './review';

interface LikeAttrs {
  userId: string;
  reviewId: string;
}

interface LikeDocs extends mongoose.Document {
  userId: string;
  reviewId: string;
}
interface LikeModel extends mongoose.Model<LikeDocs> {
  build(attrs: LikeAttrs): LikeDocs;
  calcTotalLikes(reviewId: string): null;
}

const likeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    review: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'Review',
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

likeSchema.statics.build = (attrs: LikeAttrs): LikeDocs => {
  return new Like(attrs);
};
const Like = mongoose.model<LikeDocs, LikeModel>('Like', likeSchema);
export { Like };
