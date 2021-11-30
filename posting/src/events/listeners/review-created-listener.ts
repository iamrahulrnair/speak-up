import {
  BadRequestError,
  Listener,
  ReviewCreatedEvent,
  Subjects,
} from '@suup/common';
import { queueGroupName } from './queue-group-name';
import { Message } from 'node-nats-streaming';
import { Review } from '../../models/review';
import { Post } from '../../models/post';

export class ReviewCreatedListener extends Listener<ReviewCreatedEvent> {
  readonly subject: Subjects.reviewCreated = Subjects.reviewCreated;
  queueGroupName = queueGroupName;
  async onMessage(data: ReviewCreatedEvent['data'], msg: Message) {
    try {
      const { id, userId, postId, title, description, rating } = data;
      const _check = await Post.exists({ _id: postId });
      if (!_check) throw new BadRequestError('Cannot review anonymous posts');
      const review = await Review.build({
        id,
        userId,
        postId,
        title,
        description,
        rating,
      });
      await review.save();
      msg.ack();
    } catch (err) {
      console.log(err);
    }
  }
}
