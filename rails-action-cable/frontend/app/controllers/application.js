import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import ActionCable from 'actioncable';

export default class ApplicationController extends Controller {
  @service store;

  constructor(...args) {
    super(...args);

    this.cable = ActionCable.createConsumer('ws://localhost:3000/cable');

    this.cable.subscriptions.create('TodosChannel', {
      connected: () => {
        console.log('connected');
      },

      disconnected: () => {
        console.log('disconnected');
      },

      received: todo => {
        console.log('received', todo);
        this.store.pushPayload({ data: todo });
      }
    });
  }
}
