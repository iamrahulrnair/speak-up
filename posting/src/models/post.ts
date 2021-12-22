import mongoose from 'mongoose';
//user id is one among the 3 admins,only they can post new companies
// use enum in userId

interface PostAttrs {
  userId: string;
  companyName: string;
  ratingsAverage?: number;
  ratingsCount?: number;
  imageurl: string;
  description: string;
}
interface PostDoc extends mongoose.Document {
  userId: string;
  companyName: string;
  ratingsAverage: number;
  ratingsCount: number;
  imageurl: string;
  description: string;
}
interface PostModel extends mongoose.Model<PostDoc> {
  build(attrs: PostAttrs): PostDoc;
}
const PostSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    companyName: {
      type: String,
      required: true,
      unique: true,
    },
    imageurl: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    ratingsAverage: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    ratingsCount: {
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
      virtuals: true,
    },
  }
);

PostSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'postId',
  localField: '_id',
});

PostSchema.statics.build = (attrs: PostAttrs) => {
  return new Post(attrs);
};

PostSchema.pre(/^find/, function (next) {
  this.select('-__v');
  this.select('-userId');
  next();
});

const Post = mongoose.model<PostDoc, PostModel>('Post', PostSchema);
export { Post };
