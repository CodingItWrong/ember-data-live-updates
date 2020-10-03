import JSONAPIAdapter from '@ember-data/adapter/json-api';
import { v4 } from 'uuid';

export default class ApplicationAdapter extends JSONAPIAdapter {
  host = 'http://localhost:3000';

  generateIdForRecord() {
    return v4();
  }
}
