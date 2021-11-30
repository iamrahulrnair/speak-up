import { Listener, PostDeletedEvent, Subjects } from '@suup/common';
import { Message } from 'node-nats-streaming';
import { Review } from '../../models/review';
import { queueGroupName } from './queue-group-name';

export class PostDeletedListener extends Listener<PostDeletedEvent> {
  readonly subject: Subjects.postDeleted = Subjects.postDeleted;
  queueGroupName = queueGroupName;
  async onMessage(data: PostDeletedEvent['data'], msg: Message) {
    const { id } = data;
    await Review.deleteMany({
      id,
    });
    msg.ack();
  }
}
