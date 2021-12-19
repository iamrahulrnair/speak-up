import nats, { Stan } from 'node-nats-streaming';

class NatsWrapper {
  private _client?: Stan;
  get client() {
    if (!this._client) {
      throw new Error('client spawn failed! did you connected?');
    }
    return this._client;
  }
  connect(clusterId: string, clientId: string, url: string): Promise<void> {
    this._client = nats.connect(clusterId, clientId, { url });
    return new Promise<void>((resolve, reject) => {
      this._client!.on('connect', () => {
        console.log('connected to nats');
        resolve();
      });
      this._client!.on('error', (err) => {
        console.log('error');
        reject(err);
      });
    });
  }
}
export const natsWrapper = new NatsWrapper();
