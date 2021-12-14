import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface ReviewAttrs {
  userId: string;
  postId: string;
  title: string;
  description: string;
  rating: number;
}
interface ReviewDocs extends mongoose.Document {
  userId: string;
  postId: string;
  title: string;
  description: string;
  rating: number;
  version: number;
}
interface ReviewModel extends mongoose.Model<ReviewDocs> {
  build(attrs: ReviewAttrs): ReviewDocs;
}

const reviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    postId: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
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
reviewSchema.set("versionKey", "version");
reviewSchema.plugin(updateIfCurrentPlugin);

reviewSchema.statics.build = (attrs: ReviewAttrs): ReviewDocs => {
  return new Review(attrs);
};

const Review = mongoose.model<ReviewDocs, ReviewModel>("Review", reviewSchema);
export { Review };
// @TODO:check update review event publisher
