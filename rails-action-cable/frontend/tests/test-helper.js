import Application from 'ember-data-action-cable/app';
import config from 'ember-data-action-cable/config/environment';
import { setApplication } from '@ember/test-helpers';
import { start } from 'ember-qunit';

setApplication(Application.create(config.APP));

start();
