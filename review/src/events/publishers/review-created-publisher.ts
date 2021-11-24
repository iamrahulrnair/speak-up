import { Publisher, Subjects, ReviewCreatedEvent } from '@suup/common';

export class ReviewCreatedPublisher extends Publisher<ReviewCreatedEvent> {
  readonly subject = Subjects.reviewCreated;
}
