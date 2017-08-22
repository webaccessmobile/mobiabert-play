export default function NavbarController($user, $util, $state, $modal, $auth) {
  "ngInject";

  const $ctrl = this;
  $ctrl.isIdentified = $user.isIdentified;
  $ctrl.getImgSrc = $util.getImageURL;
  $ctrl.profile = $user.getProfile;

  $ctrl.login = () => $modal.open(`<mp-login></mp-login>`);
  $ctrl.logout = () => {
    $auth.reset();
    $user.reset();
  };

  $ctrl.goProfile = id => $state.go('profile', {id: $ctrl.profile().id});

}