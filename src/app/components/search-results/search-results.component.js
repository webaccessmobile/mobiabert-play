import template from './search-results.html';
import controller from './search-results.controller';
import './search-results.scss';

export default {
  bindings: {
    term: '@',
    total: '@',
    type: '@',
    radios: '<'
  },
  template,
  controller
};
