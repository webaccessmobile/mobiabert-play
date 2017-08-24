import angular from 'angular';
import auth from './auth.factory';
import user from './user.factory';
import modal from './modal.factory';
import api from './api.factory';
import util from './util.factory';
import feed from './feed.factory';
import profile from './profile.factory';
import radio from './radio.factory';

export default angular.module('app.services', [])

.factory('$auth', auth)
.factory('$user', user)
.factory('$api', api)
.factory('$modal', modal)
.factory('$util', util)
.factory('$feed', feed)
.factory('$profile', profile)
.factory('$radio', radio)

.name;
