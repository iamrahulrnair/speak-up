import mongoose from "mongoose";

interface PostAttrs {
  id: string;
}
interface PostDoc extends mongoose.Document {
  version: number;
}
interface PostModel extends mongoose.Model<PostDoc> {
  build(attrs: PostAttrs): PostDoc;
}

const PostSchema = new mongoose.Schema(
  {},
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

PostSchema.statics.build = (attrs: PostAttrs) => {
  return new Post({
    _id: attrs.id,
  });
};

const Post = mongoose.model<PostDoc, PostModel>("Post", PostSchema);
export { Post };
