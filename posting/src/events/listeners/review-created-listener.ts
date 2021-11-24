import { Listener, ReviewCreatedEvent, Subjects } from '@suup/common';
import { queueGroupName } from './queue-group-name';
import { Message } from 'node-nats-streaming';
import { Review } from '../../models/review';

export class ReviewCreatedListener extends Listener<ReviewCreatedEvent> {
  readonly subject: Subjects.reviewCreated = Subjects.reviewCreated;
  queueGroupName = queueGroupName;
  async onMessage(data: ReviewCreatedEvent['data'], msg: Message) {
    const { id, userId, postId, title, description, rating } = data;
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
  }
}
