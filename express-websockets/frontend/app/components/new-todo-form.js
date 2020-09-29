import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class NewTodoFormComponent extends Component {
  @service store;

  @tracked name;

  @action async add(evt) {
    evt.preventDefault();

    const todo = this.store.createRecord('todo', { name: this.name });

    try {
      await todo.save();
      this.name = '';
    } catch (err) {
      console.error(err);
    }
  }
}
