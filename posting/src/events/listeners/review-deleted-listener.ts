import { Listener, ReviewDeletedEvent, Subjects } from "@suup/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Review } from "../../models/review";

export class ReviewDeletedListener extends Listener<ReviewDeletedEvent> {
  readonly subject: Subjects.reviewDeleted = Subjects.reviewDeleted;
  queueGroupName = queueGroupName;
  async onMessage(data: ReviewDeletedEvent["data"], msg: Message) {
    const { id } = data;
    await Review.findByIdAndDelete(id);
    msg.ack();
  }
}
