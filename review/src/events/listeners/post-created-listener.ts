import { Listener, PostCreatedEvent, Subjects } from '@suup/common';
import { Message } from 'node-nats-streaming';
import { Post } from '../../models/post';
import { queueGroupName } from './queue-group-name';

export class PostCreatedListener extends Listener<PostCreatedEvent> {
  readonly subject: Subjects.postCreated = Subjects.postCreated;
  queueGroupName = queueGroupName;
  async onMessage(data: PostCreatedEvent['data'], msg: Message) {
    const { id } = data;
    const post = await Post.build({
      id,
    });
    await post.save();
    msg.ack();
  }
}
