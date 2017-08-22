function ProfileController($state, $url, $util, $user, $profile, $http, $q, $anchorScroll) {
  "ngInject";

  const $ctrl = this;
  $ctrl.getImageURL = $util.getImageURL;
  $ctrl.isIdentified = $user.isIdentified;
  $ctrl.pageSize = 10;

  $ctrl.followingPageNumber = 1;
  $ctrl.followingState = 'idle';
  $ctrl.followersPageNumber = 1;
  $ctrl.followersState = 'idle';
  $ctrl.favoritePageNumber = 1;
  $ctrl.favoriteState = 'idle';
  $ctrl.historyPageNumber = 1;
  $ctrl.historyState = 'idle';

  $ctrl.$onInit = () => {

    $ctrl.profile = $user.getProfile();
    $ctrl.isProfile = false;
    if ($ctrl.profile) {
      $ctrl.isProfile = $ctrl.profile.id == $state.params.id;
    }

    $user.getUser($state.params.id)
      .then(response => {
        $ctrl.usuario = response.data.data;
        if ($ctrl.usuario) {
          load();
        }
      })
      .catch(error => {
        $ctrl.usuario = angular.copy($ctrl.profile);
        if ($ctrl.usuario) {
          load();
        }
      });
  }

  let load = () => {
    $http.get(`${$url}/app/user/${$ctrl.usuario.id}/following?id=${$ctrl.usuario.id}&pageSize=${$ctrl.pageSize}&pageNumber=0`)
      .then(response => $ctrl.following = response.data.data.records);
    $http.get(`${$url}/app/user/${$ctrl.usuario.id}/followers?id=${$ctrl.usuario.id}&pageSize=${$ctrl.pageSize}&pageNumber=0`)
      .then(response => $ctrl.followers = response.data.data.records);
    $http.get(`${$url}/app/station/userfavorites?userId=${$ctrl.usuario.id}&pageSize=${$ctrl.pageSize}&pageNumber=0`)
      .then(response => $ctrl.favoriteStations = response.data.data.records);
    $http.get(`${$url}/app/user/stationhistory?pageSize=${$ctrl.pageSize}&pageNumber=0`)
      .then(response => $ctrl.history = response.data.data.records);
  }

  $ctrl.loadMoreFollowing = () => {
    if ($ctrl.followingState != 'idle' || !$ctrl.usuario) return;
    $ctrl.followingState = 'working';
    $http.get(`${$url}/app/user/${$ctrl.usuario.id}/following`, { params: { id: $ctrl.usuario.id, pageSize: $ctrl.pageSize, pageNumber: $ctrl.followingPageNumber } })
      .then(following => {
        if (following.data.data.records) {
          if (!$ctrl.following) {
            $ctrl.following = [];
          }
          $ctrl.following = $ctrl.following.concat(following.data.data.records);
          $ctrl.followingState = 'idle';
          $ctrl.followingPageNumber++;
        } else {
          $ctrl.followingState = 'no-more-content';
        }
      });
  }

  $ctrl.loadMoreFollowers = () => {
    if ($ctrl.followersState != 'idle' || !$ctrl.usuario) return;
    $ctrl.followersState = 'working';
    $http.get(`${$url}/app/user/${$ctrl.usuario.id}/followers`, { params: { id: $ctrl.usuario.id, pageSize: $ctrl.pageSize, pageNumber: $ctrl.followersPageNumber } })
      .then(followers => {
        if (followers.data.data.records) {
          if (!$ctrl.followers) {
            $ctrl.followers = [];
          }
          $ctrl.followers = $ctrl.followers.concat(followers.data.data.records);
          $ctrl.followersState = 'idle';
          $ctrl.followersPageNumber++;
        } else {
          $ctrl.followersState = 'no-more-content';
        }
      });
  }

  $ctrl.loadMoreFavorite = () => {
    if ($ctrl.favoriteState != 'idle' || !$ctrl.usuario) return;
    $ctrl.favoriteState = 'working';
    $http.get(`${$url}/app/station/userfavorites?userId=${$ctrl.usuario.id}&pageNumber=${$ctrl.favoritePageNumber}&pageSize=${$ctrl.pageSize}`)
      .then(response => {
        if (response.data.data.records) {          
          if (!$ctrl.favoriteStations) {
            $ctrl.favoriteStations = [];
          }
          $ctrl.favoriteStations = $ctrl.favoriteStations.concat(response.data.data.records);
          $ctrl.favoriteState = 'idle';
          $ctrl.favoritePageNumber++;

          response.data.data.records.forEach(radio => {
            radio.socials = $http.get(`${$url}/stationunit/socialnetwork/search?station=${radio.id}`);
          });
        }
        else {
          $ctrl.favoriteState = 'no-more-content';
        }
      });
  }

  $ctrl.loadMoreHistory = () => {
    if ($ctrl.historyState != 'idle' || !($ctrl.usuario && $ctrl.isProfile)) return;
    $ctrl.historyState = 'working';
    $http.get(`${$url}/app/user/stationhistory?pageNumber=${$ctrl.historyPageNumber}&pageSize=${$ctrl.pageSize}`)
      .then(response => {
        if (response.data.data.records) {
          if (!$ctrl.history) {
            $ctrl.history = [];
          }
          $ctrl.history = $ctrl.history.concat(response.data.data.records);
          $ctrl.historyState = 'idle';
          $ctrl.historyPageNumber++;
        }
        else {
          $ctrl.historyState = 'no-more-content';
        }
      });
  }

  $ctrl.favoriteFavoriteStations = (radio) => {
    $ctrl.favorite(radio, $ctrl.favoriteStations);
  }

  $ctrl.favoriteHistory = (radio) => {
    $ctrl.favorite(radio, $ctrl.history);
  }

  $ctrl.favorite = (radio, list) => {
    var _radio;
    for (var r in list) {
      if (list[r].id == radio.id) {
        _radio = list[r];
        break;
      }
    }
    if (radio.favorite) {
      $profile.unfavoritestation(radio);
      _radio.favorite = radio.likes - 1;
      _radio.favorite = false;
    }
    else {
      $profile.favoritestation(radio);
      _radio.favorite = radio.likes + 1;
      _radio.favorite = true;
    }
  }

  $ctrl.goToRadio = id => {
    $anchorScroll();
    $state.go('radio', { radioId: id });
  };

  $ctrl.goToProfile = id => {
    $anchorScroll();
    $state.go('profile', { id: id });
  };
};

export default ProfileController;