import Application from 'live-updates-frontend/app';
import config from 'live-updates-frontend/config/environment';
import { setApplication } from '@ember/test-helpers';
import { start } from 'ember-qunit';

setApplication(Application.create(config.APP));

start();
