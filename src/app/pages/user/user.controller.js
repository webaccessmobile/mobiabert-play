function UserController($http, $url, $util, $user, Upload, $anchorScroll, $state, $timeout) {
  "ngInject";

  const $ctrl = this;
  $ctrl.getImageURL = $util.getImageURL;
  $ctrl.getFileURL = $util.getFileURL;
  $ctrl.showPassword = false;

  let
    citys = [];

  $ctrl.picture = {
    valid: null,
    invalid: null,
    progress: 0
  };
  $ctrl.state = 'idle';

  $http.get(`${$url}/address/state/containingstation`)
    .then(response => {
      $ctrl.states = [];
      if (response.data.data) {
        for (var i in response.data.data) {
          var state = response.data.data[i];
          $ctrl.states.push({
            value: state.id,
            label: state.name
          });
        }
      }
    });

  $ctrl.$onInit = () => {
    let profile = $user.getProfile();
    if (profile) {
      $user.getUser(profile.id)
        .then(response => {
          $ctrl.user = response.data.data;
          $ctrl.user.birthdate = new Date($ctrl.user.birthdate);
          $ctrl.confirmPassword = $ctrl.user.password;
          if ($ctrl.user.city) {
            $ctrl.city = $ctrl.user.city.id;
            $ctrl.state = $ctrl.user.city.state.id;
            $ctrl.loadCitys();
          }
        })
        .catch(error => {
          console.log(error);
          $anchorScroll();
          $state.go('home');
        });
    }
    else {
      $anchorScroll();
      $state.go('home');
    }
  }

  $ctrl.loadCitys = () => {
    $http.get(`${$url}/address/city/containingstation?stateid=${$ctrl.state}`)
      .then(response => {
        $ctrl.citys = [];
        citys = response.data.data;
        if (response.data.data) {
          for (var i in response.data.data) {
            var city = response.data.data[i];
            $ctrl.citys.push({
              value: city.id,
              label: city.name
            });
          }
        }
      });
  }

  $ctrl.setCity = () => {
    for (var i in citys) {
      var city = citys[i];
      if (city.id == $ctrl.city) {
        $ctrl.user.city = city;
        break;
      }
    }
  }

  $ctrl.validPassword = () => {    
    if ($ctrl.confirmPassword != $ctrl.user.password) {
      $ctrl.error = 'Senha não confirmada';   
      $timeout(()=>{
        $ctrl.error = undefined;
      }, 3000);
      return false;
    }
    return true;
  }

  $ctrl.save = () => {
    $ctrl.setCity();
    if ($ctrl.picture.valid) {
      $ctrl.state = 'uploading';
      let params = {
        url: `${$url}/image/upload`,
        data: {
          attachment: $ctrl.picture.valid,
          action: 'upload'
        }
      };
      Upload.upload(params).then(
        response => {
          let image = response.data.data;
          $ctrl.state = 'finishing';
          $ctrl.user.image = image;
          $ctrl.updateUser($ctrl.user);
        },
        response => {
          $ctrl.state = 'idle';
        },
        event => $ctrl.picture.progress = parseInt(100.0 * event.loaded / event.total)
      );
    } else {
      $ctrl.updateUser($ctrl.user);
    }
  }

  $ctrl.updateUser = (user) => {
    if (user) {
      if (user.birthdate) {
        var date = 
          user.birthdate.getFullYear() + "-" + 
          (user.birthdate.getMonth() < 10 ? ('0'+user.birthdate.getMonth()) : user.birthdate.getMonth()) + "-" +
          user.birthdate.getDate() +
          'T00:00:00-0300';
        user.birthdate = date;
      }
      $user.updateUser(user).then(
        response => {
          $ctrl.info = "Usuário atualizado com sucesso";  
          $user.setProfile(user);
          $timeout(()=>{
            $anchorScroll();
            $state.go('user');
          }, 3000);
        },
        error => {              
          $ctrl.error = error;   
          $timeout(()=>{
            $ctrl.error = undefined;
          }, 3000);
        }
      );
    }
  }
};

export default UserController;