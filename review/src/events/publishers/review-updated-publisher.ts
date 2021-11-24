import { Publisher, Subjects, ReviewUpdatedEvent } from '@suup/common';

export class ReviewUpdatedPublisher extends Publisher<ReviewUpdatedEvent> {
  readonly subject = Subjects.reviewUpdated;
}
