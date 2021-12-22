## speakUP

This will be the backend services for **speakUP** . An Application which provides a platform for users to speakup against an organization.This backend for speakUP is backed by currently 3 services ( which i am planning to add 2 more services ). The authenticity of Reviews posted will be determined by an upvote downvote system similar to **Stackoverflow's**. This application addresses  data consistency with optimistic concurreny control and interservice communication is made possible with  [nats-straming-server](https://github.com/nats-io/nats-streaming-server). 

 - [ ] Want to know how to get started? [click here]()<br>
 - [ ] Interested to work together with me, go through the code, find a bug / bad code / any optimization, [Raise an issue](https://github.com/iamrahulrnair/speak-up/issues)

> speakUP is still a **work** in progress 🙂

Read More about,
> [Authentication service](https://github.com/iamrahulrnair/speak-up/tree/main/auth)
> 
> [Post Queue Service for admins](https://github.com/iamrahulrnair/speak-up/tree/main/post_queue)
> 
> [Posts Service](https://github.com/iamrahulrnair/speak-up/tree/main/posting)
>
> [Review Service](https://github.com/iamrahulrnair/speak-up/tree/main/review)

### Local setup:-

To Run this api services locally, make sure:
1. Docker is installed
2. The pods must be managed via kubernetes
3. install skaffold for managing kubernetes cluster more easily.
4. **cd /speak-up && skaffold dev**
5. Make sure the relvant ENV variables are configured properly eg: JWT_KEY in all deployment configurations, eg:

> kubectl create secret generics jwt-secret --from-literal=JWT_KEY=YOURSECRET.com 

<hr>

<div align="center">
 Check out<a href="https://github.com/iamrahulrnair/speak-up_client"> speakUP client </a> here
</div>
