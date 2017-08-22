export default function PlayDirective ($rootScope) {
  "ngInject";
  return {
    restrict: 'A',
    link: function (scope, elem, attr) {
      elem.on('click', event => {
        $rootScope.$broadcast('play', scope[attr.mpPlay]);
      });
    }
  };
}