import { Publisher,PostDeletedEvent, Subjects } from "@suup/common";

export class PostDeletedPublisher extends Publisher<PostDeletedEvent>{
    readonly subject:Subjects.postDeleted=Subjects.postDeleted
}