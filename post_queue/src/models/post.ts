import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
//user id is one among the 3 admins,only they can post new companies
// use enum in userId

interface PostAttrs {
  userId: string;
  companyName: string;
  imageurl: string;
}
interface PostDoc extends mongoose.Document {
  userId: string;
  companyName: string;
  imageurl: string;
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
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
    timestamps: true,
  }
);

PostSchema.statics.build = (attrs: PostAttrs) => {
  return new Post(attrs);
};

PostSchema.pre(/^find/, function (next) {
  this.select('-__v');
  next();
});

const Post = mongoose.model<PostDoc, PostModel>('Post', PostSchema);
export { Post };
