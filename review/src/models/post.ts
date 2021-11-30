import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface PostAttrs {
  id: string;
}
interface PostDoc extends mongoose.Document {
  version: number;
}
interface PostModel extends mongoose.Model<PostDoc> {
  build(attrs: PostAttrs): PostDoc;
  findByEvent(event: { id: string; version: number }): Promise<PostDoc | null>;
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
PostSchema.set('versionKey', 'version');
PostSchema.plugin(updateIfCurrentPlugin);

PostSchema.statics.build = (attrs: PostAttrs) => {
  return new Post({
    _id: attrs.id,
  });
};

PostSchema.statics.findByEvent = (event: { id: string; version: number }) => {
  return Post.findOne({
    _id: event.id,
    version: event.version - 1,
  });
};

const Post = mongoose.model<PostDoc, PostModel>('Post', PostSchema);
export { Post };
