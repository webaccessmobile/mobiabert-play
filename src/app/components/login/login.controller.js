import * as firebase from "firebase";

function LoginController($scope, $auth, $user, $state, $modal, $profile) {
  "ngInject";

  const $ctrl = this;

  $ctrl.login = (token) => {
    $auth.setToken(token);    
    $user.getIdentify().then(
      response => {
        $user.setProfile(response.data.data);    
        $modal.close();
        $state.go('home');
      },
      response => $ctrl.error = response.data.error.message
    );
  }

  $ctrl.authorize = (username, password) => {
    $ctrl.error = undefined;
    if (username && password) {
      $auth.autenticatenative(username, password).then(
        response => $ctrl.login(response.data.data),
        response => $ctrl.error = response.data.error.message
      );
    }
  }

  $ctrl.auth = provider => {
    $ctrl.error = undefined;
    $scope.loading = true;
    firebase.auth().signInWithPopup(provider).then(
      result => {        
        result.user.getIdToken(false).then(
          token => {
            $auth.authorize(token).then(
              response => {$ctrl.login(response.data.data); $scope.loading = true;},
                 error => {$ctrl.error = error.data.error.message; $scope.loading = true;}
            );
        })
      })
      .catch(error => {$ctrl.error = error.message; $scope.loading = true;});
  }
  
  var facebookAuthProvider = new firebase.auth.FacebookAuthProvider();

  $ctrl.FBAutheticate = () => {
    $ctrl.auth(facebookAuthProvider);
  }
  
  var googleAuthProvider = new firebase.auth.GoogleAuthProvider();

  $ctrl.GoogleAutheticate = () => {
    $ctrl.auth(googleAuthProvider);
  }
}

export default LoginController;