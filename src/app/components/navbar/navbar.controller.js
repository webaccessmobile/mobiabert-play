export default function NavbarController($user, $util, $state, $modal, $auth, $window) {
  "ngInject";

  const $ctrl = this;
  $ctrl.isIdentified = $user.isIdentified;
  $ctrl.getImgSrc = $util.getImageURL;
  $ctrl.getProfile = $user.getProfile;

  $ctrl.$onInit = () => {
    $user.getIdentify().then(
      response => {
        $user.setProfile(response.data.data);   
        $user.checkUser(response.data.data);
      },
      response => {
        var profileId = $window.localStorage.getItem('profileId');
        if (profileId) {
          $user.getUser(profileId)
            .then(
              response => {
                $user.setProfile(response.data.data);
                $user.checkUser(response.data.data);
              },
              error => $ctrl.error = error);
        }
      }
    );
  }

  $ctrl.login = () => $modal.open(`<mp-login></mp-login>`);
  $ctrl.logout = () => {
    $auth.reset();
    $user.reset();
  };
  $ctrl.register = () => $modal.open(`<mp-register></mp-register>`);
  $ctrl.goEdit = () => $state.go('user');
  $ctrl.goProfile = () => $state.go('profile', {id: $ctrl.getProfile().id});

}