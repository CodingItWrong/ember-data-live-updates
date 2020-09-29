import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

const unauthenticatedRoutes = ['user.new'];

let socket;

export default class ApplicationController extends Controller {
  @service router;
  @service session;
  @service store;

  constructor(...args) {
    super(...args);

    socket = new WebSocket('ws://localhost:3000');
    console.log('attempting connection');

    socket.onopen = () => {
      console.log('successfully connected');
    };

    socket.onclose = event => {
      console.log('socket closed connection', event);
      socket = null;
    };

    socket.onerror = error => {
      console.log('socket error', error);
    };

    socket.onmessage = event => {
      const rawTodo = JSON.parse(event.data);
      console.log({ rawTodo });
      // TIMING ISSUE: uuids could help

      // set timeout to wait for http response first
      setTimeout(() => {
        const record = this.store.peekRecord('todo', rawTodo.data.id);
        console.log({record});
        if (!record) {
          this.store.pushPayload(rawTodo);
        }
      });
    };
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
