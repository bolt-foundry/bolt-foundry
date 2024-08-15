import { BfNode } from "packages/bfDb/coreModels/BfNode.ts";

type BfNotificationSubscriptionRequiredProps = {
  googleResourceUri: string,
  googleAccessToken: string,
  status: string,
  expiration: number,
}

export class BfNotificationSubscription extends BfNode<BfNotificationSubscriptionRequiredProps> {

  afterCreate() {
    this.subscribeToGoogle();
    //modify status based on result, or kill the whole thing idk.
  }

  //need to implement in Model
  afterDelete() {
    this.unsubscribeFromGoogle();
  }

  async subscribeToGoogle() {
    const url = `https://www.googleapis.com/drive/v3/files/${this.resourceId}/watch`;
    const payload = {
      id: 'unique-channel-id-333333',  // Your unique channel ID
      type: 'web_hook',
      address: 'https://3761a1ed-8bad-41d2-bbbd-07e446cba0d5-00-1ufeqn8lflt0u.riker.replit.dev/google/drive/webhook',
      // Optional: Your channel token
      expiration: this.expiration,  // Optional: Unix timestamp for expiration date and time (in milliseconds)
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Folder subscription successful:', data);
    } catch (error) {
      console.error('Error subscribing to folder notifications:', error);
    }
  }

  unsubscribeFromGoogle() {
    //like you actually expected there to be anything here lol.
    return;
  }
  
  
}