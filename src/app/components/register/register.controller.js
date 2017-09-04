import * as firebase from "firebase";

function RegisterController($scope, $state, $user, $modal, $timeout) {
  "ngInject";

  const $ctrl = this;
  let sleep = 2000;

  $ctrl.user = {
    name: null,
    email: null,
    password: null
  };
  $ctrl.confirmPassword = undefined;
  $ctrl.error = undefined;
  $ctrl.success = undefined;

  $ctrl.register = () => {
    if (validForm()) {
      $user.createUser($ctrl.user).then(
          response => {
            $ctrl.success = "Registro cadastrado com sucesso!";
            $timeout(close, sleep);
          },
          error => $ctrl.error = error.data.error.message
        );
    }
  }

  let close = () => {
    $modal.close();
    $state.go('home');
  }

  let validForm = () => {
    $ctrl.error = undefined;
    if (!$ctrl.user.name) {
      if (!$ctrl.error) $ctrl.error = '';
      $ctrl.error += '\nPreencha o nome';
    }
    if (!$ctrl.user.email) {
      if (!$ctrl.error) $ctrl.error = '';
      $ctrl.error += '\nPreencha o e-mail';
    }
    if (!$ctrl.user.password) {
      if (!$ctrl.error) $ctrl.error = '';
      $ctrl.error += '\nPreencha a senha';
    }
    if (!$ctrl.confirmPassword || $ctrl.confirmPassword != $ctrl.user.password) {
      if (!$ctrl.error) $ctrl.error = '';
      $ctrl.error += '\nSenha não confirmada';
    }
    return !$ctrl.error;
  }
}

export default RegisterController;