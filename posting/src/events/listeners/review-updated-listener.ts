import {
  Listener,
  NotFoundError,
  ReviewUpdatedEvent,
  Subjects,
} from '@suup/common';
import { queueGroupName } from './queue-group-name';
import { Message } from 'node-nats-streaming';
import { Review } from '../../models/review';

export class ReviewUpdatedListener extends Listener<ReviewUpdatedEvent> {
  readonly subject: Subjects.reviewUpdated = Subjects.reviewUpdated;
  queueGroupName = queueGroupName;
  async onMessage(data: ReviewUpdatedEvent['data'], msg: Message) {
    const { id, title, description, rating, version } = data;
    const review = await Review.findByEvent({ id, version });

    if (!review) throw new NotFoundError();
    if (typeof title !== 'undefined') review.set({ title });
    if (typeof description !== 'undefined') review.set({ description });
    if (typeof rating !== 'undefined') review.set({ rating });

    await review.save();
    msg.ack();
  }
}
