import { Publisher, Subjects, ReviewDeletedEvent } from '@suup/common';

export class ReviewDeletedPublisher extends Publisher<ReviewDeletedEvent> {
  readonly subject = Subjects.reviewDeleted;
}
