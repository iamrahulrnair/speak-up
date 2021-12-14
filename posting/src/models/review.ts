import { NotFoundError } from "@suup/common";
import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

import { Post } from "./post";

// @TODO: user can post only one review per post
// @TODO: likes should be associated with review service becuase they are coupled tpogether, use virtual to populate likes in review and
// send it as an event from review

interface ReviewAttrs {
  id: string;
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
  status: string;
  likes: number;
}
interface ReviewModel extends mongoose.Model<ReviewDocs> {
  build(attrs: ReviewAttrs): ReviewDocs;
  findByEvent(event: {
    id: string;
    version: number;
  }): Promise<ReviewDocs | null>;
  calcAverageRating(postId: string): null;
}

const reviewSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
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
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    likes: {
      type: Number,
      default: 0,
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

// occ for consistency
reviewSchema.statics.calcAverageRating = async function (postId) {
  const stats = await this.aggregate([
    {
      $match: { postId },
    },
    {
      $group: {
        _id: postId,
        count: { $sum: 1 },
        avgRating: { $avg: "$rating" },
      },
    },
  ]);
  // total rating and average rating in per posts
  const post = await Post.findById(postId);
  if (!post) throw new NotFoundError();
  post.set({
    ratingsAverage: stats[0] ? stats[0].avgRating : 4.5,
    ratingsCount: stats[0] ? stats[0].count : 0,
  });
  await post.save();
};

reviewSchema.statics.build = (attrs: ReviewAttrs) => {
  return new Review({
    _id: attrs.id,
    userId: attrs.userId,
    postId: attrs.postId,
    title: attrs.title,
    description: attrs.description,
    rating: attrs.rating,
  });
};

reviewSchema.statics.findByEvent = (event: { id: string; version: number }) => {
  return Review.findOne({
    _id: event.id,
    version: event.version - 1,
  });
};
reviewSchema.post("findOneAndDelete", async function (doc) {
  await Review.calcAverageRating(doc.postId);
});
reviewSchema.post("save", async function (doc) {
  await Review.calcAverageRating(doc.postId);
});

const Review = mongoose.model<ReviewDocs, ReviewModel>("Review", reviewSchema);
export { Review };
