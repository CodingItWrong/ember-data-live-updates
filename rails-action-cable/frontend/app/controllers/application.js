import ActionCable from 'actioncable';
import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

const unauthenticatedRoutes = ['user.new'];

const cable = ActionCable.createConsumer('ws://localhost:3000/cable');

export default class ApplicationController extends Controller {
  @service router;
  @service session;
  @service store;

  constructor(...args) {
    super(...args);

    cable.subscriptions.create('TodosChannel', {
      connected() {
        console.log('connected');
      },

      disconnected() {},

      received: rawTodo => {
        this.store.pushPayload({ data: rawTodo });
      },
    });
  }

  get currentRouteIsUnauthenticated() {
    return unauthenticatedRoutes.includes(this.router.currentRouteName);
  }

  get routeRequiresAuthentication() {
    return !this.currentRouteIsUnauthenticated && !this.session.isAuthenticated;
  }

  @action
  handleSignIn() {
    this.transitionToRoute('index');
  }

  @action
  async signOut() {
    this.session.invalidate();
    this.transitionToRoute('index');
  }
}
