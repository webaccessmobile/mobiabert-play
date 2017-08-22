export default function ModalFactory ($controller, $document, $compile, $rootScope, $timeout, $animate) {
  "ngInject";

  let
    modal, element, scope,
    body = $document.find('body'),
    container = angular.element(`<div class= "modal-container"></div>`),
    state = 'idle';

  container.on('click', event => {
    if (container.get(0) == event.target)
      scope.$apply(close);
  });

  return {
    open: (template, locals = {}) => {
      if (state != 'idle') return;

      state = 'entering';
      scope = angular.extend($rootScope.$new(true), locals);
      modal = $compile(`<div class="modal-content">${template}</div>`);

      body.addClass('with-modal');
      body.prepend(container);

      element = modal(scope);

      $animate.enter(element, container)
        .then(() => {
          state = 'open';
        });
    },
    close: close
  }

  function close () {
    if (state != 'open') return;
    state = 'leaving';

    $animate.leave(element).then(() => {
      state = 'idle';
      body.removeClass('with-modal');
      container.detach();
    });
  }
}