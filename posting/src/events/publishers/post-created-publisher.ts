import { Publisher, PostCreatedEvent, Subjects } from '@suup/common';

export class PostCreatedEventPublisher extends Publisher<PostCreatedEvent> {
  readonly subject: Subjects.postCreated = Subjects.postCreated;
}
