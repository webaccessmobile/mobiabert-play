import angular from 'angular';
import pagination from './pagination.directive';
import play from './play.directive';

export default angular.module('app.directives', [])

.directive('mpPagination', pagination)
.directive('mpPlay', play)

.name;