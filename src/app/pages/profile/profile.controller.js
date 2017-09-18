function ProfileController($state, $url, $util, $user, $profile, $radio, $http, $q, $modal, $anchorScroll) {
  "ngInject";

  const $ctrl = this;
  $ctrl.getImageURL = $util.getImageURL;
  $ctrl.getFileURL = $util.getFileURL;
  $ctrl.isIdentified = $user.isIdentified;
  $ctrl.pageSize = 5;
  $ctrl.tab = 'wall';
  $ctrl.followingPageNumber = 1;
  $ctrl.followersPageNumber = 1;
  $ctrl.postsPage = 1;
  $ctrl.reviewsPage = 1;
  $ctrl.favoritePageNumber = 1;
  $ctrl.historyPageNumber = 1;
  $ctrl.followingState = undefined;
  $ctrl.followersState = undefined;
  $ctrl.favoriteState = undefined;
  $ctrl.historyState = undefined;
  $ctrl.postsState = 'idle';
  $ctrl.reviewsState = 'idle';

  $ctrl.$onInit = () => {

    $ctrl.profile = $user.getProfile();
    $ctrl.isProfile = false;
    if ($ctrl.profile) {
      $ctrl.isProfile = $ctrl.profile.id == $state.params.id;
      $user.checkUser($ctrl.profile);
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
    $http.get(`${$url}/app/user/${$ctrl.usuario.id}/following?pageSize=${$ctrl.pageSize}&pageNumber=0`)
      .then(response => {
        $ctrl.following = response.data.data.records;
        $ctrl.followingState = 'idle';
      });
    $http.get(`${$url}/app/user/${$ctrl.usuario.id}/followers?pageSize=${$ctrl.pageSize}&pageNumber=0`)
      .then(response => {
        $ctrl.followers = response.data.data.records;
        $ctrl.followersState = 'idle';
      });
    $http.get(`${$url}/app/user/${$ctrl.usuario.id}/posts?pageSize=${$ctrl.pageSize}&pageNumber=0`)
      .then(response => {
        $ctrl.posts = response.data.data.records;
        $ctrl.postsState = 'idle';
      });
    $http.get(`${$url}/app/user/${$ctrl.usuario.id}/reviews?pageSize=${$ctrl.pageSize}&pageNumber=0`)
      .then(response => {
        $ctrl.reviews = response.data.data.records;
        $ctrl.reviewsState = 'idle';
      });
    $http.get(`${$url}/app/station/userfavorites?userId=${$ctrl.usuario.id}&pageSize=${$ctrl.pageSize}&pageNumber=0`)
      .then(response => {
        $ctrl.favoriteStations = response.data.data.records;
        $ctrl.favoriteState = 'idle';
      });
    $http.get(`${$url}/app/user/stationhistory?pageSize=${$ctrl.pageSize}&pageNumber=0`)
      .then(response => {
        $ctrl.history = response.data.data.records;
        $ctrl.historyState = 'idle';
      });
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

  $ctrl.loadMorePosts = () => {
    if ($ctrl.postsState != 'idle' || !$ctrl.usuario) return;
    $ctrl.postsState = 'working';

    $profile.posts.get({ id: $ctrl.usuario.id, pageSize: $ctrl.pageSize, pageNumber: $ctrl.postsPage })
      .$promise.then(response => {
        if (response.data.records && response.data.records.length > 0) {
          if (!$ctrl.posts) $ctrl.posts = [];
          var temp = response.data.records;
          for (var p in temp) {
            let post = temp[p];
            $radio.comments.get({ id: post.id, pageSize: $ctrl.pageSize, pageNumber: 0 })
              .$promise.then(response => {
                post.comments = response.data.records;
              });
          }
          $ctrl.posts = $ctrl.posts.concat(temp);
          $ctrl.postsState = 'idle';
          $ctrl.postsPage++;
        } else {
          $ctrl.postsState = 'no-more-content';
        }
      });
  };

  $ctrl.loadMoreReviews = () => {
    if ($ctrl.reviewsState != 'idle' || !$ctrl.usuario) return;
    $ctrl.reviewsState = 'working';

    $profile.reviews.get({ id: $ctrl.usuario.id, pageSize: $ctrl.pageSize, pageNumber: $ctrl.reviewsPage })
      .$promise.then(response => {
        if (response.data && response.data.length > 0) {
          if (!$ctrl.reviews) $ctrl.reviews = [];
          $ctrl.reviews = $ctrl.reviews.concat(response.data);
          $ctrl.reviewsState = 'idle';
          $ctrl.reviewsPage++;
        } else {
          $ctrl.reviewsState = 'no-more-content';
        }
      });
  };

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

  $ctrl.follow = () => {
    if ($ctrl.usuario) {
      if ($ctrl.usuario.following) {
        $http.delete(`${$url}/app/user/${$ctrl.usuario.id}/follow`)
        .then(response => {
          $ctrl.usuario.following = false;
          load();
        });
      }
      else {
        $http.put(`${$url}/app/user/${$ctrl.usuario.id}/follow`)
        .then(response => {
          $ctrl.usuario.following = true;
          load();
        });
      }
    } 
  }

  $ctrl.pesquisar = (name) => {
    $modal.open(`<mp-user-results term=${name}></mp-user-results>`)
  }

  $ctrl.selectTab = tab => {
    if ($ctrl.tab == tab) return;
    $ctrl.tab = tab;
  };

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

  $ctrl.goToProfile = (id) => {
    $anchorScroll();
    $state.go('profile', { id: id });
  };
};

export default ProfileController;